//TODO better naming
export function getRandomInt(max, negative = false) {
    const randomMax = Math.random() * max;
    return Math.floor(negative ? randomMax * 2 - max : randomMax);
}

export class Mob {
    constructor(x, y, velocity_x , velocity_y) {
        this.x = x;
        this.y = y;
        this.velocity_x = velocity_x;
        this.velocity_y = velocity_y;
    }

    randomize(velocity, max_x, max_y) {
        return new Mob(getRandomInt(max_x), getRandomInt(max_y), (getRandomInt(3)||1)*velocity ,(getRandomInt(3)||1)*velocity)
    }

    calcNextStep(boundaries) {
        //list of conditions which can cause velocity inversion (currently in Mob layer only border collision is checked)
    }
}

export default Mob;