import React, { useContext, useState } from 'react';
import ClayButton from '@clayui/button/lib/Button';
import { ClayDropDownWithItems } from '@clayui/drop-down';
import DashboardContext from '../../DashboardContext';

export default ({onSelectSymbol = () => {}, symbol}) => {
    const [active, setActive] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(symbol);
    const [{ symbols }] = useContext(DashboardContext);
    const [searchValue, setSearchValue] = useState('');

    const onSearchValueChange = (value) => setSearchValue(value);

    const onClickAddTrade = (symbol) => {
        setActive(false);
        setSelectedSymbol(symbol);

        onSelectSymbol(symbol);
    };

    return (
        <ClayDropDownWithItems
            trigger={<ClayButton>{selectedSymbol || 'Selecione um Ativo'}</ClayButton>}
            active={active}
            onActiveChange={onClickAddTrade}
            onSearchValueChange={onSearchValueChange}
            searchable={true}
            searchValue={searchValue}
            items={symbols
                .filter(({ symbol }) => (new RegExp(`${searchValue}`, 'ig')).test(symbol))
                .filter((item, index) => index < 10)
                .map(({ symbol }) => ({
                    onClick: () => onClickAddTrade(symbol),
                    label: symbol.replace('.SA', '')
                }))}
        />
    );
}