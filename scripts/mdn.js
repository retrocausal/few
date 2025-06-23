// Constants for DOM elements and configuration
const SELECTORS = {
  main: "main",
  article: "article",
  drawer: "#theme-drawer",
  drawerToggle: "#theme-toggler",
};
const THEME_CONFIG = {
  auto: "auto",
  manual: "manual",
  dark: "dark",
  light: "light",
};
const MESSAGE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, lacus in consectetur pharetra, ipsum velit convallis nibh, vel pulvinar purus tellus eu urna. Donec vitae fermentum massa, id imperdiet leo. Vestibulum sed ipsum sed ipsum varius lobortis. Vivamus eros enim, lacinia vel libero nec, imperdiet fermentum massa. Integer tincidunt molestie tortor. In nisi nulla, laoreet fermentum semper eget, volutpat sit amet sem. Donec pretium, libero nec congue fermentum, nibh magna pretium nulla, vel ultricies arcu tellus vel ligula. Quisque egestas mi velit, vitae efficitur mi aliquam et.`;
const THEME_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Utility to query DOM with error handling
const queryElement = (selector) => {
  const element = document.querySelector(selector);
  if (!element) console.warn(`Element not found: ${selector}`);
  return element;
};

// Append paragraphs to article
const appendParagraphs = (article) => {
  if (!article) throw new Error("Article element not found");
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 150; i++) {
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = MESSAGE;
    div.appendChild(p);
    fragment.appendChild(div);
  }
  article.appendChild(fragment);
};

// Toggle theme drawer visibility
const toggleThemeDrawer = () => {
  const drawer = queryElement(SELECTORS.drawer);
  if (drawer) {
    drawer.classList.toggle("hide");
    drawer.classList.toggle("show");
  } else throw new Error("Drawer element not found");
};

document.addEventListener("DOMContentLoaded", () => {
  const main = queryElement(SELECTORS.main);
  const article = queryElement(SELECTORS.article, main);
  appendParagraphs(article);
  const drawer = queryElement(SELECTORS.drawer);
  const drawerToggle = queryElement(SELECTORS.drawerToggle);
  if (drawerToggle) {
    drawerToggle.addEventListener("click", toggleThemeDrawer);
  }
  if (drawer) {
    drawer.addEventListener("click", changeTheme);
  }
  sessionStorage.setItem("sunDown", "");
});

// Initialize on window load
window.addEventListener("load", () => {
  if (document.documentElement.dataset.themeConfig === THEME_CONFIG.auto) {
    configureTheme();
  }
});

//ref error is not thrown because TDZ is not applicable here as the call to the below functions happen async

// Configure theme based on time of day
const configureTheme = () => {
  const setTheme = () => {
    const hour = new Date().getHours();
    const isSunDown =
      sessionStorage.getItem("sunDown") || hour >= 18 || hour < 6;
    document.body.dataset.theme = isSunDown
      ? THEME_CONFIG.dark
      : THEME_CONFIG.light;
  };
  setTheme();
  return setInterval(setTheme, THEME_CHECK_INTERVAL);
};

// Handle theme drawer click
const changeTheme = (event) => {
  const trigger = event.target.id;
  if (trigger !== THEME_CONFIG.auto) {
    document.body.dataset.theme = trigger;
    sessionStorage.setItem("tCfg", THEME_CONFIG.manual);
    sessionStorage.setItem("currentTheme", trigger);
    document.documentElement.dataset.themeConfig = THEME_CONFIG.manual;
  } else if (
    document.documentElement.dataset.themeConfig !== THEME_CONFIG.auto
  ) {
    sessionStorage.setItem("tCfg", THEME_CONFIG.auto);
    sessionStorage.removeItem("currentTheme");
    document.documentElement.dataset.themeConfig = THEME_CONFIG.auto;
    configureTheme();
  }
  toggleThemeDrawer();
};
