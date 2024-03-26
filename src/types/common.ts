import Room from "../classes/Room";
import { Tile } from "../classes/Tiles";

interface ICoords {
    x: number;
    y: number;
}

interface ICoordsOptional {
    x?: number;
    y?: number;
}

interface ITile extends ICoords {
    standable: boolean;
    symbol: string;
    currentRoom?: Room;
}

interface IMoveableTile extends ITile {
    currentTile?: Tile;
}

export type { ICoords, ICoordsOptional, ITile, IMoveableTile };

