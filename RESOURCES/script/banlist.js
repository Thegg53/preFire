import { banlist             } from "../data/lists/banlist.js"
import { watchlist           } from "../data/lists/watchlist.js"
import { makeNav             } from "./modules/nav.js"
import { cardImageWithDesc   } from "./modules/drawCards.js"
import { addPreviewToElementFromCardName } from "./modules/card3d.js"
import setIcons from "../img/set_icons/setIcons.js";


makeNav();
generateSection("banlist"  , banlist  );
generateSection("watchlist", watchlist);

function generateSection(sectionName, cardsList) {
  const parent = document.getElementById(sectionName);
  cardsList.forEach(cardName => {
    const img = cardImageWithDesc(cardName);
    addPreviewToElementFromCardName(img, cardName);
    parent.appendChild(img);
  });
}


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