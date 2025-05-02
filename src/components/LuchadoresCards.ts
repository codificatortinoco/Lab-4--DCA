import { Luchador } from '../types/Luchador';

/**
 * A custom element that displays a luchador card with voting functionality
 */
export default class LuchadoresCards extends HTMLElement {
    private luchador: Luchador;
    private onVote: () => void;
    private matchId: string;

    /**
     * Creates a new LuchadoresCards instance
     * @param luchador - The luchador object containing the wrestler's information
     * @param onVote - Callback function triggered when the vote button is clicked
     * @param matchId - The ID of the match this card belongs to
     */
    constructor(luchador: Luchador, onVote: () => void, matchId: string) {
        super();
        this.luchador = luchador;
        this.onVote = onVote;
        this.matchId = matchId;
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    /**
     * Checks if the match has been voted on
     */
    private isMatchVoted(): boolean {
        return sessionStorage.getItem(`match_${this.matchId}_voted`) === 'true';
    }

    /**
     * Handles the vote button click
     */
    private handleVoteClick = () => {
        if (!this.isMatchVoted()) {
            this.onVote();
            sessionStorage.setItem(`match_${this.matchId}_voted`, 'true');
            this.render(); // Re-render to update button state
        }
    };

    /**
     * Renders the luchador card
     */
    private render(): void {
        if (!this.shadowRoot) return;

        // Clear previous content
        this.shadowRoot.innerHTML = '';

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                width: 300px;
                margin: 10px;
            }
            .luchador-card {
                background: white;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
            }
            img {
                width: 200px;
                height: 200px;
                object-fit: cover;
                border-radius: 4px;
                margin-bottom: 10px;
            }
            h2 {
                margin: 10px 0;
                color: #333;
                font-size: 1.5em;
            }
            p {
                margin: 8px 0;
                color: #666;
            }
            .vote-button {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 10px;
                transition: background-color 0.3s;
            }
            .vote-button:hover:not(:disabled) {
                background: #45a049;
            }
            .vote-button:disabled {
                background: #cccccc;
                cursor: not-allowed;
            }
        `;

        const card = document.createElement('div');
        card.className = 'luchador-card';

        const image = document.createElement('img');
        image.src = this.luchador.image;
        image.alt = this.luchador.name;

        const name = document.createElement('h2');
        name.textContent = this.luchador.name;

        const votes = document.createElement('p');
        votes.textContent = `Votes: ${this.luchador.votes || 0}`;

        const button = document.createElement('button');
        button.className = 'vote-button';
        button.textContent = this.isMatchVoted() ? 'Already Voted' : 'Vote';
        button.disabled = this.isMatchVoted();
        button.addEventListener('click', this.handleVoteClick);

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(votes);
        card.appendChild(button);

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(card);
    }
} 
