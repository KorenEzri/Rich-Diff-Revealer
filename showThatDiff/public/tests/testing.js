console.log("## Testing Script Start ##");
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
const githubTest = {
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
  chrome.tabs.create({ url: githubTest.targetUrl }, (tab) => {
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
const displayTestResults = () => {
  const allTests = Object.keys(tests).filter((key) => key != "generalError");
  const allTestNames = [];
  allTests.forEach((test) => {
    allTestNames.push(`%c ${test} ,`, "background: #222; color: #00FFFF");
  });
  console.log(
    `%c tests ran: ${allTests.length}`,
    "background: #222; color: #00FFFF"
  );
  console.log(allTestNames);
  console.log(tests);
};
try {
  testHost().then(() => {
    displayTestResults();
  });
} catch ({ message }) {
  tests.generalError.push(`Error with testHost(), ${message}`);
}
