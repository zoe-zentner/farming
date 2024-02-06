// const fs = require('fs');

// async function importFolder(path) {
//     const surfaceList = [];

//     const imgFiles = await fs.promises.readdir(path);

//     for (const image of imgFiles) {
//         const fullPath = path + '/' + image;
//         const imageSurf = new Image();
//         imageSurf.src = fullPath;
//         surfaceList.push(imageSurf);
//     }

//     return surfaceList;
// }

// export async function importFolderDict(path) {
//     const surfaceDict = {};

//     const imgFiles = fs.readdirSync(path);

//     for (const image of imgFiles) {
//         const fullPath = path + '/' + image;
//         const imageSurf = await loadImage(fullPath);
//         surfaceDict[path.basename(image, path.extname(image))] = imageSurf;
//     }

//     return surfaceDict;
// }

