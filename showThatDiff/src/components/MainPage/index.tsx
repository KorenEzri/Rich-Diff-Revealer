import * as React from "react";
import {Header} from "../Header"
import {ActivateButton} from "../ActivateButton"
export const MainPage = () => {
  return (<div className="homepage_container">
    <div></div><Header />
    <div><ActivateButton/></div>
  </div>);
};
