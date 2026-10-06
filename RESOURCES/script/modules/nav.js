export function makeNav(){
  const discordLink = "https://discord.gg/P7bV8ttzgT";
  const colors      = ["artifact", "white", "blue", "black", "red", "green" ];
  const pages       = ["Home", "Rules",  "Legal Cards", "Decks", "More Resources", "About"];
  const fileNames   = ["index",  "rules",  "legality", "decks", "more-resources", "about"];
  const header      = document.querySelector("header");
  const footer      = document.querySelector("footer");
  const nav         = document.createElement("nav");
  const isMobile    = window.innerWidth <= 1000; 


  header.appendChild(nav);

  pages.forEach((pageName, index)=>{
    const a        = document.createElement("a");
    const fileName = fileNames[index];
    a.innerText    = pageName;
    a.href         = `${fileName}.html`;
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
    modal.classList.add("nav-dialog");
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
