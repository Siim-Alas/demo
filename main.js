
var viewer = OpenSeadragon({
    id: "openseadragon1",
    prefixUrl: "openseadragon-bin-2.4.2/openseadragon-bin-2.4.2/images/",
    tileSources: 'Images/talvine_maastik/talvine_maastik.xml'
});

document.getElementById("fileInput").addEventListener("change", function () {
    if (this.files != null && this.files[0] != null) {
        let _this = this;
        buildTilePyramidAndXML(
            this.files[0],
            function (xml, tiles) {
                let zip = new JSZip();

                zip.file(`${_this.files[0].name.substring(0, _this.files[0].name.lastIndexOf('.'))}.xml`, xml);

                for (t of tiles) {
                    zip.file(t.name, t.canvas.toDataURL().split('base64,')[1], { base64: true });
                }

                zip.generateAsync({ type: "blob" }).then(function (blob) {
                    saveAs(blob, "output.zip");
                });

                console.log(tiles);
        }, 256);
    }
});