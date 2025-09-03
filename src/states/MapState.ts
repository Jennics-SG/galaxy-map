import BaseState from "./BaseState";
import StarryBackground from "../components/StarryBackground";
import GalaxyMap from "../components/GalaxyMap";
import Modal from "../components/Modal";
import IntroModal from "../components/IntroModal";

export default class MapState extends BaseState {

    protected _background: StarryBackground;
    protected _galaxyMap: GalaxyMap
    protected _modal: Modal;
    protected _introModal: IntroModal;

    public async enter() {
        await this.buildComponents();
        this.visible = true;
        this.app.stage.addChild(this);
        await this.fadeIn();
    }

    public async buildComponents() {
        this._background = new StarryBackground(this.app);
        this.addChild(this._background);

        this._galaxyMap = new GalaxyMap(this.app);
        this._galaxyMap.event.on("entryDown", this.handleEntryDown.bind(this))
        this.addChild(this._galaxyMap);

        this._modal = new Modal(this.app);
        this._modal.eventMode = "dynamic";
        this.addChild(this._modal);

        this._introModal = new IntroModal(this.app);
        this._introModal.eventMode = "dynamic";
        this.addChild(this._introModal);
    }

    public async fadeIn() {
        await Promise.all([
            this._background.fadeIn(),
            this._galaxyMap.fadeIn()
        ])
        // this.handleEntryDown("AboutMe");
        this._introModal.show();
    }

    protected handleEntryDown(key: string) {
        console.log("Showing modal with", key);
        if (!this._modal) throw "no modal?"

        if (key == "About Me") {
            this._introModal.show();
            return;
        }

        this._modal.show(key)
    }

    public async exit() {

    }
}