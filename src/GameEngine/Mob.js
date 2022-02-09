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
        this.edges = null;
        this.nextVertex = null;
    }

    static randomize(velocity, max_x, max_y) {
        return new Mob(
            getRandomInt(max_x),
            getRandomInt(max_y),
            (getRandomInt(3) || 1) * velocity,
            (getRandomInt(3) || 1) * velocity
        );
    }

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

    // The most obvious solution, then use EDGES v2

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
    move(edges, player) {
        //Edges were updated, need to recompute the closest intersection.
        if (edges !== this.edges) {
            this.edges = edges;
            this._computeIntersection(edges);
        }
    }

    _computeIntersection(edges = this.edges) {
        // Closest edge computing
        edges.forEach((edge) => {
            if (edge.hasOwnProperty('x')) {
                // Vertical
                if (
                    (this.velocity_x < 0 && this.x < edge.x) ||
                    (this.velocity_x > 0 && this.x > edge.x)
                )
                    return;
                // TODO find intersection
            } else {
                // Horizontal
                if (
                    (this.velocity_y < 0 && this.y < edge.y) ||
                    (this.velocity_y > 0 && this.y > edge.y)
                )
                    return;
                // TODO find intersection
            }
        });
    }
}

export default Mob;
