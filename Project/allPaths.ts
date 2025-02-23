import { simpleResolver } from "./Scripts/General/path";
// import { app } from "electron";
// import path from "path";
import { appPath } from "./../index";

const projectFolderLocation = ".";

const allPaths = {
    alphaModelSingle: "./../../Models/Alphabets/",
    allModels: "./../../Models/",
    allAlphaModels: "./../../Models/Alphabets/",
    allNumbModels: "./../../Models/Numbers/",
    allWordModels: "./../../Models/Words/",
    mediaPipeLib: "./../../Resources/Libs/Mediapipe/",
    // mediaPipeHandsLib: "./../../Resources/Libs/Mediapipe/Hands/",
    // mediapipePoseLib: "./../../Resources/Libs/Mediapipe/Pose/",
    tensorflowLib: "./../../Resources/Libs/Tensorflow/",
};

// const allPathsKys = Object.keys(allPaths);
// const allPathsLen = allPathsKys.length;

// for (let i = 0; i < allPathsLen; ++i) allPaths[allPathsKys[i]] = simpleResolver(projectFolderLocation, allPaths[allPathsKys[i]]);

console.log("allPaths : ", allPaths);

export default allPaths;
