module.exports = {
	apps: [{
		name: "Namecheap DDNS Updater",
		script: "src/index.js",
		env: {
			NODE_ENV: "production"
		}
	}]
}