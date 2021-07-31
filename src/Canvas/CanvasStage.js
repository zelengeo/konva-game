import React from 'react';
import PropTypes from 'prop-types';
import ActorLayer from "./ActorLayer";
import GridLayer from "./GridLayer";


function CanvasStage(props) {





    return <div className={"canvas-stage-container"}>
        <GridLayer/>
        <ActorLayer {...props} />
    </div>


}

CanvasStage.defaultProps = {
    width: 800,
    height: 600
};

CanvasStage.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
};

export default CanvasStage;
