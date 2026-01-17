class DinnerRecommender extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const title = document.createElement('h1');
    title.textContent = 'Dinner Menu Recommendation';

    const menuContainer = document.createElement('div');
    menuContainer.setAttribute('class', 'menu');

    const button = document.createElement('button');
    button.textContent = 'Recommend Dinner';

    const style = document.createElement('style');
    style.textContent = `
      .wrapper {
        text-align: center;
      }
      h1 {
        font-size: 2.5rem;
        color: var(--accent-color);
        margin-bottom: 2rem;
      }
      .menu {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        justify-content: center;
      }
      .menu-item {
        display: grid;
        place-content: center;
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: var(--accent-color);
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        box-shadow: 0 5px 10px -2px oklch(from var(--accent-color) calc(l - 0.1) c h / 0.4);
      }
      button {
        background-color: var(--accent-color);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
        box-shadow: 0 5px 10px -2px oklch(from var(--accent-color) calc(l - 0.1) c h / 0.4);
      }
      button:hover {
        background-color: oklch(from var(--accent-color) calc(l - 0.05) c h);
      }
    `;

    const dinnerMenus = [
      "Bibimbap", "Kimchi Jjigae", "Bulgogi", "Samgyeopsal", "Japchae",
      "Haemul Pajeon", "Sundubu Jjigae", "Tteokbokki", "Galbi", "Doenjang Jjigae"
    ];

    const recommendDinner = () => {
      const randomIndex = Math.floor(Math.random() * dinnerMenus.length);
      const recommendedMenu = dinnerMenus[randomIndex];
      menuContainer.innerHTML = '';
      const menuEl = document.createElement('div');
      menuEl.setAttribute('class', 'menu-item');
      menuEl.textContent = recommendedMenu;
      menuContainer.appendChild(menuEl);
    };

    button.addEventListener('click', recommendDinner);

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(title);
    wrapper.appendChild(menuContainer);
    wrapper.appendChild(button);

    recommendDinner();
  }
}

customElements.define('dinner-recommender', DinnerRecommender);

class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const button = document.createElement('button');
    button.textContent = 'Toggle Theme';

    const style = document.createElement('style');
    style.textContent = `
      button {
        position: fixed;
        top: 1rem;
        right: 1rem;
        background-color: var(--accent-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
        box-shadow: 0 5px 10px -2px oklch(from var(--accent-color) calc(l - 0.1) c h / 0.4);
      }
      button:hover {
        background-color: oklch(from var(--accent-color) calc(l - 0.05) c h);
      }
    `;

    const toggleTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    };

    button.addEventListener('click', toggleTheme);

    shadow.appendChild(style);
    shadow.appendChild(button);
  }
}

customElements.define('theme-toggle', ThemeToggle);

