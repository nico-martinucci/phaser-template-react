import { ICoordsPixels, ICoordsLayout } from "../types/common";

class GameState {
    static xResolution = 14;
    static yResolution = 14;
    static xOffset = 100;
    static yOffset = 100;

    static getPixelCoordinates({ x, y }: ICoordsLayout) {
        return {
            xPixels: x * this.xResolution + this.xOffset,
            yPixels: y * this.yResolution + this.yOffset,
        };
    }

    static getLayoutCoordinates({ x, y }: ICoordsPixels) {
        return {
            xLayout: (x - this.xOffset) / this.xResolution,
            yLayout: (y - this.yOffset) / this.yResolution,
        };
    }
}

export default GameState;

