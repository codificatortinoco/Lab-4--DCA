import { Luchador } from '../types/Luchador.types';
import { Store } from '../flux/Store';
import { Actions } from '../flux/Actions';

export default class VotingStatistics extends HTMLElement {
    private store: Store;
    private actions: Actions;
    private matchId: string;
    private luchador1: Luchador;
    private luchador2: Luchador;

    constructor(
        store: Store,
        actions: Actions,
        matchId: string,
        luchador1: Luchador,
        luchador2: Luchador
    ) {
        super();
        this.store = store;
        this.actions = actions;
        this.matchId = matchId;
        this.luchador1 = luchador1;
        this.luchador2 = luchador2;
        this.attachShadow({ mode: 'open' });
        this.render();
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.store.on('change', () => this.render());
        this.store.on('matchVoted', (matchId: string) => {
            if (matchId === this.matchId) {
                this.render();
            }
        });
    }

    private handleVote(luchadorId: number): void {
        this.actions.vote(luchadorId, this.matchId);
    }

    private getLatestVotes(): { luchador1: number; luchador2: number } {
        const latestLuchadores = this.store.getLuchadores();
        const latestLuchador1 = latestLuchadores.find(l => l.id === this.luchador1.id) || this.luchador1;
        const latestLuchador2 = latestLuchadores.find(l => l.id === this.luchador2.id) || this.luchador2;
        
        return {
            luchador1: latestLuchador1.votos || 0,
            luchador2: latestLuchador2.votos || 0
        };
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = '';

        const isMatchVoted = this.store.isMatchVoted(this.matchId);
        const votes = this.getLatestVotes();
        const totalVotes = votes.luchador1 + votes.luchador2;
        const luchador1Percentage = totalVotes > 0 ? (votes.luchador1 / totalVotes) * 100 : 0;
        const luchador2Percentage = totalVotes > 0 ? (votes.luchador2 / totalVotes) * 100 : 0;

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                margin: 20px 0;
                padding: 20px;
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                border-radius: 15px;
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                border: 2px solid #ffd700;
                position: relative;
                overflow: hidden;
            }
            :host::before {
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
            .stats-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
                position: relative;
                z-index: 2;
            }
            .vote-buttons {
                display: flex;
                justify-content: space-around;
                margin: 15px 0;
                gap: 10px;
            }
            .vote-button {
                background: linear-gradient(45deg, #ffd700 0%, #ffcc00 100%);
                color: #1a1a1a;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                flex: 1;
                max-width: 200px;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                text-shadow: 1px 1px 0 rgba(255,255,255,0.3);
            }
            .vote-button:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(0,0,0,0.3);
            }
            .vote-button:disabled {
                background: linear-gradient(45deg, #666 0%, #444 100%);
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
                color: #999;
            }
            .progress-container {
                width: 100%;
                height: 25px;
                background: rgba(0,0,0,0.3);
                border-radius: 8px;
                overflow: hidden;
                position: relative;
                border: 1px solid rgba(255,255,255,0.1);
            }
            .progress-bar {
                height: 100%;
                transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                position: absolute;
                top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                color: #000000;
                text-shadow: 1px 1px 0 rgba(255,255,255,0.5);
            }
            .progress-bar-1 {
                background: linear-gradient(90deg, #FFD700, #FFC800);
                left: 0;
                z-index: 2;
                border-right: 2px solid #000;
            }
            .progress-bar-2 {
                background: linear-gradient(90deg, #C0C0C0, #A0A0A0);
                right: 0;
                z-index: 1;
            }
            .progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.3));
            }
            .stats-info {
                display: flex;
                justify-content: space-between;
                font-size: 16px;
                color: #ffd700;
                margin-top: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .vote-count {
                font-weight: bold;
                color: white;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            .match-status {
                text-align: center;
                margin: 10px 0;
                font-weight: bold;
                color: ${isMatchVoted ? '#ffd700' : '#ff4444'};
                transition: color 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
        `;

        const container = document.createElement('div');
        container.className = 'stats-container';

        // Match status
        const status = document.createElement('div');
        status.className = 'match-status';
        status.textContent = isMatchVoted ? 'Match Voted' : 'Match Open for Voting';

        // Vote buttons
        const buttons = document.createElement('div');
        buttons.className = 'vote-buttons';

        const button1 = document.createElement('button');
        button1.className = 'vote-button';
        button1.textContent = `Vote for ${this.luchador1.nombre}`;
        button1.disabled = isMatchVoted;
        button1.addEventListener('click', () => this.handleVote(this.luchador1.id));

        const button2 = document.createElement('button');
        button2.className = 'vote-button';
        button2.textContent = `Vote for ${this.luchador2.nombre}`;
        button2.disabled = isMatchVoted;
        button2.addEventListener('click', () => this.handleVote(this.luchador2.id));

        buttons.appendChild(button1);
        buttons.appendChild(button2);

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';

        const progressBar1 = document.createElement('div');
        progressBar1.className = 'progress-bar progress-bar-1';
        progressBar1.style.width = `${luchador1Percentage}%`;
        progressBar1.textContent = `${luchador1Percentage.toFixed(1)}%`;

        const progressBar2 = document.createElement('div');
        progressBar2.className = 'progress-bar progress-bar-2';
        progressBar2.style.width = `${luchador2Percentage}%`;
        progressBar2.textContent = `${luchador2Percentage.toFixed(1)}%`;

        progressContainer.appendChild(progressBar1);
        progressContainer.appendChild(progressBar2);

        const statsInfo = document.createElement('div');
        statsInfo.className = 'stats-info';
        statsInfo.innerHTML = `
            <span>${this.luchador1.nombre}: <span class="vote-count">${votes.luchador1}</span> votes</span>
            <span>${this.luchador2.nombre}: <span class="vote-count">${votes.luchador2}</span> votes</span>
        `;

        container.appendChild(status);
        container.appendChild(buttons);
        container.appendChild(progressContainer);
        container.appendChild(statsInfo);

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);
    }
}

customElements.define('voting-statistics', VotingStatistics); 