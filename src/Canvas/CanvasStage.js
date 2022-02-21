import React from 'react';
import PropTypes from 'prop-types';
import AvatarLayer from './AvatarLayer';
import GridLayer from './GridLayer';
import MobLayer from './MobLayer';

function CanvasStage({ gameBoard }) {
    return (
        <div className={'canvas-stage-container'}>
            <GridLayer gameBoard={gameBoard} />
            <MobLayer gameBoard={gameBoard} />
            <AvatarLayer gameBoard={gameBoard} />
        </div>
    );
}

CanvasStage.propTypes = {
    gameBoard: PropTypes.object,
};

export default CanvasStage;
