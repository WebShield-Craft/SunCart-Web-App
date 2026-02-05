
// Get all dropdown toggles and menus
const toggleBtns = document.querySelectorAll(".dropdown-toggle");
const menus = document.querySelectorAll(".dropdown-menu");

toggleBtns.forEach((btn, index) => {
  const menu = menus[index];

  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    
    menus.forEach((otherMenu) => {
      if (otherMenu !== menu) {
        otherMenu.classList.remove("opacity-100", "scale-100", "translate-y-0");
        otherMenu.classList.add("opacity-0", "scale-95", "-translate-y-2");
        setTimeout(() => otherMenu.classList.add("hidden"), 300);
      }
    });

    
    if (menu.classList.contains("hidden")) {
      menu.classList.remove("hidden");
      requestAnimationFrame(() => {
        menu.classList.remove("opacity-0", "scale-95", "-translate-y-2");
        menu.classList.add("opacity-100", "scale-100", "translate-y-0");
      });
    } else {
      menu.classList.remove("opacity-100", "scale-100", "translate-y-0");
      menu.classList.add("opacity-0", "scale-95", "-translate-y-2");
      setTimeout(() => menu.classList.add("hidden"), 300);
    }
  });
});


document.addEventListener("click", (e) => {
  menus.forEach((menu, index) => {
    const btn = toggleBtns[index];
    if (
      !menu.classList.contains("hidden") &&
      !menu.contains(e.target) &&
      e.target !== btn
    ) {
      menu.classList.remove("opacity-100", "scale-100", "translate-y-0");
      menu.classList.add("opacity-0", "scale-95", "-translate-y-2");
      setTimeout(() => menu.classList.add("hidden"), 300);
    }
  });
});
