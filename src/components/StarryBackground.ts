import { Container, GlProgram, defaultFilterVert, Filter, Graphics } from "pixi.js";
import frag from "../shaders/nebula.frag?raw";
import App from "../app";
import gsap from "gsap";

export default class StarryBackground extends Container{

    protected _app: App
    protected _filter: Filter;
    protected _bg: Graphics
    protected _elapsed = 0;

    public destroy() {
        this._app.ticker.remove(this.onTick, this);
        super.destroy({children: true});
    }

    constructor(app: App) {
        super();
        this._app = app;

        this.buildSelf();
        this._app.ticker.add(this.onTick, this);
    }

    protected buildSelf() {
        this._bg = new Graphics();
        this._bg.rect(0, 0, this._app.renderer.width, this._app.screen.height);
        this._bg.fill("#000000");
        this.addChild(this._bg);

        const program = new GlProgram({
            vertex: defaultFilterVert,
            fragment: frag
        });

        this._filter = new Filter({
            glProgram: program,
            resources: {
                uniforms: {
                    uResolution: {value: [this._app.renderer.width, this._app.screen.height], type: 'vec2<f32>'},
                    uTime: {value: 0, type: 'f32'},
                    uAlpha: {value: 0.0, type: 'f32'}
                }
            }
        });

        this.filters = [this._filter];
    }

    public fadeIn() {
        return new Promise(res => {
            gsap.to(this._filter.resources.uniforms.uniforms, {
                duration: 1,
                uAlpha: 1,
                onComplete: res
            })
        });
    }

    protected onTick() {
        this._elapsed += this._app.ticker.deltaMS / 1000;
        // console.log(this._elapsedMs)
        this._filter.resources.uniforms.uniforms.uTime = this._elapsed;
    }
}