// import { description } from "./description";
import { disabler, displaySign, loadPrev, loadNext, selectedSign, updateUpdateChange } from "./loadData";
import { displayResult, currentSignID, detectionResult } from "./detection";
import { setEvent, gebi, cons } from "./../../Scripts/General/general";
import { AllModels } from "./../../Scripts/API/mediaflow";
import { AllModelsInitData, predDataTyp } from "./../../Scripts/API/types";

displaySign();
disabler();

displayResult();

setEvent("click", loadPrev, gebi("button-prev") as HTMLButtonElement);
setEvent("click", loadNext, gebi("button-next") as HTMLButtonElement);

let ModleHandle: AllModels;

const initMediaFlow = async () => {
    const rawCamVid = gebi("rawCamVid") as HTMLVideoElement,
        camCanvas = gebi("camCanvas") as HTMLCanvasElement,
        camFeed = await navigator.mediaDevices.getUserMedia({ video: true }),
        camStrem = camFeed.getVideoTracks()[0] as MediaStreamTrack,
        drawPose = true,
        drawHands = true;
    var v = gebi("rawCamVid") as HTMLVideoElement;
    /* v.addEventListener(
        "loadedmetadata",
        function (e) {
            var width = this.videoWidth,
                height = this.videoHeight;
            // camCanvas.style.width = width + "px";
            // camCanvas.style.height = width + "px";
            console.log("W : ", width, "H : ", height);
        },
        false
    ); */
    rawCamVid.srcObject = camFeed;
    let AlphaModInitData: AllModelsInitData = {
        rawCamVid: rawCamVid,
        camCanvas: camCanvas,
        camStrem: camStrem,
        drawPose: drawPose,
        drawHands: drawHands,
        context2D: camCanvas.getContext("2d") as CanvasRenderingContext2D,
        hardwareRating: 0,
    };
    updateUpdateChange(updateChange);
    ModleHandle = new AllModels(AlphaModInitData, predCallBack);
    await ModleHandle.init();
    ModleHandle.setLetter(selectedSign);
};

const predCallBack = (predData: predDataTyp) => {
    const risDiv = gebi("detection-result") as HTMLDivElement,
        risText = gebi("detection-result-text") as HTMLDivElement,
        risImg = gebi("detection-result-icon") as HTMLImageElement;
    // console.log("predData : ", predData);
    predData.cutOff = predData.cutOff ?? 0.1;
    if (predData.letter === selectedSign) {
        if (predData.pred > predData.cutOff) {
            risText.innerText = detectionResult[2].message;
            risImg.src = "./../../Resources/images/icons/" + detectionResult[2].image;
            risDiv.style.backgroundColor = detectionResult[2].imgColor;
        } else {
            risText.innerText = detectionResult[1].message;
            risImg.src = "./../../Resources/images/icons/" + detectionResult[1].image;
            risDiv.style.backgroundColor = detectionResult[1].imgColor;
        }
    } else if (predData.letter === "404") {
        risText.innerText = detectionResult[0].message;
        risImg.src = "./../../Resources/images/icons/" + detectionResult[0].image;
        risDiv.style.backgroundColor = detectionResult[0].imgColor;
    }
};

const updateChange = () => {
    console.log("char changed");
    ModleHandle.setLetter(selectedSign);
};

initMediaFlow();
