const DBException = require('../exceptions/DBException');
const NoSuchAlertException = require('../exceptions/NoSuchAlertException');
const UserService = require('../user/UserService');
const { ObjectID } = require('mongodb');

const validateAlert = (alert) => {
    const { field, value } = alert;

    if (field !== 'price' && field !== 'volume') {
        throw new DBException('[AlertService] "field" has to be either "price" or "volume".');
    }

    if (field == 'price' && value <= 0) {
        throw new DBException('[AlertService] Price has to be a positive value.');
    }
}

const add = async (client, email, alert) => {
    const db = client.db('mytrade');
    const collection = db.collection('alerts');
    const user = await UserService.get(client, { email });

    validateAlert(alert);

    return await collection.insertOne({
        ...alert,
        userId: user._id
    });
}

const remove = async (client, alertId) => {
    const db = client.db('mytrade');
    const collection = db.collection('alerts');
    const _id = new ObjectID(alertId);

    if (!await collection.findOne({ _id })) {
        throw new NoSuchAlertException(`No alert with id ${alertId}.`);
    }

    return await collection.removeOne({ _id });
}

const list = async (client, email) => {
    const db = client.db('mytrade');
    const collection = db.collection('alerts');
    const user = await UserService.get(client, { email });
    const cursor = await collection.find({ userId: user._id });

    return await cursor.toArray();
}

const find = async (client, filters) => {
    const db = client.db('mytrade');
    const collection = db.collection('alerts');
    const cursor = await collection.find(filters);

    return await cursor.toArray();
}

const listAll = async (client) => {
    const db = client.db('mytrade');
    const collection = db.collection('alerts');
    const cursor = await collection.find({});

    return await cursor.toArray();
}

const groupByStock = async (client) => {
    const db = client.db('mytrade');
    const collection = db.collection('alerts');

    const cursor = await collection.aggregate([
        {
            $group: {
                _id: "$symbol"
            }
        }
    ]);

    return await cursor.toArray();
}

module.exports = {
    add,
    find,
    list,
    remove,
    listAll,
    groupByStock
};