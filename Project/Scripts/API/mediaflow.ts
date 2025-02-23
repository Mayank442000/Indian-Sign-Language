import { Camera } from "@mediapipe/camera_utils";
import { initMidiaPipe, mediaPipeOnGetFrame, logMediapipGLOBAL } from "./mediapipe";
import { AllModeDataType, AllModelsInitData, facing, globalMediaPipeType, predDataTyp, landmarkVect, ArraylandmarkVect } from "./types";
import { TensorflowHandle } from "./tensorflow";
import allPaths from "../../allPaths";
import { sleep } from "../General/general";
import cutOffs from "./../../Models/predCutOff";
// import path from "path/posix";

class AllModels {
    AlphabetModeData: AllModeDataType;
    currentLetter = "";
    mediapipeData: ArraylandmarkVect | undefined = [[0, 0]];
    tfHandle: TensorflowHandle;
    predData: predDataTyp = {
        pred: -1,
        cutOff: 0.1,
        letter: this.currentLetter,
    };
    countCons = 0;
    frameLimit = 2;
    hajimette = true;
    callBack: (predDataTyp) => void;
    constructor(initData: AllModelsInitData, callBack: (predDataTyp) => void, onOff = true) {
        let facing = ((initData.camStrem.getCapabilities().facingMode?.at(0) === "environment" ? "environment" : "user") ?? "environment") as facing,
            camera = new Camera(initData.rawCamVid, { onFrame: this.onGetFrame, facingMode: facing });
        this.AlphabetModeData = {
            rawCamVid: initData.rawCamVid,
            context2D: initData.context2D,
            camCanvas: initData.camCanvas,
            camStrem: initData.camStrem,
            camera: camera,
            drawPose: Boolean(initData.drawPose),
            drawHands: Boolean(initData.drawHands),
            facing: facing,
            invertNeeded: facing !== "environment",
            camState: false,
            hardwareRating: 1,
        };
        this.callBack = callBack;
        this.tfHandle = new TensorflowHandle();
        camera.start();
        this.cameraStateToggle(true);
        // camera.stop();
    }

    init = async () => {
        await this.tfHandle.init();
        this.AlphabetModeData.hardwareRating = this.tfHandle.rateHardware();
        let mediapipeInitiator = this.AlphabetModeData as globalMediaPipeType;
        await this.cameraStateToggle(true);
        await initMidiaPipe(mediapipeInitiator);
        await this.tfHandle.init();
        this.#firstRun();
        // await getPoseHandsMoving();
        // await this.cameraStateToggle(false);
        console.log("Started the camera : ", this.AlphabetModeData.camera);
    };

    onGetFrame = async () => {
        let canvasElement = this.AlphabetModeData.camCanvas;
        this.AlphabetModeData.context2D.drawImage(this.AlphabetModeData.rawCamVid, 0, 0, canvasElement.width, canvasElement.height);
        if (this.currentLetter) {
            this.countCons++;
            this.mediapipeData = await mediaPipeOnGetFrame();
            // this.countCons = this.countCons % this.frameLimit;
            // if (this.mediapipeData === undefined) return; //console.log("No Hands found");
            if (this.mediapipeData !== undefined) {
                this.countCons = 0;
                this.predData.pred = this.tfHandle.predict([this.mediapipeData])[0];
                // console.log("Prediction : ", this.predData, this.mediapipeData);
                this.callBack(this.predData);
            } else {
                this.callBack({ letter: "404" });
            }
            // await sleep(200);
            // console.log("AllModels.onGetFrame : ", this.mediapipeData);
        }
    };

    cameraStateToggle = async (onOff: boolean | undefined) => {
        if (onOff === true) await this.AlphabetModeData.camera.start();
        else if (onOff === false) await this.AlphabetModeData.camera.stop();
        if (onOff !== undefined) this.AlphabetModeData.camState = onOff; // ?? this.AlphabetModeData.camState;
        return this.AlphabetModeData.camera;
    };

    #getFolder = (letter) => {
        if (letter.length == 1) {
            if (/[a-zA-Z]/.test(letter)) return allPaths.allAlphaModels;
            else return allPaths.allNumbModels;
        } else return allPaths.allWordModels;
    };

    setLetter = async (letter = "") => {
        // console.log("AllModels.setLetter : ", letter);
        if (this.currentLetter !== letter) {
            // console.log("AllModels.setLetter : ", letter);
            this.currentLetter = letter;
            if (letter) {
                let fold = this.#getFolder(letter);
                console.log("AllModels.setLetter : ", letter, fold);
                if (!this.AlphabetModeData.camState) await this.cameraStateToggle(true);
                await this.tfHandle.changeFile(fold + letter + ".tflite");
                console.log("cutOffs : ", cutOffs);
                this.predData = {
                    pred: -1,
                    cutOff: cutOffs[this.currentLetter],
                    letter: this.currentLetter,
                };
            } else await this.cameraStateToggle(false);
        }
    };

    #firstRun = async () => {
        const skipToken = -Math.PI;
        const skipTokenLandMark: landmarkVect = [skipToken, skipToken];
        const fakeMediaPipeData: ArraylandmarkVect = Array(57).fill(skipTokenLandMark);
        await this.tfHandle.predict([fakeMediaPipeData]);
        await mediaPipeOnGetFrame();
    };
}

export { AllModels };
