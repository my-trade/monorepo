import ClayCard from '@clayui/card';
import React, { useState, useEffect } from 'react';
import ClayButton from '@clayui/button';
import currency from 'currency.js';
import { getToken } from '../../../shared/auth/token';
import Client from '@my-trade/client';

export default () => {
    const [assets, setAssets] = useState([]);

    const fetchAssets = async () => {
        const client = new Client();
        const token = getToken();

        setAssets(await client.listAssets(token));
    }

    useEffect(() => {
        fetchAssets();
    }, []);

    return (
        <div className="row">
            {assets.map(({ price, symbol }) => (
                <div className="col-md-3" key={symbol}>
                    <ClayCard>
                        <ClayCard.Body>
                            <ClayCard.Description displayType="title">
                                {symbol}
                            </ClayCard.Description>
                            <ClayCard.Description truncate={false} displayType="text">
                                {currency(price, { formatWithSymbol: true, symbol: 'R$' }).format()}
                            </ClayCard.Description>
                            <ClayButton>{"Simular Operação"}</ClayButton>
                        </ClayCard.Body>
                    </ClayCard>
                </div>
            ))}
        </div>
    );
}; 