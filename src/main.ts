import App from "./app";

document.addEventListener("DOMContentLoaded", async () => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";

    const div = document.getElementById("app")

    const app = new App();
    await app.init();
    div.prepend(app.canvas);

    globalThis.__PIXI_APP__ = app;
})