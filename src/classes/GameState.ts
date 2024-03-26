import { ICoords } from "../types/common";

class GameState {
    static xResolution = 12;
    static yResolution = 12;
    static xOffset = 100;
    static yOffset = 100;

    static getPixelCoordinates({ x, y }: ICoords) {
        return {
            x: x * this.xResolution + this.xOffset,
            y: y * this.yResolution + this.yOffset,
        };
    }
}

export default GameState;

