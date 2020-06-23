
let threshhold = 10;
let before;
let after;
let tmeout;

const worker = new Worker("worker.js");

let interval = setInterval(e => {

//    before = new Date().getTime();
//    // if devtoolas are open, then script pauses
//    debugger;
//    after = new Date().getTime();

//    if (after - before > threshhold) {
//        window.location = "https://www.google.com/";
//    }
//    timeout = setTimeout(e => {
//        window.location = "https://www.google.com/";
//    }, 100)
//    debugger;
//    clearTimeout(timeout);


}, 1000);
