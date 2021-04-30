import { PopUpSettings } from "./types";
import {
  generateShareLinks,
  isElementInViewport,
  makeSliderMove,
} from "./content-utils";

const swipeShell = document.getElementsByClassName("swipe-shell")[0];
const swipeBar = document.getElementsByClassName("swipe-bar")[0];
let popUpSettings: PopUpSettings;
let popUpOpen = false;
let diffWindow: Window | null;
let allSwipeButtons: (Element | string)[] = [];
let iframeElement: HTMLIFrameElement;

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

const openDiffWindow = () => {
  const allListItems = Array.from(document.getElementsByTagName("DIV"));
  const relevantDivs: Element[] = [];
  const swipeButtons: Element[] = [];
  allListItems.forEach((item) => {
    if (item.classList.contains("js-file-content")) {
      relevantDivs.push(item);
    }
  });
  relevantDivs.forEach((div) => {
    const divChildNodes = Array.from(div.children);
    divChildNodes.forEach((node) => {
      let popup: string;
      if (!node.classList.contains("render-wrapper")) return;
      const iframeNode = node.lastElementChild;
      if (!iframeNode) return;
      if (iframeNode.lastElementChild instanceof HTMLIFrameElement) {
        iframeElement = iframeNode.lastElementChild;
      }
      if (iframeElement instanceof HTMLIFrameElement) {
        popup = `${iframeElement.src}`;
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
              generateShareLinks(8, container, popup, diffTitle.textContent);
            }
          });
        }
        popUpSettings = {
          popup,
          newwindow: "newWindow",
          width: "width=750,height=400",
        };
      }
      diffWindow = window.open(
        popUpSettings.popup,
        popUpSettings.newwindow,
        popUpSettings.width
      );
      diffWindow?.close();
    });
  });
  swipeButtons.forEach((button) => {
    if (button && button instanceof HTMLElement) {
      button.click();
    }
  });
};
const getAutomaticRichDiffs = async () => {
  const getRichDiffs = async () => {
    const allRelevantButtons = document.getElementsByClassName(
      "btn btn-sm BtnGroup-item tooltipped tooltipped-w rendered js-rendered"
    );
    Array.from(allRelevantButtons).forEach((button) => {
      if (button instanceof HTMLElement) {
        button.click();
      }
    });
    setTimeout(() => {
      openDiffWindow();
      getAllSwipeButtons();
      clickSwipeButtons(allSwipeButtons);
      if (
        swipeShell instanceof HTMLElement &&
        swipeBar instanceof HTMLElement
      ) {
        setInterval(() => {
          makeSliderMove(swipeShell, 848);
        }, 70);
      }
    }, 300);
  };
  await getRichDiffs();
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
const clickSwipeButtons = (buttons: (string | Element)[]) => {
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
    container.style.transform = "scale(0.5)";
    container.style.width = "1px";
    const containerChild = container.lastElementChild;
    if (containerChild instanceof HTMLElement) {
      containerChild.style.transform = "scale(0.78)";
      containerChild.style.marginTop = "-170px";
      containerChild.style.marginRight = "220px";
    }
  }
  const swipeButton: any = buttons[0];
  swipeButton.click();
};
window.addEventListener("DOMContentLoaded", async () => {
  setTimeout(async () => {
    await getAutomaticRichDiffs();
  }, 1000);
});
getAutomaticRichDiffs();
window.addEventListener("scroll", () => {
  scrollHandler();
});
