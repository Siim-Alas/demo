
// Script inspired by P2P HLS https://hls.p2ps.io/js/app.min.js

if (navigator.userAgent.includes("MSIE") ||
    navigator.userAgent.includes("Chrome") ||
    navigator.userAgent.includes("Safari") ||
    navigator.userAgent.includes("coc_coc_browser")) {

    // Dummy <img> tag, nothing but the console should read its ID.
    let element = new Image;
    let readFromConsole;

    Object.defineProperty(element, "id", {
        get: function () {
            throw readFromConsole = true;
        }
    })

    setInterval(function () {
        // print it to console to see if the console is open
        readFromConsole = false;
        console.dir(element);

        if (readFromConsole) {
            window.location = "https://www.google.com"
        }

    }, 1000)
}
else if (navigator.userAgent.includes("Firefox")) {
    window.addEventListener("devtoolstatechaned", e => {
        if (e.detail.isOpen) {
            window.location = "https://www.google.com";
        }
    })
}

const lastDetails = {
    isOpen: false,
    orientation: null
}

e = (details, orientation) => {
    window.dispatchEvent(new CustomEvent("devtoolstatechaned", {
        detail: {
            isOpen: details,
            orientation: orientation
        }
    }))
};

setInterval(() => {
    // Check whether or not a large-enough discrepency exists between the window outer and inner measurements
    const vert = window.outerHeight - window.innerHeight > 160;
    const horiz = window.outerWidth - window.innerWidth > 160;
    const orientation = horiz ? "vertical" : "horizontal";

    if (vert && horiz || !(window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized || horiz || vert)) {
        lastDetails.isOpen && e(false, null);
        lastDetails.isOpen = false;
        lastDetails.orientation = null;
    } else {
        if (!(lastDetails.isOpen && lastDetails.orientation === orientation)) {
            e(true, orientation);
        }
        lastDetails.isOpen = true;
        lastDetails.orientation = orientation;
    }
}, 500)

window.addEventListener("devtoolstatechaned", e => {
    if (e.detail.isOpen) {
        window.location = "https://www.google.com";
    }
});