import React from 'react';
import { useTranslation } from 'react-i18next';
import Table from './table';

function Scores() {

    const { t } = useTranslation();

    return (
        <div className="table-form">
            {t('scores')}
            <br/>
            <br/>
            <Table></Table>
        </div>   
    );
}

export default Scores;