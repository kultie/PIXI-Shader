var Kultie = Kultie || {};
Kultie.Tween = Kultie.Tween || {};

const pow = Math.pow;
const sqrt = Math.sqrt;
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = ( 2 * PI ) / 3;
const c5 = ( 2 * PI ) / 4.5;

Kultie.Tween.LINEAR = function(x){
	return x;
};

Kultie.Tween.EASE_IN_SINE = function(x){
	return 1 - cos(x * PI / 2);
};
Kultie.Tween.EASE_OUT_SINE = function(x){
	return sin(x * PI / 2);
};
Kultie.Tween.EASE_IN_OUT_SINE = function(x){
	return -(cos(PI * x) - 1) / 2;
};

Kultie.Tween.EASE_IN_QUAD = function(x){
	return x * x;
};
Kultie.Tween.EASE_OUT_QUAD = function(x){
	return 1 - (1-x) * (1-x);
};
Kultie.Tween.EASE_IN_OUT_QUAD = function(x){
	return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) /2
};

Kultie.Tween.EASE_IN_CUBIC = function(x){
	return x * x * x;
};
Kultie.Tween.EASE_OUT_CUBIC = function(x){
	return 1 - pow(1-x,3);
};
Kultie.Tween.EASE_IN_OUT_CUBIC = function(x){
	return x < 0.5 ? 4 * x * x * x : 1 - pow( -2 * x + 2, 3 ) / 2;
};

Kultie.Tween.EASE_IN_QUART = function(x){
	return x * x * x *x;
};
Kultie.Tween.EASE_OUT_QUART = function(x){
	return 1 - pow(1-x,4);
};
Kultie.Tween.EASE_IN_OUT_QUART = function(x){
	return x < 0.5? 8 * pow(x,4): 1 - pow(-2 * x + 2, 4)/2;
};

Kultie.Tween.EASE_IN_QUINT = function(x){
	return pow(x,5);
};
Kultie.Tween.EASE_OUT_QUINT = function(x){
	return 1 - pow(1-x,5);
};
Kultie.Tween.EASE_IN_OUT_QUINT = function(x){
	return x < 0.5? 16 * pow(x,5): 1 - pow(-2 * x + 2, 5)/2;
};

Kultie.Tween.EASE_IN_EXPO = function(x){
	return x === 0 ? 0 : pow(2,10 * x - 10);
};
Kultie.Tween.EASE_OUT_EXPO = function(x){
	return x === 1 ? 1: 1 - pow(2, -10 * x);
};
Kultie.Tween.EASE_IN_OUT_EXPO = function(x){
	return x === 0 ? 0 : x === 1 ? 1: x < 0.5 ? pow(2 ,20 * x - 10)/2 : (2 - pow(2,-20 * x + 10)) /2
};

Kultie.Tween.EASE_IN_CIRC = function(x){
	return 1 - sqrt( 1- pow( x , 2));
};
Kultie.Tween.EASE_OUT_CIRC = function(x){
	return sqrt(1 - pow(x - 1, 2));
};
Kultie.Tween.EASE_IN_OUT_CIRC = function(x){
	return x < 0.5 ? (1 - sqrt(1 - pow(2 * x, 2))) /2 :(sqrt(1 - pow(-2 * x + 2, 2)) + 1) /2
};

Kultie.Tween.EASE_IN_BACK = function(x){
	return c3 * pow(x,3) - c1 * x * x;
};
Kultie.Tween.EASE_OUT_BACK = function(x){
	return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1,2);
};
Kultie.Tween.EASE_IN_OUT_BACK = function(x){
	return x < 0.5 ? (pow(2 * x , 2) * ((c2 + 1) * 2 * x - c2))/2 : (pow(2 *x -2 , 2) * ((c2 + 1) * (x *2 - 2) + c2) + 2) /2;
};

Kultie.Tween.EASE_IN_ELASTIC = function(x){
	return x === 0 ? 0 : x === 1 ? 1 : -pow(2 , 10 *x -10) * sin((x * 10 - 10.75) * c4); 
};
Kultie.Tween.EASE_OUT_ELASTIC = function(x){
	return x === 0 ? 0 : x === 1 ? 1 : pow (2 , -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
};
Kultie.Tween.EASE_IN_OUT_ELASTIC = function(x){
	return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5))/2 : pow(2,-20 * x + 10) * sin((20 * x - 11.125) * c5) /2 + 1;
};

Kultie.Tween.bounceOut = function(x){
	const n1 = 7.5625;
	const d1 = 2.75;

	if ( x < 1 / d1 ) {
		return n1 * x * x;
	} else if ( x < 2 / d1 ) {
		return n1 * (x -= (1.5 / d1)) * x + .75;
	} else if ( x < 2.5 / d1 ) {
		return n1 * (x -= (2.25 / d1)) * x + .9375;
	} else {
		return n1 * (x -= (2.625 / d1)) * x + .984375;
	}
}

Kultie.Tween.EASE_IN_BOUNCE = function(x){
	return 1 - Kultie.Tween.bounceOut(1-x);
};
Kultie.Tween.EASE_OUT_BOUNCE = Kultie.Tween.bounceOut;
Kultie.Tween.EASE_IN_OUT_BOUNCE = function(x){
	return x < 0.5 ?( 1 - Kultie.Tween.bounceOut( 1 - 2 * x ) ) / 2 :( 1 + Kultie.Tween.bounceOut( 2 * x - 1 ) ) / 2;
};

Kultie.Tween.Create = function(start, finish, duration, tweenFunction,onStart, onUpdate, onFinish){
	if(!this._waitingTweeners){
		this._waitingTweeners = [];
	}
	let tweener;
	if(this._waitingTweeners.length > 0){
		tweener = this._waitingTweeners.shift();
		tweener.initMembers();
	}
	else{
		tweener = new Kultie.Tweener();
	}
	tweener.setData(start,finish,duration,tweenFunction, onStart, onUpdate , onFinish);
	return tweener;
}

///Twener Object
Kultie.Tweener = function(){
	this.initialize.apply(this);
}

Kultie.Tweener.prototype.initialize = function(){
	this.initMembers();
}

Kultie.Tweener.prototype.initMembers = function(){
	this._func = Kultie.Tween.LINEAR;
	this._distance = 0;
	this._start = 0;
	this._current = 0;
	this._duration = 0;
	this._timePassed = 0;
}

Kultie.Tweener.prototype.setData = function(start, finish, duration, tweenFunction,onStart, onUpdate, onFinish){
	this._func = tweenFunction || Kultie.Tween.LINEAR;
	this._start = start;
	this._distance = finish - start;
	this._current = start;
	this._duration = duration;
	this._onUpdate = onUpdate;
	this._onStart = onStart;
	this._onFinish = onFinish;
	this._isFinished = false;
}

Kultie.Tweener.prototype.update = function(dt){
	if(this._timePassed == 0 && this._onStart){
		this._onStart();
	}
	this._timePassed = this._timePassed + (dt || PIXI.Ticker.shared.elapsedMS / 1000);
	let fractionOfTime = this._timePassed / this._duration;
	this._current = this._start + this._func(fractionOfTime) * this._distance;
	if(this._timePassed > this._duration){
		this._current = this._start + this._distance;
		if(!this._isFinished){
			Kultie.Tween._waitingTweeners.push(this);
		}
		this._isFinished = true;
		if(this._onFinish){
			this._onFinish();
		}
	}
	if(this._onUpdate){
		this._onUpdate(this._current);
	}
}

Kultie.Tweener.prototype.setStartMethod = function(onStart){
	this._onStart = onStart;
}

Kultie.Tweener.prototype.setUpdateMethod = function(onUpdate){
	this._onUpdate = onUpdate;
}

Kultie.Tweener.prototype.setFinishMethod = function(onFinish){
	this._onFinish = onFinish;
}

Kultie.Tweener.prototype.getValue = function(){
	return this._current;
}