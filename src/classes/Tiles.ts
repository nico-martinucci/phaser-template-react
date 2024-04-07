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
    static symbol = "#";

    constructor(scene: Scene, { x, y }: ICoordsPixels) {
        super({ scene, x, y, standable: false, symbol: WallTile.symbol });
    }
}

class FloorTile extends Tile {
    static symbol = ".";

    constructor(scene: Scene, { x, y }: ICoordsPixels) {
        super({ scene, x, y, standable: true, symbol: FloorTile.symbol });
    }
}

class ExitDoorTile extends Tile {
    static symbol = "O";

    constructor(scene: Scene, { x, y }: ICoordsPixels) {
        super({ scene, x, y, standable: true, symbol: ExitDoorTile.symbol });
    }

    onStand(scene: Game) {
        scene.replaceRoom();
    }
}

class EnterDoorTile extends Tile {
    static symbol = "I";

    constructor(scene: Scene, { x, y }: ICoordsPixels) {
        super({ scene, x, y, standable: true, symbol: EnterDoorTile.symbol });
    }

    // onStand(scene: Game) {
    //     scene.replaceRoom();
    // }
}

export { Tile, WallTile, FloorTile, ExitDoorTile, EnterDoorTile };

