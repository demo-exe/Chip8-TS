class Memory {

    private ram: number[]; 
    private Vregisters: number[]; 
    private Iregister: number;
    private Tregisters: number;
    private PC: number;
    private SP: number;

    constructor(canvas: HTMLCanvasElement) {

        //initialise memory
        this.ram = [];
        for(let i=0; i<1024; i++) {
            this.ram[i] = 0; //1024*4 bytes
        }

        this.Vregisters = [];
        for(let i=0; i<4; i++) {
            this.Vregisters[i] = 0; //4*4 bytes
        }

        this.Iregister = 0;
        this.Tregisters = 0;
        this.PC = 0;
        this.SP = 0;

    }

    public getPC(): number {
        return this.PC;
    }

    public setPC(newPC: number) {
        this.PC = newPC;
    }



    public clear_memory() {
        for(let i=0; i<1024; i++) { 
            this.ram[i] = 0;
        }
    }


}