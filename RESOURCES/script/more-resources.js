import { getJSON } from "./modules/getJSON.js";
import { banlist } from "../data/lists/banlist.js";

getJSON("lists/cards").then(cardData => setUpValidator(cardData));

const validatorElement = document.getElementById("validator");
const checkDeckButton = document.getElementById("checkDeckButton");
const startingText = validatorElement.value;

function validate(cardData, decklistText) {
  const lines = decklistText.trim().split('\n').filter(line => line.trim());
  const issues = [];
  const legalCards = cardData?.cards || [];
  let totalMaindeckCards = 0;
  let sideboardCards = 0;
  let inSideboard = false;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Check for sideboard markers (case-insensitive)
    if (/^(sideboard|sb)\s*:?\s*$/i.test(trimmed)) {
      inSideboard = true;
      return;
    }

    // Parse "4 Card Name" format
    const match = trimmed.match(/^(\d+)\s+(.+)$/);
    if (!match) {
      issues.push(`Line ${index + 1}: Invalid format "${trimmed}"`);
      return;
    }

    const [, countStr, cardName] = match;
    const count = parseInt(countStr, 10);

    if (inSideboard) {
      sideboardCards += count;
    } else {
      totalMaindeckCards += count;
    }

    // Normalize card name: convert "/" to " // " for split cards
    const normalizedCardName = cardName.replace(/\s*\/\/?\s*/g, ' // ');

    // Check if card is in legal cards list
    if (!legalCards.includes(cardName) && !legalCards.includes(normalizedCardName)) {
      issues.push(`Line ${index + 1}: "${cardName}" is not a legal PreFIRE card`);
    }

    // Check if card is banned
    if (banlist.includes(cardName) || banlist.includes(normalizedCardName)) {
      issues.push(`Line ${index + 1}: "${cardName}" is BANNED in PreFIRE`);
    }

    // Check card count limit (4 of each)
    if (count > 4) {
      issues.push(`Line ${index + 1}: "${cardName}" - can't have more than 4 copies`);
    }
  });

  // Check maindeck size (60 cards minimum)
  if (totalMaindeckCards < 60) {
    issues.push(`Maindeck: ${totalMaindeckCards} cards (minimum 60)`);
  }

  // Check sideboard size (max 15 cards)
  if (sideboardCards > 15) {
    issues.push(`Sideboard: ${sideboardCards} cards (maximum 15)`);
  }

  // Build success message
  if (issues.length === 0) {
    let msg = `✓ Legal deck! (${totalMaindeckCards} cards`;
    if (sideboardCards > 0) msg += `, SB: ${sideboardCards} cards`;
    msg += ')';
    return msg;
  }

  return issues.join('\n');
}

function setUpValidator(cardData){
  const issuesElement    = document.getElementById("issues"   );
  const processDecklist  = () => issuesElement.innerText = cardData ? validate(cardData, validatorElement.value) : "Card Data not yet loaded!"
  
  // Validate on keyup (real-time)
  validatorElement.addEventListener("keyup", processDecklist);
  
  // Clear placeholder text on first click/interaction
  validatorElement.addEventListener("click", ()=>{
    if (validatorElement.value == startingText) validatorElement.value = "";
    processDecklist();
  });
  
  // Validate on button click
  if (checkDeckButton) {
    checkDeckButton.addEventListener("click", processDecklist);
  }
}






