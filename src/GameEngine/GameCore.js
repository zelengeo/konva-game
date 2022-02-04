import Mob from './Mob';
import Player from './Player';

const TICK_DELAY = 40;
export function getRandomMobs(amount = 2, speed = 3, width, height) {
    const mobs = new Array(amount);
    for (let i = 0; i < amount; i++) {
        mobs[i] = Mob.randomize(speed, width, height);
    }
    return mobs;
}

export class GameCore {
    constructor({
        height,
        width,
        playerCoords = { x: 0, y: 0 },
        mobs = 2,
        speed = 3,
    }) {
        this.height = height;
        this.width = width;
        this.player = new Player({ ...playerCoords, height, width, speed });
        this.mobs = getRandomMobs(mobs, speed, width, height);
        // TODO wait for the collision detection research - maybe boundaries will be defined in different way
        this.boundaries = [
            { x: 0, y: 0 },
            { x: 800, y: 0 },
            { x: 800, y: 600 },
            { x: 0, y: 600 },
        ];
    }

    start() {
        this.tickCount = 0;
        this.intervalId = setInterval(this.tick, TICK_DELAY);
    }

    stop() {
        this.intervalId && clearInterval(this.intervalId);
        this.intervalId = null;
    }

    tick() {
        this.mobs.forEach((mob) =>
            mob.calcNextStep(this.boundaries, this.player)
        );
        this.tickCount++;
    }

    getPlayer() {
        return this.player;
    }
}

export default GameCore;
