import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CurrentUserContext, DeviceContext, ErrorContext, MenuContext } from '../../../App';
import Column from '../column/column';
import Label from '../label/label';
import { useNavigate } from 'react-router-dom';
import './sheet.css';
import playerService from '../../../services/playerService';

function Sheet(props) {

    const { t } = useTranslation();
    const { currentUser } = useContext(CurrentUserContext);
    const { isMobile } = useContext(DeviceContext);
    const { handleError } = useContext(ErrorContext);
    const [ isRolling, setRolling ] = useState(false);
    const { isMenuOpen, setMenuOpen } = useContext(MenuContext);
    const [ playerName, setPlayerName ] = useState();
    const {
        columns,
        rollCount,
        announcement,
        status,
        playerId,
        diceToRoll
    } = props;

    const restartButtonDisabled = status !== "IN_PROGRESS";
    const rollDisabled = isRolling || rollCount === 3 || isAnnouncementRequired() || status !== "IN_PROGRESS" || diceToRoll.length === 0;
    const navigate = useNavigate();

    useEffect(() => {
        const recaptchaBadge = document.querySelector('.grecaptcha-badge');

        if (isMobile) {
            if (recaptchaBadge) {
                recaptchaBadge.style.display = 'none';
            }
        } else {
            if (recaptchaBadge) {
                recaptchaBadge.style.display = 'block';
            }
        }
        return () => {
            if (recaptchaBadge) {
                recaptchaBadge.style.display = 'block';
            }
        };
    }, [isMobile]);

    useEffect(() => {
        if (playerId) {
            if (playerId === currentUser.id) {
                setPlayerName(currentUser.name);
            } else {
                playerService.getById(playerId).then((data) => {
                    setPlayerName(data.name);
                })
                .catch((error) => {
                    handleError(error);
                });
            }
        }
    }, [playerId]);

    function handleRoll() {
        setRolling(true);
        props.onRoll();
        setTimeout(() => {
            setRolling(false);
        }, 500);
    }

    function handleRestart() {
        props.onRestart();
    }

    function handleBoxClick(columnType, boxType) {
        props.onBoxClick(columnType, boxType);
    }

    function getTotalSum() {
        return getTopSectionSum() + getMiddleSectionSum() + getBottomSectionSum();
    }

    function getTopSectionSum() {
        let sum = 0;
        for (let i in columns) {
            sum += getTopSectionSumByIndex(i);
        }
        return sum;
    }

    function getMiddleSectionSum() {
        let sum = 0;
        for (let i in columns) {
            sum += getMiddleSectionSumByIndex(i);
        }
        return sum;
    }

    function getBottomSectionSum() {
        let sum = 0;
        for (let i in columns) {
            sum += getBottomSectionSumByIndex(i);
        }
        return sum;
    }

    function getTopSectionSumByIndex(columnIndex) {
        let sum = 0;
        for (let i = 0; i < 6; i++) {
            if (columns[columnIndex].boxes[i].value) {
                sum += columns[columnIndex].boxes[i].value;
            }
        }
        if (sum >= 60) {
            sum += 30;
        }
        return sum;
    }

    function getMiddleSectionSumByIndex(columnIndex) {
        let sum = 0;
        if (columns[columnIndex].boxes[0].value && columns[columnIndex].boxes[6].value && columns[columnIndex].boxes[7].value) {
            sum = columns[columnIndex].boxes[0].value * (columns[columnIndex].boxes[6].value - columns[columnIndex].boxes[7].value);
        }
        return sum;
    }

    function getBottomSectionSumByIndex(columnIndex) {
        let sum = 0;
        for (let i = 8; i < 13; i++) {
            if (columns[columnIndex].boxes[i].value) {
                sum += columns[columnIndex].boxes[i].value;
            }
        }
        return sum;
    }

    function isAnnouncementRequired() {
        return rollCount === 1 && announcement === null && areAllNonAnnouncementColumnsCompleted();
    }

    function areAllNonAnnouncementColumnsCompleted() {
        for (let i in columns) {
            if (columns[i].type !== "ANNOUNCEMENT" && !isColumnCompleted(i)) {
                return false;
            }
        }
        return true;
    }

    function isColumnCompleted(columnIndex) {
        for (let i in columns[columnIndex].boxes) {
            if (columns[columnIndex].boxes[i].value === null) {
                return false;
            }
        }
        return true;
    }

    return (
        <div className="sheet">
            <div className="column">
                { isMobile ?
                    <button className="settings-button-sheet" onClick={() => {setMenuOpen(!isMenuOpen);}}>
                        <span className="icon">&#9776;</span>
                    </button> : <div></div>
                }
                <Label icon="ones" info={t('ones')}></Label>
                <Label icon="twos" info={t('twos')}></Label>
                <Label icon="threes" info={t('threes')}></Label>
                <Label icon="fours" info={t('fours')}></Label>
                <Label icon="fives" info={t('fives')}></Label>
                <Label icon="sixes" info={t('sixes')}></Label>
                <Label variant="sum" value="Σ (1, 6)" info={t('top-section-sum')}></Label>
                {/* MID SECTION */}
                <Label value={t('max')} info="Zbroj svih kockica"></Label>
                <Label value={t('min')} info="Zbroj svih kockica"></Label>
                <Label variant="sum" value="∆ x 1s" info={t('middle-section-sum')}></Label>
                {/* BOTTOM SECTION */}
                <Label value={t('trips')} info={t('trips-info')}></Label>
                <Label value={t('straight')} info={t('straight-info')}></Label>
                <Label value={t('boat')} info={t('boat-info')}></Label>
                <Label value={t('carriage')} info={t('carriage-info')}></Label>
                <Label value={t('yamb')} info={t('yamb-info')}></Label>
                <Label variant="sum" value="Σ (T, J)" info={t('bottom-section-sum')}></Label>
            </div>
            {columns && columns.map((column, index) => (
                <div className="column" key={column.type}>
                    <Column 
                        type={column.type} 
                        boxes={column.boxes} 
                        rollCount={rollCount}
                        announcement={announcement}
                        topSectionSum={getTopSectionSumByIndex(index)}
                        middleSectionSum={getMiddleSectionSumByIndex(index)}
                        bottomSectionSum={getBottomSectionSumByIndex(index)}
                        onBoxClick={handleBoxClick}>
                    </Column> 
                </div>
            ))}
            <div className="column">
                <button className="roll-button" onClick={handleRoll} disabled={rollDisabled}>
                    <img src={"../svg/buttons/roll-" + (3-rollCount) + ".svg"} alt="Roll"></img>
                </button>                    
                <div className="top-section-sum">
                    <Label variant="sum" value={getTopSectionSum()}></Label>
                </div>
                <button className="restart-button" onClick={handleRestart} disabled={restartButtonDisabled}>
                    <img src={"../svg/buttons/restart.svg"} alt="Restart"></img>
                </button>
                <div className="middle-section-sum">
                    <Label variant="sum" value={getMiddleSectionSum()}></Label>
                </div>
                <div className="bottom-section-sum">
                    <Label variant="sum" value={getBottomSectionSum()}></Label>
                </div>
            </div>
            <div className="last-row">
                <button className="username-button" onClick={() => {navigate("/players/" + playerId)}}>{playerName}</button>
                <Label variant="total-sum" value={getTotalSum()}></Label>
            </div>
        </div>
    );
}

export default Sheet;
