const comparatorLabels = {
    'equals': 'for igual a',
    'above': 'estiver acima de',
    'under': 'estiver abaixo de'
};

const fieldLabels = {
    'price': 'Preço',
    'volume': 'Volume'
};

export const getFieldLabel = (field) => fieldLabels[field];
export const getComparatorLabel = (comparator) => comparatorLabels[comparator];