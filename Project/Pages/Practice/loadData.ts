//MANAGING INFO-CONTENT
import { descriptionData } from "./description.js";
import { gebi } from "./../../Scripts/General/general.js";
import { descriptionDataType } from "../../Scripts/API/types.js";
//above line is not needed since all scripts are being loaded in the same webpage

let currentSignID = parseInt(localStorage.getItem("chosenSignID") as string);
let selectedSign = "";
const prev = gebi("button-prev") as HTMLButtonElement,
    next = gebi("button-next") as HTMLButtonElement;

//disable buttons at start and end of section --- incomplete
const disabler = () => {
    const start = [1001, 2001, 3001],
        end = [1026, 2010, 3008];
    if (start.includes(currentSignID)) prev.disabled = true;
    else prev.disabled = false;
    if (end.includes(currentSignID)) next.disabled = true;
    else next.disabled = false;
};

const loadNext = () => {
    if (next.disabled) return;
    ++currentSignID;
    localStorage.setItem("chosenSignID", String(currentSignID));
    displaySign();
    disabler();
};

let updateChange: () => void;
const updateUpdateChange = (callBack: () => void) => {
    updateChange = callBack;
};

const loadPrev = () => {
    if (prev.disabled) return;
    --currentSignID;
    localStorage.setItem("chosenSignID", String(currentSignID));
    displaySign();
    disabler();
};

const displaySign = () => {
    let obj = descriptionData.find((o) => o.id == currentSignID) as descriptionDataType;
    selectedSign = obj.name;
    if (updateChange) updateChange();
    const imgSelf = gebi("sign-image-self") as HTMLImageElement,
        imgCam = gebi("sign-image-cam") as HTMLImageElement,
        signNm = gebi("sign-name") as HTMLSpanElement,
        desc = gebi("sign-description") as HTMLParagraphElement;
    // console.log(descriptionData, obj, currentSignID, imgSelf, imgCam, signNm, desc);
    imgSelf.src = "./../../Resources/images/signs/self/" + selectedSign + "-self.jpg";
    imgCam.src = "./../../Resources/images/signs/cam/" + selectedSign + "-cam.jpg";
    signNm.innerHTML = selectedSign.replace("_", "");
    desc.innerHTML = obj.desc;
};

//for initial load
// displaySign();
// disabler();

export { disabler, displaySign, loadPrev, loadNext, selectedSign, updateUpdateChange };
