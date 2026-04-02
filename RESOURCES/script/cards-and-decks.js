import { makeNav } from "./modules/nav.js"
import { getJSON } from "./modules/getJSON.js"
import { addHoverCardToElement } from "./modules/hoverCard.js"
import { makeDownloadLink, makeClipboardLink, elementWithText } from "./modules/utils.js";
import setIcons from "../img/set_icons/setIcons.js";

// Only call makeNav once for the combined page
makeNav();



// ============ DECKS SECTION ============
const output   = document.getElementById("decklist");

getJSON("lists/decks").then(deckData=>{
  getJSON("lists/decks-with-images").then(cardNames=>{
    makeSearchImages(cardNames, deckData);
  })
});

const isMatch = (deck, params) => {
  const active = params.filter((p) => p.val !== ""); if (active.length === 0) return true;
  const groups = active.reduce((acc, { key, val }) => { (acc[key] ??= []).push(val); return acc;}, {});
  return Object.entries(groups).every(([key, terms]) => {
    const haystack = Array.isArray(deck[key]) ? deck[key] : [];
    const lowerHay = haystack.map((s) => String(s).toLowerCase());
    return terms.every((term) => lowerHay.some((s) => s.includes(term.toLowerCase())));
  });
};

const findDecks = (deckData, params) => deckData.filter((deck) => isMatch(deck, params));

function makeSearchImages(kvp, deckData) {
  const target = document.getElementById("preview-target");
  Object.entries(kvp).forEach(([deckName, card]) => {
    const container = document.createElement("span");
    const title     = elementWithText("h3", deckName);
    container.appendChild(title);
    container.style.backgroundImage = `url("./RESOURCES/img/deckbox/${card}.png")`;
    container.classList.add("card", "glowOnHover", "deckbox");
    target.appendChild(container);

    container.addEventListener("click", () => {
      const params = [{ key: "name", val: deckName }];
      const matches = findDecks(deckData, params);
      displayDecklists(matches, output);
      output.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    });
  });
}


function displayDecklists(matches, output) {
  output.innerHTML = "";

  const parseDeckList = (list) => list.map(line => {
    const match = line.match(/^(\d+)\s+(.+)$/);
    return match ? [match[2], parseInt(match[1])] : [line, 0];
  });

  const renderList = (label, pairs) => {
    const wrap = document.createElement("div");
    const ul   = document.createElement("ul");
    pairs.forEach(([name, count]) => {
      const li = elementWithText("li", `${count} ${name}`);
      addHoverCardToElement(li, name);
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    return wrap;
  };

  const displayResult = ({ name, arch, cols, main, side }) => {
    const container = document.createElement("span");
    container.classList.add("deck");
    const mainPairs = parseDeckList(main);
    const sidePairs = side ? parseDeckList(side) : [];
    container.appendChild(elementWithText("h3", name[0].replaceAll("_", " ")));
    if (arch) container.appendChild(elementWithText("p", `Archetype: ${arch}`));
    if (cols) container.appendChild(elementWithText("p", `Colors: ${cols}`));
    
    // Generate decklist content from JSON data
    const decklistContent = [
      ...main,
      ...(side && side.length > 0 ? ['', 'SIDEBOARD:', ...side] : [])
    ].join('\n');
    
    const btns = document.createElement("span");
    btns.classList.add("download-container");
    const deckFileName = name[0].replaceAll(" ", "_");
    btns.appendChild(makeDownloadLink(deckFileName, decklistContent, "Download"));
    btns.appendChild(makeClipboardLink(decklistContent, "Clipboard"));
    container.appendChild(btns);
    const listsContainer = document.createElement("span");
    listsContainer.style.display = "grid";
    listsContainer.style.gridTemplateColumns = "1fr 1fr";
    listsContainer.style.gap = "20px";
    listsContainer.appendChild(renderList("Main", mainPairs));
    if (sidePairs.length > 0) listsContainer.appendChild(renderList("Side", sidePairs));
    container.appendChild(listsContainer);
    output.appendChild(container);
  };

  if (!matches || matches.length === 0) return output.appendChild(elementWithText("p", "No results found."));
  matches.forEach(displayResult);
  output.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
}