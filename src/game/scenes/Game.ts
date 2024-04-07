import Hero from "../../classes/Hero";
import Room from "../../classes/Room";
import { Scene } from "phaser";
import { Utilities } from "../../classes/Utilities";
import { EnterDoorTile, ExitDoorTile } from "../../classes/Tiles";

export class Game extends Scene {
    currentRoom: Room;
    rooms: Room[];
    hero: Hero;

    constructor() {
        super("Game");
        this.rooms = [];
    }

    preload() {}

    create() {
        this.currentRoom = Room.create(this, { height: 10, width: 10 });

        const { x, y } = this.currentRoom.getEntranceDoorAdjacentTile()!;

        this.hero = Hero.create(this, { x, y }).loadMovement(this);
    }

    getNextRoom() {
        this.currentRoom.unload();

        if (this.rooms.length - 1 === this.currentRoom.number) {
            this.currentRoom = Room.create(this, {
                height: 10,
                width: 10,
            });
        } else {
            this.currentRoom = this.rooms[this.currentRoom.number + 1];
            this.currentRoom.draw(this);
        }

        const { x, y } = this.currentRoom.getEntranceDoorAdjacentTile()!;
        this.hero.move(this, { x, y });
    }

    getPreviousRoom() {
        console.log({ rooms: this.rooms, currentRoom: this.currentRoom });
        if (this.currentRoom.number === 0) return;

        this.currentRoom.unload();

        console.log(this.rooms[this.currentRoom.number - 1]);

        this.currentRoom = this.rooms[this.currentRoom.number - 1];
        this.currentRoom.draw(this);

        const { x, y } = this.currentRoom.getExitDoorAdjacentTile()!;

        this.hero.move(this, { x, y });
    }
}

