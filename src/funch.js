(function(module, global) {
	"use strict";
	/*
	Funch.js, v0.10a

	MIT License

	Copyright (c) 2017 Trung Tran

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

	Some portion of this code is under MIT, BSD-3 and Apache-2.0 license:
	<https://opensource.org/licenses/MIT>
	<https://opensource.org/licenses/BSD-3-Clause>
	<https://opensource.org/licenses/Apache-2.0>
	
	For a copy, see:
	- numbers.js  (Steve Kaliski, Apache-2.0)      <github.com/numbers/numbers.js/>
	- mathplus.js (Peter Robinett, MIT)            <github.com/pr1001/MathPlus/>
	- xorshift.js (Andreas Madsen & Emil Bay, MIT) <github.com/AndreasMadsen/xorshift/>
	- Geometry.js (Tan Sia How, MIT)               <github.com/tsh96/Geometry>
	- polyk.js    (Ivan Kuckir, MIT)               <polyk.ivank.net/>
	- kiwi.js     (Gamelab, MIT)                   <github.com/gamelab/kiwi.js/>
	- phaser.js   (Photon Storm Ltd, MIT)          <github.com/photonstorm/phaser/>
	- jmat.js     (Lode Vandevenne, BSD-3)         <github.com/lvandeve/jmat/>
	- game-math   (Nick Pruehs, MIT)               <github.com/npruehs/game-math>
	- angles.js   (Robert Eisele, MIT)             <github.com/infusion/Angles.js>
	*/

	//Namespace
	let Math = global.Math, Boolean = global.Boolean, Number = global.Number,

	_gamma_1_ = [
		0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
		-176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
		1.5056327351493116e-7
	],
	_lnGamma_1_ = [
		76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155,
		0.1208650973866179e-2, -0.5395239384953e-5
	],
	_erfcx_1_ = [
		0.9999999999999999, 2.224574423459406, 2.444115549920689, 1.7057986861852539,
		0.8257463703357973, 0.28647031042892007, 0.07124513844341643, 0.012296749268608364,
		0.001347817214557592, 7263959403471071e-20, 1, 3.352953590554884,
		5.227518529742423, 5.003720878235473, 3.266590890998987, 1.5255421920765353,
		0.5185887413188858, 0.12747319185915415, 0.02185979575963238, 0.0023889438122503674,
		0.00012875032817508128, 0.5641895835477563
	],
	_invNorm_1_ = [
		-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269,
		-30.6647980661472, 2.50662827745924, -54.4760987982241, 161.585836858041,
		-155.698979859887, 66.8013118877197, -13.2806815528857, -0.00778489400243029,
		-0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497,
		2.93816398269878, 0.00778469570904146, 0.32246712907004, 2.445134137143,
		3.75440866190742, 0.02425
	],
	_outBounce_1_ = [
		1 / 2.75, 2 / 2.75, 1.5 / 2.75,
		2.5 / 2.75, 2.25 / 2.75, 2.625 / 2.75,
	],
	_noise_1_ = [
		[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
		[1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
		[0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
	],
	_helper7_1_ = Math.pow(2, 32),
	_noise_4_ = 0.5 * (Math.sqrt(3) - 1),
	_noise_5_ = (3 - Math.sqrt(3)) / 6,
	_noise_6_ = 1 / 6,
	_helper9_1_ = 1 / 3,
	_helper10_1_ = 80 * Math.sqrt(10),
	_toRad_1_ = Math.PI / 180,
	_toDeg_1_ = 180 / Math.PI,
	_diffAngle_1_ = Math.PI * 3,
	_triEquil_1_ = Math.sqrt(3) / 2,
	oldRound = Math.round,
	oldFloor = Math.floor,
	oldCeil = Math.ceil,
	oldTrunc = Math.trunc,
	oldPow = Math.pow,
	oldRandom = Math.random,
	_memory_1_ = [],
	_memory_2_ = [],
	_memory_3_ = [],
	_memory2_1_ = {},
	_poly_stack_ = [],
	_bounce_stack_ = [];

	for (var i = 0; i < 6; i++) {
		_poly_stack_.push({
			x: 0,
			y: 0,
			flag: false
		});
	}

	function _helper0(current, type) {
		let temp = typeof current === typeof type;
		if (!temp) {
			switch (type) {
				case "_a_":
				if (current == null || current.constructor !== Array) {
					current = Array();
				}
				break;
				case "_o_":
				if (current == null || current.constructor !== Object) {
					current = Object();
				}
				break;
				default:
				current = type;
			}
		}
		return current;
	}

	function _helper1() {
		_memory_1_.length = 0;
		_memory_2_.length = 0;
		_memory_3_.length = 0;
	}

	function _helper2() {
		for (let key in _memory2_1_) {
			if (_memory2_1_.hasOwnProperty(key)) {
				delete _memory2_1_[key];
			}
		}
	}

	function _helper3(type, num) {
		switch (type) {
			case 0:
				{
					return oldRound(num);
				}
				break;
			case 1:
				{
					return oldFloor(num);
				}
				break;
			case 2:
				{
					return oldCeil(num);
				}
				break;
			case 3:
				{
					return oldTrunc(num);
				}
				break;
			case 4:
				{
					return num > 0 ? oldCeil(num) : oldFloor(num);
				}
				break;
		}
	}

	function _helper4(num1, num2) {
		return ((((num1 & 0xffff) * num2) + ((((num1 >>> 16) * num2) & 0xffff) << 16))) & 0xffffffff;
	}

	//Factorial
	function _helper5(num) {
		if (num !== oldFloor(num) || num < 0 || num > 170) {
			return NaN;
		} else if (0 === num || 1 === num) {
			return 1;
		}
		let t = 1;
		for (let r = 2; r <= num; r++) {
			t *= r;
		}
		return t;
	}

	//GCD
	function _helper6(num1, num2) {
		let signX = (num1 < 0) ? -1 : 1,
			signY = (num2 < 0) ? -1 : 1,
			x = 0,
			y = 1,
			oldX = 1,
			oldY = 0,
			q, r, m, n;
			num1 = Math.abs(num1);
			num2 = Math.abs(num2);

		while (num1 !== 0) {
			q = oldFloor(num2 / num1);
			r = num2 % num1;
			m = x - oldX * q;
			n = y - oldY * q;
			num2 = num1;
			num1 = r;
			x = oldX;
			y = oldY;
			oldX = m;
			oldY = n;
		}
		_memory_1_[0] = num2;
		_memory_1_[1] = signX * x;
		_memory_1_[2] = signY * y;
	}

	//Xorshift
	let _helper7 = (function() {
		let s1U, s1L, s0U, s0L, sumL, tU, tL;
		function _helper_helper7_1(a, sU, sL) {
			tU = tU ^ (sU >>> a);
			tL = tL ^ ((sL >>> a) | ((sU & (0xFFFFFFFF >>> (32 - a))) << (32 - a)));
		}
		return function() {
			s1U = _memory_1_[0];
			s1L = _memory_1_[1];
			s0U = _memory_1_[2];
			s0L = _memory_1_[3];
			sumL = (s0L >>> 0) + (s1L >>> 0);

			_memory_1_[5] = (s0U + s1U + (sumL / 2 >>> 31)) >>> 0;
			_memory_1_[6] = sumL >>> 0;

			_memory_1_[0] = s0U;
			_memory_1_[1] = s0L;

			tU = (s1U << 23) | ((s1L & (0xFFFFFFFF << 9)) >>> 9);
			tL = s1L << 23;
			s1U = s1U ^ tU;
			s1L = s1L ^ tL;
			tU = s1U ^ s0U;
			tL = s1L ^ s0L;

			_helper_helper7_1(18, s1U, s1L);
			_helper_helper7_1(5, s0U, s0L);

			_memory_1_[2] = tU;
			_memory_1_[3] = tL;
		};
	})();

	//Murmurhash3
	function _helper8() {
		let h1 = arguments[2],
			numargs = arguments.length - 1,
			h1b, k1, i;
		for (i = 0; i < numargs; i++) {
			k1 = arguments[i] | 0;
			k1 = _helper4(k1, 0xcc9e2d51);
			k1 = (k1 << 15) | (k1 >>> 17);
			k1 = _helper4(k1, 0x1b873593);
			h1 ^= k1;
			h1 = (h1 << 13) | (h1 >>> 19);
			h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
			h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
		}
		h1 ^= numargs;
		h1 ^= h1 >>> 16;
		h1 = _helper4(h1, 0x85ebca6b);
		h1 ^= h1 >>> 13;
		h1 = _helper4(h1, 0xc2b2ae35);
		h1 ^= h1 >>> 16;
		return (h1 >>> 0) / _helper7_1_;
	}

	function _helper9(num) {
		if (Number.isNaN(num) || !Number.isFinite(num)) return NaN;
		if (num === 0) return 0;
		if (num % 1 || num * num < 2) return 1;
		if (num % 2 === 0) return 2;
		if (num % 3 === 0) return 3;
		if (num % 5 === 0) return 5;
		let m = Math.sqrt(num);
		for (let i = 7; i <= m; i += 30) {
			if (num % i === 0) return i;
			if (num % (i + 4) === 0) return i + 4;
			if (num % (i + 6) === 0) return i + 6;
			if (num % (i + 10) === 0) return i + 10;
			if (num % (i + 12) === 0) return i + 12;
			if (num % (i + 16) === 0) return i + 16;
			if (num % (i + 22) === 0) return i + 22;
			if (num % (i + 24) === 0) return i + 24;
		}
		return num;
	}

	function _helper10(p) {
		p *= 10;
		let m = 27 * p * p + 360 * p + 800,
			n = _helper10_1_ * Math.sqrt(p + 10);
		return 0.075 * ((Math.cbrt((m - n) * p) + Math.cbrt((m + n) * p)) + 3 * p);
	}

	//More information (Japanese): http://void.heteml.jp/blog/archives/2014/05/easing_magicnumber.html
	//English version: https://github.com/Michaelangel007/easing#the-magic-of-170158
	function _helper11(overShoot) {
		return 1 - (overShoot + 3) / (3 * overShoot + 3);
	}

	function _helper17(dx, dy, a1, b1, b2, c, edge, isc) {
		let nrl = Geometry_distPnt(c.x, c.y, a1.x, a1.y, true);
		if (nrl < isc.dist) {
			let ibl = 1 / Geometry_distPnt(b2.x, b2.y, b1.x, b1.y, true);
			let nx = -(b2.y - b1.y) * ibl,
				ny = (b2.x - b1.x) * ibl;
			let ddot = 2 * (dx * nx + dy * ny);
			isc.dist = nrl;
			isc.norm_x = nx;
			isc.norm_y = ny;
			isc.refl_x = -ddot * nx + dx;
			isc.refl_y = -ddot * ny + dy;
			isc.edge = edge;
		}
	}

	function _helper18(p, a, b, edge, isc) {
		let xx, yy, dst, param;
		let A = p.x - a.x,
			B = p.y - a.y,
			C = b.x - a.x,
			D = b.y - a.y;
		param = (A * C + B * D) / (C * C + D * D);
		if (param < 0 || (a.x === b.x && a.y === b.y)) {
			xx = a.x;
			yy = a.y;
		} else if (param > 1) {
			xx = b.x;
			yy = b.y;
		} else {
			xx = a.x + param * C;
			yy = a.y + param * D;
		}
		dst = Geometry_distPnt(xx, yy, p.x, p.y, true);
		if (dst < isc.dist) {
			isc.dist = dst;
			isc.edge = edge;
			isc.point_x = xx;
			isc.point_y = yy;
		}
	}

	//Solve root of x^3
	function _helper19(a0, a1, a2, a3) {
		a2 /= a3;
		a1 /= a3;
		a0 /= a3;
		let a2a2 = a2 * a2;
		let Q = (3 * a1 - a2a2) / 9,
			R = (9 * a2 * a1 - 27 * a0 - 2 * a2a2 * a2) / 54;
		let QQQ = Q * Q * Q;
		let D = QQQ + R * R;
		if (D >= 0) {
			let sqrtD = Math.sqrt(D);
			let S = Math.cbrt(R + sqrtD),
				T = Math.cbrt(R - sqrtD);
			return (-a2 / 3) + S + T;
		}
		return 2 * Math.sqrt(-Q) * Math.cos(Math.acos(R / Math.sqrt(-QQQ)) / 3) - a2 / 3;
	}

	//Solve root of x^4
	function _helper20(a0, a1, a2, a3, a4) {
		_helper1();
		a3 /= a4;
		a2 /= a4;
		a1 /= a4;
		a0 /= a4;
		let frontPart, backPart, DSquare, ESquare, a3a3 = a3 * a3,
			a22 = 2 * a2,
			a04 = 4 * a0,
			length = 0;
		let y1 = _helper19(4 * a2 * a0 - a1 * a1 - a3a3 * a0, a1 * a3 - a04, -a2, 1),
			a334 = a3a3 * 0.75;
		let RSquare = a3a3 / 4 - a2 + y1;
		let R = Math.sqrt(RSquare),
			a34 = -a3 / 4,
			R2 = R / 2;
		if (RSquare === 0) {
			frontPart = a334 - a22;
			backPart = 2 * Math.sqrt(y1 * y1 - a04);
			DSquare = frontPart + backPart;
			ESquare = frontPart - backPart;
		} else {
			frontPart = a334 - RSquare - a22;
			backPart = (4 * a3 * a2 - 8 * a1 - a3a3 * a3) / (4 * R);
			DSquare = frontPart + backPart;
			ESquare = frontPart - backPart;
		}
		frontPart = a34 + R2;
		if (DSquare >= 0) {
			backPart = Math.sqrt(DSquare) / 2;
			_memory_1_[length++] = (frontPart + backPart);
			_memory_1_[length++] = (frontPart - backPart);
		}
		frontPart = a34 - R2;
		if (ESquare >= 0) {
			backPart = Math.sqrt(ESquare) / 2;
			_memory_1_[length++] = (frontPart + backPart);
			_memory_1_[length++] = (frontPart - backPart);
		}
		return length;
	}

	function _helper21(a, b, c) {
		let minx = Math.min(b.x, c.x),
			maxx = Math.max(b.x, c.x),
			miny = Math.min(b.y, c.y),
			maxy = Math.max(b.y, c.y);

		if (minx === maxx) return (miny <= a.y && a.y <= maxy);
		if (miny === maxy) return (minx <= a.x && a.x <= maxx);

		return (minx <= a.x + 1e-10 && a.x - 1e-10 <= maxx && miny <= a.y + 1e-10 && a.y - 1e-10 <= maxy);
	}

	function _helper22(a1, a2, b1, b2, c) {
		let dax = (a1.x - a2.x),
			dbx = (b1.x - b2.x),
			day = (a1.y - a2.y),
			dby = (b1.y - b2.y);

		let Den = dax * dby - day * dbx;
		if (Den === 0) return null;

		let A = (a1.x * a2.y - a1.y * a2.x),
			B = (b1.x * b2.y - b1.y * b2.x);

		let iDen = 1 / Den;
		c.x = (A * dbx - dax * B) * iDen;
		c.y = (A * dby - day * B) * iDen;

		if (!_helper21(c, b1, b2)) return null;
		if ((day > 0 && c.y > a1.y) || (day < 0 && c.y < a1.y)) return null;
		if ((dax > 0 && c.x > a1.x) || (dax < 0 && c.x < a1.x)) return null;
		return c;
	}

	function _helper23(num, func, places, type) {
		_helper1();
		let k, verySmallNumber = 1e-10,
			allEqual = true,
			flip = (type === 2 ? 1 : -1);
		_helper1();
		if (typeof places != "number" && !(places instanceof Number)) {
			places = 10;
		}

		if (num === flip * Infinity) {
			return NaN;
		} else if (num === flip * -Infinity) {
			num = flip * -Number.MAX_VALUE / 10;
		}

		if (places > 10) {
			verySmallNumber = oldPow(1e-32, places / 32);
		}

		for (k = 0; k < 5; k++) {
			num += flip * verySmallNumber;
			_memory_1_.push(num);
			_memory_2_.push(func(num));
		}

		for (k = 0; k < _memory_2_.length; k++) {
			_memory_3_.push(Math_round(_memory_2_[k], places));
		}

		for (k = 1; k < _memory_3_.length; k++) {
			allEqual = allEqual && (_memory_3_[k - 1] === _memory_3_[k]);
		}
		if (allEqual === true) {
			return _memory_3_[0];
		}
		return NaN;
	}

	function _helper24(time, size, strength) {
		return strength * time * (0.002 - 0.002 / size) + 1;
	}

	function _helper25(i, curve2a, curve2b, curve2H) {
		if (!_bounce_stack_[i]) {
			_bounce_stack_.push({});
		}
		_bounce_stack_[i].a = curve2a;
		_bounce_stack_[i].b = curve2b;
		_bounce_stack_[i].H = curve2H;
	}

	function _helper26(type, time, amplitude, period) {
		let s;
		amplitude = _helper0(amplitude, 0.1);
		period = _helper0(period, 0.1);
		if (time === 0) {
			return 0;
		}
		if (time === 1) {
			return 1;
		}
		if (amplitude < 1) {
			amplitude = 1;
			s = period / 4;
		} else {
			s = period * Math_acsc(amplitude) / Math_TAU;
		}
		switch (type) {
			case 0: {
				return amplitude * Math_pow(1024, time - 1) * Math.sin(Math_TAU * (s - time + 1) / period);
			}
			break;
			case 1: {
				return 1 - amplitude * Math_pow(2, -10 * time) * Math.sin(Math_TAU * (s - time) / period);
			}
			break;
			case 2: {
				s = Math.sin(Math_TAU * (s - 2 * time + 1) / period);
				if (time < 0.5) {
					return amplitude * Math_pow(2, 20 * time - 11) * s;
				}
				return 1 - amplitude * Math_pow(2, 9 - 20 * time) * s;
			}
			break;
		}
	}

	function _helper27(uniform) {
		_helper1();
		_memory_1_[0] = oldRandom();
		_memory_1_[1] = oldRandom();
		if (uniform && _memory_1_[1] < _memory_1_[0]) {
			let c = _memory_1_[1];
			_memory_1_[1] = _memory_1_[0];
			_memory_1_[0] = c;
		}
	}

	/**
	 * @constant {number} HALFPI
	 * 
	 * Equal to half of `Math.PI`, specific value is `1.5707963267948966`
	 *
	 * @memberof Math
	 */
	let Math_HALF_PI = Math.PI / 2;

	/**
	 * @constant {number} TAU
	 * 
	 * Equal to double of `Math.PI`, specific value is `6.283185307179586`
	 *
	 * @memberof Math
	 */
	let Math_TAU = Math.PI * 2;

	/**
	 * @constant {number} SQRTPI
	 * 
	 * Square root of `Math.PI`, specific value is `1.7724538509055159`
	 *
	 * @memberof Math
	 */
	let Math_SQRT_PI = Math.sqrt(Math.PI);

	/**
	 * @constant {number} SQRTTAU
	 * 
	 * Square root of `Math_TAU`, specific value is `2.5066282746310002`
	 *
	 * @memberof Math
	 */
	let Math_SQRT_TAU = Math.sqrt(Math_TAU);

	/**
	 * @constant {number} PHI
	 * 
	 * [Golden ratio]{@link https://en.wikipedia.org/wiki/Golden_ratio}, specific value is `1.618033988749895`
	 *
	 * @memberof Math
	 */
	let Math_PHI = (1 + Math.sqrt(5)) / 2;

	/**
	 * @constant {number} SILVER
	 * 
	 * [Silver ratio]{@link https://en.wikipedia.org/wiki/Silver_ratio}, specific value is `2.414213562373095`
	 *
	 * @memberof Math
	 */
	let Math_SILVER = 1 + Math.SQRT2;

	/**
	 * @constant {number} UPC
	 * 
	 * [Universal parabolic constant]{@link https://en.wikipedia.org/wiki/Universal_parabolic_constant}, specific value is `2.295587149392638`
	 *
	 * @memberof Math
	 */
	let Math_UPC = Math.log(1 + Math.SQRT2) + Math.SQRT2;

	/**
	 *
	 * All of general math functions 
	 *
	 * @namespace Math
	 *
	 **/

	/**
	 *
	 * Calculate natural logarithm
	 *
	 * @param {number} num - The number to calculate
	 * @return {number}
	 *
	 * @function ln
	 * @memberof Math
	 *
	 * @example
	 * Math.ln(10);
	 * //2.302585092994046
	 **/
	let Math_ln = Math.log;

	/**
	 *
	 * Calculate logarithm of n base
	 *
	 * @param {number} num - The number to calculate
	 * @param {number=} [base=Math.E] - The logarithm base
	 * @return {number}
	 *
	 * @example
	 * Math.log(10000, 10);
	 * //4
	 *
	 * @function log
	 * @memberof Math
	 **/
	function Math_log(num, base) {
		base = _helper0(base, Math.E);
		return Math_ln(num) / Math_ln(base);
	}

	/**
	 *
	 * Calculate modulo (not remainder) by `num1 % num2`
	 *
	 * @param {number} num1
	 * @param {number} num2
	 * @return {number}
	 *
	 * @example
	 * Math.mod(-21, 4);
	 * //3
	 *
	 * @function mod
	 * @memberof Math
	 **/
	function Math_mod(num1, num2) {
		//https://math.stackexchange.com/questions/1069751/
		return num1 - oldFloor(num1 / num2) * num2;
		//(num1 % num2 + num2) % num2;
	}

	/**
	 *
	 * Calculate remainder with more options ?
	 *
	 * @param {number} num
	 * @param {number} left
	 * @param {number=} right
	 * @return {number}
	 *
	 * @example
	 * Math.rem(-21, 4);
	 * //3
	 * 
	 * Math.rem(-21, 4, -1);
	 * //-1
	 *
	 * @function rem
	 * @memberof Math
	 **/
	function Math_rem(num, left, right) {
		//detect single-arg case, like mod-loop or fmod
		if (!right) {
			right = left;
			left = 0;
		}
		//swap frame order
		if (left > right) {
			let tmp = right;
			right = left;
			left = tmp;
		}
		let frame = right - left;
		num = ((num + left) % frame) - left;
		if (num < left) num += frame;
		if (num > right) num -= frame;
		return num;
	}

	/**
	 *
	 * Calculate `num1` divided by [remainder]{@link http://en.wikipedia.org/wiki/Remainder} of `num2`. If the remainder is negative, adjust it to a positive number in the range of `0` - `num2`
	 *
	 * @param {number} num1
	 * @param {number} num2
	 * @return {number}
	 *
	 * @example
	 * Math.cycle(10, 3);
	 * //1
	 * 
	 * Math.cycle(4, 7);
	 * //4
	 *
	 * @function cycle
	 * @memberof Math
	 **/
	function Math_cycle(num1, num2) {
		num1 %= num2;
		return num1 > 0 ? num1 : num1 + num2;
	}

	/**
	 *
	 * Gamma function
	 *
	 * @param {number} num - The number to calculate
	 * @param {number=} accuracy
	 * @return {number}
	 *
	 * @example
	 * Math.gamma(2.33);
	 * //1.1881928111058075
	 *
	 * @function gamma
	 * @memberof Math
	 **/
	function Math_gamma(num, accuracy) {
		accuracy = _helper0(accuracy, 7);
		if (num < 0.5) {
			return Math.PI / (Math.sin(num * Math.PI) * Math_gamma(1 - num));
		} else {
			num--;
			let temp = _gamma_1_[0];
			for (let i = 1; i < accuracy + 2; i++) {
				temp += _gamma_1_[i] / (num + i);
			}
			let temp2 = num + accuracy + 0.5;
			return Math_SQRT_TAU * Math_pow(temp2, num + 0.5) * Math.exp(-temp2) * temp;
		}
	}

	/**
	 *
	 * Calculate natural logarithm of gamma function
	 *
	 * @param {number} num - The number to calculate
	 * @return {number}
	 *
	 * @example
	 * Math.lnGamma(5.25);
	 * //3.5613759103866967
	 *
	 * @function lnGamma
	 * @memberof Math
	 **/
	function Math_lnGamma(num) {
		let ser = 1.000000000190015,
			xx = num, y = num, tmp;
		tmp = num + 5.5;
		tmp -= (xx + 0.5) * Math_ln(tmp);
		for (let j = 0; j < 6; j++) {
			ser += _lnGamma_1_[j] / ++y;
		}
		return Math_ln(2.5066282746310005 * ser / xx) - tmp;
	}

	/**
	 *
	 * Calculate factorial of number
	 *
	 * @param {number} num - The number to calculate
	 * @return {number}
	 *
	 * @example
	 * Math.factorial(4.5);
	 * //52.34277778455353
	 *
	 * @function factorial
	 * @memberof Math
	 **/
	function Math_factorial(num) {
		num++;
		return num === oldFloor(num) ? _helper5(num - 1) : num < 0 ? Math.PI / (Math.sin(Math.PI * num) * Math_gamma(1 - num)) : Math.exp(Math_lnGamma(num));
	}

	/**
	 *
	 * Calculate [combination]{@link https://en.wikipedia.org/wiki/Combination}
	 * (a.k.a [binomial coefficient]{@link https://en.wikipedia.org/wiki/Binomial_coefficient} or
	 * [pascal triangle]{@link https://en.wikipedia.org/wiki/Pascal%27s_triangle})
	 *
	 * @param {number} num1
	 * @param {number} num2
	 * @return {number}
	 *
	 * @example
	 * Math.nCr(8, 5);
	 * //56
	 *
	 * @function nCr
	 * @memberof Math
	 **/
	function Math_nCr(num1, num2) {
		let result = 1;
		for (let i = 0; i < num2; i++) {
			result *= (num1 - i) / (i + 1);
		}
		return result;
	}

	/**
	 *
	 * Calculate [permutation]{@link https://en.wikipedia.org/wiki/Permutation}
	 *
	 * @param {number} num1
	 * @param {number} num2
	 * @return {number}
	 *
	 * @example
	 * Math.nPr(8, 5);
	 * //6720
	 *
	 * @function nPr
	 * @memberof Math
	 **/
	function Math_nPr(num1, num2) {
		let result = 1;
		for (let i = 0; i < num2; i++) {
			result *= num1 - i;
		}
		return result;
	}

	/**
	 *
	 * Calculate power
	 *
	 * @param {number} base
	 * @param {number} exponent
	 * @return {number}
	 *
	 * @example
	 * Math.pow(5, 6);
	 * //15625
	 *
	 * @function pow
	 * @memberof Math
	 **/
	function Math_pow(base, exponent) {
		let result = oldPow(base, exponent);
		if (Number.isNaN(result)) {
			switch (exponent) {
				case 0.5: {
					return Math.sqrt(base);
				}
				break;
				case _helper9_1_: {
					return Math.cbrt(base);
				}
				break;
				default: {
					let tempExponent = 1 / exponent;
					if (base < 0 && !Number_isEven(tempExponent)) {
						return -oldPow(Math.abs(base), exponent);
					}
				}
			}
		}
		return result;
	}

	/**
	 *
	 * Find n of `num2 ** n === num1`
	 *
	 * @param {number} num1
	 * @param {number} num2
	 * @return {number}
	 *
	 * @example
	 * Math.of(32, 2);
	 * //5
	 *
	 * @function of
	 * @memberof Math
	 **/
	function Math_of(num1, num2) {
		if (num1 === num2) {
			return 1;
		}
		if (num1 <= 0 || num2 <= 0 || num1 === 1 || num2 > num1) {
			return 0;
		}
		let temp1 = num2,
			temp2 = num2,
			result = 1;
		_helper1();
		while (temp1 < num1) {
			_memory_1_.push(temp2);
			temp1 *= temp2;
			result *= 2;
			if (temp1 === num1) return result;
			temp2 *= temp2;
		}
		if (temp1 === Infinity) return 0;
		let temp3;
		while (_memory_1_.length > 0) {
			temp3 = _memory_1_.pop();
			if (temp1 > num1) {
				temp1 /= temp3;
				result -= (1 << _memory_1_.length);
			} else {
				temp1 *= temp3;
				result += (1 << _memory_1_.length);
			}
			if (temp1 === num1) return result;
		}
		return 0;
	}

	/**
	 *
	 * [Sigmoid function]{@link https://en.wikipedia.org/wiki/Sigmoid_function}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.sigmoid(9);
	 * //0.9998766054240137
	 *
	 * @function sigmoid
	 * @memberof Math
	 **/
	function Math_sigmoid(num) {
		return 1 / (1 + Math.exp(-num));
	}

	/**
	 *
	 * [Pairing function]{@link https://en.wikipedia.org/wiki/Pairing_function}
	 *
	 * @param {number} num1
	 * @param {number} num2
	 * @return {number}
	 *
	 * @example
	 * Math.pair(9, 6);
	 * //100
	 *
	 * @function pair
	 * @memberof Math
	 **/
	function Math_pair(num1, num2) {
		return (num1 + num2 - 2) * (num1 + num2 - 1) / 2 + num1;
	}

	/**
	 *
	 * Calculate [integral]{@link https://en.wikipedia.org/wiki/Integral}
	 *
	 * @param {number} a - The begin of interval
	 * @param {number} b - The end of interval
	 * @param {function} func - The function to calculate
	 * @param {number=} [epsilon=1e-17]
	 * @param {number=} [iteration=11]
	 * @return {number}
	 *
	 * @example
	 * Math.integral(1, 5, Math.sin);
	 * //0.25664012040491363
	 *
	 * @function integral
	 * @memberof Math
	 **/
	function Math_integral(a, b, func, epsilon, iteration) {
		_helper1();
		epsilon = _helper0(epsilon, 1e-17);
		iteration = _helper0(iteration, 11);
		let h = oldPow(2, -iteration),
			k, t, sinht, i;
		for (k = 0; k < 20 * oldPow(2, iteration); k++) {
			t = k * h;
			sinht = Math.sinh(t);
			_memory_1_[k] = Math.tanh(Math_HALF_PI * sinht);
			_memory_2_[k] = Math.PI * Math.cosh(t) / (Math.cosh(Math.PI * sinht) + 1);
			if (Math.abs(1 - _memory_1_[k]) < epsilon) {
				break;
			}
		}
		let nt = k,
			sum = 0,
			len = (b - a) / 2,
			mid = (b + a) / 2;
		for (k = 1; k < iteration; k++) {
			for (i = 0; i < nt; i += oldPow(2, iteration - k)) {
				if (i % oldPow(2, iteration - k + 1) !== 0 || k === 1) {
					if (i === 0) {
						sum += _memory_2_[0] * func(mid);
					} else {
						t = len * _memory_1_[i];
						sum += _memory_2_[i] * (func(mid - t) + func(mid + t));
					}
				}
			}
		}
		return 2 * len * h * sum;
	}

	/**
	 *
	 * Calculate [derivative]{@link https://en.wikipedia.org/wiki/Derivative} by using [Romberg's method]{@link https://en.wikipedia.org/wiki/Romberg%27s_method}
	 *
	 * @param {number} num - The number to calculate
	 * @param {function} func - The function to calculate
	 * @param {number=} [columns=6] - The higher the more accurate (integer only)
	 * @param {number=} [accuracy1=1e-15]
	 * @param {number=} [accuracy2=1]
	 * @return {number}
	 *
	 * @example
	 * Math.derivative(Math.PI, Math.sin);
	 * //-1
	 *
	 * @function derivative
	 * @memberof Math
	 **/
	function Math_derivative(num, func, columns, accuracy1, accuracy2) {
		_helper1();
		columns = _helper0(columns, 6);
		accuracy1 = _helper0(accuracy1, 1e-15); //tol
		accuracy2 = _helper0(accuracy2, 1);
		let d1, d2, h2;
		_memory_1_[0] = (func(num + accuracy2) - func(num - accuracy2)) / (accuracy2 * 2.0);
		for (let j = 1; j <= columns - 1; j++) {
			_memory_1_[j] = 0.0;
			d1 = _memory_1_[0];
			h2 = accuracy2;
			accuracy2 *= 0.5;
			_memory_1_[0] = (func(num + accuracy2) - func(num - accuracy2)) / h2;
			for (let m = 4, i = 1; i <= j; i++, m *= 4) {
				d2 = _memory_1_[i];
				_memory_1_[i] = (m * _memory_1_[i - 1] - d1) / (m - 1);
				d1 = d2;
			}
			if (Math.abs(_memory_1_[j] - _memory_1_[j - 1]) < accuracy1) {
				return _memory_1_[j];
			}
		}
		return NaN;
	}

	/**
	 *
	 * Calculate [limit]{@link https://en.wikipedia.org/wiki/Limit_(mathematics)}
	 *
	 * @param {number=} [type=0] - 0: limit, 1: limit left, 2: limit right
	 * @param {number} num - The number to calculate
	 * @param {function} func - The function to calculate
	 * @param {number=} [places=10]
	 * @return {number}
	 *
	 * @example
	 * Math.limit(0, 2, (x) => {return x / (x - 1)}, 100);
	 * //2
	 *
	 * @function limit
	 * @memberof Math
	 **/
	function Math_limit(type, num, func, places) {
		if (typeof places != "number" && !(places instanceof Number)) {
			places = 10;
		}
		let atX = func(num);
		switch (type) {
			case 1:
				{
					return _helper23(num, func, places, 1);
				}
				break;
			case 2:
				{
					return _helper23(num, func, places, 2);
				}
				break;
			default:
				{
					if (!Number.isNaN(atX)) {
						return atX;
					} else if (!Number.isNaN(num)) {
						if (num === Infinity) {
							return _helper23(num, func, places, 1);
						} else if (num === -Infinity) {
							return _helper23(num, func, places, 2);
						} else {
							let left = _helper23(num, func, places, 1),
								right = _helper23(num, func, places, 2);
							if (left === right) {
								return left;
							}
						}
					}
				}
		}
		return NaN;
	}

	/**
	 *
	 * Solve a function where `f(x) = 0`
	 *
	 * @param {number} x0 - Minimum guessing range
	 * @param {number} x1 - Maximum guessing range
	 * @param {function} func - Function to calculate
	 * @param {number=} [epsilon=1e-17]
	 * @param {number=} [iteration=1e7]
	 * @return {number}
	 *
	 * @example
	 * Math.solve(-100, 100, (x) => {return 3 * x + 2});
	 * //-0.6666666666666667
	 *
	 * @function solve
	 * @memberof Math
	 **/
	function Math_solve(x0, x1, func, epsilon, iteration) {
		x0 = _helper0(x0, -100);
		x1 = _helper0(x1, 100);
		let i = 0,
			result0 = func(x0);
		if (result0 * func(x1) === 0) {
			if (result0 === 0) {
				return x0;
			}
			return x1;
		}
		let result1 = func((x1 + x0) / 2);
		epsilon = _helper0(epsilon, 1e-17);
		iteration = _helper0(iteration, 1e7);
		while (x1 - x0 > epsilon && i < iteration) {
			if (result0 * result1 < 0) {
				x1 = ((x1 + x0) / 2);
			} else if (result0 * result1 > 0) {
				x0 = ((x1 + x0) / 2);
				result0 = func(x0);
			} else if (result0 * func(x1) === 0) {
				if (result0 === 0) {
					return x0;
				}
				return x1;
			}
			result1 = func((x1 + x0) / 2);
			i ++;
		}
		if (result0 * func(x1) < 0) {
			return (x1 + x0) / 2;
		}
		return NaN;
	}

	/**
	 *
	 * Calculate numerator and denominator of a number
	 *
	 * @param {number} num - The number to calculate
	 * @param {number=} [iteration=0] - Denominator must not larger than this number
	 * @param {array=} returnData - Array to put data
	 * @return {number[]} [numerator, denominator]
	 *
	 * @example
	 * Math.rational(Math.PI);
	 * //[245850922, 78256779]
	 * 
	 * 245850922 / 78256779 == Math.PI;
	 * //true
	 *
	 * @function rational
	 * @memberof Math
	 **/
	function Math_rational(num, iteration, returnData) {
		iteration = _helper0(iteration, 0); //16
		let approx = 0,
			error = 0,
			best = 0,
			besterror = 0,
			i = 1,
			result = _helper0(returnData, "_a_");

		result[0] = num;
		result[1] = 1;

		do {
			approx = oldRound(num * i); //x / (1 / i)
			error = (num - (approx / i));
			if (i === 1) {
				best = i;
				besterror = error;
			}
			if (Math.abs(error) < Math.abs(besterror)) {
				best = i;
				besterror = error;
			}
			result[0] = oldRound(num * best);
			result[1] = best;
			i++;
		} while (iteration !== 0 ? i <= iteration : result[0] / result[1] !== num);

		// return x/1 instead of 0/0 if a better solution can't be found
		if (result[0] === 0 && result[1] === 0) {
			result[0] = num;
			result[1] = 1;
		}
		return result;
	}

	/**
	 *
	 * [Probability density function]{@link https://en.wikipedia.org/wiki/Probability_density_function} or maybe [Normal distribution]{@link https://en.wikipedia.org/wiki/Normal_distribution} ?
	 *
	 * @param {number} mean - [Mean]{@link https://en.wikipedia.org/wiki/Mean} or [Expected value]{@link https://en.wikipedia.org/wiki/Expected_value}
	 * @param {number} variance - [Variance]{@link https://en.wikipedia.org/wiki/Variance}
	 * @param {number} std - [Standard deviation]{@link https://en.wikipedia.org/wiki/Standard_deviation}
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.pdf(0, 1, 1, 1);
	 * //0.24197072451914337
	 *
	 * @function pdf
	 * @memberof Math
	 **/
	function Math_pdf(mean, variance, std, num) {
		let m = std * Math_SQRT_TAU,
			e = Math.exp(-oldPow(num - mean, 2) / (2 * variance));
		return e / m;
	}

	/**
	 *
	 * [Cumulative distribution function]{@link https://en.wikipedia.org/wiki/Cumulative_distribution_function}
	 *
	 * @param {number} mean - [Mean]{@link https://en.wikipedia.org/wiki/Mean} or [Expected value]{@link https://en.wikipedia.org/wiki/Expected_value}
	 * @param {number} std - [Standard deviation]{@link https://en.wikipedia.org/wiki/Standard_deviation}
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.cdf(0, 1, 1);
	 * //0.8413447460685428
	 *
	 * @function cdf
	 * @memberof Math
	 **/
	function Math_cdf(mean, std, num) {
		return Math_erfc((mean - num) / (std * Math.SQRT2)) / 2;
	}

	/**
	 *
	 * Not sure if this function is [Production–possibility frontier function]{@link https://en.wikipedia.org/wiki/Production%E2%80%93possibility_frontier}
	 *
	 * @param {number} mean - [Mean]{@link https://en.wikipedia.org/wiki/Mean} or [Expected value]{@link https://en.wikipedia.org/wiki/Expected_value}
	 * @param {number} std - [Standard deviation]{@link https://en.wikipedia.org/wiki/Standard_deviation}
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.ppf(0, 1, 1);
	 * //3.5005420375954306
	 *
	 * @function ppf
	 * @memberof Math
	 **/
	function Math_ppf(mean, std, num) {
		return mean - std * Math.SQRT2 * Math_ierfc(2 * num);
	}

	/**
	 *
	 * [Error function]{@link https://en.wikipedia.org/wiki/Error_function}
	 *
	 * @param {number} num
	 * @param {number=} [accuracy=50]
	 * @return {number}
	 *
	 * @example
	 * Math.erf(1);
	 * //0.8427007929497149
	 *
	 * @function erf
	 * @memberof Math
	 **/
	function Math_erf(num, accuracy) {
		let m = 1,
			s = 1,
			sum = num; // * 1.0

		accuracy = _helper0(accuracy, 50);

		for (let i = 1; i < accuracy; i++) {
			m *= i;
			s *= -1;
			sum += (s * oldPow(num, 2 * i + 1)) / (m * (2 * i + 1));
		}
		return 2 * sum / Math_SQRT_PI;
	}

	/**
	 *
	 * [Complementary error function]{@link https://en.wikipedia.org/wiki/Error_function#Complementary_error_function}
	 *
	 * @param {number} num
	 * @param {number=} [accuracy=50]
	 * @return {number}
	 *
	 * @example
	 * Math.erfc(1);
	 * //0.1572992070502851
	 *
	 * @function erfc
	 * @memberof Math
	 **/
	function Math_erfc(num, accuracy) {
		return 1 - Math_erf(num, accuracy);
	}

	/**
	 *
	 * [Inverse error function]{@link https://en.wikipedia.org/wiki/Error_function#Inverse_functions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.ierf(1);
	 * //2.4752570126123032
	 *
	 * @function ierf
	 * @memberof Math
	 **/
	function Math_ierf(num) {
		return Math_invNorm((num + 1) / 2) / Math.SQRT2;
	}

	/**
	 *
	 * [Inverse complementary error function]{@link http://mathworld.wolfram.com/InverseErfc.html}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.ierfc(10);
	 * //-387.61380920254567
	 *
	 * @function ierfc
	 * @memberof Math
	 **/
	function Math_ierfc(num) {
		return -Math_invNorm(num / 2) / Math.SQRT2;
	}

	/**
	 *
	 * Scaled complementary error function
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.erfcx(1);
	 * //0.42758357615580705
	 *
	 * @function erfcx
	 * @memberof Math
	 **/
	function Math_erfcx(num) {
		if (num < 0) {
			return num < -6.1 ? 2 * Math.exp(num * num) : 2 * Math.exp(num * num) - Math_erfcx(-num);
		}
		if (num > 50) {
			let nm = num * num;
			return num > 5e7 ? _erfcx_1_[21] / num : _erfcx_1_[21] * (nm * (nm + 4.5) + 2) / (num * (nm * (nm + 5) + 3.75));
		}
		let E = 0, I = 0;
		for (let i = 9; i > -1; i --) {
			E += _erfcx_1_[i];
			if (i === 0) {
				break;
			}
			E *= num;
		}
		for (let i = 20; i > 9; i --) {
			I += _erfcx_1_[i];
			if (i === 10) {
				break;
			}
			I *= num;
		}
		return E / I;
	}

	/**
	 *
	 * [Inverse normal distribution function]{@link https://en.wikipedia.org/wiki/Inverse_Gaussian_distribution}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.invNorm(1);
	 * //3.5005420375954306
	 *
	 * @function invNorm
	 * @memberof Math
	 **/
	function Math_invNorm(num) {
		let qw, we, er = 0, er2 = 0, result;
		if (num < _invNorm_1_[21]) {
			qw = Math.sqrt(-2 * Math_ln(num));
			for (let i = 11; i < 17; i ++) {
				er += _invNorm_1_[i];
				if (i === 16) {
					break;
				}
				er *= qw;
			}
			for (let i = 17; i < 21; i ++) {
				er2 += _invNorm_1_[i];
				er2 *= qw;
			}
			er2 += 1;
			result = er / er2;
		} else {
			qw = num - 0.5;
			we = qw * qw;
			for (let i = 0; i < 6; i ++) {
				er += _invNorm_1_[i];
				if (i === 5) {
					er *= qw;
					break;
				}
				er *= we;
			}
			for (let i = 6; i < 11; i ++) {
				er2 += _invNorm_1_[i];
				er2 *= we;
			}
			er2 += 1;
			er /= er2;
			result = er - Math_SQRT_TAU * (0.5 * Math_erfcx(-er / Math.SQRT2) - Math.exp(0.5 * er * er) * num);
		}
		return result;
	}

	/**
	 *
	 * [Kelly function]{@link https://en.wikipedia.org/wiki/Kelly_criterion}
	 *
	 * @param {number} num1
	 * @param {number} num2
	 * @return {number}
	 *
	 * @example
	 * Math.kelly(2, 0.5);
	 * //0.25
	 *
	 * @function kelly
	 * @memberof Math
	 **/
	function Math_kelly(num1, num2) {
		return (num2 * (num1 + 1) - 1) / num1;
	}

	/**
	 *
	 * [Bernstein function]{@link https://en.wikipedia.org/wiki/Bernstein_polynomial}
	 *
	 * @param {number} x
	 * @param {number} v
	 * @param {number} n
	 * @return {number}
	 *
	 * @example
	 * Math.bernstein(2, 2, 2);
	 * //4
	 *
	 * @function bernstein
	 * @memberof Math
	 **/
	function Math_bernstein(x, v, n) {
		return Math_nCr(n, v) * Math_pow(x, v) * Math_pow(1 - x, n - v);
	}

	/**
	 *
	 * [Smooth function]{@link http://iquilezles.org/www/articles/smin/smin.htm}
	 * Inverse is -smooth(-a,-b,k)
	 *
	 * @param {number} num1
	 * @param {number} num2
	 * @param {number} smoothness - if isOver is `true`, default is `32`, else `0.1`
	 * @param {boolean} isOver - use better algorithm but slower
	 * @return {number}
	 *
	 * @example
	 * Math.smooth(0, 1);
	 * //0
	 *
	 * @function smooth
	 * @memberof Math
	 **/
	function Math_smooth(num1, num2, smoothness, isOver) {
		let h;
		if (isOver) {
			smoothness = _helper0(smoothness, 32);
			h = Math.exp(-smoothness * num1) + Math.exp(-smoothness * num2);
			return -Math_ln(h) / smoothness;
		}
		smoothness = _helper0(smoothness, 0.1);
		h = Math_clamp(0.5 + 0.5 * (num2 - num1) / smoothness, 0, 1);
		return Math_lerp(h, num2, num1) - smoothness * h * (1 - h);
		//Same for max with -smooth stuff
	}

	/**
	 *
	 * Adjust decimal of a number
	 *
	 * @param {number} type - 0: round, 1: floor, 2: ceil, 3: trunc, 4: away
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.adjust(0, Math.PI, 2);
	 * //3.14 (same as Math.round)
	 *
	 * @function adjust
	 * @memberof Math
	 **/
	function Math_adjust(type, num, digits, base) {
		digits = _helper0(digits, 0);
		base = _helper0(base, 10);
		let result, temp;
		temp = Math_pow(base, digits);
		result = _helper3(type, num * temp) / temp;
		return result;
	}

	/**
	 *
	 * Adjust decimal of a number by digit location and base
	 *
	 * @param {number} type - 0: round, 1: floor, 2: ceil, 3: trunc, 4: away
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.adjust2(0, Math.PI, 2);
	 * //3.1 (same as Math.round2)
	 *
	 * @function adjust2
	 * @memberof Math
	 **/
	function Math_adjust2(type, num, digits, base) {
		digits = _helper0(digits, 0);
		base = _helper0(base, 10);
		let base2, exp, temp, temp2;
		base2 = _helper0(base, 10);
		let absX = Math.abs(num);
		if (base2 === 10) {
			exp = Math.log10(absX);
		} else if (base2 === 2) {
			exp = Math.exp(absX);
		} else {
			exp = Math_log(absX, base2);
		}
		exp = oldFloor(exp - digits + 1.0);
		temp = Math_pow(base2, Math.abs(exp));
		if (exp < 0) {
			temp2 = _helper3(type, num * temp) / temp;
		} else {
			temp2 = _helper3(type, num / temp) * temp;
		}
		return temp2;
	}

	/**
	 *
	 * Round number by digits and base
	 *
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.round(Math.PI, 2);
	 * //3.14
	 *
	 * Math.round(5, -1, 2);
	 * //6
	 *
	 *
	 * @function round
	 * @memberof Math
	 **/
	let Math_round = Math_adjust.bind(this, 0);

	/**
	 *
	 * Floor number by digits and base
	 *
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.floor(Math.PI, 2);
	 * //3.14
	 *
	 * Math.floor(5, -1, 2);
	 * //4
	 *
	 *
	 * @function floor
	 * @memberof Math
	 **/
	let Math_floor = Math_adjust.bind(this, 1);

	/**
	 *
	 * Ceil number by digits and base
	 *
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.ceil(Math.PI, 2);
	 * //3.15
	 *
	 * Math.ceil(5, -1, 2);
	 * //6
	 *
	 *
	 * @function ceil
	 * @memberof Math
	 **/
	let Math_ceil = Math_adjust.bind(this, 2);

	/**
	 *
	 * Truncate number by digits and base
	 *
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.trunc(Math.PI, 2);
	 * //3.14
	 *
	 * Math.ceil(5, -1, 2);
	 * //4
	 *
	 *
	 * @function trunc
	 * @memberof Math
	 **/
	let Math_trunc = Math_adjust.bind(this, 3);

	/**
	 *
	 * Truncate away from zero of a number by digits and base
	 *
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.away(Math.PI, 2);
	 * //3.15
	 *
	 * Math.away(5, -1, 2);
	 * //6
	 *
	 *
	 * @function away
	 * @memberof Math
	 **/
	let Math_away = Math_adjust.bind(this, 4);

	/**
	 *
	 * Round number by digit location and base
	 *
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.round2(Math.PI, 2);
	 * //3.1
	 *
	 * Math.round2(12345, 2, 5);
	 * //12500
	 *
	 * @function round2
	 * @memberof Math
	 **/
	let Math_round2 = Math_adjust2.bind(this, 0);

	/**
	 *
	 * Floor number by digit location and base
	 *
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.floor2(Math.PI, 2);
	 * //3.1
	 *
	 * Math.floor2(12345, 2, 5);
	 * //11875
	 *
	 * @function floor2
	 * @memberof Math
	 **/
	let Math_floor2 = Math_adjust2.bind(this, 1);

	/**
	 *
	 * Ceil number by digit location and base
	 *
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.ceil2(Math.PI, 2);
	 * //3.2
	 *
	 * Math.ceil2(12345, 2, 5);
	 * //12500
	 *
	 * @function ceil2
	 * @memberof Math
	 **/
	let Math_ceil2 = Math_adjust2.bind(this, 2);

	/**
	 *
	 * Truncate number by digit location and base
	 *
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.trunc2(Math.PI, 2);
	 * //3.1
	 *
	 * Math.trunc2(12345, 2, 5);
	 * //11875
	 *
	 * @function trunc2
	 * @memberof Math
	 **/
	let Math_trunc2 = Math_adjust2.bind(this, 3);

	/**
	 *
	 * Truncate away from zero of a number by digit location and base
	 *
	 * @param {number} num
	 * @param {number=} [digits=0]
	 * @param {number=} base
	 * @return {number}
	 *
	 * @example
	 * Math.away2(Math.PI, 2);
	 * //3.2
	 *
	 * Math.away2(12345, 2, 5);
	 * //12500
	 *
	 * @function away2
	 * @memberof Math
	 **/
	let Math_away2 = Math_adjust2.bind(this, 4);

	/**
	 *
	 * Attempt to correct rounding off error
	 *
	 * @param {number} num
	 * @param {number=} [epsilon=13] - Accuracy 
	 * @return {number}
	 *
	 * @example
	 * Math.correct(Math.sin(Math.PI));
	 * //0
	 *
	 * @function correct
	 * @memberof Math
	 **/
	function Math_correct(num, epsilon) {
		epsilon = _helper0(epsilon, 13);
		if (Math_round(num, epsilon) === Math_round(num, epsilon - 1)) {
			return Math_round(num, epsilon);
		}
		return num;
	}

	/**
	 *
	 * Snap a number to nearest number grid
	 *
	 * @param {number} type - 0: round, 1: floor, 2: ceil, 3: trunc, 4: away
	 * @param {number} num
	 * @param {number} gap - The interval gap of the grid
	 * @param {number=} [offset=0]
	 * @param {boolean} [isLocate=false] - use adjust by digit location and base if true
	 * @param {number=} [digits=0]
	 * @param {number=} [base=10]
	 * @return {number}
	 *
	 * @example
	 * Math.snap(0, 12, 5);
	 * //10
	 *
	 * @function snap
	 * @memberof Math
	 **/
	function Math_snap(type, num, gap, offset, isLocate, digits, base) {
		offset = _helper0(offset, 0);
		if (gap === 0) return num;
		num -= offset;
		num = gap * (isLocate ? Math_adjust2(type, num / gap, digits, base) : Math_adjust(type, num / gap, digits, base));
		return offset + num;
	}

	/**
	 *
	 * Same as `snap` but different a little bit...
	 *
	 * @param {number} type - 0: round, 1: floor, 2: ceil, 3: trunc, 4: away
	 * @param {number} num
	 * @param {number} a
	 * @param {number} b
	 * @param {number=} [gap=1] - The interval gap of the grid
	 * @param {boolean} [isLocate=false] - use adjust by digit location and base if true
	 * @param {number=} [digits=0]
	 * @param {number=} [base=10]
	 * @return {number}
	 *
	 * @example
	 * Math.discrete(0, 0.5, 0, 1);
	 * //1
	 *
	 * @function discrete
	 * @memberof Math
	 **/
	function Math_discrete(type, num, a, b, gap, isLocate, digits, base) {
		gap = _helper0(gap, 1);
		let temp = (a * (1 - num) + b * num) / gap;
		return (isLocate ? Math_adjust2(type, temp, digits, base) : Math_adjust(type, temp, digits, base)) * gap;
	}

	/**
	 *
	 * Strip off integer part of a number
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.shear(123.678);
	 * //0.6779999999999973
	 *
	 * @function shear
	 * @memberof Math
	 **/
	function Math_shear(num) {
		num = Math.abs(num);
		return num - oldFloor(num);
		//Can also n % 1
	}

	/**
	 *
	 * Count total digits of fractional part of a number
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.precision(123.678);
	 * //3
	 *
	 * @function precision
	 * @memberof Math
	 **/
	function Math_precision(num) {
		if (!Number.isFinite(num)) {
			return 0;
		}
		let e = 1,
			p = 0;
		while (oldRound(num * e) / e !== num) {
			e *= 10;
			p++;
		}
		return p;
	}

	/**
	 *
	 * Count total digits of integer part of a number
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.order(1234);
	 * //3
	 *
	 * @function order
	 * @memberof Math
	 **/
	function Math_order(num) {
		return oldFloor(Math_ln(Math.abs(num)) / Math.LN10);
	}

	/**
	 *
	 * [Ramp function]{@link https://en.wikipedia.org/wiki/Ramp_function}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.ramp(-1);
	 * //0
	 *
	 * @function ramp
	 * @memberof Math
	 **/
	function Math_ramp(num) {
		if (num > 0) {
			return num;
		}
		return 0.0; //Handle -0
	}

	/**
	 *
	 * [Heaviside step function]{@link https://en.wikipedia.org/wiki/Heaviside_step_function}
	 *
	 * @param {number} type - when `num == 0`, if `type` is `1`, then return `0`; if `type == 2`, return `1`, else `0.5`
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.heaviside(1, 1);
	 * //1
	 *
	 * @function heaviside
	 * @memberof Math
	 **/
	function Math_heaviside(type, num) {
		if (Number.isNaN(num)) {
			return NaN;
		}
		if (num > 0) {
			return 1;
		}
		if (num === 0) {
			switch (type) {
				case 1:
					{
						return 0;
					}
					break;
				case 2:
					{
						return 1;
					}
					break;
				default:
					{
						return 0.5;
					}
					break;
			}
		}
		return 0;
	}

	/**
	 *
	 * [Haar function]{@link https://en.wikipedia.org/wiki/Haar_wavelet}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.haar(0.25);
	 * //1
	 *
	 * @function haar
	 * @memberof Math
	 **/
	function Math_haar(num) {
		if (0.5 > num && num >= 0) {
			return 1;
		} else if (1 >= num && num > 0.5) {
			return -1;
		}
		return 0;
	}

	/**
	 *
	 * [Rectangular function]{@link https://en.wikipedia.org/wiki/Rectangular_function}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.rect(0.5);
	 * //0.5
	 *
	 * @function rect
	 * @memberof Math
	 **/
	function Math_rect(num) {
		num = Math.abs(num);
		if (num > 0.5) {
			return 0;
		} else if (num === 0.5) {
			return 0.5;
		} else if (num < 0.5) {
			return 1;
		}
		return NaN;
	}

	/**
	 *
	 * [Triangular function]{@link https://en.wikipedia.org/wiki/Triangular_function}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.tri(-0.5);
	 * //0.5
	 *
	 * @function tri
	 * @memberof Math
	 **/
	function Math_tri(num) {
		num = Math.abs(num);
		if (num >= 1) {
			return 0;
		}
		return 1 - num;
	}

	/**
	 *
	 * [Folding function]{@link http://mathworld.wolfram.com/FoldingFunction.html}
	 *
	 * @param {boolean} type
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.fold(true, 1);
	 * //1
	 *
	 * @function fold
	 * @memberof Math
	 **/
	function Math_fold(type, num) {
		if (type) {
			if (num > 0) {
				return 2 * num - 1;
			}
			return 2 * Math.abs(num);
		}
		if (num >= 0) {
			return 2 * num;
		}
		return 2 * Math.abs(num) - 1;
	}

	/**
	 *
	 * Return 1 if even, return -1 if odd
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.one(2);
	 * //-1
	 *
	 * @function one
	 * @memberof Math
	 **/
	function Math_one(num) {
		return (oldRound(num) % 2) * 2 - 1;
	}

	/**
	 *
	 * Flip sign of num
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.flip(2);
	 * //-2
	 *
	 * @function flip
	 * @memberof Math
	 **/
	function Math_flip(num) {
		return num - num * 2;
		//x = ~x + 1
	}

	/**
	 *
	 * Check if number is within range
	 *
	 * @param {number} num
	 * @param {number} min
	 * @param {number} max
	 * @param {boolean=} equalMin - Change to true if you want to compare `min == num`
	 * @param {boolean=} equalMax -	Change to true if you want to compare `num == max`
	 * @param {number=} [accuracy=1] - Accuracy, or epsilon
	 * @return {boolean}
	 *
	 * @example
	 * Math.range(1, 0, 2);
	 * //true
	 *
	 * @function range
	 * @memberof Math
	 **/
	function Math_range(num, min, max, equalMin, equalMax, accuracy) {
		accuracy = _helper0(accuracy, 1);
		if (equalMin && equalMax) {
			return num >= (min * accuracy) && num <= (max * accuracy);
		} else if (equalMin) {
			return num >= (min * accuracy) && num < (max * accuracy);
		} else if (equalMax) {
			return num > (min * accuracy) && num <= (max * accuracy);
		} else {
			return num > (min * accuracy) && num < (max * accuracy);
		}
	}

	/**
	 *
	 * Compare two numbers
	 *
	 * @param {number} num1
	 * @param {number} num2
	 * @param {boolean=} equal - Change to true if you want to compare `num1 == num2`
	 * @param {boolean=} reverse -	Change to true if you want to compare `num1 > num2`
	 * @param {number=} [accuracy=1] - Accuracy, or epsilon
	 * @return {boolean}
	 *
	 * @example
	 * Math.compare(0, 1);
	 * //false
	 *
	 * @function compare
	 * @memberof Math
	 **/
	function Math_compare(num1, num2, equal, reverse, accuracy) {
		accuracy = _helper0(accuracy, 1);
		if (reverse) {
			if (equal) {
				return num1 <= (num2 * accuracy);
			} else {
				return num1 < (num2 * accuracy);
			}
		} else {
			if (equal) {
				return num1 >= (num2 * accuracy);
			} else {
				return num1 > (num2 * accuracy);
			}
		}
	}

	/**
	 *
	 * Clamp number within range
	 *
	 * @param {number} num
	 * @param {number} min
	 * @param {number} max
	 * @return {number}
	 *
	 * @example
	 * Math.clamp(0, 1, 2);
	 * //1
	 *
	 * @function clamp
	 * @memberof Math
	 **/
	function Math_clamp(num, min, max) {
		if (num < min) {
			return min;
		}
		if (num > max) {
			return max;
		}
		return num;
	}

	/**
	 *
	 * Wrap number within range
	 *
	 * @param {number} num
	 * @param {number} min
	 * @param {number} max
	 * @return {number}
	 *
	 * @example
	 * Math.wrap(12, 0, 10);
	 * //2
	 *
	 * @function wrap
	 * @memberof Math
	 **/
	function Math_wrap(num, min, max) {
		let range = max - min;
		let result = (num - min) % range;
		if (result < 0) {
			result += range;
		}
		return result + min;
	}

	/**
	 *
	 * Move back and front within range
	 *
	 * @param {number} num
	 * @param {number} min
	 * @param {number} max
	 * @return {number}
	 *
	 * @example
	 * Math.bounce(-1, 0, 10);
	 * //1
	 *
	 * @function bounce
	 * @memberof Math
	 **/
	function Math_bounce(num, min, max) {
		num -= min;
		max -= min;
		let max2 = max * 2,
			result = num % max2;
		if (result < 0) {
			result += max2;
		}
		if (result > max) {
			result = max2 - result;
		}
		return result + min;
	}

	/**
	 *
	 * Not sure, but definitely useful and may act as same as bounce, wrap,...
	 *
	 * @param {number} num1
	 * @param {number} num2
	 * @param {number} num3
	 * @return {number}
	 *
	 * @example
	 * Math.approach(-1, 0, 5);
	 * //0
	 *
	 * @function approach
	 * @memberof Math
	 **/
	function Math_approach(num1, num2, num3) {
		//v,t,d
		if (num1 < num2) {
			num1 += num3;
			if (num1 > num2) return num2;
		} else if (num1 > num2) {
			num1 -= num3;
			if (num1 < num2) return num2;
		}
		return num1;
	}

	/**
	 *
	 * Map number from a range to another range
	 *
	 * @param {number} num
	 * @param {number} min1 - Current minimum
	 * @param {number} max1 - Current maximum
	 * @param {number} min2 - Target minimum
	 * @param {number} max2 - Target maximun
	 * @return {number}
	 *
	 * @example
	 * Math.map(0.1, 0, 1, 0, 100);
	 * //10
	 *
	 * @function map
	 * @memberof Math
	 **/
	function Math_map(num, min1, max1, min2, max2) {
		return (max1 - num) * (max2 - min2) / (min1 - max1) + max2;
	}

	/**
	 *
	 * Normalize number from specific range to 0-1
	 *
	 * @param {number} num
	 * @param {number} min
	 * @param {number} max
	 * @return {number}
	 *
	 * @example
	 * Math.norm(10, 0, 100);
	 * //0.1
	 *
	 * @function norm
	 * @memberof Math
	 **/
	function Math_norm(num, min, max) {
		return (num - min) / (max - min);
	}

	/**
	 *
	 * Normalize number from 0-1 to specific range
	 *
	 * @param {number} num
	 * @param {number} min
	 * @param {number} max
	 * @return {number}
	 *
	 * @example
	 * Math.lerp(0.1, 0, 100);
	 * //10
	 *
	 * @function lerp
	 * @memberof Math
	 **/
	function Math_lerp(num, min, max) {
		return num * (max - min) + min;
	}

	/**
	 *
	 * Change linear
	 *
	 * @param {number} num
	 * @param {number} min
	 * @param {number} change
	 * @param {number} duration
	 * @return {number}
	 *
	 * @example
	 * Math.change(0, 50, 150, 1);
	 * //50
	 *
	 * @function change
	 * @memberof Math
	 **/
	function Math_change(num, min, change, duration) {
		return change * num / duration + min;
	}

	/**
	 *
	 * Calculate [greatest common divisor]{@link https://en.wikipedia.org/wiki/Greatest_common_divisor}
	 *
	 * No limit of parameter, but all of them must be number, except final one maybe array if you want to pass return data to that array
	 *
	 * @return {number[]}
	 *
	 * @example
	 * Math.gcd(9, 6);
	 * //[3, 1, -1]
	 *
	 * @function gcd
	 * @memberof Math
	 **/
	function Math_gcd() {
		_helper1();
		let returnData = _helper0(arguments[arguments.length - 1], []);
		if (0 === arguments.length - 1) {
			return NaN;
		}
		_memory_1_[0] = arguments[0];
		let temp = arguments.length - (typeof arguments[arguments.length - 1] === "object" ? 1 : 0);
		for (let r = 1; r < temp; r++) {
			_helper6(_memory_1_[0], arguments[r]);
		}
		return returnData.concat(_memory_1_);
	}

	/**
	 *
	 * Calculate [least common multiple]{@link https://en.wikipedia.org/wiki/Least_common_multiple}
	 *
	 * No limit of parameter, but all of them must be number
	 *
	 * @return {number}
	 *
	 * @example
	 * Math.lcm(9, 6);
	 * //18
	 *
	 * @function lcm
	 * @memberof Math
	 **/
	function Math_lcm() {
		_helper1();
		if (0 === arguments.length) {
			return NaN;
		}
		let t = arguments[0];
		_memory_1_[0] = t;
		for (let r = 1; r < arguments.length; r++) {
			_helper6(t, arguments[r]);
			t = (t * arguments[r]) / _memory_1_[0];
		}
		return t;
	}

	/**
	 *
	 * Calculate prime factor of a number
	 *
	 * @param {number} num
	 * @param {array=} returnData - Array to put data
	 * @return {number[]}
	 *
	 * @example
	 * Math.factor(9);
	 * //[3, 3]
	 *
	 * @function factor
	 * @memberof Math
	 **/
	function Math_factor(num, returnData) {
		let factors = _helper0(returnData, []), i;
		for (i = 2; i <= num; i++) {
			while ((num % i) === 0) {
				factors.push(i);
				num /= i;
			}
		}
		return factors;
	}

	/**
	 *
	 * Calculate divisor of a number
	 *
	 * @param {number} num
	 * @param {array=} returnData - Array to put data
	 * @return {number[]} Unsorted array
	 *
	 * @example
	 * Math.divisor(9);
	 * //[1, 9, 3]
	 *
	 * @function divisor
	 * @memberof Math
	 **/
	function Math_divisor(num, returnData) {
		let isEven = Number_isEven(num);
		let inc = isEven ? 1 : 2,
			factors = _helper0(returnData, []),
			compliment;
		factors[0] = 1;
		factors[1] = num;
		for (let curFactor = isEven ? 2 : 3; oldPow(curFactor, 2) <= num; curFactor += inc) {
			if (num % curFactor !== 0) continue;
			factors.push(curFactor);
			compliment = num / curFactor;
			if (compliment !== curFactor) factors.push(compliment);
		}
		return factors;
	}

	//Random
	/**
	 *
	 * Pseudo random number generator uniformly distributed with options
	 *
	 * @param {number=} [min=0] - Minimum
	 * @param {number=} [max=1] - Maximum
	 * @param {boolean=} round - `true` if generate integer
	 * @param {number|number[]} [seed=undefined] - Put seed to generate number here (if array then maximum length is 5), every number must be int32
	 * @param {number=} larger - return this number if `min > max`
	 * @param {number=} equal - return this number if `min == max`
	 *
	 * @return {number}
	 *
	 * @example
	 * Math.random(0, 1);
	 * //Any number within 0, 1, not rounded
	 *
	 * @function random
	 * @memberof Math
	 **/
	function Math_random(min, max, round, seed, larger, equal) {
		let returnValue;
		if (seed) {
			_helper1();
			if (typeof seed === "number") {
				_memory_1_[0] = seed;
			} else {
				_memory_1_[0] = _helper0(seed[0], 0);
			}
			_memory_1_[1] = _helper0(seed[1], 0);
			_memory_1_[2] = _helper0(seed[2], 0);
			_memory_1_[3] = _helper0(seed[3], 0);
			_memory_1_[4] = _helper0(seed[4], 0);
			_helper7();
			returnValue = _helper8(_memory_1_[5], _memory_1_[6], _memory_1_[4]);
		} else {
			returnValue = oldRandom();
		}
		min = _helper0(min, 0);
		max = _helper0(max, 1);
		if (min > max) {
			if (larger == null) {
				returnValue = 0;
			} else {
				returnValue = larger;
			}
			return returnValue;
		} else if (min === max) {
			if (equal == null) {
				returnValue = min;
			} else {
				returnValue = equal;
			}
			return returnValue;
		}
		if (round) {
			min = oldCeil(min);
			max = oldFloor(max);
			returnValue = oldFloor(returnValue * (max - min + 1)) + min;
		} else {
			returnValue = returnValue * (max - min) + min;
		}
		return returnValue;
	}

	/**
	 *
	 * Returns a [Triangular distributed]{@link https://en.wikipedia.org/wiki/Triangular_distribution} random number,
	 * where values around `offset` are more likely.
	 *
	 * @param {number} min - Minimum
	 * @param {number} max - Maximum
	 * @param {number=} [offset=0] - Offset
	 * @param {number|number[]} [seed=undefined] - same as `Math.random`
	 *
	 * @return {number}
	 *
	 * @example
	 * Math.randomTri(0, 1);
	 * //Any number within 0, 1, not rounded
	 *
	 * @function randomTri
	 * @memberof Math
	 **/
	function Math_randomTri(min, max, offset, seed) {
		offset = _helper0(offset, 0);
		let u = Math_random(0, 1, false, seed),
			d = max - min;
		if (u <= (offset - min) / d) return min + Math.sqrt(u * d * (offset - min));
		return max - Math.sqrt((1 - u) * d * (max - offset));
	}

	/**
	 *
	 * Returns a Circular distributed random number.
	 *
	 * @param {number} min1 - Minimum generate range, `-1 <= min <= 1`
	 * @param {number} max1 - Maximum generate range, `-1 <= max <= 1`
	 * @param {number} min2 - Minimum result range
	 * @param {number} max2 - Maximum result range
	 * @param {number|number[]} [seed=undefined] - same as `Math.random`
	 *
	 * @return {number}
	 *
	 * @example
	 * Math.randomCirc(-1, 1, 0, 1);
	 * //Any number within 0, 1, not rounded
	 *
	 * @function randomCirc
	 * @memberof Math
	 **/
	function Math_randomCirc(min1, max1, min2, max2, seed) {
		let temp = Math_random(min1, max1, false, seed),
			range = max2 - min2;
		range *= range;
		return Math.sqrt(range - range * temp * temp) + min2;
	}

	/**
	 *
	 * Simplex noise
	 *
	 * @param {number[]} seed - array of numbers, must have length = 512, every number must be between 0 <= x <= 11,...
	 * @param {number} x
	 * @param {number} y
	 * @param {number=} z - if number, turn to 3D simplex noise, else 2D simplex
	 *
	 * @return {number}
	 *
	 * @example
	 * let arraySeed = [];
	 * for (let i = 0; i < 512; i ++) {
	 *arraySeed.push(11);
	 * }
	 * Math.noise(arraySeed, 100, 100);
	 * //-0.4099981169018467
	 *
	 * @function noise
	 * @memberof Math
	 **/
	let Math_noise = (function() {
		let tempI, tempI2, tempI3, tempJ, tempJ2, tempJ3, tempK, tempK2, tempK3, tempX, tempY, tempZ, tempX2, tempY2, tempZ2, tempG, tempM, sum;
		function _helperNoise(seed, i, j, k, a) {
			if (a) {
				tempX2 = tempX - i + a * _noise_6_;
				tempY2 = tempY - j + a * _noise_6_;
				tempZ2 = tempZ - k + a * _noise_6_;
			} else {
				tempX2 = tempX;
				tempY2 = tempY;
				tempZ2 = tempZ;
			}
			tempM = 0.6 - tempX2 * tempX2 - tempY2 * tempY2 - tempZ2 * tempZ2;
			tempG = seed[tempI + i + seed[tempJ + j + seed[tempK + k]]];
			_helperNoise3();
		}
		function _helperNoise2(seed, i, j, a) {
			if (a) {
				tempX2 = tempX - i + a * _noise_5_;
				tempY2 = tempY - j + a * _noise_5_;
			} else {
				tempX2 = tempX;
				tempY2 = tempY;
			}
			tempM = 0.5 - tempX2 * tempX2 - tempY2 * tempY2;
			tempG = seed[tempI + i + seed[tempJ + j]];
			_helperNoise3();
		}
		function _helperNoise3() {
			if (tempM >= 0) {
				tempM *= tempM;
				sum += tempM * tempM * Math_dotVec(_noise_1_[tempG][0], _noise_1_[tempG][1], tempX2, tempY2);
			}
		}
		return function(seed, x, y, z) {
			sum = 0;
			if (typeof z === "number") {
				tempM = (x + y + z) * _helper9_1_;
				tempI = oldFloor(x + tempM);
				tempJ = oldFloor(y + tempM);
				tempK = oldFloor(z + tempM);
				tempM = (tempI + tempJ + tempK) * _noise_6_;
				tempX = x - (tempI - tempM);
				tempY = y - (tempJ - tempM);
				tempZ = z - (tempK - tempM);
				if (tempX >= tempY) {
					if (tempY >= tempZ) {
						tempI2 = 1;
						tempJ2 = 0;
						tempK2 = 0;
						tempI3 = 1;
						tempJ3 = 1;
						tempK3 = 0;
					} else if (tempX >= tempZ) {
						tempI2 = 1;
						tempJ2 = 0;
						tempK2 = 0;
						tempI3 = 1;
						tempJ3 = 0;
						tempK3 = 1;
					} else {
						tempI2 = 0;
						tempJ2 = 0;
						tempK2 = 1;
						tempI3 = 1;
						tempJ3 = 0;
						tempK3 = 1;
					}
				} else {
					if (tempY < tempZ) {
						tempI2 = 0;
						tempJ2 = 0;
						tempK2 = 1;
						tempI3 = 0;
						tempJ3 = 1;
						tempK3 = 1;
					} else if (tempX < tempZ) {
						tempI2 = 0;
						tempJ2 = 1;
						tempK2 = 0;
						tempI3 = 0;
						tempJ3 = 1;
						tempK3 = 1;
					} else {
						tempI2 = 0;
						tempJ2 = 1;
						tempK2 = 0;
						tempI3 = 1;
						tempJ3 = 1;
						tempK3 = 0;
					}
				}
				tempI &= 255;
				tempJ &= 255;
				tempK &= 255;
				_helperNoise(seed, 0, 0, 0);
				_helperNoise(seed, tempI2, tempJ2, tempK2, 1);
				_helperNoise(seed, tempI3, tempJ3, tempK3, 2);
				_helperNoise(seed, 1, 1, 1, 3);
				return 32.0 * sum;
			}
			tempI2 = (x + y) * _noise_4_;
			tempI = oldFloor(x + tempI2);
			tempJ = oldFloor(y + tempI2);
			tempJ2 = (tempI + tempJ) * _noise_5_;
			tempX = x - (tempI - tempJ2);
			tempY = y - (tempJ - tempJ2);
			if (tempX > tempY) {
				tempI2 = 1;
				tempJ2 = 0;
			} else {
				tempI2 = 0;
				tempJ2 = 1;
			}
			tempI &= 255;
			tempJ &= 255;
			_helperNoise2(seed, 0, 0);
			_helperNoise2(seed, tempI2, tempJ2, 1);
			_helperNoise2(seed, 1, 1, 2);
			return 70.0 * sum;
		};
	})();

	/**
	 *
	 * All of functions that related to 2D Geometry
	 *
	 * @namespace Geometry
	 *
	 **/

	/**
	 *
	 * Normalize angle in radians
	 *
	 * @param {number} num - The angle needs to normalize
	 * @return {number}
	 *
	 * @example
	 * Geometry.normRad(Math_TAU);
	 * //0
	 *
	 * @function normRad
	 * @memberof Geometry
	 **/
	function Geometry_normRad(num) {
		num = Geometry_fullRad(num);
		if (num > Math.PI) {
			num -= Math_TAU;
		}
		return num;
	}

	/**
	 *
	 * Convert degrees to radians
	 *
	 * @param {number} num - The angle needs to convert
	 * @return {number} Angle in radians
	 *
	 * @example
	 * Geometry.toRad(90);
	 * //1.5707963267948966
	 *
	 * @function toRad
	 * @memberof Geometry
	 **/
	function Geometry_toRad(num) {
		return num * _toRad_1_;
	}

	/**
	 *
	 * Wrap angle within 0 to TAU in radians
	 *
	 * @param {number} num - The angle needs to wrap
	 * @return {number}
	 *
	 * @example
	 * Geometry.fullRad(-Math.PI);
	 * //3.141592653589793
	 *
	 * @function fullRad
	 * @memberof Geometry
	 **/
	function Geometry_fullRad(num) {
		return Math_mod(num, Math_TAU);
	}

	/**
	 *
	 * Normalize angle in degrees
	 *
	 * @param {number} num - The angle needs to normalize
	 * @return {number}
	 *
	 * @example
	 * Geometry.normDeg(720);
	 * //0
	 *
	 * @function normDeg
	 * @memberof Geometry
	 **/
	function Geometry_normDeg(num) {
		num = Geometry_fullDeg(num);
		if (num > 180) {
			num -= 360;
		}
		return num;
	}

	/**
	 *
	 * Convert radians to degrees
	 *
	 * @param {number} num - The angle needs to convert
	 * @return {number} Angle in degrees
	 *
	 * @example
	 * Geometry.toRad(Math.PI);
	 * //180
	 *
	 * @function toDeg
	 * @memberof Geometry
	 **/
	function Geometry_toDeg(num) {
		return num * _toDeg_1_;
	}

	/**
	 *
	 * Wrap angle within 0 to 360 in degrees
	 *
	 * @param {number} num - The angle needs to wrap
	 * @return {number}
	 *
	 * @example
	 * Geometry.fullDeg(-90);
	 * //270
	 *
	 * @function fullDeg
	 * @memberof Geometry
	 **/
	function Geometry_fullDeg(num) {
		return Math_mod(num, 360);
	}

	/**
	 * Find angle given the sine and cosine of that angle
	 *
	 * @param {number} cos
	 * @param {number} sin
	 * @returns {number}
	 *
	 * @example
	 * Geometry.cssnAngle(-1, 0);
	 * //3.141592653589793
	 *
	 * @function cssnAngle
	 * @memberof Geometry
	 */
	function Geometry_cssnAngle(cos, sin) {
		let angle = (1 + Math.acos(cos) / Math_TAU) * Math_TAU;
		if (sin < 0) {
			angle = Math_TAU - angle;
		}
		return Math_mod(angle, Math_TAU);
	}

	/**
	 * Scale angle
	 *
	 * @param {number} time - Scale percent
	 * @param {number} num1 - angle in radians
	 * @param {number} num2 - angle in radians
	 * @param {number} dir - if `1` then clockwise, `-1` is counter-clockwise
	 * @returns {number}
	 *
	 * @example
	 * Geometry.scaleAngle(-1, 0);
	 * //3.141592653589793
	 *
	 * @function scaleAngle
	 * @memberof Geometry
	 */
	function Geometry_scaleAngle(scale, num1, num2, dir) {
		num1 = Math_mod(num1, Math_TAU);
		num2 = Math_mod(num2, Math_TAU)
		if (num1 === num2) return num1;
		if (!dir) {
			dir =- Math_TAU;
		} else if ((dir === 1) === (num1 < num2)) {
			dir *= Math_TAU;
		} else {
			dir = 0;
		}
		return Math_mod(num1 + scale * (num2 - num1 - dir), Math_TAU);
	}

	/**
	 *
	 * Get angle from two points
	 *
	 * @param {number} a_x - x position of first point
	 * @param {number} a_y - y position of first point
	 * @param {number} b_x - x position of second point
	 * @param {number} b_y - y position of second point
	 * @return {number} Angle in radians
	 *
	 * @example
	 * Geometry.getAngle(0, 0, 0, 1);
	 * //1.5707963267948966
	 *
	 * @function getAngle
	 * @memberof Geometry
	 **/
	function Geometry_getAngle(a_x, a_y, b_x, b_y) {
		return Math.atan2(b_y - a_y, b_x - a_x);
	}

	/**
	 *
	 * Get reflection angle from mirror angle
	 *
	 * @param {number} num - current angle in radians
	 * @param {number} mirror - mirror angle in radians
	 * @return {number} Angle in radians
	 *
	 * @example
	 * Geometry.relfAngle(Math.PI, Math.PI / 4);
	 * //-1.5707963267948966
	 *
	 * @function relfAngle
	 * @memberof Geometry
	 **/
	function Geometry_relfAngle(num, mirror) {
		return 2 * mirror - num;
	}

	/**
	 *
	 * Get different angle between two angles
	 *
	 * @param {number} num1 - angle in radians
	 * @param {number} num2 - angle in radians
	 * @return {number} Angle in radians
	 *
	 * @example
	 * Geometry.diffAngle(Math.PI / 4, Math.PI);
	 * //-2.356194490192344
	 *
	 * @function diffAngle
	 * @memberof Geometry
	 **/
	function Geometry_diffAngle(num1, num2) {
		num1 = Geometry_normRad(num1 - num2);
		return num1 > Math.PI ? (Math_TAU - num1) : num1;
	}

	/**
	 *
	 * Check if angle is between two angles
	 *
	 * @param {number} num - angle in radians
	 * @param {number} min - angle in radians
	 * @param {number} max - angle in radians
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.isBetwAngle(Math_HALF_PI, 0, Math.PI);
	 * //true
	 *
	 * @function isBetwAngle
	 * @memberof Geometry
	 **/
	function Geometry_isBetwAngle(num, min, max) {
		num = Geometry_fullRad(num);
		min = Geometry_fullRad(min);
		max = Geometry_fullRad(max);
		if (Geometry_fullRad(max - min) >= Math.PI) {
			let swap = min;
			min = max;
			max = swap;
		}
		if (min <= max) {
			return num >= min && num <= max;
		}
		return num >= min || num <= max;
	}

	/**
	 *
	 * Check if an angle from two points is in an angle range
	 *
	 * @param {number} o_1 - angle in radians
	 * @param {number} o_2 - angle in radians
	 * @param {number} o_x - x position of vertex point
	 * @param {number} o_y - y position of vertex point
	 * @param {number} a_x - x position of point want to check
	 * @param {number} a_y - y position of point want to check
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliAnglePnt(0, Math.PI, 0, 0, 0, 1);
	 * //true
	 *
	 * @function colliAnglePnt
	 * @memberof Geometry
	 **/
	function Geometry_colliAnglePnt(o_1, o_2, o_x, o_y, a_x, a_y) {
		return Geometry_isBetwAngle(Geometry_getAngle(o_x, o_y, a_x, a_y), o_1, o_2);
	}

	//Point
	/**
	 *
	 * Calculate distance of two points
	 *
	 * @param {number} a_x - x position of first point
	 * @param {number} a_y - y position of first point
	 * @param {number} b_x - x position of second point
	 * @param {number} b_y - y position of second point
	 * @param {boolean=} [square=false] - `false` if you want squared distance
	 * @return {number}
	 *
	 * @example
	 * Geometry.distPnt(0, 0, 0, 1, true);
	 * //1
	 *
	 * @function distPnt
	 * @memberof Geometry
	 **/
	function Geometry_distPnt(a_x, a_y, b_x, b_y, square) {
		let result, temp1 = a_x - b_x,
			temp2 = a_y - b_y;
		result = temp1 * temp1 + temp2 * temp2;
		if (square) {
			result = Math.sqrt(result);
		}
		return result;
	}

	/**
	 *
	 * Calculate distance of two points using polar coordinate
	 *
	 * @param {number} r_1 - radial of first point
	 * @param {number} a_1 - angle of first point in radians
	 * @param {number} r_2 - radial of second point
	 * @param {number} a_2 - angle of second point in radians
	 * @param {boolean=} [square=false] - `false` if you want squared distance
	 * @return {number}
	 *
	 * @example
	 * Geometry.polarDistPnt(0, 0, 1, Math_HALF_PI, true);
	 * //1
	 *
	 * @function polarDistPnt
	 * @memberof Geometry
	 **/
	function Geometry_polarDistPnt(r_1, a_1, r_2, a_2, square) {
		let temp = r_1 * r_1 + r_2 * r_2 - 2 * r_1 * r_2 * Math.cos(a_2 - a_1);
		if (square) {
			temp = Math.sqrt(temp);
		}
		return temp;
	}

	/**
	 *
	 * Calculate [Manhattan distance]{@link https://en.wikipedia.org/wiki/Taxicab_geometry} of two points
	 *
	 * @param {number} a_x - x position of first point
	 * @param {number} a_y - y position of first point
	 * @param {number} b_x - x position of second point
	 * @param {number} b_y - y position of second point
	 * @return {number}
	 *
	 * @example
	 * Geometry.manDistPnt(0, 0, 0, 1);
	 * //1
	 *
	 * @function manDistPnt
	 * @memberof Geometry
	 **/
	function Geometry_manDistPnt(a_x, a_y, b_x, b_y) {
		return Math.abs(a_x - b_x) + Math.abs(a_y - b_y);
	}

	/**
	 *
	 * Calculate [Chebyshev distance]{@link https://en.wikipedia.org/wiki/Chebyshev_distance} of two points
	 *
	 * @param {number} a_x - x position of first point
	 * @param {number} a_y - y position of first point
	 * @param {number} b_x - x position of second point
	 * @param {number} b_y - y position of second point
	 * @return {number}
	 *
	 * @example
	 * Geometry.chevDistPnt(0, 0, 0, 1);
	 * //1
	 *
	 * @function chevDistPnt
	 * @memberof Geometry
	 **/
	function Geometry_chevDistPnt(a_x, a_y, b_x, b_y) {
		return Math.max(Math.abs(a_x - b_x), Math.abs(a_y - b_y));
	}

	/**
	 *
	 * Rotate a point from center point
	 *
	 * Recommended to set `x_x` and `x_y` to same value
	 *
	 * @param {number} a_x - x position of anchor point
	 * @param {number} a_y - y position of anchor point
	 * @param {number} b_x - x position of current point
	 * @param {number} b_y - y position of current point
	 * @param {number} x_x - x angle in radians to rotate
	 * @param {number} x_y - y angle in radians to rotate
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Geometry.rotPnt(0, 0, 0, 1, Math_HALF_PI, Math_HALF_PI);
	 * //{x: -1, y: 6.123233995736766e-17}
	 *
	 * @function rotPnt
	 * @memberof Geometry
	 **/
	function Geometry_rotPnt(a_x, a_y, b_x, b_y, x_x, x_y, returnData) {
		let s = Math.sin(x_y),
			c = Math.cos(x_x);
		b_x -= a_x;
		b_y -= a_y;
		returnData = _helper0(returnData, "_o_");
		returnData.x = b_x * c - b_y * s + a_x;
		returnData.y = b_x * s + b_y * c + a_y;
		return returnData;
	}

	/**
	 *
	 * Get angle from three points
	 *
	 * @param {number} a_x - x position of first point
	 * @param {number} a_y - y position of first point
	 * @param {number} b_x - x position of second point
	 * @param {number} b_y - y position of second point
	 * @param {number} o_x - x position of vertex point
	 * @param {number} o_y - y position of vertex point
	 * @return {number} Angle in radians
	 *
	 * @example
	 * Geometry.anglePnt(1, 0, 0, 1, 0, 0);
	 * //1.5707963267948966
	 *
	 * @function anglePnt
	 * @memberof Geometry
	 **/
	function Geometry_anglePnt(a_x, a_y, b_x, b_y, o_x, o_y) {
		let temp1 = a_x - o_x,
			temp2 = a_y - o_y,
			temp3 = b_x - o_x,
			temp4 = b_y - o_y;
		return Math.acos(Math_dotVec(temp1, temp2, temp3, temp4) / Math.sqrt((temp1 * temp1 + temp2 * temp2) * (temp3 * temp3 + temp4 * temp4)));
	}

	/**
	 *
	 * Get center of circles from two points and radius
	 *
	 * @param {number} a_x - x position of first point
	 * @param {number} a_y - y position of first point
	 * @param {number} b_x - x position of second point
	 * @param {number} b_y - y position of second point
	 * @param {object=} returnData - Object to put data
	 * @param {number} r - circle radius
	 * @return {{x1: number, y1: number, x2: number, y2: number}} Return two center points (both point will be NaN if there is no possible center)
	 *
	 * @example
	 * Geometry.cntrPnt(1, 0, -1, 0, 2);
	 * //{x1: 0, y1: -1.7320508075688772, x2: 0, y2: 1.7320508075688772}
	 *
	 * @function cntrPnt
	 * @memberof Geometry
	 **/
	function Geometry_cntrPnt(a_x, a_y, b_x, b_y, r, returnData) {
		let p, q, c_x, c_y, dataOne, dataTwo, pq;
		q = Geometry_distPnt(b_x, b_y, a_x, a_y, true);
		c_x = (a_x + b_x) / 2;
		c_y = (a_y + b_y) / 2;
		p = Math.sqrt(r * r - oldPow(q / 2, 2));
		pq = p / q;
		dataOne = (a_y - b_y) * pq;
		dataTwo = (b_x - a_x) * pq;
		returnData = _helper0(returnData, "_o_");
		returnData.x1 = c_x + dataOne;
		returnData.y1 = c_y + dataTwo;
		returnData.x2 = c_x - dataOne;
		returnData.y2 = c_y - dataTwo;
		return returnData;
	}

	/**
	 *
	 * Compare two points and return 1, 0 or -1
	 *
	 * @param {number} a_x - x position of first point
	 * @param {number} a_y - y position of first point
	 * @param {number} b_x - x position of second point
	 * @param {number} b_y - y position of second point
	 * @param {number=} [accuracy=1e-10] - Accuracy
	 * @return {number}
	 *
	 * @example
	 * Geometry.cmpPnt(1, 0, -1, 0);
	 * //1
	 *
	 * @function cmpPnt
	 * @memberof Geometry
	 **/
	function Geometry_cmpPnt(a_x, a_y, b_x, b_y, accuracy) {
		accuracy = _helper0(accuracy, 1e-10);
		if (Math.abs(a_x - b_x) > accuracy) return a_x > b_x ? 1 : -1;
		if (Math.abs(a_y - b_y) > accuracy) return a_y > b_y ? 1 : -1;
		return 0;
	}

	//Line
	/**
	 *
	 * Calculate slope of a line segment
	 *
	 * @param {number} a_x - x position of first point of the segment
	 * @param {number} a_y - y position of first point of the segment
	 * @param {number} b_x - x position of second point of the segment
	 * @param {number} b_y - y position of second point of the segment
	 * @return {number}
	 *
	 * @example
	 * Geometry.slopeLine(0, 0, 1, 1);
	 * //1
	 *
	 * @function slopeLine
	 * @memberof Geometry
	 **/
	function Geometry_slopeLine(a_x, a_y, b_x, b_y) {
		return (b_y - a_y) / (b_x - a_x);
	}

	/**
	 *
	 * Convert to standard form of a line segment where `ax + by + c = 0`
	 *
	 * @param {number} a_x - x position of first point of the segment
	 * @param {number} a_y - y position of first point of the segment
	 * @param {number} b_x - x position of second point of the segment
	 * @param {number} b_y - y position of second point of the segment
	 * @param {object=} returnData - Object to put data
	 * @return {{a: number, b: number, c: number}}
	 *
	 * @example
	 * Geometry.stdLine(0, 0, 1, 1);
	 * //{a: 1, b: -1, c: 0}
	 *
	 * @function stdLine
	 * @memberof Geometry
	 **/
	function Geometry_stdLine(a_x, a_y, b_x, b_y, returnData) {
		let result = _helper0(returnData, "_o_");
		if (b_x - a_x === 0) {
			result.a = -1;
			result.b = 0;
			result.c = a_x;
		} else {
			let temp = Geometry_slopeLine(a_x, a_y, b_x, b_y);
			result.a = temp;
			result.b = -1;
			result.c = -b_x * temp + b_y;
		}
		return result;
	}

	/**
	 *
	 * Calculate distance from a line to a point with different modes
	 *
	 * @param {boolean} type - `true` if calculate perpendicular distance
	 * @param {number} a_x - x position of first point of the segment
	 * @param {number} a_y - y position of first point of the segment
	 * @param {number} b_x - x position of second point of the segment
	 * @param {number} b_y - y position of second point of the segment
	 * @param {number} x_x - x position of the point
	 * @param {number} x_y - y position of the point
	 * @param {boolean=} [square=false] - `false` if you want distance squared
	 * @return {number}
	 *
	 * @example
	 * Geometry.distLinePnt(false, 0, 0, 1, 1, 2, 0, true);
	 * //1.4142135623730951
	 *
	 * @function distLinePnt
	 * @memberof Geometry
	 **/
	function Geometry_distLinePnt(type, a_x, a_y, b_x, b_y, x_x, x_y, square) {
		if (type) {
			return Math.abs((b_y - a_y) * x_x - (b_x - a_x) * x_y + b_x * a_y - b_y * a_x) / Geometry_distPnt(a_x, a_y, b_x, b_y, true);
		} else {
			let l2 = Geometry_distPnt(a_x, a_y, b_x, b_y, false);
			if (l2 === 0) {
				return Geometry_distPnt(x_x, x_y, a_x, a_y, square); //maybe false?
			}
			let t = Math_dotVec(x_x - a_x, x_y - a_y, b_x - a_x, b_y - a_y) / l2;
			t = Math.max(0, Math.min(1, t));
			return Geometry_distPnt(x_x, x_y, a_x + t * (b_x - a_x), a_y + t * (b_y - a_y), square);
		}
	}

	/**
	 *
	 * Calculate distance from a line to another line with different modes
	 *
	 * @param {boolean} type - `true` if calculate perpendicular distance
	 * @param {number} a_x - x position of first point of the first segment
	 * @param {number} a_y - y position of first point of the first segment
	 * @param {number} b_x - x position of second point of the first segment
	 * @param {number} b_y - y position of second point of the first segment
	 * @param {number} c_x - x position of first point of the second segment
	 * @param {number} c_y - y position of first point of the second segment
	 * @param {number} d_x - x position of second point of the second segment
	 * @param {number} d_y - y position of second point of the second segment
	 * @param {boolean=} [square=false] - `false` if you want distance squared
	 * @return {number}
	 *
	 * @example
	 * Geometry.distLine(false, 0, 0, 1, 1, 2, 0, 2, 1, true);
	 * //1
	 *
	 * @function distLine
	 * @memberof Geometry
	 **/
	function Geometry_distLine(type, a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y, square) {
		let dist1 = Geometry_distLinePnt(type, c_x, c_y, d_x, d_y, a_x, a_y, square),
			dist2;
		if (dist1 > 0) {
			dist2 = Geometry_distLinePnt(type, c_x, c_y, d_x, d_y, b_x, b_y, square);
			if (dist1 < dist2) {
				return dist1;
			}
			return dist2;
		}
		return 0;
	}

	/**
	 *
	 * Find intersection of two lines
	 *
	 * @param {number} a_x - x position of first point of the first segment
	 * @param {number} a_y - y position of first point of the first segment
	 * @param {number} b_x - x position of second point of the first segment
	 * @param {number} b_y - y position of second point of the first segment
	 * @param {number} c_x - x position of first point of the second segment
	 * @param {number} c_y - y position of first point of the second segment
	 * @param {number} d_x - x position of second point of the second segment
	 * @param {number} d_y - y position of second point of the second segment
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, onLine1: boolean, onLine2: boolean}} returnData.onLine1 will true if intersection point is on line a_x a_y b_x b_y and otherwise
	 *
	 * @example
	 * Geometry.intrLine(0, 0, 1, 1, 1, 0, 1, -1);
	 * //{x: 1, y: 1, onLine1: true, onLine2: false}
	 *
	 * @function intrLine
	 * @memberof Geometry
	 **/
	function Geometry_intrLine(a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y, returnData) {
		let denominator, a, b, s1_x, s1_y, s2_x, s2_y, numerator1, numerator2, result = _helper0(returnData, "_o_");

		result.x = null;
		result.y = null;
		result.onLine1 = false;
		result.onLine2 = false;

		s1_x = b_x - a_x;
		s1_y = b_y - a_y;
		s2_x = d_x - c_x;
		s2_y = d_y - c_y;
		a = a_y - c_y;
		b = a_x - c_x;
		denominator = s2_y * s1_x - s2_x * s1_y;

		if (denominator === 0) {
			//Check if parallel and on same line
			if (
				Number.isNaN(Geometry_slopeLine(s2_x * s1_y, s1_x * a, s1_x * s2_y, s1_y * b)) &&
				Number.isNaN(Geometry_slopeLine(s1_x * s2_y, s2_y * b, s2_x * s1_y, s2_x * a))
			) {
				result.onLine1 = (Geometry_colliLinePnt(true, a_x, a_y, b_x, b_y, c_x, c_y) || Geometry_colliLinePnt(true, a_x, a_y, b_x, b_y, d_x, d_y));
				result.onLine2 = result.onLine1;
			}
			return result;
		}
		numerator1 = s2_x * a - s2_y * b;
		numerator2 = s1_x * a - s1_y * b;
		a = numerator1 / denominator;
		b = numerator2 / denominator;
		result.x = a_x + a * s1_x;
		result.y = a_y + a * s1_y;
		if (a >= 0 && a <= 1) {
			result.onLine1 = true;
		}
		if (b >= 0 && b <= 1) {
			result.onLine2 = true;
		}
		return result;
	}

	/**
	 *
	 * Find intersections of a circle and a line
	 *
	 * @param {number} a_x - x position of first point of the segment
	 * @param {number} a_y - y position of first point of the segment
	 * @param {number} b_x - x position of second point of the segment
	 * @param {number} b_y - y position of second point of the segment
	 * @param {number} o_x - x position of circle center
	 * @param {number} o_y - y position of circle center
	 * @param {number} radius - radius of circle center
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, x1: number, y1: number, x2: number, y2: number, onLine: boolean, onLine1: boolean, onLine2: boolean}}
	 *
	 * returnData.onLine will true if perpendicular intersection point is on line a_x a_y b_x b_y.
	 *
	 * returnData.onLine1 will true if returnData.x1 and returnData.y1 is on line segment, and so on...
	 *
	 * @example
	 * Geometry.intrLineCirc(-6, -2, -2, -2, 0, 0, 4);
	 * //{x: 0, y: -2, x1: -3.4641016151377544, y1: -2, x2: 3.4641016151377535, y2: -2, onLine: false, onLine1: true, onLine2: false}
	 *
	 * @function intrLineCirc
	 * @memberof Geometry
	 **/
	function Geometry_intrLineCirc(a_x, a_y, b_x, b_y, o_x, o_y, radius, returnData) {
		//xy is perpendicular intersection
		let dist1, dist2, d_x, d_y, t, dt;

		returnData = _helper0(returnData, "_o_");
		returnData.x = null;
		returnData.y = null;
		returnData.x1 = null;
		returnData.y1 = null;
		returnData.x2 = null;
		returnData.y2 = null;
		returnData.onLine = false;
		returnData.onLine1 = false;
		returnData.onLine2 = false;
		
		dist1 = Geometry_distPnt(a_x, a_y, b_x, b_y, true);
		d_x = (b_x - a_x) / dist1;
		d_y = (b_y - a_y) / dist1;
		t = d_x * (o_x - a_x) + d_y * (o_y - a_y);
		returnData.x = t * d_x + a_x;
		returnData.y = t * d_y + a_y;
		dist2 = Geometry_distPnt(returnData.x, returnData.y, o_x, o_y, true);
		if (dist2 < radius) {
			dt = Math.sqrt(radius * radius - dist2 * dist2);
			returnData.x1 = (t - dt) * d_x + a_x;
			returnData.y1 = (t - dt) * d_y + a_y;
			returnData.onLine1 = Geometry_colliLinePnt(true, a_x, a_y, b_x, b_y, returnData.x1, returnData.y1);
			returnData.x2 = (t + dt) * d_x + a_x;
			returnData.y2 = (t + dt) * d_y + a_y;
			returnData.onLine2 = Geometry_colliLinePnt(true, a_x, a_y, b_x, b_y, returnData.x2, returnData.y2);
		} else if (dist2 === radius) {
			//One intersection
			returnData.onLine = true;
		} else {
			//No intersection
			returnData.x = null;
			returnData.y = null;
		}
		return returnData;
	}

	/**
	 *
	 * Calculate cross product of a line with a point
	 *
	 * To check if point is left side of the line, check if returnData > 0
	 *
	 * To check if collinear, check if abs(returnData) < accuracy (0.00000001, 1e-10, ...)
	 *
	 * @param {number} a_x - x position of first point of the line segment
	 * @param {number} a_y - y position of first point of the line segment
	 * @param {number} b_x - x position of second point of the line segment
	 * @param {number} b_y - y position of second point of the line segment
	 * @param {number} o_x - x position of point
	 * @param {number} o_y - y position of point
	 * @return {number}
	 *
	 * @example
	 * Geometry.sideLine(0, 0, 1, 0, 1, 1);
	 * //1
	 *
	 * @function sideLine
	 * @memberof Geometry
	 **/
	function Geometry_sideLine(a_x, a_y, b_x, b_y, o_x, o_y) {
		return Math_crossVec(b_x - a_x, b_y - a_y, o_x - a_x, o_y - a_y);
	}

	/**
	 *
	 * Calculate location of a point on a line
	 *
	 * @param {number} a_x - x position of first point of the line segment
	 * @param {number} a_y - y position of first point of the line segment
	 * @param {number} b_x - x position of second point of the line segment
	 * @param {number} b_y - y position of second point of the line segment
	 * @param {number} scale - the location of the point on the line, 0 to 1, but can be larger or smaller than that range
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Geometry.onLine(0, 0, 2, 2, 0.5);
	 * //{x: 1, y: 1}
	 *
	 * @function onLine
	 * @memberof Geometry
	 **/
	function Geometry_onLine(a_x, a_y, b_x, b_y, scale, returnData) {
		let xlen = b_x - a_x,
			ylen = b_y - a_y;
		let smallerXLen = xlen * scale,
			smallerYLen = ylen * scale;

		returnData = _helper0(returnData, "_o_");
		returnData.x = a_x + smallerXLen;
		returnData.y = a_y + smallerYLen;
		return returnData;
	}

	/**
	 *
	 * Check if a point is on a line
	 *
	 * @param {boolean} type - true if two points is line segment
	 * @param {number} a_x - x position of first point of the line segment
	 * @param {number} a_y - y position of first point of the line segment
	 * @param {number} b_x - x position of second point of the line segment
	 * @param {number} b_y - y position of second point of the line segment
	 * @param {number} o_x - x position of point
	 * @param {number} o_y - y position of point
	 * @param {number=} [accuracy=1e-10] - Accuracy
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliLinePnt(true, 0, 0, 2, 0, 1, 0);
	 * //true
	 *
	 * @function colliLinePnt
	 * @memberof Geometry
	 **/
	function Geometry_colliLinePnt(type, a_x, a_y, b_x, b_y, o_x, o_y, accuracy) {
		accuracy = _helper0(accuracy, 1e-10);
		let v_x = a_x - o_x,
			v_y = a_y - o_y,
			w_x = o_x - b_x,
			w_y = o_y - b_y;
		let temp = Math_crossVec(v_x, v_y, w_x, w_y); //compare equal to 0
		return (temp >= -accuracy && temp <= accuracy && (Math_dotVec(v_x, v_y, w_x, w_y) >= 0 || !type));
	}

	/**
	 *
	 * Calculate x coordinate of a point on a line known y coordinate
	 *
	 * @param {number} a_x - x position of first point of the line segment
	 * @param {number} a_y - y position of first point of the line segment
	 * @param {number} b_x - x position of second point of the line segment
	 * @param {number} b_y - y position of second point of the line segment
	 * @param {number} num - y position of the point
	 * @return {number}
	 *
	 * @example
	 * Geometry.getXLine(0, 0, 2, 2, 1);
	 * //1
	 *
	 * @function getXLine
	 * @memberof Geometry
	 **/
	function Geometry_getXLine(a_x, a_y, b_x, b_y, num) {
		let a_numberator = b_y - a_y,
			a_denominator = b_x - a_x;
		if (a_numberator === 0) {
			return null; //b_x; //parallel
		} else {
			let a = a_numberator / a_denominator,
				yDist = num - b_y;
			let xDist = yDist / a;
			let x3 = b_x + xDist;
			return x3;
		}
	}

	/**
	 *
	 * Calculate y coordinate of a point on a line known x coordinate
	 *
	 * @param {number} a_x - x position of first point of the line segment
	 * @param {number} a_y - y position of first point of the line segment
	 * @param {number} b_x - x position of second point of the line segment
	 * @param {number} b_y - y position of second point of the line segment
	 * @param {number} num - x position of the point
	 * @return {number}
	 *
	 * @example
	 * Geometry.getYLine(0, 0, 2, 2, 1);
	 * //1
	 *
	 * @function getYLine
	 * @memberof Geometry
	 **/
	function Geometry_getYLine(a_x, a_y, b_x, b_y, num) {
		let a_numberator = b_y - a_y,
			a_denominator = b_x - a_x;
		if (a_denominator === 0) {
			return null; //b_y;
		} else {
			let a = a_numberator / a_denominator,
				xDist = num - b_x;
			let yDist = xDist * a;
			let y3 = b_y + yDist;
			return y3;
		}
	}

	/**
	 *
	 * Check if a ray collide a rectangle
	 *
	 * @param {number} a_x - x position of vertex point of the ray
	 * @param {number} a_y - y position of vertex point of the ray
	 * @param {number} b_x - x position of direction point of the ray
	 * @param {number} b_y - y position of direction point of the ray
	 * @param {number} x_min - x position of top-left corner
	 * @param {number} y_min - y position of top-left corner
	 * @param {number} x_max - x position of bottom-right corner
	 * @param {number} y_max - y position of bottom-right corner
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliRayRect(0, 0, 1, 1, 2, 3, 3, 2);
	 * //true
	 *
	 * @function colliRayRect
	 * @memberof Geometry
	 **/
	function Geometry_colliRayRect(a_x, a_y, b_x, b_y, x_min, y_min, x_max, y_max) {
		b_x = 1 / b_x;
		b_y = 1 / b_y;
		let t1 = (x_min - a_x) * b_x,
			t2 = (x_max - a_x) * b_x;

		let tmin = Math.min(t1, t2),
			tmax = Math.max(t1, t2);

		t1 = (y_min - a_y) * b_y;
		t2 = (y_max - a_y) * b_y;

		tmin = Math.max(tmin, Math.min(t1, t2));
		tmax = Math.min(tmax, Math.max(t1, t2));

		return tmax > Math.max(tmin, 0.0);
	}

	//Circle
	/**
	 *
	 * Check if a point is inside an arc
	 *
	 * @param {number} a_x - x position of point
	 * @param {number} a_y - y position of point
	 * @param {number} o_x - x position of vertex point
	 * @param {number} o_y - y position of vertex point
	 * @param {number} o_r - radius of the arc
	 * @param {number} x_x - x position of start point of the arc
	 * @param {number} x_y - y position of start point of the arc
	 * @param {number} y_x - x position of end point of the arc
	 * @param {number} y_y - y position of end point of the arc
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliArcCircPnt(1, 1, 0, 0, 2, 2, 0, 0, 2);
	 * //true
	 *
	 * @function colliArcCircPnt
	 * @memberof Geometry
	 **/
	function Geometry_colliArcCircPnt(a_x, a_y, o_x, o_y, o_r, x_x, x_y, y_x, y_y) {
		let temp_x = a_x - o_x,
			temp_y = a_y - o_y;
		return !Math_clockWiseVec(x_x, x_y, temp_x, temp_y) &&
			Math_clockWiseVec(y_x, y_y, temp_x, temp_y) &&
			Geometry_colliCirc(0, 0, 0, temp_x, temp_y, o_r);
	}

	/**
	 *
	 * Check if a point is inside a circle, return 1, 0, -1 based on location
	 *
	 * @param {number} o_x - x position of center point
	 * @param {number} o_y - y position of center point
	 * @param {number} o_r - radius of the circle
	 * @param {number} a_x - x position of point
	 * @param {number} a_y - y position of point
	 * @param {number=} [accuracy=1e-10] - Accuracy
	 * @return {number}
	 *
	 * @example
	 * Geometry.colliCircPnt(0, 0, 2, 1, 1);
	 * //1
	 *
	 * @function colliCircPnt
	 * @memberof Geometry
	 **/
	function Geometry_colliCircPnt(o_x, o_y, o_r, a_x, a_y, accuracy) {
		accuracy = _helper0(accuracy, 1e-10);
		let dist = Geometry_distPnt(a_x, a_y, o_x, o_y, false),
			rSq = o_r * o_r;
		return dist < rSq ? 1 : Math.abs(dist - rSq) < accuracy ? 0 : -1;
	}

	/**
	 *
	 * Check if a circle collide another circle
	 *
	 * @param {number} a_x - x position of center point of first circle
	 * @param {number} a_y - y position of center point of first circle
	 * @param {number} a_r - radius of first circle
	 * @param {number} b_x - x position of center point of second circle
	 * @param {number} b_y - y position of center point of second circle
	 * @param {number} b_r - radius of second circle
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliCirc(0, 0, 1, 2, 0, 1);
	 * //true
	 *
	 * @function colliCirc
	 * @memberof Geometry
	 **/
	function Geometry_colliCirc(a_x, a_y, a_r, b_x, b_y, b_r) {
		let temp1 = b_x - a_x,
			temp2 = b_y - a_y,
			temp3 = a_r + b_r;
		return temp1 * temp1 + temp2 * temp2 <= temp3 * temp3;
	}

	/**
	 *
	 * Check if a circle collide a rectangle
	 *
	 * @param {number} o_x - x position of center point
	 * @param {number} o_y - y position of center point
	 * @param {number} o_r - radius of the circle
	 * @param {number} x_min - x position of top-left corner
	 * @param {number} y_min - y position of top-left corner
	 * @param {number} x_max - x position of bottom-right corner
	 * @param {number} y_max - y position of bottom-right corner
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliCircRect(0, 0, 2, 1, 0, 3, 2);
	 * //true
	 *
	 * @function colliCircRect
	 * @memberof Geometry
	 **/
	function Geometry_colliCircRect(o_x, o_y, o_r, x_min, y_min, x_max, y_max) {
		return Geometry_distPnt(Math_clamp(o_x, x_min, x_max), Math_clamp(o_y, y_min, y_max), o_x, o_y, false) <= o_r * o_r;
	}

	/**
	 *
	 * Find intersection of 2 circles
	 *
	 * @param {number} a_x - x position of center point of first circle
	 * @param {number} a_y - y position of center point of first circle
	 * @param {number} a_r - radius of first circle
	 * @param {number} b_x - x position of center point of second circle
	 * @param {number} b_y - y position of center point of second circle
	 * @param {number} b_r - radius of second circle
	 * @param {array=} returnData - Array to put data
	 * @return {number[]} [x1, y1, x2, y2], NaN if no intersection
	 *
	 * @example
	 * Geometry.intrCirc(0, 0, 1, 2, 0, 1);
	 * //[1, 0, 1, 0]
	 *
	 * @function intrCirc
	 * @memberof Geometry
	 **/
	function Geometry_intrCirc(a_x, a_y, a_r, b_x, b_y, b_r, returnData) {
		let c_dist = Geometry_distPnt(a_x, a_y, b_x, b_y, true);
		let temp1 = (a_r * a_r - b_r * b_r + c_dist * c_dist) / (2 * c_dist);
		let temp2 = temp1 / c_dist;
		if (temp1 > a_r) {
			return NaN;
		}
		let tempP_x = a_x + (b_x - a_x) * temp2,
			tempP_y = a_y + (b_y - a_y) * temp2;
		let b = Math.sqrt(a_r * a_r - temp1 * temp1) / c_dist;
		temp1 = (b_y - a_y);
		temp2 = (b_x - a_x);
		returnData = _helper0(returnData, "_a_");
		returnData[0] = tempP_x - b * temp1;
		returnData[1] = tempP_y + b * temp2;
		returnData[2] = tempP_x + b * temp1;
		returnData[3] = tempP_y - b * temp2;
		return returnData;
	}

	/**
	 *
	 * Generate random point inside circle
	 *
	 * @param {number} x - x position of center point
	 * @param {number} y - y position of center point
	 * @param {number} radius - radius of the circle
	 * @param {object=} returnData - Object to put data
	 * @param {boolean=} [uniform=false] - `true` if generate uniformly
	 * @return {{x: number, y: number}} returnData.x and returnData.y
	 *
	 * @example
	 * Geometry.randomCirc(0, 0, 2, true);
	 * //Random points
	 *
	 * @function randomCirc
	 * @memberof Geometry
	 **/
	function Geometry_randomCirc(x, y, radius, uniform, returnData) {
		_helper27(uniform);
		return Math_rec(x, y, _memory_1_[1] * radius, Math_TAU * _memory_1_[0] / _memory_1_[1], returnData);
	}

	//Ellipse
	/**
	 *
	 * Calculate point on an ellipse
	 *
	 * @param {number} x - x position of center point
	 * @param {number} y - y position of center point
	 * @param {number} radius1 - radius of major axis
	 * @param {number} radius2 - radius of minor axis
	 * @param {number} angle - rotation of ellipse in radians
	 * @param {number} angle2 - angle from center to point in radians
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}} returnData.x and returnData.y
	 *
	 * @example
	 * Geometry.onElli(0, 0, 2, 1, 0, 0);
	 * //{x: 2, y: 0}
	 *
	 * @function onElli
	 * @memberof Geometry
	 **/
	function Geometry_onElli(x, y, radius1, radius2, angle, angle2, returnData) {
		let angle_2 = Math.sin(angle),
			angle2_2 = Math.sin(angle2);
		angle = Math.cos(angle);
		angle2 = Math.cos(angle2);
		returnData = _helper0(returnData, "_o_");
		returnData.x = radius1 * angle2 * angle - radius2 * angle2_2 * angle_2 + x;
		returnData.y = radius2 * angle2_2 * angle + radius1 * angle2 * angle_2 + y;
		return returnData;
	}

	/**
	 *
	 * Check if a point inside an ellipse
	 *
	 * @param {number} x - x position of center point
	 * @param {number} y - y position of center point
	 * @param {number} radius1 - radius of major axis
	 * @param {number} radius2 - radius of minor axis
	 * @param {number} angle - rotation of ellipse in radians
	 * @param {number} o_x - x position of point
	 * @param {number} o_y - y position of point
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliElliPnt(0, 0, 2, 1, 0, 1, 0);
	 * //true
	 *
	 * @function colliElliPnt
	 * @memberof Geometry
	 **/
	function Geometry_colliElliPnt(x, y, radius1, radius2, angle, o_x, o_y) {
		let cosa = Math.cos(angle),
			sina = Math.sin(angle);
		o_x -= x;
		o_y -= y;
		let temp = cosa * o_x + sina * o_y;
		sina = sina * o_x - cosa * o_y;
		cosa = temp;
		return (4 * cosa * cosa) / (radius1 * radius1) + (4 * sina * sina) / (radius2 * radius2) <= 1;
	}

	/**
	 *
	 * Find intersection points of two ellipses
	 *
	 * @param {number} x_1 - x position of center point of first ellipse
	 * @param {number} y_1 - y position of center point of first ellipse
	 * @param {number} radius1_1 - radius of major axis of first ellipse
	 * @param {number} radius2_1 - radius of minor axis of first ellipse
	 * @param {number} angle_1 - rotation of ellipse in radians of first ellipse
	 * @param {number} x_2 - x position of center point of second ellipse
	 * @param {number} y_2 - y position of center point of second ellipse
	 * @param {number} radius1_2 - radius of major axis of second ellipse
	 * @param {number} radius2_2 - radius of minor axis of second ellipse
	 * @param {number} angle_2 - rotation of ellipse in radians of second ellipse
	 * @param {array=} returnData - Array to put data
	 * @return {Array} [x1, y1, x2, y2, ...]
	 *
	 * @example
	 * Geometry.intrElli(0, 0, 2, 1, Math.PI / 4, 0, 0, 2, 1, -Math.PI / 4);
	 * //[
	 * //  -1.1102230246251565e-16, 1.2649110640673515, 1.2649110640673515, 3.3306690738754696e-16,
	 * //  -1.1102230246251565e-16, -1.2649110640673515, -1.2649110640673515, -1.1102230246251565e-16
	 * //]
	 *
	 * @function intrElli
	 * @memberof Geometry
	 **/
	function Geometry_intrElli(x_1, y_1, radius1_1, radius2_1, angle_1, x_2, y_2, radius1_2, radius2_2, angle_2, returnData) {
		_helper1();
		let tempAngle1_1 = Math.cos(angle_1),
			tempAngle1_2 = Math.sin(angle_1),
			tempAngle2_1 = Math.cos(angle_2),
			tempAngle2_2 = Math.sin(angle_2),
			tempAngle3_1 = Math.cos(angle_1 - angle_2),
			tempAngle3_2 = Math.sin(angle_1 - angle_2);
		let a = radius2_1 * (-x_1 * tempAngle1_1 + x_2 * tempAngle1_1 - y_1 * tempAngle1_2 + y_2 * tempAngle1_2),
			b = radius1_2 * radius2_1 * tempAngle3_1,
			c = radius2_1 * radius2_2 * tempAngle3_2,
			d = radius1_1 * (-y_1 * tempAngle1_1 + y_2 * tempAngle1_1 + x_1 * tempAngle1_2 - x_2 * tempAngle1_2),
			e = -radius1_1 * radius1_2 * tempAngle3_2,
			f = radius1_1 * radius2_2 * tempAngle3_1,
			r = radius1_1 * radius2_1;
		let aa = a * a,
			bb = b * b,
			dd = d * d,
			ee = e * e,
			rr = r * r;
		let ac4 = 4 * a * c,
			ef4 = 4 * e * f,
			bc4 = 4 * b * c,
			df4 = 4 * d * f,
			ab2 = 2 * a * b,
			de2 = 2 * d * e;
		let result = _helper0(returnData, []),
			l, t2, t2_1, t2_2;
		l = _helper20(
			aa + ab2 + bb + dd + de2 + ee - rr,
			ac4 + bc4 + df4 + ef4,
			2 * aa - 2 * bb + 4 * c * c + 2 * dd - 2 * ee + 4 * f * f - 2 * rr,
			ac4 - bc4 + df4 - ef4,
			aa - ab2 + bb + dd - de2 + ee - rr
		);
		for (let n = 0; n < l; ++n) {
			t2 = 2 * Math.atan(_memory_1_[n]);
			t2_1 = Math.cos(t2) * radius1_2;
			t2_2 = Math.sin(t2) * radius2_2;
			result[n * 2] = x_2 + t2_1 * tempAngle2_1 - t2_2 * tempAngle2_2;
			result[n * 2 + 1] = y_2 + t2_1 * tempAngle2_2 + t2_2 * tempAngle2_1;
		}
		return result;
	}

	/**
	 *
	 * Find intersection points of an ellipse and a line
	 *
	 * @param {number} x - x position of center point of the ellipse
	 * @param {number} y - y position of center point of the ellipse
	 * @param {number} radius1 - radius of major axis of the ellipse
	 * @param {number} radius2 - radius of minor axis of the ellipse
	 * @param {number} angle - rotation of ellipse in radians of the ellipse
	 * @param {number} a_x - x position of first point of the line
	 * @param {number} a_y - y position of first point of the line
	 * @param {number} b_x - x position of second point of the line
	 * @param {number} b_y - y position of second point of the line
	 * @param {array=} returnData - Array to put data
	 * @return {Array} [x1, y1, x2, y2, ...]
	 *
	 * @example
	 * Geometry.intrElliLine(0, 0, 2, 1, 0, 0, 2, 0, -2);
	 * //[0, 1, 0, -1]
	 *
	 * @function intrElliLine
	 * @memberof Geometry
	 **/
	function Geometry_intrElliLine(x, y, radius1, radius2, angle, a_x, a_y, b_x, b_y, returnData) {
		let c2 = Math.sin(angle);
		angle = Math.cos(angle);
		let x1_ = radius2 * ((-x + a_x) * angle + (-y + a_y) * c2),
			y1_ = radius1 * ((-y + a_y) * angle + (x - a_x) * c2),
			x2_ = radius2 * ((-x + b_x) * angle + (-y + b_y) * c2),
			y2_ = radius1 * ((-y + b_y) * angle + (x - b_x) * c2),
			r = radius1 * radius2;
		let x1_x1_ = x1_ * x1_,
			x1_x2_ = x1_ * x2_,
			y1_y1_ = y1_ * y1_,
			y1_y2_ = y1_ * y2_;
		let tempA = x1_x1_ - 2 * x1_x2_ + x2_ * x2_ + y1_y1_ - 2 * y1_y2_ + y2_ * y2_,
			tempB = -2 * x1_x1_ + 2 * x1_x2_ - 2 * y1_y1_ + 2 * y1_y2_,
			tempC = -r * r + x1_x1_ + y1_y1_;
		let D = tempB * tempB - 4 * tempA * tempC,
			t, result = _helper0(returnData, "_a_")
		if (D === 0) {
			t = -tempB / (2 * tempA);
			result[0] = (1 - t) * a_x + t * b_x;
			result[1] = (1 - t) * a_y + t * b_y;
		} else if (D > 0) {
			let sqrtD = Math.sqrt(D),
				noOfIntx = 0;
			t = (-tempB - sqrtD) / (2 * tempA);
			result[0] = (1 - t) * a_x + t * b_x;
			result[1] = (1 - t) * a_y + t * b_y;
			noOfIntx++;
			t = (-tempB + sqrtD) / (2 * tempA);
			result[noOfIntx * 2] = (1 - t) * a_x + t * b_x;
			result[noOfIntx * 2 + 1] = (1 - t) * a_y + t * b_y;
			noOfIntx++;
		}
		return result;
	}

	/**
	 *
	 * Find bounding box of an ellipse
	 *
	 * @param {number} x - x position of center point of the ellipse
	 * @param {number} y - y position of center point of the ellipse
	 * @param {number} radius1 - radius of major axis of the ellipse
	 * @param {number} radius2 - radius of minor axis of the ellipse
	 * @param {number} angle - rotation of ellipse in radians of the ellipse
	 * @param {object=} returnData - Object to put data
	 * @return {{xMin: number, yMin: number, xMax: number, yMax: number}}
	 *
	 * @example
	 * Geometry.boundElli(0, 0, 2, 1, Math.PI / 4);
	 * //{xMin: -1.5811388300841895, yMin: -1.5811388300841895, xMax: 1.5811388300841895, yMax: 1.5811388300841895}
	 *
	 * @function boundElli
	 * @memberof Geometry
	 **/
	function Geometry_boundElli(x, y, radius1, radius2, angle, returnData) {
		let temp_x = Math.atan(-radius2 * Math.tan(angle) / radius1),
			temp_y = Math.atan(radius2 * Math.cot(angle) / radius1),
			angle_2 = Math.sin(angle);
		angle = Math.cos(angle);
		temp_x = Math.abs(radius1 * Math.cos(temp_x) * angle - radius2 * Math.sin(temp_x) * angle_2);
		temp_y = Math.abs(radius2 * Math.sin(temp_y) * angle + radius1 * Math.cos(temp_y) * angle_2);
		returnData = _helper0(returnData, "_o_");
		returnData.xMin = -temp_x + x;
		returnData.yMin = -temp_y + y;
		returnData.xMax = temp_x + x;
		returnData.yMax = temp_y + y;
		return returnData;
	}

	/**
	 *
	 * Generate a random point inside an ellipse
	 *
	 * @param {number} x - x position of center point of the ellipse
	 * @param {number} y - y position of center point of the ellipse
	 * @param {number} radius1 - radius of major axis of the ellipse
	 * @param {number} radius2 - radius of minor axis of the ellipse
	 * @param {number} angle - rotation of ellipse in radians of the ellipse
	 * @param {boolean=} [uniform=false] - `true` if generate uniformly
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}} returnData.x and returnData.y
	 *
	 * @example
	 * Geometry.randomElli(0, 0, 2, 1, Math.PI / 4);
	 * //Random point
	 *
	 * @function randomElli
	 * @memberof Geometry
	 **/
	function Geometry_randomElli(x, y, radius1, radius2, angle, uniform, returnData) {
		_helper27(uniform);
		return Geometry_onElli(x, y, _memory_1_[1] * radius1, _memory_1_[1] * radius2, angle, Math_TAU * _memory_1_[0] / _memory_1_[1], returnData);
	}

	/**
	 *
	 * Calculate distance from a point on an ellipse to it's center
	 *
	 * @param {number} radius1 - radius of major axis of the ellipse
	 * @param {number} radius2 - radius of minor axis of the ellipse
	 * @param {number} angle - angle from center to point in radians
	 * @return {number}
	 *
	 * @example
	 * Geometry.distElliPnt(2, 1, Math_HALF_PI);
	 * //1
	 *
	 * @function distElliPnt
	 * @memberof Geometry
	 **/
	function Geometry_distElliPnt(radius1, radius2, angle) {
		let temp = 1 / Math.sqrt(
			oldPow(Math.sin(angle) / radius2, 2) +
			oldPow(Math.cos(angle) / radius1, 2)
		);
		return Number.isFinite(temp) ? temp : 0;
	}

	//Triangle
	/**
	 *
	 * Calculate centroid point of triangle
	 *
	 * @param {number} x_1 - x position of the first vertex
	 * @param {number} y_1 - y position of the first vertex
	 * @param {number} x_2 - x position of the second vertex
	 * @param {number} y_2 - y position of the second vertex
	 * @param {number} x_3 - x position of the third vertex
	 * @param {number} y_3 - y position of the third vertex
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}} returnData.x and returnData.y
	 *
	 * @example
	 * Geometry.centroidTri(0, 0, 2, 0, 1, 1);
	 * //{x: 1, y: 0.3333333333333333}
	 *
	 * @function centroidTri
	 * @memberof Geometry
	 **/
	function Geometry_centroidTri(x_1, y_1, x_2, y_2, x_3, y_3, returnData) {
		returnData = _helper0(returnData, "_o_");
		returnData.x = (x_1 + x_2 + x_3) / 3;
		returnData.y = (y_1 + y_2 + y_3) / 3;
		return returnData;
	}

	/**
	 *
	 * Construct equilateral triangle
	 *
	 * @param {number} x - x position of point
	 * @param {number} y - y position of point
	 * @param {number} len - height of the triangle
	 * @param {object=} returnData - Object to put data
	 * @return {{x1: number, y1: number, x2: number, y2: number, x3: number, y3: number}}
	 *
	 * @example
	 * Geometry.equilTri(0, 0, 2);
	 * //{x1: 0, y1: 0, x2: 1, y2: 1.7320508075688772, x3: -1, y3: 1.7320508075688772}
	 *
	 * @function equilTri
	 * @memberof Geometry
	 **/
	function Geometry_equilTri(x, y, len, returnData) {
		let temp = y + len * _triEquil_1_,
			temp2 = len / 2;
		returnData = _helper0(returnData, "_o_");
		returnData.x1 = x;
		returnData.y1 = y;
		returnData.x2 = x + temp2;
		returnData.y2 = temp;
		returnData.x3 = x - temp2;
		returnData.y3 = temp;
		return returnData;
	}

	/**
	 *
	 * Construct right triangle
	 *
	 * @param {number} x - x position of point
	 * @param {number} y - y position of point
	 * @param {number} width - width of the triangle
	 * @param {number} height - height of the triangle
	 * @param {object=} returnData - Object to put data
	 * @return {{x1: number, y1: number, x2: number, y2: number, x3: number, y3: number}}
	 *
	 * @example
	 * Geometry.rightTri(0, 0, 2, 2);
	 * //{x1: 0, y1: 0, x2: 0, y2: -2, x3: 2, y3: 0}
	 *
	 * @function rightTri
	 * @memberof Geometry
	 **/
	function Geometry_rightTri(x, y, width, height, returnData) {
		returnData.x1 = x;
		returnData.y1 = y;
		returnData.x2 = x;
		returnData.y2 = y - height;
		returnData.x3 = x + width;
		returnData.y3 = y;
		return returnData;
	}

	/**
	 *
	 * Calculate center point of triangle
	 *
	 * @param {number} x_1 - x position of the first vertex
	 * @param {number} y_1 - y position of the first vertex
	 * @param {number} x_2 - x position of the second vertex
	 * @param {number} y_2 - y position of the second vertex
	 * @param {number} x_3 - x position of the third vertex
	 * @param {number} y_3 - y position of the third vertex
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}} returnData.x and returnData.y
	 *
	 * @example
	 * Geometry.crcmCntrTri(0, 0, 2, 0, 1, 1);
	 * //{x: 2, y: 0}
	 *
	 * @function crcmCntrTri
	 * @memberof Geometry
	 **/
	function Geometry_crcmCntrTri(x_1, y_1, x_2, y_2, x_3, y_3, returnData) {
		let p, q, r, s, dataOne, dataTwo, dataThree;
		p = x_1 - x_3;
		q = y_1 - y_3;
		r = x_2 - x_3;
		s = y_2 - y_3;
		dataOne = p * p + q * q;
		dataTwo = r * r + s * s;
		dataThree = 2 * Math_crossVec(p, q, r, s);
		returnData.x = x_3 - Math_crossVec(q, dataOne, r, dataTwo) / dataThree;
		returnData.y = y_3 + Math_crossVec(p, dataOne, r, dataTwo) / dataThree;
		return returnData;
	}

	/**
	 *
	 * Calculate center point of a circle form by three point from the triangle
	 *
	 * @param {number} x_1 - x position of the first vertex
	 * @param {number} y_1 - y position of the first vertex
	 * @param {number} x_2 - x position of the second vertex
	 * @param {number} y_2 - y position of the second vertex
	 * @param {number} x_3 - x position of the third vertex
	 * @param {number} y_3 - y position of the third vertex
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, r: number}}
	 *
	 * @example
	 * Geometry.crcmCircTri(0, 0, 2, 0, 1, 1);
	 * //{x: 1, y: 0, r: 1}
	 *
	 * @function crcmCircTri
	 * @memberof Geometry
	 **/
	function Geometry_crcmCircTri(x_1, y_1, x_2, y_2, x_3, y_3, returnData) {
		let A = x_2 - x_1,
			B = y_2 - y_1,
			C = x_3 - x_1,
			D = y_3 - y_1;
		let E = A * (x_1 + x_2) + B * (y_1 + y_2),
			F = C * (x_1 + x_3) + D * (y_1 + y_3),
			G = 2 * (A * (y_3 - y_2) - B * (x_3 - x_2)),
			dx, dy;
		returnData = _helper0(returnData, "_o_");
		returnData.x = (D * E - B * F) / G;
		returnData.y = (A * F - C * E) / G;
		dx = returnData.x - x_1;
		dy = returnData.y - y_1;
		returnData.r = Math.sqrt(dx * dx + dy * dy) * 2;
		return returnData;
	}

	/**
	 *
	 * Calculate inscribed center point of a circle form by three point from the triangle
	 *
	 * @param {number} x_1 - x position of the first vertex
	 * @param {number} y_1 - y position of the first vertex
	 * @param {number} x_2 - x position of the second vertex
	 * @param {number} y_2 - y position of the second vertex
	 * @param {number} x_3 - x position of the third vertex
	 * @param {number} y_3 - y position of the third vertex
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, r: number}}
	 *
	 * @example
	 * Geometry.inCircTri(0, 0, 2, 0, 1, 1);
	 * //{x: 1, y: 0.4142135623730951, r: 0.41421356237309487}
	 *
	 * @function inCircTri
	 * @memberof Geometry
	 **/
	function Geometry_inCircTri(x_1, y_1, x_2, y_2, x_3, y_3, returnData) {
		let d1 = Geometry_distPnt(x_3, y_3, x_2, y_2, true),
			d2 = Geometry_distPnt(x_1, y_1, x_3, y_3, true),
			d3 = Geometry_distPnt(x_2, y_2, x_1, y_1, true);
		let p = d1 + d2 + d3,
			temp = (d3 + d1 + d2) / 2;
		returnData = _helper0(returnData, "_o_");
		returnData.x = (x_1 * d1 + x_2 * d2 + x_3 * d3) / p;
		returnData.y = (y_1 * d1 + y_2 * d2 + y_3 * d3) / p;
		returnData.r = Math.sqrt(temp * (temp - d3) * (temp - d1) * (temp - d2)) / temp;
		return returnData;
	}

	/**
	 *
	 * Check if a point inside the triangle
	 *
	 * @param {number} a_x - x position of the first vertex
	 * @param {number} a_y - y position of the first vertex
	 * @param {number} b_x - x position of the second vertex
	 * @param {number} b_y - y position of the second vertex
	 * @param {number} c_x - x position of the third vertex
	 * @param {number} c_y - y position of the third vertex
	 * @param {number} o_x - x position of the point
	 * @param {number} o_y - y position of the point
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliTriPnt(0, 0, 4, 0, 2, 2, 2, 1);
	 * //true
	 *
	 * @function colliTriPnt
	 * @memberof Geometry
	 **/
	function Geometry_colliTriPnt(a_x, a_y, b_x, b_y, c_x, c_y, o_x, o_y) {
		let s = a_y * c_x - a_x * c_y + (c_y - a_y) * o_x + (a_x - c_x) * o_y,
			t = a_x * b_y - a_y * b_x + (a_y - b_y) * o_x + (b_x - a_x) * o_y;

		if ((s < 0) != (t < 0)) return false;

		let area = -b_y * c_x + a_y * (c_x - b_x) + a_x * (b_y - c_y) + b_x * c_y;
		if (area < 0.0) {
			s = -s;
			t = -t;
			area = -area;
		}
		return s > 0 && t > 0 && (s + t) <= area;
	}

	/**
	 *
	 * Calculate area of the triangle
	 *
	 * @param {number} x_1 - x position of the first vertex
	 * @param {number} y_1 - y position of the first vertex
	 * @param {number} x_2 - x position of the second vertex
	 * @param {number} y_2 - y position of the second vertex
	 * @param {number} x_3 - x position of the third vertex
	 * @param {number} y_3 - y position of the third vertex
	 * @return {number}
	 *
	 * @example
	 * Geometry.areaTri(0, 0, 2, 0, 1, 1);
	 * //1
	 *
	 * @function areaTri
	 * @memberof Geometry
	 **/
	function Geometry_areaTri(x_1, y_1, x_2, y_2, x_3, y_3) {
		return Math.abs(((x_3 - x_1) * (y_2 - y_1) - (x_2 - x_1) * (y_3 - y_1)) / 2);
	}

	/**
	 *
	 * Generate random point in the triangle
	 *
	 * @param {number} a_x - x position of the first vertex
	 * @param {number} a_y - y position of the first vertex
	 * @param {number} b_x - x position of the second vertex
	 * @param {number} b_y - y position of the second vertex
	 * @param {number} c_x - x position of the third vertex
	 * @param {number} c_y - y position of the third vertex
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Geometry.randomTri(0, 0, 2, 0, 1, 1);
	 * //Random point
	 *
	 * @function randomTri
	 * @memberof Geometry
	 **/
	function Geometry_randomTri(a_x, a_y, b_x, b_y, c_x, c_y, returnData) {
		let r1 = Math.sqrt(oldRandom()),
			r2 = oldRandom(),
			temp1 = 1 - r1,
			temp2 = r1 * (1 - r2),
			temp3 = r1 * r2;
		returnData.x = temp1 * a_x + temp2 * b_x + temp3 * c_x;
		returnData.y = temp1 * a_y + temp2 * b_y + temp3 * c_y;
		return returnData;
	}

	//Rectangle
	/**
	 *
	 * Check if a point inside the rectangle
	 *
	 * @param {number} x_min - x position of top-left corner
	 * @param {number} y_min - y position of top-left corner
	 * @param {number} x_max - x position of bottom-right corner
	 * @param {number} y_max - y position of bottom-right corner
	 * @param {number} x - x position of the point
	 * @param {number} y - y position of the point
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliRectPnt(0, 0, 2, 1, 1, 1);
	 * //true
	 *
	 * @function colliRectPnt
	 * @memberof Geometry
	 **/
	function Geometry_colliRectPnt(x_min, y_min, x_max, y_max, x, y) {
		if (x_max - x_min <= 0 || y_max - y_min <= 0) {
			return false;
		}
		return (x_min <= x && x_max >= x && y_min <= y && y_max >= y);
	}

	/**
	 *
	 * Check if a rectangle collide another rectangle
	 *
	 * @param {number} x_min - x position of top-left corner of first rectangle
	 * @param {number} y_min - y position of top-left corner of first rectangle
	 * @param {number} x_max - x position of bottom-right corner of first rectangle
	 * @param {number} y_max - y position of bottom-right corner of first rectangle
	 * @param {number} x2_min - x position of top-left corner of second rectangle
	 * @param {number} y2_min - y position of top-left corner of second rectangle
	 * @param {number} x2_max - x position of bottom-right corner of second rectangle
	 * @param {number} y2_max - y position of bottom-right corner of second rectangle
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliRect(0, 0, 2, 1, 1, 1, 3, 2);
	 * //true
	 *
	 * @function colliRect
	 * @memberof Geometry
	 **/
	function Geometry_colliRect(x_min, y_min, x_max, y_max, x2_min, y2_min, x2_max, y2_max) {
		if (Math.abs(x_max - x_min) <= 0 || Math.abs(y_max - y_min) <= 0 || Math.abs(x2_max - x2_min) <= 0 || Math.abs(y2_max - y2_min) <= 0) {
			return false;
		}
		return !(x_max < x2_min || y_max < y2_min || x_min > x2_max || y_min > y2_max);
	}

	/**
	 *
	 * Calculate corner of bounding rectangle from two rectangles
	 *
	 * @param {number} x_min - x position of top-left corner of first rectangle
	 * @param {number} y_min - y position of top-left corner of first rectangle
	 * @param {number} x_max - x position of bottom-right corner of first rectangle
	 * @param {number} y_max - y position of bottom-right corner of first rectangle
	 * @param {number} x_min - x position of top-left corner of second rectangle
	 * @param {number} y_min - y position of top-left corner of second rectangle
	 * @param {number} x_max - x position of bottom-right corner of second rectangle
	 * @param {number} y_max - y position of bottom-right corner of second rectangle
	 * @param {object=} returnData - Object to put data
	 * @return {{xMin: number, yMin: number, xMax: number, yMax: number}}
	 *
	 * @example
	 * Geometry.intrRect(0, 0, 2, 1, 1, 1, 3, 2);
	 * //{xMin: 1, yMin: 1, xMax: 2, yMax: 1}
	 *
	 * @function intrRect
	 * @memberof Geometry
	 **/
	function Geometry_intrRect(x_min, y_min, x_max, y_max, x2_min, y2_min, x2_max, y2_max, returnData) {
		if (Geometry_colliRect(x_min, y_min, x_max, y_max, x2_min, y2_min, x2_max, y2_max)) {
			returnData = _helper0(returnData, "_o_");
			returnData.xMin = Math.max(x_min, x2_min);
			returnData.yMin = Math.max(y_min, y2_min);
			returnData.xMax = Math.min(x_max, x2_max);
			returnData.yMax = Math.min(y_max, y2_max);
			return returnData;
		}
		return returnData;
	}

	/**
	 *
	 * Generate random point inside a rectangle
	 *
	 * @param {number} x_min - x position of top-left corner
	 * @param {number} y_min - y position of top-left corner
	 * @param {number} x_max - x position of bottom-right corner
	 * @param {number} y_max - y position of bottom-right corner
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Geometry.randomRect(0, 0, 2, 1);
	 * //Random point
	 *
	 * @function randomRect
	 * @memberof Geometry
	 **/
	function Geometry_randomRect(x_min, y_min, x_max, y_max, returnData) {
		returnData = _helper0(returnData, "_o_");
		returnData.x = x_min + oldRandom() * Math.abs(x_max - x_min);
		returnData.y = y_min + oldRandom() * Math.abs(y_max - y_min);
		return returnData;
	}

	//Polygon
	/**
	 *
	 * Check if a point inside a polygon (convex, concave, complex)
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @param {number} x - x position of the point
	 * @param {number} y - y position of the point
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliPolyPnt([0, 0, 50, 0, 100, 50, 50, 100, 0, 100], 10, 10);
	 * //true
	 *
	 * @function colliPolyPnt
	 * @memberof Geometry
	 **/
	function Geometry_colliPolyPnt(points, x, y) {
		let inside = false,
			ix, iy, jx, jy;
		for (let i = -2, j = points.length - 2;
			(i += 2) < points.length; j = i) {
			ix = points[i];
			iy = points[i + 1];
			jx = points[j];
			jy = points[j + 1];
			if (((iy <= y && y < jy) || (jy <= y && y < iy)) && (x < (jx - ix) * (y - iy) / (jy - iy) + ix)) {
				inside = !inside;
			}
		}
		return inside;
	}

	/**
	 *
	 * Check if a circle collide a polygon (convex, concave, complex)
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @param {number} o_x - x position of circle center
	 * @param {number} o_y - y position of circle center
	 * @param {number} o_r - radius of the circle
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliPolyCirc([0, 0, 50, 0, 100, 50, 50, 100, 0, 100], 10, 10, 10);
	 * //true
	 *
	 * @function colliPolyCirc
	 * @memberof Geometry
	 **/
	function Geometry_colliPolyCirc(points, o_x, o_y, o_r) {
		if (Geometry_colliPolyPnt(points, o_x, o_y)) {
			return true;
		}
		for (let i = 2; i < points.length; i += 2) {
			if (Geometry_distLinePnt(false, points[i - 2], points[i - 1], points[i], points[i + 1], o_x, o_y, false) < o_r * o_r) {
				return true;
			}
		}
		return Geometry_distLinePnt(false, points[points.length - 2], points[points.length - 1], points[0], points[1], o_x, o_y, false) < o_r * o_r;
	}

	/**
	 *
	 * Check if a polygon (convex, concave, complex) collide another polygon (convex, concave, complex)
	 *
	 * @param {number[]} points - array of points of first polygon [x1, y1, x2, y2, ...]
	 * @param {number[]} points - array of points of second polygon [x1, y1, x2, y2, ...]
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.colliPoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100], [0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	 * //true
	 *
	 * @function colliPoly
	 * @memberof Geometry
	 **/
	function Geometry_colliPoly(points1, points2) {
		let t1 = Geometry_boundPoly(points1),
			t2 = Geometry_boundPoly(points2),
			i;
		if (Geometry_colliRect(t1.xMin, t1.yMin, t1.xMax, t1.yMax, t2.xMin, t2.yMin, t2.xMax, t2.yMax)) {
			let len = points1.length > points2.length ? points1.length : points2.length;
			for (i = 0; i < len; i += 2) {
				if (Geometry_colliPolyPnt(points2, points1[i], points1[i + 1]) && i <= points1.length) {
					return true;
				}
				if (Geometry_colliPolyPnt(points1, points2[i], points2[i + 1]) && i <= points2.length) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 *
	 * Check if a polygon is not complex polygon (check if not self-intersecting)
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.isSimplePoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	 * //true
	 *
	 * @function isSimplePoly
	 * @memberof Geometry
	 **/
	function Geometry_isSimplePoly(points) {
		_helper2();
		let n = points.length >> 1;
		if (n < 4) {
			return true;
		}
		let a1_x, a1_y,
			a2_x, a2_y,
			b1_x, b1_y,
			b2_x, b2_y;

		for (let i = 0; i < n; i++) {
			a1_x = points[2 * i];
			a1_y = points[2 * i + 1];
			if (i == n - 1) {
				a2_x = points[0];
				a2_y = points[1];
			} else {
				a2_x = points[2 * i + 2];
				a2_y = points[2 * i + 3];
			}

			for (let j = 0; j < n; j++) {
				if (Math.abs(i - j) < 2 || (j === n - 1 && i === 0) || (i === n - 1 && j === 0)) {
					continue;
				}

				b1_x = points[2 * j];
				b1_y = points[2 * j + 1];
				if (j == n - 1) {
					b2_x = points[0];
					b2_y = points[1];
				} else {
					b2_x = points[2 * j + 2];
					b2_y = points[2 * j + 3];
				}
				Geometry_intrLine(a1_x, a1_y, a2_x, a2_y, b1_x, b1_y, b2_x, b2_y, _memory2_1_);
				if (_memory2_1_.onLine1 && _memory2_1_.onLine2) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 *
	 * Check if a polygon is convex
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.isConvexPoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	 * //true
	 *
	 * @function isConvexPoly
	 * @memberof Geometry
	 **/
	function Geometry_isConvexPoly(points) {
		if (points.length <= 6) {
			return false;
		}
		let check = Geometry_isClockWisePoly(points),
			ccw = Geometry_sideLine(points[points.length - 3], points[points.length - 2], points[0], points[1], points[2], points[3]),
			temp;
		ccw = (ccw > 0 || Math.abs(ccw) < 0);
		for (let i = 2; i < points.length - 2; i += 2) {
			temp = Geometry_sideLine(points[i - 2], points[i - 1], points[i], points[i + 1], points[i + 2], points[i + 3]);
			if ((check ? temp > 0 : temp < 0) !== ccw) {
				return true;
			}
		}
		return false;
	}

	/**
	 *
	 * Check if a polygon is clockwise (point location sequence)
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @return {boolean}
	 *
	 * @example
	 * Geometry.isClockWisePoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	 * //true
	 *
	 * @function isClockWisePoly
	 * @memberof Geometry
	 **/
	function Geometry_isClockWisePoly(points) {
		let pdir = 0,
			s = 0,
			fdir, n, dir;
		for (let i = 0; i < points.length; i += 2) {
			n = (i + 2) % points.length;
			dir = Math.atan2(points[n + 1] - points[i + 1], points[n] - points[i]);
			if (i === 0) {
				fdir = dir;
			} else {
				dir -= fdir;
				s += Geometry_normRad(dir - pdir);
				pdir = dir;
			}
		}
		s += Geometry_normRad(-pdir);
		return s >= 0;
	}

	/**
	 *
	 * Find bounding box of a polygon (convex, concave, complex)
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @param {object=} returnData - Object to put data
	 * @return {{xMin: number, yMin: number, xMax: number, yMax: number}}
	 *
	 * @example
	 * Geometry.boundPoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	 * //{xMin: 0, yMin: 0, xMax: 100, yMax: 100}
	 *
	 * @function boundPoly
	 * @memberof Geometry
	 **/
	function Geometry_boundPoly(points, returnData) {
		returnData = _helper0(returnData, "_o_");
		returnData.xMin = Number.MAX_SAFE_INTEGER;
		returnData.yMin = Number.MAX_SAFE_INTEGER;
		returnData.xMax = Number.MIN_SAFE_INTEGER;
		returnData.yMax = Number.MIN_SAFE_INTEGER;
		let px, py;
		for (let i = 0; i < points.length; i += 2) {
			px = points[i];
			py = points[i + 1];
			returnData.xMin = Math.min(returnData.xMin, px);
			returnData.yMin = Math.min(returnData.yMin, py);
			returnData.xMax = Math.max(returnData.xMax, px);
			returnData.yMax = Math.max(returnData.yMax, py);
		}
		return returnData;
	}

	/**
	 *
	 * Triangulate a polygon (convex, concave, complex)
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @param {array=} returnData - Array to put data
	 * @return {number[]}
	 *
	 * return array of input points that is connected to make triangles
	 *
	 * Ex: input: [0,0, 1,-1, 2,0, 1,1], result: [0,1,2, 0,2,3], triangle: [[0,0, 1,-1, 2,0], [0,0, 2,0, 1,1]]
	 *
	 * @example
	 * Geometry.triPoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	 * //[0, 1, 2, 0, 2, 3, 0, 3, 4]
	 *
	 * @function triPoly
	 * @memberof Geometry
	 **/
	function Geometry_triPoly(points, returnData) {
		returnData = _helper0(returnData, "_a_");
		let n, i, al, i0, i1, i2, ax, ay, bx, by, cx, cy, eF, vi;
		n = points.length >> 1;
		if (n < 3) {
			return returnData.concat(points);
		}
		_helper1();
		for (i = 0; i < n; i++) {
			_memory_2_.push(i);
		}

		i = 0;
		al = n;
		while (al > 3) {
			i0 = _memory_2_[(i + 0) % al];
			i1 = _memory_2_[(i + 1) % al];
			i2 = _memory_2_[(i + 2) % al];

			ax = points[2 * i0];
			ay = points[2 * i0 + 1];
			bx = points[2 * i1];
			by = points[2 * i1 + 1];
			cx = points[2 * i2];
			cy = points[2 * i2 + 1];

			eF = false;
			if (Geometry_sideLine(ax, ay, bx, by, cx, cy) >= 0) {
				eF = true;
				for (let j = 0; j < al; j++) {
					vi = _memory_2_[j];
					if (vi == i0 || vi == i1 || vi == i2) {
						continue;
					}
					if (Geometry_colliTriPnt(ax, ay, bx, by, cx, cy, points[2 * vi], points[2 * vi + 1])) {
						eF = false;
						break;
					}
				}
			}
			if (eF) {
				_memory_1_.push(i0, i1, i2);
				_memory_2_.splice((i + 1) % al, 1);
				al--;
				i = 0;
			} else if (i++ > 3 * al) {
				break; // no convex angles :(
			}
		}
		_memory_1_.push(_memory_2_[0], _memory_2_[1], _memory_2_[2]);
		return returnData.concat(_memory_1_);
	}

	/**
	 *
	 * Calculate area of a polygon (convex, concave, complex)
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @return {number}
	 *
	 * @example
	 * Geometry.areaPoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	 * //7500
	 *
	 * @function areaPoly
	 * @memberof Geometry
	 **/
	function Geometry_areaPoly(points) {
		let area = 0,
			len = points.length,
			nexti;
		for (let i = 0; i < len; i += 2) {
			if (len <= 0) {
				nexti = 0;
			} else {
				nexti = (i + 2) % len;
				if (nexti < 0) {
					nexti += len;
				}
			}
			area += points[i] * points[nexti + 1] - points[i + 1] * points[nexti];
		}
		return Math.abs(area / 2);
	}

	/**
	 *
	 * Find centroid of a polygon (convex, concave, complex)
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Geometry.centroidPoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	 * //{x: 38.888888888888886, y: 50}
	 *
	 * @function centroidPoly
	 * @memberof Geometry
	 **/
	function Geometry_centroidPoly(points, returnData) {
		returnData = _helper0(returnData, "_o_");
		returnData.x = 0.0;
		returnData.y = 0.0;
		let	x1, x2, y1, y2, f, area;
		for (let i = 0; i < points.length - 2; i += 2) {
			x1 = points[i];
			y1 = points[i + 1];
			x2 = points[i + 2];
			y2 = points[i + 3];

			f = x1 * y2 - x2 * y1;
			returnData.x += (x1 + x2) * f;
			returnData.y += (y1 + y2) * f;
		}
		x1 = points[points.length - 2];
		y1 = points[points.length - 1];
		x2 = points[0];
		y2 = points[1];
		f = x1 * y2 - x2 * y1;
		returnData.x += (x1 + x2) * f;
		returnData.y += (y1 + y2) * f;
		area = Geometry_areaPoly(points);
		returnData.x /= 6.0 * area;
		returnData.y /= 6.0 * area;
		return returnData;
	}

	/**
	 *
	 * Find convex hull of a set of points
	 *
	 * @param {number[]} points - array of points [[x1, y1], [x2, y2], ...]
	 * @param {array=} returnData - Array to put data
	 * @return {number[]}
	 *
	 * @example
	 * Geometry.convexHullPoly([[0, 0], [50, 0], [100, 50], [50, 100], [0, 100]]);
	 * //[[0, 0], [50, 0], [100, 50], [50, 100], [0, 100]]
	 *
	 * @function convexHullPoly
	 * @memberof Geometry
	 **/
	function Geometry_convexHullPoly(points, returnData) {
		_helper1();
		let i;

		points.sort(function(a, b) {
			return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0];
		});
		for (i = 0; i < points.length; i++) {
			while (_memory_1_.length >= 2 && Geometry_sideLine(_memory_1_[_memory_1_.length - 2][0], _memory_1_[_memory_1_.length - 2][1], _memory_1_[_memory_1_.length - 1][0], _memory_1_[_memory_1_.length - 1][1], points[i][0], points[i][1]) <= 0) {
				_memory_1_.pop();
			}
			_memory_1_.push(points[i]);
		}
		for (i = points.length - 1; i >= 0; i--) {
			while (_memory_2_.length >= 2 && Geometry_sideLine(_memory_2_[_memory_2_.length - 2][0], _memory_2_[_memory_2_.length - 2][1], _memory_2_[_memory_2_.length - 1][0], _memory_2_[_memory_2_.length - 1][1], points[i][0], points[i][1]) <= 0) {
				_memory_2_.pop();
			}
			_memory_2_.push(points[i]);
		}
		_memory_2_.pop();
		_memory_1_.pop();
		return returnData.concat(_memory_1_, _memory_2_);
	}

	/**
	 *
	 * Finds the closest point of a polygon (convex, concave, ~~complex~~) that lay on ray
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @param {number} a_x - x position of vertex point of the ray
	 * @param {number} a_y - y position of vertex point of the ray
	 * @param {number} b_x - x position of direction point of the ray
	 * @param {number} b_y - y position of direction point of the ray
	 * @param {object=} returnData - Object to put data
	 * @return {{dist: number, edge: number, norm_x: number, norm_y: number, refl_x: number, refl_y: number}}
	 *
	 * "dist" is the distance of the polygon point, "edge" is the number of the edge, on which intersection occurs, "norm" is the normal in that place, "refl" is reflected direction
	 *
	 * @example
	 * Geometry.distPolyRay([0, 0, 50, 0, 100, 50, 50, 100, 0, 100], 25, -10, 25, -9);
	 * //{dist: 26.570660511172846, edge: 1, norm_x: -0.7071067811865476, norm_y: 0.7071067811865476, refl_x: -9.000000000000007, refl_y: 25.000000000000007}
	 *
	 * @function distPolyRay
	 * @memberof Geometry
	 **/
	function Geometry_distPolyRay(points, a_x, a_y, b_x, b_y, returnData) {
		let len = points.length - 2,
			a1 = _poly_stack_[0],
			a2 = _poly_stack_[1],
			b1 = _poly_stack_[2],
			b2 = _poly_stack_[3],
			c = _poly_stack_[4],
			nisc;
		a1.x = a_x;
		a1.y = a_y;
		a2.x = a_x + b_x;
		a2.y = a_y + b_y;

		returnData = _helper0(returnData, "_o_");
		returnData.dist = Infinity;
		returnData.edge = 0;
		returnData.norm_x = 0;
		returnData.norm_y = 0;
		returnData.refl_x = 0;
		returnData.refl_y = 0;

		for (let i = 0; i < len; i += 2) {
			b1.x = points[i];
			b1.y = points[i + 1];
			b2.x = points[i + 2];
			b2.y = points[i + 3];
			nisc = _helper22(a1, a2, b1, b2, c);
			if (nisc) _helper17(b_x, b_y, a1, b1, b2, c, i / 2, returnData);
		}
		b1.x = b2.x;
		b1.y = b2.y;
		b2.x = points[0];
		b2.y = points[1];
		nisc = _helper22(a1, a2, b1, b2, c);
		if (nisc) _helper17(b_x, b_y, a1, b1, b2, c, (points.length / 2) - 1, returnData);

		return returnData;
	}

	/**
	 *
	 * Finds the point on polygon edges (convex, concave, complex), which is closest to the point
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @param {number} x - x position of the point
	 * @param {number} y - y position of the point
	 * @param {object=} returnData - Object to put data
	 * @return {{dist: number, edge: number, norm_x: number, norm_y: number, point_x: number, point_y: number}}
	 *
	 * "dist" is the distance of the polygon point, "edge" is the number of the closest edge, "point" is the closest point on that edge, "norm" is the normal from "point" to the point
	 *
	 * @example
	 * Geometry.intrPolyPnt([0, 0, 50, 0, 100, 50, 50, 100, 0, 100], 200, 200);
	 * //{dist: 176.7766952966369, edge: 2, norm_x: 0.7071067811865475, norm_y: 0.7071067811865475, point_x: 75, point_y: 75}
	 *
	 * @function intrPolyPnt
	 * @memberof Geometry
	 **/
	function Geometry_intrPolyPnt(points, x, y, returnData) {
		let len = points.length - 2, idst;
		returnData = _helper0(returnData, "_o_");
		returnData.dist = Infinity;
		returnData.edge = 0;
		returnData.point_x = 0;
		returnData.point_y = 0;
		returnData.norm_x = 0;
		returnData.norm_y = 0;

		_poly_stack_[0].x = x;
		_poly_stack_[0].y = y;
		for (let i = 0; i < len; i += 2) {
			_poly_stack_[2].x = points[i];
			_poly_stack_[2].y = points[i + 1];
			_poly_stack_[3].x = points[i + 2];
			_poly_stack_[3].y = points[i + 3];
			_helper18(_poly_stack_[0], _poly_stack_[2], _poly_stack_[3], i >> 1, returnData);
		}
		_poly_stack_[2].x = _poly_stack_[3].x;
		_poly_stack_[2].y = _poly_stack_[3].y;
		_poly_stack_[3].x = points[0];
		_poly_stack_[3].y = points[1];
		_helper18(_poly_stack_[0], _poly_stack_[2], _poly_stack_[3], len >> 1, returnData);
		idst = 1 / returnData.dist;
		returnData.norm_x = (x - returnData.point_x) * idst;
		returnData.norm_y = (y - returnData.point_y) * idst;
		return returnData;
	}

	/**
	 *
	 * Reverse point sequence of a polygon
	 *
	 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	 * @param {array=} returnData - Array to put data
	 * @return {number[]}
	 *
	 * @example
	 * Geometry.reversePoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	 * //[0, 100, 50, 100, 100, 50, 50, 0, 0, 0]
	 *
	 * @function reversePoly
	 * @memberof Geometry
	 **/
	function Geometry_reversePoly(points, returnData) {
		returnData = _helper0(returnData, "_a_");
		for (let j = points.length - 2; j >= 0; j -= 2) {
			returnData.push(points[j], points[j + 1]);
		}
		return returnData;
	}

	//Accel
	/**
	 *
	 * Calculates the time required to move with acceleration [a] from speed [u] to speed [v]
	 *
	 * @param {number} u - current speed
	 * @param {number} v - target speed
	 * @param {number} a - acceleration
	 * @return {number}
	 *
	 * @example
	 * Geometry.timeAccel(1, 5, 0.1);
	 * //40
	 *
	 * @function timeAccel
	 * @memberof Geometry
	 **/
	function Geometry_timeAccel(u, v, a) {
		return (v - u) / a;
	}

	/**
	 *
	 * Calculates the acceleration needed to move from speed [u] to speed [v] in time [t]
	 *
	 * @param {number} u - current speed
	 * @param {number} v - target speed
	 * @param {number} t - time
	 * @return {number}
	 *
	 * @example
	 * Geometry.accelAccel(1, 5, 40);
	 * //0.1
	 *
	 * @function accelAccel
	 * @memberof Geometry
	 **/
	function Geometry_accelAccel(u, v, t) {
		return (v - u) / t;
	}

	/**
	 *
	 * Calculates the acceleration needed to cover distance [s] with starting speed [u] and max speed [v]
	 *
	 * @param {number} u - current speed
	 * @param {number} v - target speed
	 * @param {number} s - distance
	 * @return {number}
	 *
	 * @example
	 * Geometry.distAccel(1, 5, 50);
	 * //0.24
	 *
	 * @function distAccel
	 * @memberof Geometry
	 **/
	function Geometry_distAccel(u, v, s) {
		return (v * v - u * u) / (2 * s);
	}

	/**
	 *
	 * Calculates the time needed to cover distance [s] with acceleration [a] and base speed [u]
	 *
	 * @param {number} u - current speed
	 * @param {number} s - distance
	 * @param {number} a - acceleration
	 * @return {number}
	 *
	 * @example
	 * Geometry.timeDistAccel(1, 50, 0.24);
	 * //16.666666666666668
	 *
	 * @function timeDistAccel
	 * @memberof Geometry
	 **/
	function Geometry_timeDistAccel(u, s, a) {
		let discr = u * u - 4 * a * -s * 0.5;
		if (discr < 0) {
			return -1;
		}
		let temp = Math.sqrt(discr);
		return Math.abs(Math.max((-u + temp) / a, (-u - temp) / a));
	}

	/**
	 *
	 *All of functions that related to Vector
	 *
	 * @namespace Vector
	 *
	 **/
	//Have heavy relationship with complex number, where re: x and im: y
	/**
	 *
	 * Convert cartesian to polar coordinates
	 *
	 * @param {number} x - x position
	 * @param {number} y - y position
	 * @param {object=} returnData - Object to put data
	 * @return {{angle: number, radial: number}}
	 *
	 * @example
	 * Math.pol(1, 0);
	 * //{angle: 0, radial: 1}
	 *
	 * @function pol
	 * @memberof Vector
	 **/
	function Math_pol(x, y, returnData) {
		returnData = _helper0(returnData, "_o_");
		returnData.angle = Geometry_getAngle(0, 0, x, y);
		returnData.radial = Geometry_distPnt(0, 0, x, y, true);
		return returnData;
	}

	/**
	 *
	 * Convert polar to cartesian coordinates
	 *
	 * @param {number} x - x position
	 * @param {number} y - y position
	 * @param {number} radial - r
	 * @param {number} angle - angle
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Math.rec(0, 0, 1, 0);
	 * //{x: 1, y: 0}
	 *
	 * @function rec
	 * @memberof Vector
	 **/
	function Math_rec(x, y, radial, angle, returnData) {
		returnData = _helper0(returnData, "_o_");
		returnData.x = Math.cos(angle) * radial + x;
		returnData.y = Math.sin(angle) * radial + y;
		return returnData;
	}

	/**
	 *
	 * Normalize vector as scaling r to 1
	 *
	 * @param {number} x - x position
	 * @param {number} y - y position
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Math.normVec(2, 0);
	 * //{x: 1, y: 0}
	 *
	 * @function normVec
	 * @memberof Vector
	 **/
	function Math_normVec(x, y, returnData) {
		returnData = _helper0(returnData, "_o_");
		let length = Math_magVec(x, y, true);
		returnData.x = x / length;
		returnData.y = y / length;
		return returnData;
	}

	/**
	 *
	 * Scale vector
	 *
	 * @param {number} x - x position
	 * @param {number} y - y position
	 * @param {number} scale - scale position
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Math.scaleVec(2, 0, 2);
	 * //{x: 4, y: 0}
	 *
	 * @function scaleVec
	 * @memberof Vector
	 **/
	function Math_scaleVec(x, y, scale, returnData) {
		returnData = _helper0(returnData, "_o_");
		returnData.x = x * scale;
		returnData.y = y * scale;
		return returnData;
	}

	/**
	 *
	 * Truncate vector to r = 1
	 *
	 * @param {number} x - x position
	 * @param {number} y - y position
	 * @param {number} num - truncate ratio
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Math.truncVec(4, 0, 1);
	 * //{x: 0.25, y: 0}
	 *
	 * @function truncVec
	 * @memberof Vector
	 **/
	function Math_truncVec(x, y, num, returnData) {
		let scale = num / Math_magVec(x, y);
		scale = scale < 1.0 ? scale : 1.0;
		return Math_scaleVec(x, y, scale, returnData);
	}

	/**
	 *
	 * Calculate magnitude of vector
	 *
	 * @param {number} x - x position
	 * @param {number} y - y position
	 * @param {boolean=} [square=false] - `false` if magnitude squared
	 * @return {number}
	 *
	 * @example
	 * Math.magVec(4, 0, true);
	 * //4
	 *
	 * @function magVec
	 * @memberof Vector
	 **/
	function Math_magVec(x, y, square) {
		let tempUnSq = Math_dotVec(x, y, x, y);
		if (square) {
			return Math.sqrt(tempUnSq);
		} else {
			return tempUnSq;
		}
	}

	/**
	 *
	 * Calculate dot product of two vectors
	 *
	 * @param {number} a_x - x position of first vector
	 * @param {number} a_y - y position of first vector
	 * @param {number} b_x - x position of second vector
	 * @param {number} b_y - y position of second vector
	 * @return {number}
	 *
	 * @example
	 * Math.dotVec(5, 0, 5, 5);
	 * //25
	 *
	 * @function dotVec
	 * @memberof Vector
	 **/
	function Math_dotVec(a_x, a_y, b_x, b_y) {
		//Heavily related to cosine
		return a_x * b_x + a_y * b_y;
	}

	/**
	 *
	 * Calculate cross product of two vectors
	 *
	 * @param {number} a_x - x position of first vector
	 * @param {number} a_y - y position of first vector
	 * @param {number} b_x - x position of second vector
	 * @param {number} b_y - y position of second vector
	 * @return {number}
	 *
	 * @example
	 * Math.crossVec(5, 0, 5, 5);
	 * //25
	 *
	 * @function crossVec
	 * @memberof Vector
	 **/
	function Math_crossVec(a_x, a_y, b_x, b_y) {
		//Heavily related to sine
		//Also called wedge ? And determinant ?
		return a_x * b_y - a_y * b_x;
	}

	/**
	 *
	 * Calculate projection vector from two vectors
	 *
	 * @param {number} a_x - x position of first vector
	 * @param {number} a_y - y position of first vector
	 * @param {number} b_x - x position of second vector
	 * @param {number} b_y - y position of second vector
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Math.projVec(5, 0, 5, 5);
	 * //{x: 2.5, y: 2.5}
	 *
	 * @function projVec
	 * @memberof Vector
	 **/
	function Math_projVec(a_x, a_y, b_x, b_y, returnData) {
		return Math_scaleVec(b_x, b_y, Math_dotVec(a_x, a_y, b_x, b_y) / Math_magVec(b_x, b_y, false), returnData);
	}

	/**
	 *
	 * Calculate rejection vector from two vectors
	 *
	 * @param {number} a_x - x position of first vector
	 * @param {number} a_y - y position of first vector
	 * @param {number} b_x - x position of second vector
	 * @param {number} b_y - y position of second vector
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Math.rejVec(5, 0, 5, 5);
	 * //{x: 2.5, y: -2.5}
	 *
	 * @function rejVec
	 * @memberof Vector
	 **/
	function Math_rejVec(a_x, a_y, b_x, b_y, returnData) {
		Math.projVec(a_x, a_y, b_x, b_y, returnData);
		returnData.x = a_x - returnData.x;
		returnData.y = a_y - returnData.y;
		return returnData;
	}

	/**
	 *
	 * Calculate per product from vector
	 *
	 * @param {number} x - x position
	 * @param {number} y - y position
	 * @param {object=} returnData - Object to put data
	 * @return {{x1: number, y1: number, x2: number, y2: number}}
	 *
	 * @example
	 * Math.perVec(5, 0);
	 * //{x1: -0, y1: 5, x2: 0, y2: -5}
	 *
	 * @function perVec
	 * @memberof Vector
	 **/
	function Math_perVec(x, y, returnData) {
		returnData = _helper0(returnData, "_o_");
		returnData.x1 = -y;
		returnData.y1 = x;
		returnData.x2 = y;
		returnData.y2 = -x;
		return returnData;
	}

	/**
	 *
	 * Interpolates from two vectors
	 *
	 * @param {number} a_x - x position of first vector
	 * @param {number} a_y - y position of first vector
	 * @param {number} b_x - x position of second vector
	 * @param {number} b_y - y position of second vector
	 * @param {number} scale
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Math.lerpVec(5, 0, 5, 5, 0.5);
	 * //{x: 5, y: 2.5}
	 *
	 * @function lerpVec
	 * @memberof Vector
	 **/
	function Math_lerpVec(a_x, a_y, b_x, b_y, scale, returnData) {
		returnData = _helper0(returnData, "_o_");
		returnData.x = (b_x - a_x) * scale + a_x;
		returnData.y = (b_y - a_y) * scale + a_y;
		return returnData;
	}

	/**
	 *
	 * Calculate angle of vector
	 *
	 * @param {number} x - x position
	 * @param {number} y - y position
	 * @return {number}
	 *
	 *Angle in radians
	 *
	 * @example
	 * Math.headVec(5, 5);
	 * //0.7853981633974483
	 *
	 * @function headVec
	 * @memberof Vector
	 **/
	function Math_headVec(x, y) {
		return -Math.atan2(-y, x);
	}

	/**
	 *
	 * Reverse vector
	 *
	 * @param {number} x - x position
	 * @param {number} y - y position
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Math.revVec(5, 0);
	 * //{x: -5, y: 0}
	 *
	 * @function revVec
	 * @memberof Vector
	 **/
	function Math_revVec(x, y, returnData) {
		returnData = _helper0(returnData, "_o_");
		returnData.x *= -1;
		returnData.y *= -1;
		return returnData;
	}

	/**
	 *
	 * Check if second vector is on the right of first vector
	 *
	 * @param {number} a_x - x position of first vector
	 * @param {number} a_y - y position of first vector
	 * @param {number} b_x - x position of second vector
	 * @param {number} b_y - y position of second vector
	 * @return {boolean}
	 *
	 * @example
	 * Math.clockWiseVec(0, 5, 5, 0);
	 * //true
	 *
	 * @function clockWiseVec
	 * @memberof Vector
	 **/
	function Math_clockWiseVec(a_x, a_y, b_x, b_y) {
		return -a_x * b_y + a_y * b_x > 0;
	}

	/**
	 *
	 * All of functions that related to Trigonometry
	 *
	 * @namespace Trigonometry
	 *
	 **/

	/**
	 *
	 * [Sinc function]{@link https://en.wikipedia.org/wiki/Sinc_function}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.sinc(Math_HALF_PI);
	 * //-0.19765087483668042
	 *
	 * @function sinc
	 * @memberof Trigonometry
	 **/
	function Math_sinc(num) {
		if (Number.isNaN(num)) {
			return NaN;
		}
		if (!Number.isFinite(num)) {
			return 0.0;
		}
		if (num === 0.0) {
			return 1.0;
		}
		return Math.sin(num * Math.PI) / (num * Math.PI);
	}

	/**
	 *
	 * [Chord function]{@link https://en.wikipedia.org/wiki/Chord_(geometry)#Chords_in_trigonometry}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.crd(Math_HALF_PI);
	 * //1.414213562373095
	 *
	 * @function crd
	 * @memberof Trigonometry
	 **/
	function Math_crd(num) {
		return 2 * Math.sin(num / 2);
	}

	/**
	 *
	 * [Exsecant function]{@link https://en.wikipedia.org/wiki/Exsecant#Exsecant}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.exsec(1);
	 * //0.8508157176809255
	 *
	 * @function exsec
	 * @memberof Trigonometry
	 **/
	function Math_exsec(num) {
		return Math_sec(num) - 1;
	}

	/**
	 *
	 * [Excosecant function]{@link https://en.wikipedia.org/wiki/Exsecant#Excosecant}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.excsc(1);
	 * //0.18839510577812124
	 *
	 * @function excsc
	 * @memberof Trigonometry
	 **/
	function Math_excsc(num) {
		return Math_csc(num) - 1;
	}

	/**
	 *
	 * [Arcexsecant function]{@link https://en.wikipedia.org/wiki/Exsecant#Inverse_functions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.aexsec(-2);
	 * //0.3183098861837907
	 *
	 * @function aexsec
	 * @memberof Trigonometry
	 **/
	function Math_aexsec(num) {
		return Math_asec(num + 1);
	}

	/**
	 *
	 * [Arcexcosecant function]{@link https://en.wikipedia.org/wiki/Exsecant#Inverse_functions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.aexcsc(-2);
	 * //-0.6366197723675814
	 *
	 * @function aexcsc
	 * @memberof Trigonometry
	 **/
	function Math_aexcsc(num) {
		return Math_acsc(num + 1);
	}

	/**
	 *
	 * [Versine function]{@link https://en.wikipedia.org/wiki/Versine}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.vsin(Math_HALF_PI);
	 * //0.9999999999999999
	 *
	 * @function vsin
	 * @memberof Trigonometry
	 **/
	function Math_vsin(num) {
		return 1 - Math.cos(num);
	}

	/**
	 *
	 * [Vercosine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.vcos(Math_HALF_PI);
	 * //1
	 *
	 * @function vcos
	 * @memberof Trigonometry
	 **/
	function Math_vcos(num) {
		return 1 + Math.cos(num);
	}

	/**
	 *
	 * [Coversine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.cvsin(Math_HALF_PI);
	 * //0
	 *
	 * @function cvsin
	 * @memberof Trigonometry
	 **/
	function Math_cvsin(num) {
		return 1 - Math.sin(num);
	}

	/**
	 *
	 * [Covercosine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.cvcos(Math_HALF_PI);
	 * //2
	 *
	 * @function cvcos
	 * @memberof Trigonometry
	 **/
	function Math_cvcos(num) {
		return 1 + Math.sin(num);
	}

	/**
	 *
	 * [Haversine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.hvsin(Math_HALF_PI);
	 * //0.49999999999999994
	 *
	 * @function hvsin
	 * @memberof Trigonometry
	 **/
	function Math_hvsin(num) {
		return Math_vsin(num) / 2;
	}

	/**
	 *
	 * [Havercosine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.hvcos(Math_HALF_PI);
	 * //0.5
	 *
	 * @function hvcos
	 * @memberof Trigonometry
	 **/
	function Math_hvcos(num) {
		return Math_vcos(num) / 2;
	}

	/**
	 *
	 * [Hacoversine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.hcvsin(Math_HALF_PI);
	 * //0
	 *
	 * @function hcvsin
	 * @memberof Trigonometry
	 **/
	function Math_hcvsin(num) {
		return Math_cvsin(num) / 2;
	}

	/**
	 *
	 * [Hacovercosine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.hcvcos(Math_HALF_PI);
	 * //1
	 *
	 * @function hcvcos
	 * @memberof Trigonometry
	 **/
	function Math_hcvcos(num) {
		return Math_cvcos(num) / 2;
	}

	/**
	 *
	 * [Arcversine function]{@link https://en.wikipedia.org/wiki/Versine#Inverse_functions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.avsin(0.5);
	 * //1.0471975511965979
	 *
	 * @function avsin
	 * @memberof Trigonometry
	 **/
	function Math_avsin(num) {
		return Math.acos(1 - num);
	}

	/**
	 *
	 * [Arcvercosine function]{@link https://en.wikipedia.org/wiki/Versine#Inverse_functions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.avcos(-0.5);
	 * //1.0471975511965979
	 *
	 * @function avcos
	 * @memberof Trigonometry
	 **/
	function Math_avcos(num) {
		return Math.acos(1 + num);
	}

	/**
	 *
	 * [Arccoversine function]{@link https://en.wikipedia.org/wiki/Versine#Inverse_functions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.acvsin(-0.5);
	 * //0.5235987755982989
	 *
	 * @function acvsin
	 * @memberof Trigonometry
	 **/
	function Math_acvsin(num) {
		return Math.asin(1 - num);
	}

	/**
	 *
	 * [Arccovercosine function]{@link https://en.wikipedia.org/wiki/Versine#Inverse_functions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.acvcos(-0.5);
	 * //0.5235987755982989
	 *
	 * @function acvcos
	 * @memberof Trigonometry
	 **/
	function Math_acvcos(num) {
		return Math.asin(1 + num);
	}

	/**
	 *
	 * [Archaversine function]{@link https://en.wikipedia.org/wiki/Versine#Inverse_functions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.ahvsin(0.5);
	 * //1.5707963267948968
	 *
	 * @function ahvsin
	 * @memberof Trigonometry
	 **/
	function Math_ahvsin(num) {
		return 2 * Math.asin(Math.sqrt(num));
	}

	/**
	 *
	 * [Archavercosine function]{@link https://en.wikipedia.org/wiki/Versine#Inverse_functions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.ahvcos(0.5);
	 * //1.5707963267948966
	 *
	 * @function ahvcos
	 * @memberof Trigonometry
	 **/
	function Math_ahvcos(num) {
		return 2 * Math.acos(Math.sqrt(num));
	}

	/**
	 *
	 * [Cosecant function]{@link https://en.wikipedia.org/wiki/Trigonometric_functions#Cosecant.2C_secant.2C_and_cotangent}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.csc(Math_HALF_PI);
	 * //1
	 *
	 * @function csc
	 * @memberof Trigonometry
	 **/
	function Math_csc(num) {
		return 1 / Math.sin(num);
	}

	/**
	 *
	 * [Hyperbolic cosecant function]{@link https://en.wikipedia.org/wiki/Hyperbolic_function#Definitions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.csch(Math_HALF_PI);
	 * //0.4345372080946958
	 *
	 * @function csch
	 * @memberof Trigonometry
	 **/
	function Math_csch(num) {
		return 1 / Math.sinh(num);
	}

	/**
	 *
	 * [Secant function]{@link https://en.wikipedia.org/wiki/Trigonometric_functions#Cosecant.2C_secant.2C_and_cotangent}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.sec(0);
	 * //1
	 *
	 * @function sec
	 * @memberof Trigonometry
	 **/
	function Math_sec(num) {
		return 1 / Math.cos(num);
	}

	/**
	 *
	 * [Hyperbolic secant function]{@link https://en.wikipedia.org/wiki/Hyperbolic_function#Definitions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.sech(Math_HALF_PI);
	 * //0.3985368153383867
	 *
	 * @function sech
	 * @memberof Trigonometry
	 **/
	function Math_sech(num) {
		return 1 / Math.cosh(num);
	}

	/**
	 *
	 * [Cotangent function]{@link https://en.wikipedia.org/wiki/Trigonometric_functions#Cosecant.2C_secant.2C_and_cotangent}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.cot(Math_HALF_PI);
	 * //6.123233995736766e-17
	 *
	 * @function cot
	 * @memberof Trigonometry
	 **/
	function Math_cot(num) {
		return 1 / Math.tan(num);
	}

	/**
	 *
	 * [Hyperbolic cotangent function]{@link https://en.wikipedia.org/wiki/Hyperbolic_function#Definitions}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.coth(Math_HALF_PI);
	 * //1.0903314107273683
	 *
	 * @function coth
	 * @memberof Trigonometry
	 **/
	function Math_coth(num) {
		return 1 / Math.tanh(num);
	}

	/**
	 *
	 * [Arccosecant function]{@link https://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Basic_properties}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.acsc(0.5);
	 * //1.9098593171027438
	 *
	 * @function acsc
	 * @memberof Trigonometry
	 **/
	function Math_acsc(num) {
		return Math.asin(1 / num);
	}

	/**
	 *
	 * [Hyperbolic arccosecant function]{@link https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.acsch(0.5);
	 * //2.0780869212350273
	 *
	 * @function acsch
	 * @memberof Trigonometry
	 **/
	function Math_acsch(num) {
		return Math.asinh(1 / num);
	}

	/**
	 *
	 * [Arcsecant function]{@link https://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Basic_properties}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.asec(0.5);
	 * //0.9549296585513719
	 *
	 * @function asec
	 * @memberof Trigonometry
	 **/
	function Math_asec(num) {
		return Math.acos(1 / num);
	}

	/**
	 *
	 * [Hyperbolic arcsecant function]{@link https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.asech(1.5);
	 * //1.0390434606175136
	 *
	 * @function asech
	 * @memberof Trigonometry
	 **/
	function Math_asech(num) {
		return Math.acosh(1 / num);
	}

	/**
	 *
	 * [Arccotangent function]{@link https://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Basic_properties}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.acot(0.5);
	 * //2.15681043229161
	 *
	 * @function acot
	 * @memberof Trigonometry
	 **/
	function Math_acot(num) {
		return Math.atan(1 / num);
	}

	/**
	 *
	 * [Hyperbolic arccotangent function]{@link https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms}
	 *
	 * @param {number} num
	 * @return {number}
	 *
	 * @example
	 * Math.acoth(0.5);
	 * //1.820478453253675
	 *
	 * @function acoth
	 * @memberof Trigonometry
	 **/
	function Math_acoth(num) {
		return Math.atanh(1 / num);
	}

	/**
	 *
	 * Calculate cosine and sine at a same time
	 *
	 * @param {number} num
	 * @param {array=} returnData - Array to put data
	 * @return {number[]}
	 * 
	 * Cosine on the left, sine on the right
	 *
	 * @example
	 * Math.cssn(Math_HALF_PI);
	 * //[0, 1]
	 *
	 * @function cssn
	 * @memberof Trigonometry
	 **/
	function Math_cssn(num, returnData) {
		let temp = Math.sin(num);
		returnData = _helper0(returnData, "_a_");
		returnData[0] = Math.sqrt(1 - temp * temp);
		returnData[1] = temp;
		return returnData;
	}

	/**
	 *
	 * All of functions that dealing with checking a number
	 *
	 * @namespace Number
	 *
	 **/

	/**
	 *
	 * Check if a number is prime
	 *
	 * @param {number} num
	 * @return {boolean}
	 *
	 * @example
	 * Number.isPrime(199);
	 * //true
	 *
	 * @function isPrime
	 * @memberof Number
	 **/
	function Number_isPrime(num) {
		if (Number.isNaN(num) || !Number.isFinite(num) || num < 2) return false;
		if (num == _helper9(num)) return true;
		return false;
	}

	/**
	 *
	 * Check if negative zero
	 *
	 * @param {number} num
	 * @return {boolean}
	 *
	 * @example
	 * Number.isMinusZero(-0);
	 * //true
	 *
	 * @function isMinusZero
	 * @memberof Number
	 **/
	function Number_isMinusZero(num) {
		return 1 / num === -Infinity;
	}

	/**
	 *
	 * Check if a number is even
	 *
	 * @param {number} num
	 * @return {boolean}
	 *
	 * @example
	 * Number.isEven(2);
	 * //true
	 *
	 * @function isEven
	 * @memberof Number
	 **/
	function Number_isEven(num) {
		return Number.isInteger(num) && (num & 1) === 0; //!(num % 2);
	}

	/**
	 *
	 * Check if input is legal numeric
	 *
	 * @param {*} num
	 * @return {boolean}
	 *
	 * @example
	 * Number.isNumeric("2");
	 * //true
	 *
	 * @function isNumeric
	 * @memberof Number
	 **/
	function Number_isNumeric(num) {
		return !(Object.prototype.toString.call(num) === "[object Array]") && (num - parseFloat(num) + 1) >= 0;
	}

	/**
	 *
	 * Check if number is power of 2
	 *
	 * @param {number} num
	 * @return {boolean}
	 *
	 * @example
	 * Number.isPOT(4);
	 * //true
	 *
	 * @function isPOT
	 * @memberof Number
	 **/
	function Number_isPOT(num) {
		return num !== 0 && (num & (num - 1)) === 0;
	}

	/**
	 *
	 * Calculate epsilon of current machine (may equal to Number.EPSILON)
	 *
	 * @return {number}
	 *
	 * @example
	 * Number.epsilon();
	 * //2.220446049250313e-16
	 *
	 * @function epsilon
	 * @memberof Number
	 **/
	function Number_epsilon() {
		if (Number.EPSILON) {
			return Number.EPSILON;
		}
		return Math.abs(1 - _epsilon_1_ * 3);
	}

	/**
	 *
	 * All of functions that related to Tween (see [here]{@link http://easings.net/} for more infos)
	 *
	 * @namespace Tween
	 *
	 **/

	/**
	 *
	 * In Quad
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inQuad(0.25);
	 * //0.0625
	 *
	 * @function inQuad
	 * @memberof Tween
	 **/
	function Tween_inQuad(time) {
		return time * time;
	}

	/**
	 *
	 * Out Quad
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.outQuad(0.25);
	 * //0.4375
	 *
	 * @function outQuad
	 * @memberof Tween
	 **/
	function Tween_outQuad(time) {
		return time * (2 - time);
	}

	/**
	 *
	 * In Out Quad
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutQuad(0.25);
	 * //0.125
	 *
	 * @function inOutQuad
	 * @memberof Tween
	 **/
	function Tween_inOutQuad(time) {
		return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time;
	}

	/**
	 *
	 * In Cubic
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inCubic(0.25);
	 * //0.015625
	 *
	 * @function inCubic
	 * @memberof Tween
	 **/
	function Tween_inCubic(time) {
		return oldPow(time, 3);
	}

	/**
	 *
	 * Out Cubic
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.outCubic(0.25);
	 * //0.578125
	 *
	 * @function outCubic
	 * @memberof Tween
	 **/
	function Tween_outCubic(time) {
		return oldPow(time - 1, 3) + 1;
	}

	/**
	 *
	 * In Out Cubic
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutCubic(0.25);
	 * //0.0625
	 *
	 * @function inOutCubic
	 * @memberof Tween
	 **/
	function Tween_inOutCubic(time) {
		return time < 0.5 ? 4 * oldPow(time, 3) : (time - 1) * oldPow(2 * time - 2, 2) + 1;
	}

	/**
	 *
	 * In Quart
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inQuart(0.25);
	 * //0.00390625
	 *
	 * @function inQuart
	 * @memberof Tween
	 **/
	function Tween_inQuart(time) {
		return oldPow(time, 4);
	}

	/**
	 *
	 * Out Quart
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.outQuart(0.25);
	 * //0.68359375
	 *
	 * @function outQuart
	 * @memberof Tween
	 **/
	function Tween_outQuart(time) {
		return 1 - oldPow(time - 1, 4);
	}

	/**
	 *
	 * In Out Quart
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutQuart(0.25);
	 * //0.03125
	 *
	 * @function inOutQuart
	 * @memberof Tween
	 **/
	function Tween_inOutQuart(time) {
		return time < 0.5 ? 8 * oldPow(time, 4) : 1 - 8 * oldPow(time - 1, 4);
	}

	/**
	 *
	 * In Quint
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inQuint(0.25);
	 * //0.0009765625
	 *
	 * @function inQuint
	 * @memberof Tween
	 **/
	function Tween_inQuint(time) {
		return oldPow(time, 5);
	}

	/**
	 *
	 * Out Quint
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.outQuint(0.25);
	 * //0.7626953125
	 *
	 * @function outQuint
	 * @memberof Tween
	 **/
	function Tween_outQuint(time) {
		return 1 + oldPow(time - 1, 5);
	}

	/**
	 *
	 * In Out Quint
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutQuint(0.25);
	 * //0.015625
	 *
	 * @function inOutQuint
	 * @memberof Tween
	 **/
	function Tween_inOutQuint(time) {
		return time < 0.5 ? 16 * oldPow(time, 5) : 1 + 16 * oldPow(time - 1, 5);
	}

	/**
	 *
	 * In Pow (same as quad, cubic,... but modifiable exponent)
	 *
	 * @param {number} time
	 * @param {number} pow - exponent
	 * @return {number}
	 *
	 * @example
	 * Tween.inPow(0.25, 2);
	 * //0.0625
	 *
	 * @function inPow
	 * @memberof Tween
	 **/
	function Tween_inPow(time, pow) {
		return Math_pow(time, pow);
	}

	/**
	 *
	 * Out Pow (same as quad, cubic,... but modifiable exponent)
	 *
	 * @param {number} time
	 * @param {number} pow - exponent
	 * @return {number}
	 *
	 * @example
	 * Tween.outPow(0.25, 2);
	 * //0.4375
	 *
	 * @function outPow
	 * @memberof Tween
	 **/
	function Tween_outPow(time, pow) {
		let check = Number_isEven(pow - 1) ? 1 : -1;
		return 1 + Math_pow(time - 1, pow) * check;
	}

	/**
	 *
	 * In Out Pow (same as quad, cubic,... but modifiable exponent)
	 *
	 * @param {number} time
	 * @param {number} pow - exponent
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutPow(0.25, 2);
	 * //0.125
	 *
	 * @function inOutPow
	 * @memberof Tween
	 **/
	function Tween_inOutPow(time, pow) {
		let temp = Math_pow(2, pow - 1),
			check = Number_isEven(pow - 1) ? 1 : -1;
		return time < 0.5 ? temp * Math_pow(time, pow) : 1 + temp * Math_pow(time - 1, pow) * check;
	}
	
	/**
	 *
	 * In Log
	 *
	 * @param {number} time
	 * @param {number} pow - exponent
	 * @return {number}
	 *
	 * @example
	 * Tween.inLog(0.25, 2);
	 * //0.19264507794239594
	 *
	 * @function inLog
	 * @memberof Tween
	 **/
	function Tween_inLog(time, pow) {
		return 1 - Tween_outLog(1 - time, pow);
	}

	/**
	 *
	 * Out Log
	 *
	 * @param {number} time
	 * @param {number} pow - exponent
	 * @return {number}
	 *
	 * @example
	 * Tween.outLog(0.25, 2);
	 * //0.32192809488736235
	 *
	 * @function outLog
	 * @memberof Tween
	 **/
	function Tween_outLog(time, pow) {
		return Math_log(time * (pow - 1) + 1, pow);
	}

	/**
	 *
	 * In Out Log
	 *
	 * @param {number} time
	 * @param {number} pow - exponent
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutLog(0.25, 2);
	 * //0.2075187496394219
	 *
	 * @function inOutLog
	 * @memberof Tween
	 **/
	function Tween_inOutLog(time, pow) {
		time *= 2;
		if (time < 1) {
			return 0.5 - Tween_outLog(1 - time, pow) / 2;
		}
		return 0.5 + Tween_outLog(time - 1, pow) / 2;
	}

	/**
	 *
	 * In Sine
	 *
	 * @param {number} time
	 * @param {number} pow - exponent
	 * @return {number}
	 *
	 * @example
	 * Tween.inSine(0.25, 1);
	 * //0.07612046748871326
	 *
	 * @function inSine
	 * @memberof Tween
	 **/
	function Tween_inSine(time, pow) {
		return 1 - Math_pow(Math.cos(time * Math_HALF_PI), pow);
	}

	/**
	 *
	 * Out Sine
	 *
	 * @param {number} time
	 * @param {number} pow - exponent
	 * @return {number}
	 *
	 * @example
	 * Tween.outSine(0.25, 1);
	 * //0.3826834323650898
	 *
	 * @function outSine
	 * @memberof Tween
	 **/
	function Tween_outSine(time, pow) {
		return Math_pow(Math.sin(time * Math_HALF_PI), pow);
	}

	/**
	 *
	 * In Out Sine
	 *
	 * @param {number} time
	 * @param {number} pow - exponent
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutSine(0.25, 1);
	 * //0.49999999999999994
	 *
	 * @function inOutSine
	 * @memberof Tween
	 **/
	function Tween_inOutSine(time, pow) {
		time *= 2;
		if (time < 1) {
			return 0.5 - Math_pow(Math.cos(Math.PI * time), pow) / 2;
		}
		return Math_pow(Math.cos(Math.PI * (time - 1)), pow) / 2 + 0.5;
	}

	/**
	 *
	 * In Exponent
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inExpo(0.25);
	 * //0.005524271728019903
	 *
	 * @function inExpo
	 * @memberof Tween
	 **/
	function Tween_inExpo(time) {
		return (time === 0) ? 0 : Math_pow(2, 10 * (time - 1));
	}

	/**
	 *
	 * Out Exponent
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.outExpo(0.25);
	 * //0.8232233047033631
	 *
	 * @function outExpo
	 * @memberof Tween
	 **/
	function Tween_outExpo(time) {
		return (time === 1) ? 1 : (1 - Math_pow(2, -10 * time));
	}

	/**
	 *
	 * In Out Exponent
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutExpo(0.25);
	 * //0.015625
	 *
	 * @function inOutExpo
	 * @memberof Tween
	 **/
	function Tween_inOutExpo(time) {
		if (time === 0) {
			return 0;
		}
		if (time === 1) {
			return 1;
		}
		if (time < 0.5) {
			return Math_pow(2, 20 * time - 11);
		}
		return 1 - Math_pow(2, 9 - 20 * time);
	}

	/**
	 *
	 * In Circular
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inCirc(0.25);
	 * //0.031754163448145745
	 *
	 * @function inCirc
	 * @memberof Tween
	 **/
	function Tween_inCirc(time) {
		return 1 - Math.sqrt(1 - time * time);
	}

	/**
	 *
	 * Out Circular
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.outCirc(0.25);
	 * //0.6614378277661477
	 *
	 * @function outCirc
	 * @memberof Tween
	 **/
	function Tween_outCirc(time) {
		time -= 1;
		return Math.sqrt(1 - time * time);
	}

	/**
	 *
	 * In Out Circular
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutCirc(0.25);
	 * //0.0669872981077807
	 *
	 * @function inOutCirc
	 * @memberof Tween
	 **/
	function Tween_inOutCirc(time) {
		if (time < 0.5) {
			return (1 - Math.sqrt(1 - 4 * time * time)) / 2;
		}
		return (Math.sqrt(-4 * (time - 2) * time - 3) + 1) / 2;
	}

	/**
	 *
	 * In Elastic
	 *
	 * @param {number} time
	 * @param {number} amplitude
	 * @param {number} period
	 * @return {number}
	 *
	 * @example
	 * Tween.inElastic(0.25, 2, 2);
	 * //0.0028595734670659252
	 *
	 * @function inElastic
	 * @memberof Tween
	 **/
	let Tween_inElastic = _helper26.bind(this, 0);

	/**
	 *
	 * Out Elastic
	 *
	 * @param {number} time
	 * @param {number} amplitude
	 * @param {number} period
	 * @return {number}
	 *
	 * @example
	 * Tween.outElastic(0.25, 2, 2);
	 * //1.0915063509461096
	 *
	 * @function outElastic
	 * @memberof Tween
	 **/
	let Tween_outElastic = _helper26.bind(this, 1);

	/**
	 *
	 * In Out Elastic
	 *
	 * @param {number} time
	 * @param {number} amplitude
	 * @param {number} period
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutElastic(0.25, 2, 2);
	 * //0.027063293868263706
	 *
	 * @function inOutElastic
	 * @memberof Tween
	 **/
	let Tween_inOutElastic = _helper26.bind(this, 2);

	/**
	 *
	 * In Back
	 *
	 * @param {number} time
	 * @param {number} overShoot
	 * @param {boolean} isOver - `true` is raw number input
	 * @return {number}
	 *
	 * @example
	 * Tween.inBack(0.25, 2);
	 * //-0.7024967320129584
	 *
	 * @function inBack
	 * @memberof Tween
	 **/
	function Tween_inBack(time, overShoot, isOver) {
		overShoot = overShoot ? (isOver ? overShoot : _helper10(overShoot)) : 1.70158;
		return 1 * time * time * ((overShoot + 1) * time - overShoot);
	}

	/**
	 *
	 * Out Back
	 *
	 * @param {number} time
	 * @param {number} overShoot
	 * @param {boolean} isOver - `true` is raw number input
	 * @return {number}
	 *
	 * @example
	 * Tween.outBack(0.25, 2);
	 * //2.732490196038875
	 *
	 * @function outBack
	 * @memberof Tween
	 **/
	function Tween_outBack(time, overShoot, isOver) {
		overShoot = overShoot ? (isOver ? overShoot : _helper10(overShoot)) : 1.70158;
		return time * (overShoot * ((time - 2) * time + 1) + (time - 3) * time + 3);
	}

	/**
	 *
	 * In Out Back
	 *
	 * @param {number} time
	 * @param {number} overShoot
	 * @param {boolean} isOver - `true` is raw number input
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutBack(0.25, 2);
	 * //-1.3976808550930153
	 *
	 * @function inOutBack
	 * @memberof Tween
	 **/
	function Tween_inOutBack(time, overShoot, isOver) {
		overShoot = overShoot ? (isOver ? overShoot : _helper10(overShoot)) : 1.70158;
		let temp = isOver ? 1 : 1.525, temp2;
		if (time < 0.5) {
			temp2 = time * 2;
			return 2 * time * time * (overShoot * temp * (temp2 - 1) + temp2);
		}
		temp2 = time - 1;
		return 2 * temp2 * temp2 * (overShoot * temp * (2 * time - 1) + 2 * temp2) + 1;
	}

	/**
	 *
	 * In Bounce
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inBounce(0.25);
	 * //0.02734375
	 *
	 * @function inBounce
	 * @memberof Tween
	 **/
	function Tween_inBounce(time) {
		return 1 - Tween_outBounce(1 - time);
	}

	/**
	 *
	 * Out Bounce
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.outBounce(0.25);
	 * //0.47265625
	 *
	 * @function outBounce
	 * @memberof Tween
	 **/
	function Tween_outBounce(time) {
		if (time < _outBounce_1_[0]) {
			return (7.5625 * time * time);
		} else if (time < _outBounce_1_[1]) {
			return (7.5625 * (time -= _outBounce_1_[2]) * time + 0.75);
		} else if (time < _outBounce_1_[3]) {
			return (7.5625 * (time -= _outBounce_1_[4]) * time + 0.9375);
		} else {
			return (7.5625 * (time -= _outBounce_1_[5]) * time + 0.984375);
		}
	}

	/**
	 *
	 * In Out Bounce
	 *
	 * @param {number} time
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutBounce(0.25);
	 * //0.1171875
	 *
	 * @function inOutBounce
	 * @memberof Tween
	 **/
	function Tween_inOutBounce(time) {
		if (time < 0.5) {
			return Tween_inBounce(time * 2) / 2;
		}
		return Tween_outBounce(time * 2 - 1) / 2 + 0.5;
	}

	/**
	 *
	 * Spring
	 *
	 * @param {number} time
	 * @param {number=} [frequency=300]
	 * @param {number=} [friction=200]
	 * @param {number=} [size=0]
	 * @param {number=} [strength=0]
	 * @return {number}
	 *
	 * @example
	 * Tween.spring(0.25);
	 * //1.2447125642905208
	 *
	 * @function spring
	 * @memberof Tween
	 **/
	function Tween_spring(time, frequency, friction, size, strength) {
		frequency = Math.max(1, _helper0(frequency, 300) / 20);
		friction = Math_pow(20, _helper0(friction, 200) / 100);
		size = _helper0(size, 0) / 1000;
		strength = _helper0(strength, 0);

		let temp1, temp2,
			time2 = (size - time) / (size - 1);
		if (time < size) {
			temp1 = _helper24(time2, size, strength);
			temp2 = -Math_asec(_helper24(size / (size - 1), size, strength)) / (frequency * size);
		} else {
			temp1 = Math_pow(friction / 10, -time2) * (1 - time2);
			temp2 = 1;
		}
		return 1 - (temp1 * Math.cos(frequency * (time - size) * temp2));
	}

	/**
	 *
	 * Bounce
	 *
	 * @param {number} time
	 * @param {number=} [bounciness=400]
	 * @param {number=} [elasticity=200]
	 * @param {boolean=} [returnsToSelf=false] - `true` if return back to 0
	 * @return {number}
	 *
	 * @example
	 * Tween.bounce(0.25);
	 * //0.2331217960505344
	 *
	 * @function bounce
	 * @memberof Tween
	 **/
	function Tween_bounce(time, bounciness, elasticity, returnsToSelf) {
		let tempL, tempL2, tempb2, curve2a, curve2b, curve2H, curveLength = 0, gravity = 100;
		bounciness = Math.min(_helper0(bounciness, 400) / 1250, 0.8);
		elasticity = _helper0(elasticity, 200) / 1000;

		for (let j = 0; j < 2; j ++) {
			if (j === 0) {
				tempb2 = Math.sqrt(2 / gravity);
			} else {
				tempb2 = Math.sqrt(2 / (gravity * tempL * tempL));
			}
			curve2a = -tempb2;
			curve2b = tempb2;
			curve2H = 1;
			if (returnsToSelf) {
				curve2a = 0;
				curve2b = curve2b * 2;
			}
			if (j === 1) {
				_helper25(0, curve2a, curve2b, curve2H);
				curveLength ++;
			}
			while (j === 0 ? curve2H > 0.001 : (curve2b < 1 && curve2H > 0.001)) {
				tempL2 = curve2b - curve2a;
				curve2a = curve2b;
				curve2b = curve2b + tempL2 * bounciness;
				if (j === 0) {
					curve2H = curve2H * bounciness * bounciness;
					tempL = curve2b;
				} else {
					curve2H = curve2H * elasticity;
					_helper25(curveLength, curve2a, curve2b, curve2H);
					curveLength ++;
				}
			}
		}

		let returnData, i = 0,
			curve = _bounce_stack_[i];
		while (!(time >= curve.a && time <= curve.b)) {
			i += 1;
			curve = _bounce_stack_[i];
			if (i > curveLength - 1) {
				break;
			}
		}
		if (i > curveLength - 1) {
			returnData = returnsToSelf ? 0 : 1;
		} else {
			let temp2;
			tempL = curve.b - curve.a;
			temp2 = (-2 * curve.a - tempL + 2 * time) / tempL;
			returnData = temp2 * temp2 * curve.H - curve.H + 1;
			if (returnsToSelf) {
				returnData = 1 - returnData;
			}
		}
		return returnData;
	}

	/**
	 *
	 * [Smoothstep]{@link https://en.wikipedia.org/wiki/Smoothstep}
	 *
	 * @param {number} time
	 * @param {number} order
	 * @return {number}
	 *
	 * @example
	 * Tween.smoothStep(0.25, 1);
	 * //0.15625
	 *
	 * @function smoothStep
	 * @memberof Tween
	 **/
	function Tween_smoothStep(time, order) {
		if (order < 0) {
			return 0;
		}
		switch (order) {
			case 1:
				{
					return oldPow(time, 2) * (3 - 2 * time);
				}
				break;
			case 2:
				{
					return oldPow(time, 3) * (time * (time * 6 - 15) + 10);
				}
				break;
			case 3:
				{
					return oldPow(time, 4) * (35 + time * (-84 + (70 - 20 * time) * time));
				}
				break;
			case 4:
				{
					return oldPow(time, 5) * (126 + 5 * time * (-84 + time * (108 + 7 * time * (-9 + 2 * time))));
				}
				break;
			case 5:
				{
					return oldPow(time, 6) * (462 + time * (-1980 - 7 * time * (-495 + 2 * time * (220 + 9 * time * (-11 + 2 * time)))));
				}
				break;
			case 6:
				{
					return oldPow(time, 7) * (1716 + 7 * time * (-1287 + 2 * time * (1430 + 3 * time * (-572 + time * (390 + 11 * time * (-13 + 2 * time))))));
				}
				break;
			default:
				{
					let result = 0;
					for (let n = 0; n <= order; n++) {
						result += (Math_nCr(-order - 1, n) * Math_nCr(2 * order + 1, order - n) * Math_pow(time, order + n + 1));
					}
					return result;
				}
		}
	}

	/**
	 *
	 * Overshoot
	 *
	 * @param {number} time
	 * @param {number} mag - magnitude
	 * @return {number}
	 *
	 * @example
	 * Tween.overShoot(0.25, 2);
	 * //1.2956871203528266
	 *
	 * @function overShoot
	 * @memberof Tween
	 **/
	function Tween_overShoot(time, mag) {
		time = Tween_outQuad(time);
		return time * (1 + Math.sin(time * Math.PI) * mag); //180 in sin?
	}

	/**
	 *
	 * Berp
	 *
	 * @param {number} time
	 * @param {number=} [num1=0.2]
	 * @param {number=} [num2=2.5]
	 * @param {number=} [num3=2.2]
	 * @param {number=} [num4=1.2]
	 * @return {number}
	 *
	 * @example
	 * Tween.berp(0.5);
	 * //1.702349952859165
	 *
	 * @function berp
	 * @memberof Tween
	 **/
	function Tween_berp(time, num1, num2, num3, num4) {
		num1 = _helper0(num1, 0.2);
		num2 = _helper0(num2, 2.5);
		num3 = _helper0(num3, 2.2);
		num4 = _helper0(num4, 1.2);
		return (num4 * (time - 1) - 1) * ((Math_pow(time, num3) - 1)  * Math.sin(Math.PI * num1 * time + Math.PI * oldPow(time, 4) * num2) - time);
	}

	/**
	 *
	 * Envelope
	 *
	 * @param {number} time
	 * @param {number=} [num1=0.5] - Rise
	 * @param {number=} [num2=0.5] - Fall
	 * @return {number}
	 *
	 * @example
	 * Tween.envelope(0.5);
	 * //1
	 *
	 * @function envelope
	 * @memberof Tween
	 **/
	function Tween_envelope(time, num1, num2) {
		num1 = _helper0(num1, 0.5);
		num2 = _helper0(num2, 0.5);
		if (time < 0 || time > 1) return 0;
		if (time <= 1 - num2) {
			if (time >= num1) return 1;
			else return time / num1;
		}
		else return (1 - time) / num2;
	}

	/**
	 *
	 * Customizable tween
	 *
	 * @param {number} time
	 * @param {number[]} points - control points [x1, y1, x2, y2, ...]
	 * @param {number[]} weight - weight of points [a, b, ...]
	 * @return {number}
	 *
	 * @example
	 * Tween.poly(0.25, [0.25, 0.5], [1, 1]);
	 * //0.5
	 *
	 * @function poly
	 * @memberof Tween
	 **/
	function Tween_poly(time, points, weight) {
		let temp1 = 0,
			temp2;
		for (let i = 0; i < points.length; i += 2) {
			temp2 = 1;
			for (let j = 0; j < points.length; j += 2) {
				if (j === i) {
					continue;
				}
				temp2 *= (time - points[j]) / (points[i] - points[j]);
			}
			temp1 += points[i + 1] * Math_pow(temp2, weight[i / 2]);
		}
		return temp1;
	}

	/**
	 *
	 * [Bezier]{@link https://en.wikipedia.org/wiki/B%C3%A9zier_curve} tween
	 *
	 * @param {number} time
	 * @param {number[]} points - control points [a, b, ...]
	 * @param {number[]} weight - weight [a, b, ...]
	 * @return {number}
	 *
	 * @example
	 * Tween.bezier(1 / 3, [50, 100, 150, 200], [1, 1, 1, 1]);
	 * //99.99999999999999
	 *
	 * @function bezier
	 * @memberof Tween
	 **/
	function Tween_bezier(time, points, weight) {
		let temp1 = 0,
			temp2 = 0,
			temp3 = 0,
			temp4 = 0,
			tempL = points.length;
		for (let i = 0; i < tempL; i ++) {
			temp2 = Math_bernstein(time, i, tempL - 1) * weight[i];
			temp1 = temp2 * points[i];
			temp3 += temp1;
			temp4 += temp2;
		}
		return temp3 / temp4;
	}

	/**
	 *
	 * [Cubic Hermite spline]{@link https://en.wikipedia.org/wiki/Cubic_Hermite_spline} tween using [Kochanek–Bartels spline]{@link https://en.wikipedia.org/wiki/Kochanek%E2%80%93Bartels_spline} version
	 *
	 * @param {number} continuty
	 * @param {number} bias
	 * @param {number} tension
	 * @param {number} density - like time
	 * @param {number[]} points - control points [x1, y1, x2, y2, ...]
	 * @param {boolean=} loop - `true` is looped
	 * @param {array=} returnData - Array to put data
	 * @return {number[]}
	 *
	 * Return array of points [x1, y1, x2, y2, ...]
	 *
	 * @example
	 * Tween.spline(1, 1, 1, 0.5, [1, 1, 3, 2], false);
	 * //[1, 1, 2, 1.5, 3, 2]
	 *
	 * @function spline
	 * @memberof Tween
	 **/
	function Tween_spline(continuty, bias, tension, density, points, loop, returnData) {
		let tangent = [],
			tempA, tempB, tempC, tempD, tempX, tempY, tempX2, tempY2, count, iteration, lines;
		//Control points
		if (loop) {
			points = [].concat(points[points.length - 2], points[points.length - 1], points, points[0], points[1], points[2], points[3]);
		} else {
			points = [].concat(points[points.length - 2], points[points.length - 1], points, points[0], points[1]);
		}
		tempA = (1 - tension) * (1 + bias) * (1 - continuty) * 0.5;
		tempB = (1 - tension) * (1 - bias) * (1 + continuty) * 0.5;
		tempC = (1 - tension) * (1 + bias) * (1 + continuty) * 0.5;
		tempD = (1 - tension) * (1 - bias) * (1 - continuty) * 0.5;
		count = 2;
		while (count < points.length - 2) {
			tempX = points[count] - points[count - 2];
			tempY = points[count + 1] - points[count - 1];
			tempX2 = points[count + 2] - points[count];
			tempY2 = points[count + 3] - points[count + 1];
			tangent.push(tempA * tempX + tempB * tempX2, tempA * tempY + tempB * tempY2, tempC * tempX + tempD * tempX2, tempC * tempY + tempD * tempY2);
			count += 2;
		}
		count = 2;
		lines = _helper0(returnData, "_a_")
		while (count < points.length - 4) {
			lines.push(points[count], points[count + 1]);
			iteration = density;
			while (iteration < 1.0) {
				tempX2 = iteration * iteration;
				tempY2 = 2 * iteration;
				tempA = (tempY2 - 3) * tempX2 + 1;
				tempC = (3 - tempY2) * tempX2;
				tempY2 = iteration - 1;
				tempB = tempY2 * tempY2 * iteration;
				tempD = tempY2 * tempX2;
				tempX = tempA * points[count] + tempB * tangent[2 * count - 2] + tempC * points[count + 2] + tempD * tangent[2 * count];
				tempY = tempA * points[count + 1] + tempB * tangent[2 * count - 1] + tempC * points[count + 3] + tempD * tangent[2 * count + 1];
				lines.push(tempX, tempY);
				iteration += density;
			}
			//Not sure if we could remove this...
			lines.push(points[count + 2], points[count + 3]);
			count += 2;
		}
		return lines;
	}

	/**
	 *
	 * Configurable counting number function
	 *
	 * @param {number} min
	 * @param {number} max
	 * @param {number} change
	 * @param {number} current - current start number (not minimum)
	 * @param {number} mode - there are different modes from 0 to 5, you can test it yourself (recommended to use 1 and 3)
	 * @return {count~counter}
	 *
	 * See `counter` in global for the return function
	 *
	 * @example
	 * let counter = Tween.count(0, 10, 1, 0, 0);
	 * //counter is now a callable function, you can call it like: counter()
	 *
	 * @function count
	 * @memberof Tween
	 **/
	let Tween_count = (function() {
		let temp;
		return function(min, max, change, current, mode) {
			if (!current) {
				current = min;
			}
			let data = {
				min: min,
				max: max,
				change: change,
				next: current,
				current: current,
				mode: mode
			};
			if (data.change < 0) {
				data.next = _helper0(data.next, data.max);
			} else if (data.change > 0) {
				data.next = _helper0(data.next, data.min);
			}

			/**
			 *
			 * Configurable counting number function, see `Tween.count` for the function that return this function
			 *
			 * @param {boolean=} _check - `true` if you want the function to return internal object, else just number
			 * @param {number=} _min
			 * @param {number=} _max
			 * @param {number=} _change
			 * @param {number=} _current - current start number (not minimum)
			 * @param {number=} _mode - there are different modes from 0 to 5, you can test it yourself (recommended to use 1 and 3)
			 * @return {number|{min: number, max: number, change: number, next: number, current: number, mode: number}}
			 *
			 * Internal object: `{min: number, max: number, change: number, next: number, current: number, mode: number}`
			 *
			 * @example
			 * let counter = Tween.count(0, 10, 1, 0, 0);
			 * counter();
			 * //0
			 *
			 * @function counter
			 **/
			return function(_check, _min, _max, _change, _current, _mode) {
				if (typeof _min === "number") {
					data.min = _min;
				}
				if (typeof _max === "number") {
					data.max = _max;
				}
				if (typeof _change === "number") {
					data.change = _change;
				}
				if (typeof _current === "number") {
					data.next = _current;
				}
				if (typeof _mode === "number") {
					data.mode = _mode;
				}
				data.current = data.next;
				switch (data.mode) {
					case 1:
						{
							data.next += data.change;
							if (data.change < 0 && data.next < data.min) {
								data.next += data.max - data.min;
							} else if (data.change > 0 && data.next > data.max) {
								data.next -= data.max - data.min;
							}
						}
						break;
					case 2:
						{
							if (data.change < 0) {
								if (data.next <= data.min) {
									data.next = data.max;
								} else {
									data.next += data.change;
									if (data.next < data.min) {
										data.next = data.min;
									}
								}
							} else if (data.change > 0) {
								if (data.next >= data.max) {
									data.next = data.min;
								} else {
									data.next += data.change;
									if (data.next > data.max) {
										data.next = data.max;
									}
								}
							}
						}
						break;
					case 3:
						{
							if (data.change < 0 && data.next < data.min) {
								data.change *= -1;
								temp = data.min - data.next;
								data.next = data.min;
								data.next += data.change - (data.change - temp);
								data.current = data.next;
							} else if (data.next > data.max) {
								data.change *= -1;
								temp = data.max - data.next;
								data.next = data.max;
								data.next += data.change - (data.change - temp);
								data.current = data.next;
							}
							data.next += data.change;
						}
						break;
					case 4:
						{
							if (data.change < 0 && data.next <= data.min) {
								data.change *= -1;
								data.next = data.min;
								data.current = data.next;
							} else if (data.next >= data.max) {
								data.change *= -1;
								data.next = data.max;
								data.current = data.next;
							}
							data.next += data.change;
						}
						break;
					case 5:
						{
							if (data.change < 0 && data.next <= data.min) {
								data.change *= -1;
								data.next += data.change;
								data.current = data.min;
								break;
							} else if (data.next >= data.max) {
								data.change *= -1;
								data.next += data.change;
								data.current = data.max;
							}
							data.next += data.change;
						}
						break;
					default:
						{
							if (data.change < 0) {
								if (data.next > data.min) {
									data.next += data.change;
								} else {
									data.next = data.min;
									data.current = data.next;
								}
							} else if (data.change > 0) {
								if (data.next < data.max) {
									data.next += data.change;
								} else {
									data.next = data.max;
									data.current = data.max;
								}
							}
						}
				}
				if (_check) {
					return data;
				} else {
					return data.current;
				}
			};
		};
	})();

	/**
	 *
	 * All of functions that related to Boolean
	 *
	 * @namespace Boolean
	 *
	 **/

	/**
	 *
	 * AndNot boolean function, see [here]{@link http://mathworld.wolfram.com/BooleanFunction.html}
	 *
	 * @param {boolean} a
	 * @param {boolean} b
	 * @return {boolean}
	 *
	 * @example
	 * Boolean.andNot(true, true);
	 * //false
	 *
	 * @function andNot
	 * @memberof Boolean
	 **/
	function Boolean_andNot(a, b) {
		return !a && b;
	}

	/**
	 *
	 * NotAnd boolean function, see [here]{@link http://mathworld.wolfram.com/BooleanFunction.html}
	 *
	 * @param {boolean} a
	 * @param {boolean} b
	 * @return {boolean}
	 *
	 * @example
	 * Boolean.notAnd(true, true);
	 * //false
	 *
	 * @function notAnd
	 * @memberof Boolean
	 **/
	function Boolean_notAnd(a, b) {
		return a && !b;
	}

	/**
	 *
	 * Nand boolean function, see [here]{@link http://mathworld.wolfram.com/BooleanFunction.html}
	 *
	 * @param {boolean} a
	 * @param {boolean} b
	 * @return {boolean}
	 *
	 * @example
	 * Boolean.nand(true, true);
	 * //false
	 *
	 * @function nand
	 * @memberof Boolean
	 **/
	function Boolean_nand(a, b) {
		return !(a && b);
	}

	/**
	 *
	 * OrNot boolean function, see [here]{@link http://mathworld.wolfram.com/BooleanFunction.html}
	 *
	 * @param {boolean} a
	 * @param {boolean} b
	 * @return {boolean}
	 *
	 * @example
	 * Boolean.orNot(true, true);
	 * //true
	 *
	 * @function orNot
	 * @memberof Boolean
	 **/
	function Boolean_orNot(a, b) {
		return a || !b;
	}

	/**
	 *
	 * NotOr boolean function, see [here]{@link http://mathworld.wolfram.com/BooleanFunction.html}
	 *
	 * @param {boolean} a
	 * @param {boolean} b
	 * @return {boolean}
	 *
	 * @example
	 * Boolean.notOr(true, true);
	 * //true
	 *
	 * @function notOr
	 * @memberof Boolean
	 **/
	function Boolean_notOr(a, b) {
		return !a || b;
	}

	/**
	 *
	 * Nor boolean function, see [here]{@link http://mathworld.wolfram.com/BooleanFunction.html}
	 *
	 * @param {boolean} a
	 * @param {boolean} b
	 * @return {boolean}
	 *
	 * @example
	 * Boolean.nor(true, true);
	 * //false
	 *
	 * @function nor
	 * @memberof Boolean
	 **/
	function Boolean_nor(a, b) {
		return !(a || b);
	}

	/**
	 *
	 * Xor boolean function, see [here]{@link http://mathworld.wolfram.com/BooleanFunction.html}
	 *
	 * @param {boolean} a
	 * @param {boolean} b
	 * @return {boolean}
	 *
	 * @example
	 * Boolean.xor(true, true);
	 * //false
	 *
	 * @function xor
	 * @memberof Boolean
	 **/
	function Boolean_xor(a, b) {
		return a ? !b : b;
	}

	/**
	 *
	 * Xnor boolean function, see [here]{@link http://mathworld.wolfram.com/BooleanFunction.html}
	 *
	 * @param {boolean} a
	 * @param {boolean} b
	 * @return {boolean}
	 *
	 * @example
	 * Boolean.xnor(true, true);
	 * //true
	 *
	 * @function xnor
	 * @memberof Boolean
	 **/
	function Boolean_xnor(a, b) {
		return !Boolean_xor(a, b);
	}

	/**
	 *
	 * Check if all value in an array is truthy
	 *
	 * @param {Array}
	 * @return {boolean}
	 *
	 * @example
	 * Boolean.all([true, true, true]);
	 * //true
	 *
	 * @function all
	 * @memberof Boolean
	 **/
	function Boolean_all(x) {
		for (let loopCount = 0; loopCount < x.length; loopCount++) {
			if (x[loopCount] != true) {
				return false;
			} else if (loopCount >= x.length - 1) {
				return true;
			}
		}
	}

	/**
	 *
	 * Check if at least one value in an array is truthy
	 *
	 * @param {Array}
	 * @return {boolean}
	 *
	 * @example
	 * Boolean.nall([false, true, false]);
	 * //true
	 *
	 * @function nall
	 * @memberof Boolean
	 **/
	function Boolean_nall(x) {
		for (let loopCount = 0; loopCount < x.length; loopCount++) {
			if (x[loopCount] == true) {
				return true;
			}
		}
		return false;
	}

	//Export
	//This is a very terrible way to export these functions because Closure advanced mode :(
	//If you have any ideas to improve this I'm really appreciated :D
	module([
		["M", "HALF_PI", Math_HALF_PI],
		["M", "TAU", Math_TAU],
		["M", "SQRT_PI", Math_SQRT_PI],
		["M", "SQRT_TAU", Math_SQRT_TAU],
		["M", "PHI", Math_PHI],
		["M", "SILVER", Math_SILVER],
		["M", "UPC", Math_UPC],

		["M", "ln", Math_ln],
		["M", "log", Math_log],
		["M", "mod", Math_mod],
		["M", "rem", Math_rem],
		["M", "cycle", Math_cycle],
		["M", "gamma", Math_gamma],
		["M", "lnGamma", Math_lnGamma],
		["M", "factorial", Math_factorial],
		["M", "nCr", Math_nCr],
		["M", "nPr", Math_nPr],
		["M", "pow", Math_pow],
		["M", "of", Math_of],
		["M", "sigmoid", Math_sigmoid],
		["M", "pair", Math_pair],
		["M", "integral", Math_integral],
		["M", "derivative", Math_derivative],
		["M", "limit", Math_limit],
		["M", "solve", Math_solve],
		["M", "rational", Math_rational],
		["M", "pdf", Math_pdf],
		["M", "cdf", Math_cdf],
		["M", "ppf", Math_ppf],
		["M", "erf", Math_erf],
		["M", "erfc", Math_erfc],
		["M", "ierf", Math_ierf],
		["M", "ierfc", Math_ierfc],
		["M", "erfcx", Math_erfcx],
		["M", "invNorm", Math_invNorm],
		["M", "kelly", Math_kelly],
		["M", "bernstein", Math_bernstein],
		["M", "smooth", Math_smooth],
		["M", "adjust", Math_adjust],
		["M", "adjust2", Math_adjust2],
		["M", "round", Math_round],
		["M", "floor", Math_floor],
		["M", "ceil", Math_ceil],
		["M", "trunc", Math_trunc],
		["M", "away", Math_away],
		["M", "round2", Math_round2],
		["M", "floor2", Math_floor2],
		["M", "ceil2", Math_ceil2],
		["M", "trunc2", Math_trunc2],
		["M", "away2", Math_away2],
		["M", "correct", Math_correct],
		["M", "snap", Math_snap],
		["M", "discrete", Math_discrete],
		["M", "shear", Math_shear],
		["M", "precision", Math_precision],
		["M", "order", Math_order],
		["M", "ramp", Math_ramp],
		["M", "heaviside", Math_heaviside],
		["M", "haar", Math_haar],
		["M", "rect", Math_rect],
		["M", "tri", Math_tri],
		["M", "fold", Math_fold],
		["M", "one", Math_one],
		["M", "flip", Math_flip],
		["M", "range", Math_range],
		["M", "compare", Math_compare],
		["M", "clamp", Math_clamp],
		["M", "wrap", Math_wrap],
		["M", "bounce", Math_bounce],
		["M", "approach", Math_approach],
		["M", "map", Math_map],
		["M", "norm", Math_norm],
		["M", "lerp", Math_lerp],
		["M", "change", Math_change],
		["M", "gcd", Math_gcd],
		["M", "lcm", Math_lcm],
		["M", "factor", Math_factor],
		["M", "divisor", Math_divisor],
		["M", "random", Math_random],
		["M", "randomTri", Math_randomTri],
		["M", "randomCirc", Math_randomCirc],
		["M", "noise", Math_noise],

		["G", "normRad", Geometry_normRad],
		["G", "toRad", Geometry_toRad],
		["G", "fullRad", Geometry_fullRad],
		["G", "normDeg", Geometry_normDeg],
		["G", "toDeg", Geometry_toDeg],
		["G", "fullDeg", Geometry_fullDeg],
		["G", "cssnAngle", Geometry_cssnAngle],
		["G", "scaleAngle", Geometry_scaleAngle],
		["G", "getAngle", Geometry_getAngle],
		["G", "relfAngle", Geometry_relfAngle],
		["G", "diffAngle", Geometry_diffAngle],
		["G", "isBetwAngle", Geometry_isBetwAngle],
		["G", "colliAnglePnt", Geometry_colliAnglePnt],
		["G", "distPnt", Geometry_distPnt],
		["G", "polarDistPnt", Geometry_polarDistPnt],
		["G", "manDistPnt", Geometry_manDistPnt],
		["G", "chevDistPnt", Geometry_chevDistPnt],
		["G", "rotPnt", Geometry_rotPnt],
		["G", "anglePnt", Geometry_anglePnt],
		["G", "cntrPnt", Geometry_cntrPnt],
		["G", "cmpPnt", Geometry_cmpPnt],
		["G", "slopeLine", Geometry_slopeLine],
		["G", "stdLine", Geometry_stdLine],
		["G", "distLinePnt", Geometry_distLinePnt],
		["G", "distLine", Geometry_distLine],
		["G", "intrLine", Geometry_intrLine],
		["G", "intrLineCirc", Geometry_intrLineCirc],
		["G", "sideLine", Geometry_sideLine],
		["G", "onLine", Geometry_onLine],
		["G", "colliLinePnt", Geometry_colliLinePnt],
		["G", "getXLine", Geometry_getXLine],
		["G", "getYLine", Geometry_getYLine],
		["G", "colliRayRect", Geometry_colliRayRect],
		["G", "colliArcCircPnt", Geometry_colliArcCircPnt],
		["G", "colliCircPnt", Geometry_colliCircPnt],
		["G", "colliCirc", Geometry_colliCirc],
		["G", "colliCircRect", Geometry_colliCircRect],
		["G", "intrCirc", Geometry_intrCirc],
		["G", "randomCirc", Geometry_randomCirc],
		["G", "onElli", Geometry_onElli],
		["G", "colliElliPnt", Geometry_colliElliPnt],
		["G", "intrElli", Geometry_intrElli],
		["G", "intrElliLine", Geometry_intrElliLine],
		["G", "boundElli", Geometry_boundElli],
		["G", "randomElli", Geometry_randomElli],
		["G", "distElliPnt", Geometry_distElliPnt],
		["G", "centroidTri", Geometry_centroidTri],
		["G", "equilTri", Geometry_equilTri],
		["G", "rightTri", Geometry_rightTri],
		["G", "crcmCntrTri", Geometry_crcmCntrTri],
		["G", "crcmCircTri", Geometry_crcmCircTri],
		["G", "inCircTri", Geometry_inCircTri],
		["G", "colliTriPnt", Geometry_colliTriPnt],
		["G", "areaTri", Geometry_areaTri],
		["G", "randomTri", Geometry_randomTri],
		["G", "colliRectPnt", Geometry_colliRectPnt],
		["G", "colliRect", Geometry_colliRect],
		["G", "intrRect", Geometry_intrRect],
		["G", "randomRect", Geometry_randomRect],
		["G", "colliPolyPnt", Geometry_colliPolyPnt],
		["G", "colliPolyCirc", Geometry_colliPolyCirc],
		["G", "colliPoly", Geometry_colliPoly],
		["G", "isSimplePoly", Geometry_isSimplePoly],
		["G", "isConvexPoly", Geometry_isConvexPoly],
		["G", "isClockWisePoly", Geometry_isClockWisePoly],
		["G", "boundPoly", Geometry_boundPoly],
		["G", "triPoly", Geometry_triPoly],
		//["G", "slicePoly", Geometry_slicePoly],
		["G", "areaPoly", Geometry_areaPoly],
		["G", "centroidPoly", Geometry_centroidPoly],
		["G", "convexHullPoly", Geometry_convexHullPoly],
		["G", "distPolyRay", Geometry_distPolyRay],
		["G", "intrPolyPnt", Geometry_intrPolyPnt],
		["G", "reversePoly", Geometry_reversePoly],
		["G", "timeAccel", Geometry_timeAccel],
		["G", "accelAccel", Geometry_accelAccel],
		["G", "distAccel", Geometry_distAccel],
		["G", "timeDistAccel", Geometry_timeDistAccel],

		["M", "pol", Math_pol],
		["M", "rec", Math_rec],
		["M", "normVec", Math_normVec],
		["M", "scaleVec", Math_scaleVec],
		["M", "truncVec", Math_truncVec],
		["M", "magVec", Math_magVec],
		["M", "dotVec", Math_dotVec],
		["M", "crossVec", Math_crossVec],
		["M", "projVec", Math_projVec],
		["M", "rejVec", Math_rejVec],
		["M", "perVec", Math_perVec],
		["M", "lerpVec", Math_lerpVec],
		["M", "headVec", Math_headVec],
		["M", "revVec", Math_revVec],
		["M", "clockWiseVec", Math_clockWiseVec],

		["M", "sinc", Math_sinc],
		["M", "crd", Math_crd],
		["M", "exsec", Math_exsec],
		["M", "excsc", Math_excsc],
		["M", "aexsec", Math_aexsec],
		["M", "aexcsc", Math_aexcsc],
		["M", "vsin", Math_vsin],
		["M", "vcos", Math_vcos],
		["M", "cvsin", Math_cvsin],
		["M", "cvcos", Math_cvcos],
		["M", "hvsin", Math_hvsin],
		["M", "hvcos", Math_hvcos],
		["M", "hcvsin", Math_hcvsin],
		["M", "hcvcos", Math_hcvcos],
		["M", "avsin", Math_avsin],
		["M", "avcos", Math_avcos],
		["M", "acvsin", Math_acvsin],
		["M", "acvcos", Math_acvcos],
		["M", "ahvsin", Math_ahvsin],
		["M", "ahvcos", Math_ahvcos],
		["M", "csc", Math_csc],
		["M", "csch", Math_csch],
		["M", "sec", Math_sec],
		["M", "sech", Math_sech],
		["M", "cot", Math_cot],
		["M", "coth", Math_coth],
		["M", "acsc", Math_acsc],
		["M", "acsch", Math_acsch],
		["M", "asec", Math_asec],
		["M", "asech", Math_asech],
		["M", "acot", Math_acot],
		["M", "acoth", Math_acoth],
		["M", "cssn", Math_cssn],

		["N", "isPrime", Number_isPrime],
		["N", "isMinusZero", Number_isMinusZero],
		["N", "isEven", Number_isEven],
		["N", "isNumeric", Number_isNumeric],
		["N", "epsilon", Number_epsilon],
		["N", "isPOT", Number_isPOT],

		["T", "inQuad", Tween_inQuad],
		["T", "outQuad", Tween_outQuad],
		["T", "inOutQuad", Tween_inOutQuad],
		["T", "inCubic", Tween_inCubic],
		["T", "outCubic", Tween_outCubic],
		["T", "inOutCubic", Tween_inOutCubic],
		["T", "inQuart", Tween_inQuart],
		["T", "outQuart", Tween_outQuart],
		["T", "inOutQuart", Tween_inOutQuart],
		["T", "inQuint", Tween_inQuint],
		["T", "outQuint", Tween_outQuint],
		["T", "inOutQuint", Tween_inOutQuint],
		["T", "inPow", Tween_inPow],
		["T", "outPow", Tween_outPow],
		["T", "inOutPow", Tween_inOutPow],
		["T", "inLog", Tween_inLog],
		["T", "outLog", Tween_outLog],
		["T", "inOutLog", Tween_inOutLog],
		["T", "inSine", Tween_inSine],
		["T", "outSine", Tween_outSine],
		["T", "inOutSine", Tween_inOutSine],
		["T", "inExpo", Tween_inExpo],
		["T", "outExpo", Tween_outExpo],
		["T", "inOutExpo", Tween_inOutExpo],
		["T", "inCirc", Tween_inCirc],
		["T", "outCirc", Tween_outCirc],
		["T", "inOutCirc", Tween_inOutCirc],
		["T", "inElastic", Tween_inElastic],
		["T", "outElastic", Tween_outElastic],
		["T", "inOutElastic", Tween_inOutElastic],
		["T", "inBack", Tween_inBack],
		["T", "outBack", Tween_outBack],
		["T", "inOutBack", Tween_inOutBack],
		["T", "inBounce", Tween_inBounce],
		["T", "outBounce", Tween_outBounce],
		["T", "inOutBounce", Tween_inOutBounce],
		["T", "spring", Tween_spring],
		["T", "bounce", Tween_bounce],
		["T", "smoothStep", Tween_smoothStep],
		["T", "overShoot", Tween_overShoot],
		["T", "berp", Tween_berp],
		["T", "envelope", Tween_envelope],
		["T", "poly", Tween_poly],
		["T", "bezier", Tween_bezier],
		["T", "spline", Tween_spline],
		["T", "count", Tween_count],

		["B", "andNot", Boolean_andNot],
		["B", "notAnd", Boolean_notAnd],
		["B", "nand", Boolean_nand],
		["B", "orNot", Boolean_orNot],
		["B", "notOr", Boolean_notOr],
		["B", "nor", Boolean_nor],
		["B", "xor", Boolean_xor],
		["B", "xnor", Boolean_xnor],
		["B", "all", Boolean_all],
		["B", "nall", Boolean_nall],
	], global);
})(
	function(module, global) {
		let Geometry = {},
			Tween = {};

		for (let i = 0; i < module.length; i++) {
			let temp;
			switch (module[i][0]) {
				case "M":
					temp = global.Math;
					break;
				case "G":
					temp = Geometry;
					break;
				case "N":
					temp = global.Number;
					break;
				case "T":
					temp = Tween;
					break;
				case "B":
					temp = global.Boolean;
					break;
			}
			temp[module[i][1]] = module[i][2];
		}

		let root = {
			Math: global.Math,
			Geometry: Geometry,
			Tween: Tween,
			Boolean: global.Boolean,
			Number: global.Number
		};

		if (typeof define === "function" && define.amd) {
			define([], function() {
				return root;
			});
		} else {
			if (typeof module === "object" && module.exports) {
				module.exports = root;
			}
		}
		global.Geometry = Geometry;
		global.Tween = Tween;
	},
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	typeof global !== "undefined" ? global : this
);

/*
num = Geometry_fullRad(num);
min = Geometry_fullRad(min);
max = Geometry_fullRad(max);
if (min < max) {
	return min <= num && num <= max;
} else {
	return min <= num || num <= max;
}

//((max - min) % PI_2 + PI_2) % PI_2
//return Math.PI - (num1 - num2 + _diffAngle_1_) % Math_TAU;
//(num % Math_TAU + Math_TAU) % Math_TAU;
//Same like Geometry.normDeg(ang0 - ang1);
function ArcAngle(ang0,ang1) {
	//return absolute(ang0-ang1)<absolute(ang1-ang0) ? ang0-ang1 : ang1-ang0
	// difference between 'dir' and 'angle'
	let diff = ang0 - ang1;

	//Second way to normalize angle, slower...
	while(diff >= 180) { diff -= 360; }    // adjust the range
	while(diff < -180) { diff += 360; }
	return diff;
}

//ac = -a * p * 54;
//(3 * ac - bb) / (9 * aa);
//(27 * aa + 2 * bb - 9 * ac) * b / (54 * aa * a);
//(27 * a * a + 2 * b * b - 9 * -a * p * 54) * b / (54 * a * a * a)

function _helper13(u, v) {
	return Geometry.distPnt(_slicePoly_1_.x, _slicePoly_1_.y, u.x, u.y, true) - Geometry.distPnt(_slicePoly_1_.x, _slicePoly_1_.y, v.x, v.y, true);
}

function _helper14(ps, ind) {
	let n = ps.length;
	while (true) {
		ind = (ind + 1) % n;
		if (ps[ind].flag) {
			return ind;
		}
	}
}

function _helper15(ps, ind0, ind1, nps) {
	let n = ps.length;
	if (ind1 < ind0) ind1 += n;
	for (let i = ind0; i <= ind1; i++) {
		nps.push(ps[i % n]);
	}
	return nps;
}*/

/**
 *
 * Slice a polygon (convex, concave, complex) to half
 *
 * @param {number[]} points - array of points [x1, y1, x2, y2, ...]
 * @param {number} a_x - x position of first point of the line segment
 * @param {number} a_y - y position of first point of the line segment
 * @param {number} b_x - x position of second point of the line segment
 * @param {number} b_y - y position of second point of the line segment
 * @param {number=} [accuracy=1e-10]
 * @return {number[]}
 *
 * @example
 * Geometry.slicePoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100], 25, -10, 25, 110);
 * //[
 * //	[25, 0, 50, 0, 100, 50, 50, 100, 25, 100],
 * //	[25, 100, 0, 100, 0, 0, 25, 0]
 * //]
 *
 * @function slicePoly
 * @memberof Geometry
 **/
/*function Geometry_slicePoly(points, a_x, a_y, b_x, b_y, accuracy) {
let a, b, isc, iscs, ps, i, fisc, lisc, i0, i1, ind0, ind1, solved, pgn, result, pg, npg, pgs, dir;
accuracy = _helper0(accuracy, 1e-10);
accuracy *= accuracy;
if (Geometry.colliPolyPnt(points, a_x, a_y) || Geometry.colliPolyPnt(points, b_x, b_y)) {
	return [points.slice(0)];
}
a = {
	x: a_x,
	y: a_y,
	flag: false
};
b = {
	x: b_x,
	y: b_y,
	flag: false
};
iscs = []; // intersections
ps = []; // points
for (i = 0; i < points.length; i += 2) {
	ps.push({
		x: points[i],
		y: points[i + 1],
		flag: false
	});
}

for (i = 0; i < ps.length; i++) {
	isc = Geometry.intrLine(a.x, a.y, b.x, b.y, ps[i].x, ps[i].y, ps[(i + 1) % ps.length].x, ps[(i + 1) % ps.length].y);
	isc.flag = false;
	fisc = iscs[0] || {};
	lisc = iscs[iscs.length - 1] || {};
	if (
		isc.onLine1 && isc.onLine2 &&
		((!fisc.onLine1 && !fisc.onLine2) || Geometry.distPnt(isc.x, isc.y, fisc.x, fisc.y, false) > accuracy) &&
		((!lisc.onLine1 && !lisc.onLine2) || Geometry.distPnt(isc.x, isc.y, lisc.x, lisc.y, false) > accuracy)
	) {
		isc.flag = true;
		iscs.push(isc);
		ps.splice(i + 1, 0, isc);
		i++;
	}
}

if (iscs.length < 2) {
	return [points.slice(0)];
}
_slicePoly_1_ = a;
iscs.sort(_helper13);

pgs = [];
dir = 0;
while (iscs.length > 0) {
	i0 = iscs[0];
	i1 = iscs[1];
	ind0 = ps.indexOf(i0);
	ind1 = ps.indexOf(i1);
	solved = false;

	if (_helper14(ps, ind0) == ind1) {
		solved = true;
	} else {
		i0 = iscs[1];
		i1 = iscs[0];
		ind0 = ps.indexOf(i0);
		ind1 = ps.indexOf(i1);
		if (_helper14(ps, ind0) == ind1) {
			solved = true;
		}
	}
	if (solved) {
		dir--;
		_slicePoly_2_.length = 0;
		_slicePoly_3_.length = 0;
		pgn = _helper15(ps, ind0, ind1, _slicePoly_2_);
		pgs.push(pgn);
		ps = _helper15(ps, ind1, ind0, _slicePoly_3_);
		i0.flag = i1.flag = false;
		iscs.splice(0, 2);
		if (iscs.length === 0) {
			pgs.push(ps);
		}
	} else {
		dir++;
		iscs.reverse();
	}
	if (dir > 1) {
		break;
	}
}
result = [];
for (i = 0; i < pgs.length; i++) {
	pg = pgs[i];
	npg = [];
	for (var j = 0; j < pg.length; j++) {
		npg.push(pg[j].x, pg[j].y);
	}
	result.push(npg);
}
return result;
};*/
