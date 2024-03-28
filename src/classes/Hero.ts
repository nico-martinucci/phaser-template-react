import { Scene } from "phaser";
import GameState from "./GameState";
import { ICoordsOptional } from "../types/common";
import Room from "./Room";
import { Game } from "../game/scenes/Game";

interface IHero {
    x: number;
    y: number;
}

class Hero extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, { x, y }: IHero) {
        super(scene, x, y, "H", {});
    }

    static create(scene: Phaser.Scene, { x, y }: IHero) {
        const { xPixels, yPixels } = GameState.getPixelCoordinates({
            x: x,
            y: y,
        });

        const hero = new Hero(scene, { x: xPixels, y: yPixels });

        hero.draw(scene);

        return hero;
    }

    draw(scene: Scene) {
        const { xPixels, yPixels } = GameState.getPixelCoordinates({
            x: this.x,
            y: this.y,
        });

        scene.add.existing(this);

        return this;
    }

    move(scene: Game, { x, y }: ICoordsOptional) {
        if (x) {
            this.setX(x);
        }

        if (y) {
            this.setY(y);
        }

        scene.room.getTile({ x: x || this.x, y: y || this.y })?.onStand(scene);
    }

    loadMovement(scene: Game) {
        const upArrow = scene.input.keyboard?.addKey("Up");
        const leftArrow = scene.input.keyboard?.addKey("Left");
        const downArrow = scene.input.keyboard?.addKey("Down");
        const rightArrow = scene.input.keyboard?.addKey("Right");

        const { xResolution, yResolution } = GameState;

        const currentTile = scene.room.getTile({
            x: this.x,
            y: this.y,
        });

        currentTile?.setVisible(false);

        upArrow?.on("down", () => {
            const currentTile = scene.room.getTile({
                x: this.x,
                y: this.y,
            });

            const nextTile = scene.room.getTile({
                x: this.x,
                y: this.y - yResolution,
            });

            if (nextTile?.standable) {
                nextTile.setVisible(false);
                this.move(scene, { y: this.y - yResolution });
                currentTile?.setVisible(true);
            }
        });
        leftArrow?.on("down", () => {
            const currentTile = scene.room.getTile({
                x: this.x,
                y: this.y,
            });

            const nextTile = scene.room.getTile({
                x: this.x - xResolution,
                y: this.y,
            });

            if (nextTile?.standable) {
                nextTile.setVisible(false);
                this.move(scene, { x: this.x - xResolution });
                currentTile?.setVisible(true);
            }
        });
        downArrow?.on("down", () => {
            const currentTile = scene.room.getTile({
                x: this.x,
                y: this.y,
            });

            const nextTile = scene.room.getTile({
                x: this.x,
                y: this.y + yResolution,
            });

            if (nextTile?.standable) {
                nextTile.setVisible(false);
                this.move(scene, { y: this.y + yResolution });
                currentTile?.setVisible(true);
            }
        });
        rightArrow?.on("down", () => {
            const currentTile = scene.room.getTile({
                x: this.x,
                y: this.y,
            });

            const nextTile = scene.room.getTile({
                x: this.x + xResolution,
                y: this.y,
            });

            if (nextTile?.standable) {
                nextTile.setVisible(false);
                this.move(scene, { x: this.x + xResolution });
                currentTile?.setVisible(true);
            }
        });
    }

    updateLocation() {}
}

export default Hero;

