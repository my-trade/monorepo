import React from 'react';
import ClayBadge from '@clayui/badge';
import currency from 'currency.js';

export default ({prefix = '', value}) => {
    let displayType = 'success';
    let displayValue = currency(value, { formatWithSymbol: true, symbol: 'R$' }).format();

    if (value < 0) {
        displayType = 'danger';
    }

    return (
        <ClayBadge displayType={displayType} label={`${prefix}${displayValue}`} />
    );
};