import React from 'react';
import {useMachine} from '@xstate/react';
import gameStateMachine from "./Utils/gameStateMachine";

function Game() {
    const [gameState, sendState] = useMachine(gameStateMachine);


    // switch with render-props components for menu and result. And game
    return <div>
        <p>{gameState.value}</p>
        <button onClick={() => sendState('NEXT')}>"pushme"</button>
    </div>;
}

export default Game;
