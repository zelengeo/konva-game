import React, { useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { DebugContext } from '../Utils/withDebugContext';
import { getCtx } from '../Utils/helpers';
import AppearanceContext from './AppearanceContext';
import GameCore from '../GameEngine/GameCore';

const MobLayer = ({ gameCore }) => {
    const canvasRef = useRef(null);
    const prevTickCountRef = useRef(gameCore.tickCount);
    const width = gameCore.width;
    const height = gameCore.height;
    const { scale, mobStyle } = useContext(AppearanceContext);

    const debug = useContext(DebugContext);
    debug.render && console.log('Mob layer rerender', { width, height });

    useEffect(() => {
        debug.canvas &&
            console.log('MobLayer useEffect update: ', width, height);
        const ctx = getCtx(canvasRef);
        let requestId;
        ctx.fillStyle = mobStyle; //Upgrade later
        ctx.scale(scale, scale);
        const render = () => {
            const ticks = gameCore.tickCount;
            //TODO check how same frames are rerendered/skipped in grown-up solutions
            if (prevTickCountRef.current === ticks) {
                debug.canvas &&
                    console.log(
                        'Mob redundant redraw at requestAnimationFrame:',
                        prevTickCountRef.current
                    );
                requestId = requestAnimationFrame(render);
                return;
            }

            prevTickCountRef.current = ticks;
            debug.canvas &&
                console.log(
                    'Mob redraw at useEffect:',
                    prevTickCountRef.current,
                    JSON.stringify(gameCore.mobs)
                );
            ctx.clearRect(0, 0, width, height);
            gameCore.mobs.forEach((mob) => {
                ctx.fillRect(mob.x, mob.y, 1, 1);
            });
            requestId = requestAnimationFrame(render);
        };
        render();
        return () => {
            cancelAnimationFrame(requestId);
        };
    }, [gameCore, scale, debug.canvas]);

    return (
        <canvas
            width={width * scale}
            height={height * scale}
            ref={canvasRef}
            style={{ position: 'absolute', left: 10, top: 10, zIndex: 3 }}
        />
    );
};

MobLayer.propTypes = {
    gameCore: PropTypes.instanceOf(GameCore),
};
export default MobLayer;
