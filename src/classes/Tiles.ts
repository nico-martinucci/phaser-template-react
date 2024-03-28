import { ICoordsPixels, ITile } from "../types/common";
import Room from "./Room";

class Tile extends Phaser.GameObjects.Text {
    standable: boolean;
    currentRoom?: Room;
    visible: boolean;
    textObject: Phaser.GameObjects.Text | undefined;

    constructor({ scene, x, y, standable, symbol, currentRoom }: ITile) {
        super(scene, x, y, symbol, {});

        this.standable = standable;
        this.currentRoom = currentRoom;
        this.visible = true;
    }

    // create(scene: Phaser.Scene, {x, y}: ICoords) {
    //     scene.add.text()
    // }

    getCoordinates() {
        return `${this.x},${this.y}`;
    }

    setCoordinates({ x, y }: ICoordsPixels) {
        this.setX(x);
        this.setY(y);
    }
}

class WallTile extends Tile {
    constructor(scene: Phaser.Scene, { x, y }: ICoordsPixels) {
        super({ scene, x, y, standable: false, symbol: "#" });
    }
}

class FloorTile extends Tile {
    constructor(scene: Phaser.Scene, { x, y }: ICoordsPixels) {
        super({ scene, x, y, standable: true, symbol: "." });
    }
}

export { Tile, WallTile, FloorTile };

