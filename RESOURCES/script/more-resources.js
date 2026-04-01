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

