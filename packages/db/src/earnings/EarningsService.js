const UserService = require('../user/UserService');

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
		earnings.map(({date, symbol, ...data}) => {
			return collection.updateOne(
				{
                    date,
					userId: user._id,
					symbol
				},
				{
					$set: {
                        ...data,
                        date,
						symbol,
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