import { Luchador} from '../types/Luchador.types';
import { Dispatcher } from '../flux/Dispatcher';
import { Store } from '../flux/Store';
import { Actions } from '../flux/Actions';
import LuchadoresCards from './LuchadoresCards';
import VotingStatistics from './VotingStatistics';
import { fetchLuchador } from '../services/services';


export default class LuchadoresContainer extends HTMLElement {
    private luchadores: Luchador[] = [];
    private dispatcher: Dispatcher;
    private store: Store;
    private actions: Actions;
    private matchContainers: Map<string, HTMLElement>;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.dispatcher = new Dispatcher();
        this.store = new Store(this.dispatcher, []);
        this.actions = new Actions(this.dispatcher);
        this.matchContainers = new Map();
        this.initialize();
    }

    private mapLuchador(luchador: Luchador): Luchador {
        return { ...luchador };
    }

    private async initialize(): Promise<void> {
        await this.fetchLuchadores();
        this.store.on('change', () => this.handleStoreChange());
        this.store.on('matchVoted', (matchId: string) => this.handleMatchVoted(matchId));
        this.render();
    }

    private async fetchLuchadores(): Promise<void> {
        try {
            const data = await fetchLuchador();
            if (data === null) {
                throw new Error('Failed to load luchadores');
            }
            this.luchadores = Array.isArray(data) ? data : [data];
            this.store.luchadores = this.luchadores;
        } catch (error) {
            console.error('Error fetching luchadores:', error);
            this.showError('Error loading luchadores. Please try again later.');
        }
    }

    private showError(message: string): void {
        if (!this.shadowRoot) return;
        const error = document.createElement('div');
        error.className = 'error';
        error.textContent = message;
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(error);
    }

    private handleStoreChange(): void {
        this.luchadores = this.store.getLuchadores();
        this.updateVotes();
    }

    private handleMatchVoted(matchId: string): void {
        const matchContainer = this.matchContainers.get(matchId);
        if (matchContainer) {
            const cards = matchContainer.querySelectorAll('luchadores-cards');
            cards.forEach(card => {
                if (card instanceof LuchadoresCards) {
                    card.requestUpdate();
                }
            });
        }
    }

    private updateVotes(): void {
        this.matchContainers.forEach((container, matchId) => {
            const cards = container.querySelectorAll('luchadores-cards');
            cards.forEach(card => {
                if (card instanceof LuchadoresCards) {
                    card.requestUpdate();
                }
            });
        });
    }

    private handleVote(luchadorId: number, matchId: string): void {
        this.actions.vote(luchadorId, matchId);
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = '';
        this.matchContainers.clear();

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                padding: 20px;
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                min-height: 100vh;
            }
            .luchador-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            .match-container {
                display: flex;
                flex-direction: column;
                margin: 20px 0;
                padding: 20px;
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                border-radius: 15px;
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                border: 2px solid #ffd700;
                position: relative;
                overflow: hidden;
            }
            .match-container::before {
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
            .cards-container {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                position: relative;
                z-index: 2;
                gap: 20px;
            }
            .error {
                color: #ff4444;
                padding: 20px;
                text-align: center;
                font-size: 16px;
                background: rgba(0,0,0,0.3);
                border-radius: 8px;
                border: 1px solid #ff4444;
                text-transform: uppercase;
                letter-spacing: 1px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            @media (max-width: 768px) {
                .cards-container {
                    flex-direction: column;
                    align-items: center;
                }
                .match-container {
                    margin: 10px 0;
                    padding: 15px;
                }
            }
        `;
        this.shadowRoot.appendChild(style);

        const container = document.createElement('div');
        container.className = 'luchador-container';

        if (this.luchadores.length === 0) {
            container.textContent = 'Loading luchadores...';
            this.shadowRoot.appendChild(container);
            return;
        }

        for (let i = 0; i < this.luchadores.length; i += 2) {
            if (i + 1 < this.luchadores.length) {
                const matchContainer = document.createElement('div');
                matchContainer.className = 'match-container';

                const matchId = this.actions.createMatchId(
                    this.luchadores[i].id,
                    this.luchadores[i + 1].id
                );

                const cardsContainer = document.createElement('div');
                cardsContainer.className = 'cards-container';

                const card1 = new LuchadoresCards(
                    this.luchadores[i],
                    this.store
                );

                const card2 = new LuchadoresCards(
                    this.luchadores[i + 1],
                    this.store
                );

                const votingStats = new VotingStatistics(
                    this.store,
                    this.actions,
                    matchId,
                    this.luchadores[i],
                    this.luchadores[i + 1]
                );

                cardsContainer.appendChild(card1);
                cardsContainer.appendChild(card2);
                matchContainer.appendChild(cardsContainer);
                matchContainer.appendChild(votingStats);
                container.appendChild(matchContainer);
                this.matchContainers.set(matchId, matchContainer);
            }
        }

        this.shadowRoot.appendChild(container);
    }
}
