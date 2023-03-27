import React, { useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { DebugContext } from '../Utils/withDebugContext';
import { getCtx } from '../Utils/helpers';
//Attempt to create reusable CanvasLayer - failed one
const CanvasLayer = ({ posX, posY, width, height }) => {
    const debug = useContext(DebugContext);
    debug.render &&
        console.log('Canvas layer rerender', { posX, posY, width, height });

    const canvasRef = useRef(null);
    useEffect(() => {
        debug.canvas &&
            console.log('Canvas redraw at useEffect:', { posX, posY });
        const ctx = getCtx(canvasRef);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgb(0, 0, 200)';
        ctx.fillRect(posX, posY, 20, 20);
        //FIXME: debug value causes deps warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posX, posY, width, height]);

    return <canvas width={width} height={height} ref={canvasRef} />;
};

CanvasLayer.defaultProps = {
    width: 800,
    height: 600,
    posX: 0,
    posY: 0,
};

CanvasLayer.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    posX: PropTypes.number,
    posY: PropTypes.number,
};

export default CanvasLayer;
