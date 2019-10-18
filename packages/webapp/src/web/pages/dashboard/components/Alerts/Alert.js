import { getFieldLabel, getComparatorLabel } from './utils';
import ClayButton from '@clayui/button/lib/Button';
import ClayCard from '@clayui/card';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import MoneyBadge from '../MoneyBadge/MoneyBadge';
import React, { useState } from 'react';
import millify from 'millify';
import ClayBadge from '@clayui/badge';

export default ({alert, onEdit, onRemove}) => {
    const { comparator, field, symbol, value } = alert;

    const [removeLoading, setRemoveLoading] = useState(false);

    const onClickRemove = async () => {
        setRemoveLoading(true);
       
        await onRemove(alert._id);

        setRemoveLoading(false);
    };

    const onClickEdit = () => {
        onEdit(alert);
    }

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
                        {field === 'price' ? (
                            <MoneyBadge value={value} />
                        ) : (
                            <ClayBadge displayType="info" label={millify(value)} />
                        )}
                    </div>
                    <div className="col-md-2 text-right">
                        <ClayButton className="mr-2" displayType="secondary" onClick={onClickEdit}>
                            <ClayIcon symbol="pencil" />
                        </ClayButton>

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