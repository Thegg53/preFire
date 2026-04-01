import { makeNav } from "./modules/nav.js"
import { getJSON } from "./modules/getJSON.js"
import { addHoverCardToElement } from "./modules/hoverCard.js"
import { makeDownloadLink, makeClipboardLink, elementWithText } from "./modules/utils.js";
import setIcons from "../img/set_icons/setIcons.js";

// Only call makeNav once for the combined page
makeNav();

// ============ CARDS SECTION ============
setUpSetsData();




function setUpSetsData(){
  const setsElement = document.getElementById("sets");
  const sets        = [
    "8ED","MRD","DST","5DN","CHK","BOK","SOK","9ED","RAV","GPT","DIS","CSP","TSP","TSB","PLC","FUT","10E","LRW","MOR","SHM","EVE",
    "ALA","CON","ARB","M10","ZEN","WWK","ROE","M11","SOM","MBS","NPH","M12","ISD","DKA","AVR","M13","RTR","GTC","DGM","M14","THS",
    "BNG","JOU","M15","KTK","FRF","DTK","ORI","BFZ","OGW","SOI","EMN","KLD","AER","AKH","HOU","XLN","RIX","DOM","M19","GRN","RNA"
  ];
  const makeLiWithText = (setName) => { 
    const li    = document.createElement("li"); 
    const a     = document.createElement("a"); 
    a.href      = `https://mtg.fandom.com/wiki/${setName}`;
    a.target    = "_blank";
    a.innerText = setName;
    li.appendChild(a);
    return li;
  };
  const makeLiWithImage = setName => {
    const li    = document.createElement("li"); 
    const a     = document.createElement("a"); 
    const img   = document.createElement("img");
    img.src     = setIcons[setName] || "";
    img.alt     = setName;
    img.classList.add("set-icon");
    a.href      = `https://mtg.fandom.com/wiki/${setName}`;
    a.target    = "_blank";
    a.appendChild(img);
    a.appendChild(document.createTextNode(setName));
    li.appendChild(a);
    return li;
  }
  sets.forEach(setName=>setsElement.appendChild(makeLiWithImage(setName)));
}


// ============ DECKS SECTION ============
const output   = document.getElementById("search-output");

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
      const params = [{ key: "main", val: String(card).trim().toLowerCase().replaceAll("_"," ") }];
      const matches = findDecks(deckData, params);
      buildResults(matches, output);
      output.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    });
  });
}


