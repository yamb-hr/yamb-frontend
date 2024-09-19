import React from 'react';
import { useTranslation } from 'react-i18next';
import './info.css';

function Info() {

    const { t } = useTranslation();

    return (
        <div className="info">
            <h2>{t('rules')}</h2>
            <p>{t('rules-content-1')}</p>
            <p>{t('rules-content-2')}</p>
            <p>{t('rules-content-3')}</p>
            <p>{t('rules-content-4')}</p>
        </div>
    );
};

export default Info;
