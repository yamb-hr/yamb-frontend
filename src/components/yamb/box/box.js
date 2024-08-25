import React from 'react';
import './box.css';

function Box(props) {

    function handleClick() {
        props.onClick(props.type);
    };

    const value = props.value;
    const boxClass = "box " + (props.columnType === "ANNOUNCEMENT" && props.type === props.announcement ? "announcement" : "");
    const disabled = props.disabled;

    return (
        <button className={boxClass} onClick={handleClick} disabled={disabled}>
            <strong>{value}</strong>
        </button>
    );
}

export default Box;
