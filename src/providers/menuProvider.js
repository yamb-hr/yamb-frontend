import { createContext, useState } from 'react';

export const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {

    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <MenuContext.Provider value={{ isMenuOpen, setMenuOpen }}>
            {children}
        </MenuContext.Provider>
    );
    
};