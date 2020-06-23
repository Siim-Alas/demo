
let timeout = setTimeout(e => {
    window.location = "https://www.google.com/";
}, 1000)

self.addEventListener("message", e => {
    clearTimeout(timeout);
});