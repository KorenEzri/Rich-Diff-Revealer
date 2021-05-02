import * as React from "react";
import { Header } from "../Header";
import { ReactTinyLink } from "react-tiny-link";
import Switch from "react-switch";

export const MainPage = () => {
  const [checked, setChecked] = React.useState((localStorage.getItem("share")==="true") || false);
  const handleChange = (nextChecked: any) => {
    setChecked(nextChecked);
    popup(checked)
  };

  const popup = (bool:boolean) => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      const activeTab: number | undefined = tabs[0].id;
      if (activeTab && !bool) {
        localStorage.setItem("share", "true")
        chrome.tabs.sendMessage(activeTab, { message: "start" });
      } else if (activeTab && bool) {
        localStorage.setItem("share", "false")
        chrome.tabs.sendMessage(activeTab, { message: "end" });

      }
    });
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
          onChange={handleChange}
          checked={checked}
          className="react-switch"
        />
      </label>
      </div>
  );
};
