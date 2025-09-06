import { Assets } from "pixi.js";
import BaseState from "./BaseState";
import IntroState from "./IntroState";
export default class LoadingState extends BaseState {

    public async enter() {
        console.log("Loading")
        this.load();
    }

    protected async load() {
        await Promise.all([
            this.loadAssets(),
            this.app.dataManager.loadData()
        ])
        this.exit();
    }

    protected async loadAssets() {
        Assets.add([
            {alias: "galaxy", src: "/assets/galaxy.png"},
            {alias: "location", src: "/assets/location.png"},
            {alias: "exit", src: "/assets/exit.png"}
        ]);
        Assets.addBundle("fonts", {
            main: {
                src: "/assets/0xProto.ttf",
                data: { family: "main" }
            }
        });
        await Promise.all([
            Assets.load(["galaxy", "location", "exit"]),
            Assets.loadBundle("fonts")
        ])
    }

    public async exit() {
        this.app.stateManager.loadNewState(new IntroState(this.app));
        console.log("Loading finished")
    }
}