import { createContext, useState } from 'react';

export const InGameContext = createContext(null);

export const InGameProvider = ({ children }) => {

    const [inGame, setInGame] = useState(false);

    return (
        <InGameContext.Provider value={{ inGame, setInGame }}>
            {children}
        </InGameContext.Provider>
    );
    
};