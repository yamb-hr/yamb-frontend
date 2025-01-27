import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '../box/box';
import Label from '../label/label';
import './column.css';

function Column(props) {

    const { t } = useTranslation();
    const {
        type,
        boxes,
        rollCount,
        announcement,
        isSpectator,
        topSectionSum,
        middleSectionSum,
        bottomSectionSum,
        glow,
        latestBoxFilled
    } = props;

    const handleBoxClick = (boxType) => {
        props.onBoxClick(type, boxType);
    };

    function isBoxDisabled(box) {
        if (rollCount === 0) {
            return true;
        } else if (box.value != null) {
            return true;
        } else if (announcement != null) {
            return type !== "ANNOUNCEMENT" || box.type !== announcement;
        } else if (type === "FREE") {
            return false;
        } else if (type === "DOWNWARDS") {
            return box.type !== "ONES" && props.boxes[boxes.findIndex(x => x.type === box.type) - 1].value == null;
        } else if (type === "UPWARDS") {
            return box.type !== "YAMB" && props.boxes[boxes.findIndex(x => x.type === box.type) + 1].value == null;
        } else if (type === "ANNOUNCEMENT") {
            return props.rollCount !== 1 && box.type !== announcement;
        }
        return false;
    };

    return (
        <div className="column">    
            <Label 
                icon={type.toLowerCase()} 
                value={type}
                info={t(type.toLowerCase() + '-info')}
                variant="column-symbol">
            </Label>
            {boxes.map((box) => (
                <Box 
                    key={type + box.type}
                    type={box.type}
                    value={box.value}
                    columnType={type}
                    announcement={announcement}
                    glow={glow && (box.type === latestBoxFilled)}
                    disabled={isSpectator || isBoxDisabled(box)}
                    onClick={handleBoxClick}>
                </Box>
            ))}
            <div className="sum column-top-section-sum">
                <Label variant="sum" value={topSectionSum}></Label>
            </div>
            <div className="sum column-middle-section-sum">
                <Label variant="sum" value={middleSectionSum}></Label>
            </div>
            <div className="sum column-bottom-section-sum">
                <Label variant="sum" value={bottomSectionSum}></Label>
            </div>
        </div>
    );
}

export default Column;
