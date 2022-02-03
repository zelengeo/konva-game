import React from "react";

import GameCore from "./GameCore";
import PropTypes from "prop-types";

//menu with inputs and START button
function GameStage({ toMenu, toResults, speed, mobs, width, height }) {
    return (
        <React.Fragment>
            <GameCore speed={speed} mobs={mobs} width={width} height={height} />
            <button onClick={toResults}>RESULTS!</button>
            <button onClick={toMenu}>BACK TO MENU!</button>
        </React.Fragment>
    );
}

GameStage.defaultProps = {
    mobs: 2,
    speed: 3,
    width: 800,
    height: 600,
};

GameStage.propTypes = {
    mobs: PropTypes.number,
    speed: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    toMenu: PropTypes.func,
    toResults: PropTypes.func,
};

export default GameStage;
