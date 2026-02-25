import { banlist             } from "../data/lists/banlist.js"
import { watchlist           } from "../data/lists/watchlist.js"
import { makeNav             } from "./modules/nav.js"
import { cardImageWithDesc   } from "./modules/drawCards.js"
import { addPreviewToElementFromCardName } from "./modules/card3d.js"

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

