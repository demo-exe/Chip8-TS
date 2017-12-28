class Display {
    private readonly ctx: CanvasRenderingContext2D;

    private grMemory: number[][];

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

        //initialise memory
        this.grMemory = [];
        for(let w=0; w<2; w++) //for every collumn
        {
            this.grMemory[w] = [];
            for(let y=0; y<32; y++) //for every row
            {
                this.grMemory[w][y] = 0;
            }
        }
    }

    public clean_display() {
        for(let w=0; w<2; w++) { //for every collumn
            for(let y=0; y<32; y++) { //for every row
                this.grMemory[w][y] = 0;
            }
        }
    }

    public draw() {
        this.grMemory[0][1] = 0b101;

        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, 640, 320);

        this.ctx.fillStyle = '#00ff00';


        for(let y=0; y<32; y++) { //for every row
            for(let w=0; w<2; w++) { //for every collumn
                for(let b=0; b<32; b++) { // for every bit
                    if(this.grMemory[w][y] & (1 << (31-b))) { // collumns 1 and 2
                        this.ctx.save();
                        this.ctx.translate((w*320) + b*10, y*10);
                        this.ctx.fillRect(0, 0, 10,10);
                        this.ctx.restore();
                    }
                }
            }
        }
        
    }
}