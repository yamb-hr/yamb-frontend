import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '../box/box';
import Label from '../label/label';
import './column.css';

function Column(props) {

    const { t } = useTranslation();

    const handleBoxClick = (boxType) => {
        props.onBoxClick(props.type, boxType);
    };

    function isBoxDisabled(box) {
        if (props.rollCount === 0) {
            return true;
        } else if (box.value != null) {
            return true;
        } else if (props.announcement != null) {
            return props.type !== "ANNOUNCEMENT" || box.type !== props.announcement;
        } else if (props.type === "FREE") {
            return false;
        } else if (props.type === "DOWNWARDS") {
            return box.type !== "ONES" && props.boxes[props.boxes.findIndex(x => x.type === box.type) - 1].value == null;
        } else if (props.type === "UPWARDS") {
            return box.type !== "YAMB" && props.boxes[props.boxes.findIndex(x => x.type === box.type) + 1].value == null;
        } else if (props.type === "ANNOUNCEMENT") {
            return props.rollCount !== 1 && box.type !== props.announcement;
        }
        return false;
    };

    return (
        <div className="column">    
            <Label 
                icon={props.type.toLowerCase()} 
                value={props.type}
                info={t(props.type.toLowerCase() + '-info')}
                variant="column-symbol">
            </Label>
            {props.boxes.map((box) => (
                <Box 
                    key={props.type + box.type}
                    type={box.type}
                    value={box.value}
                    columnType={props.type}
                    announcement={props.announcement}
                    disabled={isBoxDisabled(box)}
                    onClick={handleBoxClick}>
                </Box>
            ))}
            <div className="sum column-top-section-sum">
                <Label variant="sum" value={props.topSectionSum}></Label>
            </div>
            <div className="sum column-middle-section-sum">
                <Label variant="sum" value={props.middleSectionSum}></Label>
            </div>
            <div className="sum column-bottom-section-sum">
                <Label variant="sum" value={props.bottomSectionSum}></Label>
            </div>
        </div>
    );
}

export default Column;
