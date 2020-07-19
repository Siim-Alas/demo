function buildLevels(image) {
    var cvs = document.createElement('canvas');
    var ctx = cvs.getContext('2d');
    ctx.drawImage(image, 0, 0, 
    /* IE8 fix since it has no naturalWidth and naturalHeight */
    Object.prototype.hasOwnProperty.call(image, 'naturalWidth') ? image.naturalWidth : image.width, Object.prototype.hasOwnProperty.call(image, 'naturalHeight') ? image.naturalHeight : image.height);
    var levels = [{
            context2D: ctx,
            /* IE8 fix since it has no naturalWidth and naturalHeight */
            width: Object.prototype.hasOwnProperty.call(image, 'naturalWidth') ? image.naturalWidth : image.width,
            height: Object.prototype.hasOwnProperty.call(image, 'naturalHeight') ? image.naturalHeight : image.height
        }];
    /* IE8 fix since it has no naturalWidth and naturalHeight */
    var currentWidth = Object.prototype.hasOwnProperty.call(image, 'naturalWidth') ? image.naturalWidth : image.width;
    var currentHeight = Object.prototype.hasOwnProperty.call(image, 'naturalHeight') ? image.naturalHeight : image.height;
    var bigCanvas = document.createElement("canvas");
    var bigContext = bigCanvas.getContext("2d");
    bigCanvas.width = currentWidth;
    bigCanvas.height = currentHeight;
    bigContext.drawImage(image, 0, 0, currentWidth, currentHeight);
    // We cache the context of the highest level because the browser
    // is a lot faster at downsampling something it already has
    // downsampled before.
    levels[0].context2D = bigContext;
    // We build smaller levels until both width and height become
    // 1 pixel wide.
    var smallCanvas;
    var smallContext;
    while (currentWidth > 1 || currentHeight > 1) {
        currentWidth = Math.ceil(currentWidth / 2);
        currentHeight = Math.ceil(currentHeight / 2);
        smallCanvas = document.createElement("canvas");
        smallContext = smallCanvas.getContext("2d");
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
function buildTiles(level, prefix, fileExtension, tileSize) {
    var sourceContext = level.context2D;
    var columns = Math.ceil(level.width / tileSize);
    var rows = Math.ceil(level.height / tileSize);
    var tiles = [];
    var tileCanvas;
    var sliceWidth;
    var sliceHeight;
    for (var i = 0; i < columns; i++) {
        for (var j = 0; j < rows; j++) {
            sliceWidth = (i == columns - 1) ? level.width - i * tileSize : tileSize;
            sliceHeight = (j == rows - 1) ? level.height - j * tileSize : tileSize;
            tileCanvas = document.createElement('canvas');
            tileCanvas.width = sliceWidth;
            tileCanvas.height = sliceHeight;
            tileCanvas.getContext('2d').drawImage(sourceContext.canvas, i * tileSize, j * tileSize, sliceWidth, sliceHeight, 0, 0, sliceWidth, sliceHeight);
            tiles.push({
                name: "" + prefix + i + "_" + j + fileExtension,
                canvas: tileCanvas
            });
        }
    }
    return tiles;
}
function buildTilePyramidFromFile(file, tileSize, callback) {
    var img;
    var levels;
    var tiles = [];
    var reader = new FileReader();
    var folderName = file.name.substring(0, file.name.lastIndexOf('.')) + "_files";
    var fileExtension = file.name.substring(file.name.lastIndexOf('.'));
    reader.onload = function () {
        img = document.createElement('img');
        img.src = reader.result;
        img.onload = function () {
            levels = buildLevels(img);
            for (var i = 0; i < levels.length; i++) {
                tiles = tiles.concat(buildTiles(levels[i], folderName + "/" + i + "/", fileExtension, tileSize));
            }
            callback(tiles, levels[levels.length - 1].height, levels[levels.length - 1].width);
        };
    };
    reader.readAsDataURL(file);
}
function buildXML(file, tileSize, height, width) {
    var xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Image xmlns=\"http://schemas.microsoft.com/deepzoom/2009\"\n        Format=\"" + file.name.substring(file.name.lastIndexOf('.') + 1) + "\" \n        Overlap=\"0\" \n        ServerFormat=\"Default\"\n        TileSize=\"" + tileSize + "\" >\n    <Size Height=\"" + height + "\" \n            Width=\"" + width + "\"/>\n</Image>";
    return xmlString;
    //let parser = new DOMParser();
    //return parser.parseFromString(xmlString, "text/xml");
}
function buildTilePyramidAndXML(file, callback, tileSize) {
    buildTilePyramidFromFile(file, tileSize, function (tiles, height, width) {
        callback(buildXML(file, tileSize, height, width), tiles);
    });
}
//# sourceMappingURL=tileBuilder.js.map