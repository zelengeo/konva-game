import React from 'react';

import GameCore from "./GameCore";


//menu with inputs and START button
function GameStage({toMenu, toResults, speed, mobs}) {

    return <React.Fragment>
        <GameCore speed={speed} mobs={mobs} width={800} height={600}/>
        <button onClick={toResults}>RESULTS!</button>
        <button onClick={toMenu}>BACK TO MENU!</button>
    </React.Fragment>;
}

export default GameStage;
