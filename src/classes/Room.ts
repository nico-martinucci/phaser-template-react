import { Scene } from "phaser";
import { ICoordsPixels } from "../types/common";
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

    static create(scene: Phaser.Scene, { height, width }: IRoom) {
        const layout: Tile[][] = [];

        for (let y = 0; y < height; y++) {
            const row: Tile[] = [];

            for (let x = 0; x < width; x++) {
                const { xPixels, yPixels } = GameState.getPixelCoordinates({
                    x,
                    y,
                });
                if (y === 0 || y === height - 1) {
                    row.push(new WallTile(scene, { x: xPixels, y: yPixels }));
                } else {
                    if (x === 0 || x === width - 1) {
                        row.push(
                            new WallTile(scene, { x: xPixels, y: yPixels })
                        );
                    } else {
                        row.push(
                            new FloorTile(scene, { x: xPixels, y: yPixels })
                        );
                    }
                }
            }

            layout.push(row);
        }

        const room = new Room(layout);

        room.draw(scene);

        return room;
    }

    draw(scene: Scene) {
        for (let y = 0; y < this.layout.length; y++) {
            for (let x = 0; x < this.layout[0].length; x++) {
                const tile = this.layout[y][x];

                if (!tile.visible) continue;

                scene.add.existing(tile);
            }
        }

        return this;
    }

    getTile({ x, y }: ICoordsPixels) {
        const { xLayout, yLayout } = GameState.getLayoutCoordinates({
            x,
            y,
        });

        return this.layout[yLayout][xLayout];
    }
}

export default Room;

