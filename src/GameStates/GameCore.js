import React, {useCallback, useContext, useState} from 'react';
import CanvasStage from "../Canvas/CanvasStage";
import {DebugContext} from "../Utils/withDebugContext";
import useEventHandler from "../Utils/useEventListener";
import PropTypes from "prop-types";
import {AVATAR_HEIGHT, AVATAR_WIDTH} from "../Canvas/AvatarLayer";

export const MOVE_MAP = {
    LEFT: -1,
    RIGHT: 1,
    DOWN: 2,
    UP: -2
};

export const KEYBOARD_EVENTS_MOVE_MAP = {
    ArrowLeft: MOVE_MAP.LEFT,
    KeyA: MOVE_MAP.LEFT,
    ArrowRight: MOVE_MAP.RIGHT,
    KeyD: MOVE_MAP.RIGHT,
    ArrowUp: MOVE_MAP.UP,
    KeyW: MOVE_MAP.UP,
    ArrowDown: MOVE_MAP.DOWN,
    KeyS: MOVE_MAP.DOWN
};

//menu with inputs and START button
function GameCore({speed, mobs, width, height}) {
    //TODO state update is not the best wya of handling this probably
    const [actorPosX, setActorPosX] = useState(0);
    const [actorPosY, setActorPosY] = useState(0);
    // const gameBoard = useRef(new GameBoard(height, width));
    const debug = useContext(DebugContext);
    const keydownHandler = useCallback(function(event) {
        if (KEYBOARD_EVENTS_MOVE_MAP[event.code]) {
            event.preventDefault();
            const movementValue = (event.shiftKey ? 3 : 1) * KEYBOARD_EVENTS_MOVE_MAP[event.code];
            debug.state && console.log("next Direction", movementValue, actorPosX, actorPosY)
            // TODO: import isOdd
            movementValue % 2
                ? setActorPosX(prev => {
                    const next = prev + movementValue * speed;
                    if (next < 0) return 0;
                    if (next + AVATAR_WIDTH > width) return width - AVATAR_WIDTH
                    return next
                })
                : setActorPosY(prev => {
                    const next = prev + movementValue / 2 * speed
                    if (next < 0) return 0;
                    if (next + AVATAR_HEIGHT > height) return height - AVATAR_HEIGHT
                    return next
                })
        }
    }, [debug.state, actorPosX, actorPosY, speed, width, height])
    useEventHandler('keydown', keydownHandler);

    return  <CanvasStage posX={actorPosX} posY={actorPosY} speed={speed} mobs={mobs} height={height} width={width}/>
}

CanvasStage.defaultProps = {
    mobs: 2,
    speed: 3,
    width: 800,
    height: 600
};

CanvasStage.propTypes = {
    mobs: PropTypes.number,
    speed: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
};

export default GameCore;
