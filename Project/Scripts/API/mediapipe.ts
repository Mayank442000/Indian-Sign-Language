import { dc, sleep } from "./../General/general.js";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
    landmark,
    mediapipePoseResult,
    multiHandedness,
    mediapipeHandsResult,
    globalMediaPipeType,
    hardwareRating,
    landmarkVect,
    ArraylandmarkVect,
} from "./types.js";
import allPaths from "./../../allPaths";
/*
https://github.com/google/mediapipe/blob/master/docs/solutions/pose.md
https://github.com/google/mediapipe/blob/master/docs/solutions/hands.md
 */

let GLOBAL: globalMediaPipeType;
/* = {
    rawCamVid: undefined,
    context2D: undefined,
    camCanvas: undefined,
    camera: undefined,
}; */

var pose: Pose;
/* = new Pose({
    locateFile: (file) => {
        // console.log("Pose : ", file, `./../Scripts/Lib/Mediapipe/${file}`);
        return `./../Scripts/Lib/Mediapipe/${file}`;
    },
}); */

var hands: Hands;
/*  = new Hands({
    locateFile: (file) => {
        // console.log("Hands : ", file, `./../Scripts/Lib/Mediapipe/${file}`);
        return `./../Scripts/Lib/Mediapipe/${file}`;
    },
}); */

const initMidiaPipe = async (globalInitVar: globalMediaPipeType, onOff = false) => {
    console.log("Started initMidiaPipe : ", globalInitVar);
    if (!globalInitVar) return;
    GLOBAL = globalInitVar as globalMediaPipeType;
    console.log("Mediapipe : ", Hands, Pose);

    GLOBAL.context2D.globalCompositeOperation = "source-over";
    GLOBAL.drawPose = true;
    GLOBAL.drawHands = true;
    GLOBAL.rPoseData = Array(14);
    GLOBAL.rHandsData = Array(42);
    GLOBAL.rMediapipeData = Array(56);
    GLOBAL.skipToken = GLOBAL.skipToken ?? -Math.PI;
    GLOBAL.skipToken3D = [GLOBAL.skipToken, GLOBAL.skipToken];
    // GLOBAL.skipToken3D = [GLOBAL.skipToken, GLOBAL.skipToken, GLOBAL.skipToken];

    GLOBAL.rPoseData.fill(GLOBAL.skipToken3D);
    GLOBAL.rHandsData.fill(GLOBAL.skipToken3D);
    GLOBAL.rMediapipeData.fill(GLOBAL.skipToken3D);

    console.log("Mediapipe.GLOBAL : ", GLOBAL);
    await setPoseHands(GLOBAL.hardwareRating);

    if (GLOBAL.facing === "environment") {
        GLOBAL.invertNeeded = true;
        hands.setOptions({ selfieMode: true });
        pose.setOptions({ selfieMode: true });
    } else {
        GLOBAL.invertNeeded = false;
        hands.setOptions({ selfieMode: false });
        pose.setOptions({ selfieMode: false });
    }
    /* GLOBAL.camera = new Camera(GLOBAL.rawCamVid, {
        onFrame: onGetFrame,
        facingMode: GLOBAL.facing,
    }); */
    // if (onOff) await GLOBAL.camera.start();
    console.log("Mediapipe.GLOBAL : ", GLOBAL);
};

const setPoseHands = async (modelComplexity: hardwareRating) => {
    // console.log(allPaths.mediapipePoseLib, allPaths.mediaPipeHandsLib, allPaths.mediaPipeLib);
    pose = new Pose({
        locateFile: (file) => {
            // console.log("Pose : ", file, allPaths.mediaPipeLib + file);
            return allPaths.mediaPipeLib + file;
            // return `./../Scripts/Lib/Mediapipe/Pose/${file}`;
        },
    });
    hands = new Hands({
        locateFile: (file) => {
            // console.log("Hands : ", file, allPaths.mediaPipeLib + file);
            return allPaths.mediaPipeLib + file;
            // return `./../Scripts/Lib/Mediapipe/Hands/${file}`;
        },
    });

    pose.setOptions({
        selfieMode: true,
        modelComplexity: modelComplexity,
        smoothLandmarks: false,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.8,
        minTrackingConfidence: 0.3,
    });

    hands.setOptions({
        selfieMode: true,
        maxNumHands: 2,
        modelComplexity: Math.min(1, modelComplexity) as 0 | 1,
        minDetectionConfidence: 0.8,
        minTrackingConfidence: 0.3,
    });

    // @ts-ignore
    pose.onResults(onResultsPose);
    // @ts-ignore
    hands.onResults(onResultsHands);

    await getPoseHandsMoving();
};

const onResultsPose = (results: mediapipePoseResult, skipToken3D = GLOBAL.skipToken3D) => {
    if (Object.keys(results) && results.poseLandmarks && results.poseLandmarks.length) {
        // console.log("onResultsPose : ", results);
        if (GLOBAL.drawPose) {
            let canvasCtx = GLOBAL.context2D as CanvasRenderingContext2D,
                canvasElement = GLOBAL.camCanvas as HTMLCanvasElement;
            /* if (!results.poseLandmarks) {
            console.log("no rizz");
            // grid.updateLandmarks([]);
            return;
            } else console.log("rizz : ", results, typeof results); */

            // canvasCtx.save();
            // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            // canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

            // Only overwrite existing pixels.
            // canvasCtx.globalCompositeOperation = "source-in";
            // canvasCtx.fillStyle = "#00FF00";
            // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

            // Only overwrite missing pixels.
            // canvasCtx.globalCompositeOperation = "destination-atop";
            // canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            // canvasCtx.globalCompositeOperation = "source-over";
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 1 });
            // drawLandmarks(canvasCtx, results.poseLandmarks, { color: "#FF0000", lineWidth: 2 });
            // canvasCtx.restore();

            // grid.updateLandmarks(results.poseWorldLandmarks);
        }
        for (let i = 0, j = 11; i < 14; ++i, ++j) GLOBAL.rPoseData[i] = [results.poseLandmarks[j].x, results.poseLandmarks[j].y];
        // GLOBAL.rPoseData[i] = [results.poseLandmarks[j].x, results.poseLandmarks[j].y, results.poseLandmarks[j].z];
        // const rPoseData = results.poseLandmarks.slice(11, 25);
        // return rPoseData;
    } else GLOBAL.rPoseData.fill(skipToken3D);
};

const onResultsHands = (results: mediapipeHandsResult, skipToken3D = GLOBAL.skipToken3D) => {
    if (Object.keys(results) && results.multiHandedness && results.multiHandedness.length) {
        // console.log("onResultsHands : ", results);
        if (GLOBAL.drawHands) {
            // let canvasCtx = GLOBAL.context2D;
            // canvasElement = GLOBAL.camCanvas;
            // canvasCtx.save();
            // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            // canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
            // if (results.multiHandLandmarks.length) {
            for (const landmarks of results.multiHandLandmarks) {
                // @ts-ignore
                drawConnectors(GLOBAL.context2D, landmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 2 });
                // drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 1 });
            }
            // }
            // canvasCtx.restore();
        }
        let rHandsData: ArraylandmarkVect = GLOBAL.rHandsData,
            i: number,
            j: number;
        // l = 0,
        // r = 0;
        // let labelData = results.multiHandLandmarks;
        if (results.multiHandedness[0].label === "Left") {
            for (i = 0; i < 21; ++i) rHandsData[i] = [results.multiHandLandmarks[0][i].x, results.multiHandLandmarks[0][i].y];
            // rHandsData[i] = [results.multiHandLandmarks[0][i].x, results.multiHandLandmarks[0][i].y, results.multiHandLandmarks[0][i].z];
            if (results.multiHandedness[1]?.label === "Right")
                for (i = 0, j = 21; i < 21; ++i, ++j) rHandsData[j] = [results.multiHandLandmarks[1][i].x, results.multiHandLandmarks[1][i].y];
            // rHandsData[j] = [results.multiHandLandmarks[1][i].x, results.multiHandLandmarks[1][i].y, results.multiHandLandmarks[1][i].z];
            else rHandsData.fill(skipToken3D, 21, 42);
        } else if (results.multiHandedness[0]?.label == "Right") {
            for (i = 0, j = 21; i < 21; ++i, ++j) rHandsData[j] = [results.multiHandLandmarks[0][i].x, results.multiHandLandmarks[0][i].y];
            // rHandsData[j] = [results.multiHandLandmarks[0][i].x, results.multiHandLandmarks[0][i].y, results.multiHandLandmarks[0][i].z];
            if (results.multiHandedness[1]?.label === "Left")
                for (i = 0; i < 21; ++i) rHandsData[i] = [results.multiHandLandmarks[1][i].x, results.multiHandLandmarks[1][i].y];
            // rHandsData[i] = [results.multiHandLandmarks[1][i].x, results.multiHandLandmarks[1][i].y, results.multiHandLandmarks[1][i].z];
            else rHandsData.fill(skipToken3D, 0, 21);
        }
        /* if (l == 0) rHandsData.fill([0, 0, 0], 0, 21);
        else if (l == 1)
            for (i = 0; i < 21; ++i)
                rHandsData[i] = [results.multiHandLandmarks[0][i].x, results.multiHandLandmarks[0][i].y, results.multiHandLandmarks[0][i].z];
        else
            for (i = 0; i < 21; ++i)
                rHandsData[i] = [results.multiHandLandmarks[1][i].x, results.multiHandLandmarks[1][i].y, results.multiHandLandmarks[1][i].z];
        if (r == 0) rHandsData.fill([0, 0, 0], 21, 42);
        else if (r == 1)
            for (i = 0, j = 21; i < 21; ++i, ++j)
                rHandsData[j] = [results.multiHandLandmarks[0][i].x, results.multiHandLandmarks[0][i].y, results.multiHandLandmarks[0][i].z];
        else
            for (i = 0, j = 21; i < 21; ++i, ++j)
                rHandsData[j] = [results.multiHandLandmarks[1][i].x, results.multiHandLandmarks[1][i].y, results.multiHandLandmarks[1][i].z]; */
        // console.log("rHandsData : ", rHandsData);
        // GLOBAL.rHandsData = rHandsData;
        // return rHandsData;
    } else GLOBAL.rHandsData.fill(skipToken3D);
};

const mediaPipeOnGetFrame = async (inpData = GLOBAL.rawCamVid, skipToken3D = GLOBAL.skipToken3D) => {
    // console.log("Worked");
    // let canvasCtx = GLOBAL.context2D,
    //     canvasElement = GLOBAL.camCanvas,
    //     videElement = GLOBAL.rawCamVid;
    // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.drawImage(videElement, 0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.scale(-1, 1);
    const imgData = { image: inpData };
    try {
        await hands.send(imgData);
        /* if (
            GLOBAL.rHandsData[0][0] === 0 &&
            GLOBAL.rHandsData[21][0] === 0 &&
            GLOBAL.rHandsData[9][0] === 0 &&
            GLOBAL.rHandsData[30][0] === 0 &&
            GLOBAL.rHandsData[17][0] === 0 &&
            GLOBAL.rHandsData[38][0] === 0
        )
            return undefined; */
        if (
            GLOBAL.rHandsData[0] === skipToken3D &&
            GLOBAL.rHandsData[21] === skipToken3D &&
            GLOBAL.rHandsData[9] === skipToken3D &&
            GLOBAL.rHandsData[30] === skipToken3D &&
            GLOBAL.rHandsData[17] === skipToken3D &&
            GLOBAL.rHandsData[38] === skipToken3D
        )
            return undefined;
        // var ps = pose.send(imgData);
        await pose.send(imgData);
        // await ps;
        // const ps = pose.send(imgData),
        //     hn = hands.send(imgData);
        // await Promise.all([ps, hn]);
        // await Promise.all([pose.send(imgData), hands.send(imgData)]);
    } catch {
        return undefined;
    }
    // console.log(GLOBAL.rHandsData[0][0], GLOBAL.rHandsData[21][0]);
    GLOBAL.rMediapipeData = GLOBAL.rHandsData.concat(GLOBAL.rPoseData);
    GLOBAL.rMediapipeData.push(skipToken3D);
    // console.log("\nrPoseData : ", GLOBAL.rPoseData, "\nrHandsData : ", GLOBAL.rHandsData, "\nrMediapipeData", GLOBAL.rMediapipeData);
    // console.log("\nrMediapipeData", GLOBAL.rMediapipeData);
    // await sleep(500);
    return GLOBAL.rMediapipeData;
};

/* const mediapipeCamera = async (onOff: boolean) => {
    if (onOff) await GLOBAL.camera.start();
    else await GLOBAL.camera.stop();
}; */

const logMediapipGLOBAL = () => {
    console.log("logMediapipGLOBAL : ", GLOBAL);
};

const getPoseHandsMoving = async () => {
    try {
        console.log("Trying to initialize Pose & Hands for : ", i, " time");
        await Promise.all([hands.initialize(), pose.initialize()]);
    } catch {}
    // for (let i = 0; i < 5; ++i) {
    //     try {
    //         console.log("Trying to initialize Pose & Hands for : ", i, " time");
    //         await Promise.all([hands.initialize(), pose.initialize()]);
    //         break;
    //     } catch {}
    // }
    // let psuedoImgData = { image: GLOBAL.rawCamVid };
    let psuedoImgData = { image: dc.createElement("canvas") };
    psuedoImgData.image.width = 1280;
    psuedoImgData.image.height = 720;
    try {
        console.log("Trying to set Pose & Hands for : ", i, " time");
        console.log(await Promise.all([hands.send(psuedoImgData), pose.send(psuedoImgData)]));
    } catch {}
    // for (let i = 0; i < 5; ++i) {
    //     await sleep(150);
    //     try {
    //         console.log("Trying to set Pose & Hands for : ", i, " time");
    //         console.log(await Promise.all([hands.send(psuedoImgData), pose.send(psuedoImgData)]));
    //         break;
    //     } catch {}
    // }
};

// printDetails();
// initMidiaPipe(undefined);

export { initMidiaPipe, globalMediaPipeType, GLOBAL, mediaPipeOnGetFrame, logMediapipGLOBAL, getPoseHandsMoving };
