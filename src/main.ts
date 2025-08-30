import App from "./app";

document.addEventListener("DOMContentLoaded", async () => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";

    const app = new App();
    await app.init();
    document.body.appendChild(app.canvas);

    globalThis.__PIXI_APP__ = app;
})