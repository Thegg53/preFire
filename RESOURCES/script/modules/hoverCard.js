import { getSmallCardSRC } from "./utils.js"
import { addPreviewToElementFromCardName  } from "./card3d.js"

const hoverCard = document.createElement("img");
hoverCard.style.position      = "fixed";
hoverCard.style.display       = "none";
hoverCard.style.pointerEvents = "none";
hoverCard.style.zIndex        = "1000";
hoverCard.style.borderRadius  = "5px";
document.body.appendChild(hoverCard);


export function addHoverCardToElement(element, cardName) {
  if (!cardName) cardName = element.innerText;
  element.addEventListener("mouseover" , (event)=>{showHoverCard(cardName, event)});
  element.addEventListener("mouseleave", (     )=>{hideHoverCard()});
  addPreviewToElementFromCardName(element, cardName);
}

function showHoverCard(cardName, event) {
  hoverCard.src = getSmallCardSRC(cardName);
  hoverCard.style.display = "block";
  hoverCard.style.left    = `${event.clientX + 50}px`;
  hoverCard.style.top     = `${event.clientY}px`;
}

function hideHoverCard(){
  hoverCard.style.display = "none";
} 
