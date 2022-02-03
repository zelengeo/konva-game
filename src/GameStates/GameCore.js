import React, { useCallback, useContext, useRef, useState } from "react";
import CanvasStage from "../Canvas/CanvasStage";
import { DebugContext } from "../Utils/withDebugContext";
import useEventHandler from "../Utils/useEventListener";
import PropTypes from "prop-types";
import GameBoard from "../GameEngine/GameBoard";

export const MOVE_MAP = {
    LEFT: -1,
    RIGHT: 1,
    DOWN: 2,
    UP: -2,
};

export const KEYBOARD_EVENTS_MOVE_MAP = {
    ArrowLeft: MOVE_MAP.LEFT,
    KeyA: MOVE_MAP.LEFT,
    ArrowRight: MOVE_MAP.RIGHT,
    KeyD: MOVE_MAP.RIGHT,
    ArrowUp: MOVE_MAP.UP,
    KeyW: MOVE_MAP.UP,
    ArrowDown: MOVE_MAP.DOWN,
    KeyS: MOVE_MAP.DOWN,
};

//menu with inputs and START button
function GameCore({ speed, mobs, width, height }) {
    // const [actorPosX, setActorPosX] = useState(0);
    // const [actorPosY, setActorPosY] = useState(0);
    const gameBoard = useRef(new GameBoard({ height, width, speed, mobs }));
    const debug = useContext(DebugContext);

    const keydownHandler = useCallback(
        function (event) {
            if (KEYBOARD_EVENTS_MOVE_MAP[event.code]) {
                event.preventDefault();
                const movementValue =
                    (event.shiftKey ? 3 : 1) *
                    KEYBOARD_EVENTS_MOVE_MAP[event.code];
                debug.state &&
                    console.log("next Direction", movementValue, event.code);
                // TODO: import isOdd
                movementValue % 2
                    ? gameBoard.current
                          .getPlayer()
                          .horizontalMove(movementValue)
                    : gameBoard.current
                          .getPlayer()
                          .verticalMove(movementValue / 2);
            }
        },
        [debug.state]
    );
    useEventHandler("keydown", keydownHandler);

    return <CanvasStage gameBoard={gameBoard.current} />;
}

CanvasStage.defaultProps = {
    mobs: 2,
    speed: 3,
    width: 800,
    height: 600,
};

CanvasStage.propTypes = {
    mobs: PropTypes.number,
    speed: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
};

export default GameCore;
