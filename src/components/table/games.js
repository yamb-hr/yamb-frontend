import React from 'react';
import { useTranslation } from 'react-i18next';
import Table from './table';

function Games() {

    const { t } = useTranslation();

    return (
        <div className="table-form">
            {t('games')}
            <br/>
            <br/>
            <Table></Table>
        </div>   
    );
      
}

export default Games;