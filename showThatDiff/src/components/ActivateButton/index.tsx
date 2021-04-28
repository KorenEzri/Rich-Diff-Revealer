import * as React from "react";
import {enableAutomaticRichDiffs} from "../../content"
export const ActivateButton = () => {
  return (
      <div className="activate_container">
          <button onClick={()=>{
              console.log("CLICKED")
              enableAutomaticRichDiffs()
          }} className="activate_button">Enable</button>
      </div>
  )
};
