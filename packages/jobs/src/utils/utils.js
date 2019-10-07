const RETRY_INTERVAL = 5 * 60 * 1000;
const MAX_RETRIES = 5;

const wait = async (interval) => await new Promise(resolve => setTimeout(() => resolve(), interval));

const forEachWithRetries = async (
    array,
    callback,
    config = {
        max: MAX_RETRIES,
        interval: RETRY_INTERVAL
    }
) => {
    let currentIndex = 0;
    let retries = 0;

    while (currentIndex < array.length) {
        const { email } = array[currentIndex];

        try {
            await callback(array[currentIndex]);

            currentIndex++;
            retries = 0;
        }
        catch (error) {
            console.error('[Job]', error);
            console.log('Retrying in ', config.interval);

            retries++;

            if (retries > config.max) {
                console.error(`[Job] Max retries exceeded limit (${config.max}). Moving on...`);

                currentIndex++;

                continue;
            }

            await wait(config.interval);
        }
    }
};

module.exports = {
    forEachWithRetries,
    wait
};

