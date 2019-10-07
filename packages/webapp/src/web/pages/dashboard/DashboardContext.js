import { createContext } from 'react';
import { getUserAssets, saveUserAssets } from '../../shared/local/assets';

export const UPDATE_ALERTS = 'UPDATE_ALERTS';
export const UPDATE_ASSETS = 'UPDATE_ASSETS';
export const UPDATE_ASSET_PRICE = 'UPDATE_ASSET_PRICE';
export const UPDATE_SYMBOLS = 'UPDATE_SYMBOLS';

export const DashboardContext = createContext();

export const initialState = {
    alerts: [],
    assets: getUserAssets(),
    symbols: []
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ASSETS: {
            const { assets } = action.payload;

            saveUserAssets(assets);

            let totalMarketValue = 0;
            let totalInvested = 0;
            let totalEarnings = 0;
            let totalSold = 0;

            const calculatedAssets = assets.map(stock => {
                const earnings = stock.earnings.reduce((total, { value }) => {
                    return total + value;
                }, 0);
                let investedAmount = 0;
                let soldAmount = 0;
                let buyCount = 0;
                let sellCount = 0;

                const total = stock.transactions.reduce((summ, { count, type, value }) => {
                    if (type === 'C') {
                        summ += value * count;
                        investedAmount += value * count;
                        buyCount += count;
                    }
                    else {
                        summ -= value * count;
                        soldAmount += value * count;
                        sellCount += count;
                    }

                    return summ;
                }, 0);
                const profit = (stock.price * stock.amount + earnings + soldAmount) - investedAmount;

                totalInvested += investedAmount;
                totalMarketValue += stock.amount * stock.price;
                totalEarnings += earnings;
                totalSold += soldAmount;

                return {
                    ...stock,
                    averageBuy: investedAmount / buyCount,
                    averageSell: sellCount > 0 ? soldAmount / sellCount : 0,
                    earnings,
                    profit,
                    total,
                    investedAmount,
                    soldAmount,
                    rentability: profit / investedAmount
                }
            });

            return {
                ...state,
                assets: calculatedAssets,
                totalMarketValue,
                totalInvested,
                totalEarnings,
                totalSold
            }
        }
        case UPDATE_ASSET_PRICE: {
            const { symbol, price } = action.payload;

            return {
                ...state,
                assets: state.assets.map(asset => {
                    if (asset.symbol === symbol) {
                        return {
                            ...asset,
                            price
                        }
                    }

                    return asset;
                })
            }
        }
        case UPDATE_ALERTS: {
            const { alerts } = action.payload;

            return {
                ...state,
                alerts
            }
        }
        case UPDATE_SYMBOLS: {
            const { symbols } = action.payload;

            return {
                ...state,
                symbols
            }
        }
        default: {
            return state;
        }
    }
};

export default DashboardContext;