import { FillGradient, SplitText, Text } from "pixi.js";
import BaseState from "./BaseState";
import MapState from "./MapState";
import galaxy from "../shaders/galaxy.frag?raw";
import nebula from "../shaders/nebula.frag?raw";
import gsap from "gsap";
import App from "../app";

export default class IntroState extends BaseState {

    protected _codeFontSize: number;
    protected _codeOne: SplitText;
    protected _codeTwo: SplitText;
    protected _successText: Text;

    protected _text: SplitText;

    public async enter() {
        await this.buildComponents();
        this.visible = true;
        this.app.stage.addChild(this);
        await this.animateText();
        await new Promise(res => gsap.delayedCall(1, res));
        this.exit();
    }

    constructor(app: App) {
        super(app);

        const screenW = this.app.renderer.width;
        if (screenW <= 480) {
            this._codeFontSize = 10
        } else if (screenW <= 768) {
            this._codeFontSize = 12
        } else if (screenW <= 1024) {
            this._codeFontSize = 14
        } else {
            this._codeFontSize = 16
        }
    }

    protected async buildComponents() {
        if (this.children.length > 0) {
            this.children.forEach(child => {
                child.destroy({texture: true, children: true});
                child = null;
            });
        }

        const codeTextStyle = {
            fontSize: this._codeFontSize,
            fill: "#ffffff",
            fontFamily: "main",
        } 

        this._codeOne = new SplitText({
            text: nebula,
            style: codeTextStyle
        });
        this._codeOne.alpha = 0.4;
        this._codeOne.chars.forEach(char => char.visible = false)
        this.addChild(this._codeOne);

        this._successText = new Text({
            text: "SUCCESS",
            style: {
                ...codeTextStyle,
                fill: "#65B668",
                fontSize: this._codeFontSize * 1.5
            }
        });
        this._successText.pivot.set(this._successText.width / 2, this._successText.height / 2);
        this._successText.position.set(this.app.renderer.width / 2, this.app.screen.height / 2);
        this._successText.alpha = 0;
        this.addChild(this._successText);

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

        const duration = 1.5;
        await Promise.all([
            this.codeAnimation(this._codeOne, duration),
        ])
        
        this._codeOne.visible = false;
        this._successText.alpha = 1;
        await gsap.to(this._successText, {
            duration: 0.2,
            alpha: 0.3,
            yoyo: true,
            repeat: 5,
        })
        this._successText.visible = false;

        await gsap.to(this._text.chars, {
            alpha: 1,
            duration: 0.1,
            stagger: 0.05
        });
    }

    protected async codeAnimation(code: SplitText, duration: number, delay: number = 0) {
        const stagger = duration / code.text.length;
        const target = -this.app.screen.height / 2
        await Promise.all([
            gsap.to(code.chars, {
                delay: 0.1 + delay,
                visible: true,
                stagger: stagger
            }),
            gsap.to(code, {
                duration: duration,
                y: target,
                delay: 0.3 + delay,
                ease: "power1.in"
            })
        ]);
    }

    protected async fadeOut() {
        return new Promise<void>(async (res) => {
            await gsap.to(this._text.scale, {
                duration: 0.25,
                y: 0,
                x: 3,
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