const fetch = require('cross-fetch');

const symbolsCache = {};

const getAllSymbols = async () => {
    if (!symbolsCache.all) {
        const response = await fetch('http://cotacoes.economia.uol.com.br/ws/asset/stock/list?size=100000');

        const result = await response.json();

        symbolsCache.all = result.data;
    }

    return symbolsCache.all.map(({ idt, code, name }) => {
        return { id: idt, symbol: code, name };
    });
};

const getUOLAssetBySymbol = async (symbolSymbol) => {
    const symbols = await getAllSymbols();

    return symbols.find(({ symbol }) => {
        return `${symbolSymbol}.SA` === symbol;
    })
}

const getStockPrice = async (symbol) => {
    const { price } = await getStockPriceAndChange(symbol);

    return price;
}

const getStockInterday = async (symbol, limit = 5) => {
    const asset = await getUOLAssetBySymbol(symbol);

    if (!asset) {
        return [];
    }

    const uolResponse = await fetch(`http://cotacoes.economia.uol.com.br/ws/asset/${asset.id}/interday?fields=varpct,price,date`);
    const uolResult = await uolResponse.json();
    const { data } = uolResult;

    data.sort((a, b) => b.date - a.date);

    return data
        .filter((entry, index) => index < limit)
        .map(({ varpct, ...entry }) => ({
            ...entry,
            change: varpct
        }));
}

const getStockPriceAndChange = async (symbol) => {
    const asset = await getUOLAssetBySymbol(symbol);

    if (!asset) {
        return { change: 0, price: 0 };
    }

    const uolResponse = await fetch(`http://cotacoes.economia.uol.com.br/ws/asset/${asset.id}/intraday?fields=varpct,price`);
    const uolResult = await uolResponse.json();

    if (uolResult.data && uolResult.data.length > 0) {
        return {
            change: uolResult.data[0].varpct,
            price: uolResult.data[0].price
        };
    }

    return { change: 0, price: 0 };
}

const getStockVolume = async (symbol) => {
    const asset = await getUOLAssetBySymbol(symbol);

    if (!asset) {
        return 0;
    }

    const response = await fetch(`http://cotacoes.economia.uol.com.br/ws/asset/${asset.id}/intraday?fields=date,vol`);
    const result = await response.json();

    if (result.data && result.data.length > 0) {
        return result.data[0].vol;
    }

    return 0;
}

module.exports = {
    getAllSymbols,
    getStockInterday,
    getStockPrice,
    getStockPriceAndChange,
    getStockVolume,
    getUOLAssetBySymbol
}