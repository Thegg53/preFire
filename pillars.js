const pillarButtons = Array.from(document.querySelectorAll('.pillar[data-card-name]'));
const pillarImage = document.getElementById('pillar-card-image');
const pillarMeta = document.getElementById('pillar-card-meta');
const pillarLink = document.getElementById('pillar-card-link');

const cardCache = new Map();

function toScryfallSearchUrl(cardName) {
  return `https://scryfall.com/search?q=${encodeURIComponent(`!"${cardName}"`)}`;
}

function setActivePillar(targetButton) {
  pillarButtons.forEach((button) => {
    button.classList.toggle('active', button === targetButton);
  });
}

function setLoadingState(cardName) {
  pillarImage.alt = cardName;
  pillarMeta.textContent = 'Loading card image...';
  pillarLink.href = toScryfallSearchUrl(cardName);
}

function setErrorState(cardName) {
  pillarMeta.textContent = 'Unable to load card image right now.';
  pillarLink.href = toScryfallSearchUrl(cardName);
}

function getCardImageFromScryfall(card) {
  if (card.image_uris && card.image_uris.normal) {
    return card.image_uris.normal;
  }

  if (Array.isArray(card.card_faces)) {
    const firstFace = card.card_faces.find((face) => face.image_uris && face.image_uris.normal);
    if (firstFace) {
      return firstFace.image_uris.normal;
    }
  }

  return null;
}

async function fetchFirstPrinting(cardName) {
  if (cardCache.has(cardName)) {
    return cardCache.get(cardName);
  }

  const query = encodeURIComponent(`!"${cardName}"`);
  const url = `https://api.scryfall.com/cards/search?q=${query}&order=released&dir=asc&unique=prints`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Scryfall request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.data) || data.data.length === 0) {
    throw new Error(`No printings found for ${cardName}`);
  }

  const firstPrintable = data.data.find((entry) => getCardImageFromScryfall(entry));
  if (!firstPrintable) {
    throw new Error(`No image found for ${cardName}`);
  }

  const result = {
    name: firstPrintable.name,
    setName: firstPrintable.set_name,
    releasedAt: firstPrintable.released_at,
    imageUrl: getCardImageFromScryfall(firstPrintable),
    scryfallUrl: firstPrintable.scryfall_uri || toScryfallSearchUrl(cardName)
  };

  cardCache.set(cardName, result);
  return result;
}

async function selectPillarCard(button) {
  const cardName = button.dataset.cardName;
  if (!cardName) return;

  setActivePillar(button);
  setLoadingState(cardName);

  try {
    const card = await fetchFirstPrinting(cardName);
    pillarImage.src = card.imageUrl;
    pillarImage.alt = `${card.name} (${card.setName})`;
    pillarLink.href = card.scryfallUrl;
    pillarMeta.textContent = card.name;
  } catch (error) {
    setErrorState(cardName);
  }
}

pillarButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectPillarCard(button);
  });
});

if (pillarButtons.length > 0) {
  selectPillarCard(pillarButtons[0]);
}
