import React, { useContext } from 'react';
import { Slide, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PreferencesContext } from '../../../providers/preferencesProvider';
import './label.css';

function Label(props) {

    const { t } = useTranslation();

    const { theme } = useContext(PreferencesContext);

    function handleClick() {
        if (props.info) {
            toast.info(props.info, {
                position: "top-center",
                autoClose: 2000,
                transition: Slide,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                pauseOnFocusLoss: true,
                draggable: true,
                progress: undefined,
                theme: theme
            });

            if (props.onClick) {
                props.onClick(props.value);
            }
        }
    }

    const value = props.value;
    const icon = props.icon?.toLowerCase();
    const isSuggested = props.suggestion && props.suggestion === value;
    const labelClass = `label ${props.variant || ""} ${isSuggested ? "suggestion" : ""}`;

    return (
        <div className={labelClass}>
            <button className={labelClass} onClick={handleClick} disabled={props.disabled}>
                {icon ? <img src={"../svg/labels/" + icon  + ".svg"} alt={t(value)} /> : <strong>{t(value)}</strong>}
            </button>
        </div>
    );
};

export default Label;
