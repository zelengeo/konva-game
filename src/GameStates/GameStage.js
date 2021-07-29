import React, {useContext, useState} from 'react';
import CanvasStage from "../Canvas/CanvasStage";
import {DebugContext} from "../Utils/withDebugContext";

const MOVE_SPEED = 5; // MB move it to setting

//menu with inputs and START button
function GameStage({toMenu, toResults}) {
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const debug = useContext(DebugContext);

    return <React.Fragment>
        <CanvasStage updateDirection={e => {
            debug.state && console.log("next Direction", e, posX, posY)
            // TODO: import isOdd
            e % 2   ? setPosX(prev => prev + e * MOVE_SPEED) //TODO: is MOVE_SPEED setting needed?
                    : setPosY(prev => prev + e / 2 * MOVE_SPEED)
        }} posX={posX} posY={posY}/>
        <button onClick={toResults}>RESULTS!</button>
        <button onClick={toMenu}>BACK TO MENU!</button>
    </React.Fragment>;
}

export default GameStage;
