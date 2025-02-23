import { Camera } from "@mediapipe/camera_utils";

type hardwareRating = 0 | 1 | 2;

type AllModelsInitData = {
    rawCamVid: HTMLVideoElement;
    context2D: CanvasRenderingContext2D;
    camCanvas: HTMLCanvasElement;
    camStrem: MediaStreamTrack;
    drawPose?: Boolean;
    drawHands?: Boolean;
    hardwareRating: hardwareRating;
};
type facing = "user" | "environment";
type AllModeDataType = AllModelsInitData & {
    camera: Camera;
    drawPose: Boolean;
    drawHands: Boolean;
    facing: facing;
    invertNeeded: Boolean;
    camState: boolean;
};
type predDataTyp = {
    pred: number;
    cutOff: number;
    letter: string;
};

type landmark = {
    x: number;
    y: number;
    z: number;
    visibility: number;
};

type landmarkVect = [number, number];
type ArraylandmarkVect = Array<landmarkVect>;

type mediapipePoseResult = {
    image: { width: number; height: number };
    poseLandmarks: Array<landmark>;
    poseWorldLandmarks: Array<landmark>;
    // segmentationMask: ImageBitmap;
};

type multiHandedness = {
    index: number;
    score: number;
    label: "Right" | "Left";
    displayName: undefined | string;
};

type mediapipeHandsResult = {
    image: { width: number; height: number };
    multiHandLandmarks: Array<landmark>;
    multiHandWorldLandmarks: Array<landmark>;
    multiHandedness: [multiHandedness, multiHandedness] | [multiHandedness];
};

type globalMediaPipeType = {
    rawCamVid: HTMLVideoElement;
    context2D: CanvasRenderingContext2D;
    camCanvas: HTMLCanvasElement;
    camStrem: MediaStreamTrack;
    camera: Camera;
    poseData: mediapipePoseResult;
    handsData: mediapipeHandsResult;
    drawPose: Boolean;
    drawHands: Boolean;
    facing: "user" | "environment";
    invertNeeded: Boolean;
    rPoseData: Array<landmarkVect>;
    rHandsData: Array<landmarkVect>;
    rMediapipeData: Array<landmarkVect>;
    camState?: boolean;
    hardwareRating: hardwareRating;
    skipToken: number;
    skipToken3D: landmarkVect;
};

type charDivType = HTMLDivElement & { value: string };
type descriptionDataType = { id: number; name: string; desc: string };

export {
    AllModelsInitData,
    facing,
    AllModeDataType,
    predDataTyp,
    landmark,
    mediapipePoseResult,
    multiHandedness,
    mediapipeHandsResult,
    globalMediaPipeType,
    charDivType,
    hardwareRating,
    descriptionDataType,
    landmarkVect,
    ArraylandmarkVect,
};
