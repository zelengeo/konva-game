import React from 'react';

import GameCore from "./GameCore";


//menu with inputs and START button
function GameStage({toMenu, toResults, speed, enemies}) {

    return <React.Fragment>
        <GameCore speed={speed} enemies={enemies}/>
        <button onClick={toResults}>RESULTS!</button>
        <button onClick={toMenu}>BACK TO MENU!</button>
    </React.Fragment>;
}

export default GameStage;
