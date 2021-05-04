import * as React from "react";
import { Header } from "../Header";
import {SettingsMenu} from "../SettingsMenu"
import { ReactTinyLink } from "react-tiny-link";
import Switch from "react-switch";

const sendShareBarToggleMessage = (bool:boolean) => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const activeTab: number | undefined = tabs[0].id;
    if (activeTab && !bool) {
      localStorage.setItem("share", "true")
      chrome.tabs.sendMessage(activeTab, { message: "enableShare" });
    } else if (activeTab && bool) {
      localStorage.setItem("share", "false")
      chrome.tabs.sendMessage(activeTab, { message: "disableShare" });

    }
  });
};
const sendPopupToggleRequest = (bool:boolean) => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const activeTab: number | undefined = tabs[0].id;
    if (activeTab && !bool) {
      localStorage.setItem("popup", "true")
      chrome.tabs.sendMessage(activeTab, { message: "enablePopup" });
    } else if (activeTab && bool) {
      localStorage.setItem("popup", "false")
      chrome.tabs.sendMessage(activeTab, { message: "disablePopup" });

    }
  });
};

export const MainPage = () => {
  const [shareActive, setShareActive] = React.useState((localStorage.getItem("share")==="true") || false);
  const [popUpActive, setPopUpActive] = React.useState((localStorage.getItem("popup")==="true") || false);

  const handleShareToggleChange = (nextChecked: any) => {
    setShareActive(nextChecked);
    sendShareBarToggleMessage(shareActive)
  };

  const handlePopupToggleChange = (nextChecked: any) => {
    setPopUpActive(nextChecked);
    sendPopupToggleRequest(popUpActive)
  };

  return (
    <div className="homepage_container">
      <div className="main_header">
        <Header />
      </div>
      <div className="github_link">
        <ReactTinyLink
          cardSize="small"
          showGraphic={false}
          maxLine={2}
          minLine={1}
          url="https://github.com/KorenEzri"
        />
        </div>
        <div className="project_link">
        <ReactTinyLink
          cardSize="small"
          showGraphic={false}
          maxLine={2}
          minLine={1}
          url="https://github.com/KorenEzri/Rich-Diff-Revealer"
        />
      </div>
        <p>Toggle "Share" options</p>
      <label>
        <Switch
          onChange={handleShareToggleChange}
          checked={shareActive}
          className="react-switch"
        />
      </label>
      <p>Toggle Popup</p>
      <label htmlFor="material-switch">
          <Switch
            checked={popUpActive}
            onChange={handlePopupToggleChange}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
            className="react-switch"
            id="material-switch"
          />
        </label>
        <SettingsMenu />
      </div>
  );
};
