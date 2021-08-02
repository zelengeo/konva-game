import {assign, Machine} from 'xstate';

const DEFAULTS = {
    LIVES: 3,
    MOBS: 2,
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
        context: {lives: DEFAULTS.LIVES, mobs: DEFAULTS.MOBS, score: DEFAULTS.SCORE, speed: DEFAULTS.SPEED},
        states: {
            [STATES.MENU]: {
                on: {
                    START: {
                        target: STATES.GAME,
                        cond: context => context.lives && context.mobs && context.speed
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
