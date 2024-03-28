interface INumberBounds {
    max: number;
    min?: number;
}

export class Utilities {
    static getRandomNumber({ max, min = 0 }: INumberBounds) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

