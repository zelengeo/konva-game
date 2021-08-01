import React, {useContext} from 'react';
import {useMachine} from '@xstate/react';
import gameStateMachine, {STATES} from "./Utils/gameStateMachine";
import GameMenu from "./GameStates/GameMenu";
import GameStage from "./GameStates/GameStage";
import GameResults from "./GameStates/GameResults";
import {DebugContext} from "./Utils/withDebugContext";

function Game() {
    const [current, send] = useMachine(gameStateMachine);

    const debug = useContext(DebugContext);
    debug.state && console.log("GAME STATE", current);

    let children;
    switch (current.value) {
        case STATES.MENU:
            children = <GameMenu {...current.context} startGame={() => send("START")} updateContext={(nextContext) => {
                send({type: "UPDATE_CONTEXT", context: nextContext})
            }}/>;
            break;
        case STATES.GAME:
            children = <GameStage {...current.context} toResults={() => send("END_GAME_SESSION")} toMenu={() => send("RETURN_TO_MENU")}/>;
            break;
        case STATES.RESULT:
            children = <GameResults {...current.context} toMenu={() => send("END")} restartGame={() => send("RESTART")}/>;
            break;
        default:
            children = <GameMenu {...current.context} startGame={() => send("START")}/>;
    }

    // switch with render-props components for menu and result. And game
    return <div className={"gameContainer"}>{children}</div>;
}

export default Game;
