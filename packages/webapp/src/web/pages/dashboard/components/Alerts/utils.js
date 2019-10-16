const comparatorLabels = {
    'equals': 'for igual a',
    'above': 'estiver acima de',
    'under': 'estiver abaixo de'
};

const fieldLabels = {
    'price': 'Preço',
    'volume': 'Volume'
};

const frequencyLabels = {
    'once': 'Uma vez ao dia',
    'twice': 'Duas vezes ao dia',
    'always': 'Sempre'
};

export const getComparatorLabel = (comparator) => comparatorLabels[comparator];
export const getFieldLabel = (field) => fieldLabels[field];
export const getFrequencyLabel = (frequency) => frequencyLabels[frequency];