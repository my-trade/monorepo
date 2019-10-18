module.exports = {
	apps: [{
		name: "MyTrade API",
		script: "yarn",
		interpreter: '/bin/bash',
		args: "start",
		cwd: "./packages/api",
		env: {
			NODE_ENV: "production"
		}
	},
	{
		name: "MyTrade Jobs",
		script: "yarn",
		interpreter: '/bin/bash',
		args: "start",
		cwd: "./packages/jobs",
		env: {
			NODE_ENV: "production"
		}
	},
	{
		name: "MyTrade Web",
		script: "yarn",
		interpreter: '/bin/bash',
		args: "start",
		cwd: "./packages/webapp",
		env: {
			NODE_ENV: "production"
		}
	}]
}