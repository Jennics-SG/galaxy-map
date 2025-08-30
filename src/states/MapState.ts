import BaseState from "./BaseState";
import StarryBackground from "../components/StarryBackground";
import gsap from "gsap";

export default class MapState extends BaseState {

    protected _background: StarryBackground;

    public async enter() {
        await this.buildComponents();
        this.visible = true;
        // this.alpha = 0;
        this.app.stage.addChild(this);
        await this.fadeIn();
    }

    public async buildComponents() {
        this._background = new StarryBackground(this.app);
        this.addChild(this._background);
    }

    public async fadeIn() {
        await this._background.fadeIn();
    }

    public async exit() {

    }
}