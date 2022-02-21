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
        this.vertexes = [
            { x: 0, y: 0 },
            { x: width, y: 0 },
            { x: width, y: height },
            { x: 0, y: height },
        ];
        this.edges = this._buildEdges();
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
        this.mobs.forEach((mob) => mob.calcNextStep(this.edges, this.player));
        this.tickCount++;
    }

    getPlayer() {
        return this.player;
    }

    _buildEdges(vertexes = this.vertexes) {
        //Assume vertexes is valid non-empty array
        return vertexes.map((vertex, index, array) => {
            const nextVertex =
                index === array.length - 1 ? array[index + 1] : array[0];
            if (vertex.x === nextVertex.x)
                return {
                    x: vertex.x,
                    y1: Math.min(vertex.x, nextVertex.x),
                    y2: Math.max(vertex.x, nextVertex.x),
                };
            if (vertex.y === nextVertex.y)
                return {
                    x: vertex.x,
                    y1: Math.min(vertex.x, nextVertex.x),
                    y2: Math.max(vertex.x, nextVertex.x),
                };
            throw new Error('Wrong vertexes', { vertex, nextVertex });
            //Also, what about two same dots in a row?
        });
    }
}

export default GameCore;
