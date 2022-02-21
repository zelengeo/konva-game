import React from 'react';
import Game from './Game';
import WithDebugContext from './Utils/withDebugContext';

function App() {
    return (
        <WithDebugContext>
            <Game />
        </WithDebugContext>
    );
}

export default App;
