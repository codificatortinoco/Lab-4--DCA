import { EventEmitter } from 'events';
import { Dispatcher } from './Dispatcher';
import { Luchador } from '../types/Luchador';

/**
 * Action interface for type-safe action handling
 */
interface Action {
    type: string;
    payload: any;
}

/**
 * A store that manages the state of luchadores and handles actions
 */
export class Store extends EventEmitter {
    private dispatcher: Dispatcher;
    private _luchadores: Luchador[];

    /**
     * Creates a new Store instance
     * @param dispatcher - The dispatcher instance to use
     * @param initialLuchadores - Initial array of luchadores
     */
    constructor(dispatcher: Dispatcher, initialLuchadores: Luchador[]) {
        super();
        this.dispatcher = dispatcher;
        this._luchadores = initialLuchadores;

        this.dispatcher.on('action', this.handleAction.bind(this));
    }

    /**
     * Gets the current array of luchadores
     */
    get luchadores(): Luchador[] {
        return this._luchadores;
    }

    /**
     * Sets the array of luchadores
     */
    set luchadores(value: Luchador[]) {
        this._luchadores = value;
    }

    /**
     * Handles incoming actions
     * @param action - The action to handle
     */
    private handleAction(action: Action): void {
        switch (action.type) {
            case 'VOTE':
                this.handleVote(action.payload.luchadorId);
                break;
        }
    }

    /**
     * Handles the vote action by incrementing the vote count for a luchador
     * @param luchadorId - The ID of the luchador to vote for
     */
    private handleVote(luchadorId: number): void {
        this._luchadores = this._luchadores.map(luchador => {
            if (luchador.id === luchadorId) {
                return {
                    ...luchador,
                    votes: (luchador.votes || 0) + 1
                };
            }
            return luchador;
        });
        this.emit('change');
    }

    /**
     * Gets the current array of luchadores
     * @returns The current array of luchadores
     */
    getLuchadores(): Luchador[] {
        return this._luchadores;
    }
}
