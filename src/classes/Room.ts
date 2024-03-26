import { Scene } from "phaser";
import { ICoords } from "../types/common";
import { FloorTile, Tile, WallTile } from "./Tiles";
import GameState from "./GameState";

interface IRoom {
    height: number;
    width: number;
}

class Room {
    layout: Tile[][];

    constructor(layout: Tile[][]) {
        this.layout = layout;
    }

    static create({ height, width }: IRoom) {
        const layout: Tile[][] = [];

        for (let y = 0; y < height; y++) {
            const row: Tile[] = [];

            for (let x = 0; x < width; x++) {
                if (y === 0 || y === height - 1) {
                    row.push(new WallTile({ x, y }));
                } else {
                    if (x === 0 || x === width - 1) {
                        row.push(new WallTile({ x, y }));
                    } else {
                        row.push(new FloorTile({ x, y }));
                    }
                }
            }

            layout.push(row);
        }

        return new Room(layout);
    }

    draw(scene: Scene) {
        for (let y = 0; y < this.layout.length; y++) {
            for (let x = 0; x < this.layout[0].length; x++) {
                const tile = this.layout[y][x];

                if (!tile.visible) continue;

                const { x: xPixels, y: yPixels } =
                    GameState.getPixelCoordinates({
                        x,
                        y,
                    });

                const textObject = scene.add.text(
                    xPixels,
                    yPixels,
                    tile.symbol
                );
                tile.setTextObject(textObject);
            }
        }

        return this;
    }

    getTile({ x, y }: ICoords) {
        return this.layout[y][x];
    }
}

export default Room;

