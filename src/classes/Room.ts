import { Scene } from "phaser";
import { ICoordsPixels } from "../types/common";
import { FloorTile, Tile, WallTile } from "./Tiles";
import GameState from "./GameState";
import { Utilities } from "./Utilities";

interface IRoomDimensions {
    height: number;
    width: number;
}

class Room {
    layout: (Tile | null)[][];

    static tileMap = {
        "#": WallTile,
        ".": FloorTile,
    };

    constructor(layout: (Tile | null)[][]) {
        this.layout = layout;
    }

    static create(scene: Phaser.Scene, { height, width }: IRoomDimensions) {
        const layout = Room._getRoomLayout({ height, width });

        const tileLayout: (Tile | null)[][] = [];

        for (let y = 0; y < layout.length; y++) {
            const row: (Tile | null)[] = [];

            for (let x = 0; x < layout[0].length; x++) {
                if (layout[y][x] === null) {
                    row.push(null);
                    continue;
                }

                const { xPixels, yPixels } = GameState.getPixelCoordinates({
                    x,
                    y,
                });

                row.push(
                    new Room.tileMap[layout[y][x]](scene, {
                        x: xPixels,
                        y: yPixels,
                    })
                );
            }

            tileLayout.push(row);
        }

        const room = new Room(tileLayout);

        room.draw(scene);

        return room;
    }

    static _getRoomLayout({ height, width }: IRoomDimensions) {
        const room = Room._getEmptyRoom({ height, width });

        if (Utilities.getRandomNumber({ max: 10, min: 1 }) > 5) {
            Room._removeTopLeftCorner(room);
        }
        if (Utilities.getRandomNumber({ max: 10, min: 1 }) > 5) {
            Room._removeTopRightCorner(room);
        }
        if (Utilities.getRandomNumber({ max: 10, min: 1 }) > 5) {
            Room._removeBottomLeftCorner(room);
        }
        if (Utilities.getRandomNumber({ max: 10, min: 1 }) > 5) {
            Room._removeBottomRightCorner(room);
        }

        Room._fillRoomLayout(room);

        return room;
    }

    static _getEmptyRoom({ height, width }: IRoomDimensions) {
        return Array.from({ length: height }, () =>
            Array(width).fill(undefined)
        );
    }

    static _removeTopLeftCorner(layout: (undefined | null)[][]) {
        const { cutoutHeight, cutoutWidth } =
            Room._getSmallCutoutDimensions(layout);

        for (let y = 0; y < cutoutHeight; y++) {
            for (let x = 0; x < cutoutWidth; x++) {
                layout[y][x] = null;
            }
        }
    }

    static _removeTopRightCorner(layout: (undefined | null)[][]) {
        const width = layout[0].length;

        const { cutoutHeight, cutoutWidth } =
            Room._getSmallCutoutDimensions(layout);

        for (let y = 0; y < cutoutHeight; y++) {
            for (let x = width - 1; x > width - cutoutWidth - 1; x--) {
                layout[y][x] = null;
            }
        }
    }

    static _removeBottomRightCorner(layout: (undefined | null)[][]) {
        const height = layout.length;
        const width = layout[0].length;

        const { cutoutHeight, cutoutWidth } =
            Room._getSmallCutoutDimensions(layout);

        for (let y = height - 1; y > height - cutoutHeight - 1; y--) {
            for (let x = width - 1; x > width - cutoutWidth - 1; x--) {
                layout[y][x] = null;
            }
        }
    }

    static _removeBottomLeftCorner(layout: (undefined | null)[][]) {
        const height = layout.length;

        const { cutoutHeight, cutoutWidth } =
            Room._getSmallCutoutDimensions(layout);

        for (let y = height - 1; y > height - cutoutHeight - 1; y--) {
            for (let x = 0; x < cutoutWidth; x++) {
                layout[y][x] = null;
            }
        }
    }

    static _getSmallCutoutDimensions(layout: (undefined | null)[][]) {
        const cutoutMin = 2;
        const cutoutMaxHeight = Math.floor(layout.length / 3);
        const cutoutMaxWidth = Math.floor(layout[0].length / 3);

        return {
            cutoutHeight: Utilities.getRandomNumber({
                max: cutoutMaxHeight,
                min: cutoutMin,
            }),
            cutoutWidth: Utilities.getRandomNumber({
                max: cutoutMaxWidth,
                min: cutoutMin,
            }),
        };
    }

    static _fillRoomLayout(layout: (undefined | null | string)[][]) {
        const height = layout.length;
        const width = layout[0].length;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (layout[y][x] === null) continue;
                if (y === 0 || y === height - 1) {
                    layout[y][x] = "#";
                } else {
                    if (
                        x === 0 ||
                        x === width - 1 ||
                        layout[y - 1][x] === null ||
                        layout[y + 1][x] === null ||
                        layout[y][x - 1] === null ||
                        layout[y][x + 1] === null ||
                        layout[y + 1][x + 1] === null ||
                        layout[y - 1][x + 1] === null ||
                        layout[y + 1][x - 1] === null ||
                        layout[y - 1][x - 1] === null
                    ) {
                        layout[y][x] = "#";
                    } else {
                        layout[y][x] = ".";
                    }
                }
            }
        }
    }

    draw(scene: Scene) {
        for (let y = 0; y < this.layout.length; y++) {
            for (let x = 0; x < this.layout[0].length; x++) {
                const tile = this.layout[y][x];

                if (tile === null || !tile.visible) continue;

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

