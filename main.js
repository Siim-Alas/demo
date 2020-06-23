let interval = setInterval(e => {
    let threshhold = 100;
    let before = new Date().getTime();

    // if devtoolas are open, then script pauses
    debugger;

    let after = new Date().getTime();

    if (after - before > threshhold) {
        console.log("debugger on");
    }

    window.location = "https://www.google.com/";
}, 10);