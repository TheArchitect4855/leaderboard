const leaderboard = require("./leaderboard");

module.exports = class {
	constructor(apiKey, allowedOrigins) {
		this.apiKey = apiKey;
		this.allowedOrigins = allowedOrigins;
	}

	handle(req, res) {
		let method = req.method;

		if (this.allowedOrigins) {
			res.setHeader("Access-Control-Allow-Origin", this.allowedOrigins);
		}

		switch (method) {
			case "POST": post(req, res, this.apiKey); break;
			case "GET": get(req, res); break;
			case "OPTIONS":
				res.setHeader("Access-Control-ALlow-Headers", "Content-Type, User-Agent");
				res.writeHead(200);
				res.end();
				break;
			default:
				res.writeHead(405);
				res.end();
				break;
		}
	}
}

function post(req, res, apiKey) {
	let url = filterUrl(req.url);

	//To post a user score: /score/guid
	if (url.startsWith("score/")) {
		let guid = url.substring("score/".length);

		if (guid.trim() == "") {
			res.writeHead(400);
			res.end("A player ID must be supplied to set their score.");
			console.log("User posted score without GUID");
			return;
		}

		req.on("data", (data) => {
			try {
				let userInfo = JSON.parse(data);
				let key = userInfo.key;
				let username = userInfo.username;
				let score = userInfo.score;

				if (key.trim() == apiKey) {
					leaderboard.setScore(guid, username, score);
					res.writeHead(200);
					res.end(score.toString());
				} else {
					res.writeHead(401);
					res.end("Invalid API key.");
					console.log("User used invalid API key.");
				}
			} catch (e) {
				res.writeHead(400);
				res.end(`Malformed JSON in request: ${e}`);
				console.log(`Malformed JSON in request: ${e}`);
			}
		});
	} else {
		res.writeHead(400);
		res.end("Unknown method.");
		console.log("User used an unknown method.");
	}
}

function get(req, res) {
	let url = filterUrl(req.url);

	//To get top: /top/n?guid for top n players
	if (url.startsWith("top/")) {
		let info = url.substring("top/".length).split("?");
		let n = parseInt(info[0]);
		let guid = info[1];
		if (isNaN(n)) {
			res.writeHead(400);
			res.end("Top number must be a number.");
			console.log("Invalid top scores number.");
		} else {
			let top = leaderboard.getTop(n, guid);
			res.writeHead(200);
			res.end(JSON.stringify(top));
		}
	} else if (url.startsWith("rank/")) {
		//To get rank: /rank/guid for rank of player
		let guid = url.substring("rank/".length);
		if (guid == "") {
			res.writeHead(400);
			res.end("A user ID must be supplied to get their rank.");
			console.log("User did not supply GUID to get rank.");
		} else {
			let rank = leaderboard.getRank(guid);
			res.writeHead(200);
			res.end(JSON.stringify(rank));
		}
	} else {
		res.writeHead(400);
		res.end("Unknown method.");
	}
}

function filterUrl(url) {
	let filtered = url;
	if (filtered.startsWith("/")) {
		filtered = filtered.substring(1);
	}

	if (filtered.endsWith("/")) {
		filtered = filtered.substring(0, filtered.length - 1);
	}

	return filtered;
}