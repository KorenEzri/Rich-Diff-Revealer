import resemblejs from "resemblejs";

export const createElements = (
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
export const generateShareLinks = (
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
    `javascript:void((function()%7Bconst%20e=window.print();`,
    `http://reddit.com/submit?url=${linkToShare}&amp;title=Simple${title}`,
    `https://api.whatsapp.com/send?text='${title}%20${linkToShare},`,
    `https://news.ycombinator.com/submitlink?u='${linkToShare}&t=${title}`,
  ];
  const validImages = [
    "https://i.pinimg.com/originals/8f/c3/7b/8fc37b74b608a622588fbaa361485f32.png",
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
export const removeShareLinksFromDOM = () => {
  const share_container = document.getElementsByClassName("share_container")[0];
  share_container.remove();
};
export const isElementInViewport = (el: HTMLElement) => {
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
export const makeSliderMove = (slider: HTMLElement, starterWidth: number) => {
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
            widthNumber = starterWidth;
            slider.setAttribute("style", `width:${848}px;`);
          }
          count = 0;
        }
      }
    }
  }
};
export const getElementsByClassName = (className: string) => {
  const allDivs = Array.from(document.getElementsByTagName("DIV"));
  const relevantDivs: Element[] = [];
  allDivs.forEach((div) => {
    if (div.classList.contains(className)) {
      relevantDivs.push(div);
    }
  });
  return relevantDivs;
};
export const getContaienrGrandchildrenByClassName = (
  containerChildren: Element[],
  classNameFirst: string
) => {
  const firstChildNodes: Element[] = [];
  containerChildren.forEach((div) => {
    if (!div.classList.contains(classNameFirst)) return;
    else firstChildNodes.push(div);
  });
  return Array.from(firstChildNodes);
};
export const showDiffImage = (iframeContainer: Element) => {
  const diffImage = document.createElement("img");
  const deletedImage = document.getElementsByClassName("deleted asset")[0];
  const addedImage = document.getElementsByClassName("added asset")[0];
  console.log(diffImage, deletedImage, addedImage);
  if (
    !(deletedImage instanceof HTMLImageElement) ||
    !(addedImage instanceof HTMLImageElement) ||
    !location.href.match(/diff/)
  )
    return;
  resemblejs.outputSettings({
    errorColor: {
      red: 200,
      green: 0,
      blue: 0,
    },
  });
  resemblejs(addedImage?.src)
    .compareTo(deletedImage?.src)
    .onComplete((data) => {
      diffImage.src = data.getImageDataUrl();
      diffImage.style.width = "750px";
      diffImage.style.height = "400px";
      diffImage.classList.add("diff_mage");
    });
  iframeContainer.remove();
  document.body.style.margin = "0px";
  document.body.appendChild(diffImage);
  return undefined;
};
export const showAutoSlider = (swipeShell: Element, swipeBar: Element) => {
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
  if (!(container instanceof HTMLElement)) return;
  container.style.transform = "scale(0.9)";
  container.style.width = "1px";
  const containerChild = container.lastElementChild;
  if (!(containerChild instanceof HTMLElement)) return;
  containerChild.style.transform = "scale(0.9)";
  containerChild.style.marginTop = "-70px";
  containerChild.style.marginRight = "220px";
  clickSwipeButtons(getAllSwipeButtons());
  if (swipeShell instanceof HTMLElement && swipeBar instanceof HTMLElement) {
    setInterval(() => {
      makeSliderMove(swipeShell, 848);
    }, 70);
  }
};
export const getAndClickRichDiffBtns = () => {
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
  const allSwipeButtons = Array.from(allControlButtons)
    .map((button: Element) => {
      if (button.textContent === "Swipe") {
        return button;
      } else return "null";
    })
    .filter((element) => element !== "null");
  return allSwipeButtons;
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
