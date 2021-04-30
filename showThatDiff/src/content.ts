import { PopUpSettings, ShareSettings } from "./types";
const createElements = (
  type: string,
  attributes: any,
  children: HTMLElement[] | undefined
) => {
  const element = document.createElement(type);
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  if (children) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }
  return element;
};
const generateShareLinks = (
  amount: number,
  targetToAppend: Element,
  linkToShare: string,
  title: string
) => {
  const validHrefs = [
    `mailto:?Subject=Simple${title}&amp;Body=Check%20out%20this%20crazy%20diff!%20${linkToShare}`,
    `https://www.facebook.com/sharer.php?u=${linkToShare}`,
    `https://www.google.com/bookmarks/mark?op=edit&bkmk=${linkToShare}&title=${title}&annotation=Check out this diff!&labels=diff,testing,supertest`,
    `https://www.linkedin.com/shareArticle?mini=true&amp;url=${linkToShare}`,
    `javascript:void((function()%7Bvar%20e=window.print();`,
    `http://reddit.com/submit?url=${linkToShare}&amp;title=Simple${title}`,
    `https://api.whatsapp.com/send?text='${title}%20${linkToShare},`,
    `https://news.ycombinator.com/submitlink?u='${linkToShare}&t=${title}`,
  ];
  const validImages = [
    "https://cdn1.iconfinder.com/data/icons/outline-imperial-seo/128/SEO_C_50_09.12.14-1_Artboard_15-256.png",
    "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook2_colored_svg-128.png",
    "https://cdn0.iconfinder.com/data/icons/yooicons_set01_socialbookmarks/256/social_google_box.png",
    "https://simplesharebuttons.com/images/somacro/linkedin.png",
    "https://simplesharebuttons.com/images/somacro/print.png",
    "https://simplesharebuttons.com/images/somacro/reddit.png",
    "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Whatsapp2_colored_svg-256.png",
    "https://cdn2.iconfinder.com/data/icons/social-flat-buttons-3/512/hacker_news-256.png",
  ];
  const allLinks = [];
  for (let i = 0; i < amount; i++) {
    const image = createElements(
      "img",
      {
        src: validImages[i],
        class: "share_pic",
        width: "60px",
        height: "60px",
      },
      undefined
    );
    const p = createElements("P", { className: "p" }, [image]);
    p.style.cursor = "pointer";
    const link = createElements(
      "span",
      {
        href: validHrefs[i],
        className: "share_link",
      },
      [p]
    );
    link.addEventListener("click", () => {
      window.open(validHrefs[i], "newWindow");
    });
    allLinks.push(link);
  }
  const containerDiv = createElements(
    "div",
    { class: "share_container" },
    undefined
  );
  containerDiv.style.display = "flex";
  containerDiv.style.flexDirection = "row";
  containerDiv.style.marginLeft = "auto";
  containerDiv.style.marginRight = "auto";
  containerDiv.style.maxWidth = "70%";
  containerDiv.style.marginTop = "10px";
  containerDiv.style.marginBottom = "10px";
  containerDiv.style.paddingRight = "90px";
  containerDiv.style.justifyContent = "space-around";
  allLinks.forEach((link) => {
    containerDiv.appendChild(link);
  });
  targetToAppend.appendChild(containerDiv);
};
const swipeShell = document.getElementsByClassName("swipe-shell")[0];
const swipeBar = document.getElementsByClassName("swipe-bar")[0];
let popUpSettings: PopUpSettings;
let popUpOpen = false;
let diffWindow: Window | null;
let allSwipeButtons: (Element | string)[] = [];
let iframeElement: HTMLIFrameElement;
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
          let popup: string;
          if (iframeNode.lastElementChild instanceof HTMLIFrameElement) {
            iframeElement = iframeNode.lastElementChild;
          }
          if (iframeElement instanceof HTMLIFrameElement) {
            popup = `${iframeElement.src}`;
            const mainContainers = document.getElementsByClassName(
              "file js-file js-details-container js-targetable-element Details Details--on open display-rich-diff"
            );
            if (mainContainers) {
              const diffTitle = document.getElementsByClassName(
                "js-issue-title markdown-title"
              )[0];
              Array.from(mainContainers).forEach((container: Element) => {
                if (diffTitle.textContent) {
                  generateShareLinks(
                    8,
                    container,
                    popup,
                    diffTitle.textContent
                  );
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
