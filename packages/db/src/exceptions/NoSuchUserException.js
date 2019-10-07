const DBException = require('./DBException');

class NoSuchUserException extends DBException {
}

module.exports = NoSuchUserException;