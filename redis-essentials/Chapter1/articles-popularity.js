var redis = require("redis");
var client = redis.createClient();

function upVote(id) {
	var key = "article:" + id + ":votes";
	client.incr(key);
}

function downVote(id) {
	var key = "article:" + id + ":votes";
	client.decr(key);
}

function showResults(id) {
	var headlineKey = "article:" + id + ":headline";
	var voteKey = "article:" + id + ":votes";
	client.mget([headlineKey, voteKey], function(err, replies) {
		console.log('The article "' + replies[0] + '" has', replies[1], 'votes');
	});
}

upVote(12345); // article:12345 has 1 vote
upVote(12345); // article:12345 has 2 votes
upVote(12345); // article:12345 has 3 votes
upVote(10001); // article:10001 has 1 vote
upVote(10001); // article:10001 has 2 votes
downVote(10001); // article:10001 has 1 vote
upVote(60056); // article:60056 has 1 vote

showResults(12345);
showResults(10001);
showResults(60056);

client.quit();
