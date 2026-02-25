import { makeNav } from "./modules/nav.js"
import { getJSON } from "./modules/getJSON.js"

makeNav();
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
  const deNumberify  = (line) => line.match(/^\d+ /) ? line.substring(2): line; //decklist sometimes have eg 1 Bloodbraid elf - this removes the 1
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
