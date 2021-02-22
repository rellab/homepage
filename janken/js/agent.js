// JavaScript: qlearning agent 

var KEN = {
	NONE : -1,
	GU : 0,
	CHOKI : 1,
	PA : 2,
};

var judgeJanken = function(ken1, ken2) {
	var result;
	switch (ken1) {
		case KEN.GU:
			switch (ken2) {
				case KEN.GU:
					result = 0; // 引き分け
					break;
				case KEN.CHOKI:
					result = 1; // ken1勝ち
					break;
				case KEN.PA:
					result = -1; // ken1負け
					break
			}
			break;
		case KEN.CHOKI:
			switch (ken2) {
				case KEN.GU:
					result = -1;
					break;
				case KEN.CHOKI:
					result = 0;
					break;
				case KEN.PA:
					result = 1;
					break
			}
			break;
		case KEN.PA:
			switch (ken2) {
				case KEN.GU:
					result = 1;
					break;
				case KEN.CHOKI:
					result = -1;
					break;
				case KEN.PA:
					result = 0;
					break
			}
			break;
	}
	return result;
}

var JankenField = function() {

	this.winAgent1 = 0;
	this.winAgent2 = 0;
	this.evenAgents = 0;

	this.prev = -1;
	this.statistics0 = [0, 0, 0];
	this.statistics = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	this.total = function() {
		return this.winAgent1 + this.winAgent2 + this.evenAgents;
	}

	this.fight = function(ken1, ken2) {
		// statistics
		this.statistics0[ken1]++;
		if (this.prev != -1) {
			this.statistics[this.prev][ken1]++;
		}
		this.prev = ken1;

		var result = judgeJanken(ken1, ken2);
		switch (result) {
			case 1:
				this.winAgent1++;
				break;
			case -1:
				this.winAgent2++;
				break;
			case 0:
				this.evenAgents++;
				break;
		}
		return result;
	}
}

var RandomAgent = function(mt) {

	this.mt = mt;

	this.next = function() {
//		return Math.floor( Math.random() * 3 );
		return this.mt.nextInt(0, 3);
	}

	this.feedback = function(result, ken_other) {}
}

var MimicAgent = function(mt) {
//	this.ken = Math.floor( Math.random() * 3 );
	this.mt = mt;
	this.ken = this.mt.nextInt(0, 3);

	this.next = function() {
		return this.ken;
	}

	this.feedback = function(result, ken_other) {
		this.ken = ken_other;
	}
}

var QLearningAgent = function(epsi, beta, alpha, mt) {
	this.epsi = epsi;
	this.beta = beta;
	this.alpha = alpha;
	this.mt = mt;

	this.ken = 0;
//	this.state = Math.floor( Math.random() * 9 );
	this.state = this.mt.nextInt(0, 9);

	this.Q = [
		[0.0, 0.0, 0.0], // 0 g-g
		[0.0, 0.0, 0.0], // 1 g-c
		[0.0, 0.0, 0.0], // 2 g-p
		[0.0, 0.0, 0.0], // 3 c-g
		[0.0, 0.0, 0.0], // 4 c-c
		[0.0, 0.0, 0.0], // 5 c-p
		[0.0, 0.0, 0.0], // 6 p-g
		[0.0, 0.0, 0.0], // 7 p-c
		[0.0, 0.0, 0.0]  // 8 p-p
	];
	for (var i=0; i<9; i++) {
		// this.Q[i][0] = Math.random() * 0.1;
		// this.Q[i][1] = Math.random() * 0.1;
		// this.Q[i][2] = Math.random() * 0.1;
		this.Q[i][0] = this.mt.next() * 0.1;
		this.Q[i][1] = this.mt.next() * 0.1;
		this.Q[i][2] = this.mt.next() * 0.1;
	}

	this.next_state = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8]
	];

	this.rewardp1 = [
		[-1, 1, 0],
		[0, -1, 1],
		[1, 0, -1]
	];

	this.rewardm1 = [
		[1, 0, -1],
		[-1, 1, 0],
		[0, -1, 1]
	];

	this.reward0 = [
		[0, -1, 1],
		[1, 0, -1],
		[-1, 1, 0]
	];

	this.next = function() {
//		if (Math.random() < epsi) {
		if (this.mt.next() < epsi) {
			// random
//			this.ken = Math.floor( Math.random() * 3 );
			this.ken = this.mt.nextInt(0, 3);
		} else {
			// greedy
			var tmp = this.Q[this.state][0];
			this.ken = 0;
			for (var i=0; i<3; i++) {
				if (this.Q[this.state][i] > tmp) {
					tmp = this.Q[this.state][i];
					this.ken = i;
				}
			}
			// var g = Math.exp(this.Q[this.state][0]);
			// var c = Math.exp(this.Q[this.state][1]);
			// var p = Math.exp(this.Q[this.state][2]);
			// var u = Math.random() * (g + c + p);
			// if (u < g) {
			// 	this.ken = 0;
			// } else if (u < g + c) {
			// 	this.ken = 1;
			// } else {
			// 	this.ken = 2;
			// }
		}
		return this.ken;
	}

	this.feedback = function(result, ken_other) {
		var reward_gu;
		var reward_choki;
		var reward_pa;
		switch (result) {
		case 1:
			reward_gu = this.rewardp1[this.ken][0];
			reward_choki = this.rewardp1[this.ken][1];
			reward_pa = this.rewardp1[this.ken][2];
			break;
		case -1:
			reward_gu = this.rewardm1[this.ken][0];
			reward_choki = this.rewardm1[this.ken][1];
			reward_pa = this.rewardm1[this.ken][2];
			break;
		case 0:
			reward_gu = this.reward0[this.ken][0];
			reward_choki = this.reward0[this.ken][1];
			reward_pa = this.reward0[this.ken][2];
			break;
		}

		var ns = this.next_state[this.state][ken_other];

		var tmp = this.Q[ns][0];
		for (var i=0; i<3; i++) {
			if (this.Q[ns][i] > tmp) {
				tmp = this.Q[ns][i];
			}
		}
		this.Q[this.state][KEN.GU] = (1 - this.beta) * this.Q[this.state][KEN.GU]
			+ this.beta * (reward_gu + this.alpha * tmp);
		this.Q[this.state][KEN.CHOKI] = (1 - this.beta) * this.Q[this.state][KEN.CHOKI]
			+ this.beta * (reward_choki + this.alpha * tmp);
		this.Q[this.state][KEN.PA] = (1 - this.beta) * this.Q[this.state][KEN.PA]
			+ this.beta * (reward_pa + this.alpha * tmp);

		this.state = ns;
	}
}

