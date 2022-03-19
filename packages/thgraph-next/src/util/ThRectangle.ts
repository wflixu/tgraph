import { ThPoint } from './ThPoint';


export class ThRectangle extends ThPoint {
    width: number;
    height: number;
    constructor(x: number, y: number, width = 0, height = 0) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
}