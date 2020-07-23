
window.addEventListener("load", function () {
    let viewer = OpenSeadragon({
        id: "openseadragon1",
        prefixUrl: "Javascript/dist/openseadragon-bin-2.4.2/images/",
        tileSources: 'Images/output/2196386940.xml'
    });

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
})