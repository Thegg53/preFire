import { banlist             } from "../data/lists/banlist.js"
import { watchlist           } from "../data/lists/watchlist.js"
import { makeNav             } from "./modules/nav.js"
import { cardImageWithDesc   } from "./modules/drawCards.js"
import { addPreviewToElementFromCardName } from "./modules/drawCards.js"
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
  const sets = [
    { code: "8ED", name: "Eighth Edition" },
    { code: "MRD", name: "Mirrodin" },
    { code: "DST", name: "Darksteel" },
    { code: "5DN", name: "Fifth Dawn" },
    { code: "CHK", name: "Champions of Kamigawa" },
    { code: "BOK", name: "Betrayers of Kamigawa" },
    { code: "SOK", name: "Saviors of Kamigawa" },
    { code: "9ED", name: "Ninth Edition" },
    { code: "RAV", name: "Ravnica: City of Guilds" },
    { code: "GPT", name: "Guildpact" },
    { code: "DIS", name: "Dissension" },
    { code: "CSP", name: "Coldsnap" },
    { code: "TSP", name: "Time Spiral" },
    { code: "TSB", name: "Time Spiral: Timeshifted" },
    { code: "PLC", name: "Planar Chaos" },
    { code: "FUT", name: "Future Sight" },
    { code: "10E", name: "Tenth Edition" },
    { code: "LRW", name: "Lorwyn" },
    { code: "MOR", name: "Morningtide" },
    { code: "SHM", name: "Shadowmoor" },
    { code: "EVE", name: "Eventide" },
    { code: "ALA", name: "Shards of Alara" },
    { code: "CON", name: "Conflux" },
    { code: "ARB", name: "Alara Reborn" },
    { code: "M10", name: "Magic 2010" },
    { code: "ZEN", name: "Zendikar" },
    { code: "WWK", name: "Worldwake" },
    { code: "ROE", name: "Rise of the Eldrazi" },
    { code: "M11", name: "Magic 2011" },
    { code: "SOM", name: "Scars of Mirrodin" },
    { code: "MBS", name: "Mirrodin Besieged" },
    { code: "NPH", name: "New Phyrexia" },
    { code: "M12", name: "Magic 2012" },
    { code: "ISD", name: "Innistrad" },
    { code: "DKA", name: "Dark Ascension" },
    { code: "AVR", name: "Avacyn Restored" },
    { code: "M13", name: "Magic 2013" },
    { code: "RTR", name: "Return to Ravnica" },
    { code: "GTC", name: "Gatecrash" },
    { code: "DGM", name: "Dragon's Maze" },
    { code: "M14", name: "Magic 2014" },
    { code: "THS", name: "Theros" },
    { code: "BNG", name: "Born of the Gods" },
    { code: "JOU", name: "Journey into Nyx" },
    { code: "M15", name: "Magic 2015" },
    { code: "KTK", name: "Khans of Tarkir" },
    { code: "FRF", name: "Fate Reforged" },
    { code: "DTK", name: "Dragons of Tarkir" },
    { code: "ORI", name: "Magic Origins" },
    { code: "BFZ", name: "Battle for Zendikar" },
    { code: "OGW", name: "Oath of the Gatewatch" },
    { code: "SOI", name: "Shadows over Innistrad" },
    { code: "EMN", name: "Eldritch Moon" },
    { code: "KLD", name: "Kaladesh" },
    { code: "AER", name: "Aether Revolt" },
    { code: "AKH", name: "Amonkhet" },
    { code: "HOU", name: "Hour of Devastation" },
    { code: "XLN", name: "Ixalan" },
    { code: "RIX", name: "Rivals of Ixalan" },
    { code: "DOM", name: "Dominaria" },
    { code: "M19", name: "Core Set 2019" },
    { code: "GRN", name: "Guilds of Ravnica" },
    { code: "RNA", name: "Ravnica Allegiance"}
  ];
  const makeLiWithText = (set) => { 
    const li    = document.createElement("li"); 
    const a     = document.createElement("a"); 
    a.href      = `https://mtg.fandom.com/wiki/${set.code}`;
    a.target    = "_blank";
    a.innerText = set.name;
    li.appendChild(a);
    return li;
  };
  const makeLiWithImage = set => {
    const li    = document.createElement("li"); 
    const a     = document.createElement("a"); 
    const img   = document.createElement("img");
    img.src     = setIcons[set.code] || "";
    img.alt     = set.name;
    img.classList.add("set-icon");
    a.classList.add("set-link");
    a.href      = `https://mtg.fandom.com/wiki/${set.code}`;
    a.target    = "_blank";
    a.appendChild(img);
    a.appendChild(document.createTextNode(set.name));
    li.classList.add("set-item");
    li.appendChild(a);
    return li;
  }
  sets.forEach(set => setsElement.appendChild(makeLiWithImage(set)));
}