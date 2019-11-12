import React from 'react';

//menu with inputs and START button
function GameStage({toMenu, toResults}) {
    return <React.Fragment>
        <button onClick={toResults}>RESULTS!</button>
        <button onClick={toMenu}>BACK TO MENU!</button>
    </React.Fragment>;
}

export default GameStage;
