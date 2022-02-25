import React from 'react';
import PropTypes from 'prop-types';
// import PlayerLayer from './PlayerLayer';
import GridLayer from './GridLayer';
import MobLayer from './MobLayer';

function CanvasStage({ gameCore }) {
    //TODO
    // Prepare nice error component
    if (!gameCore) return null;

    return (
        <div>
            <GridLayer gameCore={gameCore} />
            <MobLayer gameCore={gameCore} />
            {/*<PlayerLayer gameCore={gameCore} />*/}
        </div>
    );
}

CanvasStage.propTypes = {
    gameCore: PropTypes.object,
};

export default CanvasStage;
