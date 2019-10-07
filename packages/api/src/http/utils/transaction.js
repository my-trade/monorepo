const { DBException } = require('@my-trade/db');
const AuthException = require('../exceptions/AuthException');
const Exception = require('../../exceptions/Exception');

const transaction = async (res, executor) => {
    try {
        await executor();
    }
    catch (error) {
        console.error(error);

        if (error instanceof AuthException) {
            res.status(401).send({
                error: {
                    message: 'Unauthorized'
                }
            });
        }
        else if (
            error instanceof DBException ||
            error instanceof Exception
        ) {
            res.status(500).send({
                error: {
                    message: error.message
                }
            });
        }
        else {
            res.status(500).send({
                error: {
                    message: error.message
                }
            });
        }
    }
}

module.exports = {
    transaction
}