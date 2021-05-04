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
  clickViewedLinks,
} from "./content-utils";
const swipeShell = document.getElementsByClassName("swipe-shell");
const swipeBar = document.getElementsByClassName("swipe-bar");
let popUpSettings: PopUpSettings;
let popUpOpen = false;
let diffWindow: Window | null;
let iframeElement: HTMLIFrameElement;
document.body.style.overflowX = "hidden";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
    const diffTitle: any = document.getElementsByClassName(
      "js-issue-title markdown-title"
    );
    mainContainers.forEach((container: Element, index: number) => {
      if (diffTitle[index].textContent) {
        generateShareLinks(
          8,
          container,
          window.location.href,
          `This is a diff I found on our PR: ${diffTitle[
            index
          ].textContent.trim()}`
        );
      }
    });
  }
};
const handleDiffWindowOpening = (iframeContainers: Element[]) => {
  let popup: string;
  iframeContainers.forEach((container) => {
    const iframeNode = container.lastElementChild;
    if (!iframeNode) return;
    if (iframeNode.lastElementChild instanceof HTMLIFrameElement) {
      iframeElement = iframeNode.lastElementChild;
    }
    if (iframeElement instanceof HTMLIFrameElement) {
      popup = `${iframeElement.src}`;
      popUpSettings = {
        popup,
        newwindow: "newWindow",
        width: `width=750,height=400,titlebar=no,toolbar=no`,
      };
    }
    diffWindow = openWindow(popUpSettings);
    diffWindow?.close();
  });
};
const openDiffWindow = () => {
  // if (thesame)
  clickViewedLinks();
  const allPageContainers: Element[] = getElementsByClassName(
    "js-file-content"
  );
  const swipeButtons: Element[] = [];
  allPageContainers.forEach((div) => {
    const iframeContainers = getContaienrGrandchildrenByClassName(
      Array.from(div.children),
      "render-wrapper"
    );
    handleDiffWindowOpening(iframeContainers);
  });
  swipeButtons.forEach((button) => {
    if (button && button instanceof HTMLElement) {
      try {
        button.click();
      } catch ({ message }) {
        if (message === "Cannot read property 'remove' of undefined") {
          return;
        } else {
          console.log(message);
        }
      }
    }
  });
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
      Array.from(diffWindowContainer).forEach((container) => {
        showDiffImage(container);
      });
      break;
    case 3:
      for (let i = 0; i < swipeShell.length; i++) {
        showAutoSlider(swipeShell[i], swipeBar[i]);
      }
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
