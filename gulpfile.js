const gulp = require("gulp");
const gulpRename = require("gulp-rename");
const gulpEsbuild = require("gulp-esbuild");
const args = require("yargs").argv;
const changed = require("gulp-changed");

const cust_P_GulpEsbuild = gulpEsbuild.createGulpEsbuild({ piping: true });
const cust_IP_GulpEsbuild = gulpEsbuild.createGulpEsbuild({ incremental: true, piping: true });
const LIVE_STAT = Boolean(args.live);
const custGulpEsbuild = cust_P_GulpEsbuild; //LIVE_STAT ? cust_IP_GulpEsbuild : cust_P_GulpEsbuild;

console.log("LIVE_STAT : ", LIVE_STAT, args.live);

const MODE = args.MODE ?? "PRODUCTION"; // "PRODUCTION" "DEVELOPMENT"
const modes = ["PRODUCTION", "DEVELOPMENT"];
const LOG_LEVEL = ["warning", "info"][modes.indexOf(MODE)];
const MINIFY = MODE == "PRODUCTION";
const FORMAT = "esm";

const BUILD_FOLDER = "./Build/";
const BUILD_FOLDER_MODL = "./Build/Models/";
const BUILD_FOLDER_RESC = "./Build/Resources/";

const BASE_FOLDER_PROJ = "./Project/";
const BASE_FOLDER_PAGE = "./Project/Pages/";
// const BASE_FOLDER_PAGE_PRACTICE = "./Project/Pages/";
const BASE_FOLDER_RESC = "./Project/Resources/";
const BASE_FOLDER_MODL = "./Project/Models/";

const LISTEN_PAGE_MAIN_SCRIPTS = ["./Project/Pages/**/main.ts", "./Project/Pages/**/main.js"];
const LISTEN_PROJ_PAGES = ["./Project/**/*.html", "./Project/**/*.css", "./Project/**/tflite*.*", "./Project/**/*.json", "./package.json"];
const LISTEN_PROJ_RESOURCES = ["./Project/Resources/**/*.*"];
const LISTEN_PROJ_MODELS = ["./Project/Models/**/*.*"];
const LITSEN_ELECTRON_Js = "./index.ts";
// const LISTEN_PAGE_PRACT_TENSOR = ["./Project/Pages/"];

const Ts_TARGET = "chrome112";

// { dirname: 'Pages\\Practice', basename: 'main.js', extname: '.map' }

gulp.task("bundle-main", () => {
    return gulp
        .src(LISTEN_PAGE_MAIN_SCRIPTS)
        .pipe(
            custGulpEsbuild({
                outdir: "./",
                outbase: BASE_FOLDER_PROJ,
                bundle: true,
                sourcemap: "external",
                legalComments: "linked",
                logLevel: LOG_LEVEL,
                tsconfig: "./tsconfig.json",
                target: Ts_TARGET,
                minify: MINIFY,
                // footer: { js: "//# sourceMappingURL=bundle.js.map" },
                format: FORMAT,
                splitting: FORMAT === "esm",
            })
        )
        .pipe(gulp.dest(BUILD_FOLDER));
    // .pipe(
    //     gulpRename((path) => {
    //         if (path.extname == ".js" && path.basename == "main") path.basename = "bundle";
    //         else if (path.extname == ".map" && path.basename == "main.js") path.basename = "bundle.js";
    //         else if (path.extname == ".txt" && path.basename == "main.js.LEGAL") path.basename = "bundle.js.LEGAL";
    //         // console.log(path);
    //     })
    // )
    // .on("end", () => {
    //     console.log("on end");
    // });
});

gulp.task("bundle-electron", () => {
    return gulp
        .src(LITSEN_ELECTRON_Js)
        .pipe(
            custGulpEsbuild({
                sourcemap: "linked",
                legalComments: "linked",
                logLevel: LOG_LEVEL,
                tsconfig: "./tsconfig.json",
                target: "ES2022",
                minify: MINIFY,
                format: "cjs",
            })
        )
        .pipe(gulp.dest(BUILD_FOLDER));
});

gulp.task("copy-pages", () => {
    return gulp.src(LISTEN_PROJ_PAGES).pipe(changed(BUILD_FOLDER)).pipe(gulp.dest(BUILD_FOLDER));
});

gulp.task("copy-models", () => {
    return gulp.src(LISTEN_PROJ_MODELS).pipe(changed(BUILD_FOLDER_MODL)).pipe(gulp.dest(BUILD_FOLDER_MODL));
});

gulp.task("copy-resources", () => {
    return gulp.src(LISTEN_PROJ_RESOURCES).pipe(changed(BUILD_FOLDER_RESC)).pipe(gulp.dest(BUILD_FOLDER_RESC));
});

gulp.task("watch-run", () => {
    gulp.watch(LISTEN_PAGE_MAIN_SCRIPTS, gulp.series("bundle-main"));
    gulp.watch(LITSEN_ELECTRON_Js, gulp.series("bundle-electron"));
    gulp.watch(LISTEN_PROJ_PAGES, gulp.series("copy-pages"));
    gulp.watch(LISTEN_PROJ_MODELS, gulp.series("copy-models"));
    gulp.watch(LISTEN_PROJ_RESOURCES, gulp.series("copy-resources"));
});

gulp.task("build", gulp.parallel(["bundle-main", "bundle-electron", "copy-pages", "copy-models", "copy-resources"]));

gulp.task("default", gulp.parallel(["bundle-main", "bundle-electron", "copy-pages", "copy-models", "copy-resources"]));
