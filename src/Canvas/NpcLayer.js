import React, {useRef, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {DebugContext} from "../Utils/withDebugContext";

const NPC_WIDTH = 5;
const NPC_HEIGHT = 5;
const NPC_STYLE = 'rgb(0, 0, 700)'

const getCtx = (ref) => ref.current.getContext('2d');

const NpcLayer = ({width, height, speed, enemies}) => {
    const debug = useContext(DebugContext);
    debug.render && console.log("NPC layer rerender", {width, height})

    const canvasRef = useRef(null);
    const NPCRef = useRef([{x: 0, y: 100, v_x: 2*speed, v_y: 1*speed}, {x: 600, y: 0, v_x: -1.5* speed, v_y: 2*speed}]);

    useEffect(() => {
        debug.canvas && console.log("NPC redraw at useEffect:", JSON.stringify(NPCRef.current));
        const ctx = getCtx(canvasRef);
        let requestId;
        ctx.fillStyle = NPC_STYLE;
        const render = () => {
            ctx.clearRect(0, 0, width, height);
            NPCRef.current.forEach(NPC => {
                let x = NPC.x + NPC.v_x;
                let y = NPC.y + NPC.v_y;
                // let x_correction = 0;
                // let y_correction = 0;
                if (x + NPC_WIDTH > width) {
                    NPC.v_x = NPC.v_x * -1;
                    NPC.x = 2 * width - (x + NPC_WIDTH);
                } else if (x - NPC_WIDTH < 0 ){
                    NPC.v_x = NPC.v_x * -1;
                    NPC.x =  - (x - NPC_WIDTH);
                } else NPC.x = x
                if (y + NPC_HEIGHT > height) {
                    NPC.v_y = NPC.v_y * -1;
                    NPC.y = 2 * height - (y + NPC_HEIGHT);
                } else if (y - NPC_HEIGHT < 0 ){
                    NPC.v_y = NPC.v_y * -1;
                    NPC.y =  - (y - NPC_HEIGHT);
                } else NPC.y = y
                ctx.fillRect(NPC.x, NPC.y, NPC_WIDTH, NPC_HEIGHT);
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

NpcLayer.defaultProps = {
    width: 800,
    height: 600,
};

NpcLayer.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
};

export default NpcLayer;
