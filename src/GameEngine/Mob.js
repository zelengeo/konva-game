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
        this.foremostIntersection = null;
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
        //checkPlayerCollision(player) => endGame / continue

        if (this.foremostIntersection?.edge) {
            //check if next x/y before the x/y from closes edge
            // if yes - incremnt this.x else swap the velocity
        }
    }

    _computeIntersection(edges = this.edges) {
        // Closest edge computing
        let foremostIntersection = { ticks: 1000 }; //TODO remove magic number
        //TODO make fancy reducer just cuz i can?
        edges.forEach((edge) => {
            //TODO cover this.x === edge.x and y
            if (isNaN(edge.y)) {
                // Vertical
                if (
                    !this.velocity_x || //theoretically mob can move vertically
                    (this.velocity_x < 0 && this.x < edge.x) ||
                    (this.velocity_x > 0 && this.x > edge.x)
                )
                    return;

                const ticksBeforeIntersect =
                    (edge.x - this.x) / this.velocity_x; //negative values avoided by the previous if
                if (ticksBeforeIntersect >= foremostIntersection.ticks) return;
                const intersectionY =
                    this.y + this.velocity_y * ticksBeforeIntersect;
                if (intersectionY >= edge.y1 && intersectionY <= edge.y2) {
                    foremostIntersection.ticks = ticksBeforeIntersect;
                    foremostIntersection.edge = edge;
                }
            } else {
                // Horizontal
                if (
                    !this.velocity_y ||
                    (this.velocity_y < 0 && this.y < edge.y) ||
                    (this.velocity_y > 0 && this.y > edge.y)
                )
                    return;
                const ticksBeforeIntersect =
                    (edge.y - this.y) / this.velocity_y; //negative values avoided by the previous if
                if (ticksBeforeIntersect >= foremostIntersection.ticks) return;
                const intersectionX =
                    this.x + this.velocity_x * ticksBeforeIntersect;
                if (intersectionX >= edge.x1 && intersectionX <= edge.x2) {
                    foremostIntersection.ticks = ticksBeforeIntersect;
                    foremostIntersection.edge = edge;
                }
            }
            if (foremostIntersection.edge) {
                this.foremostIntersection = foremostIntersection.edge;
            }
        });
    }
}

export default Mob;
