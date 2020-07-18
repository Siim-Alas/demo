

var viewer = OpenSeadragon({
    id: "openseadragon1",
    prefixUrl: "openseadragon-bin-2.4.2/openseadragon-bin-2.4.2/images/",
    tileSources: "talvine_maastik.dzi"
});




//fileInput.addEventListener("change", function () {
//    console.log(this.files);
//    if (this.files != null && this.files[0] != null) {
//        let file = this.files[0];
//
//        let formData = new FormData();
//        formData.append("image", file);
//
//        fetch('https://srv2.zoomable.ca/api/image', {
//            method: 'POST',
//            mode: 'no-cors',
//            body: formData,
//        }).then(function (response) {
//            console.log(response.json());
//        });
//    }
//});
