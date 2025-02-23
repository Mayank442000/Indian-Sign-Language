//MANAGING VIDEO-CONTENT
//import {description} from './description.js';
//above line is not needed since all scripts are being loaded in the same webpage
import { gebi } from "./../../Scripts/General/general.js";

//getting video
// const video = document.getElementById("video");
// const returnCamStrem = () => {
//     new Promise((r) =>
//         navigator.getUserMedia(
//             { video: {} },
//             (stream) => (video.srcObject = stream),
//             (err) => console.error(err)
//         )
//     );
// };

//possible outcomes
const detectionResult = [
    {
        message: "Hand Not Detected   ",
        image: "question-solid.svg",
        imgColor: "#ffec8b",
    },
    {
        message: "Gesture is Wrong   ",
        image: "xmark-solid.svg",
        imgColor: "#f4787c",
    },
    {
        message: "Gesture is Right   ",
        image: "check-solid.svg",
        imgColor: "#14d2bb",
    },
];

let currentSignID = localStorage.getItem("chosenSignID"); //use this value to select the AI instance, maybe. Refer description.js
let aiResult = 2; //save model result here out of {0,1,2} with reference to detectionResult[]

const displayResult = () => {
    let h2 = gebi("detection-result-text") as HTMLElement,
        img = gebi("detection-result-icon") as HTMLImageElement,
        parentDuv = gebi("detection-result") as HTMLDivElement;
    h2.innerHTML = detectionResult[aiResult].message;
    img.src = "./../../Resources/images/icons/" + detectionResult[aiResult].image;
    parentDuv.style.backgroundColor = detectionResult[aiResult].imgColor;
};

// returnCamStrem();
// displayResult(); // might need to shift this into a loop

export { displayResult, currentSignID, detectionResult };
