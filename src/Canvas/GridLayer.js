import React, {useRef, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {DebugContext} from "../Utils/withDebugContext";

const getCtx = (ref) => ref.current.getContext('2d');
const GridLayer = ({width, height}) => {
    const debug = useContext(DebugContext);
    debug.render && console.log("Field layer rerender", {width, height})

    const canvasRef = useRef(null);
    useEffect(()=>{
        debug.canvas && console.log("Field redraw at useEffect:", { width, height});
        const ctx = getCtx(canvasRef);
        ctx.strokeRect(0,0,width+10,height+10);
        ctx.fillStyle = 'rgba(0,0,0, 0.3)';
        ctx.fillRect(5, 5, width, height);
    },[width, height, debug.canvas])

    return <canvas width={width+10}
                   height={height+10}
                   ref={canvasRef}
                   style={{position: "absolute", left: 0, top: 0, zIndex: 0}} //TODO replace with some better css tool
    />

};

GridLayer.defaultProps = {
    width: 800,
    height: 600
};

GridLayer.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
};

export default GridLayer;
