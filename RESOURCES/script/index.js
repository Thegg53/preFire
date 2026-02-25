import { makeNav             } from "./modules/nav.js"
import { addPreviewToElementFromCardName } from "./modules/card3d.js"
import { cardImage } from "./modules/drawCards.js"

makeNav();
const containerElement = document.getElementById("image-container-pillars");
const pillars      = ["Splinter_Twin", "Tarmogoyf",  "Birthing_Pod", "Faithless_Looting","Mox_Opal", "Noble_Hierarch"];
const bannerTitles = [
  "Title",
  "Title",
  "Title",
  "Title",
  "Title",
  "Title",
]
const bannerDescs  = [
  "Nobody told me what to write here, so there's just sample text (1)",
  "Nobody told me what to write here, so there's just sample text (2)",
  "Nobody told me what to write here, so there's just sample text (3)",
  "Nobody told me what to write here, so there's just sample text (4)",
  "Nobody told me what to write here, so there's just sample text (5)",
  "Nobody told me what to write here, so there's just sample text (6)"
]
const numPillars = pillars.length;
if (bannerDescs .length !== numPillars) console.error("Not enough banner descriptions! Check index.js");
if (bannerTitles.length !== numPillars) console.error("Not enough banner titles!       Check index.js");

containerElement.classList.add(`enforcedGrid-${numPillars}`);
pillars.forEach(cardName=>{
  const img = cardImage(cardName);
  addPreviewToElementFromCardName(img, cardName);
  containerElement.appendChild(img);
})


let heroTimer;
const bannerElement = document.getElementById("hero-banner");
const makeBtn = (text, delta) => {
  const btn       = document.createElement("button");
  btn.textContent = text;
  btn.addEventListener("click", () => {
    clearTimeout(heroTimer);
    nextHero(delta);
  });
  return btn;
};
bannerElement.append(makeBtn("<", -1), makeBtn(">", 1));
let currentBannerIndex = numPillars-1;
const newSlide = (index)=>{
  const image  = `RESOURCES/img/backgrounds/${pillars[index].toLowerCase()}.webp`;
  const e = document.createElement("span"  ); e.style.backgroundImage = `url(${image})`;
  const h = document.createElement("h2"    ); h.innerText = bannerTitles[index]; e.appendChild(h);
  const p = document.createElement("p"     ); p.innerText = bannerDescs [index]; e.appendChild(p);
  e.classList.add("hero-slide");
  return e;

}
const nextHero = (delta=1) => {
  const lastElement  = bannerElement.querySelector(".hero-slide");
  currentBannerIndex = (currentBannerIndex + delta) % numPillars;
  if (currentBannerIndex < 0) currentBannerIndex = numPillars -1;
  const nextElement  = newSlide(currentBannerIndex);
  bannerElement.appendChild(nextElement);
  nextElement.offsetHeight;
  const directionStyle = delta > 0 ? "fromLeft" : "fromRight";
  nextElement.classList.add("enter", directionStyle);

  if (lastElement) setTimeout(()=>lastElement.remove(), 1000);
  heroTimer = setTimeout(nextHero, 5000);
};

nextHero();
