import React from 'react';
import CanvasStage from "../Canvas/CanvasStage";

//menu with inputs and START button
function GameStage({toMenu, toResults}) {
    return <React.Fragment>
        <CanvasStage updateDirection={e => {
            console.log("next Direction", e)
        }}/>
        <button onClick={toResults}>RESULTS!</button>
        <button onClick={toMenu}>BACK TO MENU!</button>
    </React.Fragment>;
}

export default GameStage;
