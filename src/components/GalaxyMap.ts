import {
    Container, Assets, Sprite,
    GlProgram, Filter, defaultFilterVert,
    EventEmitter, Point
} from "pixi.js";
import App from "../app";
import gsap from "gsap";
import frag from '../shaders/galaxy.frag?raw';
import Entry from "./Entry";

export default class GalaxyMap extends Container {

    public event = new EventEmitter();

    protected _app: App
    protected _galaxy: Sprite;
    protected _galaxyRotation: gsap.core.Tween;
    protected _galaxySkew: gsap.core.Tween;
    protected _targetScale: number
    protected _entries: Entry[] = [];

    public async fadeIn() {
        this._galaxy.scale.set(this._targetScale * 3, 0);
        this._galaxy.skew.set(0.4, 0);
        await gsap.to(this._galaxy.scale, {
            delay: 0.3,
            duration: 1,
            x: this._targetScale,
            y: this._targetScale
        });

        await gsap.to(this._entries, {
            duration: 1,
            delay: 0.3,
            stagger: 0.2,
            alpha: 1,
            ease: "bounce.out"
        })

        this.startRotation();
    }

    public startRotation() {
        const dur = 360*2
        // Rotate continuously
        gsap.to(this, {
            duration: dur,
            rotation: Math.PI * 2,
            repeat: -1,
            ease: "linear",
            onUpdate: () => this._entries.forEach(entry => entry.rotation = -this.rotation)
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
        gsap.to(this.scale, {
            duration: dur / 10,
            x: 1.1,
            y: 0.9,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }

    constructor(app: App) {
        super();
        this._app = app;
        this.pivot.set(this._app.renderer.width, this._app.screen.height);
        this.position.set(this._app.renderer.width / 2, this._app.screen.height / 2);
        this.buildSelf();
    }

    protected buildSelf() {
        this.buildGalaxy();
        this.buildEntries();
    }

    protected buildGalaxy() {
        const program = new GlProgram({
            vertex: defaultFilterVert,
            fragment: frag
        });
        const filter = new Filter({
            glProgram: program
        });

        this._galaxy = new Sprite(Assets.get("galaxy"));
        this._galaxy.alpha = 0.95;
        this._galaxy.pivot.set(this._galaxy.width / 2, this._galaxy.height / 2);
        this._galaxy.position.set(this._app.renderer.width, this._app.screen.height);
        this._galaxy.blendMode = "screen";
        this._galaxy.filters=[filter];

        const targetWidth = this._app.renderer.width < this._app.screen.height ?
            this._app.renderer.width / 0.7 : this._app.renderer.width / 1.2;
        this._targetScale = targetWidth / this._galaxy.width;

        this.addChild(this._galaxy);
    }

    protected buildEntries() {
        if (this._entries) {
            this._entries.forEach(entry => entry.destroy({children: true, texture: true}));
            this._entries = [];
        }

        const keys = this._app.dataManager.keys;
        for (const key of keys) {
            const entry = new Entry(this._app, key);
            entry.position.copyFrom(this.getRandomPosition());
            entry.alpha = 0;
            entry.onpointerdown= _ => this.onEntryDown(entry.key);
            this.addChild(entry);
            this._entries.push(entry);
        }
    }

    protected getRandomPosition() {
        // Generate a random point within the galaxy sprite
        return new Point(
            this._galaxy.x + Math.floor(Math.random() * this._galaxy.width / 4) - this._galaxy.width / 8,
            this._galaxy.y + (Math.floor(Math.random() * this._galaxy.height / 4) - this._galaxy.height / 8)
        )
    }

    protected onEntryDown(key: string) {
        this.event.emit("entryDown", key);
    }
}