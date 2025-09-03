let instance: StateManager;
import BaseState from "./states/BaseState";
import gsap from "gsap";

export default class StateManager{
    protected _currentState: BaseState | null = null;

    protected _canRebuild = false;
    protected _isRebuildDebounced = false;

    constructor(){
        if (instance) return instance;
        instance = this;
        window.addEventListener('resize', this.reloadState.bind(this));
    }

    public async loadNewState(newState: BaseState) {
        if (this._currentState) {
            this._currentState.destroy({children: true});
            this._currentState = null;
        }
        this._currentState = newState;
        await this._currentState.enter();
    }

    public async reloadState() {
        if (!this._currentState) return;

        if (!this._canRebuild && !this._isRebuildDebounced) {
            this._isRebuildDebounced = true;
            gsap.delayedCall(1, this.reloadState.bind(this));
            return;
        }

        this._isRebuildDebounced = false;
        this._canRebuild = false;
        gsap.delayedCall(1, () => this._canRebuild = true);

    }
}