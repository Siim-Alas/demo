
interface level {
    context2D: CanvasRenderingContext2D;
    width: number;
    height: number;
}

interface tile {
    name: string;
    canvas: HTMLCanvasElement;
}

function buildLevels(image: HTMLImageElement) {
    let cvs: HTMLCanvasElement = document.createElement('canvas');
    let ctx: CanvasRenderingContext2D = cvs.getContext('2d');
    ctx.drawImage(
        image,
        0, 0,
        /* IE8 fix since it has no naturalWidth and naturalHeight */
        Object.prototype.hasOwnProperty.call(image, 'naturalWidth') ? image.naturalWidth : image.width,
        Object.prototype.hasOwnProperty.call(image, 'naturalHeight') ? image.naturalHeight : image.height);

    let levels: level[] = [{
        context2D: ctx,
        /* IE8 fix since it has no naturalWidth and naturalHeight */
        width: Object.prototype.hasOwnProperty.call(image, 'naturalWidth') ? image.naturalWidth : image.width,
        height: Object.prototype.hasOwnProperty.call(image, 'naturalHeight') ? image.naturalHeight : image.height
    }];

    /* IE8 fix since it has no naturalWidth and naturalHeight */
    let currentWidth: number = Object.prototype.hasOwnProperty.call(image, 'naturalWidth') ? image.naturalWidth : image.width;
    let currentHeight: number = Object.prototype.hasOwnProperty.call(image, 'naturalHeight') ? image.naturalHeight : image.height;


    let bigCanvas: HTMLCanvasElement = document.createElement("canvas");
    let bigContext: CanvasRenderingContext2D = bigCanvas.getContext("2d");

    bigCanvas.width = currentWidth;
    bigCanvas.height = currentHeight;
    bigContext.drawImage(image, 0, 0, currentWidth, currentHeight);
    // We cache the context of the highest level because the browser
    // is a lot faster at downsampling something it already has
    // downsampled before.
    levels[0].context2D = bigContext;
    // We don't need the image anymore. Allows it to be GC.
    // delete image;

    // We build smaller levels until either width or height becomes
    // 1 pixel wide.
    while (currentWidth > 1 || currentHeight > 1) {
        currentWidth = Math.ceil(currentWidth / 2);
        currentHeight = Math.ceil(currentHeight / 2);
        let smallCanvas: HTMLCanvasElement = document.createElement("canvas");
        let smallContext: CanvasRenderingContext2D = smallCanvas.getContext("2d");
        smallCanvas.width = currentWidth;
        smallCanvas.height = currentHeight;
        smallContext.drawImage(bigCanvas, 0, 0, currentWidth, currentHeight);

        levels.splice(0, 0, {
            context2D: smallContext,
            width: currentWidth,
            height: currentHeight
        });

        bigCanvas = smallCanvas;
        bigContext = smallContext;
    }
    return levels;
}

function buildTiles(level: level, prefix: string, fileExtension: string, tileSize: number) {
    let sourceContext: CanvasRenderingContext2D = level.context2D;
    let columns: number = Math.ceil(level.width / tileSize);
    let rows: number = Math.ceil(level.height / tileSize);

    let tiles: tile[] = [];
    let tileCanvas: HTMLCanvasElement;

    let sliceWidth: number;
    let sliceHeight: number;

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            sliceWidth = (i == columns - 1) ? level.width - i * tileSize : tileSize;
            sliceHeight = (j == rows - 1) ? level.height - j * tileSize : tileSize;

            tileCanvas = document.createElement('canvas');
            tileCanvas.width = sliceWidth;
            tileCanvas.height = sliceHeight;

            tileCanvas.getContext('2d').drawImage(
                sourceContext.canvas,
                i * tileSize, j * tileSize,
                sliceWidth, sliceHeight,
                0, 0,
                sliceWidth, sliceHeight);

            tiles.push({
                name: `${prefix}${i}_${j}${fileExtension}`,
                canvas: tileCanvas
            });
        }
    }

    return tiles;
}

function buildTilePyramidFromFile(file: File, tileSize: number, callback: (tiles: tile[], hegiht: number, width: number) => void) {
    let img: HTMLImageElement;
    let levels: level[];
    let tiles: tile[] = [];
    let reader: FileReader = new FileReader();

    let folderName: string = `${file.name.substring(0, file.name.lastIndexOf('.'))}_files`;
    let fileExtension: string = file.name.substring(file.name.lastIndexOf('.'));

    reader.onload = function () {
        img = document.createElement('img');
        img.src = <string>reader.result;
        img.onload = function () {
            levels = buildLevels(img);
            for (let i = 0; i < levels.length; i++) {
                tiles = tiles.concat(buildTiles(levels[i], `${folderName}/${i}/`, fileExtension, tileSize));
            }
            callback(tiles, levels[levels.length - 1].height, levels[levels.length - 1].width);
        };
    };
    reader.readAsDataURL(file);
}

function buildXML(file: File, tileSize: number, height: number, width: number) {
    let xmlString: string = 
`<?xml version="1.0" encoding="UTF-8"?>
<Image xmlns="http://schemas.microsoft.com/deepzoom/2009"
        Format="${file.name.substring(file.name.lastIndexOf('.') + 1)}" 
        Overlap="0" 
        ServerFormat="Default"
        TileSize="${tileSize}" >
    <Size Height="${height}" 
            Width="${width}"/>
</Image>`;
    return xmlString;
    //let parser = new DOMParser();
    //return parser.parseFromString(xmlString, "text/xml");
}

function buildTilePyramidAndXML(
    file: File,
    callback: (xml: string, tiles: tile[]) => void,
    tileSize: number) {

    buildTilePyramidFromFile(file, tileSize, function (tiles, height, width) {
        callback(buildXML(file, tileSize, height, width), tiles);
    });
}