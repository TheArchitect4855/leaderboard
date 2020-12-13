var leaderboard = {};
var highscores = [];

function setScore(guid, username, score) {
	let gk = genKey(guid, username);
	let user = leaderboard[gk];
	if(user) {
		if(user.score < score) {
			leaderboard[gk].score = score;
		}
	} else {
		leaderboard[gk] = new User(guid, username, score);
	}

	genHighscores();
}

function getTop(n) {
	let hs = [];
	for(let i = 0; i < highscores.length; i++) {
		let user = leaderboard[highscores[i]];
		hs.push({
			username: user.username,
			score: user.score
		});
	}

	return hs;
}

function getRank(guid) {
	let rank = -1;
	for(let i = 0; i < highscores.length; i++) {
		if(leaderboard[highscores[i]].guid == guid) {
			rank = i;
			break;
		}
	}

	return rank;
}

function genKey(guid, username) {
	return `${guid}/${username}`;
}

function genHighscores() {
	let keys = Object.keys(leaderboard);
	keys.sort((a, b) => {
		return leaderboard[b].score - leaderboard[a].score;
	});

	highscores = keys;
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