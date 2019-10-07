import React from 'react';
import ClayBadge from '@clayui/badge';

export default ({prefix = '', value}) => {
    let displayType = 'success';
    let displayValue = (value * 100).toFixed(2);

    if (value < 0) {
        displayType = 'danger';
    }
    else {
        displayValue = `+${displayValue}`;
    }

    return (
        <ClayBadge displayType={displayType} label={`${prefix}${displayValue}%`} />
    );
};