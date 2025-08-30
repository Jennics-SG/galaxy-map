import BaseState from "./BaseState";
import StarryBackground from "../components/StarryBackground";
import GalaxyMap from "../components/GalaxyMap";

export default class MapState extends BaseState {

    protected _background: StarryBackground;
    protected _galaxyMap: GalaxyMap

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

        this._galaxyMap = new GalaxyMap(this.app);
        this.addChild(this._galaxyMap);
    }

    public async fadeIn() {
        // await this._background.fadeIn();

        await Promise.all([
            this._background.fadeIn(),
            this._galaxyMap.fadeIn()
        ])

    }

    public async exit() {

    }
}