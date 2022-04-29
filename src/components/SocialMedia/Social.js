import React from "react";
import { NavLink , NavIcon , NavItems } from "./Social.elements";

function Social() {

    const socialMedia = (url) => {
        window.location.href = url;
      };

  return (
    <>
         <div className="flexContainer">
             <div className="flexItems">
               <a href="https://t.me/dogecola"> <img src={"config/images/telegram.png"}  /></a>
             </div>
             <div className="flexItems">
             <a href="https://www.instagram.com/dogecolaofficial/"> <img src={"config/images/instagram.png"}  /></a>
             </div>
             <div className="flexItems">
             <a href="https://twitter.com/doge_cola"><img src={"config/images/twitter.png"}  /></a>
             </div>
             <div className="flexItems">
             <a href="http://discord.gg/AAfvWyDPAB"> <img src={"config/images/discord.png"} /></a>
             </div>
         </div>
    </>
  )
}

export default Social