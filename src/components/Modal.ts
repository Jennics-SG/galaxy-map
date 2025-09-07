import { Container, Graphics, Text, Point, Sprite, Assets, GlProgram, defaultFilterVert, Filter } from "pixi.js";
import gsap from "gsap";
import App from "../app";
import planet from "../shaders/planet.frag?raw";

export default class Modal extends Container {

    // protected _heading
    protected _app: App;
    protected _width: number;
    protected _height: number;
    protected _headerFont: number;
    protected _bodyFont: number;
    protected _header: Text;
    protected _body: Text;
    protected _planet: Graphics;
    protected _planetFilter: Filter;

    public async show(key: string) {
        const data = this._app.dataManager.getData(key);
        this._header.text = data.header;
        this._body.text = data.body;
        this._planet.tint = data.tint;
        this._planet.filters = [this._planetFilter];

        const target = new Point(this._app.screen.width / 2, this._app.screen.height / 2);

        this.position.y = this._app.screen.height + this.height

        this.visible = true;
        gsap.to(this, {
            duration: 0.75,
            x: target.x,
            y: target.y,
            ease: "power4.out"
        });
    }

    public async hide() {
        await gsap.to(this, {
            duration: 0.75,
            y: this._app.screen.height + this.height
        });
        this.visible = false;
        this._planet.filters = null;
    }

    constructor(app: App) {
        super();
        this._app = app;

        this.visible = false;

        const screenW = this._app.renderer.width;
        if (screenW <= 480) {
            this._width = 290;
            this._height = 520;
            this._headerFont = 20;
            this._bodyFont = 14;
        } else if (screenW <= 768) {
            this._width = 480;
            this._height = 660;
            this._headerFont = 26
            this._bodyFont = 20;
        } else if (screenW <= 1024) {
            this._width = 700;
            this._height = 600;
            this._headerFont = 32
            this._bodyFont = 26;
        } else {
            this._width = 1020;
            this._height = 600;
            this._headerFont = 36;
            this._bodyFont = 30;
        }

        this.position.set(this._app.renderer.width / 2, this._app.screen.height / 2);
        this.buildSelf();
    }

    protected buildSelf() {

        const background = new Graphics();
        background.roundRect(0, 0, this._width, this._height);
        background.fill("#0c0c0cff");
        background.stroke({
            width: 3,
            color: "#c0c0c0"
        })
        background.pivot.set(this._width / 2, this._height / 2);
        this.addChild(background);

        this.buildPlanet();
        this.buildHeader();
        this.buildBody();

        const exitXDivisor = this._app.screen.width <= 1024 ?
            1.5 : 0.75;

        const exit = new Sprite(Assets.get("exit"));
        const exitX = this._width / 2 - (exit.width / exitXDivisor);
        const exitY = -this._height / 2 + exit.height;
        exit.anchor.set(0.5);
        exit.position.set(exitX, exitY);
        exit.eventMode = "dynamic";
        exit.onpointerdown = this.hide.bind(this);
        const targetWidth = this._width / 10;
        if (exit.width > targetWidth) {
            const scaleFactor = targetWidth / exit.width ;
            exit.scale.set(scaleFactor);
        }
        this.addChild(exit);
    }

    protected buildHeader() {
        this._header = new Text({
            text: "LOREM IPSUM",
            style: {
                fontSize: this._headerFont,
                fill: "#ffffff",
                // align: "right",
                fontFamily: "main",
                wordWrap: true,
                wordWrapWidth: this._width / 2
            },
            resolution: 2
        })

        const headerX = -this._width / 4;
        const headerY = -(this._height / 2) + this._header.height;

        if (this._header.width > this._width / 2) {
            const scaleFactor = (this._width - 50) / 2  / this._header.width;
            this._header.style.fontSize *= scaleFactor;
        }

        this._header.position.set(headerX, headerY);
        this.addChild(this._header)
    }

    protected buildBody() {
        this._body = new Text({
            text: "Lorem ispum dolor sit amet",
            style: {
                fontSize: this._bodyFont,
                fill: "#ffffff",
                fontFamily: "main",
                wordWrap: true,
                wordWrapWidth: this._width * 0.75,
            },
            resolution: 2
        });
        
        const bodyX = 0;
        const bodyY = (-this._body.height / 2) + this._header.height;

        this._body.anchor.set(0.5);
        this._body.position.set(bodyX, bodyY);
        this.addChild(this._body);
    }

    protected buildPlanet() {

        const program = new GlProgram({
            vertex: defaultFilterVert,
            fragment: planet
        })

        this._planetFilter = new Filter({
            glProgram: program
        });

        const radius = Math.min(this._width / 7, this._height / 10);
        this._planet = new Graphics();
        this._planet.circle(0, 0, radius);
        this._planet.fill("#ffffff");
        this._planet.position.set(-this._width / 2, -this._height / 2);
        this.addChild(this._planet)
    }
}