import { Sprite, Container, Graphics, Text, Point } from "pixi.js";
import { Assets } from "pixi.js";
import App from "../app";

export default class Entry extends Container {

    public key: string

    protected _icon: Sprite;
    protected _app: App;

    constructor(app: App, key: string){
        super();
        this._app = app;
        this.key = key;
        this.eventMode = "dynamic";
        this.buildSelf();
    }

    protected buildSelf() {
        this.buildIcon();
        this.buildTextBox();
    }

    protected buildIcon() {
        this._icon = new Sprite(Assets.get("location"));
        this._icon.anchor.set(0.5)
        this.addChild(this._icon);
        this.pivot.set(this._icon.width / 2, this._icon.height / 2);
    }

    protected buildTextBox() {

        const text = new Text({
            text: this.key,
            style: {
                fontSize: 16,
                fontFamily: "main",
                fill: "#ffffff"
            },
            resolution: 2
        });

        const textbox = new Graphics();
        textbox.rect(0, 0, text.width * 1.1, text.height * 1.1);
        textbox.fill("#000000");
        textbox.stroke({
            width: 1,
            color: "#c0c0c0"
        })
        textbox.alpha = 0.75
        // textbox.pivot.set(this._icon.width / 2, this._icon.height / 2);
        textbox.position.set(this._icon.width / 2, -this._icon.height / 2)
        this.addChild(textbox);

        const textPosition = new Point().copyFrom(textbox.position);
        textPosition.x += 5;

        text.position.copyFrom(textPosition);
        this.addChild(text);

    }
}