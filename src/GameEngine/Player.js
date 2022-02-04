export const PLAYER_WIDTH = 20;
export const PLAYER_HEIGHT = 20;

export class Player {
    constructor({ x = 0, y = 0, height, width, speed }) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        //Collision detection with the board boundaries will happen on the Player, so width && height stored here too
        this.height = height;
        this.width = width;
        //TODO still not sure which format will have boundaries (and footprints too)
        // Make it after the collision detection research
        this.footPrints = [];
    }

    horizontalMove(movementValue) {
        //TODO add footprint of the current position and check if its needed
        const next = this.x + movementValue * this.speed;
        if (next < 0) return (this.x = 0);
        if (next + PLAYER_WIDTH > this.width)
            return (this.x = this.width - PLAYER_WIDTH);
        this.x = next;
    }
    verticalMove(movementValue) {
        //TODO add footprint of the current position and check if its needed
        const next = this.y + movementValue * this.speed;
        if (next < 0) return (this.y = 0);
        if (next + PLAYER_HEIGHT > this.height)
            return (this.y = this.height - PLAYER_HEIGHT);
        this.y = next;
    }
    // Player collision with Mob needs to be done, so some extra interface will be here
}

export default Player;
