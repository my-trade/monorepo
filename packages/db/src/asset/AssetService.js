const NoSuchAssetException = require('../exceptions/NoSuchAssetException');
const UserService = require('../user/UserService');

const get = async (client, assetId) => {
	const db = client.db('mytrade');
	const collection = db.collection('assets');

	const asset = await collection.findOne({ assetId });

	if (!asset) {
		throw new NoSuchAssetException(`There's no asset matching [${JSON.stringify(filters)}]`);
	}

	return asset;
}

const list = async (client, email) => {
	const db = client.db('mytrade');
	const collection = db.collection('assets');

	const user = await UserService.get(client, {email});
	const cursor = await collection.find({ userId: user._id });

	return await cursor.toArray();
}

const saveFromTransactions = async (client, email, transactions) => {
	const db = client.db('mytrade');
	const collection = db.collection('assets');
	const user = await UserService.get(client, {email});

	const symbols = {};

	transactions.forEach(transaction => {
		const {symbol} = transaction;

		if (symbols[symbol]) {
			symbols[symbol].push(transaction);
		}
		else {
			symbols[symbol] = [transaction];
		}
	});

	const stocks = [];

	for (const symbol of Object.keys(symbols)) {
		let amount = 0;

		symbols[symbol].forEach(transaction => {
			if (transaction.type === 'C') {
				amount += transaction.count;
			}
			else if (transaction.type === 'V') {
				amount -= transaction.count;
			}
		});

		stocks.push({
			amount,
			symbol
		});
	}

	return await Promise.all(
		stocks.map(({symbol, ...data}) => {
			return collection.updateOne(
				{
					userId: user._id,
					symbol
				},
				{
					$set: {
						...data,
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
	get,
	list,
	saveFromTransactions,
};