import React, { useEffect, useState } from 'react';
import Dice from '../dice/dice';
import Sheet from '../sheet/sheet';
import './game.css';

function Game(props) {

    const [fillBox, setFillBox] = useState(null);
    const [restart, setRestart] = useState(false);
    const [diceToRoll, setDiceToRoll] = useState([0, 1, 2, 3, 4]);
    const [rollCount, setRollCount] = useState(props.rollCount);

    useEffect(() => {
        if (restart) {
            props.onRestart();
            setRestart(false);
            setRollCount(0);
            setDiceToRoll([0, 1, 2, 3, 4]);
        }
    }, [restart]);

    useEffect(() => {
        if (fillBox) {
            props.onFillBox(fillBox.columnType, fillBox.boxType);    
            setDiceToRoll([0, 1, 2, 3, 4]);
            setRollCount(0);
            setFillBox(null);
        }
    }, [fillBox]);

    function handleDiceClick(index) {
        let newDiceToRoll = [...diceToRoll];
        if (newDiceToRoll.includes(index)) {   
            newDiceToRoll.splice(newDiceToRoll.indexOf(index), 1);
        } else {
            newDiceToRoll.push(index);
        }
        setDiceToRoll(newDiceToRoll);
    };

    function handleRollDice() {
        setRollCount(rollCount + 1);
        props.onRollDice(diceToRoll);
    }

    function handleBoxClick(columnType, boxType) {
        if (columnType === "ANNOUNCEMENT" && props.announcement == null) {
            props.onMakeAnnouncement(boxType);
        } else {
            setFillBox({ columnType, boxType })
        }
    };

    function handleRestart() {
        setRestart(true);
    };

    function handleLogout() {
        props.onLogout();
    };

    let sheet = props.sheet;
    let dices = props.dices;
    let announcement = props.announcement;
    let player = props.player;
    let diceDisabled = rollCount === 0 || rollCount === 3;

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
                dices={dices}
                player={player}
                onRollDice={handleRollDice}
                onRestart={handleRestart}
                onBoxClick={handleBoxClick}
                onLogout={handleLogout}>
            </Sheet>}
        </div>
    );
}

export default Game;
