import React, {useState} from "react";

const DEBUG_MAP_DEFAULT = {canvas: true, render: true, state: true};

export const DebugContext = React.createContext(DEBUG_MAP_DEFAULT);
//TODO remove all occurrences
function WithDebugContext({children}) {
    const [debug, setDebug] = useState(DEBUG_MAP_DEFAULT);

    function handleInputChange(event) {
        const target = event.target;
        const value = target.checked;
        const name = target.name;
        setDebug(prev =>  ({...prev, [name]:value}));
    }

    return <DebugContext.Provider value={debug}>
        <form>
            {Object.keys(DEBUG_MAP_DEFAULT).map(key => <label key={key}>
                {key}:
                <input
                    name={key}
                    type="checkbox"
                    checked={debug[key]}
                    onChange={handleInputChange}/>
            </label>)}
        </form>
        <hr/>
        {children}
    </DebugContext.Provider>

}

export default WithDebugContext;