import React, { useState, useEffect } from 'react';
import './spinner.css';

function Spinner() {
    const diceFaces = ['\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685'];
    const [currentFace, setCurrentFace] = useState(diceFaces[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * 6);
            } while (diceFaces[randomIndex] === currentFace);

            setCurrentFace(diceFaces[randomIndex]);
        }, 500);

        return () => clearInterval(interval);
    }, [currentFace]);

    return (
        <div className="spinner">
            {currentFace}
        </div>
    );
}

export default Spinner;
