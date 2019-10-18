import ClayLabel from '@clayui/label';
import Client from '@my-trade/client';
import DashboardContext from '../../DashboardContext';
import MoneyBadge from '../MoneyBadge/MoneyBadge';
import PercentBadge from '../PercentBadge/PercentBadge';
import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom'
import moment from 'moment';

const DAY = 1000 * 60 * 60 * 24;

export default withRouter(({match}) => {
    const {params: {symbol}} = match;
    const [state, dispatch] = useContext(DashboardContext);
    const {assets} = state;
    const stock = assets.find((stock) => stock.symbol === symbol);
    const {amount, price, transactions, earnings} = stock;

    earnings.sort(({date: a}, {date: b}) => moment(a).diff(b));
    transactions.sort(({date: a}, {date: b}) => moment(a).diff(b));

    const totalEarnings = earnings.reduce((total, { value }) => {
        return total + value;
    }, 0);

    const mappedEarnings = earnings.map((earning) => {
        const sharesToDate = transactions.reduce((summ, { count, date: transactionDate, type: transactionType }) => {
            // Considerar quantidade de ações que o investidor tinha até 7 dias
            // antes do recebimento do rendimento (- DAY * 7)
            if (moment(moment(earning.date) - DAY * 7).diff(transactionDate) >= 0) {
                if (transactionType === 'C') {
                    summ += count;
                }
                else {
                    summ -= count;
                }
            }
    
            return summ;
        }, 0);

        return {
            ...earning,
            sharesToDate
        }
    });

    const totalTransactions = transactions.reduce((summ, { count, type, value }) => {
        if (type === 'V') {
            summ += value * count;
        }
        else {
            summ -= value * count;
        }

        return summ;
    }, 0);

    return (
        <div className="mt-3">
            <h6>{symbol}</h6>

            <div className="row mb-4">
                <div className="col-md-12">
                    <ClayLabel displayType="secondary">Valor do Patrimônio</ClayLabel>
                    <MoneyBadge value={amount * price} />
                </div>
            </div>

            <div class="container">
                <h6>Trades</h6>

                <div className="row mb-4">
                    <div className="col-md-3">
                        <ClayLabel displayType="secondary">Data</ClayLabel>
                    </div>
                    <div className="col-md-2">
                        <ClayLabel displayType="secondary">Tipo</ClayLabel>
                    </div>
                    <div className="col-md-2">
                        <ClayLabel displayType="secondary">Quantidade</ClayLabel>
                    </div>
                    <div className="col-md-2">
                        <ClayLabel displayType="secondary">Preço</ClayLabel>
                    </div>
                    <div className="col-md-3 text-right">
                        <ClayLabel displayType="secondary">Total</ClayLabel>
                    </div>
                </div>

                {transactions.map(({count, date, type, value}) => (
                    <div className="row mb-4">
                        <div className="col-md-3">
                            {moment(date).format("DD/MM/YY")}
                        </div>
                        <div className="col-md-2">
                            {type === 'V' ? 'Venda' : 'Compra'}
                        </div>
                        <div className="col-md-2">
                            {count}
                        </div>
                        <div className="col-md-2">
                            <MoneyBadge value={type === 'C' ? -1 * value : value } />
                        </div>
                        <div className="col-md-3 text-right">
                            <MoneyBadge value={type === 'C' ? -1 * value * count : value * count } />
                        </div>
                    </div>
                ))}

                <div className="row mb-4">
                    <div className="col-md-3"></div>
                    <div className="col-md-2"></div>
                    <div className="col-md-2"></div>
                    <div className="col-md-2"></div>
                    <div className="col-md-3 text-right">
                        <MoneyBadge value={totalTransactions} />
                    </div>
                </div>
            </div>

            {earnings.length > 0 && (
                <div class="container">
                    <h6>Proventos</h6>

                    <div className="row mb-4">
                        <div className="col-md-3">
                            <ClayLabel displayType="secondary">Data</ClayLabel>
                        </div>
                        <div className="col-md-2 text-center">
                            <ClayLabel displayType="secondary">Tipo</ClayLabel>
                        </div>
                        <div className="col-md-3 text-center">
                            <ClayLabel displayType="secondary">Quantidade de Ações</ClayLabel>
                        </div>
                        <div className="col-md-2 text-center">
                            <ClayLabel displayType="secondary">Valor</ClayLabel>
                        </div>
                        <div className="col-md-2 text-right">
                            <ClayLabel displayType="secondary">EPS</ClayLabel>
                        </div>
                    </div>

                    {mappedEarnings.map(({date, sharesToDate, type, value}) => (
                        <div className="row mb-4">
                            <div className="col-md-3">
                                {moment(date).format("DD/MM/YY")}
                            </div>
                            <div className="col-md-2 text-center">
                                {type.toUpperCase()}
                            </div>
                            <div className="col-md-3 text-center">
                                {sharesToDate}
                            </div>
                            <div className="col-md-2 text-center">
                                <MoneyBadge value={value} />
                            </div>
                            <div className="col-md-2 text-right">
                                <MoneyBadge value={value / sharesToDate} />
                            </div>
                        </div>
                    ))}

                    <div className="row mb-4">
                        <div className="col-md-4"></div>
                        <div className="col-md-4 text-center"></div>
                        <div className="col-md-4 text-right">
                            <MoneyBadge value={totalEarnings} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});