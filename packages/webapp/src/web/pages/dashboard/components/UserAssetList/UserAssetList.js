import './UserAssetList.css';
import { getToken } from '../../../../shared/auth/token';
import ClayLabel from '@clayui/label';
import Client from '@my-trade/client';
import DashboardContext, { UPDATE_ASSETS } from '../../DashboardContext';
import MoneyBadge from '../MoneyBadge/MoneyBadge';
import PercentBadge from '../PercentBadge/PercentBadge';
import React, { useEffect, useContext } from 'react';
import UserAsset from '../UserAsset/UserAsset';

const client = new Client();

export default () => {
    const [state, dispatch] = useContext(DashboardContext);
    const {
        assets,
        totalMarketValue,
        totalInvested,
        totalEarnings,
        totalSold
    } = state;

    const fetchAssets = async () => {
        const token = getToken();
        const assets = await client.listUserAssets(token);

        if (!assets.error) {
            dispatch({type: UPDATE_ASSETS, payload: {assets}})
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const walletStocks = assets.filter(({ amount }) => amount > 0);
    const previousStocks = assets.filter(({ amount }) => amount === 0);

    return (
        <div className="asset-list mt-3">
            <div className="row mb-4">
                <div className="col-md-12">
                    <ClayLabel displayType="secondary">Valor do Patrimônio</ClayLabel>
                    <MoneyBadge value={totalMarketValue} />

                    <ClayLabel displayType="secondary">Valor Investido</ClayLabel>
                    <MoneyBadge value={totalInvested} />

                    <ClayLabel displayType="secondary">Valor Vendido</ClayLabel>
                    <MoneyBadge value={totalSold} />

                    <ClayLabel displayType="secondary">Proventos</ClayLabel>
                    <MoneyBadge value={totalEarnings} />

                    <ClayLabel displayType="secondary">Saldo Geral</ClayLabel>
                    <MoneyBadge value={totalMarketValue + totalEarnings + totalSold - totalInvested} />

                    <ClayLabel displayType="secondary">Rentabilidade</ClayLabel>
                    <PercentBadge value={((totalMarketValue + totalEarnings + totalSold) - totalInvested) / totalInvested} />
                </div>
            </div>

            <AssetList label="Carteira" assets={walletStocks} />

            <AssetList label="Liquidadas" assets={previousStocks} />
        </div>
    );
}

const AssetList = ({ label, assets }) => {
    return (
        <>
            <h3>{label}</h3>
            <div className="row">
                {assets.map((stock) => (
                    <div className="col-md-4" key={stock.symbol}>
                        <UserAsset {...stock} />
                    </div>
                ))}
            </div>
        </>
    );
};