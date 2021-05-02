console.log("## Testing Script Start ##");

!(function (o) {
  (console.old = console.log),
    (console.log = function () {
      var n,
        e,
        t = "";
      for (e = 0; e < arguments.length; e++)
        (t += '<span class="log-' + typeof (n = arguments[e]) + '">'),
          "object" == typeof n &&
          "object" == typeof JSON &&
          "function" == typeof JSON.stringify
            ? (t += JSON.stringify(n))
            : (t += n),
          (t += "</span>&nbsp;");
      (o.innerHTML += t + "<br>"), console.old.apply(void 0, arguments);
    });
})(document.body);

const createElements = (type, attributes, children) => {
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
const remoteCode = `
const observerCallback = (mutationList, observer) => {
  mutationList.forEach((mutation) => {
    switch (mutation.type) {
      case "childList":
        console.log(mutation.target);
        break;
      case "attributes":
        console.log(mutation.target);
        break;
    }
  });
};
const scrollToPopUpView = () => {
  const shareContainerTest = document.getElementsByClassName(
    "render-wrapper "
  )[0];
  shareContainerTest.scrollIntoView(true);
};
const testForPopUp = () => {
  const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true,
  };
  const observer = new MutationObserver(observerCallback);
  setTimeout(() => {
    try {
      const showRichDiffTest = document.getElementsByClassName(
        "render-shell js-render-shell"
      )[0];
      observer.observe(showRichDiffTest, observerOptions);
    } catch ({ message }) {
      console.log(message);
    }
  }, 4000);
};
const testForShareContainer = () => {
  const shareContainerTest = document.getElementsByClassName(
    "share_container"
  )[0];
  const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true,
  };
  const observer = new MutationObserver(observerCallback);
  try {
    observer.observe(shareContainerTest, observerOptions);
  } catch ({ message }) {
    console.log(message);
  }
  setTimeout(() => {
    testForPopUp();
  }, 500);
};
setTimeout(() => {
  testForShareContainer();
  scrollToPopUpView();
  testForPopUp();
}, 2500);


`;
const host = {
  hostname: "github.com",
  targetUrl:
    "https://github.com/GuySerfaty/antd-example/pull/3/files#diff-3cafd82d02920b12135b28535f2fb1e81d5dd822c7acb205913a8438595c15f9",
  nextUrl:
    "https://github.com/GuySerfaty/antd-example/pull/3/files#diff-3cafd82d02920b12135b28535f2fb1e81d5dd822c7acb205913a8438595c15f9",
  currPage: 1,
  totalPages: 1,
};
const tests = {
  generalError: [],
  richDiffWindow: {
    description: "Can find share button, can open rich diff window",
    pass: false,
    error: null,
  },
  richDiffWindow_isSexy: {
    description: "Rich diff window looks gud",
    pass: false,
    error: null,
  },
};

const windowResults = [];
const reader = new FileReader();

const testHost = async () => {
  chrome.tabs.create({ url: host.targetUrl }, (tab) => {
    chrome.tabs.executeScript(
      tab.id,
      {
        code: remoteCode,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.warn(
            "  ! Execution error: %s",
            chrome.runtime.lastError.message
          );
          tests.generalError.push(
            `Error in executeScript - ${chrome.runtime.lastError.message}`
          );
          return;
        }
        try {
          chrome.windows.getAll({ populate: true }, function (wins) {
            wins.forEach(function (win) {
              win.tabs.forEach(function (tab) {
                if (tab.url.match(/https:\/\/render.githubusercontent.com/)) {
                  windowResults.push(tab.url);
                  tests.richDiffWindow.pass = true;
                }
              });
            });
            if (!windowResults[0]) {
              tests.richDiffWindow.error = `Nothing found in WindowResults!`;
            }
          });
        } catch ({ message }) {
          tests.richDiffWindow.error = `Error in getAll - ${message}`;
        }
        chrome.tabs.remove(tab.id);
      }
    );
  });
  // chrome.tabs.captureVisibleTab
};

const logTestResults = () => {
  console.log(
    `Hostname: ${host.hostname}`,
    "background: #ccffff; color: #000000"
  );
  console.log(
    `Target URL: ${host.targetUrl}`,
    "background: #ccffff; color: #000000"
  );
  const allTests = Object.keys(tests).filter((key) => key != "generalError");
  console.log(
    `   tests ran: ${allTests.length} `,
    "background: #006666; color: #009999"
  );
  allTests.forEach((test) => {
    console.log(` -- ${test} -- `, "color: #000066;");
    console.log(`${tests[test].description}`);
  });
};

const displayTestResultsToDOM = () => {
  const hostname = document.getElementsByClassName("hostname")[0];
  const targetUrl = document.getElementsByClassName("targetUrl")[0];
  const shareSectionStatus = document.getElementsByClassName("share")[0];
  const popUpShowsStatus = document.getElementsByClassName("popup_shows")[0];
  const popUpSexyStatus = document.getElementsByClassName("popup_sexy")[0];
};
const init_test = async () => {
  try {
    await testHost();
    logTestResults();
    displayTestResultsToDOM();
  } catch ({ message }) {
    tests.generalError.push(`Error with testHost(), ${message}`);
  }
};
init_test();
