import Hero from "../../classes/Hero";
import Room from "../../classes/Room";
import { Scene } from "phaser";

export class Game extends Scene {
    room: Room;

    constructor() {
        super("Game");
    }

    preload() {}

    create() {
        this.room = Room.create({ height: 10, width: 10 }).draw(this);
        Hero.create({ x: 5, y: 5 }).draw(this).loadMovement(this);
    }
}

