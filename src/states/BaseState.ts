import App from "../app"
import { Container } from "pixi.js";

export default abstract class BaseState extends Container {
    public app: App

    public abstract enter(): Promise<void>;
    public abstract exit(): Promise<void>;

    constructor(app: App) {
        super();
        this.app = app;
        this.visible = false;
    }
}