console.log("## Testing Script Start ##");

rewireLoggingToElement(
  () => document.getElementById("log"),
  () => document.getElementById("log-container"),
  true
);
function rewireLoggingToElement(eleLocator, eleOverflowLocator, autoScroll) {
  fixLoggingFunc("log");
  fixLoggingFunc("debug");
  fixLoggingFunc("warn");
  fixLoggingFunc("error");
  fixLoggingFunc("info");
  fixLoggingFunc("pass");
  fixLoggingFunc("fail");

  function fixLoggingFunc(name) {
    console["old" + name] = console[name];
    console[name] = function (...arguments) {
      const output = produceOutput(name, arguments);
      const eleLog = eleLocator();

      if (autoScroll) {
        const eleContainerLog = eleOverflowLocator();
        const isScrolledToBottom =
          eleContainerLog.scrollHeight - eleContainerLog.clientHeight <=
          eleContainerLog.scrollTop + 1;
        eleLog.innerHTML += output + "<br>";
        if (isScrolledToBottom) {
          eleContainerLog.scrollTop =
            eleContainerLog.scrollHeight - eleContainerLog.clientHeight;
        }
      } else {
        eleLog.innerHTML += output + "<br>";
      }

      console["old" + name].apply(undefined, arguments);
    };
  }

  function produceOutput(name, args) {
    return args.reduce((output, arg) => {
      return (
        output +
        '<span class="log-' +
        typeof arg +
        " log-" +
        name +
        '">' +
        (typeof arg === "object" && (JSON || {}).stringify
          ? JSON.stringify(arg)
          : arg) +
        "</span>&nbsp;"
      );
    }, "");
  }
}

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
    name: "richDiffWindow",
    description: "Can find share button, can open rich diff window",
    pass: false,
    error: null,
  },
  richDiffWindow_isSexy: {
    name: "richDiffWindow_isSexy",
    description: "Rich diff window looks gud",
    pass: false,
    error: null,
  },
};

const windowResults = [];
const reader = new FileReader();

const testHost = async () => {
  const allTestsRan = [];
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
        setTimeout(() => {
          try {
            chrome.windows.getAll({ populate: true }, function (wins) {
              wins.forEach(function (win) {
                win.tabs.forEach(function (tab) {
                  if (tab.url.match(/https:\/\/render.githubusercontent.com/)) {
                    windowResults.push({ tab: tab.url, winID: win.id });
                    tests.richDiffWindow.pass = true;
                  }
                });
              });
              chrome.windows.remove(windowResults[0].winID);
              allTestsRan.push(tests.richDiffWindow);
              allTestsRan.push(tests.richDiffWindow_isSexy);
              allTestsRan.forEach((test) => {
                logTest(test);
              });
              console.info(
                `Finished.\n    tests ran: ${allTestsRan.length} \n`
              );
              chrome.tabs.remove(tab.id);
              if (!windowResults[0]) {
                tests.richDiffWindow.error = `Nothing found in WindowResults!`;
              }
            });
          } catch ({ message }) {
            tests.richDiffWindow.error = `Error in getAll - ${message}`;
          }
        }, 5000);
      }
    );
  });
  // chrome.tabs.captureVisibleTab
};

const logTest = (test) => {
  console.info(
    `--------------------------------------------------------------------------------------------------------------\n -- ${test.name} -- `
  );
  console.info(`${test.description}\n`);
  console.warn(`PASSED: ${test.pass}`);
  console.info(
    `\n--------------------------------------------------------------------------------------------------------------\n`
  );
};

const init_test = async () => {
  try {
    console.log(`Hostname: ${host.hostname}`);
    console.log(`Target URL: ${host.targetUrl}\n`);
    console.warn("running...");
    await testHost();
  } catch ({ message }) {
    tests.generalError.push(`Error with testHost(), ${message}`);
  }
};
init_test();
