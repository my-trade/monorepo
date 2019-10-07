const UserService = require('../user/UserService');

const findBySymbol = async (client, email, symbol) => {
	const db = client.db('mytrade');
	const collection = db.collection('transactions');

	const user = await UserService.get(client, { email });
	const cursor = await collection.find({ userId: user._id, symbol });

	return await cursor.toArray();
}

const findByUser = async (client, email) => {
	const db = client.db('mytrade');
	const collection = db.collection('transactions');

	const user = await UserService.get(client, { email });
	const cursor = await collection.find({ userId: user._id });

	return await cursor.toArray();
}

const saveAll = async (client, email, transactions) => {
	const db = client.db('mytrade');
	const collection = db.collection('transactions');
	const user = await UserService.get(client, { email });

	return await Promise.all(
		transactions.map(({ count, date, symbol, value, ...data }) => {
			return collection.updateOne(
				{
					count,
					date,
					symbol,
					userId: user._id,
					value,
				},
				{
					$set: {
						...data,
						count,
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

const groupByStock = async (client, email) => {
	const db = client.db('mytrade');
	const collection = db.collection('transactions');
	const user = await UserService.get(client, { email });

	const cursor = await collection.aggregate([
		{ $match: { userId: user._id } },
		{
			$group: {
				_id: "$symbol"
			}
		}
	]);

	return await cursor.toArray();
}

module.exports = {
	saveAll,
	findBySymbol,
	findByUser,
	groupByStock
};