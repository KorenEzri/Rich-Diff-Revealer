import pixelmatch from "pixelmatch";
import { PopUpSettings } from "./types";
const swipeShell = document.getElementsByClassName("swipe-shell")[0];
const swipeBar = document.getElementsByClassName("swipe-bar")[0];
let popUpSettings: PopUpSettings;
let popUpOpen = false;
let diffWindow: Window | null;
let allSwipeButtons: (Element | string)[] = [];
let iframeElement: HTMLIFrameElement;
const imageToUint8Array = async (image: HTMLImageElement, context: any) => {
  return new Promise((resolve, reject) => {
    context.width = image.width;
    context.height = image.height;
    context.drawImage(image, 0, 0);
    context.canvas.toBlob((blob: { arrayBuffer: () => Promise<any> }) =>
      blob
        .arrayBuffer()
        .then((buffer) => resolve(new Uint8Array(buffer)))
        .catch(reject)
    );
  });
};
const differentiateImages = async () => {
  const allDeletedImages = document.getElementsByClassName("deleted asset");
  const allNewImages = document.getElementsByClassName("added asset");
  Array.from(allNewImages).forEach(async (image, index: number) => {
    const img: HTMLImageElement = new Image();
    const img2: HTMLImageElement = new Image();
    const deletedImageByIndex = allDeletedImages[index];
    if (
      image instanceof HTMLImageElement &&
      deletedImageByIndex instanceof HTMLImageElement
    ) {
      img.src = image.src;
      img2.src = deletedImageByIndex.src;
    }
    const canvas = document.createElement("canvas");
    const img2Canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img2Context = img2Canvas.getContext("2d");
    const unit8Array: any = await imageToUint8Array(img, context);
    const deletedImagesunit8Array: any = await imageToUint8Array(
      img2,
      img2Context
    );
    const hasDiff = pixelmatch(
      unit8Array,
      deletedImagesunit8Array,
      null,
      unit8Array.width,
      deletedImagesunit8Array.height,
      { threshold: 0.0 }
    );
    console.log("DIFF: ", hasDiff);
    return hasDiff;
  });
};
const isElementInViewport = (el: HTMLElement) => {
  let rect;
  if (el instanceof HTMLIFrameElement) {
    rect = el.getBoundingClientRect();
  }
  if (!rect) {
    return;
  }
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight ||
        document.documentElement.clientHeight) /* or $(window).height() */ &&
    rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /* or $(window).width() */
  );
};
const onVisibilityChange = (el: HTMLElement, callback: Function) => {
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
const handler = () => {
  if (diffWindow)
    onVisibilityChange(iframeElement, function () {
      if (diffWindow) {
        diffWindow.close();
      }
    });
};
const makeSliderMove = (slider: HTMLElement) => {
  const width = slider.style.width.match(/(\d+)/);
  let widthNumber: number;
  if (width) {
    widthNumber = Number(width[0]);
    let count = 0;
    for (let i = 0; i < 70; i++) {
      if (widthNumber) {
        count++;
        if (count > 10) {
          slider.setAttribute("style", `width:${widthNumber - 2}px;`);
          widthNumber = widthNumber - 2;
          if (widthNumber <= 0) {
            widthNumber = 848;
            slider.setAttribute("style", `width:${848}px;`);
          }
          count = 0;
        }
      }
    }
  }
};
const openDiffWindow = () => {
  const allListItems = document.getElementsByTagName("DIV");
  const relevantDivs: Element[] = [];
  const swipeButtons: Element[] = [];
  Array.from(allListItems).forEach((item) => {
    if (item.classList.contains("js-file-content")) {
      relevantDivs.push(item);
    }
  });
  Array.from(relevantDivs).forEach((div) => {
    const divChildNodes = div.children;
    Array.from(divChildNodes).forEach((node) => {
      if (node.classList.contains("render-wrapper")) {
        const iframeNode = node.lastElementChild;
        if (iframeNode) {
          let popup;
          if (iframeNode.lastElementChild instanceof HTMLIFrameElement) {
            iframeElement = iframeNode.lastElementChild;
          }
          if (iframeElement && iframeElement instanceof HTMLIFrameElement) {
            popup = `${iframeElement.src}`;
          }
          popUpSettings = {
            popup,
            newwindow: "newWindow",
            width: "width=750,height=400",
          };
          diffWindow = window.open(
            popUpSettings.popup,
            popUpSettings.newwindow,
            popUpSettings.width
          );
          diffWindow?.close();
          //   iframe.src = popup;
          //   iframe.style.position = "fixed";
          //   iframe.style.top = "150px";
          //   iframe.style.zIndex = "9001";
          //   iframe.style.width = "600px";
          //   iframe.style.height = "400px";
          //   document.body.appendChild(iframe);
        }
      }
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
    //   await differentiateImages();
    setTimeout(() => {
      openDiffWindow();
      getAllSwipeButtons();
      clickSwipeButtons(allSwipeButtons);
      if (
        swipeShell instanceof HTMLElement &&
        swipeBar instanceof HTMLElement
      ) {
        setInterval(() => {
          makeSliderMove(swipeShell);
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
  handler();
});
