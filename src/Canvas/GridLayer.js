import React, { useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { DebugContext } from '../Utils/withDebugContext';
import { getCtx } from '../Utils/helpers';
import AppearanceContext from './AppearanceContext';
import GameCore from '../GameEngine/GameCore';

//const BORDER_WIDTH = 5;

const GridLayer = ({ gameCore }) => {
    const canvasRef = useRef(null);
    const width = gameCore.width;
    const height = gameCore.height;
    const { scale } = useContext(AppearanceContext);

    const debug = useContext(DebugContext);
    debug.render && console.log('Field layer rerender', { width, height });

    //TODO also should listen to edges change
    // Or there should be separate canvas layer with borders and background animation
    useEffect(() => {
        debug.canvas &&
            console.log('Field redraw at useEffect:', { width, height, scale });
        const ctx = getCtx(canvasRef);
        ctx.scale(scale, scale);
        ctx.strokeRect(0, 0, width + 10, height + 10); // Scaling borders. Check if it looks ok
        ctx.fillStyle = 'rgba(0,0,0, 0.3)';
        ctx.fillRect(5, 5, width, height);
    }, [width, height, scale, debug.canvas]);

    return (
        <canvas
            width={(width + 10) * scale}
            height={(height + 10) * scale}
            ref={canvasRef}
            style={{ position: 'absolute', left: 0, top: 0, zIndex: 0 }} //TODO replace with some better css tool
        />
    );
};

GridLayer.propTypes = {
    gameCore: PropTypes.instanceOf(GameCore),
};

export default GridLayer;
