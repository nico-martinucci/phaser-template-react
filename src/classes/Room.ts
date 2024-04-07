import { Scene } from "phaser";
import { ICoordsPixels } from "../types/common";
import {
    EnterDoorTile,
    ExitDoorTile,
    FloorTile,
    Tile,
    WallTile,
} from "./Tiles";
import GameState from "./GameState";
import { Utilities } from "./Utilities";
import { Game } from "../game/scenes/Game";

interface IRoomDimensions {
    height: number;
    width: number;
}

class Room {
    layout: (Tile | null)[][];
    number: number;

    constructor(layout: (Tile | null)[][]) {
        this.layout = layout;
        this.number = Room.getAndIncrementRoomCount();
    }

    static tileMap = {
        [WallTile.symbol]: WallTile,
        [FloorTile.symbol]: FloorTile,
        [ExitDoorTile.symbol]: ExitDoorTile,
        [EnterDoorTile.symbol]: EnterDoorTile,
    };

    static roomCount = 0;

    static getAndIncrementRoomCount() {
        return Room.roomCount++;
    }

    static create(scene: Game, { height, width }: IRoomDimensions) {
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

        scene.rooms.push(room);

        return room;
    }

    static _getRoomLayout({ height, width }: IRoomDimensions) {
        const room = Room._getEmptyRoom({ height, width });

        const hasTopLeftCornerCutout =
            Utilities.getRandomNumber({ max: 10, min: 1 }) > 5;
        const hasTopRightCornerCutout =
            Utilities.getRandomNumber({ max: 10, min: 1 }) > 5;
        const hasBottomLeftCornerCutout =
            Utilities.getRandomNumber({ max: 10, min: 1 }) > 5;
        const hasBottomRightCornerCutout =
            Utilities.getRandomNumber({ max: 10, min: 1 }) > 5;

        let bigCutout =
            [
                hasTopLeftCornerCutout,
                hasTopRightCornerCutout,
                hasBottomLeftCornerCutout,
                hasBottomRightCornerCutout,
            ].filter((bool) => bool).length === 1;

        if (hasTopLeftCornerCutout) {
            Room._removeTopLeftCorner(room, bigCutout);
        }
        if (hasTopRightCornerCutout) {
            Room._removeTopRightCorner(room, bigCutout);
        }
        if (hasBottomLeftCornerCutout) {
            Room._removeBottomLeftCorner(room, bigCutout);
        }
        if (hasBottomRightCornerCutout) {
            Room._removeBottomRightCorner(room, bigCutout);
        }

        Room._fillRoomLayout(room);

        const possibleDoorLocations = Room._getPossibleDoorLocations(room);

        Room._placeDoor(room, possibleDoorLocations, ExitDoorTile.symbol);
        Room._placeDoor(room, possibleDoorLocations, EnterDoorTile.symbol);

        return room;
    }

    static _getEmptyRoom({ height, width }: IRoomDimensions) {
        return Array.from({ length: height }, () =>
            Array(width).fill(undefined)
        );
    }

    static _removeTopLeftCorner(layout: (undefined | null)[][], bigCutout) {
        let { cutoutHeight, cutoutWidth } =
            Room._getSmallCutoutDimensions(layout);

        if (bigCutout) {
            const dimensions = Room._getBigCutoutDimensions(layout);

            cutoutHeight = dimensions.cutoutHeight;
            cutoutWidth = dimensions.cutoutWidth;
        }

        for (let y = 0; y < cutoutHeight; y++) {
            for (let x = 0; x < cutoutWidth; x++) {
                layout[y][x] = null;
            }
        }
    }

    static _removeTopRightCorner(layout: (undefined | null)[][], bigCutout) {
        const width = layout[0].length;

        let { cutoutHeight, cutoutWidth } =
            Room._getSmallCutoutDimensions(layout);

        if (bigCutout) {
            const dimensions = Room._getBigCutoutDimensions(layout);

            cutoutHeight = dimensions.cutoutHeight;
            cutoutWidth = dimensions.cutoutWidth;
        }

        for (let y = 0; y < cutoutHeight; y++) {
            for (let x = width - 1; x > width - cutoutWidth - 1; x--) {
                layout[y][x] = null;
            }
        }
    }

    static _removeBottomRightCorner(layout: (undefined | null)[][], bigCutout) {
        const height = layout.length;
        const width = layout[0].length;

        let { cutoutHeight, cutoutWidth } =
            Room._getSmallCutoutDimensions(layout);

        if (bigCutout) {
            const dimensions = Room._getBigCutoutDimensions(layout);

            cutoutHeight = dimensions.cutoutHeight;
            cutoutWidth = dimensions.cutoutWidth;
        }

        for (let y = height - 1; y > height - cutoutHeight - 1; y--) {
            for (let x = width - 1; x > width - cutoutWidth - 1; x--) {
                layout[y][x] = null;
            }
        }
    }

    static _removeBottomLeftCorner(layout: (undefined | null)[][], bigCutout) {
        const height = layout.length;

        let { cutoutHeight, cutoutWidth } =
            Room._getSmallCutoutDimensions(layout);

        if (bigCutout) {
            const dimensions = Room._getBigCutoutDimensions(layout);

            cutoutHeight = dimensions.cutoutHeight;
            cutoutWidth = dimensions.cutoutWidth;
        }

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

    static _getBigCutoutDimensions(layout: (undefined | null)[][]) {
        const cutoutMin = Math.min(
            Math.floor(layout.length / 3),
            Math.floor(layout[0].length / 3)
        );
        const cutoutMaxHeight = Math.floor(layout.length * 0.75);
        const cutoutMaxWidth = Math.floor(layout[0].length * 0.75);

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
                    layout[y][x] = WallTile.symbol;
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
                        layout[y][x] = WallTile.symbol;
                    } else {
                        layout[y][x] = FloorTile.symbol;
                    }
                }
            }
        }
    }

    static _getPossibleDoorLocations(layout: (undefined | null | string)[][]) {
        const possibleDoorLocations: number[][] = [];

        for (let y = 0; y < layout.length; y++) {
            for (let x = 0; x < layout[0].length; x++) {
                const isInsideTopLeftCorner =
                    layout[y - 1] &&
                    layout[y - 1][x] === WallTile.symbol &&
                    layout[y][x - 1] === WallTile.symbol;
                const isInsideTopRightCorner =
                    layout[y - 1] &&
                    layout[y - 1][x] === WallTile.symbol &&
                    layout[y][x + 1] === WallTile.symbol;
                const isInsideBottomLeftCorner =
                    layout[y + 1] &&
                    layout[y + 1][x] === WallTile.symbol &&
                    layout[y][x - 1] === WallTile.symbol;
                const isInsideBottomRightCorner =
                    layout[y + 1] &&
                    layout[y + 1][x] === WallTile.symbol &&
                    layout[y][x + 1] === WallTile.symbol;

                const isInsideCorner =
                    isInsideTopLeftCorner ||
                    isInsideTopRightCorner ||
                    isInsideBottomLeftCorner ||
                    isInsideBottomRightCorner;

                const isOutsideTopCorner =
                    y === 0 &&
                    layout[y + 1] &&
                    layout[y + 1][x] === WallTile.symbol;
                const isOutsideBottomCorner =
                    y === layout.length - 1 &&
                    layout[y - 1] &&
                    layout[y - 1][x] === WallTile.symbol;

                const isOutsideCorner =
                    isOutsideTopCorner || isOutsideBottomCorner;

                if (
                    layout[y][x] === WallTile.symbol &&
                    !(isInsideCorner || isOutsideCorner)
                ) {
                    possibleDoorLocations.push([y, x]);
                }
            }
        }

        return possibleDoorLocations;
    }

    static _placeDoor(
        layout: (undefined | null | string)[][],
        possibleDoorLocations: number[][],
        door: string
    ) {
        const locationIndex = Utilities.getRandomNumber({
            max: possibleDoorLocations.length - 1,
        });

        const [doorY, doorX] = possibleDoorLocations.splice(
            locationIndex,
            1
        )[0];

        layout[doorY][doorX] = door;
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

    getStandableTiles() {
        const standableTiles: Tile[] = [];

        for (let y = 0; y < this.layout.length; y++) {
            for (let x = 0; x < this.layout[0].length; x++) {
                const tile = this.layout[y][x];

                if (tile?.standable) {
                    standableTiles.push(tile);
                }
            }
        }

        return standableTiles;
    }

    getEntranceDoorAdjacentTile() {
        for (let y = 0; y < this.layout.length; y++) {
            for (let x = 0; x < this.layout[0].length; x++) {
                if (this.layout[y][x] instanceof EnterDoorTile) {
                    if (
                        this.layout[y - 1] &&
                        this.layout[y - 1][x]?.standable
                    ) {
                        return this.layout[y - 1][x];
                    }
                    if (
                        this.layout[y + 1] &&
                        this.layout[y + 1][x]?.standable
                    ) {
                        return this.layout[y + 1][x];
                    }
                    if (
                        this.layout[y][x - 1] &&
                        this.layout[y][x - 1]?.standable
                    ) {
                        return this.layout[y][x - 1];
                    }
                    if (
                        this.layout[y][x + 1] &&
                        this.layout[y][x + 1]?.standable
                    ) {
                        return this.layout[y][x + 1];
                    }
                }
            }
        }

        const standableTiles = this.getStandableTiles();

        return standableTiles[
            Utilities.getRandomNumber({
                max: standableTiles.length - 1,
            })
        ];
    }

    getExitDoorAdjacentTile() {
        for (let y = 0; y < this.layout.length; y++) {
            for (let x = 0; x < this.layout[0].length; x++) {
                if (this.layout[y][x] instanceof ExitDoorTile) {
                    if (
                        this.layout[y - 1] &&
                        this.layout[y - 1][x]?.standable
                    ) {
                        return this.layout[y - 1][x];
                    }
                    if (
                        this.layout[y + 1] &&
                        this.layout[y + 1][x]?.standable
                    ) {
                        return this.layout[y + 1][x];
                    }
                    if (
                        this.layout[y][x - 1] &&
                        this.layout[y][x - 1]?.standable
                    ) {
                        return this.layout[y][x - 1];
                    }
                    if (
                        this.layout[y][x + 1] &&
                        this.layout[y][x + 1]?.standable
                    ) {
                        return this.layout[y][x + 1];
                    }
                }
            }
        }

        const standableTiles = this.getStandableTiles();

        return standableTiles[
            Utilities.getRandomNumber({
                max: standableTiles.length - 1,
            })
        ];
    }

    unload() {
        for (let y = 0; y < this.layout.length; y++) {
            for (let x = 0; x < this.layout[0].length; x++) {
                const tile = this.layout[y][x];

                if (!tile) continue;

                tile.removeFromDisplayList();
            }
        }
    }
}

export default Room;

