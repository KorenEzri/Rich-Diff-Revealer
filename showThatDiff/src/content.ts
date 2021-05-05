import { PopUpSettings } from "./types";
import {
  generateShareLinks,
  isElementInViewport,
  removeShareLinksFromDOM,
  getElementsByClassName,
  getContaienrGrandchildrenByClassName,
  showDiffImage,
  getAndClickRichDiffBtns,
  showAutoSlider,
} from "./content-utils";

let iframes: HTMLIFrameElement[];
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
const runFlow = (iframeElement: HTMLIFrameElement, index: number) => {
  const swipeShell = document.getElementsByClassName("swipe-shell")[index];
  const swipeBar = document.getElementsByClassName("swipe-bar")[index];
  let popUpSettings: PopUpSettings;
  let popUpOpen = false;
  let diffWindow: Window | null;
  document.body.style.overflowX = "hidden";
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    const msg = request.message;
    if (msg === "enableShare") {
      renderShareContainers();
      localStorage.setItem("share", "true");
    } else if (msg === "disableShare") {
      localStorage.setItem("share", "false");
      removeShareLinksFromDOM();
    } else if (msg === "enablePopup") {
      localStorage.setItem("popup", "true");
    } else if (msg === "disablePopup") {
      localStorage.setItem("popup", "false");
      diffWindow?.close();
    }
  });
  const openWindow = (popUpSettings: PopUpSettings) => {
    return window.open(
      popUpSettings.popup,
      popUpSettings.newwindow,
      popUpSettings.width
    );
  };
  const onVisibilityChange = (el: HTMLElement) => {
    const visible = isElementInViewport(el);
    if (visible && popUpSettings) {
      if (popUpOpen) return;
      popUpOpen = true;
      diffWindow = window.open(
        popUpSettings.popup,
        popUpSettings.newwindow,
        popUpSettings.width
      );
    } else {
      popUpOpen = false;
      diffWindow?.close();
    }
  };
  const scrollHandler = () => {
    const popupToggle = localStorage.getItem("popup");
    if (popupToggle === "true") {
      if (diffWindow) onVisibilityChange(iframeElement);
    }
  };
  const renderShareContainers = () => {
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
  const handleDiffWindowOpening = () => {
    let popup: string;
    popup = `${iframeElement.src}`;
    popUpSettings = {
      popup,
      newwindow: "newWindow",
      width: `width=750,height=400,titlebar=no,toolbar=no`,
    };
    diffWindow = openWindow(popUpSettings);
    diffWindow?.close();
  };
  const openDiffWindow = () => {
    handleDiffWindowOpening();
  };
  const manipulatePopupWindow = () => {
    const setter = Number(localStorage.getItem("popup_opts")) || 2;
    const diffWindowContainer = document.getElementsByClassName(
      "render-shell js-render-shell"
    );
    switch (setter) {
      case 1:
        break;
      case 2:
        showDiffImage(Array.from(diffWindowContainer)[index]);
        break;
      case 3:
        showAutoSlider(swipeShell, swipeBar);
        break;
      default:
        break;
    }
  };
  const getAutomaticRichDiffs = async (first: string | undefined) => {
    getAndClickRichDiffBtns();
    const getRichDiffs = async () => {
      setTimeout(() => {
        openDiffWindow();
        manipulatePopupWindow();
        if (first) {
          if (localStorage.getItem("share") === "true") {
            renderShareContainers();
          }
        }
      }, 500);
    };
    await getRichDiffs();
  };
  getAutomaticRichDiffs("first");

  window.addEventListener("DOMContentLoaded", async () => {
    if (localStorage.getItem("share") === "true") {
      renderShareContainers();
    }
    await getAutomaticRichDiffs(undefined);
  });
  window.addEventListener("popstate", async () => {
    await getAutomaticRichDiffs(undefined);
  });
  window.addEventListener("scroll", () => {
    if (!location.href.match(/files/)) return;
    scrollHandler();
  });
};

setTimeout(() => {
  iframes = getiframes();
}, 1200);

getAndClickRichDiffBtns();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("scroll", () => {
  if (!location.href.match(/files/)) return;
  iframes.forEach((iframe) => {
    const visible = isElementInViewport(iframe);
    if (!visible) return;
    const index = iframes.indexOf(iframe);
    console.log("INDEX: ", iframes.indexOf(iframe), "IFRAME: ", visible);
    const swipeShell = document.getElementsByClassName("swipe-shell")[index];
    const swipeBar = document.getElementsByClassName("swipe-bar")[index];
    console.log(swipeShell, swipeBar);
    // runFlow(iframe, iframes.indexOf(iframe));
  });
});
