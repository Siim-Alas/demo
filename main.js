
// Script inspired by P2P HLS https://hls.p2ps.io/js/app.min.js

if (navigator.userAgent.indexOf("MSIE") != -1 ||
    navigator.userAgent.indexOf("Chrome") != -1 ||
    navigator.userAgent.indexOf("Safari") != -1 ||
    navigator.userAgent.indexOf("coc_coc_browser") != -1) {

    // Dummy <img> tag, nothing but the console should read its ID.
    let element = new Image;
    let readFromConsole;

    Object.defineProperty(element, "id", {
        get: function () {
            throw readFromConsole = true;
        }
    })

    setInterval(function () {
        // Print it to console to see if the console is open
        readFromConsole = false;
        console.dir(element);

        if (readFromConsole) {
            window.location = "https://www.google.com";
        }

    }, 1000)
}

setInterval(function () {
    // Check whether or not a large-enough discrepency exists between the window outer and inner measurements
    const vert = window.outerHeight - window.innerHeight > 160;
    const horiz = window.outerWidth - window.innerWidth > 160;

    if (!(vert && horiz || !(window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized || horiz || vert))) {
        window.location = "https://www.google.com";
    }
}, 500)
