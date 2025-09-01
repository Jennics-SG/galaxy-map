import { Container, Assets, Sprite, GlProgram, Filter, defaultFilterVert } from "pixi.js";
import App from "../app";
import gsap from "gsap";
import frag from '../shaders/galaxy.frag?raw';

export default class GalaxyMap extends Container {

    protected _app: App
    protected _galaxy: Sprite;
    protected _galaxyRotation: gsap.core.Tween;
    protected _galaxySkew: gsap.core.Tween;
    protected _targetScale: number

    public async fadeIn() {
        await gsap.to(this._galaxy.scale, {
            delay: 0.3,
            duration: 1,
            x: this._targetScale,
            y: this._targetScale
        });
        this.startRotation();
    }

    public startRotation() {
        const dur = 360/2
        // Rotate continuously
        gsap.to(this._galaxy, {
            duration: dur,
            rotation: Math.PI * 2,
            repeat: -1,
            ease: "linear"
        });


        // Fake 3D skew effect
        gsap.to(this._galaxy.skew, {
            duration: dur / 10,
            x: 0.45,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

        // Optional: slight scale to enhance depth
        gsap.to(this._galaxy.scale, {
            duration: dur / 10,
            x: this._targetScale * 1.1,
            y: this._targetScale * 0.9,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

    }

    constructor(app: App) {
        super();
        this._app = app;
        this.buildSelf();
    }

    protected buildSelf() {
        const program = new GlProgram({
            vertex: defaultFilterVert,
            fragment: frag
        });

        const filter = new Filter({
            glProgram: program
        });

        this._galaxy = new Sprite(Assets.get("galaxy"));
        this._galaxy.alpha = 0.95;
        this._galaxy.pivot.set(this._galaxy.width / 2, this._galaxy.height / 2)
        this._galaxy.position.set(this._app.screen.width / 2, this._app.screen.height / 2)
        this._galaxy.blendMode = "screen"

        this._galaxy.filters=[filter];

        this.addChild(this._galaxy);

        const targetWidth = this._app.screen.width < this._app.screen.height ?
            this._app.screen.width / 0.7 : this._app.screen.width / 1.2;
        this._targetScale = targetWidth / this._galaxy.width;

        this._galaxy.scale.set(this._targetScale * 3, 0);
        this._galaxy.skew.set(0.4, 0);
    }
}