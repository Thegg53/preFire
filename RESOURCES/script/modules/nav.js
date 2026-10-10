export function makeNav(){
  const discordLink = "https://discord.gg/P7bV8ttzgT";
  const colors      = ["artifact", "white", "blue", "black", "red", "green" ];
  const pages       = ["Home", "Rules",  "Legal Cards", "Decks", "More Resources", "About"];
  const fileNames   = ["index",  "rules",  "legality", "decks", "more-resources", "about"];
  const header      = document.querySelector("header");
  const footer      = document.querySelector("footer");
  const nav         = document.createElement("nav");
  const MOBILE_WIDTH = 1000;

  let isMobile = false;

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const width = entry.contentRect.width;
      if (width <= MOBILE_WIDTH) {
        switchToMobileNav(); 
      } else {
        switchToDesktopNav();
      }
    }
  });

  header.appendChild(nav);
  resizeObserver.observe(document.body);

  const foooterContent = document.createElement("div");
  foooterContent.classList.add("footer-content");
  footer.appendChild(foooterContent);


  pages.forEach((pageName, index)=>{
    const a        = document.createElement("a");
    const fileName = fileNames[index];
    a.innerText    = pageName;
    a.href         = `${fileName}.html`;
    nav.appendChild(a);
    foooterContent.appendChild(a.cloneNode(true));
    a.classList.add(`ui-${colors[index]}`);
  });


  const discordImg = document.createElement("img");
  discordImg.src   = "RESOURCES/img/discord.svg";
  const aTag       = document.createElement("a");
  aTag.href        = discordLink;
  aTag.target      = "_blank";
  discordImg.classList.add("discord-img");
  aTag.appendChild(discordImg);
  foooterContent.appendChild(aTag);

  function switchToDesktopNav() {
    if (!isMobile) { return };

    isMobile = false;
    const mobileNavButton = document.getElementById("mobile-nav-button");
    mobileNavButton?.remove();
    const mobileDialog = document.getElementById("mobile-nav-dialog");
    mobileDialog?.remove();
    header.appendChild(nav);
  }

  function switchToMobileNav() {
    if (isMobile) { return };

    isMobile = true;

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