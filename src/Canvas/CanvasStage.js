import React from 'react';
import PropTypes from 'prop-types';
import AvatarLayer from "./AvatarLayer";
import GridLayer from "./GridLayer";
import MobLayer from "./MobLayer";


function CanvasStage(props) {





    return <div className={"canvas-stage-container"}>
        <GridLayer/>
        <MobLayer speed={props.speed} mobs={props.mobs}/>
        <AvatarLayer {...props} />
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
