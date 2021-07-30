import React from 'react';

import GameCore from "./GameCore";

const MOVE_SPEED = 5; // MB move it to setting

//menu with inputs and START button
function GameStage({toMenu, toResults}) {

    return <React.Fragment>
        <GameCore moveSpeed={MOVE_SPEED}/>
        <button onClick={toResults}>RESULTS!</button>
        <button onClick={toMenu}>BACK TO MENU!</button>
    </React.Fragment>;
}

export default GameStage;
