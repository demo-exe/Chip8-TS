class Memory {

    private ram: number[]; 
    private Vregisters: number[]; 
    private Iregister: number;
    private Tregisters: number;
    private PC: number;
    private SP: number;

    constructor() {
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

    public getVReg(reg: number): number {
        let index = Math.floor(reg / 4);
        let sub = 3 - reg % 4;
        return ((this.Vregisters[index] & (0xFF << 8*sub)) >>> 8*sub);
    }

    public setVReg(reg: number, value: number) {
        let index = Math.floor(reg / 4);
        let sub = 3 - reg % 4;
        this.Vregisters[index] = (this.Vregisters[index] | ~(0xFF << 8*sub));
        this.Vregisters[index] = (this.Vregisters[index] | (value << 8*sub));

    }

    public getIReg(): number {
        return this.Iregister;
    }

    public setIReg(value: number) {
        this.Iregister = value;
    }

    public clear_memory() {
        for(let i=0; i<1024; i++) { 
            this.ram[i] = 0;
        }
    }


}