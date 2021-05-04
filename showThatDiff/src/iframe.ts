chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const msg = request.message;
  if (msg === "popupOptions") {
    const option = request.option;
    localStorage.setItem("popup_opts", option);
  }
});
let setter = Number(localStorage.getItem("popup_opts"));
