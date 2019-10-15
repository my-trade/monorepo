const currency = require('currency.js');

const real = value => currency(
	value,
	{
		decimal: ',',
		separator: '.',
		symbol: 'R$'
	}
);

const fromReal = (str) => {
	const {value} = real(str);

	return value;
}

module.exports = { fromReal };