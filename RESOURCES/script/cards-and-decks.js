import { makeNav } from "./modules/nav.js"
import { getJSON } from "./modules/getJSON.js"
import { addHoverCardToElement } from "./modules/hoverCard.js"
import { makeDownloadLink, makeClipboardLink, elementWithText } from "./modules/utils.js";

// Only call makeNav once for the combined page
makeNav();

// ============ CARDS SECTION ============
setUpSetsData();
getJSON("lists/cards").then(cardData => setUpValidator(cardData));

const validatorElement = document.getElementById("validator");
const startingText = validatorElement.value;

function setUpValidator(cardData){
  const issuesElement    = document.getElementById("issues"   );
  const processDecklist  = () => issuesElement.innerText = cardData ? validate(cardData, validatorElement.value) : "Card Data not yet loaded!"
  validatorElement.addEventListener("keyup", processDecklist);
  validatorElement.addEventListener("click", ()=>{
    if (validatorElement.value == startingText) validatorElement.value = "";
    processDecklist
  });
}

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
  sets.forEach(setName=>setsElement.appendChild(makeLiWithText(setName)));
}

function validate(cardData, text) {
  const deNumberify  = (line) => line.match(/^\d+ /) ? line.substring(2): line;
  const isMarker     = (line) => ["SIDEBOARD:"].includes(line);
  const isCommented  = (line) => /^\s*###/.test(line);
  const isKnownCard  = (line) => cardData.cards .includes(line);
  const isBannedCard = (line) => cardData.banned.includes(line);

  const cards = text
    .split("\n")
    .map   (line => line.trim()      )
    .map   (line => deNumberify(line))
    .filter(line => line.length > 0  )
    .filter(line =>!isMarker(line)   )
    .filter(line =>!isCommented(line))
    
  const unknownCards  = cards.filter(line =>!isKnownCard(line))
  const bannedCards   = cards.filter(line =>isBannedCard(line))
  const hasIssues     = unknownCards.length > 0 || bannedCards.length > 0;
  if  (!hasIssues) return "This deck is legal!";
  const unknownString = unknownCards.length === 0 ? "" : `These cards are not in this format or were not recognized:\n${unknownCards}\n`; 
  const bannedString  =  bannedCards.length === 0 ? "" : `These cards are Banned:\n${bannedCards}\n`;
  return `There are some issues with this deck:\n${unknownString}\n${bannedString}`;
}

// ============ DECKS SECTION ============
const output   = document.getElementById("search-output");

getJSON("lists/decks").then(deckData=>{
  makeSearchBoxes(deckData);
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

function makeSearchBoxes(deckData) {
  const input    = document.getElementById("search-input");
  const goButton = document.getElementById("goButton");
  const FIELDS   = [
    { key: "main", label: "Main:", placeholder: "Tarmogoyf" },
    { key: "main", label: "And:", placeholder: "Stomping Ground" },
    { key: "main", label: "And:", placeholder: "Noble Hierarch" },
    { key: "side", label: "Side:", placeholder: "Silence" },
    { key: "side", label: "And:", placeholder: "Supreme Verdict" },
    { key: "side", label: "And:", placeholder: "Mana Leak" },
  ];

  FIELDS.forEach((f, i) => input.appendChild(makeTextInput(`${f.key}-${i}`, f)));
  goButton.addEventListener("click", () => {
    const matches = performSearch(input, deckData);
    buildResults(matches, output);
  });
}

function makeTextInput(id, { key, label, placeholder }) {
  const labelEl = document.createElement("label");
  labelEl.htmlFor   = id;
  labelEl.innerText = label;

  const inputEl = document.createElement("input");
  inputEl.placeholder = placeholder;
  inputEl.id          = id;
  inputEl.type        = "text";
  inputEl.spellcheck  = false;
  inputEl.dataset.key = key;
  inputEl.classList.add("search-field");

  const container = document.createElement("div");
  container.appendChild(labelEl);
  container.appendChild(inputEl);
  return container;
}

function performSearch(containerEl, deckData) {
  const params = Array.from(containerEl.querySelectorAll("input.search-field")).map((inp) => ({
    key: inp.dataset.key,
    val: inp.value.trim().toLowerCase(),
  }));
  return findDecks(deckData, params);
}

function buildResults(matches, output) {
  output.innerHTML = "";

  const zipPairs = (names = [], counts = []) => names.map((name, i) => [name, counts[i] ?? 0]);

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

  const displayResult = ({ name, arch, cols, main, main_amnt, side, side_amnt }) => {
    const container = document.createElement("span");
    container.classList.add("deck");
    const mainPairs = zipPairs(main, main_amnt);
    const sidePairs = zipPairs(side, side_amnt);
    container.appendChild(elementWithText("h3", name[0].replaceAll("_", " ")));
    if (arch) container.appendChild(elementWithText("p", `Archetype: ${arch}`));
    if (cols) container.appendChild(elementWithText("p", `Colors: ${cols}`));
    const btns = document.createElement("span");
    btns.classList.add("download-container");
    btns.appendChild(makeDownloadLink (`INPUT/decklists/${name}.txt` , "Download"));
    btns.appendChild(makeClipboardLink(`INPUT/decklists/${name}.txt`, "Clipboard"));
    container.appendChild(btns);
    container.appendChild(renderList("Main", mainPairs));
    output.appendChild(container);
  };

  if (!matches || matches.length === 0) return output.appendChild(elementWithText("p", "No results found."));
  matches.forEach(displayResult);
  output.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
}
