import {
  showDiffImage,
  showAutoSlider,
  getContaienrGrandchildrenByClassName,
  getElementsByClassName,
} from "./content-utils";
const getiframes = () => {
  const allPageContainers: Element[] = getElementsByClassName(
    "js-file-content"
  );
  const iframes: HTMLIFrameElement[] = [];
  allPageContainers.forEach((div) => {
    const iframeContainers = getContaienrGrandchildrenByClassName(
      Array.from(div.children),
      "render-wrapper"
    );
    iframeContainers.forEach((container: { lastElementChild: any }) => {
      const iframeNode = container.lastElementChild;
      if (!iframeNode) return;
      if (iframeNode.lastElementChild instanceof HTMLIFrameElement) {
        iframes.push(iframeNode.lastElementChild);
      }
    });
  });
  return iframes;
};
try {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    const msg = request.message;
    if (msg === "popupOptions") {
      const option = request.option;
      localStorage.setItem("popup_opts", option);
    }
  });
} catch ({ message }) {
  console.log(message);
}

export const manipulatePopupWindow = () => {
  // const setter = Number(localStorage.getItem("popup_opts")) || 2;
  const swipeShell = document.getElementsByClassName("swipe-shell");
  const swipeBar = document.getElementsByClassName("swipe-bar");
  const diffWindowContainer = document.getElementsByClassName(
    "render-shell js-render-shell"
  );
  let setter = 2;
  switch (setter) {
    case 1:
      break;
    case 2:
      showDiffImage(Array.from(diffWindowContainer)[0]);
      break;
    case 3:
      showAutoSlider(swipeShell[0], swipeBar[0]);
      break;
    default:
      break;
  }
};
manipulatePopupWindow();
