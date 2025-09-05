import { Application } from "pixi.js";
import StateManager from "./stateManager";
import LoadingState from "./states/LoadingState";
import DataManager from "./dataManager";

export default class App extends Application {

    public stateManager = new StateManager();
    public dataManager = new DataManager();

    constructor() {
        super();
    }

    async init() {
        await super.init({
            width: 1920,
            height: 1080,
            // resolution: 2,
            resizeTo: window,
            antialias: true,
        });
        this.stateManager.loadNewState(new LoadingState(this));
    }
}