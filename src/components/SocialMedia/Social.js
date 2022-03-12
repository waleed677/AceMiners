import React from "react";
import { NavLink , NavIcon , NavItems } from "./Social.elements";

function Social() {

  return (
    <>
         <div className="flexContainer">
             <div className="flexItems">
             <a href="https://twitter.com/aceminersnft"><img src={"config/images/twitter.png"}  /></a>
             </div>
             <div className="flexItems">
             <a href="https://discord.gg/UPDguMxgzD"> <img src={"config/images/discord.png"} /></a>
             </div>
         </div>
    </>
  )
}

export default Social