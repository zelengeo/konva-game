import React from 'react';
import PropTypes from 'prop-types';


const CanvasLayer = React.forwardRef(({posX, posY, width, height}, canvasRef) => {

    // const canvasRef = React.useRef(null);
    // const getCanvasContext = () => canvasRef.current.getContext('2d');

    return <canvas width={width}
                   height={height}
                   ref={canvasRef}
                   // onClick={
                   //     e => {
                   //         const ctx = getCanvasContext();
                   //         ctx.fillRect(e.clientX, e.clientY, 20, 20)
                   //     }
                   // }
    />

})

CanvasLayer.defaultProps = {
    width: 800,
    height: 600,
    posX: 0,
    posY: 0
};

CanvasLayer.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
};

export default CanvasLayer;
