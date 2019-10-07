const MongoClient = require('mongodb').MongoClient;

const {MONGO_DB, MONGO_PASSWORD} = process.env;

const uri = `mongodb+srv://${MONGO_DB}:${MONGO_PASSWORD}@pebblecluster-r5ust.gcp.mongodb.net/mytrade?retryWrites=true`;
const client = new MongoClient(
	uri,
	{
		// retry to connect for 60 times
		reconnectTries: 60,
		// wait 1 second before retrying
		reconnectInterval: 10000,
		useNewUrlParser: true
	}
);

module.exports = () => {
	return new Promise(
		(resolve, reject) => {
			client.connect(
				error => {
					if (error) {
						reject(error);
					}
					else {
						resolve(client);
					}
				}
			);
		}
	)
};