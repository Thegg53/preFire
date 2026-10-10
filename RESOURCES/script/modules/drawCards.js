import { getLargeCardSRC } from "./utils.js"

const previewImage = document.createElement("img");
previewImage.classList.add("card");

const previewDialog = document.createElement("dialog");
previewDialog.id = "card-preview-dialog";
previewDialog.appendChild(previewImage);
document.body.appendChild(previewDialog);

function showPreview(cardName) {
  previewImage.src = getLargeCardSRC(cardName);
  previewDialog.showModal();
  previewDialog.style.display = "flex";
}

function hidePreview() {
  previewImage.src = "";
  previewDialog.close();
  previewDialog.style.display = "none";
}

previewDialog.addEventListener("click", hidePreview);

export function addPreviewToElementFromCardName(element, cardName) {
  element.addEventListener("click", () => showPreview(cardName));
}

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
