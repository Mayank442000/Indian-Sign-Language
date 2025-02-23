import JSZip from "./../Libs/JSZip.js";

const cbzCreator = async (comicFileData, comicFileNms, type = "blob") => {
    const ln = Math.min(comicFileData.length, comicFileNms.length);
    const zip = new JSZip();
    for (let i = 0; i < ln; ++i) zip.file(comicFileNms[i], comicFileData[i]);
    const blob = await zip.generateAsync({ type: type, mimeType: "application/vnd.comicbook+zip" });
    return blob;
};

export { cbzCreator };
