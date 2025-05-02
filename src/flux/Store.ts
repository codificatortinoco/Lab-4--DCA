import { EventEmitter } from 'events';
import { Dispatcher } from './Dispatcher';
import { Luchador } from '../types/Luchador.types';

interface Action {
    type: string;
    payload: any;
}
export class Store extends EventEmitter {
    private dispatcher: Dispatcher;
    private _luchadores: Luchador[];

    constructor(dispatcher: Dispatcher, initialLuchadores: Luchador[]) {
        super();
        this.dispatcher = dispatcher;
        this._luchadores = initialLuchadores.map(luchador => ({
            ...luchador,
            votos: luchador.votos || 0
        }));

        this.dispatcher.on('action', this.handleAction.bind(this));
    }

    get luchadores(): Luchador[] {
        return this._luchadores;
    }

    set luchadores(value: Luchador[]) {
        this._luchadores = value.map(luchador => ({
            ...luchador,
            votos: luchador.votos || 0
        }));
        this.emit('change');
    }

    isMatchVoted(matchId: string): boolean {
        return sessionStorage.getItem(`match_${matchId}_voted`) === 'true';
    }

    private handleAction(action: Action): void {
        switch (action.type) {
            case 'VOTE':
                this.handleVote(action.payload.luchadorId, action.payload.matchId);
                break;
        }
    }

    private handleVote(luchadorId: number, matchId: string): void {
        if (!this.isMatchVoted(matchId)) {
            const updatedLuchadores = this._luchadores.map(luchador => {
                if (luchador.id === luchadorId) {
                    const currentVotes = luchador.votos || 0;
                    return {
                        ...luchador,
                        votos: currentVotes + 1
                    };
                }
                return luchador;
            });

            this._luchadores = updatedLuchadores;
            sessionStorage.setItem(`match_${matchId}_voted`, 'true');
            this.emit('change');
            this.emit('matchVoted', matchId);
        }
    }

    getLuchadores(): Luchador[] {
        return this._luchadores;
    }
}
