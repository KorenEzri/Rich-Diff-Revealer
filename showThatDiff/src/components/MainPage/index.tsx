import * as React from "react";
import {Header} from "../Header"
import { ReactTinyLink } from "react-tiny-link";
import * as gitmage from "./gitmage.jpg"
import * as revealer from "./revealer.jpg"

export const MainPage = () => {
  return (<div className="homepage_container">
    <div className="main_header"><Header /></div>
    <div className="github_link">
    <ReactTinyLink
        cardSize="small"
        showGraphic={false}
        defaultMedia={gitmage}
        maxLine={2}
        minLine={1}
        url="https://github.com/KorenEzri"
      />
          <ReactTinyLink
        defaultMedia={revealer}
        cardSize="small"
        showGraphic={false}
        maxLine={2}
        minLine={1}
        url="https://github.com/KorenEzri/Rich-Diff-Revealer"
      />
    </div>
  </div>);
};
