const fetch = require('cross-fetch');

const INTERVAL = 10000;

var argv = require('yargs')
	.usage('Usage: $0 --password --domain --hosts')
	.option('domain', {
		alias: 'd',
		describe: 'Your namecheap domain',
		default: process.env.NAMECHEAP_DOMAIN
	})
	.option('hosts', {
		alias: 'h',
		describe: 'Comma separated list of domains to update',
		default: process.env.NAMECHEAP_HOSTS
	})
	.option('password', {
		alias: 'p',
		describe: 'Your namecheap ddns password',
		default: process.env.NAMECHEAP_PASSWORD
	})
	.argv;

const getEndpoint = (host, domain, password, ip) => `https://dynamicdns.park-your-domain.com/update?host=${host}&domain=${domain}&password=${password}&ip=${ip}`;

const start = async () => {
	const hosts = [...argv.hosts.split(',')];

	try {
		const response = await fetch('https://ipinfo.io/ip');
		const ip = (await response.text()).trim();

		while (hosts.length) {
			const host = hosts.pop();
			const endpoint = getEndpoint(host, argv.domain, argv.password, ip);

			const updateResponse = await fetch(endpoint);
			const updateText = await updateResponse.text();

			if (updateText.indexOf('<ErrCount>0</ErrCount>') > -1) {
				console.log(`Updated host ${host} at ${argv.domain} with ${ip}`);
			}
			else {
				console.error(`Error updating host ${host} at ${argv.domain} with ${ip}`);
			}
		}
	}
	catch (error) {
		console.error(error);
	}

	setTimeout(async () => await start(), INTERVAL);
}

(async () => {
	await start()
})();