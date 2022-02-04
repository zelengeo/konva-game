import React from 'react';

import GameStage from './GameStage';
import PropTypes from 'prop-types';

//menu with inputs and START button
function Game({ toMenu, toResults, speed, mobs, width, height }) {
    return (
        <React.Fragment>
            <GameStage
                speed={speed}
                mobs={mobs}
                width={width}
                height={height}
            />
            <button onClick={toResults}>RESULTS!</button>
            <button onClick={toMenu}>BACK TO MENU!</button>
        </React.Fragment>
    );
}

Game.defaultProps = {
    mobs: 2,
    speed: 3,
    width: 800,
    height: 600,
};

Game.propTypes = {
    mobs: PropTypes.number,
    speed: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    toMenu: PropTypes.func,
    toResults: PropTypes.func,
};

export default Game;
