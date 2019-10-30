import {Machine} from 'xstate';

const CONSTS = {
    LIVES: 3,
    ENEMIES: 2,
    SPEED: 3,
    SCORE: 0
};


export const gameStateMachine = Machine({
    id: 'game',
    initial: 'menu',
    context: { lives: CONSTS.LIVES, enemies: CONSTS.ENEMIES, score: CONSTS.SCORE },
    states: {
        menu: {
            on: { NEXT: 'game' }
        },
        game: {
            on: { NEXT: 'result' }
        },
        result: {
            on: { NEXT: 'menu', REPEAT: 'game' }
        }
    }
});

export default gameStateMachine;
