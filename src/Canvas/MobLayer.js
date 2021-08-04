import React, {useRef, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {DebugContext} from "../Utils/withDebugContext";
import {getRandomMobs} from "../GameEngine/GameBoard";

const MOB_STYLE = 'rgb(0, 0, 700)'


const getCtx = (ref) => ref.current.getContext('2d');

const MobLayer = ({width, height, speed, mobs}) => {
    const debug = useContext(DebugContext);
    debug.render && console.log("Mob layer rerender", {width, height})

    const canvasRef = useRef(null);

    // all computing will be transferred to the board
    const mobListRef = useRef(getRandomMobs(mobs, speed, width, height));

    useEffect(() => {
        debug.canvas && console.log("Mob redraw at useEffect:", JSON.stringify(mobListRef.current));
        const ctx = getCtx(canvasRef);
        let requestId;
        ctx.fillStyle = MOB_STYLE;
        const render = () => {
            ctx.clearRect(0, 0, width, height);
            mobListRef.current.forEach(mob => {
                let x = mob.x + mob.v_x;
                let y = mob.y + mob.v_y;
                if (x + MOB_WIDTH > width) {
                    mob.v_x = mob.v_x * -1;
                    mob.x = 2 * width - (x + MOB_WIDTH);
                } else if (x - MOB_WIDTH < 0 ){
                    mob.v_x = mob.v_x * -1;
                    mob.x =  - (x - MOB_WIDTH);
                } else mob.x = x
                if (y + MOB_HEIGHT > height) {
                    mob.v_y = mob.v_y * -1;
                    mob.y = 2 * height - (y + MOB_HEIGHT);
                } else if (y - MOB_HEIGHT < 0 ){
                    mob.v_y = mob.v_y * -1;
                    mob.y =  - (y - MOB_HEIGHT);
                } else mob.y = y
                ctx.fillRect(mob.x, mob.y, MOB_WIDTH, MOB_HEIGHT);
            })
            requestId = requestAnimationFrame(render);
        }
        render();
        return () => {
            cancelAnimationFrame(requestId);
        };
    }, [ width, height, debug.canvas])


    return <canvas width={width}
                   height={height}
                   ref={canvasRef}
                   style={{position: "absolute", left: 5, top: 5, zIndex: 2}}
    />

};

MobLayer.defaultProps = {
    width: 800,
    height: 600,
    mobs: 2,
    speed: 3
};

MobLayer.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    mobs: PropTypes.number,
    speed: PropTypes.number,
};

export default MobLayer;
