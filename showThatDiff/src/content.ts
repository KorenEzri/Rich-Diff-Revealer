import { PopUpSettings } from "./types";
import {
  generateShareLinks,
  isElementInViewport,
  makeSliderMove,
  removeShareLinksFromDOM,
  getElementsByClassName,
  getContaienrGrandchildrenByClassName,
} from "./content-utils";
const swipeShell = document.getElementsByClassName("swipe-shell")[0];
const swipeBar = document.getElementsByClassName("swipe-bar")[0];
let popUpSettings: PopUpSettings;
let popUpOpen = false;
let diffWindow: Window | null;
let allSwipeButtons: (Element | string)[] = [];
let iframeElement: HTMLIFrameElement;
document.body.style.overflowX = "hidden";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "start") {
    renderShareContainers();
  } else {
    removeShareLinksFromDOM();
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
  if (diffWindow) onVisibilityChange(iframeElement);
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
    )[0];
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
        width: "width=750,height=400,titlebar=no,toolbar=no",
      };
    }
    diffWindow = openWindow(popUpSettings);
    diffWindow?.close();
  });
};
const openDiffWindow = () => {
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
const getAndClickRichDiffBtns = () => {
  const allRelevantButtons = document.getElementsByClassName(
    "btn btn-sm BtnGroup-item tooltipped tooltipped-w rendered js-rendered"
  );
  Array.from(allRelevantButtons).forEach((button) => {
    if (button instanceof HTMLElement) {
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
const getAllSwipeButtons = () => {
  const allControlButtons = document.getElementsByClassName(
    "js-view-mode-item"
  );
  allSwipeButtons = Array.from(allControlButtons)
    .map((button: Element) => {
      if (button.textContent === "Swipe") {
        return button;
      } else return "null";
    })
    .filter((element) => element !== "null");
};
const stylePopupWindow = () => {
  const diffWindowContainer = document.getElementsByClassName(
    "render-shell js-render-shell"
  );
  const controlBar = document.getElementsByClassName(
    "js-render-bar render-bar render-bar-with-modes"
  );
  const html = document.querySelector("html");
  const container = diffWindowContainer[0];
  if (controlBar instanceof HTMLElement) {
    controlBar.setAttribute("hidden", "true");
  }
  if (html instanceof HTMLHtmlElement) {
    document.body.style.margin = "-10px";
    html.style.margin = "-10px";
  }
  if (container instanceof HTMLElement) {
    container.style.transform = "scale(0.9)";
    // container.style.transform = "scale(0.8)";
    container.style.width = "1px";
    const containerChild = container.lastElementChild;
    if (containerChild instanceof HTMLElement) {
      containerChild.style.transform = "scale(0.9)";
      // containerChild.style.transform = "scale(0.9)";
      containerChild.style.marginTop = "-70px";
      containerChild.style.marginRight = "220px";
    }
  }
};
const clickSwipeButtons = (buttons: (string | Element)[]) => {
  const swipeButton: any = buttons[0];
  try {
    swipeButton.click();
  } catch ({ message }) {
    if (message === "Cannot read property 'click' of undefined") {
      return;
    } else {
      console.log(message);
    }
  }
};
const getAutomaticRichDiffs = async () => {
  getAndClickRichDiffBtns();
  const getRichDiffs = async () => {
    setTimeout(() => {
      openDiffWindow();
      getAllSwipeButtons();
      stylePopupWindow();
      clickSwipeButtons(allSwipeButtons);
      if (
        swipeShell instanceof HTMLElement &&
        swipeBar instanceof HTMLElement
      ) {
        setInterval(() => {
          makeSliderMove(swipeShell, 848);
        }, 70);
      }
    }, 500);
  };
  await getRichDiffs();
};
getAutomaticRichDiffs();
window.addEventListener("DOMContentLoaded", async () => {
  await getAutomaticRichDiffs();
});
window.addEventListener("popstate", async () => {
  await getAutomaticRichDiffs();
});
window.addEventListener("scroll", () => {
  if (!location.href.match(/files/)) return;
  scrollHandler();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
