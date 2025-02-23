import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-webgpu";
import * as tflite from "@tensorflow/tfjs-tflite";
import { hardwareRating, landmarkVect, ArraylandmarkVect } from "./types";
import allPaths from "../../allPaths";
import { simpleResolver } from "../General/path";

class TensorflowHandle {
    modelFilePath: string;
    model: tflite.TFLiteModel;
    concurrency: number;
    device = "";
    read = false;
    constructor(tfHandleInitVar = { modelFilePath: "", concurrency: navigator.hardwareConcurrency / 2 }) {
        this.model = {} as tflite.TFLiteModel;
        this.modelFilePath = tfHandleInitVar.modelFilePath ?? "";
        this.concurrency = tfHandleInitVar.concurrency || navigator.hardwareConcurrency / 2;
        // return this.init();
    }
    init = async () => {
        await this.setDevice();
        if (this.modelFilePath && Object.keys(this.model).length === 0) this.#loadModel();
    };
    setDevice = async () => {
        await tf.ready();
        try {
            // throw "err";
            await tf.setBackend("webgpu");
            this.device = "webgpu";
        } catch {
            try {
                await tf.setBackend("webgl");
                this.device = "webgl";
            } catch {
                try {
                    await tf.setBackend("wasm");
                    this.device = "wasm";
                } catch {
                    try {
                        await tf.setBackend("cpu");
                        this.device = "cpu";
                    } catch {
                        throw "Error : Couldn't find appropiate tf.setBackend.";
                    }
                }
            }
        } finally {
            await tf.ready();
            console.log("tf.backend : ", this.device);
        }
    };
    rateHardware = (): hardwareRating => {
        // let devicePriority = ["webgpu", "webgl", "wasm", "cpu"];
        if (this.device === "cpu") {
            if (this.concurrency < 5) return 0;
            if (this.concurrency < 8) return 1;
        } else return 2;
        return 0;
    };
    #loadModel = async (modelPath = this.modelFilePath) => {
        console.log("TensorflowHandle.#loadModel : ", modelPath);
        tflite.setWasmPath(allPaths.tensorflowLib);
        this.model = await tflite.loadTFLiteModel(modelPath); //, { numThreads: this.concurrency, enableProfiling: true });
        // this.model = await tflite.TFLiteModel(modelPath);
        // const converter = tf.loadLayersModel("realsavedmodel");
        // this.model = converter.convert();
        console.log("TensorflowHandle.model : ", this.model, this.model.inputs, this.model.outputs, modelPath);
    };
    changeFile = async (modelRelPath = "") => {
        // modelRelPath = allPaths.allModels + "hand_landmark_lite.tflite";
        console.log("TensorflowHandle.changeFile : ", modelRelPath);
        let allModels = allPaths.allModels;
        if (modelRelPath) {
            let modLoc = modelRelPath.includes(allModels) ? modelRelPath : simpleResolver(allModels, modelRelPath);
            console.log("TensorflowHandle.changeFile : ", modLoc);
            if (this.modelFilePath !== modLoc) {
                this.modelFilePath = modLoc;
                console.log("TensorflowHandle.changeFile : ", this.modelFilePath);
                await this.#loadModel();
            }
        }
    };
    predict = (inputRaw: Array<ArraylandmarkVect>) => {
        let input = tf.tensor(inputRaw, [1, 57, 2]);
        // console.log("Input : ", input);
        let pred = this.model.predict(input);
        // @ts-ignore
        return pred.dataSync();
    };
}

export { TensorflowHandle };
