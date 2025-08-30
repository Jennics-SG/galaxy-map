import { Assets } from "pixi.js";
import BaseState from "./BaseState";
import IntroState from "./IntroState";

export default class LoadingState extends BaseState {

    public async enter() {
        console.log("Loading")
        this.loadAssets();
    }

    protected async loadAssets() {
        Assets.add({alias: "galaxy", src: "/public/galaxy.png"});
        await Assets.load("galaxy");
        this.exit();
    }

    public async exit() {
        this.app.stateManager.loadNewState(new IntroState(this.app));
        console.log("Loading finished")
    }
}