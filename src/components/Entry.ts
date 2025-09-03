import { Sprite, Container, Graphics, Text } from "pixi.js";
import { Assets } from "pixi.js";
import App from "../app";

export default class Entry extends Container {

    public key: string

    protected _app: App;

    constructor(key: string){
        super();
        this.key = key;
        this.buildSelf();
    }

    protected buildSelf() {
        this.buildIcon();
        // this.buildTextBox();
    }

    protected buildIcon() {
        const icon = new Sprite(Assets.get("location"));
        icon.anchor.set(0.5)
        this.addChild(icon);
        this.pivot.set(icon.width / 2, icon.height / 2);
    }

    protected buildTextBox() {
        // const textbox = new GraphicsW
    }
}