export const MOB_WIDTH = 5;
export const MOB_HEIGHT = 5;

export function getRandomInt(max, negative = false) {
    const randomMax = Math.random() * max;
    return Math.floor(negative ? randomMax * 2 - max : randomMax);
}

export class Mob {
    constructor(x, y, velocity_x, velocity_y) {
        this.x = x;
        this.y = y;
        this.velocity_x = velocity_x;
        this.velocity_y = velocity_y;
    }

    static randomize(velocity, max_x, max_y) {
        return new Mob(
            getRandomInt(max_x),
            getRandomInt(max_y),
            (getRandomInt(3) || 1) * velocity,
            (getRandomInt(3) || 1) * velocity
        );
    }

    calcNextStep(
        vertexes = [
            { x: 0, y: 0 },
            { x: 800, y: 0 },
            { x: 800, y: 600 },
            { x: 0, y: 600 },
        ],
        player
    ) {
        // COLLISION CHECK
        // 1.Player collision check first Because it causes endGame
        //
        // 2. I've taken a brief look at the SAT to detect collision, but it seems too complex for my case

        // PLAYER COLLISION
        // ...

        // BOUNDARY COLLISION
        // 1.list of conditions which can cause velocity inversion (currently in Mob layer only border collision is checked)

        // 3.
        // vertexes - always even, >= 4
        // edges - always even >=4

        // EDGES basic - basic coord diff
        // const edges = vertexes.map((vertex, index, array) => {
        //     const nextVertex =
        //         index + 1 !== array.length ? array[index + 1] : array[0];
        //     return { x: nextVertex.x - vertex.x, y: nextVertex.y - vertex.y };
        // });

        // EDGES v2 - reduce vertexes into two maps of horizontal/vertical edges. probably try with trees later
        // const edges_h = {};
        // const edges_v = {};
        // vertexes.forEach((vertex, index, array) => {
        //     const nextVertex =
        //         index + 1 !== array.length ? array[index + 1] : array[0];
        //     if (index % 2) {
        //         // even - horizontal, vertex.y===nextVertex.y
        //         if (edges_h[vertex.y]) {
        //             edges_h[vertex.y].push(vertex.x, nextVertex.x);
        //         } else {
        //             edges_h[vertex.y] = [vertex.x, nextVertex.x];
        //         }
        //     } else {
        //         // odd - vertical
        //         if (edges_v[vertex.x]) {
        //             edges_v[vertex.x].push(vertex.y, nextVertex.y);
        //         } else {
        //             edges_v[vertex.x] = [vertex.y, nextVertex.y];
        //         }
        //     }
        // });

        // The most obvious solution, then use EDGES v2
        vertexes.forEach((vertex, index, array) => {
            const nextVertex =
                index + 1 !== array.length ? array[index + 1] : array[0];
            if (nextVertex.x === vertex.x) {
                //vertical edge
                const inverted = this.velocity_x < 0;
                const x = inverted ? this.x : this.x + MOB_WIDTH;
                if (
                    inverted &&
                    vertex.x < x &&
                    vertex.x > this.velocity_x + x
                ) {
                    //IT CROSSES THE LINE, CHECK IF IT CROSSES EDGE
                } else if (
                    !inverted &&
                    vertex.x < x &&
                    vertex.x > this.velocity_x + x
                ) {
                    //IT CROSSES THE LINE, CHECK IF IT CROSSES EDGE (same as inverted)
                }
            } else {
                //horizontal edge
            }
        });
    }
}

export default Mob;
