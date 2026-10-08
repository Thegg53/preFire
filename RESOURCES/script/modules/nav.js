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
    const navButton = document.createElement("button");
    navButton.ariaLabel = "Open Navigation Menu";
    navButton.id        = "mobile-nav-button";
    navButton.classList.add("mobile-nav-btn");
    navButton.ariaExpanded = "false";
    navButton.addEventListener("click", () => {
      const isExpanded = navButton.getAttribute("aria-expanded") === "true";
      navButton.setAttribute("aria-expanded", !isExpanded);
      
    });

    const hamburger = document.createElement("img");
    hamburger.src   = "RESOURCES/img/ui/hamburger.webp";
    hamburger.id    = "mobile-hamburger-icon";
    navButton.appendChild(hamburger);
    nav.before(navButton);

    const modal         = document.createElement("dialog");
    modal.id            = "mobile-nav-dialog";
    modal.classList.add("nav-dialog");
    modal.appendChild(nav);
    document.body.appendChild(modal);

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("nav-dialog-header");
    modal.appendChild(modalHeader);

    const closer = document.createElement("button");
    closer.innerHTML = "&times;";
    closer.classList.add(`nav-close-btn`);
    modalHeader.appendChild(closer);
    modal.prepend(modalHeader);

    const openMobileDialog = () => { modal.showModal(); };
    const shutMobileDialog = () => { modal.close();     }; 
    hamburger.addEventListener("click", openMobileDialog);
    closer.addEventListener   ("click", shutMobileDialog);
  }
}
