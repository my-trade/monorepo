const DBException = require('../exceptions/DBException');
const NoSuchUserException = require('../exceptions/NoSuchUserException');

const validateUser = (user) => {
	const { email } = user;

	if (!email) {
		throw new DBException('[email] is a required field.');
	}
}

const add = async (client, user) => {
	const db = client.db('mytrade');
	const collection = db.collection('user');
	const { email } = user;
	const exists = await collection.findOne({ email });

	if (exists) {
		throw new DBException(`User with email [${email}] already exists.`);
	}

	validateUser(user);

	return await collection.insertOne(user);
}

const get = async (client, filters) => {
	const db = client.db('mytrade');
	const collection = db.collection('user');
	const user = await collection.findOne({ ...filters });

	if (!user) {
		throw new NoSuchUserException(`There's no user matching ${JSON.stringify(filters)}`);
	}

	return user;
}

const list = async (client) => {
	const db = client.db('mytrade');
	const collection = db.collection('user');
	const cursor = await collection.find({});

	return await cursor.toArray();
}

const updateCEI = async (client, email, cei) => {
	const db = client.db('mytrade');
	const collection = db.collection('user');
	const user = await collection.findOne({ email });

	return await collection.updateOne({_id: user._id}, {
		$set: {cei}
	});
}

module.exports = {
	add,
	list,
	get,
	updateCEI
};