import { Luchador } from '../types/Luchador';
import { Dispatcher } from '../flux/Dispatcher';
import { Store } from '../flux/Store';
import { Actions } from '../flux/Actions';
import LuchadoresCards from './LuchadoresCards';
import { fetchLuchador } from '../services/services';
import type { Luchador as ApiLuchador } from '../types/Luchadores.types';

/**
 * A custom element that manages the display of luchador matches and voting functionality
 */
export default class LuchadoresContainer extends HTMLElement {
    private luchadores: Luchador[] = [];
    private dispatcher: Dispatcher;
    private store: Store;
    private actions: Actions;

    /**
     * Creates a new LuchadoresContainer instance
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.dispatcher = new Dispatcher();
        this.store = new Store(this.dispatcher, []);
        this.actions = new Actions(this.dispatcher);
        this.initialize();
    }

    /**
     * Maps an API luchador to our component format
     */
    private mapLuchador(apiLuchador: ApiLuchador): Luchador {
        return {
            id: apiLuchador.id,
            name: apiLuchador.nombre,
            image: apiLuchador.imagen,
            votes: apiLuchador.votos
        };
    }

    /**
     * Initializes the container and sets up event listeners
     */
    private async initialize(): Promise<void> {
        await this.fetchLuchadores();
        this.store.on('change', () => this.handleStoreChange());
        this.render();
    }

    /**
     * Fetches luchador data from the local JSON file
     */
    private async fetchLuchadores(): Promise<void> {
        try {
            const data = await fetchLuchador();
            if (data === null) {
                throw new Error('Failed to load luchadores');
            }
            const apiLuchadores = Array.isArray(data) ? data : [data];
            this.luchadores = apiLuchadores.map(l => this.mapLuchador(l));
            this.store.luchadores = this.luchadores;
        } catch (error) {
            console.error('Error fetching luchadores:', error);
            this.showError('Error loading luchadores. Please try again later.');
        }
    }

    /**
     * Shows an error message in the container
     */
    private showError(message: string): void {
        if (!this.shadowRoot) return;
        const error = document.createElement('div');
        error.className = 'error';
        error.textContent = message;
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(error);
    }

    /**
     * Handles store changes by updating the luchadores array
     */
    private handleStoreChange(): void {
        this.luchadores = this.store.getLuchadores();
        this.render();
    }

    /**
     * Handles the vote action for a specific luchador
     * @param luchadorId - The ID of the luchador to vote for
     */
    private handleVote(luchadorId: number): void {
        this.actions.vote(luchadorId);
    }

    /**
     * Renders the luchador matches in pairs
     */
    private render(): void {
        if (!this.shadowRoot) return;

        // Clear the container
        this.shadowRoot.innerHTML = '';

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                padding: 20px;
                font-family: Arial, sans-serif;
            }
            .luchador-container {
                max-width: 1200px;
                margin: 0 auto;
            }
            .match-container {
                display: flex;
                justify-content: space-between;
                margin: 20px 0;
                padding: 20px;
                background: #f5f5f5;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .error {
                color: red;
                padding: 20px;
                text-align: center;
                font-size: 16px;
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

        // Create match pairs
        for (let i = 0; i < this.luchadores.length; i += 2) {
            if (i + 1 < this.luchadores.length) {
                const matchContainer = document.createElement('div');
                matchContainer.className = 'match-container';

                const matchId = this.actions.createMatchId(
                    this.luchadores[i].id,
                    this.luchadores[i + 1].id
                );

                const card1 = new LuchadoresCards(
                    this.luchadores[i],
                    () => this.handleVote(this.luchadores[i].id),
                    matchId
                );

                const card2 = new LuchadoresCards(
                    this.luchadores[i + 1],
                    () => this.handleVote(this.luchadores[i + 1].id),
                    matchId
                );

                matchContainer.appendChild(card1);
                matchContainer.appendChild(card2);
                container.appendChild(matchContainer);
            }
        }

        this.shadowRoot.appendChild(container);
    }
}
