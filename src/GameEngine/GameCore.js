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
        this._height = height;
        this._width = width;
        this._player = new Player({ ...playerCoords, height, width, speed });
        this._mobs = getRandomMobs(mobs, speed, width, height);
        // TODO wait for the collision detection research - maybe boundaries will be defined in different way
        this._vertexes = [
            { x: 0, y: 0 },
            { x: width, y: 0 },
            { x: width, y: height },
            { x: 0, y: height },
        ];
        this._edges = this._buildEdges();
        this._tickCount = 0;
    }

    /*<interface>*/
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get player() {
        return this._player;
    }
    get mobs() {
        return this._mobs;
    }
    get edges() {
        return this._edges;
    }
    get vertexes() {
        return this._vertexes;
    }

    get tickCount() {
        return this._tickCount;
    }

    start = () => {
        this._tickCount = 0;
        this._intervalId = setInterval(this.tick, TICK_DELAY);
    };

    stop = () => {
        this._intervalId && clearInterval(this.intervalId);
        this._intervalId = null;
    };

    tick = () => {
        this._mobs.forEach((mob) => mob.move(this._edges, this._player));
        this._tickCount++;
    };
    /*</interface>*/

    _buildEdges = (vertexes = this._vertexes) => {
        //Assume vertexes is valid non-empty array
        return vertexes.map((vertex, index, array) => {
            const nextVertex =
                index !== array.length - 1 ? array[index + 1] : array[0];
            console.log({
                vertex,
                nextVertex,
                isLastIndex: index === array.length - 1,
            });
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
            //FIXME ?
            throw new Error('Wrong vertexes');
            //Also, what about two same dots in a row? There is no edge and this vertex should not exist
        });
    };
}

export default GameCore;
