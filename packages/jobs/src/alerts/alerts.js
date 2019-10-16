const { AlertsService, NotificationsService, UserService } = require('@my-trade/db');
const { forEachWithRetries } = require('../utils/utils');
const { notify } = require('../utils/notifications');
const { getStockPrice, getStockVolume } = require('@my-trade/stocks');

const isMarketOpen = () => {
    const date = new Date();
    const hours = date.getHours();

    return hours >= 10 && hours <= 18;
}

const processAlert = async (alert, email, price, volume) => {
    const { comparator, field, value } = alert;

    switch (field) {
        case 'price': {
            switch (comparator) {
                case 'equal': {
                    if (price === value) {
                        notify(email, { ...alert, trigger: price });

                        return true;
                    }

                    break;
                }
                case 'above': {
                    if (price > value) {
                        notify(email, { ...alert, trigger: price });

                        return true;
                    }

                    break;
                }
                case 'under': {
                    if (price < value) {
                        notify(email, { ...alert, trigger: price });

                        return true;
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
                        notify(email, { ...alert, trigger: volume });

                        return true;
                    }

                    break;
                }
                case 'above': {
                    if (volume > value) {
                        notify(email, { ...alert, trigger: volume });

                        return true;
                    }

                    break;
                }
                case 'under': {
                    if (volume < value) {
                        notify(email, { ...alert, trigger: volume });

                        return true;
                    }

                    break;
                }
            };

            break;
        }
    }

    return false;
};

module.exports = async (client) => {
    if (!isMarketOpen()) {
        return;
    }

    const stocks = await AlertsService.groupByStock(client);

    await forEachWithRetries(stocks, async ({ _id: symbol }) => {
        const alerts = await AlertsService.find(client, { symbol });
        const price = await getStockPrice(symbol.replace('.SA', ''));
        const volume = await getStockVolume(symbol.replace('.SA', ''));

        alerts.forEach(async ({ userId, frequency = 'once', ...alert }) => {
            const todaysCount = await NotificationsService.countToday(client, alert._id);

            if (frequency === 'once' && todaysCount > 0) {
                return;
            } else if (frequency === 'twice' && todaysCount > 1) {
                return;
            }

            const { email } = await UserService.get(client, { _id: userId });
            const sent = await processAlert(alert, email, price, volume);

            if (sent) {
                await NotificationsService.add(client, alert._id, {
                    comparator: alert.comparator,
                    email,
                    price,
                    volume
                });
            }
        });
    }, { interval: 30 * 1000 });
};