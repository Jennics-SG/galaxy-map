import Modal from "./Modal";
import { Graphics, Container, Text } from "pixi.js";
import App from "../app";

export default class IntroModal extends Modal {


    public async show() {
        super.show("About Me");
    }

    constructor(app: App){
        super(app);
    }

    protected buildSelf() {
        super.buildSelf();
        this.buildCVButton();
    }

    protected buildCVButton() {
        const buttonWrapper = new Container();

        const buttonWidth = this._width * 0.6;
        const buttonHeight = this._height / 10;
        const button = new Graphics();
        button.roundRect(0, 0, buttonWidth, buttonHeight, 15);
        button.fill("#633683");
        // button.pivot.set(buttonWidth / 2, buttonHeight / 2);
        buttonWrapper.addChild(button);

        const buttonText = new Text({
            text: "Download my CV",
            style: {
                fontSize: this._bodyFont,
                fill: "#ffffff",
                fontFamily: "main"
            },
            resolution: 2
        })
        buttonText.anchor.set(0.5);
        buttonText.position.set(buttonWidth / 2, buttonHeight / 2)
        buttonWrapper.addChild(buttonText);

        buttonWrapper.pivot.set(buttonWidth / 2, buttonHeight / 2);
        buttonWrapper.position.set(0, this._height / 2 - buttonHeight);
        this.addChild(buttonWrapper);

        buttonWrapper.eventMode = "static";
        buttonWrapper.onpointerdown = () => {
            console.log("work")
            // Have to do this because safari sucks
            let link = document.createElement("a");
            link.href = "/data/Jimy_Houlbrook_CV.pdf";
            link.click();
            link = null;
        }
    }
}