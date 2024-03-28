import { GameObjects, Scene } from "phaser";
import { ICoordsPixels, ITile } from "../types/common";
import Room from "./Room";
import { Game } from "../game/scenes/Game";

class Tile extends Phaser.GameObjects.Text {
    standable: boolean;
    currentRoom?: Room;
    visible: boolean;
    textObject: GameObjects.Text | undefined;

    constructor({ scene, x, y, standable, symbol, currentRoom }: ITile) {
        super(scene, x, y, symbol, {});

        this.standable = standable;
        this.currentRoom = currentRoom;
        this.visible = true;
    }

    getCoordinates() {
        return `${this.x},${this.y}`;
    }

    setCoordinates({ x, y }: ICoordsPixels) {
        this.setX(x);
        this.setY(y);
    }

    onStand(scene: Game) {
        return;
    }
}

class WallTile extends Tile {
    constructor(scene: Scene, { x, y }: ICoordsPixels) {
        super({ scene, x, y, standable: false, symbol: "#" });
    }
}

class FloorTile extends Tile {
    constructor(scene: Scene, { x, y }: ICoordsPixels) {
        super({ scene, x, y, standable: true, symbol: "." });
    }
}

class DoorTile extends Tile {
    constructor(scene: Scene, { x, y }: ICoordsPixels) {
        super({ scene, x, y, standable: true, symbol: "O" });
    }

    onStand(scene: Game) {
        console.log("DOOR!");
        scene.replaceRoom();
    }
}

export { Tile, WallTile, FloorTile, DoorTile };

