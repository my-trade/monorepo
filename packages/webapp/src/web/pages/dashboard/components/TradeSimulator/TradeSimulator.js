import React, { useContext, useState } from 'react';
import ClayButton from '@clayui/button/lib/Button';
import { ClayInput } from '@clayui/form';
import ClayIcon from '@clayui/icon';
import { ClayDropDownWithItems } from '@clayui/drop-down';
import DashboardContext from '../../DashboardContext';

export default () => {
    const [active, setActive] = useState(false);
    const [{ symbols }, dispatch] = useContext(DashboardContext);
    const [searchValue, setSearchValue] = useState('');
    const [draftTrades, setDraftTrades] = useState([]);
    const onSearchValueChange = (value) => setSearchValue(value);
    const onClickAddTrade = (symbol) => {
        console.log(symbol);
        0
        setDraftTrades([...draftTrades, {
            symbol
        }])
    };

    return (
        <div>
            <h4>Trades</h4>

            <div>
                <ClayDropDownWithItems
                    trigger={<ClayButton>Adicionar Trade</ClayButton>}
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
            </div>

            <div class="container">
                {draftTrades.map(({ symbol }, index) => (
                    <div className="align-items-center row" key={`${symbol}${index}`}>
                        <div className="col-md-2">
                            <strong>{symbol}</strong>
                        </div>

                        <div className="col-md-2">
                            <label>Tipo de Operação</label>
                            <ClayInput value="" />
                        </div>

                        <div className="col-md-2">
                            <label>Quantidade</label>
                            <ClayInput value="" />
                        </div>

                        <div className="col-md-2">
                            <label>Preço</label>
                            <ClayInput value="" />
                        </div>

                        <div className="col-md-4">
                            <ClayButton>
                                <ClayIcon symbol="trash" />
                            </ClayButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}