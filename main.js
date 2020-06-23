
let threshhold = 10;
let before;
let after;
let tmeout;

let receivedSignal = false;

const workerBlob = new Blob([
    'self.onmessage=function(ev){debugger;postMessage(null)}'
], { type: "text/javascript" });
let worker = new Worker(window.URL.createObjectURL(workerBlob));

worker.onmessage = function (e) {
    clearTimeout(timeout);
}

let interval = setInterval(e => {
    timeout = setTimeout(e => {
        window.location = "https://www.google.com/";
    }, 100)
    worker.postMessage(null);

}, 1000);
