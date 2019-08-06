var redis = require("redis");
var client = redis.createClient({return_buffers: true});

function storeDailyVisit(date, userId) {
	var key = 'visits:daily:' + date;
	client.setbit(key, userId, 1, function(err, reply) {
		console.log("User", userId, "visited on", date);
	});
}

function countVisits(date) {
	var key = 'visits:daily:' + date;
	client.bitcount(key, function(err, reply) {
		console.log(date, "had", reply, "visits.");
	});
}

function showUserIdsFromVisit(date) {
	var key = 'visits:daily:' + date;
	client.get(key, function(err, bitmapValue) {
		var userIds = [];
		var data = bitmapValue.toJSON().data;

		data.forEach(function(byte, byteIndex) {
			for (var bitIndex = 7 ; bitIndex >= 0 ; bitIndex--) {
				var visited = byte >> bitIndex & 1;
				if (visited === 1) {
					var userId = byteIndex * 8 + (7 - bitIndex);
					userIds.push(userId);
				}
			}
		});
		console.log("Users " + userIds + " visited on " + date);		
	});
}

storeDailyVisit('2015-01-01', '1');
storeDailyVisit('2015-01-01', '2');
storeDailyVisit('2015-01-01', '10');
storeDailyVisit('2015-01-01', '55');


countVisits('2015-01-01');
showUserIdsFromVisit('2015-01-01');

client.quit();


