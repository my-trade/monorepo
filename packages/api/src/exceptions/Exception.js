class Exception {
	constructor(message) {
		this.message = message;
	}

	toJSON() {
		const {message} = this;

		return JSON.stringify(
			{
				message
			}
		);
	}
}

module.exports = Exception;