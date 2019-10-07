const { AlertsService, UserService } = require('@my-trade/db');
const { forEachWithRetries } = require('../utils/utils');
const { notify } = require('../utils/notifications');
const { getStockPrice, getStockVolume } = require('@my-trade/stocks');

const processAlert = async ({ comparator, field, symbol, value }, email, price, volume) => {
    switch (field) {
        case 'price': {
            switch (comparator) {
                case 'equal': {
                    if (price === value) {
                        notify(email, { comparator, field, trigger: price, symbol, value });
                    }

                    break;
                }
                case 'above': {
                    if (price > value) {
                        notify(email, { comparator, field, trigger: price, symbol, value });
                    }

                    break;
                }
                case 'under': {
                    if (price < value) {
                        notify(email, { comparator, field, trigger: price, symbol, value });
                    }

                    break;
                }
            };

            break;
        }
        case 'volume': {
            switch (comparator) {
                case 'equal': {
                    if (volume === value) {
                        notify(email, { comparator, field, trigger: volume, symbol, value });
                    }

                    break;
                }
                case 'above': {
                    if (volume > value) {
                        notify(email, { comparator, field, trigger: volume, symbol, value });
                    }

                    break;
                }
                case 'under': {
                    if (volume < value) {
                        notify(email, { comparator, field, trigger: volume, symbol, value });
                    }

                    break;
                }
            };

            break;
        }
    }
};

module.exports = async (client) => {
    const stocks = await AlertsService.groupByStock(client);

    await forEachWithRetries(stocks, async ({ _id: symbol }) => {
        const price = await getStockPrice(symbol.replace('.SA', ''));
        const volume = await getStockVolume(symbol.replace('.SA', ''));

        const alerts = await AlertsService.find(client, { symbol });

        alerts.forEach(async ({userId, ...alert}) => {
            const { email } = await UserService.get(client, { _id: userId });

            processAlert(alert, email, price, volume);
        });
    }, { interval: 30 * 1000 });
};