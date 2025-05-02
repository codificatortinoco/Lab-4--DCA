import { Dispatcher } from './Dispatcher';

interface Action {
    type: string;
    payload: any;
}

export class Actions {
    private dispatcher: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.dispatcher = dispatcher;
    }

    createMatchId(luchadorId1: number, luchadorId2: number): string {
        return [luchadorId1, luchadorId2].sort().join('_');
    }

    vote(luchadorId: number, matchId: string): void {
        this.dispatcher.dispatch({
            type: 'VOTE',
            payload: { luchadorId, matchId }
        });
    }
}
