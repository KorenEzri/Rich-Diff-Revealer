import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";
import "./popup.css";

var mountNode = document.getElementById("popup");
ReactDOM.render(<App />, mountNode);

function injectTheScript() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        chrome.tabs.executeScript(tabs[0].id, {file: "content_script.js"});
    });
}
const allRelevantButtons = document.getElementsByClassName("octicon octicon-file")
console.log("CHECL: ", allRelevantButtons)
// allRelevantButtons.forEach(button => {
//     button.addEventListener('click', injectTheScript);
// })