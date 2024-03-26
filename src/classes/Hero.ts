import { Scene } from "phaser";
import GameState from "./GameState";
import { ICoordsOptional } from "../types/common";
import Room from "./Room";
import { Game } from "../game/scenes/Game";

interface IHero {
    x: number;
    y: number;
}

class Hero {
    x: number;
    y: number;
    symbol: string;
    textObject: Phaser.GameObjects.Text;

    constructor({ x, y }: IHero) {
        this.x = x;
        this.y = y;
        this.symbol = "H";
    }

    static create({ x, y }: IHero) {
        return new Hero({ x, y });
    }

    draw(scene: Scene) {
        const { x, y } = GameState.getPixelCoordinates({
            x: this.x,
            y: this.y,
        });

        this.textObject = scene.add.text(x, y, this.symbol);

        return this;
    }

    move({ x, y }: ICoordsOptional) {
        const { x: xPixels, y: yPixels } = GameState.getPixelCoordinates({
            x: x || this.x,
            y: y || this.y,
        });

        if (x) {
            this.x = x;
            this.textObject.setX(xPixels);
        }

        if (y) {
            this.y = y;
            this.textObject.setY(yPixels);
        }
    }

    loadMovement(scene: Game) {
        const upArrow = scene.input.keyboard?.addKey("Up");
        const leftArrow = scene.input.keyboard?.addKey("Left");
        const downArrow = scene.input.keyboard?.addKey("Down");
        const rightArrow = scene.input.keyboard?.addKey("Right");

        const currentTile = scene.room.getTile({ x: this.x, y: this.y });

        upArrow?.on("down", () => {
            const nextTile = scene.room.getTile({ x: this.x, y: this.y - 1 });

            if (nextTile.standable) {
                nextTile.setVisible(false);
                nextTile.textObject?.setVisible(false);
                this.move({ y: this.y - 1 });
                currentTile.setVisible(true);
                currentTile.textObject?.setVisible(true);
            }
        });
        leftArrow?.on("down", () => {
            const nextTile = scene.room.getTile({ x: this.x - 1, y: this.y });

            if (nextTile.standable) {
                nextTile.setVisible(false);
                nextTile.textObject?.setVisible(false);
                this.move({ x: this.x - 1 });
                currentTile.setVisible(true);
                currentTile.textObject?.setVisible(true);
            }
        });
        downArrow?.on("down", () => {
            const nextTile = scene.room.getTile({ x: this.x, y: this.y + 1 });

            if (nextTile.standable) {
                nextTile.setVisible(false);
                nextTile.textObject?.setVisible(false);
                this.move({ y: this.y + 1 });
                currentTile.setVisible(true);
                currentTile.textObject?.setVisible(true);
            }
        });
        rightArrow?.on("down", () => {
            const nextTile = scene.room.getTile({ x: this.x + 1, y: this.y });

            if (nextTile.standable) {
                nextTile.setVisible(false);
                nextTile.textObject?.setVisible(false);
                this.move({ x: this.x + 1 });
                currentTile.setVisible(true);
                currentTile.textObject?.setVisible(true);
            }
        });
    }

    updateLocation() {}
}

export default Hero;

