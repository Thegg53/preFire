export function makeNav(){
  const discordLink = "https://discord.gg/P7bV8ttzgT";
  const colors      = ["blue"  , "black", "red"    , "green", "white"];
  const pages       = ["Events", "Cards", "Banlist", "Decks" , "About"];
  const header      = document.querySelector("header");
  const footer      = document.querySelector("footer");
  const nav         = document.createElement("nav");
  const isMobile    = window.innerWidth <= 1000; 


  header.appendChild(nav);

  const homeLink = document.createElement("a");
  homeLink.href  = "index.html";
  homeLink.title = "Home";
  homeLink.classList.add("nav-home");
  const homeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  homeIcon.setAttribute("viewBox", "0 0 24 24");
  homeIcon.setAttribute("fill", "currentColor");
  homeIcon.innerHTML = '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>';
  homeLink.appendChild(homeIcon);
  nav.appendChild(homeLink);
  footer.appendChild(homeLink.cloneNode(true));

  pages.forEach((pageName, index)=>{
    const a        = document.createElement("a");
    const linkText = pageName.toLowerCase();
    a.innerText    = pageName;
    a.href         = `${linkText}.html`;
    nav.appendChild(a);
    footer.appendChild(a.cloneNode(true));
    a.classList.add(`ui-${colors[index]}`);
  });


  const discordImg = document.createElement("img");
  discordImg.src   = "RESOURCES/img/discord.svg";
  const aTag       = document.createElement("a");
  aTag.href        = discordLink;
  aTag.target      = "_blank";
  discordImg.classList.add("card");
  aTag.appendChild(discordImg);
  footer.appendChild(aTag);

    
  if (isMobile) {
    const hamburger = document.createElement("img");
    hamburger.src   = "RESOURCES/img/ui/hamburger.webp";
    hamburger.id    = "mobile-hamburger-icon";
    nav.before(hamburger);

    const modal         = document.createElement("dialog");
    modal.id            = "mobile-nav-dialog";
    modal.style.display = "none";
    modal.appendChild(nav);
    document.body.appendChild(modal);

    const closer = document.createElement("a");
    closer.innerText = "Back";
    closer.classList.add(`ui-artifact`);
    nav.appendChild(closer);

    const openMobileDialog = () => { modal.style.display = "flex";  modal.showModal(); };
    const shutMobileDialog = () => { modal.style.display = "none";  modal.close();     }; 
    hamburger.addEventListener("click", openMobileDialog);
    closer.addEventListener   ("click", shutMobileDialog);
  }
}
