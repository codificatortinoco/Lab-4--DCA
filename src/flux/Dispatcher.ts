import { EventEmitter } from 'events';

/**
 * Action interface for type-safe action handling
 */
interface Action {
    type: string;
    payload: any;
}

/**
 * A dispatcher that manages the flow of actions to stores
 */
export class Dispatcher extends EventEmitter {
    /**
     * Dispatches an action to all registered stores
     * @param action - The action to dispatch
     */
    dispatch(action: Action): void {
        this.emit('action', action);
    }
}
