// JS Env

var Environment = function(apparatus) {
	this.X_SCOPE0 = 1.0;
	this.X_SCOPE1 = 2.0;
	this.DX_SCOPE0 = 0.5;
	this.DX_SCOPE1 = 1.0;
	this.THETA_SCOPE0 = 0.02;
	this.THETA_SCOPE1 = 0.1;
	this.DTHETA_SCOPE0 = 0.8;
	this.DTHETA_SCOPE1 = 1.6;
	this.reward1 = 0.0;
	this.reward2 = -10.0;

	this.apparatus = apparatus;
};

Environment.prototype.getAction = function(i) {
	if (i == 0) {
		return ApparatusAction.LEFT; // left
	} else if (i == 1) {
		return ApparatusAction.RIGHT; // right
	} else {
		return ApparatusAction.NONE; // none
	}
};

/*Environment.prototype.getNState = function() {
	return 2*3*4*2+1;
};*/
Environment.prototype.getNState = function() {
	return 163;
};
Environment.prototype.getNAction = function() {
	return 2;
};

/*Environment.prototype.getCurrentState = function() {
	var s1 = 0;
	var s2 = 0;
	var s3 = 0;
	var s4 = 0;

	if (this.apparatus.isFailed()) {
		return 2*3*4*2;
	}

	if (this.apparatus.getX() < 0) {
		s1 = 0;
	} else {
		s1 = 1;
	}

//	if(this.apparatus.dx < -this.DX_SCOPE0) {
	if(this.apparatus.dx < this.DX_SCOPE0){
		s2 = 0;
	} else if(this.apparatus.dx < this.DX_SCOPE1){
		s2 = 1;
	} else {
		s2 = 2;
	}

	if(this.apparatus.theta < -this.THETA_SCOPE0){
		s3 = 0;
	} else if(this.apparatus.theta < 0.0){
		s3 = 1;
	} else if(this.apparatus.theta < this.THETA_SCOPE0){
		s3 = 2;
	} else {
		s3 = 3;
	}

	if(this.apparatus.dtheta < 0){
		s4 = 0;
	} else {
		s4 = 1;
	}

	return s1 + 2 * s2 + 2 * 3 * s3 + 2 * 3 * 4 * s4;
};*/

Environment.prototype.getCurrentState = function() {
	var s1 = 0;
	var s2 = 0;
	var s3 = 0;
	var s4 = 0;

	if (this.apparatus.isFailed()) {
		return 162;
	}

	if (this.apparatus.getX() < -0.8) {
		s1 = 0;
	} else if (this.apparatus.getX() < 0.8){
		s1 = 1;
	}else {
		s1 = 2;
	}

	if(this.apparatus.dx < -this.DX_SCOPE0) {
//	if(this.apparatus.dx < this.DX_SCOPE0){
		s2 = 0;
	} else if(this.apparatus.dx < this.DX_SCOPE0){
		s2 = 1;
	} else {
		s2 = 2;
	}

	if(this.apparatus.theta < -this.THETA_SCOPE0){
		s3 = 0;
	} else if(this.apparatus.theta < -this.THETA_SCOPE1){
		s3 = 1;
	} else if(this.apparatus.theta < 0.00){
		s3 = 2;
	} else if(this.apparatus.theta < this.THETA_SCOPE0){
		s3 = 3;
	} else if(this.apparatus.theta < this.THETA_SCOPE1){
		s3 = 4;
	} else {
		s3 = 5;
	}

	if(this.apparatus.dtheta < -this.DTHETA_SCOPE0){
		s4 = 0;
	} else if(this.apparatus.dtheta < this.DTHETA_SCOPE0){
		s4 = 1;
	} else {
		s4 = 2;
	}

	return s1 * 3 * 6 * 3 + s2 * 6 * 3 + s3 * 3 + s4;
};

/*Environment.prototype.getReward = function(state) {
	if (state == 2*3*4*2) {
		return this.reward2;
	} else {
		return this.reward1;
	}
};*/

Environment.prototype.getReward = function(state) {
	if (state == 162) {
		return this.reward2;
	} else {
		return this.reward1;
	}
};
