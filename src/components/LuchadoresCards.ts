import { Luchador } from '../types/Luchador.types';
import { Store } from '../flux/Store';

export default class LuchadoresCards extends HTMLElement {
    private luchador: Luchador;
    private store: Store;

    constructor(luchador: Luchador, store: Store) {
        super();
        this.luchador = luchador;
        this.store = store;
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    requestUpdate(): void {
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = '';

        const latestLuchadores = this.store.getLuchadores();
        const latestLuchador = latestLuchadores.find(l => l.id === this.luchador.id) || this.luchador;

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                width: 300px;
                margin: 10px;
                perspective: 1000px;
            }
            .luchador-card {
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                border-radius: 15px;
                padding: 20px;
                position: relative;
                color: white;
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: 2px solid #gold;
                text-align: center;
            }
            .luchador-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: repeating-linear-gradient(
                    45deg,
                    rgba(255,255,255,0.05) 0px,
                    rgba(255,255,255,0.05) 10px,
                    rgba(255,255,255,0) 10px,
                    rgba(255,255,255,0) 20px
                );
                z-index: 1;
            }
            .luchador-card:hover {
                transform: translateY(-10px) rotateX(5deg);
                box-shadow: 0 15px 30px rgba(0,0,0,0.4);
            }
            .card-content {
                position: relative;
                z-index: 2;
            }
            img {
                width: 100%;
                height: 300px;
                object-fit: cover;
                border-radius: 10px;
                margin-bottom: 15px;
                border: 3px solid #gold;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            h2 {
                margin: 15px 0;
                color: #ffd700;
                font-size: 1.8em;
                text-transform: uppercase;
                font-weight: 800;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                letter-spacing: 1px;
                text-align: center;
                background: linear-gradient(45deg, #ffd700 0%, #ffcc00 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 20px 0;
                background: rgba(0,0,0,0.3);
                padding: 15px;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,0.1);
                text-align: center;
            }
            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .stat-label {
                font-size: 0.8em;
                color: #ffd700;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
                font-weight: bold;
                text-align: center;
            }
            .stat-value {
                font-size: 1.1em;
                color: white;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                text-align: center;
            }
            .description {
                margin: 15px 0;
                padding: 15px;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                font-size: 0.9em;
                color: #e0e0e0;
                line-height: 1.6;
                border: 1px solid rgba(255,255,255,0.1);
                text-align: center;
            }
            .votes {
                margin-top: 15px;
                padding: 10px;
                background: linear-gradient(45deg, #ffd700 0%, #ffcc00 100%);
                border-radius: 8px;
                font-size: 1.1em;
                color: #1a1a1a;
                text-align: center;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 3px 6px rgba(0,0,0,0.2);
            }
            .vote-count {
                font-size: 1.2em;
                font-weight: 900;
                color: #1a1a1a;
                text-shadow: 1px 1px 0 rgba(255,255,255,0.3);
            }
        `;

        const card = document.createElement('div');
        card.className = 'luchador-card';

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';

        const image = document.createElement('img');
        image.src = latestLuchador.imagen;
        image.alt = latestLuchador.nombre;

        const name = document.createElement('h2');
        name.textContent = latestLuchador.nombre;

        const statsGrid = document.createElement('div');
        statsGrid.className = 'stats-grid';
        statsGrid.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Weight</span>
                <span class="stat-value">${latestLuchador.peso}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Height</span>
                <span class="stat-value">${latestLuchador.estatura}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Age</span>
                <span class="stat-value">${latestLuchador.edad} years</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Nationality</span>
                <span class="stat-value">${latestLuchador.nacionalidad}</span>
            </div>
        `;

        const description = document.createElement('div');
        description.className = 'description';
        description.textContent = latestLuchador.descripcion;

        const votes = document.createElement('div');
        votes.className = 'votes';
        votes.innerHTML = `Total Votes: <span class="vote-count">${latestLuchador.votos || 0}</span>`;

        cardContent.appendChild(image);
        cardContent.appendChild(name);
        cardContent.appendChild(statsGrid);
        cardContent.appendChild(description);
        cardContent.appendChild(votes);
        card.appendChild(cardContent);

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(card);
    }
}
customElements.define('luchadores-cards', LuchadoresCards); 
