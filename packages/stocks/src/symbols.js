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

    return symbols.find(({symbol}) => {
        return `${symbolSymbol}.SA` === symbol;
    })
}

const getStockPrice = async (symbol) => {
    const alphaResponse = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.SAO&apikey=RVKDVR8QCCBW1MWX`);
    const alphaResult = await alphaResponse.json();
    
    if (alphaResult['Global Quote']) {
        return new Number(alphaResult['Global Quote']['05. price']);
    }

    const asset = await getUOLAssetBySymbol(symbol);

    if (!asset) {
        return 0;
    }

    const uolResponse = await fetch(`http://cotacoes.economia.uol.com.br/ws/asset/${asset.id}/intraday?fields=date,price`);
    const uolResult = await uolResponse.json();

    if (uolResult.data && uolResult.data.length > 0) {
        return uolResult.data[0].price;
    }
  
    return 0;
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
    getStockPrice,
    getStockVolume,
    getUOLAssetBySymbol
}