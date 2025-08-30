import { SplitText } from "pixi.js";
import BaseState from "./BaseState";
import gsap from "gsap";

export default class IntroState extends BaseState {
    protected _text: SplitText;

    public async enter() {
        await this.buildComponents();
        this.visible = true;
        this.app.stage.addChild(this);
        await this.animateText();
        this.exit();
    }

    protected async buildComponents() {
        if (this.children.length > 0) {
            this.children.forEach(child => {
                child.destroy({texture: true, children: true});
                child = null;
            });
        }

        this._text = new SplitText({
            text: "WELCOME\nTRAVELLER",
            style: {
                fontSize: 54,
                fill: "#ffffff",
                align: "center"
            },
            charAnchor: 0.5,
        });
        this._text.pivot.set(this._text.width / 2, this._text.height / 2)
        this._text.position.set(this.app.screen.width / 2, this.app.screen.height / 2)
        this._text.alpha = 0;
        this.addChild(this._text)
    }

    protected async animateText() {
        this._text.chars.forEach(char => char.alpha = 0)
        this._text.alpha = 1;
        await gsap.to(this._text.chars, {
            alpha: 1,
            duration: 0.3,
            stagger: 0.2
        });
    }

    protected async fadeOut() {
        await gsap.to(this._text.scale, {
            duration: 0.25,
            y: 0,
            x: 1.5,
            // ease: Back.easeIn
        });
    }

    public async exit() {
        await this.fadeOut();
        this.app.stage.removeChild(this);
    }
}