class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const title = document.createElement('h1');
    title.textContent = 'Lotto Number Generator';

    const numbersContainer = document.createElement('div');
    numbersContainer.setAttribute('class', 'numbers');

    const button = document.createElement('button');
    button.textContent = 'Generate Numbers';

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
      .numbers {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        justify-content: center;
      }
      .number {
        display: grid;
        place-content: center;
        width: 50px;
        height: 50px;
        border-radius: 50%;
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

    const generateNumbers = () => {
      const numbers = new Set();
      while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
      }
      numbersContainer.innerHTML = '';
      [...numbers].sort((a,b) => a-b).forEach(number => {
        const numberEl = document.createElement('div');
        numberEl.setAttribute('class', 'number');
        numberEl.textContent = number;
        numbersContainer.appendChild(numberEl);
      });
    };

    button.addEventListener('click', generateNumbers);

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(title);
    wrapper.appendChild(numbersContainer);
    wrapper.appendChild(button);

    generateNumbers();
  }
}

customElements.define('lotto-generator', LottoGenerator);
