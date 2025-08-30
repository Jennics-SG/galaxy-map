let instance: StateManager;
import BaseState from "./states/BaseState";

export default class StateManager{
    protected _currentState: BaseState | null = null;

    constructor(){
        if (instance) return instance;
        instance = this;
    }

    public async loadNewState(newState: BaseState) {
        if (this._currentState) {
            this._currentState.destroy({children: true});
            this._currentState = null;
        }
        this._currentState = newState;
        await this._currentState.enter();
    }
}