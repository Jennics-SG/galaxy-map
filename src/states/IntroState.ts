import { SplitText } from "pixi.js";
import BaseState from "./BaseState";
import MapState from "./MapState";
import nebula from "../shaders/nebula.frag?raw"
import gsap from "gsap";

export default class IntroState extends BaseState {

    protected _backgroundText: SplitText;
    protected _text: SplitText;

    public async enter() {
        await this.buildComponents();
        this.visible = true;
        this.app.stage.addChild(this);
        await this.animateText();
        await new Promise(res => gsap.delayedCall(1.5, res));
        this.exit();
    }

    protected async buildComponents() {
        if (this.children.length > 0) {
            this.children.forEach(child => {
                child.destroy({texture: true, children: true});
                child = null;
            });
        }

        this._backgroundText = new SplitText({
            text: nebula,
            style: {
                fontSize: 16,
                fill: "#ffffff",
                fontFamily: "main",
            }
        });
        this._backgroundText.alpha = 0.4;
        this._backgroundText.chars.forEach(char => char.visible = false)
        this.addChild(this._backgroundText);


        this._text = new SplitText({
            text: "WELCOME\nTRAVELLER",
            style: {
                fontSize: 54,
                fill: "#ffffff",
                align: "center",
                fontFamily: "main"
            },
            charAnchor: 0.5,
        });
        this._text.pivot.set(this._text.width / 2, this._text.height / 2)
        this._text.position.set(this.app.renderer.width / 2, this.app.screen.height / 2)
        this._text.alpha = 0;
        this.addChild(this._text)
    }

    protected async animateText() {
        this._text.chars.forEach(char => char.alpha = 0)
        this._text.alpha = 1;

        const target = -this.app.screen.height / 2
        await Promise.all([
            gsap.to(this._backgroundText.chars, {
                visible: true,
                stagger: 0.00125
            }),
            gsap.to(this._backgroundText, {
                duration: 2.5,
                y: target,
                delay: 0.5
            })
        ]);
        this._backgroundText.visible = false;

        await gsap.to(this._text.chars, {
            alpha: 1,
            duration: 0.1,
            stagger: 0.05
        });
    }

    protected async fadeOut() {
        return new Promise<void>(async (res) => {
            await gsap.to(this._text.scale, {
                duration: 0.25,
                y: 0,
                x: 1.5,
            })
            res();
        })

    }

    public async exit() {
        await this.fadeOut();
        this.app.stage.removeChild(this);
        await this.app.stateManager.loadNewState(new MapState(this.app));
    }
}