const fs = require("fs");
const saveFile = "leaderboard.json";

var leaderboard = {};
var highscores = [];

if (fs.existsSync(saveFile)) {
	let dat = JSON.parse(fs.readFileSync(saveFile));
	leaderboard = dat.leaderboard;
	highscores = dat.highscores;
	console.log("Loaded leaderboard from file.");
}

function setScore(guid, username, score) {
	let gk = genKey(guid, username);
	let user = leaderboard[gk];
	if (user) {
		if (user.score < score) {
			leaderboard[gk].score = score;
		}
	} else {
		leaderboard[gk] = new User(guid, username, score);
	}

	genHighscores(new User(guid, username, score));

	fs.writeFile(saveFile, JSON.stringify({
		leaderboard: leaderboard,
		highscores: highscores
	}), (err) => {
		if (err) console.error(err);
		else console.log("Saved leaderboard to file!");
	});
}

function getTop(n, guid) {
	let hs = [];
	for (let i = 0; i < highscores.length && i < n; i++) {
		let user = highscores[i];
		hs.push({
			username: user.username,
			score: user.score,
			owned: user.guid == guid
		});
	}

	return hs;
}

function getRank(guid) {
	let rank = -1;
	let username = "";
	let score = 0;
	for (let i = 0; i < highscores.length; i++) {
		if (highscores[i].guid == guid) {
			rank = i;
			username = highscores[i].username;
			score = highscores[i].score;
			break;
		}
	}

	return {
		username: username,
		rank: rank,
		score: score
	};
}

function genKey(guid, username) {
	return `${guid}/${username}`;
}

function genHighscores(newUser) {
	let score = newUser.score;
	for (let i = 0; i < highscores.length; i++) {
		if (score > highscores[i].score) {
			highscores.splice(i, 0, newUser);
			return;
		}
	}

	highscores.push(newUser);
}

class User {
	constructor(guid, username, score) {
		this.guid = guid;
		this.username = username;
		this.score = score;
	}
}

module.exports.setScore = setScore;
module.exports.getTop = getTop;
module.exports.getRank = getRank;