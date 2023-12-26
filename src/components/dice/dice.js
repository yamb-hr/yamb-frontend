import React, { useEffect, useState } from 'react';
import './dice.css';

function Dice(props) {

    const [isRolling, setRolling] = useState(false);
    const [rollCount, setRollCount] = useState(props.rollCount); 
    const [diceClass, setDiceClass] = useState("dice");
    const [diceStyle, setDiceStyle] = useState({});
    const [diceDisabled, setDiceDisabled] = useState(props.diceDisabled);
    const [value, setValue] = useState(props.value);

    function handleClick() {
        props.onDiceClick(props.index);
    };

    useEffect(() => {
        if (!isRolling) {
            setDiceDisabled(props.diceDisabled)
            setValue(props.value);
        }
    }, [props.value, isRolling]);

    useEffect(() => {
        let intervalId;
        if (isRolling) {
            intervalId = setInterval(() => {
                setValue(Math.floor(Math.random() * 6) + 1);
            }, 150);
        } else {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [isRolling]);

    useEffect(() => {
        let newDiceClass = "dice " + (props.saved ? "saved " : " ");
        let newDiceStyle = {};
        if (isRolling) {
            newDiceClass += "rolling ";
            newDiceClass += Math.random() > 0.5 ? "clockwise" : "counter-clockwise";
            let time = Math.round(800 + Math.random() * 1000)
            newDiceStyle = { animationDuration: time + "ms" }
            setTimeout(() => {
                setRolling(false);
            }, time);
        }
        setDiceClass(newDiceClass);
        setDiceStyle(newDiceStyle);
    }, [isRolling, props.saved]);

    useEffect(() => {
        if ((rollCount !== props.rollCount && !props.saved) && props.rollCount !== 0) {
            setRolling(true);
            setDiceDisabled(true);
        } else {
            setDiceDisabled(props.diceDisabled);
        }
        setRollCount(props.rollCount);
    }, [props.rollCount, props.saved]);

    return (
        <button className={diceClass} style={diceStyle} onClick={handleClick} disabled={diceDisabled}>
            <img src={'../svg/dice/' + value + '.svg'} alt={value}/>
        </button>
    );
}

export default Dice;