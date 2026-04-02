/**
 * Returns a scryfall-compliant cardname. 
 * eg Jace, the Mind Scultptor => jace__the_mind_sculptor
 * */
export function makeCleanCardName(cardName) {
  return cardName.replaceAll(" ","_").replaceAll("'","_").replaceAll(",","_").replaceAll("/","_").toLowerCase();
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

export function makeDownloadLink (fileName, content, text="Download") {
  const element = elementWithText("button", text);
  element.addEventListener("click", () => {
    const link    = document.createElement("a");
    link.href     = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    link.download = fileName + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });
  return element;
}


export function makeClipboardLink(content, text = "Clipboard") {
  const element = elementWithText("button", text);
  element.addEventListener("click", async () => { try {
    await navigator.clipboard.writeText(content);
    const original = element.innerText;
    element.innerText = "Copied!";
    setTimeout(() => { element.innerText = original; }, 2000);
    } catch (err) { console.error("Failed to copy:", err); }
  });
  return element;
}
