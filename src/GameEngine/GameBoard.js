//TODO better naming
export function getRandomInt(max, negative = false) {
    const randomMax = Math.random() * max;
    return Math.floor(negative ? randomMax * 2 - max : randomMax);
}

export function getRandomMobs(amount, speed, width, height) {
    const mobs = new Array(amount);
    for (let i = 0; i < amount; i++) {
        mobs[i] = {x: getRandomInt(width), y: getRandomInt(height), v_x: (getRandomInt(3)||1)*speed , v_y: (getRandomInt(3)||1)*speed} //avoid 0 speed
    }
    return mobs;
}

export class GameBoard {
    constructor({height, width, playerCoords = {x:0, y:0}}, mobsAmount ) {
        this.height = height;
        this.width = width;
        this.playerCoords = {x:0, y:0};
        this.mobs = []
    }

}

export default GameBoard;