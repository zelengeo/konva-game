/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { DebugContext } from '../Utils/withDebugContext';
import { getCtx } from '../Utils/helpers';
import AppearanceContext from './AppearanceContext';

const IMG_PROPS = {
    sunRadius: 256,

    polygonCount: 16,
    polygonSize: 48,

    perspective: 70,
    cameraY: 32,

    colorDistortionSize: 2,
    resolutionDivider: 4, // Image quality
    bloom: true,
};

//Attempt to create reusable CanvasLayer - failed one
const BackgroundLayer = ({ posX, posY, width, height }) => {
    const debug = useContext(DebugContext);
    debug.render &&
        console.log('Background layer rerender', { posX, posY, width, height });

    const sunCanvasRef = useRef(null);
    const postProcessCanvasRef = useRef(null);
    const redFilterCanvasRef = useRef(null);
    const greenFilterCanvasRef = useRef(null);
    const blueFilterCanvasRef = useRef(null);
    const { scale, bloom } = useContext(AppearanceContext);

    useEffect(() => {
        debug.canvas &&
            console.log('Background redraw at useEffect:', { posX, posY });
        const sunCtx = getCtx(sunCanvasRef);
        const postProcessCtx = getCtx(postProcessCanvasRef);
        const redFilterCtx = getCtx(redFilterCanvasRef);
        const greenFilterCtx = getCtx(greenFilterCanvasRef);
        const blueFilterCtx = getCtx(blueFilterCanvasRef);
        let requestId;
        // sunCtx.scale(scale, scale);
        const render = () => {
            drawSun(
                sunCtx,
                width / 2,
                40 + IMG_PROPS.sunRadius,
                IMG_PROPS.sunRadius
            );
            postProcessing({
                canvasCtx: sunCtx,
                postProcessCtx,
                redFilterCtx,
                greenFilterCtx,
                blueFilterCtx,
                bloom,
            });
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
                ref={sunCanvasRef}
            />
            <canvas
                width={width}
                height={height}
                style={{ position: 'absolute' }}
                ref={postProcessCanvasRef}
            />
            <canvas
                width={width}
                height={height}
                style={{ position: 'absolute' }}
                ref={redFilterCanvasRef}
            />
            <canvas
                width={width}
                height={height}
                style={{ position: 'absolute' }}
                ref={greenFilterCanvasRef}
            />
            <canvas
                width={width}
                height={height}
                style={{ position: 'absolute' }}
                ref={blueFilterCanvasRef}
            />
        </div>
    );
};

BackgroundLayer.defaultProps = {
    width: 800,
    height: 600,
    posX: 0,
    posY: 0,
};

BackgroundLayer.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    posX: PropTypes.number,
    posY: PropTypes.number,
};

const drawSun = (ctx, x, y, r) => {
    ctx.fillStyle = ctx.createLinearGradient(x, y - r, x, y + r);
    ctx.fillStyle.addColorStop(0.1, '#fdce74');
    ctx.fillStyle.addColorStop(0.8, '#d60066');

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // splitting the sun by lines
    ctx.fillStyle = '#000';
    const maxSpace = 14;
    for (let i = 1; i < maxSpace; i++) {
        ctx.fillRect(x - r, y + i * maxSpace, r * 2, i);
    }
    if (maxSpace * (maxSpace + 1) < r) {
        ctx.fillRect(x - r, y + maxSpace ** 2, r * 2, r - maxSpace ** 2);
    }
};

const fixCliffDist = (vertex, x1, z1) => {
    let x = vertex[0];
    let y = vertex[1];
    let z = vertex[2];

    let dist = Math.sqrt((x1 - x) ** 2 + (z1 - z) ** 2);
    if (dist < 400) {
        vertex[1] -= 400 - dist;
        vertex[1] += Math.cos(x) * 32 + Math.sin(z) * 32;
    }
};

// Generation model of mountain
const mountainMesh = function (x1, z1) {
    const { polygonSize } = IMG_PROPS;
    let mesh = [];
    let s = 10;
    const cliffFn = (vertex) => fixCliffDist(vertex, x1, z1);

    // Generation floor
    for (let i = 0; i < s ** 2; i++) {
        let x = i % s;
        let z = (i / s) >> 0;
        let y = 128;

        // Set origin of plane to center
        x -= s / 2;
        z -= s / 2;

        // Scaling to polygonSize
        x *= polygonSize;
        z *= polygonSize;

        // Translation to coord x1, z1
        x += x1;
        z += z1;

        let p1 = [
            [x, y, z],
            [x, y, z + polygonSize],
            [x + polygonSize, y, z],
            [x, y, z],
        ];

        let p2 = [
            [x + polygonSize, y, z + polygonSize],
            [x, y, z + polygonSize],
            [x + polygonSize, y, z],
            [x + polygonSize, y, z + polygonSize],
        ];

        p1.forEach(cliffFn);
        p2.forEach(cliffFn);

        mesh.push(p1);
        mesh.push(p2);
    }

    // meshes.push(mesh);
    return mesh;
};

//post  processing
const postProcessing = function ({
    canvasCtx,
    postProcessCtx,
    redFilterCtx,
    greenFilterCtx,
    blueFilterCtx,
    bloom,
}) {
    const canvas = canvasCtx.canvas;
    // Bloom
    if (bloom) {
        canvasCtx.globalCompositeOperation = 'screen';
        canvasCtx.filter = 'blur(8px)';
        canvasCtx.drawImage(canvas, 0, 0);
        canvasCtx.filter = 'blur(0px)';
    }

    // Color Correction
    canvasCtx.fillStyle = canvasCtx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
    );
    canvasCtx.fillStyle.addColorStop(0, '#AB4FE7');
    canvasCtx.fillStyle.addColorStop(0.4, '#28144B');
    canvasCtx.globalCompositeOperation = 'overlay';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.globalCompositeOperation = 'source-over';

    // Post-processing
    // Getting only red colors from canvas
    redFilterCtx.drawImage(canvas, 2, 0);
    redFilterCtx.globalCompositeOperation = 'multiply';
    redFilterCtx.fillStyle = '#f00';
    redFilterCtx.fillRect(0, 0, canvas.width, canvas.height);
    redFilterCtx.globalCompositeOperation = 'source-over';

    // Getting only green colors from canvas
    greenFilterCtx.drawImage(canvas, 2, 0);
    greenFilterCtx.globalCompositeOperation = 'multiply';
    greenFilterCtx.fillStyle = '#0f0';
    greenFilterCtx.fillRect(0, 0, canvas.width, canvas.height);
    greenFilterCtx.globalCompositeOperation = 'source-over';

    // Getting only blue colors from canvas
    blueFilterCtx.drawImage(canvas, 2, 0);
    blueFilterCtx.globalCompositeOperation = 'multiply';
    blueFilterCtx.fillStyle = '#00f';
    blueFilterCtx.fillRect(0, 0, canvas.width, canvas.height);
    blueFilterCtx.globalCompositeOperation = 'source-over';

    // Making TV-effect
    // Combine all filter in one with bloom effect and color shifting
    postProcessCtx.clearRect(0, 0, canvas.width, canvas.height);
    postProcessCtx.globalCompositeOperation = 'screen';
    postProcessCtx.filter = 'blur(0.5px)';
    postProcessCtx.drawImage(redFilterCtx.canvas, 0, 0);
    postProcessCtx.drawImage(
        greenFilterCtx.canvas,
        IMG_PROPS.colorDistortionSize,
        0
    );
    postProcessCtx.drawImage(
        blueFilterCtx.canvas,
        -IMG_PROPS.colorDistortionSize,
        0
    );
    postProcessCtx.globalCompositeOperation = 'source-over';
};

export default BackgroundLayer;

const SynthwaveWorld = () => {
    // Synthwave world
    // WebGL Version is coming soon
    const c = document.createElement('canvas').getContext('2d'); // There will party
    const canvas = c.canvas;
    const postctx = document.body
        .appendChild(document.createElement('canvas'))
        .getContext('2d'); // For post-processing

    // This is for TV-effect
    const redFilter = document.createElement('canvas').getContext('2d');
    const greenFilter = document.createElement('canvas').getContext('2d');
    const blueFilter = document.createElement('canvas').getContext('2d');

    // Common
    let frame = 0;
    const polygons = [];
    const meshes = [];

    // Properties
    const polygonCount = 16;
    const polygonSize = 48;
    const perspective = 70;
    const cameraY = 32;
    const colorDistortionSize = 2;
    const resolutionDivider = 4; // Image quality
    const bloom = true;

    const { sin, cos, PI } = Math;

    //CHECK
    const drawSun = (x, y, r) => {
        c.fillStyle = c.createLinearGradient(x, y - r, x, y + r);
        c.fillStyle.addColorStop(0.1, '#fdce74');
        c.fillStyle.addColorStop(0.8, '#d60066');

        c.beginPath();
        c.arc(x, y, r, 0, Math.PI * 2);
        c.fill();

        // splitting the sun by lines
        for (let i = 0; i < 30; i++) {
            c.fillStyle = '#000';
            c.fillRect(x - r, y + i * 10, r * 2, i);
        }
    };

    //CHECK
    // Generation model of mountain
    const mountainMesh = function (x1, z1) {
        let mesh = [];
        let s = 10;
        let cliffFunction = (vertex) => {
            let x = vertex[0];
            let y = vertex[1];
            let z = vertex[2];

            let dist = Math.sqrt((x1 - x) ** 2 + (z1 - z) ** 2);
            if (dist < 400) {
                vertex[1] -= 400 - dist;
                vertex[1] += cos(x) * 32 + sin(z) * 32;
            }
        };

        // Generation floor
        for (let i = 0; i < s ** 2; i++) {
            let x = i % s;
            let z = (i / s) >> 0;
            let y = 128;

            // Set origin of plane to center
            x -= s / 2;
            z -= s / 2;

            // Scaling to polygonSize
            x *= polygonSize;
            z *= polygonSize;

            // Translation to coord x1, z1
            x += x1;
            z += z1;

            let p1 = [
                [x, y, z],
                [x, y, z + polygonSize],
                [x + polygonSize, y, z],
                [x, y, z],
            ];

            let p2 = [
                [x + polygonSize, y, z + polygonSize],
                [x, y, z + polygonSize],
                [x + polygonSize, y, z],
                [x + polygonSize, y, z + polygonSize],
            ];

            p1.forEach(cliffFunction);
            p2.forEach(cliffFunction);

            mesh.push(p1);
            mesh.push(p2);
        }

        meshes.push(mesh);
    };

    const loop = function () {
        let rad = (cos(frame / 40) * Math.PI) / 20; // Camera rotation
        frame++;

        // Resizing canvas
        if (
            postctx.canvas.width !== postctx.canvas.offsetWidth ||
            postctx.canvas.height !== postctx.canvas.offsetHeight
        ) {
            postctx.canvas.width =
                canvas.width =
                redFilter.canvas.width =
                greenFilter.canvas.width =
                blueFilter.canvas.width =
                    postctx.canvas.offsetWidth / resolutionDivider;

            postctx.canvas.height =
                canvas.height =
                redFilter.canvas.height =
                greenFilter.canvas.height =
                blueFilter.canvas.height =
                    postctx.canvas.offsetHeight / resolutionDivider;
        }

        c.fillRect(0, 0, canvas.width, canvas.height);
        c.strokeStyle = '#00e9ff';

        c.save();
        // 0,0 is center of the canvas
        c.translate(canvas.width / 2, canvas.height / 2);

        // Drawing sun with transformation
        drawSun(sin(rad) * 150, -64, 64);

        // Drawing Models
        c.fillStyle = '#28144B';
        c.strokeStyle = '#CC3B2F';
        meshes.forEach((p) => {
            p.forEach((polygon, i) => {
                c.beginPath();
                polygon.forEach((vertex, j) => {
                    let x = vertex[0];
                    let y = vertex[1];
                    let z = vertex[2];
                    let dist = Math.abs(x);

                    let tx = x;
                    let ty = y;
                    let tz = z;

                    // Transformation Rotate Y
                    tx = x * cos(rad) + z * sin(rad);
                    tz = -x * sin(rad) + z * cos(rad);

                    x = tx;
                    y = ty;
                    z = tz;

                    // Translate by camera
                    y += cameraY + cos(frame / 5) * 1;
                    y -=
                        (sin(frame / 10 + z / 6) + cos(frame / 10 + x / 6)) * 8;

                    if (z < 1) z = 1;

                    // Transform
                    x /= z / perspective;
                    y /= z / perspective;

                    c[j === 0 ? 'moveTo' : 'lineTo'](x, y);
                });
                c.fill();
                c.stroke();
            });
        });

        // Drawing road
        c.fillStyle = '#511445';
        polygons.forEach((polygon, i) => {
            c.beginPath();
            polygon.forEach((vertex, j) => {
                let x = vertex[0];
                let y = vertex[1];
                let z = vertex[2];
                let tx, ty, tz;
                let dist = Math.abs(x);

                // Make ground move
                z -= frame % polygonSize;

                // Waveform
                if (dist > 256) {
                    // This line makes cliffs in right and left
                    y -=
                        dist -
                        128 +
                        (sin(frame / 10 + z / 6) + cos(frame / 10 + x / 6)) * 8;
                }
                // Translate by camera
                y += cameraY + cos(frame / 5) * 1;

                tx = x;
                ty = y;
                tz = z;

                // Transform RotationY
                tx = x * cos(rad) + z * sin(rad);
                tz = -x * sin(rad) + z * cos(rad);

                // Apply transformation
                x = tx;
                y = ty;
                z = tz;

                if (z < 1) z = 1;

                x /= z / perspective;
                y /= z / perspective;

                // if current vertex is first then calling 'moveTo' function else calling 'lineTo'
                c[j === 0 ? 'moveTo' : 'lineTo'](x, y);
            });

            c.strokeStyle = `hsl(${
                polygon[0][2] / 10 + 250 - frame
            }deg, 100%, 50%)`;
            c.fillStyle = `hsl(${
                polygon[0][2] / 10 + 200 - frame
            }deg, 100%, 10%)`;
            c.fill();
            c.stroke();
        });

        c.restore();

        //CHECK - post processing
        // Bloom
        if (bloom) {
            c.globalCompositeOperation = 'screen';
            c.filter = 'blur(8px)';
            c.drawImage(canvas, 0, 0);
            c.filter = 'blur(0px)';
        }

        // Color Correction
        c.fillStyle = c.createLinearGradient(0, 0, 0, canvas.height);
        c.fillStyle.addColorStop(0, '#AB4FE7');
        c.fillStyle.addColorStop(0.4, '#28144B');
        c.globalCompositeOperation = 'overlay';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.globalCompositeOperation = 'source-over';

        // Post-processing
        // Getting only red colors from canvas
        redFilter.drawImage(canvas, 2, 0);
        redFilter.globalCompositeOperation = 'multiply';
        redFilter.fillStyle = '#f00';
        redFilter.fillRect(0, 0, canvas.width, canvas.height);
        redFilter.globalCompositeOperation = 'source-over';

        // Getting only green colors from canvas
        greenFilter.drawImage(canvas, 2, 0);
        greenFilter.globalCompositeOperation = 'multiply';
        greenFilter.fillStyle = '#0f0';
        greenFilter.fillRect(0, 0, canvas.width, canvas.height);
        greenFilter.globalCompositeOperation = 'source-over';

        // Getting only blue colors from canvas
        blueFilter.drawImage(canvas, 2, 0);
        blueFilter.globalCompositeOperation = 'multiply';
        blueFilter.fillStyle = '#00f';
        blueFilter.fillRect(0, 0, canvas.width, canvas.height);
        blueFilter.globalCompositeOperation = 'source-over';

        // Making TV-effect
        // Combine all filter in one with bloom effect and color shifting
        postctx.clearRect(0, 0, canvas.width, canvas.height);
        postctx.globalCompositeOperation = 'screen';
        postctx.filter = 'blur(0.5px)';
        postctx.drawImage(redFilter.canvas, 0, 0);
        postctx.drawImage(greenFilter.canvas, colorDistortionSize, 0);
        postctx.drawImage(blueFilter.canvas, -colorDistortionSize, 0);
        postctx.globalCompositeOperation = 'source-over';

        requestAnimationFrame(loop);
    };

    mountainMesh(0, 500, 15);

    // Generating Ground
    for (let i = 0; i < polygonCount ** 2; i++) {
        let x = i % polygonCount;
        let z = (i / polygonCount) >> 0;
        let y = 0;

        // Set x-origin to center of plane
        x -= polygonCount / 2;

        // Scaling to polygon Size
        x *= polygonSize;
        z *= polygonSize;

        // Creating two polygons to make rectangle
        polygons.push([
            [x, y, z],
            [x, y, z + polygonSize],
            [x + polygonSize, y, z],
            [x, y, z],
        ]);
        polygons.push([
            [x + polygonSize, y, z + polygonSize],
            [x, y, z + polygonSize],
            [x + polygonSize, y, z],
            [x + polygonSize, y, z + polygonSize],
        ]);
    }
    // loop();
};
