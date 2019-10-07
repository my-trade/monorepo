const Exception = require('../../exceptions/Exception');

class AuthException extends Exception {
	constructor({ error, error_description }) {
		super(error_description);

		this.errorType = error;
	}

	toJSON() {
		return JSON.stringify({
			message: this.message,
			type: this.errorType
		});
	}
}

module.exports = AuthException;