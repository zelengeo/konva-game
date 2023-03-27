import React from 'react';

const APPEARANCE_DEFAULT_VALUES = {
    scale: 3,
    mobStyle: 'rgb(0, 0, 700)',
    bloom: true,
};

export const AppearanceContext = React.createContext(APPEARANCE_DEFAULT_VALUES);

export default AppearanceContext;
