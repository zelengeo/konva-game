/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { DebugContext } from '../Utils/withDebugContext';
import { getCtx } from '../Utils/helpers';
import AppearanceContext from './AppearanceContext';

const IMG_PROPS = {
    vertexCount: 7000,
    vertexSize: 3,
    oceanWidth: 204,
    oceanHeight: -80,
    gridSize: 32,
    waveSize: 16,
    perspective: 100,
};

//Attempt to create reusable CanvasLayer - failed one
const OceanScene = ({ posX, posY, width, height }) => {
    const debug = useContext(DebugContext);
    debug.render &&
        console.log('OceanScene rerender', { posX, posY, width, height });

    const oceanCtx = useRef(null);
    const postProcessCanvasRef = useRef(null);
    const { scale, bloom } = useContext(AppearanceContext);

    useEffect(() => {
        debug.canvas &&
            console.log('OceanScene redraw at useEffect:', { posX, posY });
        const oceanCtx = getCtx(oceanCtx);
        const postProcessCtx = getCtx(postProcessCanvasRef);
        let requestId;
        // sunCtx.scale(scale, scale);
        const render = () => {
            draw(oceanCtx, postProcessCtx);
            requestId = requestAnimationFrame(render);
        };
        render();
        return () => {
            cancelAnimationFrame(requestId);
        };
    }, [posX, posY, width, height, scale, debug.canvas]);

    return (
        <div style={{ width, height }}>
            <canvas
                width={width}
                height={height}
                style={{ position: 'absolute' }}
                ref={oceanCtx}
            />
            <canvas
                width={width}
                height={height}
                style={{ position: 'absolute' }}
                ref={postProcessCanvasRef}
            />
        </div>
    );
};

const draw = (ctx, postProcessCtx, vertices, frame) => {
    const {
        vertexCount,
        vertexSize,
        oceanWidth,
        oceanHeight,
        gridSize,
        waveSize,
        perspective,
    } = IMG_PROPS;
    const depth = (vertexCount / oceanWidth) * gridSize;

    let rad = (Math.sin(frame / 100) * Math.PI) / 20;
    let rad2 = (Math.sin(frame / 50) * Math.PI) / 10;
    if (
        postProcessCtx.canvas.width !== postProcessCtx.canvas.offsetWidth ||
        postProcessCtx.canvas.height !== postProcessCtx.canvas.offsetHeight
    ) {
        postProcessCtx.canvas.width = canvas.width =
            postProcessCtx.canvas.offsetWidth;
        postProcessCtx.canvas.height = canvas.height =
            postProcessCtx.canvas.offsetHeight;
    }

    ctx.fillStyle = `hsl(200deg, 100%, 2%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    c.beginPath();

    vertices.forEach((vertex, i) => {
        let ni = i + oceanWidth;
        let x = vertex[0] - (frame % (gridSize * 2));
        let z =
            vertex[2] -
            ((frame * 2) % gridSize) +
            (i % 2 === 0 ? gridSize / 2 : 0);
        let wave =
            Math.cos(frame / 45 + x / 50) -
            Math.sin(frame / 20 + z / 50) +
            Math.sin(frame / 30 + (z * x) / 10000);
        let y = vertex[1] + wave * waveSize;
        let a = Math.max(0, 1 - Math.sqrt(x ** 2 + z ** 2) / depth);
        let tx, ty, tz;

        y -= oceanHeight;

        // Transformation variables
        tx = x;
        ty = y;
        tz = z;

        // Rotation Y
        tx = x * Math.cos(rad) + z * Math.sin(rad);
        tz = -x * Math.sin(rad) + z * Math.cos(rad);

        x = tx;
        y = ty;
        z = tz;

        // Rotation Z
        tx = x * Math.cos(rad) - y * Math.sin(rad);
        ty = x * Math.sin(rad) + y * Math.cos(rad);

        x = tx;
        y = ty;
        z = tz;

        // Rotation X

        ty = y * Math.cos(rad2) - z * Math.sin(rad2);
        tz = y * Math.sin(rad2) + z * Math.cos(rad2);

        x = tx;
        y = ty;
        z = tz;

        x /= z / perspective;
        y /= z / perspective;

        if (a < 0.01) return;
        if (z < 0) return;

        ctx.globalAlpha = a;
        ctx.fillStyle = `hsl(${180 + wave * 20}deg, 100%, 50%)`;
        ctx.fillRect(
            x - (a * vertexSize) / 2,
            y - (a * vertexSize) / 2,
            a * vertexSize,
            a * vertexSize
        );
        ctx.globalAlpha = 1;
    });
    ctx.restore();

    // Post-processing
    postProcessCtx.drawImage(ctx, 0, 0);

    postProcessCtx.globalCompositeOperation = 'screen';
    postProcessCtx.filter = 'blur(16px)';
    postProcessCtx.drawImage(canvas, 0, 0);
    postProcessCtx.filter = 'blur(0)';
    postProcessCtx.globalCompositeOperation = 'source-over';
};

OceanScene.defaultProps = {
    width: 800,
    height: 600,
    posX: 0,
    posY: 0,
};

OceanScene.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    posX: PropTypes.number,
    posY: PropTypes.number,
};

export default OceanScene;
