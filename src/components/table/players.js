import React from 'react';
import { useTranslation } from 'react-i18next';
import Table from './table';

function Players() {

    const { t } = useTranslation();

    return (
        <div className="table-form">
            {t('players')}
            <br/>
            <br/>
            <Table></Table>
        </div>   
    );
}

export default Players;