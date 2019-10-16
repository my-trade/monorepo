const AlertsService = require('../alerts/AlertsService');
const { ObjectID } = require('mongodb');

const getToday = () => {
    const date = new Date();

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.getTime();
}

const add = async (client, alertId, notification) => {
    const db = client.db('mytrade');
    const collection = db.collection('notifications');
    const alert = await AlertsService.get(client, { _id: ObjectID(alertId) });

    return await collection.insertOne({
        ...notification,
        alertId: alert._id,
        timestamp: (new Date()).getTime()
    });
}

const countToday = async (client, alertId) => {
    const db = client.db('mytrade');
    const collection = db.collection('notifications');

    return await collection.countDocuments({
        alertId: ObjectID(alertId),
        timestamp: {
            $gte: getToday()
        }
    });
}

module.exports = {
    add,
    countToday
};