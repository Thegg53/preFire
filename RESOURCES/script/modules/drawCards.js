import { getLargeCardSRC } from "./utils.js"


export function cardImage(cardName) {
  const img       = document.createElement("img");
  const src       = getLargeCardSRC(cardName);
  img.classList.add("card");
  img.src = src;
  img.alt = cardName;

  return img;
}

export function cardImageWithDesc(cardName) {
  const p         = document.createElement("p");
  p.innerText     = cardName;
  const img       = cardImage(cardName);

  const container = document.createElement("span");
  container.classList.add("card-container");
  container.appendChild(img);
  container.appendChild(p);

  return container;
}
