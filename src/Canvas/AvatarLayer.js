import React, {useRef, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {DebugContext} from "../Utils/withDebugContext";

const getCtx = (ref) => ref.current.getContext('2d');
const AVATAR_WIDTH = 20;
const AVATAR_HEIGHT = 20;
const PATH_WIDTH = AVATAR_WIDTH;
const PATH_HEIGHT = AVATAR_HEIGHT;


const AvatarLayer = ({posX, posY, width, height}) => {
    const debug = useContext(DebugContext);
    debug.render && console.log("Canvas layer rerender", {posX, posY, width, height})

    const canvasRef = useRef(null);
    useEffect(()=>{
        const ctx = getCtx(canvasRef);
        ctx.save();
    },[]);
    useEffect(()=>{
        debug.canvas && console.log("Avatar redraw at useEffect:", {posX, posY});
        const ctx = getCtx(canvasRef);
        ctx.clearRect(0, 0, AVATAR_WIDTH, AVATAR_HEIGHT); // clear actor
        ctx.fillStyle = 'rgba(0, 0, 200, 0.3)';
        ctx.fillRect(0, 0, PATH_WIDTH, PATH_HEIGHT); // draw path
        ctx.restore();
        ctx.save();
        ctx.translate(posX,posY);
        ctx.fillStyle = 'rgb(0, 0, 200)';
        ctx.fillRect(0, 0, AVATAR_WIDTH, AVATAR_HEIGHT); // draw actor
    },[posX, posY, width, height, debug.canvas])

    return <canvas width={width}
                   height={height}
                   ref={canvasRef}
                   style={{position: "absolute", left: 5, top: 5, zIndex: 3}}//TODO replace with some better css tool
    />

};

AvatarLayer.defaultProps = {
    width: 800,
    height: 600,
    posX: 0,
    posY: 0
};

AvatarLayer.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    posX: PropTypes.number,
    posY: PropTypes.number
};

export default AvatarLayer;
