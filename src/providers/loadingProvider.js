import { createContext, useState } from 'react';

export const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
    
    const [isLoading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
    
};