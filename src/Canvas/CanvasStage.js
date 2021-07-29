import React from 'react';
import PropTypes from 'prop-types';
import useEventHandler from "../Utils/useEventListener";
import CanvasLayer from "./CanvasLayer";

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


function CanvasStage({ updateDirection, ...posProps }) {


    // const canvasRef = React.useRef(null);

    useEventHandler('keydown', function(event) {
        if (KEYBOARD_EVENTS_MOVE_MAP[event.code]) {
            event.preventDefault();
            updateDirection((event.shiftKey ? 3 : 1) * KEYBOARD_EVENTS_MOVE_MAP[event.code]);
        }
    });

    return <CanvasLayer {...posProps} />

}

CanvasStage.defaultProps = {
    width: 800,
    height: 600
};

CanvasStage.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    updateDirection: PropTypes.func
};

export default CanvasStage;
