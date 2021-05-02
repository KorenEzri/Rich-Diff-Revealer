import * as React from "react";
import {Header} from "../Header"
import { ReactTinyLink } from "react-tiny-link";

export const MainPage = () => {
  return (<div className="homepage_container">
    <div className="main_header"><Header /></div>
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
  </div>);
};
