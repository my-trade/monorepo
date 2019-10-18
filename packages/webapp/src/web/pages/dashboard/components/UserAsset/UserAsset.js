import ClayBadge from '@clayui/badge';
import ClayCard from '@clayui/card';
import ClayLabel from '@clayui/label';
import Client from '@my-trade/client';
import React, { useEffect, useContext } from 'react';
import DashboardContext, { UPDATE_ASSET_PRICE } from '../../DashboardContext';
import MoneyBadge from '../MoneyBadge/MoneyBadge';
import PercentBadge from '../PercentBadge/PercentBadge';
import { getToken } from '../../../../shared/auth/token';
import { Link, withRouter } from 'react-router-dom'

const client = new Client();

export default withRouter(({
    averageBuy,
    averageSell,
    amount,
    stockEarnings,
    profit,
    price,
    rentability,
    symbol,
    investedAmount,
    soldAmount
}) => {
    const [,dispatch] = useContext(DashboardContext);

    useEffect(() => {
        const interval = setInterval(async () => {
            const token = getToken();
            
            try {
                const price = await client.getSymbolValue(token, symbol);

                dispatch({type: UPDATE_ASSET_PRICE, payload: {symbol, price}});
            }
            catch (error) {
                console.error(error);
            }           
        }, 5000);

        return () => clearInterval(interval);     
    }, [symbol]);

    return (
        <ClayCard>
            <ClayCard.Body>
                <ClayCard.Description displayType="title">
                    <Link to={`/dashboard/minhas-acoes/${symbol}`}>{symbol}</Link>
                </ClayCard.Description>

                <div className="stock-value">
                    <MoneyBadge value={price} />
                </div>

                <div>
                    <div className="row">
                        <div className="col-md-8">
                            <ClayLabel displayType="secondary">Valor do Patrimônio</ClayLabel>
                        </div>
                        <div className="col-md-4 column-value">
                            <MoneyBadge value={price * amount} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <ClayLabel displayType="secondary">Valor Investido</ClayLabel>
                        </div>
                        <div className="col-md-4 column-value">
                            <MoneyBadge value={investedAmount} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <ClayLabel displayType="secondary">Preço Médio de Compra</ClayLabel>
                        </div>
                        <div className="col-md-4 column-value">
                            <MoneyBadge value={averageBuy} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <ClayLabel displayType="secondary">Preço Médio de Venda</ClayLabel>
                        </div>
                        <div className="col-md-4 column-value">
                            <MoneyBadge value={averageSell} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <ClayLabel displayType="secondary">Lucro de Vendas</ClayLabel>
                        </div>
                        <div className="col-md-4 column-value">
                            <MoneyBadge value={soldAmount > 0 ? soldAmount - investedAmount : 0} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <ClayLabel displayType="secondary">Proventos</ClayLabel>
                        </div>
                        <div className="col-md-4 column-value">
                            <MoneyBadge value={stockEarnings} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <ClayLabel displayType="secondary">Lucro</ClayLabel>
                        </div>
                        <div className="col-md-4 column-value">
                            <MoneyBadge value={profit} />
                        </div>
                    </div>
                </div>

                <div
                    className="stock-rentability"
                    data-tooltip-align="bottom"
                    title="Rentabilidade do patrimônio atual em relação ao dinheiro investido."
                >
                    <PercentBadge value={rentability}></PercentBadge>
                </div>

                <div className="stock-qtd">
                    <ClayBadge displayType="info" label={`${amount}`} />
                </div>
            </ClayCard.Body>
        </ClayCard>
    )
});