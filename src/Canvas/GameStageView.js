import React, { useContext } from 'react';
import PropTypes from 'prop-types';
// import PlayerLayer from './PlayerLayer';
import GridLayer from './GridLayer';
import MobLayer from './MobLayer';
import AppearanceContext from './AppearanceContext';

function GameStageView({ gameCore }) {
    //TODO
    // Prepare nice error component
    const { scale } = useContext(AppearanceContext);
    if (!gameCore) return null;

    //TODO eliminate style prop
    return (
        <div
            style={{
                position: 'relative',
                width: `${gameCore.width * scale + 20}px`,
                height: `${gameCore.height * scale + 20}px`,
            }}
        >
            <GridLayer gameCore={gameCore} />
            <MobLayer gameCore={gameCore} />
            {/*<PlayerLayer gameCore={gameCore} />*/}
        </div>
    );
}

GameStageView.propTypes = {
    gameCore: PropTypes.object,
};

export default GameStageView;
