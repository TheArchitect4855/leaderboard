const Rest = require("./rest");
const fs = require("fs");
const https = require("https");
const http = require("http");

const config = loadConfig();
const rest = new Rest(config.apiKey, config.allowedOrigins);

if (config.isSecure) {
	createSecure();
} else {
	createInsecure();
}

function createSecure() {
	try {
		const key = fs.readFileSync(config.keyFile);
		const cert = fs.readFileSync(config.certFile);

		https.createServer({ key: key, cert: cert }, (req, res) => {
			rest.handle(req, res);
		}).listen(config.port);

		console.log(`Created HTTPS server at https://localhost:${config.port}`);
	} catch (e) {
		console.error(`Error creating secure server: ${e}`);
		process.exit(1);
	}
}

function createInsecure() {
	http.createServer((req, res) => {
		rest.handle(req, res);
	}).listen(config.port);

	console.log(`Created HTTP server at http://localhost:${config.port}`);
}

function loadConfig() {
	const configFile = "config.json";
	const defaultConfig = {
		isSecure: true,
		keyFile: "leaderboard.key",
		certFile: "leaderboard.cert",
		port: 3000,
		apiKey: "APIKEY",
		allowedOrigins: "*"
	};

	if (!fs.existsSync(configFile)) {
		fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, "\t"));
		console.log("A config file was not found and one was created.");
	}

	let cfg = fs.readFileSync(configFile);

	try {
		cfg = JSON.parse(cfg);
	} catch (e) {
		console.error(`Error parsing config: ${e}`);
		cfg = defaultConfig;
	}

	return cfg;
}