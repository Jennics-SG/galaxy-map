import { Assets } from "pixi.js";
import BaseState from "./BaseState";
import IntroState from "./IntroState";
// import MapState from "./MapState";

export default class LoadingState extends BaseState {

    public async enter() {
        console.log("Loading")
        this.loadAssets();
    }

    protected async loadAssets() {
        Assets.add({alias: "galaxy", src: "/assets/galaxy.png"});
        await Assets.load("galaxy");

        Assets.add({alias: "location", src: "/assets/location.png"});
        await Assets.load("location");

        Assets.add({alias: "exit", src: "/assets/exit.png"});
        await Assets.load("exit");

        Assets.addBundle("fonts", {
            main: {
                src: "/assets/0xProto.ttf",
                data: { family: "main" }
            }
        });
        await Assets.loadBundle("fonts");

        this.exit();
    }

    public async exit() {
        this.app.stateManager.loadNewState(new IntroState(this.app));
        console.log("Loading finished")
    }
}