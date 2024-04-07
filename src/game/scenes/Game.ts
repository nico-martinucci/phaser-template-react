import Hero from "../../classes/Hero";
import Room from "../../classes/Room";
import { Scene } from "phaser";
import { Utilities } from "../../classes/Utilities";

export class Game extends Scene {
    room: Room;
    hero: Hero;

    constructor() {
        super("Game");
    }

    preload() {}

    create() {
        this.room = Room.create(this, { height: 10, width: 10 });

        const { x, y } = this.room.getEnterDoorAdjacentTile()!;

        this.hero = Hero.create(this, { x, y }).loadMovement(this);
    }

    replaceRoom() {
        this.room.unload();
        this.room = Room.create(this, { height: 10, width: 10 });
        const { x, y } = this.room.getEnterDoorAdjacentTile()!;
        this.hero.move(this, { x, y });
    }
}

