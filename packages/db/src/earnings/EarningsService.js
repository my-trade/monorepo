const UserService = require('../user/UserService');
const { ObjectID } = require('mongodb');

const list = async (client, email, symbol) => {
	const db = client.db('mytrade');
	const collection = db.collection('earnings');

	const user = await UserService.get(client, {email});
	const cursor = await collection.find({ userId: user._id, symbol });

	return await cursor.toArray();
}

const saveAll = async (client, email, earnings) => {
	const db = client.db('mytrade');
	const collection = db.collection('earnings');
	const user = await UserService.get(client, {email});

	return await Promise.all(
		earnings.map(({date, symbol, value, ...data}) => {
			return collection.updateOne(
				{
                    date,
					userId: ObjectID(user._id),
					symbol,
					value
				},
				{
					$set: {
                        ...data,
                        date,
						symbol,
						value,
						lastUpdated: new Date()
					}
				}, {
					upsert: true
				}
			)
		})
	);
}

module.exports = {
	saveAll,
	list
};