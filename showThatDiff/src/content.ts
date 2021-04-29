import pixelmatch from "pixelmatch";
let allSwipeButtons: (Element | string)[] = [];
let diffWindow: Window | null;
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
          const popup =
            "https://render.githubusercontent.com/diff/img?color_mode=dark&commit=1ca266d144c76a34e7bed8f58aa3315aa32b2477&enc_url1=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f477579536572666174792f616e74642d6578616d706c652f316361323636643134346337366133346537626564386635386161333331356161333262323437372f636c69656e742f73637265656e73686f74732f73686f74732f6d61696e2f686f6d65706167652e706e67&enc_url2=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f477579536572666174792f616e74642d6578616d706c652f613066363263636631396561353035326361386666346362396463386139316461316639373032372f636c69656e742f73637265656e73686f74732f73686f74732f6d61696e2f686f6d65706167652e706e67&path=client%2Fscreenshots%2Fshots%2Fmain%2Fhomepage.png&repository_id=362161525&size1=60985&size2=66395#aa4b6ca1-b07b-4206-8d90-481b017c6016";
          diffWindow = window.open(popup, "newwindow", "width=900,height=600");
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
  const allRelevantButtons = document.getElementsByClassName(
    "btn btn-sm BtnGroup-item tooltipped tooltipped-w rendered js-rendered"
  );
  Array.from(allRelevantButtons).forEach((button) => {
    if (button instanceof HTMLElement) {
      button.click();
    }
  });
  //   await differentiateImages();
  let once = false;
  if (!once) {
    setTimeout(() => {
      openDiffWindow();
      getAllSwipeButtons();
      setTimeout(() => {
        clickSwipeButtons(allSwipeButtons);
      }, 500);
    }, 1500);
    once = true;
  }
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
  const diffImage = document.getElementsByClassName("swipe view");
  if (diffImage instanceof HTMLElement) {
    diffImage.style.transform = "scale(20%)";
  }
  //   const container = diffWindowContainer[0];
  //   if (container instanceof HTMLElement && diffImage instanceof HTMLElement) {
  //     console.log("EHRE");
  //     container.style.transform = "scale(0.6)";
  //     diffImage.style.transform = "scale(0.6)";
  //   }
  const swipeButton: any = buttons[0];
  swipeButton.click();
};
window.addEventListener("DOMContentLoaded", getAutomaticRichDiffs);
getAutomaticRichDiffs();
