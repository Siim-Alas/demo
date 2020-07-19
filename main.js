
var viewer = OpenSeadragon({
    id: "openseadragon1",
    prefixUrl: "openseadragon-bin-2.4.2/openseadragon-bin-2.4.2/images/",
    tileSources: {
        type: 'image',
        url: 'Taxus_uitgezaaid_in_een_knotwilg._28-07-2019._(d.j.b)._08.jpg'
    }
});

document.getElementById("fileInput").addEventListener("change", function () {
    if (this.files != null && this.files[0] != null) {
        let img;
        let levels;

        let reader = new FileReader();
        reader.onload = function () {
            img = document.createElement('img');
            img.src = reader.result;
            img.onload = function () {
                levels = buildLevels(img);

                console.log(levels);
            };
        };

        reader.readAsDataURL(this.files[0]);
    }
});