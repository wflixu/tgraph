import { ThPoint } from './ThPoint';
export class ThRectangle extends ThPoint {
    width;
    height;
    constructor(x, y, width = 0, height = 0) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
}
