var Agent = function(alpha, gamma, epsilon, env) {
	this.alpha = alpha;
	this.gamma = gamma;
	this.epsilon = epsilon;
	this.env = env;
	this.q = new Array();
	this.buffer = new Array();
	this.lastAction = 1;
	for (var i=0; i<this.env.getNState(); i++) {
		this.q[i] = new Array(this.env.getNAction());
		this.buffer[i] = new Array(this.env.getNAction());
	}
	this.init();
};

Agent.prototype.init = function() {
	for (var i = 0; i < this.q.length; i++) {
		for (var j = 0; j < this.q[i].length; j++) {
			this.q[i][j] = 0.0;
			this.buffer[i][j] = 0.0;
		}
	}
};

Agent.prototype.reset = function() {
	this.init();
};

Agent.prototype.buffer = function() {
	for(var i = 0; i < this.q.length; i++){
		for(var j = 0; j < this.q[i].length; j++){
			this.buffer[i][j] = this.q[i][j];
		}
	}
};

Agent.prototype.selectBufferedAction = function() {
	var s = this.env.getCurrentState();
	var a = 0;

	for (var i = 0; i < this.buffer[s].length; i++){
		if (this.buffer[s][i] > this.buffer[s][a]) {
			a = i;
		}
	}

	return this.env.getAction(a);
};

Agent.prototype.setLastAction = function(a) {
	for (var i = 0; i < this.env.getNAction(); i++){
		if (this.env.getAction(i) == a){
			this.lastAction = i;
			break;
		}
	}
};

Agent.prototype.selectAction = function() {
	return this.selectAction2();
};

Agent.prototype.selectAction1 = function() {
	var s = this.env.getCurrentState();
	var a = 0;
	var tmp = 0.0;

	for (var i = 0; i < this.q[s].length; i++){
		tmp += Math.exp(this.q[s][i]);
	}

	tmp = Math.random() * tmp;

	for (var i = 0; i < this.q[s].length; i++){
		tmp -= Math.exp(this.q[s][i]);
		if(tmp < 0){
			a = i;
			break;
		}
	}
	return this.env.getAction(a);
};

Agent.prototype.selectAction2 = function() {
	var s = this.env.getCurrentState();
	var a = 0;

	if (Math.random() < this.epsilon){
		this.lastAction = Math.floor(this.env.getNAction() * Math.random());
		return this.env.getAction(this.lastAction);
	}

	for(var i = 0; i < this.q[s].length; i++){
		if(this.q[s][i] > this.q[s][a]){
			a = i;
		}
	}

	//console.log(s, a, this.q[s][a]);
	return this.env.getAction(a);
};

Agent.prototype.update = function(s1, s2) {
//	console.log('update', s1, this.lastAction, this.getTDError(this.env.getReward(s2), s1, s2));
	this.q[s1][this.lastAction] += this.alpha * this.getTDError(this.env.getReward(s2), s1, s2);
};

Agent.prototype.getTDError = function(r, s1, s2) {
	var a1 = this.lastAction;
	var a2 = 0;

	for(var i = 1; i < this.q[s2].length; i++){
		if(this.q[s2][i] > this.q[s2][a2]){
			a2 = i;
		}
	}

	return r + this.gamma * this.q[s2][a2] - this.q[s1][a1];
};

