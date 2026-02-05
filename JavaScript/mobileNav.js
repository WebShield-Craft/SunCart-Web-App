
const mobileNav = document.querySelector("#mobileNav");
const mobileMenu = document.querySelector("#mobileMenu");
const openBtn = document.querySelector("#openMobileNav");
const closeBtn = document.querySelector("#closeMobileNav");

// Open menu
openBtn.addEventListener("click", () => {
  mobileNav.classList.remove("hidden");
  setTimeout(() => {
    mobileNav.classList.add("opacity-100");
    mobileMenu.classList.remove("-translate-x-full");
  }, 10);
});

// Close menu
const closeMenu = () => {
  mobileNav.classList.remove("opacity-100");
  mobileMenu.classList.add("-translate-x-full");
  setTimeout(() => {
    mobileNav.classList.add("hidden");
  }, 300); // matches duration-300
}

closeBtn.addEventListener("click", closeMenu);

// Close when clicking overlay
mobileNav.addEventListener("click", (e) => {
  if (!mobileMenu.contains(e.target)) {
    closeMenu();
  }
});