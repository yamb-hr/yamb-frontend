import { useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MenuContext } from '../../../providers/menuProvider';
import { ToastContext } from '../../../providers/toastProvider';
import { DeviceContext } from '../../../providers/deviceProvider';
import { CurrentUserContext } from '../../../providers/currentUserProvider';
import { NotificationsContext } from '../../../providers/notificationsProvider';
import playerService from '../../../services/playerService';
import Label from '../label/label';
import Modal from '../../modal/modal';
import Column from '../column/column';
import './sheet.css';
import { ErrorHandlerContext } from '../../../providers/errorHandlerProvider';

function Sheet(props) {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { showSuccessToast } = useContext(ToastContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { isMenuOpen, setMenuOpen } = useContext(MenuContext);
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
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
        // subscribed,
        isRolling,
        isSpectator,
        glow
    } = props;

    const [username, setUsername] = useState(player.name);
    const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);
    const [reactionCooldown, setReactionCooldown] = useState(false);

    const restartButtonDisabled = isSpectator || status !== "IN_PROGRESS" || type === "CLASH";
    const rollDisabled = isSpectator || isRolling || rollCount === 3 || isAnnouncementRequired() || status !== "IN_PROGRESS" || diceToRoll.length === 0;
    // const undoDisabled = isSpectator || !latestColumnFilled || !latestBoxFilled || type === "CLASH" || status === "COMPLETED" || status === "ARCHIVED";

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

    // function handleSubscribeToggle() {
    //     props.onSubscribe();
    // }

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
        return Math.max(0, sum);
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
            setUsernameModalOpen(true);
        } else {
            navigate("/players/" + player.id);
        }
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handleCloseUsernameModal = () => {
        if (username !== currentUser.name) submitUsernameChange();
        setUsernameModalOpen(false);
    }

    const submitUsernameChange = () => {
        playerService.updateUsername(currentUser, username).then(data => {
            setCurrentUser(data);
            showSuccessToast(t('username-updated'));
        }).catch(error => {
            handleError(error);
            setUsername(currentUser.name);
        });
    }

    const handleSendReaction = (reaction) => {
        if (reactionCooldown) return;
        props.onSendReaction(reaction);
        setReactionCooldown(true);
        setTimeout(() => {
            setReactionCooldown(false);
        }, 3000);
    };

    const handleSendSuggestion = (suggestion) => {
        if (reactionCooldown) return;
        props.onSendSuggestion(suggestion);
        setReactionCooldown(true);
        setTimeout(() => {
            setReactionCooldown(false);
        }, 3000);
    };

    return (
        <div className="sheet">
            <div className="column">
                { isMobile ?
                    <button className="settings-button-sheet" onClick={() => {setMenuOpen(!isMenuOpen);}}>
                        <span className="icon">&#9776;</span>
                    </button> : <div></div>
                }
                <Label icon="ones" info={t('ones')} value="ones" suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label icon="twos" info={t('twos')} value="twos" suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label icon="threes" info={t('threes')} value="threes" suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label icon="fours" info={t('fours')} value="fours" suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label icon="fives" info={t('fives')} value="fives" suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label icon="sixes" info={t('sixes')} value="sixes" suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label variant="sum" value="Σ (1, 6)" info={t('top-section-sum')}></Label>
                {/* MID SECTION */}
                <Label value="max" info={t("sum-of-all-dice")} suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label value="min" info={t("sum-of-all-dice")} suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label variant="sum" value="∆ x 1s" info={t('middle-section-sum')}></Label>
                {/* BOTTOM SECTION */}
                <Label info={t('trips-info')} value="trips" suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label info={t('straight-info')} value="straight" suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label info={t('boat-info')} value="boat" suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label info={t('carriage-info')} value="carriage" suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
                <Label info={t('yamb-info')} value="yamb" suggestion={props.suggestion} onClick={handleSendSuggestion}></Label>
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
                        latestBoxFilled={latestBoxFilled}
                        glow={glow && (column.type === latestColumnFilled)}
                        topSectionSum={getTopSectionSumByIndex(index)}
                        middleSectionSum={getMiddleSectionSumByIndex(index)}
                        bottomSectionSum={getBottomSectionSumByIndex(index)}
                        onBoxClick={handleBoxClick}>
                    </Column> 
                </div>
            ))}
            <div className="column">
                <button className="notification-button" onClick={() => setNotificationsModalOpen(true)} disabled={!notifications.length}>
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
                <div className="middle-section-corner">
                    {type === "CLASH" ? 
                        <button className="undo-button" onClick={() => handleSendReaction("&#10067;")}>
                            &#10067;
                        </button>
                        :
                        <button className="undo-button" onClick={handleUndoFill}>
                            &#9100;
                        </button>
                    }     
                </div>
                
                <div className="middle-section-sum">
                    <Label variant="sum" value={getMiddleSectionSum()}></Label>
                </div>
                <div className="bottom-section-corner">
                    {type ==="CLASH" ? 
                        <div className="reaction-buttons">
                            <button className="reaction-button" onClick={() => handleSendReaction("&#127881;")}>&#127881;</button>
                            <button className="reaction-button" onClick={() => handleSendReaction("&#127808;")}>&#127808;</button>
                            <button className="reaction-button" onClick={() => handleSendReaction("&#127931;")}>&#127931;</button>
                        </div>
                        :
                        <button className="restart-button" onClick={handleRestart} disabled={restartButtonDisabled}>
                            <img src={"../svg/buttons/restart.svg"} alt="Restart"></img>
                        </button>
                    }      
                </div>
                          
                <div className="bottom-section-sum">
                    <Label variant="sum" value={getBottomSectionSum()}></Label>
                </div>
            </div>
            <div className="last-row">
                <button className="username-button" onClick={handleUsernameClick}>
                    {player.id === currentUser.id ? currentUser.name : player.name}
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
            <Modal isOpen={isUsernameModalOpen} onClose={handleCloseUsernameModal}>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    className="username-input"
                    placeholder={t("enter-username")}
                />
            </Modal>
        </div>
    );
}

export default Sheet;
