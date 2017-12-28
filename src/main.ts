let canvas = <HTMLCanvasElement> document.getElementById("screenCanvas");
let disp = new Display(canvas);

function mainLoop() {
    disp.draw();
}
setInterval(mainLoop, 1000);