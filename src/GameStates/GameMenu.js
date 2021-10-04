import React from 'react';


function GameMenu({lives, mobs, speed, startGame, updateContext}) {
    return <React.Fragment>
        <form>
            <label>
                Speed:
                <select value={speed} onChange={event => updateContext({speed: parseInt(event.target.value)})}>
                    {Array.from(Array(9)).map((element, index) =>
                        <option key={index + 1} value={index + 1}>{index + 1}</option>)}
                </select>
            </label>
            <label>
                Mobs count:
                <select value={mobs} onChange={event => updateContext({mobs: parseInt(event.target.value)})}>
                    {Array.from(Array(4)).map((element, index) =>
                        <option key={index + 1} value={index + 1}>{index + 1}</option>)}
                </select>
            </label>
            <label>
                Lives:
                <select value={lives} onChange={event => updateContext({lives: parseInt(event.target.value)})}>
                    {Array.from(Array(9)).map((element, index) =>
                        <option key={index + 1} value={index + 1}>{index + 1}</option>)}
                </select>
            </label>
        </form>
        <button onClick={startGame}>START!</button>
    </React.Fragment>;
}

export default GameMenu;
