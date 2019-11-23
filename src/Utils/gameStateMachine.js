import {assign, Machine} from 'xstate';

const CONSTANTS = {
    LIVES: 3,
    ENEMIES: 2,
    SPEED: 3,
    SCORE: 0
};

export const STATES = {
    MENU: "menu",
    GAME: "game",
    RESULT: "result"
};

export const gameStateMachine = Machine({
        id: 'game',
        initial: STATES.MENU,
        context: {lives: CONSTANTS.LIVES, enemies: CONSTANTS.ENEMIES, score: CONSTANTS.SCORE, speed: CONSTANTS.SPEED},
        states: {
            [STATES.MENU]: {
                on: {
                    START: {
                        target: STATES.GAME,
                        cond: context => context.lives && context.enemies && context.speed
                    },
                    UPDATE_CONTEXT: {
                        actions: "assignContext"
                    }
                }
            },
            [STATES.GAME]: {
                on: {
                    END_GAME_SESSION: {
                        target: STATES.RESULT
                     },
                    NEXT_GAME: {
                        target: STATES.GAME,
                        cond: context => context.lives
                    },
                    RETURN_TO_MENU: {
                        target: STATES.MENU
                    }
                }
            },
            [STATES.RESULT]: {
                on: {
                    END: STATES.MENU,
                    RESTART: STATES.GAME
                }
            }
        }
    },
    {
        actions: {
            decreaseLives: assign({lives: context => (context.lives - 1)}),
            assignContext: assign((context, event) => event.context)
        }
    });

export default gameStateMachine;
