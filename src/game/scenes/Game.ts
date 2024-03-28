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
        this.room = Room.create(this, { height: 10, width: 10 });
        Hero.create(this, { x: 3, y: 3 }).loadMovement(this);
    }

    replaceRoom() {
        this.room.unload();
        this.room = Room.create(this, { height: 10, width: 10 });
    }
}

