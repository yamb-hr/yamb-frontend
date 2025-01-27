import React, { useState } from 'react';
import './box.css';

function Box(props) {

    const [ isDisabled, setIsDisabled ] = useState(false);

    function handleClick() {
        setIsDisabled(true);
        props.onClick(props.type);
        setTimeout(() => {
            setIsDisabled(false);
        }, 300);
    };

    const value = props.value;
    const boxClass = "box " + (props.columnType === "ANNOUNCEMENT" && props.type === props.announcement ? " announcement" : "") + (props.glow ? " glow" : "");
    const disabled = props.disabled || isDisabled;

    return (
        <button className={boxClass} onClick={handleClick} disabled={disabled}>
            <strong>{value}</strong>
        </button>
    );
}

export default Box;
