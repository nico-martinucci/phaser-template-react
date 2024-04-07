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

        // @ts-ignore
        const { x, y } = this.currentRoom.getDoorAdjacentTile(EnterDoorTile)!;

        this.hero = Hero.create(this, { x, y }).loadMovement(this);
    }

    // replaceRoom() {
    //     this.currentRoom.unload();
    //     this.currentRoom = Room.create(this, { height: 10, width: 10 });

    //     console.log(this.rooms);
    //     const { x, y } = this.currentRoom.getDoorAdjacentTile(EnterDoorTile)!;
    //     this.hero.move(this, { x, y });
    // }

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

        // @ts-ignore
        const { x, y } = this.currentRoom.getDoorAdjacentTile(EnterDoorTile)!;
        this.hero.move(this, { x, y });
    }

    getPreviousRoom() {
        console.log({ rooms: this.rooms, currentRoom: this.currentRoom });
        if (this.currentRoom.number === 0) return;

        this.currentRoom.unload();

        console.log(this.rooms[this.currentRoom.number - 1]);

        this.currentRoom = this.rooms[this.currentRoom.number - 1];
        this.currentRoom.draw(this);

        const { x, y } = this.currentRoom.getDoorAdjacentTile(
            // @ts-ignore
            () => ExitDoorTile
        )!;

        this.hero.move(this, { x, y });
    }
}

