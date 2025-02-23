import { app, BrowserWindow } from "electron";
import path from "path";
// const args = require("yargs").argv;
import "fs";
// const { app, BrowserWindow } = require("electron");
// const path = require("path");

let appPath = app.getAppPath();

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        title: "Major Project",
        minWidth: 690,
        minHeight: 690,
        darkTheme: true,
        webPreferences: { nodeIntegration: true, devTools: true, experimentalFeatures: true, scrollBounce: true },
        show: false,
    });
    console.log("electron.index.createWindow");
    // if (args.online) mainWindow.loadURL("http://localhost:6969/index.html");
    // else
    // mainWindow.loadFile("./index.html");
    mainWindow.loadFile("./Pages/Home/index.html");
    // mainWindow.maximize()
    mainWindow.title = "Major Project";
    mainWindow.show();
};

const quitApp = () => {
    if (process.platform != "darwin") app.quit();
};

const init = () => {
    setUpFlags();
    app.on("ready", createWindow);
    app.on("window-all-closed", quitApp);
    // path.dirname(app.getPath("exe"));
    console.log("app.getAppPath : ", app.getAppPath());
    console.log("app.", app.getAppPath());
    console.log("electron.index.init");
};

const setUpFlags = () => {
    app.commandLine.appendSwitch("enable-unsafe-webgpu");
    // app.commandLine.appendSwitch("no-sandbox");
    app.commandLine.appendSwitch("force_high_performance_gpu");
    app.commandLine.appendSwitch("enable-webgpu-developer-features");
    app.commandLine.appendSwitch("enable-zero-copy");
    app.commandLine.appendSwitch("enable-webgl-developer-extensions");
    // app.commandLine.appendSwitch("enable-webgl-draft-extensions");
    // app.commandLine.appendSwitch("enable-webgl-image-chromium");
    app.commandLine.appendSwitch("enable-gpu-rasterization");
    app.commandLine.appendSwitch("ignore-gpu-blocklist");
    app.commandLine.appendSwitch("show-autofill-type-predictions");
    app.commandLine.appendSwitch("enable-quic");
    app.commandLine.appendSwitch("enable-lazy-image-loading");
    app.commandLine.appendSwitch("enable-experimental-webassembly-features");
    // "electrorun": "yarn run gulp-build && electron --enable-unsafe-webgpu --force_high_performance_gpu --no-sandbox  ./build/",
    // https://peter.sh/experiments/chromium-command-line-switches/
    // https://www.electronjs.org/docs/latest/api/command-line
};

init();

export { appPath };
