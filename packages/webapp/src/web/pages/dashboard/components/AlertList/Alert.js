import { getFieldLabel, getComparatorLabel } from './utils';
import ClayButton from '@clayui/button/lib/Button';
import ClayCard from '@clayui/card';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import MoneyBadge from '../MoneyBadge/MoneyBadge';
import React, { useState } from 'react';

export default ({alert, onRemove}) => {
    const { comparator, field, symbol, value } = alert;

    const [removeLoading, setRemoveLoading] = useState(false);

    const onClickRemove = async () => {
        setRemoveLoading(true);
       
        await onRemove(alert._id);

        setRemoveLoading(false);
    };

    return (
        <ClayCard>
            <ClayCard.Body>
                <div className="row align-items-center">
                    <div className="col-md-2">
                        <strong>{symbol}</strong>
                    </div>
                    <div className="col-md-2 text-center">
                        {getFieldLabel(field)}
                    </div>
                    <div className="col-md-3 text-center">
                        {getComparatorLabel(comparator)}
                    </div>
                    <div className="col-md-3 text-center">
                        <MoneyBadge value={value} />
                    </div>
                    <div className="col-md-2 text-right">
                        <ClayButton displayType="secondary" onClick={onClickRemove}>
                            {removeLoading ? (
                                <ClayLoadingIndicator small />
                            ): (
                                <ClayIcon symbol="trash" />
                            )}
                        </ClayButton>
                    </div>
                </div>
            </ClayCard.Body>
        </ClayCard>
    );
}