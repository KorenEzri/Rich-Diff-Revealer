import { PopUpSettings } from "./types";
import {
  generateShareLinks,
  isElementInViewport,
  removeShareLinksFromDOM,
  getElementsByClassName,
  getContaienrGrandchildrenByClassName,
  getAndClickRichDiffBtns,
} from "./content-utils";
let iframes: HTMLIFrameElement[];
let diffWindows: Window[] = [];
let popUpSettings: PopUpSettings[] = [];
let popUpOpen = false;
let index: number;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const msg = request.message;
  if (msg === "enableShare") {
    renderShareContainers(index);
    localStorage.setItem("share", "true");
  } else if (msg === "disableShare") {
    localStorage.setItem("share", "false");
    removeShareLinksFromDOM();
  } else if (msg === "enablePopup") {
    localStorage.setItem("popup", "true");
  } else if (msg === "disablePopup") {
    localStorage.setItem("popup", "false");
    diffWindows[index]?.close();
  }
});
const openWindow = (popUpSettings: PopUpSettings) => {
  return window.open(
    popUpSettings.popup,
    popUpSettings.newwindow,
    popUpSettings.width
  );
};
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
const handleDiffWindowOpening = (iframe: HTMLIFrameElement) => {
  let popup: string;
  popup = `${iframe.src}`;
  const setting = {
    popup,
    newwindow: "newWindow",
    width: `width=750,height=400,titlebar=no,toolbar=no`,
  };
  popUpSettings.push(setting);
  const window = openWindow(popUpSettings[popUpSettings.indexOf(setting)]);
  if (!window) return;
  diffWindows.push(window);
  diffWindows[diffWindows.indexOf(window)]?.close();
};
// const manipulatePopupWindow = (index: number) => {
//   // const setter = Number(localStorage.getItem("popup_opts")) || 2;
//   const swipeShell = document.getElementsByClassName("swipe-shell");
//   const swipeBar = document.getElementsByClassName("swipe-bar");
//   const diffWindowContainer = document.getElementsByClassName(
//     "render-shell js-render-shell"
//   );
//   let setter = 2;
//   console.log(diffWindowContainer, "IDNEX :", index);
//   console.log(swipeShell, swipeBar);
//   switch (setter) {
//     case 1:
//       break;
//     case 2:
//       showDiffImage(Array.from(diffWindowContainer)[index]);
//       break;
//     case 3:
//       showAutoSlider(swipeShell[0], swipeBar[0]);
//       break;
//     default:
//       break;
//   }
// };
const renderShareContainers = (index: number) => {
  const mainContainers = Array.from(
    document.getElementsByClassName(
      "file js-file js-details-container js-targetable-element Details Details--on open display-rich-diff"
    )
  );
  if (mainContainers) {
    const diffTitle = document.getElementsByClassName(
      "js-issue-title markdown-title"
    )[index];
    mainContainers.forEach((container: Element) => {
      if (diffTitle.textContent) {
        generateShareLinks(
          8,
          container,
          window.location.href,
          `This is a diff I found on our PR: ${diffTitle.textContent.trim()}`
        );
      }
    });
  }
};
const getAutomaticRichDiffs = async (
  first: string | undefined,
  iframe: HTMLIFrameElement,
  index: number
) => {
  const getRichDiffs = async () => {
    setTimeout(() => {
      handleDiffWindowOpening(iframe);
      if (first) {
        if (localStorage.getItem("share") === "true") {
          renderShareContainers(index);
        }
      }
    }, 500);
  };
  try {
    await getRichDiffs();
  } catch ({ message }) {
    console.log(message);
  }
};
const start = async (iframe: HTMLIFrameElement, index: number) => {
  try {
    await getAutomaticRichDiffs(undefined, iframe, index);
  } catch ({ message }) {
    console.log(message);
  }
};
setTimeout(async () => {
  try {
    iframes = getiframes();
  } catch ({ message }) {
    console.log(message);
  }
  if (iframes && iframes[0]) {
    iframes.forEach(async (iframe) => {
      index = iframes.indexOf(iframe);
      await start(iframe, index);
    });
  }
}, 1200);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
try {
  getAndClickRichDiffBtns();
} catch ({ message }) {
  console.log(message);
}

window.addEventListener("scroll", () => {
  if (!location.href.match(/files/)) return;
  if (!iframes || !iframes[0]) return;
  iframes.forEach((iframe) => {
    index = iframes.indexOf(iframe);
    const visible = isElementInViewport(iframe);
    if (visible && popUpSettings) {
      if (popUpOpen) return;
      popUpOpen = true;
      const setting = popUpSettings[index];
      const newWindow = window.open(
        setting.popup,
        setting.newwindow,
        setting.width
      );
      if (!newWindow) return;
      diffWindows[index] = newWindow;
    } else {
      popUpOpen = false;
      diffWindows[index]?.close();
    }
  });
});
window.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("share") === "true") {
    try {
      renderShareContainers(index);
    } catch ({ message }) {
      console.log(message);
    }
  }
  try {
    await start(iframes[index], index);
  } catch ({ message }) {
    console.log(message);
  }
  const diffWindowContainer = document.getElementsByClassName(
    "render-shell js-render-shell"
  );
  console.log(diffWindowContainer, "IDNEX :", index);
});
// window.addEventListener("popstate", async () => {
//   try {
//     await start(iframes[index], index);
//   } catch ({ message }) {
//     console.log(message);
//   }
// });
