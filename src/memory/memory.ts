declare var Wad: any; //from Wad library

class Memory {

    private ram: number[]; 
    private Vregisters: number[]; 
    private Iregister: number;
    private Tregister: number;
    private Sregister: number;
    private PCregister: number;
    private SPregister: number;

    private buzzer: any;
    private buzzer_playing: boolean;
    private timer_i: number;

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
        this.Tregister = 0;
        this.Sregister = 0;
        this.PCregister = 0;
        this.SPregister = 0;

        this.buzzer = new Wad({source : 'sawtooth', volume : .2, env: {attack  : 0.0,hold:20}});
        this.buzzer_playing = false;
        let _this = this;
        this.timer_i = setInterval(function() {_this._timerTick()} , 1000/60); //60Hz
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

    public setTimeDelay(val: number) {
        this.Tregister = val;
    }

    public getTimeDelay(): number {
        return this.Tregister;
    }

    public setSoundDelay(val: number) {
        this.Sregister = val;
    }

    private getSoundDelay(): number {
        return this.Sregister;
    }

    public getPC(): number {
        return this.PCregister;
    }

    public setPC(newPC: number) {
        this.PCregister = newPC;
    }

    public getSP(): number {
        return this.SPregister;
    }

    public setSP(newSP: number) {
        this.SPregister = newSP;
    }

    public clear_memory() {
        for(let i=0; i<1024; i++) { 
            this.ram[i] = 0;
        }
    }

    public getMem(pos: number): number {
        let index = Math.floor(pos / 4);
        let sub = 3 - pos % 4;
        return ((this.ram[index] & (0xFF << 8*sub)) >>> 8*sub);
    }

    public setMem(pos: number, value: number) {
        let index = Math.floor(pos / 4);
        let sub = 3 - pos % 4;
        this.ram[index] = (this.ram[index] | ~(0xFF << 8*sub));
        this.ram[index] = (this.ram[index] | (value << 8*sub));
    }

    private _timerTick() {
        let t = this.getTimeDelay();
        let s = this.getSoundDelay();
        if(t > 0) {
            t --;
            this.setTimeDelay(t);
        }
        if(s > 0) {
            if(!this.buzzer_playing) {
                this.buzzer.play();
                this.buzzer_playing = true;
            }
            s --;
            this.setSoundDelay(s);
        } else {
            if(this.buzzer_playing) {
                this.buzzer.stop();
                this.buzzer_playing = false;
            }
        }
    }
}