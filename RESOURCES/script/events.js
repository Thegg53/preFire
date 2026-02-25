import { makeNav } from "./modules/nav.js"
import { events  } from "../data/lists/events.js"
import { elementWithText } from "./modules/utils.js"
makeNav();


const nowTime = Date.now();
const target  = document.getElementById("events-target");
events.forEach(event=>{
  const timeDiff = timeDifference(event);
  if (timeDiff < 0) return console.log("Event already passed:", event);

  const section = document.createElement("section"); 
  section.appendChild(elementWithText("h2", event.Name));

  const splitMob = document.createElement("span");
  splitMob.classList.add("splitMob", "splitMob-2");
  splitMob.appendChild(infoList(event, timeDiff));
  splitMob.appendChild(discordImage(event));
  section .appendChild(splitMob);
  target  .appendChild(section);
});
function infoList(eventData, timeDiff) {
  const ul        = document.createElement("ul");
  const timeLocal = new Date(eventData.Time);
  const infos     = [
    `Starts in ${timeDiff} Days, at ${timeLocal}`,
    `${eventData.Info ?? "Good Luck!"}`
  ];
  infos.forEach(info=>ul.appendChild(elementWithText("li", info)));
  return ul;
}
function discordImage(eventData){
  const svg= document.createElement("img");
  svg.src = "../../RESOURCES/img/discord-event.svg";
  svg.style.cssText = "width: 80%; margin-inline: 10%;"
  svg.classList.add("card", "glowOnHover")
  const a  = document.createElement("a");
  a.href   = eventData.Link;
  a.target = "_blank";
  a.appendChild(svg);
  return a;
}
function timeDifference(eventData) {
  const  eventDateUTC = new Date(eventData.Time);
  const  diffMs       = eventDateUTC - nowTime;
  const  diffDays     = diffMs / (1000 * 60 * 60 * 24);
  return parseInt(diffDays);
}
