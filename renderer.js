// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer } = require("electron");

const el_multiple = document.querySelector("#clipboard-content-multiple");
const el_single = document.querySelector("#clipboard-content-single");
const el_image = document.querySelector("#clipboard-content-image");

function getClipboardMultiple() {
  ipcRenderer.send("clipboad-multiple-get");
}
function getClipboardSingle() {
  ipcRenderer.send("clipboad-single-get");
}
function getClipboardImage() {
  ipcRenderer.send("clipboad-image-get");
}

ipcRenderer.on("clipboad-multiple-get-reply", (_, res) => {
  console.log(res);
  el_multiple.innerHTML = res;
});
ipcRenderer.on("clipboad-single-get-reply", (_, res) => {
  console.log(res);
  el_single.innerHTML = res;
});
ipcRenderer.on("clipboad-image-get-reply", (_, res) => {
  console.log(res.data);
  if (res.success) {
    el_image.setAttribute("src", `data:image/gif;base64,${res.data}`);
  }
});
