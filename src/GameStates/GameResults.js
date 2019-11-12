import React from 'react';

//menu with inputs and START button
function GameResults({toMenu, restartGame}) {



    return <React.Fragment>
        <button onClick={toMenu}>MENU!</button>
        <button onClick={restartGame}>RESTART!</button>
    </React.Fragment>;
}

export default GameResults;
