import { createContext, useEffect, useState } from 'react';

export const DeviceContext = createContext(null);

export const DeviceProvider = ({ children }) => {
    
    const [isMobile, setMobile] = useState(window.innerWidth <= 480);

    useEffect(() => {
        const handleResize = () => setMobile(window.innerWidth <= 480);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <DeviceContext.Provider value={{ isMobile, setMobile }}>
            {children}
        </DeviceContext.Provider>
    );
};