import LuchadoresContainer from "./components/LuchadoresContainer";
import LuchadoresCards from './components/LuchadoresCards';

if (!customElements.get('luchadores-cards')) {
    customElements.define("luchadores-cards", LuchadoresCards);
}

if (!customElements.get('luchador-container')) {
    customElements.define("luchador-container", LuchadoresContainer);
}

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app') || document.body;
    const container = document.createElement('luchador-container');
    app.appendChild(container);
});

console.log('Luchador components initialized'); 