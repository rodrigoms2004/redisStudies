function Queue(queueName, redisClient) {
	this.queueName = queueName;
	this.redisClient = redisClient;
	this.queueKey = 'queues:' + queueName;
	// Zero means no timeout
	this.timeout = 0;
}

// size operation
Queue.prototype.size = function(callback) {
	this.redisClient.llen(this.queueKey, callback);
};

// push operation
Queue.prototype.push = function(data) {
	this.redisClient.lpush(this.queueKey, data);
};

// pop operation
Queue.prototype.pop = function(callback) {
	this.redisClient.brpop(this.queueKey, this.timeout, callback);
};

/*
As we mentioned earlier, elements are inserted at the front of the queue and
removed from the end of the queue, which is why BRPOP was used (if RPUSH
was used, then BLPOP would be necessary).
The command BRPOP removes the last element of a Redis List. If the List is empty,
it waits until there is something to remove. BRPOP is a blocking version of RPOP.
However, RPOP is not ideal. If the List is empty, we would need to implement some
kind of polling by ourselves to make sure that items are handled as soon as they are
added to the queue. It is better to take advantage of BRPOP and not worry about
empty lists.
*/


exports.Queue = Queue;

