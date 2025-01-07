import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuContext } from '../../../providers/menuProvider';
import { CurrentUserContext } from '../../../providers/currentUserProvider';
import { DeviceContext } from '../../../providers/deviceProvider';
import Label from '../label/label';
import Column from '../column/column';
import './sheet.css';
import { NotificationsContext } from '../../../providers/notificationsProvider';

function Sheet(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { isMenuOpen, setMenuOpen } = useContext(MenuContext);
    const { currentUser } = useContext(CurrentUserContext);
    const { notifications, setNotificationsModalOpen } = useContext(NotificationsContext);
    const { isMobile } = useContext(DeviceContext);
    const {
        columns,
        rollCount,
        announcement,
        status,
        player,
        diceToRoll,
        latestBoxFilled,
        latestColumnFilled,
        type,
        subscribed,
        isRolling,
        isSpectator
    } = props;

    const restartButtonDisabled = isSpectator || status !== "IN_PROGRESS";
    const rollDisabled = isSpectator || isRolling || rollCount === 3 || isAnnouncementRequired() || status !== "IN_PROGRESS" || diceToRoll.length === 0;
    const undoDisabled = !latestColumnFilled || !latestBoxFilled || type === "CLASH";

    function handleRoll() {
        props.onRoll();
    }

    function handleBoxClick(columnType, boxType) {
        props.onBoxClick(columnType, boxType);
    }

    function handleUndoFill() {
        props.onUndoFill();
    }
    
    function handleRestart() {
        props.onRestart();
    }

    function handleSubscribeToggle() {
        props.onSubscribe();
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

    function handleUsernameClick() {
        if (player.id === currentUser.id) {
            navigate("/profile");
        } else {
            navigate("/players/" + player.id);
        }
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
                        isSpectator={isSpectator}
                        topSectionSum={getTopSectionSumByIndex(index)}
                        middleSectionSum={getMiddleSectionSumByIndex(index)}
                        bottomSectionSum={getBottomSectionSumByIndex(index)}
                        onBoxClick={handleBoxClick}>
                    </Column> 
                </div>
            ))}
            <div className="column">
                <button className="notification-button" onClick={() => setNotificationsModalOpen(true)}>
                    <span className="icon">&#128276;</span>
                    {notifications?.length > 0 && (
                        <span className="notification-badge">
                        {notifications.length > 99 ? "99+" : notifications.length}
                        </span>
                    )}
                </button>                
                <button className="roll-button" onClick={handleRoll} disabled={rollDisabled}>
                    <img src={"../svg/buttons/roll-" + (3-rollCount) + ".svg"} alt="Roll"></img>
                </button>                    
                <div className="top-section-sum">
                    <Label variant="sum" value={getTopSectionSum()}></Label>
                </div>
                <button className="undo-button" onClick={handleUndoFill} disabled={undoDisabled}>&#9100;</button>
                <div className="middle-section-sum">
                    <Label variant="sum" value={getMiddleSectionSum()}></Label>
                </div>
                <button className="restart-button" onClick={handleRestart} disabled={restartButtonDisabled}>
                    <img src={"../svg/buttons/restart.svg"} alt="Restart"></img>
                </button>
                <div className="bottom-section-sum">
                    <Label variant="sum" value={getBottomSectionSum()}></Label>
                </div>
            </div>
            <div className="last-row">
                <button className="username-button" onClick={() => { handleUsernameClick() }}>
                    {player.name}
                </button>
                {/* {isSpectator && location?.pathname !== '/' && (<div className="switch-container">
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={subscribed}
                            onChange={handleSubscribeToggle}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>)} */}
                <Label variant="total-sum" value={getTotalSum()}></Label>
            </div>
        </div>
    );
}

export default Sheet;
