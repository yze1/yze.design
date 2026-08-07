// Basic p5.js type definitions
declare class p5 {
    constructor(sketch: Function, node: string | HTMLElement);
    
    // Canvas methods
    createCanvas(w: number, h: number, renderer?: any): any;
    resizeCanvas(w: number, h: number): void;
    createGraphics(w: number, h: number, renderer?: any): any;
    pixelDensity(val: number): void;
    
    // Drawing methods
    background(color: number | string): void;
    fill(color: number | string): void;
    stroke(color: number | string): void;
    strokeWeight(weight: number): void;
    noStroke(): void;
    noFill(): void;
    clear(): void;
    
    // Shape methods
    beginShape(): void;
    endShape(mode?: any): void;
    vertex(x: number, y: number, z?: number): void;
    quadraticVertex(cx: number, cy: number, cz: number, x: number, y: number, z: number): void;
    
    // Transform methods
    push(): void;
    pop(): void;
    translate(x: number, y: number, z?: number): void;
    scale(s: number): void;
    rotateX(angle: number): void;
    rotateY(angle: number): void;
    rotateZ(angle: number): void;
    
    // Math methods
    radians(degrees: number): number;
    min(a: number, b: number): number;
    random(min: number, max: number): number;
    
    // Constants
    WEBGL: any;
    CLOSE: any;
    TWO_PI: number;
    HALF_PI: number;
    
    // Loop control
    loop(): void;
    noLoop(): void;
    redraw(): void;
    
    // Canvas saving
    saveCanvas(filename: string, extension: string): void;
    
    // Point drawing
    point(x: number, y: number, z?: number): void;
    
    // Vector creation
    createVector(x: number, y: number, z?: number): any;
}

// p5.Vector class
declare namespace p5 {
    class Vector {
        x: number;
        y: number;
        z: number;
        
        static sub(v1: Vector, v2: Vector): Vector;
        static add(v1: Vector, v2: Vector): Vector;
        
        copy(): Vector;
        mag(): number;
        setMag(len: number): Vector;
    }
} 