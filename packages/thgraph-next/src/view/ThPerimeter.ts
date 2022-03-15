import { ThPoint } from "../util/ThPoint";

export class ThPerimeter {
    public static RectanglePerimeter(bounds: any, vertex: any, next: any, orthogonal: any) {
        var cx = bounds.getCenterX();
        var cy = bounds.getCenterY();
        var dx = next.x - cx;
        var dy = next.y - cy;
        var alpha = Math.atan2(dy, dx);
        var p = new ThPoint(0, 0);
        var pi = Math.PI;
        var pi2 = Math.PI / 2;
        var beta = pi2 - alpha;
        var t = Math.atan2(bounds.height, bounds.width);

        if (alpha < -pi + t || alpha > pi - t) {
            // Left edge
            p.x = bounds.x;
            p.y = cy - bounds.width * Math.tan(alpha) / 2;
        }
        else if (alpha < -t) {
            // Top Edge
            p.y = bounds.y;
            p.x = cx - bounds.height * Math.tan(beta) / 2;
        }
        else if (alpha < t) {
            // Right Edge
            p.x = bounds.x + bounds.width;
            p.y = cy + bounds.width * Math.tan(alpha) / 2;
        }
        else {
            // Bottom Edge
            p.y = bounds.y + bounds.height;
            p.x = cx + bounds.height * Math.tan(beta) / 2;
        }

        if (orthogonal) {
            if (next.x >= bounds.x &&
                next.x <= bounds.x + bounds.width) {
                p.x = next.x;
            }
            else if (next.y >= bounds.y &&
                next.y <= bounds.y + bounds.height) {
                p.y = next.y;
            }
            if (next.x < bounds.x) {
                p.x = bounds.x;
            }
            else if (next.x > bounds.x + bounds.width) {
                p.x = bounds.x + bounds.width;
            }
            if (next.y < bounds.y) {
                p.y = bounds.y;
            }
            else if (next.y > bounds.y + bounds.height) {
                p.y = bounds.y + bounds.height;
            }
        }

        return p;
    }

}