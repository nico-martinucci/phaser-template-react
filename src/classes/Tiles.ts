import { ICoords, IMoveableTile, ITile } from "../types/common";
import Room from "./Room";

class Tile {
    x: number;
    y: number;
    standable: boolean;
    symbol: string;
    currentRoom?: Room;
    visible: boolean;
    textObject: Phaser.GameObjects.Text | undefined;

    constructor({ x, y, standable, symbol, currentRoom }: ITile) {
        this.x = x;
        this.y = y;
        this.standable = standable;
        this.symbol = symbol;
        this.currentRoom = currentRoom;
        this.visible = true;
        this.textObject;
    }

    getCoordinates() {
        return `${this.x},${this.y}`;
    }

    setCoordinates({ x, y }: ICoords) {
        this.x = x;
        this.y = y;
    }

    setVisible(value: boolean) {
        this.visible = value;
    }

    setTextObject(textObject: Phaser.GameObjects.Text) {
        this.textObject = textObject;
    }
}

class WallTile extends Tile {
    constructor({ x, y }: ICoords) {
        super({ x, y, standable: false, symbol: "#" });
    }
}

class FloorTile extends Tile {
    constructor({ x, y }: ICoords) {
        super({ x, y, standable: true, symbol: "." });
    }
}

export { Tile, WallTile, FloorTile };

