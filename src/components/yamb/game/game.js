import React, { useEffect, useState } from 'react';
import Dice from '../dice/dice';
import Sheet from '../sheet/sheet';
import './game.css';

function Game(props) {

    const [fill, setFill] = useState(null);
    const [restart, setRestart] = useState(false);
    const [diceToRoll, setDiceToRoll] = useState([0, 1, 2, 3, 4]);
    const [rollCount, setRollCount] = useState(props.rollCount);
    const {
        sheet,
        dices,
        announcement,
        status,
        player
    } = props;

    let diceDisabled = rollCount === 0 || rollCount === 3 || status === "FINISHED";

    useEffect(() => {
        if (restart) {
            props.onRestart();
            setRestart(false);
            setRollCount(0);
            setDiceToRoll([0, 1, 2, 3, 4]);
        }
    }, [restart]);

    useEffect(() => {
        if (fill) {
            props.onFill(fill.columnType, fill.boxType);    
            setDiceToRoll([0, 1, 2, 3, 4]);
            setRollCount(0);
            setFill(null);
        }
    }, [fill]);

    function handleDiceClick(index) {
        let newDiceToRoll = [...diceToRoll];
        if (newDiceToRoll.includes(index)) {   
            newDiceToRoll.splice(newDiceToRoll.indexOf(index), 1);
        } else {
            newDiceToRoll.push(index);
        }
        setDiceToRoll(newDiceToRoll);
    };

    function handleRoll() {
        setRollCount(rollCount + 1);
        props.onRoll(diceToRoll);
    }

    function handleBoxClick(columnType, boxType) {
        if (columnType === "ANNOUNCEMENT" && props.announcement == null) {
            props.onAnnounce(boxType);
        } else {
            setFill({ columnType, boxType })
        }
    };

    function handleRestart() {
        setRestart(true);
    };

    function handleLogout() {
        props.onLogout();
    };

    return (
        <div className="game">
            {dices && <div className="dices">
                {dices.map((dice, index) => (
                    <div key={index}>
                        <Dice 
                            value={dice.value} 
                            index={dice.index} 
                            saved={!diceToRoll.includes(dice.index)}
                            rollCount={rollCount}
                            diceDisabled={diceDisabled}
                            onDiceClick={handleDiceClick}>
                        </Dice>
                    </div>
                ))}
            </div>}
            <br/>
            {sheet && <Sheet 
                columns={sheet.columns} 
                rollCount={rollCount}
                announcement={announcement}
                status={status}
                dices={dices}
                player={player}
                onRoll={handleRoll}
                onRestart={handleRestart}
                onBoxClick={handleBoxClick}
                onLogout={handleLogout}>
            </Sheet>}
        </div>
    );
}

export default Game;
