import { Dispatcher } from './Dispatcher';

/**
 * Action interface for type-safe action handling
 */
interface Action {
    type: string;
    payload: any;
}

/**
 * A class that defines and dispatches actions
 */
export class Actions {
    private dispatcher: Dispatcher;

    /**
     * Creates a new Actions instance
     * @param dispatcher - The dispatcher instance to use
     */
    constructor(dispatcher: Dispatcher) {
        this.dispatcher = dispatcher;
    }

    /**
     * Creates a match ID from two luchador IDs
     * @param luchador1Id - The ID of the first luchador
     * @param luchador2Id - The ID of the second luchador
     * @returns A unique match ID string
     */
    createMatchId(luchador1Id: number, luchador2Id: number): string {
        return `match_${Math.min(luchador1Id, luchador2Id)}_vs_${Math.max(luchador1Id, luchador2Id)}`;
    }

    /**
     * Dispatches a vote action for a luchador
     * @param luchadorId - The ID of the luchador to vote for
     */
    vote(luchadorId: number): void {
        this.dispatcher.dispatch({
            type: 'VOTE',
            payload: { luchadorId }
        });
    }
}
