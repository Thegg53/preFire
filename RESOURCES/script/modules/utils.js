/**
 * Returns a scryfall-compliant cardname. 
 * eg Jace, the Mind Scultptor => jace__the_mind_sculptor
 * */
export function makeCleanCardName(cardName) {
  return cardName.replaceAll(" ","_").replaceAll("'","_").replaceAll(",","_").toLowerCase();
}

function getCardSRC(cardName, size) {
  return `./RESOURCES/img/card/${size}/${makeCleanCardName(cardName)}.webp`;
}

export function getSmallCardSRC(cardName) { return getCardSRC(cardName, "small"); }
export function getLargeCardSRC(cardName) { return getCardSRC(cardName, "large"); }

export function elementWithText(elementType, text) {
  const element = document.createElement(elementType);
  element.textContent = text;
  return element;
}

export function makeDownloadLink (filePath, text="Download") {
  const element = elementWithText("button", text);
  element.addEventListener("click", () => {
    const link    = document.createElement("a");
    link.href     = filePath;
    link.download = filePath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  return element;
}


export function makeClipboardLink(filePath, text = "Clipboard") {
  const element = elementWithText("button", text);
  element.addEventListener("click", async () => { try {
    const res      = await fetch(filePath);
    const contents = await res.text();
    await navigator.clipboard.writeText(contents);
    const original = element.innerText;
    element.innerText = "Copied!";
    setTimeout(() => { element.innerText = original; }, 2000);
    } catch (err) { console.error("Failed to copy:", err); }
  });
  return element;
}
