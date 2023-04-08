import React from 'react';
import PropTypes from 'prop-types';

//menu with inputs and START button
function GameResults({ toMenu, restartGame }) {
    return (
        <React.Fragment>
            <button onClick={toMenu}>MENU!</button>
            <button onClick={restartGame}>RESTART!</button>
        </React.Fragment>
    );
}

GameResults.propTypes = {
    restartGame: PropTypes.func,
    toMenu: PropTypes.func,
};

export default GameResults;
