
window.addEventListener("load", function () {
    document.getElementById("openseadragon1").style = `width=${0.9 * this.window.innerWidth}px;height=${0.7 * this.window.innerWidth}px;margin:auto;`;

    let viewer = OpenSeadragon({
        id: "openseadragon1",
        prefixUrl: "Javascript/dist/openseadragon-bin-2.4.2/images/",
        tileSources: 'Images/output/2196386940.xml'
    });

    let spinner = document.getElementById("spinner");
    let statusText = document.getElementById("statusText");

    document.getElementById("updateViewerFileInput").addEventListener("change", function () {
        if (this.files != null && this.files[0] != null) {
            let reader = new FileReader();
            reader.onload = function () {
                viewer.open({
                    type: 'image',
                    url: reader.result,
                    crossOriginPolicy: 'Anonymous',
                    ajaxWithCredentials: false
                }
                );
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    document.getElementById("createDZIFileInput").addEventListener("change", function () {
        if (this.files != null && this.files[0] != null) {
            spinner.style.display = "block";
            statusText.textContent = "Building tiles...";

            let _this = this;
            let zip = new JSZip();

            new TileBuilder({
                file: this.files[0],
                tileSize: parseInt(document.getElementById("tileWidth").value),
                overlap: parseInt(document.getElementById("overlap").value),
                onTileBuilt: function (tile) {
                    zip.file(tile.name, tile.canvas.toDataURL().split('base64,')[1], { base64: true });
                },
                onXMLBuilt: function (xml) {
                    zip.file(`${_this.files[0].name.substring(0, _this.files[0].name.lastIndexOf('.'))}.xml`, xml)
                },
                onComplete: function () {
                    statusText.textContent = "Compressing files...";
                    zip.generateAsync({ type: "blob" }).then(function (blob) {
                        saveAs(blob, "output.zip");

                        spinner.style.display = "none";
                        statusText.textContent = "Complete!";
                    });
                },
            });
        }
    });
});

