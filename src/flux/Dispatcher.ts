import { EventEmitter } from 'events';

interface Action {
    type: string;
    payload: any;
}

export class Dispatcher extends EventEmitter {

    dispatch(action: Action): void {
        this.emit('action', action);
    }
}
