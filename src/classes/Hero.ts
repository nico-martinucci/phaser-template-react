import { Scene } from "phaser";
import GameState from "./GameState";
import { ICoordsOptional, ICoordsPixels } from "../types/common";
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

    static create(scene: Phaser.Scene, { x, y }: ICoordsPixels) {
        const hero = new Hero(scene, { x, y });

        hero.draw(scene);

        return hero;
    }

    draw(scene: Scene) {
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

        scene.currentRoom
            .getTile({ x: x || this.x, y: y || this.y })
            ?.onStand(scene);
    }

    loadMovement(scene: Game) {
        const upArrow = scene.input.keyboard?.addKey("Up");
        const leftArrow = scene.input.keyboard?.addKey("Left");
        const downArrow = scene.input.keyboard?.addKey("Down");
        const rightArrow = scene.input.keyboard?.addKey("Right");

        const { xResolution, yResolution } = GameState;

        const currentTile = scene.currentRoom.getTile({
            x: this.x,
            y: this.y,
        });

        currentTile?.setVisible(false);

        upArrow?.on("down", () => {
            const nextTile = scene.currentRoom.getTile({
                x: this.x,
                y: this.y - yResolution,
            });

            if (nextTile?.standable) {
                scene.currentRoom
                    .getTile({
                        x: this.x,
                        y: this.y,
                    })
                    ?.onLeave(scene);

                this.move(scene, { y: this.y - yResolution });
            }
        });
        leftArrow?.on("down", () => {
            const nextTile = scene.currentRoom.getTile({
                x: this.x - xResolution,
                y: this.y,
            });

            if (nextTile?.standable) {
                scene.currentRoom
                    .getTile({
                        x: this.x,
                        y: this.y,
                    })
                    ?.onLeave(scene);

                this.move(scene, { x: this.x - xResolution });
            }
        });
        downArrow?.on("down", () => {
            const nextTile = scene.currentRoom.getTile({
                x: this.x,
                y: this.y + yResolution,
            });

            if (nextTile?.standable) {
                scene.currentRoom
                    .getTile({
                        x: this.x,
                        y: this.y,
                    })
                    ?.onLeave(scene);

                this.move(scene, { y: this.y + yResolution });
            }
        });
        rightArrow?.on("down", () => {
            const nextTile = scene.currentRoom.getTile({
                x: this.x + xResolution,
                y: this.y,
            });

            if (nextTile?.standable) {
                scene.currentRoom
                    .getTile({
                        x: this.x,
                        y: this.y,
                    })
                    ?.onLeave(scene);

                this.move(scene, { x: this.x + xResolution });
            }
        });

        return this;
    }

    updateLocation() {}
}

export default Hero;

