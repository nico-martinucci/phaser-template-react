import Room from "../classes/Room";
import { Tile } from "../classes/Tiles";

interface ICoordsPixels {
    x: number;
    y: number;
}

interface ICoordsLayout {
    x: number;
    y: number;
}

interface ICoordsOptional {
    x?: number;
    y?: number;
}

interface ITile extends ICoordsLayout {
    standable: boolean;
    symbol: string;
    currentRoom?: Room;
    scene: Phaser.Scene;
}

interface IMoveableTile extends ITile {
    currentTile?: Tile;
}

export type {
    ICoordsPixels,
    ICoordsLayout,
    ICoordsOptional,
    ITile,
    IMoveableTile,
};

