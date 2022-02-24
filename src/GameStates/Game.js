import React from 'react';

import GameStage from './GameStage';
import PropTypes from 'prop-types';
import AppearanceContext from '../Canvas/AppearanceContext';

//menu with inputs and START button
export function Game({ toMenu, toResults, speed, mobs, width, height, scale }) {
    return (
        <AppearanceContext.Provider value={{ scale }}>
            <GameStage
                speed={speed}
                mobs={mobs}
                width={width}
                height={height}
            />
            <button onClick={toResults}>RESULTS!</button>
            <button onClick={toMenu}>BACK TO MENU!</button>
        </AppearanceContext.Provider>
    );
}

Game.defaultProps = {
    mobs: 2,
    speed: 3,
    width: 400,
    height: 300,
    scale: 2,
};

Game.propTypes = {
    mobs: PropTypes.number,
    speed: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    scale: PropTypes.number,
    toMenu: PropTypes.func,
    toResults: PropTypes.func,
};

export default Game;
