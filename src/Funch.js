(function(window) {
	/*
		Funch.js, v0.1a

		MIT License

		Copyright (c) 2017 Trung0246 and others listed in LICENSE file

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

		P.S: you can just link to "github.com/Trung0246/Funch" when using this library is enough for me instead include this whole license...
	*/

	//Namespace
	if (!window.Geometry) {
		window.Geometry = {};
	}
	if (!window.Tween) {
		window.Tween = {};
	}
	if (!window.Utils) {
		window.Utils = {};
	}

	/*
		TODO list:
		- Need to improve namespace to make it work with ES6 export, Node, amd,... If anyone can find a script that do this I am really appreciated (Medium)
		- Find another version of derivative function that did not use array (Medium)
		- Optimize distLine function (Medium)
		- Improve Bezier function (Medium)
		- Add perlin noise and simplex noise functions (both 2D and 3D ?) (Medium)
		- Split rect and trap for performance in integral function (Low) (Maybe don't need to do this...)
	*/

	/**
	*
	* All of general math functions 
	*
	* @namespace Math
	*
	**/
	/**
	*
	*	All of functions that related to Vector
	*
	* @namespace Vector
	*
	**/
	/**
	*
	* All of functions that related to Trigonometry
	*
	* @namespace Trigonometry
	*
	**/
	/**
	*
	* All of functions that related to Geometry
	*
	* @namespace Geometry
	*
	**/
	/**
	*
	* All of functions that dealing with checking a number
	*
	* @namespace Number
	*
	**/
	/**
	*
	* All of functions that related to Boolean
	*
	* @namespace Boolean
	*
	**/
	/**
	*
	* All of functions that related to Tween (see [here]{@link http://easings.net/} for more infos)
	*
	* @namespace Tween
	*
	**/

	/**
	* @constant {number} HALFPI
	* 
	* Equal to half of `Math.PI`, specific value is `1.5707963267948966`
	*
	* @memberof Math
	*/
	Math.HALFPI = Math.PI / 2;

	/**
	* @constant {number} TAU
	* 
	* Equal to double of `Math.PI`, specific value is `6.283185307179586`
	*
	* @memberof Math
	*/
	Math.TAU = Math.PI * 2;

	/**
	* @constant {number} PHI
	* 
	* [Golden ratio]{@link https://en.wikipedia.org/wiki/Golden_ratio}, specific value is `1.618033988749895`
	*
	* @memberof Math
	*/
	Math.PHI = (1 + Math.sqrt(5)) / 2;

	/**
	* @constant {number} SILVER
	* 
	* [Silver ratio]{@link https://en.wikipedia.org/wiki/Silver_ratio}, specific value is `2.414213562373095`
	*
	* @memberof Math
	*/
	Math.SILVER = 1 + Math.SQRT2;

	/**
	* @constant {number} UPC
	* 
	* [Universal parabolic constant]{@link https://en.wikipedia.org/wiki/Universal_parabolic_constant}, specific value is `2.295587149392638`
	*
	* @memberof Math
	*/
	Math.UPC = Math.log(1 + Math.SQRT2) + Math.SQRT2;

	//Local variables and functions that store data necessary for library
	let _gamma_1_ = [
		0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
		-176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
		1.5056327351493116e-7
	],
	_lnGamma_1_ = [
		76.18009172947146, -86.50532032941677, 24.01409824083091,
		-1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
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
	_random_1_ = [],
	_helper9_1 = 1 / 3,
	_helper19_1_ = 3 / 4,
	_helper19_2_ = [],
	_helper23_1_ = [],
	_helper23_2_ = [],
	_helper23_3_ = [],
	_toRad_1_ = Math.PI / 180,
	_toDeg_1_ = 180 / Math.PI,
	_erf_1_ = Math.sqrt(Math.PI),
	_pdf_1_ = Math.sqrt(Math.TAU),
	_diffAngle_1_ = Math.PI * 3,
	_triEquil_1_ = Math.sqrt(3) / 2,
	_epsilon_1_ = 4 / 3 - 1,
	_slicePoly_1_,
	_poly_stack_ = [],
	oldRound = Math.round,
	oldFloor = Math.floor,
	oldCeil = Math.ceil,
	oldTrunc = Math.trunc,
	oldPow = Math.pow,
	oldRandom = Math.random;

	for (let i = 0; 6 > i; i++) _poly_stack_.push({
		x: 0,
		y: 0,
		flag: false
	});

	function _helper1(d, e, f, g) {
		e = Utils.default(e, 0), f = Utils.default(f, 10);
		let h, j;
		return j = Math.pow(f, e), h = _helper3(g, d * j) / j, h
	}

	function _helper2(d, e, f, g) {
		e = Utils.default(e, 0), f = Utils.default(f, 10);
		let h, j, k, l;
		h = Utils.default(f, 10);
		let o = Math.abs(d);
		return j = 10 === h ? Math.log10(o) : 2 === h ? Math.exp(o) : Math.log(o, h), j = oldFloor(j - e + 1), k = Math.pow(h, Math.abs(j)),
		l = 0 > j ? _helper3(g, d * k) / k : _helper3(g, d / k) * k, l
	}

	function _helper3(d, e) {
		switch (d) {
			case 0:
				return oldRound(e);
				break;
			case 1:
				return oldFloor(e);
				break;
			case 2:
				return oldCeil(e);
				break;
			case 3:
				return oldTrunc(e);
				break;
			case 4:
				return 0 < e ? oldCeil(e) : oldFloor(e);
		}
	}

	function _helper4(d) {
		if (d !== oldFloor(d)) return NaN;
		if (0 > d) return NaN;
		if (170 < d) return NaN;
		if (0 === d || 1 === d) return 1;
		let e = 1;
		for (let f = 2; f <= d; f++) e *= f;
		return e
	}

	function _helper5(d, e) {
		d *= -1, e *= -1;
		let f;
		if ((0 > d && (d = -d), 0 > e && (e = -e), e > d) && (f = e, e = d, d = f), 0 === e) return d;
		for (let g = d % e; 0 < g;)
			d = e, e = g, g = d % e;
		return e
	}

	function _helper6(d, e) {
		return d * e / _helper5(d, e)
	}

	function _helper7() {
		let d = _random_1_[0],
			e = _random_1_[1],
			f = _random_1_[2],
			g = _random_1_[3],
			h = (g >>> 0) + (e >>> 0),
			j = f + d + (h / 2 >>> 31) >>> 0;
		_random_1_[0] = f, _random_1_[1] = g;
		let l = 0,
			o = 0,
			q = 0,
			s = 0,
			w = 23;
		l = d << w | (e & 4294967295 << 32 - w) >>> 32 - w, o = e << w, d ^= l, e ^= o, l = d ^ f, o = e ^ g;
		let z = 18;
		q = d >>> z, s = e >>> z | (d & 4294967295 >>> 32 - z) << 32 - z, l ^= q, o ^= s;
		let F = 5;
		q = f >>> F, s = g >>> F | (f & 4294967295 >>> 32 - F) << 32 - F, l ^= q, o ^= s, _random_1_[2] = l, _random_1_[3] = o,
			_random_1_[4] = j, _random_1_[5] = h >>> 0
	}

	function _helper8(d) {
		if (Number.isNaN(d) || !Number.isFinite(d)) return NaN;
		if (0 === d) return 0;
		if (d % 1 || 2 > d * d) return 1;
		if (0 == d % 2) return 2;
		if (0 == d % 3) return 3;
		if (0 == d % 5) return 5;
		let e = Math.sqrt(d);
		for (let f = 7; f <= e; f += 30) {
			if (0 == d % f) return f;
			if (0 == d % (f + 4)) return f + 4;
			if (0 == d % (f + 6)) return f + 6;
			if (0 == d % (f + 10)) return f + 10;
			if (0 == d % (f + 12)) return f + 12;
			if (0 == d % (f + 16)) return f + 16;
			if (0 == d % (f + 22)) return f + 22;
			if (0 == d % (f + 24)) return f + 24
		}
		return d
	}

	function _helper9(d) {
		let f, g, h, j, k, l, o, q, s, e = 40;
		return d *= 10, f = -27 * d, g = -54 * d, h = e * e * e, j = e * e, k = f * f * f, l = f * f,
			o = (27 * j * f + 2 * k - 9 * e * f * g) / (54 * h), q = (3 * e * g - l) / (9 * j), s = Math.sqrt(o * o + q * q * q),
			Math.pow(-o + s, _helper9_1) + Math.pow(-o - s, _helper9_1) - f / (3 * e)
	}

	function _helper10(d) {
		return 1 - (d + 3) / (3 * d + 3)
	}

	function _helper11(d, e, f) {
		return Math.nCr(f, e) * Math.pow(d, e) * Math.pow(1 - d, f - e)
	}

	function _helper13(d, e) {
		return Geometry.distPnt(_slicePoly_1_.x, _slicePoly_1_.y, d.x, d.y, true) - Geometry.distPnt(_slicePoly_1_.x, _slicePoly_1_.y, e.x, e.y, true)
	}

	function _helper14(d, e) {
		for (let f = d.length;;)
			if (e = (e + 1) % f, d[e].flag) return e
	}

	function _helper15(d, e, f) {
		let g = d.length,
			h = [];
		f < e && (f += g);
		for (let j = e; j <= f; j++) h.push(d[j % g]);
		return h
	}

	function _helper17(d, e, f, g, h, j, k, l) {
		let o = Geometry.distPnt(j.x, j.y, f.x, f.y, true);
		if (o < l.dist) {
			let q = 1 / Geometry.distPnt(h.x, h.y, g.x, g.y, true),
				s = -(h.y - g.y) * q,
				w =
				(h.x - g.x) * q,
				y = 2 * (d * s + e * w);
			l.dist = o, l.norm_x = s, l.norm_y = w, l.refl_x = -y * s + d, l.refl_y = -y * w + e, l.edge = k
		}
	}

	function _helper18(d, e, f, g, h) {
		let j, k, l, o, q = d.x - e.x,
			s = d.y - e.y,
			w =
			f.x - e.x,
			y = f.y - e.y;
		o = (q * w + s * y) / (w * w + y * y), 0 > o || e.x == f.x && e.y == f.y ? (j = e.x, k = e.y) : 1 < o ? (j = f.x, k = f.y) : (j = e.x + o * w, k = e.y + o * y),
			l = Geometry.distPnt(j, k, d.x, d.y, true), l < h.dist && (h.dist = l, h.edge = g, h.point_x = j, h.point_y = k)
	}

	function _helper19(d, e, f, g, h) {
		_helper19_2_.length = 0, g /= h, f /= h, e /= h, d /= h;
		let j, k, l, o, q = g * g,
			s = 2 * f,
			w = 4 * d,
			y = 0,
			z = _helper20(4 * f * d - e * e - q * d, e * g - w, -f, 1),
			E = q * _helper19_1_,
			F = q / 4 - f + z,
			G = Math.sqrt(F),
			H = -g / 4,
			I = G / 2;
		return 0 === F ? (j = E - s, k = 2 * Math.sqrt(z * z - w), l = j + k, o = j - k) : (j = E - F - s, k = (4 * g * f - 8 * e - q * g) / (4 * G),
			l = j + k, o = j - k), j = H + I, 0 <= l && (k = Math.sqrt(l) / 2, _helper19_2_[y++] = j + k, _helper19_2_[y++] = j - k),
			j = H - I, 0 <= o && (k = Math.sqrt(o) / 2, _helper19_2_[y++] = j + k, _helper19_2_[y++] = j - k), y
	}

	function _helper20(d, e, f, g) {
		f /= g, e /= g, d /= g;
		let h = f * f,
			j = (3 * e - h) / 9,
			k = (9 * f * e - 27 * d - 2 * h * f) / 54,
			l = j * j * j,
			o = l + k * k;
		if (0 <= o) {
			let q = Math.sqrt(o),
				s = Math.cbrt(k + q),
				w = Math.cbrt(k - q);
			return -f / 3 + s + w
		}
		return 2 * Math.sqrt(-j) * Math.cos(Math.acos(k / Math.sqrt(-l)) / 3) - f / 3
	}

	function _helper21(d, e, f, g, h) {
		let j = d.x - e.x,
			k = f.x - g.x,
			l = d.y - e.y,
			o = f.y - g.y;
		let q = j * o - l * k;
		if (0 == q) return null;
		let s = d.x * e.y - d.y * e.x,
			w = f.x * g.y - f.y * g.x;
		let y = 1 / q;
		return h.x = (s * k - j * w) * y, h.y = (s * o - l * w) * y, _helper22(h, f, g) ? 0 < l && h.y > d.y || 0 > l && h.y < d.y ? null : 0 < j &&
			h.x > d.x || 0 > j && h.x < d.x ? null : h : null
	}

	function _helper22(d, e, f) {
		let g = Math.min(e.x, f.x),
			h = Math.max(e.x, f.x),
			j = Math.min(e.y, f.y),
			k = Math.max(e.y, f.y);
		return g == h ? j <= d.y &&
			d.y <= k : j == k ? g <= d.x && d.x <= h : g <= d.x + 1e-10 && d.x - 1e-10 <= h && j <= d.y + 1e-10 && d.y - 1e-10 <= k
	}

	function _helper23(a, b, c, d) {
		let e, f = 1e-10,
			g = true,
			h = 2 === d ? 1 : -1;
		if (_helper23_1_.length = 0, _helper23_2_.length = 0, _helper23_3_.length = 0, "number" == typeof c || c instanceof Number || (c = 10), a === h * Infinity) return NaN;
		for (a === h * -Infinity && (a = h * -Number.MAX_VALUE / 10), 10 < c && (f = oldPow(1e-32, c / 32)), e = 0; 5 > e; e++) a += h * f, _helper23_1_.push(a), _helper23_2_.push(b(a));
		for (e = 0; e < _helper23_2_.length; e++) _helper23_3_.push(Math.round(_helper23_2_[e], c));
		for (e = 1; e < _helper23_3_.length; e++) g = g && _helper23_3_[e - 1] === _helper23_3_[e];
		return true == g ? _helper23_3_[0] : NaN
	}

	//Utils
	Utils.default = function(current, num) {
		return (typeof current !== 'undefined') ? current : num;
	};

	//Math

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
	Math.ln = Math.log;

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
	Math.log = function(num, base) {
		base = Utils.default(base, Math.E);
		return Math.ln(num) / Math.ln(base);
	};

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
	Math.mod = function(num1, num2) {
		return num1 - oldFloor(num1 / num2) * num2;
	};

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
	Math.rem = function (num, left, right) {
		//detect single-arg case, like mod-loop or fmod
		if (right === undefined) {
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
	};

	/**
	*	
	* Calculate `num = num1 % num2`
	*
	* @param {number} num1
	* @param {number} num2
	* @return {number} return `num` if `num > 0`, else return `num + num2`
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
	Math.cycle = function(num1, num2) {
		num1 %= num2;
		return num1 > 0 ? num1 : num1 + num2;
	};

	/**
	*	
	* Gamma function
	*
	* @param {number} num - The number to calculate
	* @return {number}
	*
	* @example
	* Math.gamma(2.33);
	* //1.1881928111058075
	*
	* @function gamma
	* @memberof Math
	**/
	Math.gamma = function(num, accuracy) {
		accuracy = Utils.default(accuracy, 7);
		if (num < 0.5) {
			return Math.PI / Math.sin(num * Math.PI) / Math.gamma(1 - num);
		} else {
			num--;
			let temp = _gamma_1_[0];
			for (let i = 1; i < accuracy + 2; i++) {
				temp += _gamma_1_[i] / (num + i);
			}
			let temp2 = num + accuracy + 0.5;
			return Math.sqrt(2 * Math.PI) * Math.pow(temp2, (num + 0.5)) * Math.exp(-temp2) * temp;
		}
	};

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
	Math.lnGamma = function(num) {
		let j = 0,
			ser = 1.000000000190015,
			xx, y, tmp;
		tmp = (y = xx = num) + 5.5;
		tmp -= (xx + 0.5) * Math.ln(tmp);
		for (; j < 6; j++) {
			ser += _lnGamma_1_[j] / ++y;
		}
		return Math.ln(2.5066282746310005 * ser / xx) - tmp;
	};

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
	Math.factorial = function(num) {
		num ++;
		return num === oldFloor(num) ? _helper4(num - 1) : num < 0 ? Math.PI / (Math.sin(Math.PI * num) * Math.gamma(1 - num)) : Math.exp(Math.lnGamma(num));
	};

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
	Math.nCr = function(num1, num2) {
		let result = 1;
		for (let i = 0; i < num2; i++) {
			result *= (num1 - i) / (i + 1);
		}
		return result;
	};

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
	Math.nPr = function(num1, num2) {
		let result = 1;
		for (let i = 0; i < num2; i++) {
			result *= num1 - i;
		}
		return result;
	};

	/**
	*	
	* Calculate power
	*
	* Warning: this code did not work perfect when it's come to case like -9 ^ (1/4), -25 ^ (1/3), ... because imaginary number...
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
	Math.pow = function(base, exponent) {
		if (base >= 0 || (base < 0 && Number.isInteger(exponent))) {
			return oldPow(base, exponent);
		} else if (base < 0 && exponent >= 0) {
			//Warning goes here
			return -oldPow(-base, exponent);
		}
		return NaN;
	};

	/**
	*	
	* Calculate nth root of base
	*
	* Warning: this code did not work perfect when it's come to case like -9 ^ (1/4), -25 ^ (1/3), ... because imaginary number...
	*
	* @param {number} base
	* @param {number} exponent
	* @return {number}
	*
	* @example
	* Math.nthrt(-8, 3);
	* //-2
	*
	* @function nthrt
	* @memberof Math
	**/
	Math.nthrt = function(base, exponent) {
		let negate = exponent % 2 === 1 && base < 0;
		if (negate) {
			base = -base;
		}
		let possible = Math.pow(base, 1 / exponent);
		exponent = Math.pow(possible, exponent);
		if (Math.abs(base - exponent) < 1 && (base > 0 === exponent > 0)) {
			return negate ? -possible : possible;
		}
		return possible;
	};

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
	Math.sigmoid = function(num) {
		return 1 / (1 + Math.pow(Math.E, -num));
	};

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
	Math.pair = function(num1, num2) {
		return 0.5 * (num1 + num2 - 2) * (num1 + num2 - 1) + num1;
	};

	/**
	*	
	* Calculate [integral]{@link https://en.wikipedia.org/wiki/Integral} by using trapezoid and rectangle method
	*
	* @param {number=} [min=1] - The begin of interval
	* @param {number=} [max=1] - The end of interval
	* @param {function} func - The function to calculate
	* @param {number=} [iteration=1] - Accuracy, the larger the more accurate (integer only)
	* @return {{trapezoid: number, rectangle: number}}
	*
	* @example
	* Math.integral(1, 5, Math.sin, 100000000);
	* //{trapezoid: 0.25664012040488826, rectangle: 0.256640120404888}
	*
	* @function integral
	* @memberof Math
	**/
	Math.integral = function(min, max, func, iteration) {
		min = Utils.default(min, 1);
		max = Utils.default(max, 1);
		func = Utils.default(func, function() {});
		iteration = Utils.default(iteration, 1);
		let iterate1 = 1, total_area_1 = 0, total_area_2 = 0,
		left_x, right_x, left_y, right_y, delta_area_1, delta_area_2, x, y;
		while (iterate1 <= iteration) {

			left_x = min + ((max - min) * (iterate1 - 1) / iteration);
			right_x = min + ((max - min) * iterate1 / iteration);

			x = left_x;
			left_y = func(x);
			x = right_x;
			right_y = func(x);
			delta_area_1 = (right_x - left_x) * (left_y + right_y) / 2;
			total_area_1 = total_area_1 + delta_area_1;

			x = (left_x + right_x) / 2;
			y = func(x);
			delta_area_2 = (right_x - left_x) * y;
			total_area_2 = total_area_2 + delta_area_2;

			iterate1 = iterate1 + 1;
		}
		return {
			trapezoid: total_area_1,
			rectangle: total_area_2
		};
	};

	/**
	*	
	* Calculate [derivative]{@link https://en.wikipedia.org/wiki/Derivative} by using [Romberg's method]{@link https://en.wikipedia.org/wiki/Romberg%27s_method}
	*
	* @param {number} num - The number to calculate
	* @param {function} func - The function to calculate
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
	Math.derivative = function(num, func, accuracy1, accuracy2) {
		accuracy1 = Utils.default(accuracy1, 1e-15); //tol
		accuracy2 = Utils.default(accuracy2, 1);
		let d1, d2, h2, columns = 6,
		data = [];
		data[0] = (func(num + accuracy2) - func(num - accuracy2)) / (accuracy2 * 2.0);
		for (let j = 1; j <= columns - 1; j++) {
			data[j] = 0.0;
			d1 = data[0];
			h2 = accuracy2;
			accuracy2 *= 0.5;
			data[0] = (func(num + accuracy2) - func(num - accuracy2)) / h2;
			for (let m = 4, i = 1; i <= j; i++, m *= 4) {
				d2 = data[i];
				data[i] = (m * data[i - 1] - d1) / (m - 1);
				d1 = d2;
			}
			if (Math.abs(data[j] - data[j - 1]) < accuracy1) {
				return data[j];
			}
		}
		return NaN;
	};

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
	Math.limit = function(type, num, func, places) {
		if (typeof places != "number" && !(places instanceof Number)) {
			places = 10;
		}
		let atX = func(num);
		switch (type) {
			case 1: {
				return _helper23(num, func, places, 1);
			}
			break;
			case 2: {
				return _helper23(num, func, places, 2);
			}
			break;
			default: {
				if (!Number.isNaN(atX)) {
					return atX;
				} else if (!Number.isNaN(num)) {
					if (num === Infinity) {
						return _helper23(num, func, places, 1);
					} else if (num === -Infinity) {
						return _helper23(num, func, places, 2);
					} else  {
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
	};

	/**
	*	
	* Calculate numerator and denominator of a number
	*
	* @param {number} num - The number to calculate
	* @param {number=} [iteration=0] - Denominator must not larger than this number
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
	Math.rational = function(num, iteration) {
		iteration = Utils.default(iteration, 0); //16
		let approx = 0,
			error = 0,
			best = 0,
			besterror = 0,
			result = [num, 1],
			i = 1;
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
	};

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
	Math.pdf = function(mean, variance, std, num) {
		let m = std * _pdf_1_,
			e = Math.exp(-Math.pow(num - mean, 2) / (2 * variance));
		return e / m;
	};

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
	Math.cdf = function(mean, std, num) {
		return 0.5 * Math.erfc(-(num - mean) / (std * Math.SQRT2));
	};

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
	Math.ppf = function(mean, std, num) {
		return mean - std * Math.SQRT2 * Math.ierfc(2 * num);
	};

	/**
	*	
	* [Error function]{@link https://en.wikipedia.org/wiki/Error_function}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.erf(1);
	* //0.8427007929497149
	*
	* @function erf
	* @memberof Math
	**/
	Math.erf = function(num) {
		let m = 1.00,
			s = 1.00,
			sum = num; // * 1.0
		for (let i = 1; i < 50; i++) {
			m *= i;
			s *= -1;
			sum += (s * oldPow(num, 2.0 * i + 1.0)) / (m * (2.0 * i + 1.0));
		}
		return 2 * sum / _erf_1_;
	};

	/**
	*	
	* [Complementary error function]{@link https://en.wikipedia.org/wiki/Error_function#Complementary_error_function}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.erfc(1);
	* //0.1572992070502851
	*
	* @function erfc
	* @memberof Math
	**/
	Math.erfc = function(num) {
		return 1 - Math.erf(num);
	};

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
	Math.ierf = function(num) {
		return Math.invNorm((num + 1) / 2.0 ) / Math.SQRT2;
	};

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
	Math.ierfc = function(num) {
		return -Math.invNorm(0.5 * num) / Math.SQRT2;
	};

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
	Math.erfcx = function(num) {
		if (num < 0) {
			return num < -6.1 ? 2 * Math.exp(num * num) : 2 * Math.exp(num * num) - Math.erfcx(-num);
		}
		if (num > 50) {
			let nm = num * num;
			return num > 5e7 ? _erfcx_1_[21] / num : _erfcx_1_[21] * (nm * (nm + 4.5) + 2) / (num * (nm * (nm + 5) + 3.75));
		}
		let E = _erfcx_1_[0] + num * (_erfcx_1_[1] + num * (_erfcx_1_[2] + num * (_erfcx_1_[3] + num * (_erfcx_1_[4] +
				num * (_erfcx_1_[5] + num * (_erfcx_1_[6] + num * (_erfcx_1_[7] + num * (_erfcx_1_[8] + num * _erfcx_1_[9])))))))),
			I = _erfcx_1_[10] + num * (_erfcx_1_[11] + num * (_erfcx_1_[12] + num * (_erfcx_1_[13] + num * (_erfcx_1_[14] + num * (_erfcx_1_[15] +
				num * (_erfcx_1_[16] + num * (_erfcx_1_[17] + num * (_erfcx_1_[18] + num * (_erfcx_1_[19] + num * _erfcx_1_[20])))))))));
		return E / I;
	};

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
	Math.invNorm = function(num) {
		let qw, we, er, result;
		if (num < _invNorm_1_[21]) {
			qw = Math.sqrt(-2 * Math.ln(num));
			er = (((((_invNorm_1_[11] * qw + _invNorm_1_[12]) * qw + _invNorm_1_[13]) * qw + _invNorm_1_[14]) * qw + _invNorm_1_[15]) * qw + _invNorm_1_[16]) /
				((((_invNorm_1_[17] * qw + _invNorm_1_[18]) * qw + _invNorm_1_[19]) * qw + _invNorm_1_[20]) * qw + 1);
			result = er;
		} else {
			qw = num - 0.5;
			we = qw * qw;
			er = (((((_invNorm_1_[0] * we + _invNorm_1_[1]) * we + _invNorm_1_[2]) * we + _invNorm_1_[3]) * we + _invNorm_1_[4]) * we + _invNorm_1_[5]) * qw /
				(((((_invNorm_1_[6] * we + _invNorm_1_[7]) * we + _invNorm_1_[8]) * we + _invNorm_1_[9]) * we + _invNorm_1_[10]) * we + 1);
			result = er - _pdf_1_ * (0.5 * Math.erfcx(-er / Math.SQRT2) - Math.exp(0.5 * er * er) * num);
		}
		return result;
	};

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
	Math.round = function(num, digits, base) {
		return _helper1(num, digits, base, 0);
	};

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
	Math.floor = function(num, digits, base) {
		return _helper1(num, digits, base, 1);
	};

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
	Math.ceil = function(num, digits, base) {
		return _helper1(num, digits, base, 2);
	};

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
	Math.trunc = function(num, digits, base) {
		return _helper1(num, digits, base, 3);
	};

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
	Math.away = function(num, digits, base) {
		return _helper1(num, digits, base, 4);
	};

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
	Math.round2 = function(num, digits, base) {
		return _helper2(num, digits, base, 0);
	};

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
	Math.floor2 = function(num, digits, base) {
		return _helper2(num, digits, base, 1);
	};

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
	Math.ceil2 = function(num, digits, base) {
		return _helper2(num, digits, base, 2);
	};

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
	Math.trunc2 = function(num, digits, base) {
		return _helper2(num, digits, base, 3);
	};

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
	Math.away2 = function(num, digits, base) {
		return _helper2(num, digits, base, 4);
	};

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
	Math.adjust = function(type, num, digits, base) {
		return _helper1(num, digits, base, type);
	};

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
	Math.adjust2 = function(type, num, digits, base) {
		return _helper2(num, digits, base, type);
	};

	/**
	*	
	* Snap a number to nearest number grid
	*
	* @param {number} type - 0: round, 1: floor, 2: ceil, 3: trunc, 4: away
	* @param {number} num
	* @param {number} gap - The interval gap of the grid
	* @param {number=} [offset=0]
	* @param {number=} [digits=0]
	* @param {number=} base
	* @return {number}
	*
	* @example
	* Math.snap(0, 12, 5);
	* //10
	*
	* @function snap
	* @memberof Math
	**/
	Math.snap = function(type, num, gap, offset, digits, base) {
		offset = Utils.default(offset, 0);
		if (gap === 0) return num;
		num -= offset;
		num = gap * _helper1(num / gap, digits, base, type);
		return offset + num;
	};

	/**
	*	
	* Snap a number to nearest number grid by digit location and base
	*
	* @param {number} type - 0: round, 1: floor, 2: ceil, 3: trunc, 4: away
	* @param {number} num
	* @param {number} gap - The interval gap of the grid
	* @param {number=} [offset=0]
	* @param {number=} [digits=0]
	* @param {number=} base
	* @return {number}
	*
	* @example
	* Math.snap2(0, 12, 5);
	* //0
	*
	* @function snap2
	* @memberof Math
	**/
	Math.snap2 = function(type, num, gap, offset, digits, base) {
		offset = Utils.default(offset, 0);
		if (gap === 0) return num;
		num -= offset;
		num = gap * _helper2(num / gap, digits, base, type);
		return offset + num;
	};

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
	Math.shear = function(num) {
		num = Math.abs(num);
		return num - oldFloor(num);
		//Can also n % 1
	};

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
	Math.precision = function(num) {
		if (!Number.isFinite(num)) {
			return 0;
		}
		let e = 1, p = 0;
		while (oldRound(num * e) / e !== num) {
			e *= 10;
			p++;
		}
		return p;
	};

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
	Math.order = function(num) {
		return oldFloor(Math.ln(Math.abs(num)) / Math.LN10);
	};

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
	Math.ramp = function(num) {
		if (num > 0) {
			return num;
		}
		return 0.0; //Handle -0
	};

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
	Math.heaviside = function(type, num) {
		if (Number.isNaN(num)) {
			return NaN;
		}
		if (num > 0.0) {
			return 1.0;
		}
		if (num === 0.0) {
			switch (type) {
				case 1:
					{
						return 0.0;
					}
					break;
				case 2:
					{
						return 1.0;
					}
					break;
				default:
					{
						return 0.5;
					}
					break;
			}
		}
		return 0.0;
	};

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
	Math.haar = function(num) {
		if (0.5 > num && num >= 0) {
			return 1;
		} else if (1 >= num && num > 0.5) {
			return -1;
		}
		return 0;
	};

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
	Math.rect = function(num) {
		num = Math.abs(num);
		if (num > 0.5) {
			return 0;
		} else if (num === 0.5) {
			return 0.5;
		} else if (num < 0.5) {
			return 1;
		}
		return NaN;
	};

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
	Math.tri = function(num) {
		num = Math.abs(num);
		if (num >= 1) {
			return 0;
		}
		return 1 - num;
	};

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
	Math.fold = function(type, num) {
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
	};

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
	Math.one = function(num) {
		return (oldRound(num) % 2) * 2 - 1;
	};

	/**
	*	
	* Check if number is within range
	*
	* @param {number} num
	* @param {number} min
	* @param {number} max
	* @param {boolean=} equalMin - Change to true if you want to compare `min == num`
	* @param {boolean=} equalMax -	Change to true if you want to compare `num == max`
	* @param {number=} [accuracy=1] - Accuracy
	* @return {boolean}
	*
	* @example
	* Math.range(1, 0, 2);
	* //true
	*
	* @function range
	* @memberof Math
	**/
	Math.range = function(num, min, max, equalMin, equalMax, accuracy) {
		accuracy = Utils.default(accuracy, 1);
		if (equalMin && equalMax) {
			return num >= (min * accuracy) && num <= (max * accuracy);
		} else if (equalMin) {
			return num >= (min * accuracy) && num < (max * accuracy);
		} else if (equalMax) {
			return num > (min * accuracy) && num <= (max * accuracy);
		} else {
			return num > (min * accuracy) && num < (max * accuracy);
		}
	};

	/**
	*	
	* Compare two numbers
	*
	* @param {number} num1
	* @param {number} num2
	* @param {boolean=} equal - Change to true if you want to compare `num1 == num2`
	* @param {boolean=} reverse -	Change to true if you want to compare `num1 > num2`
	* @param {number=} [accuracy=1] - Accuracy
	* @return {boolean}
	*
	* @example
	* Math.compare(0, 1);
	* //false
	*
	* @function compare
	* @memberof Math
	**/
	Math.compare = function(num1, num2, equal, reverse, accuracy) {
		accuracy = Utils.default(accuracy, 1);
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
	};

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
	Math.clamp = function(num, min, max) {
		if (num < min) {
			num = min;
		} else if (num > max) {
			num = max;
		}
		return num;
	};

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
	Math.wrap = function(num, min, max) {
		let range = max - min;
		if (range <= 0) {
			return 0;
		}
		let result = (num - min) % range;
		if (result < 0) {
			result += range;
		}
		return result + min;
	};

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
	Math.map = function(num, min1, max1, min2, max2) {
		let percent = (num - min1) / (max1 - min1);
		return min2 + percent * (max2 - min2);
	};

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
	Math.norm = function(num, min, max) {
		return (num - min) / (max - min);
	};

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
	Math.lerp = function(num, min, max) {
		return (1 - num) * min + num * max;
	};

	/**
	*	
	* Calculate [greatest common divisor]{@link https://en.wikipedia.org/wiki/Greatest_common_divisor}
	*
	* No limit of parameter, but all of them must be number
	*
	* @return {number}
	*
	* @example
	* Math.gcd(9, 6);
	* //3
	*
	* @function gcd
	* @memberof Math
	**/
	Math.gcd = function() {
		if (0 === arguments.length) {
			return NaN;
		}
		let t = arguments[0];
		for (let r = 1; r < arguments.length; r++) {
			t = _helper5(t, arguments[r]);
		}
		return t;
	};

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
	Math.lcm = function() {
		if (0 === arguments.length) {
			return NaN;
		}
		let t = arguments[0];
		for (let r = 1; r < arguments.length; r++) {
			t = _helper6(t, arguments[r]);
		}
		return t;
	};

	//Random
	/**
	*	
	* Pseudo random number generator uniformly distributed with options
	*
	* @param {number} min - Minimum
	* @param {number} max - Maximum
	* @param {boolean=} round - `true` if generate integer
	* @param {number|number[]} [seed=undefined] - Put seed to generate number here (if array then maximum length is 4)
	* @param {number=} larger - return this number if `min > max`
	* @param {number=} equal - return this number if `min == max`
	*
	* @return {number}
	*
	* @example
	* Math.random(0, 1);
	* //Any number within 0, 1, include float
	*
	* @function random
	* @memberof Math
	**/
	Math.random = function(min, max, round, seed, larger, equal) {
		let returnValue;
		if (seed) {
			if (typeof seed === "number") {
				_random_1_[0] = seed;
			} else {
				_random_1_[0] = seed[0] | 0;
			}
			_random_1_[1] = seed[1] | 0;
			_random_1_[2] = seed[2] | 0;
			_random_1_[3] = seed[3] | 0;
			_helper7();
			returnValue = _random_1_[4] * 2.3283064365386963e-10 + (_random_1_[5] >>> 12) * 2.220446049250313e-16;
		} else {
			returnValue = oldRandom();
		}
		min = Utils.default(min, 0);
		max = Utils.default(max, 1);
		if (min > max) {
			if (larger == null) {
				returnValue = 0;
			} else {
				returnValue = larger;
			}
			return returnValue;
		} else if (min == max) {
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
	};

	//Angle
	/**
	*	
	* Normalize angle in radians
	*
	* @param {number} num - The angle needs to normalize
	* @return {number}
	*
	* @example
	* Geometry.normRad(Math.TAU);
	* //0
	*
	* @function normRad
	* @memberof Geometry
	**/
	Geometry.normRad = function(num) {
		num = Geometry.fullRad(num);
		if (num > Math.PI) {
			num -= Math.TAU;
		}
		return num;
	};

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
	Geometry.toRad = function(num) {
		return num * _toRad_1_;
	};

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
	Geometry.fullRad = function(num) {
		return (Math.TAU + (num % Math.TAU)) % Math.TAU;
	};

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
	Geometry.normDeg = function(num) {
		num = Geometry.fullDeg(num);
		if (num > 180) {
			num -= 360;
		}
		return num;
	};

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
	Geometry.toDeg = function(num) {
		return num * _toDeg_1_;
	};

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
	Geometry.fullDeg = function(num) {
		return (360 + (num % 360)) % 360;
	};

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
	Geometry.getAngle = function(a_x, a_y, b_x, b_y) {
		return Math.atan2(b_y - a_y, b_x - a_x);
	};

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
	Geometry.relfAngle = function(num, mirror) {
		return 2 * mirror - num;
	};

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
	* //2.356194490192344
	*
	* @function diffAngle
	* @memberof Geometry
	**/
	Geometry.diffAngle = function(num1, num2) {
		return -((num1 - num2 + _diffAngle_1_) % Math.TAU - Math.PI);
	};

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
	* Geometry.isBetwAngle(Math.HALFPI, 0, Math.PI);
	* //true
	*
	* @function isBetwAngle
	* @memberof Geometry
	**/
	Geometry.isBetwAngle = function(num, min, max) {
		num = Geometry.fullRad(num);
		min = Geometry.fullRad(min);
		max = Geometry.fullRad(max);
		if (min < max) {
			return min <= num && num <= max;
		} else {
			return min <= num || num <= max;
		}
	};

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
	Geometry.colliAnglePnt = function(o_1, o_2, o_x, o_y, a_x, a_y) {
		return Geometry.isBetwAngle(Geometry.getAngle(o_x, o_y, a_x, a_y), o_1, o_2);
	};

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
	Geometry.distPnt = function(a_x, a_y, b_x, b_y, square) {
		let result, temp1 = a_x - b_x, temp2 = a_y - b_y;
		result = temp1 * temp1 + temp2 * temp2;
		if (square) {
			result = Math.sqrt(result);
		}
		return result;
		//result = Math_pow(a, 2) + Math_pow(b, 2);
	};

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
	* Geometry.polarDistPnt(0, 0, 1, Math.HALFPI, true);
	* //1
	*
	* @function polarDistPnt
	* @memberof Geometry
	**/
	Geometry.polarDistPnt = function(r_1, a_1, r_2, a_2, square) {
		let temp = r_1 * r_1 + r_2 * r_2 - 2 * r_1 * r_2 * Math.cos(a_2 - a_1);
		if (square) {
			temp = Math.sqrt(temp);
		}
		return temp;
	};

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
	Geometry.manDistPnt = function(a_x, a_y, b_x, b_y) {
		return Math.abs(a_x - b_x) + Math.abs(a_y - b_y);
	};

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
	Geometry.chevDistPnt = function(a_x, a_y, b_x, b_y) {
		return Math.max(Math.abs(a_x - b_x), Math.abs(a_y - b_y));
	};

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
	* @return {{x: number, y: number}}
	*
	* @example
	* Geometry.rotPnt(0, 0, 0, 1, Math.HALFPI, Math.HALFPI);
	* //{x: -1, y: 6.123233995736766e-17}
	*
	* @function rotPnt
	* @memberof Geometry
	**/
	Geometry.rotPnt = function(a_x, a_y, b_x, b_y, x_x, x_y) {
		let s = Math.sin(x_y), c = Math.cos(x_x);
		b_x -= a_x;
		b_y -= a_y;
		return {
			x: b_x * c - b_y * s + a_x,
			y: b_x * s + b_y * c + a_y,
		};
	};

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
	Geometry.anglePnt = function(a_x, a_y, b_x, b_y, o_x, o_y) {
		let temp1 = a_x - o_x,
		temp2 = a_y - o_y,
		temp3 = b_x - o_x,
		temp4 = b_y - o_y;
		return Math.acos(Math.dotVec(temp1, temp2, temp3, temp4) / Math.sqrt((temp1 * temp1 + temp2 * temp2) * (temp3 * temp3 + temp4 * temp4)));
	};
	
	/**
	*	
	* Get center of circles from two points and radius
	*
	* @param {number} a_x - x position of first point
	* @param {number} a_y - y position of first point
	* @param {number} b_x - x position of second point
	* @param {number} b_y - y position of second point
	* @param {number} o_x - circle radius
	* @return {Object} Return two center points (both point will be NaN if there is no possible center)
	*
	* @example
	* Geometry.cntrPnt(1, 0, -1, 0, 2);
	* //{x1: 0, y1: -1.7320508075688772, x2: 0, y2: 1.7320508075688772}
	*
	* @function cntrPnt
	* @memberof Geometry
	**/
	Geometry.cntrPnt = function(a_x, a_y, b_x, b_y, r) {
		let p, q, c_x, c_y, dataOne, dataTwo;
		q = Geometry.distPnt(b_x, b_y, a_x, a_y, true);
		c_x = (a_x + b_x) / 2;
		c_y = (a_y + b_y) / 2;
		p = Math.sqrt(r * r - oldPow(q / 2, 2));
		dataOne = p * (a_y - b_y) / q;
		dataTwo = p * (b_x - a_x) / q;
		return {
			x1: c_x + dataOne,
			y1: c_y + dataTwo,
			x2: c_x - dataOne,
			y2: c_y - dataTwo,
		};
	};

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
	Geometry.cmpPnt = function(a_x, a_y, b_x, b_y, accuracy) {
		accuracy = Utils.default(accuracy, 1e-10);
		if (Math.abs(a_x - b_x) > accuracy) return a_x > b_x ? 1 : -1;
		if (Math.abs(a_y - b_y) > accuracy) return a_y > b_y ? 1 : -1;
		return 0;
	};

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
	Geometry.slopeLine = function(a_x, a_y, b_x, b_y) {
		return (b_y - a_y) / (b_x - a_x);
	};

	/**
	*	
	* Convert to standard form of a line segment where `ax + by + c = 0`
	*
	* @param {number} a_x - x position of first point of the segment
	* @param {number} a_y - y position of first point of the segment
	* @param {number} b_x - x position of second point of the segment
	* @param {number} b_y - y position of second point of the segment
	* @return {{a: number, b: number, c: number}}
	*
	* @example
	* Geometry.stdLine(0, 0, 1, 1);
	* //{a: 1, b: -1, c: 0}
	*
	* @function stdLine
	* @memberof Geometry
	**/
	Geometry.stdLine = function(a_x, a_y, b_x, b_y) {
		let result = {};
		if (b_x - a_x === 0) {
			result.a = -1;
			result.b = 0;
			result.c = a_x;
		} else {
			let temp = Geometry.slopeLine(a_x, a_y, b_x, b_y);
			result.a = temp;
			result.b = -1;
			result.c = -b_x * temp + b_y;
		}
		return result;
	};

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
	* @param {number} y_y - y position of the point
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
	Geometry.distLinePnt = function(type, a_x, a_y, b_x, b_y, x_x, x_y, square) {
		if (type) {
			return Math.abs((b_y - a_y) * x_x - (b_x - a_x) * x_y + b_x * a_y - b_y * a_x) / Geometry.distPnt(a_x, a_y, b_x, b_y, true);
		} else {
			let l2 = Geometry.distPnt(a_x, a_y, b_x, b_y, false);
			if (l2 === 0) {
				return Geometry.distPnt(x_x, x_y, a_x, a_y, square); //maybe false?
			}
			let t = Math.dotVec(x_x - a_x, x_y - a_y, b_x - a_x, b_y - a_y) / l2;
			t = Math.max(0, Math.min(1, t));
			return Geometry.distPnt(x_x, x_y, a_x + t * (b_x - a_x), a_y + t * (b_y - a_y), square);
		}
	};

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
	Geometry.distLine = function(type, a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y, square) {
		let dist1 = Geometry.distLinePnt(type, c_x, c_y, d_x, d_y, a_x, a_y, square),
			dist2;
		if (dist1 > 0) {
			dist2 = Geometry.distLinePnt(type, c_x, c_y, d_x, d_y, b_x, b_y, square);
			if (dist1 < dist2) {
				return dist1;
			}
			return dist2;
		}
		return 0;
	};

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
	* @param {boolean=} [square=false] - `false` if you want distance squared
	* @return {{x: number, y: number, onLine1: boolean, onLine2: boolean}} returnData.onLine1 will true if intersection point is on line a_x a_y b_x b_y and otherwise
	*
	* @example
	* Geometry.intrLine(0, 0, 1, 1, 1, 0, 1, -1);
	* //{x: 1, y: 1, onLine1: true, onLine2: false}
	*
	* @function intrLine
	* @memberof Geometry
	**/
	Geometry.intrLine = function(a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y) {
		let denominator, a, b, s1_x, s1_y, s2_x, s2_y, numerator1, numerator2, result = {
			x: null,
			y: null,
			onLine1: false,
			onLine2: false,
		};

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
				Number.isNaN(Geometry.slopeLine(s2_x * s1_y, s1_x * a, s1_x * s2_y, s1_y * b)) &&
				Number.isNaN(Geometry.slopeLine(s1_x * s2_y, s2_y * b, s2_x * s1_y, s2_x * a))
			) { 
				result.onLine1 = (Geometry.colliLinePnt(true, a_x, a_y, b_x, b_y, c_x, c_y) || Geometry.colliLinePnt(true, a_x, a_y, b_x, b_y, d_x, d_y));
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
	};

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
	* @param {boolean=} [square=false] - `false` if you want distance squared
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
	Geometry.intrLineCirc = function(a_x, a_y, b_x, b_y, o_x, o_y, radius) {
		//xy is perpendicular intersection
		let dist1, dist2, d_x, d_y, t, dt, returnData = {
			x: null,
			y: null,
			x1: null,
			y1: null,
			x2: null,
			y2: null,
			onLine: false,
			onLine1: false,
			onLine2: false,
		};
		dist1 = Geometry.distPnt(a_x, a_y, b_x, b_y, true);
		d_x = (b_x - a_x) / dist1;
		d_y = (b_y - a_y) / dist1;
		t = d_x * (o_x - a_x) + d_y * (o_y - a_y);
		returnData.x = t * d_x + a_x;
		returnData.y = t * d_y + a_y;
		dist2 = Geometry.distPnt(returnData.x, returnData.y, o_x, o_y, true);
		if (dist2 < radius) {
			dt = Math.sqrt(radius * radius - dist2 * dist2);
			returnData.x1 = (t - dt) * d_x + a_x;
			returnData.y1 = (t - dt) * d_y + a_y;
			returnData.onLine1 = Geometry.colliLinePnt(true, a_x, a_y, b_x, b_y, returnData.x1, returnData.y1);
			returnData.x2 = (t + dt) * d_x + a_x;
			returnData.y2 = (t + dt) * d_y + a_y;
			returnData.onLine2 = Geometry.colliLinePnt(true, a_x, a_y, b_x, b_y, returnData.x2, returnData.y2);
		} else if (dist2 === radius) {
			//One intersection
			returnData.onLine = true;
		} else {
			//No intersection
			returnData.x = null;
			returnData.y = null;
		}
		return returnData;
	};

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
	Geometry.sideLine = function(a_x, a_y, b_x, b_y, o_x, o_y) {
		return Math.crossVec(b_x - a_x, b_y - a_y, o_x - a_x, o_y - a_y);
	};

	/**
	*	
	* Calculate location of a point on a line
	*
	* @param {number} a_x - x position of first point of the line segment
	* @param {number} a_y - y position of first point of the line segment
	* @param {number} b_x - x position of second point of the line segment
	* @param {number} b_y - y position of second point of the line segment
	* @param {number} scale - the location of the point on the line, 0 to 1, but can be larger or smaller than that range
	* @return {{x: number, y: number}}
	*
	* @example
	* Geometry.onLine(0, 0, 2, 2, 0.5);
	* //{x: 1, y: 1}
	*
	* @function onLine
	* @memberof Geometry
	**/
	Geometry.onLine = function(a_x, a_y, b_x, b_y, scale) {
		let xlen = b_x - a_x,
			ylen = b_y - a_y;
		let smallerXLen = xlen * scale,
			smallerYLen = ylen * scale;
		return {
			x: a_x + smallerXLen,
			y: a_y + smallerYLen,
		};
	};

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
	Geometry.colliLinePnt = function(type, a_x, a_y, b_x, b_y, o_x, o_y, accuracy) {
		accuracy = Utils.default(accuracy, 1e-10);
		let v_x = a_x - o_x,
				v_y = a_y - o_y,
				w_x = o_x - b_x,
				w_y = o_y - b_y;
		let temp = Math.crossVec(v_x, v_y, w_x, w_y); //compare equal to 0
		return (temp >= -accuracy && temp <= accuracy && (Math.dotVec(v_x, v_y, w_x, w_y) >= 0 || !type));
	};

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
	Geometry.getXLine = function(a_x, a_y, b_x, b_y, num) {
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
	};

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
	Geometry.getYLine = function(a_x, a_y, b_x, b_y, num) {
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
	};

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
	Geometry.colliRayRect = function(a_x, a_y, b_x, b_y, x_min, y_min, x_max, y_max) {
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
	};

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
	Geometry.colliArcCircPnt = function(a_x, a_y, o_x, o_y, o_r, x_x, x_y, y_x, y_y) {
		let temp_x = a_x - o_x,
		temp_y = a_y - o_y;
		return !Math.clockWiseVec(x_x, x_y, temp_x, temp_y) &&
			Math.clockWiseVec(y_x, y_y, temp_x, temp_y) &&
			Geometry.colliCirc(0, 0, 0, temp_x, temp_y, o_r);
	};

	/**
	*	
	* Check if a point is inside a circle, return 1, 0, -1 based on location
	*
	* @param {number} a_x - x position of point
	* @param {number} a_y - y position of point
	* @param {number} o_x - x position of center point
	* @param {number} o_y - y position of center point
	* @param {number} o_r - radius of the circle
	* @param {number=} [accuracy=1e-10] - Accuracy
	* @return {number}
	*
	* @example
	* Geometry.colliCircPnt(1, 1, 0, 0, 2);
	* //1
	*
	* @function colliCircPnt
	* @memberof Geometry
	**/
	Geometry.colliCircPnt = function(a_x, a_y, o_x, o_y, o_r, accuracy) {
		accuracy = Utils.default(accuracy, 1e-10);
		let dist = Geometry.distPnt(a_x, a_y, o_x, o_y, false),
				rSq = o_r * o_r;
		return dist < rSq ? 1 : Math.abs(dist - rSq) < accuracy ? 0 : -1;
	};

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
	Geometry.colliCirc = function(a_x, a_y, a_r, b_x, b_y, b_r) {
		let temp1 = b_x - a_x, temp2 = b_y - a_y, temp3 = a_r + b_r;
		return temp1 * temp1 + temp2 * temp2 <= temp3 * temp3;
	};

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
	Geometry.colliCircRect = function(o_x, o_y, o_r, x_min, y_min, x_max, y_max) {
		return Geometry.distPnt(Math.clamp(o_x, x_min, x_max), Math.clamp(o_y, y_min, y_max), o_x, o_y, false) <= o_r * o_r;
	};

	/**
	*	
	* Generate random point inside circle
	*
	* @param {number} x - x position of center point
	* @param {number} y - y position of center point
	* @param {number} radius - radius of the circle
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
	Geometry.randomCirc = function(x, y, radius, uniform) {
		let a = oldRandom(),
			b = oldRandom(),
			c;
		if (uniform && b < a) {
			c = b;
			b = a;
			a = c;
		}
		return Math.rec(x, y, b * radius, Math.TAU * a / b);
	};

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
	*	@return {{x: number, y: number}} returnData.x and returnData.y
	*
	* @example
	* Geometry.onElli(0, 0, 2, 1, 0, 0);
	* //{x: 2, y: 0}
	*
	* @function onElli
	* @memberof Geometry
	**/
	Geometry.onElli = function(x, y, radius1, radius2, angle, angle2) {
		let angle_2 = Math.sin(angle),
		angle2_2 = Math.sin(angle2);
		angle = Math.cos(angle);
		angle2 = Math.cos(angle2);
		return {
			x: radius1 * angle2 * angle - radius2 * angle2_2 * angle_2 + x,
			y: radius2 * angle2_2 * angle + radius1 * angle2 * angle_2 + y,
		};
	};

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
	*	@return {boolean}
	*
	* @example
	* Geometry.colliElliPnt(0, 0, 2, 1, 0, 1, 0);
	* //true
	*
	* @function colliElliPnt
	* @memberof Geometry
	**/
	Geometry.colliElliPnt = function(x, y, radius1, radius2, angle, o_x, o_y) {
		let cosa = Math.cos(angle),
			sina = Math.sin(angle);
		o_x -= x;
		o_y -= y;
		let temp = cosa * o_x + sina * o_y;
		sina = sina * o_x - cosa * o_y;
		cosa = temp;
		return (4 * cosa * cosa) / (radius1 * radius1) + (4 * sina * sina) / (radius2 * radius2) <= 1;
	};

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
	*	@return {Array} [x1, y1, x2, y2, ...]
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
	Geometry.intrElli = function(x_1, y_1, radius1_1, radius2_1, angle_1, x_2, y_2, radius1_2, radius2_2, angle_2) {
		radius1_1 /= 2;
		radius2_1 /= 2;
		radius1_2 /= 2;
		radius2_2 /= 2;
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
		let result = [], l, t2, t2_1, t2_2;
		l = _helper19(
			aa + ab2 + bb + dd + de2 + ee - rr,
			ac4 + bc4 + df4 + ef4,
			2 * aa - 2 * bb + 4 * c * c + 2 * dd - 2 * ee + 4 * f * f - 2 * rr,
			ac4 - bc4 + df4 - ef4,
			aa - ab2 + bb + dd - de2 + ee - rr
		);
		for (let n = 0; n < l; ++n) {
			t2 = 2 * Math.atan(_helper19_2_[n]);
			t2_1 = Math.cos(t2) * radius1_2;
			t2_2 = Math.sin(t2) * radius2_2;
			result[n * 2] = x_2 + t2_1 * tempAngle2_1 - t2_2 * tempAngle2_2;
			result[n * 2 + 1] = y_2 + t2_1 * tempAngle2_2 + t2_2 * tempAngle2_1;
		}
		return result;
	};

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
	*	@return {Array} [x1, y1, x2, y2, ...]
	*
	* @example
	* Geometry.intrElliLine(0, 0, 2, 1, 0, 0, 2, 0, -2);
	* //[0, 1, 0, -1]
	*
	* @function intrElliLine
	* @memberof Geometry
	**/
	Geometry.intrElliLine = function(x, y, radius1, radius2, angle, a_x, a_y, b_x, b_y) {
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
		let D = tempB * tempB - 4 * tempA * tempC, t, result = [];
		if (D === 0) {
			t = -tempB / (2 * tempA);
			//if (0 <= t && t <= 1) {
				result[0] = (1 - t) * a_x + t * b_x;
				result[1] = (1 - t) * a_y + t * b_y;
			//}
		} else if (D > 0) {
			let sqrtD = Math.sqrt(D),
				noOfIntx = 0;
			t = (-tempB - sqrtD) / (2 * tempA);
			//if (0 <= t && t <= 1) {
				result[0] = (1 - t) * a_x + t * b_x;
				result[1] = (1 - t) * a_y + t * b_y;
				noOfIntx ++;
			//}
			t = (-tempB + sqrtD) / (2 * tempA);
			//if (0 <= t && t <= 1) {
				result[noOfIntx * 2] = (1 - t) * a_x + t * b_x;
				result[noOfIntx * 2 + 1] = (1 - t) * a_y + t * b_y;
				noOfIntx ++;
			//}
		}
		return result;
	};

	/**
	*	
	* Find bounding box of an ellipse
	*
	* @param {number} x - x position of center point of the ellipse
	* @param {number} y - y position of center point of the ellipse
	* @param {number} radius1 - radius of major axis of the ellipse
	* @param {number} radius2 - radius of minor axis of the ellipse
	* @param {number} angle - rotation of ellipse in radians of the ellipse
	*	@return {{xMin: number, yMin: number, xMax: number, yMax: number}}
	*
	* @example
	* Geometry.boundElli(0, 0, 2, 1, Math.PI / 4);
	* //{xMin: -1.5811388300841895, yMin: -1.5811388300841895, xMax: 1.5811388300841895, yMax: 1.5811388300841895}
	*
	* @function boundElli
	* @memberof Geometry
	**/
	Geometry.boundElli = function(x, y, radius1, radius2, angle) {
		radius1 /= 2;
		radius2 /= 2;
		let temp_x = Math.atan(-radius2 * Math.tan(angle) / radius1),
			temp_y = Math.atan(radius2 * Math.cot(angle) / radius1),
			angle_2 = Math.sin(angle);
		angle = Math.cos(angle);
		temp_x = Math.abs(radius1 * Math.cos(temp_x) * angle - radius2 * Math.sin(temp_x) * angle_2);
		temp_y = Math.abs(radius2 * Math.sin(temp_y) * angle + radius1 * Math.cos(temp_y) * angle_2);
		return {
			xMin: -temp_x + x,
			yMin: -temp_y + y,
			xMax: temp_x + x,
			yMax: temp_y + y
		};
	};

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
	* @return {{x: number, y: number}} returnData.x and returnData.y
	*
	* @example
	* Geometry.randomElli(0, 0, 2, 1, Math.PI / 4);
	* //Random point
	*
	* @function randomElli
	* @memberof Geometry
	**/
	Geometry.randomElli = function(x, y, radius1, radius2, angle, uniform) {
		let a = oldRandom(),
			b = oldRandom(),
			c;
		if (uniform && b < a) {
			c = b;
			b = a;
			a = c;
		}
		return Geometry.onElli(x, y, b * radius1, b * radius2, angle, Math.TAU * a / b);
	};

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
	* Geometry.distElliPnt(2, 1, Math.HALFPI);
	* //1
	*
	* @function distElliPnt
	* @memberof Geometry
	**/
	Geometry.distElliPnt = function(radius1, radius2, angle) {
		let temp = 1 / Math.sqrt(
			Math.pow(Math.sin(angle) / radius2, 2) +
			Math.pow(Math.cos(angle) / radius1, 2)
		);
		return Number.isFinite(temp) ? temp : 0;
	};

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
	* @return {{x: number, y: number}} returnData.x and returnData.y
	*
	* @example
	* Geometry.centroidTri(0, 0, 2, 0, 1, 1);
	* //{x: 1, y: 0.3333333333333333}
	*
	* @function centroidTri
	* @memberof Geometry
	**/
	Geometry.centroidTri = function(x_1, y_1, x_2, y_2, x_3, y_3) {
		return {
			x: (x_1 + x_2 + x_3) / 3,
			y: (y_1 + y_2 + y_3) / 3,
		};
	};

	/**
	*	
	* Construct equilateral triangle
	*
	* @param {number} x - x position of point
	* @param {number} y - y position of point
	* @param {number} len - height of the triangle
	* @return {Object}
	*
	* @example
	* Geometry.equilTri(0, 0, 2);
	* //{x1: 0, y1: 0, x2: 1, y2: 1.7320508075688772, x3: -1, y3: 1.7320508075688772}
	*
	* @function equilTri
	* @memberof Geometry
	**/
	Geometry.equilTri = function(x, y, len) {
		let temp = y + len * _triEquil_1_,
		temp2 = len / 2;
		return {
			x1: x,
			y1: y,
			x2: x + temp2,
			y2: temp,
			x3: x - temp2,
			y3: temp,
		};
	};

	/**
	*	
	* Construct right triangle
	*
	* @param {number} x - x position of point
	* @param {number} y - y position of point
	* @param {number} width - width of the triangle
	* @param {number} height - height of the triangle
	* @return {Object}
	*
	* @example
	* Geometry.rightTri(0, 0, 2, 2);
	* //{x1: 0, y1: 0, x2: 0, y2: -2, x3: 2, y3: 0}
	*
	* @function rightTri
	* @memberof Geometry
	**/
	Geometry.rightTri = function(x, y, width, height) {
		return {
			x1: x,
			y1: y,
			x2: x,
			y2: y - height,
			x3: x + width,
			y3: y,
		};
	};

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
	* @return {{x: number, y: number}} returnData.x and returnData.y
	*
	* @example
	* Geometry.crcmCntrTri(0, 0, 2, 0, 1, 1);
	* //{x: 2, y: 0}
	*
	* @function crcmCntrTri
	* @memberof Geometry
	**/
	Geometry.crcmCntrTri = function(x_1, y_1, x_2, y_2, x_3, y_3) {
		let p, q, r, s, dataOne, dataTwo, dataThree;
		p = x_1 - x_3;
		q = y_1 - y_3;
		r = x_2 - x_3;
		s = y_2 - y_3;
		dataOne = p * p + q * q;
		dataTwo = r * r + s * s;
		dataThree = 2 * Math.crossVec(p, q, r, s);
		return {
			x: x_3 - Math.crossVec(q, dataOne, r, dataTwo) / dataThree,
			y: y_3 + Math.crossVec(p, dataOne, r, dataTwo) / dataThree,
		};
	};

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
	* @return {Object}
	*
	* @example
	* Geometry.crcmCircTri(0, 0, 2, 0, 1, 1);
	* //{x: 1, y: 0, r: 1}
	*
	* @function crcmCircTri
	* @memberof Geometry
	**/
	Geometry.crcmCircTri = function(x_1, y_1, x_2, y_2, x_3, y_3) {
		let A = x_2 - x_1,
		B = y_2 - y_1,
		C = x_3 - x_1,
		D = y_3 - y_1;
		let E = A * (x_1 + x_2) + B * (y_1 + y_2),
		F = C * (x_1 + x_3) + D * (y_1 + y_3),
		G = 2 * (A * (y_3 - y_2) - B * (x_3 - x_2)),
		dx, dy, returnData = {};
		returnData.x = (D * E - B * F) / G;
		returnData.y = (A * F - C * E) / G;
		dx = returnData.x - x_1;
		dy = returnData.y - y_1;
		returnData.r = Math.sqrt(dx * dx + dy * dy) * 2;
		return returnData;
	};

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
	* @return {Object}
	*
	* @example
	* Geometry.inCircTri(0, 0, 2, 0, 1, 1);
	* //{x: 1, y: 0.4142135623730951, r: 0.41421356237309487}
	*
	* @function inCircTri
	* @memberof Geometry
	**/
	Geometry.inCircTri = function(x_1, y_1, x_2, y_2, x_3, y_3) {
		let d1 = Geometry.distPnt(x_3, y_3, x_2, y_2, true),
			d2 = Geometry.distPnt(x_1, y_1, x_3, y_3, true),
			d3 = Geometry.distPnt(x_2, y_2, x_1, y_1, true);
		let p = d1 + d2 + d3,
			temp = (d3 + d1 + d2) / 2;
		return {
			x: (x_1 * d1 + x_2 * d2 + x_3 * d3) / p,
			y: (y_1 * d1 + y_2 * d2 + y_3 * d3) / p,
			r: Math.sqrt(temp * (temp - d3) * (temp - d1) * (temp - d2)) / temp,
		};
	};

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
	Geometry.colliTriPnt = function(a_x, a_y, b_x, b_y, c_x, c_y, o_x, o_y) {
		let s = a_y * c_x - a_x * c_y + (c_y - a_y) * o_x + (a_x - c_x) * o_y,
			t = a_x * b_y - a_y * b_x + (a_y - b_y) * o_x + (b_x - a_x) * o_y;

		if ((s < 0) != (t < 0))	return false;

		let area = -b_y * c_x + a_y * (c_x - b_x) + a_x * (b_y - c_y) + b_x * c_y;
		if (area < 0.0) {
			s = -s;
			t = -t;
			area = -area;
		}
		return s > 0 && t > 0 && (s + t) <= area;
	};

	/**
	*	
	* Calculate area of the triangle
	*
	* @param {number} a_x - x position of the first vertex
	* @param {number} a_y - y position of the first vertex
	* @param {number} b_x - x position of the second vertex
	* @param {number} b_y - y position of the second vertex
	* @param {number} c_x - x position of the third vertex
	* @param {number} c_y - y position of the third vertex
	* @return {number}
	*
	* @example
	* Geometry.areaTri(0, 0, 2, 0, 1, 1);
	* //1
	*
	* @function areaTri
	* @memberof Geometry
	**/
	Geometry.areaTri = function(x_1, y_1, x_2, y_2, x_3, y_3) {
		return Math.abs(((x_3 - x_1) * (y_2 - y_1) - (x_2 - x_1) * (y_3 - y_1)) / 2);
	};

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
	* @return {Object}
	*
	* @example
	* Geometry.randomTri(0, 0, 2, 0, 1, 1);
	* //Random point
	*
	* @function randomTri
	* @memberof Geometry
	**/
	Geometry.randomTri = function(a_x, a_y, b_x, b_y, c_x, c_y) {
		let r1 = Math.sqrt(oldRandom()),
			r2 = oldRandom(),
			temp1 = 1 - r1,
			temp2 = r1 * (1 - r2),
			temp3 = r1 * r2;
		return {
			x: temp1 * a_x + temp2 * b_x + temp3 * c_x,
			y: temp1 * a_y + temp2 * b_y + temp3 * c_y,
		};
	};

	//Rectangle
	/**
	*	
	* Check if a point inside the rectangle
	*
	* @param {number} x_min - x position of top-left corner
	* @param {number} y_min - y position of top-left corner
	* @param {number} x_max - x position of bottom-right corner
	* @param {number} y_max - y position of bottom-right corner
	* @param {number} o_x - x position of the point
	* @param {number} o_y - y position of the point
	* @return {boolean}
	*
	* @example
	* Geometry.colliRectPnt(0, 0, 2, 1, 1, 1);
	* //true
	*
	* @function colliRectPnt
	* @memberof Geometry
	**/
	Geometry.colliRectPnt = function(x_min, y_min, x_max, y_max, x, y) {
		if (x_max - x_min <= 0 || y_max - y_min <= 0) {
			return false;
		}
		return (x_min <= x && x_max >= x && y_min <= y && y_max >= y);
	};

	/**
	*	
	* Check if a rectangle collide another rectangle
	*
	* @param {number} x_min - x position of top-left corner of first rectangle
	* @param {number} y_min - y position of top-left corner of first rectangle
	* @param {number} x_max - x position of bottom-right corner of first rectangle
	* @param {number} y_max - y position of bottom-right corner of first rectangle
	* @param {number} x_min - x position of top-left corner of second rectangle
	* @param {number} y_min - y position of top-left corner of second rectangle
	* @param {number} x_max - x position of bottom-right corner of second rectangle
	* @param {number} y_max - y position of bottom-right corner of second rectangle
	* @return {boolean}
	*
	* @example
	* Geometry.colliRect(0, 0, 2, 1, 1, 1, 3, 2);
	* //true
	*
	* @function colliRect
	* @memberof Geometry
	**/
	Geometry.colliRect = function(x_min, y_min, x_max, y_max, x2_min, y2_min, x2_max, y2_max) {
		if (Math.abs(x_max - x_min) <= 0 || Math.abs(y_max - y_min) <= 0 || Math.abs(x2_max - x2_min) <= 0 || Math.abs(y2_max - y2_min) <= 0) {
			return false;
		}
		return !(x_max < x2_min || y_max < y2_min || x_min > x2_max || y_min > y2_max);
	};

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
	* @return {{xMin: number, yMin: number, xMax: number, yMax: number}}
	*
	* @example
	* Geometry.intrRect(0, 0, 2, 1, 1, 1, 3, 2);
	* //{xMin: 1, yMin: 1, xMax: 2, yMax: 1}
	*
	* @function intrRect
	* @memberof Geometry
	**/
	Geometry.intrRect = function(x_min, y_min, x_max, y_max, x2_min, y2_min, x2_max, y2_max) {
		if (Geometry.colliRect(x_min, y_min, x_max, y_max, x2_min, y2_min, x2_max, y2_max)) {
			return {
				xMin: Math.max(x_min, x2_min),
				yMin: Math.max(y_min, y2_min),
				xMax: Math.min(x_max, x2_max),
				yMax: Math.min(y_max, y2_max),
			};
		}
		return null;
	};

	/**
	*	
	* Generate random point inside a rectangle
	*
	* @param {number} x_min - x position of top-left corner
	* @param {number} y_min - y position of top-left corner
	* @param {number} x_max - x position of bottom-right corner
	* @param {number} y_max - y position of bottom-right corner
	* @return {{x: number, y: number}}
	*
	* @example
	* Geometry.randomRect(0, 0, 2, 1);
	* //Random point
	*
	* @function randomRect
	* @memberof Geometry
	**/
	Geometry.randomRect = function(x_min, y_min, x_max, y_max) {
		return {
			x: x_min + oldRandom() * Math.abs(x_max - x_min),
			y: y_min + oldRandom() * Math.abs(y_max - y_min),
		};
	};

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
	Geometry.colliPolyPnt = function(points, x, y) {
		let inside = false, ix, iy, jx, jy;
		for (let i = -2, j = points.length - 2; (i += 2) < points.length; j = i) {
			ix = points[i];
			iy = points[i + 1];
			jx = points[j];
			jy = points[j + 1];
			if (((iy <= y && y < jy) || (jy <= y && y < iy)) && (x < (jx - ix) * (y - iy) / (jy - iy) + ix)) {
				inside = !inside;
			}
		}
		return inside;
	};

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
	Geometry.colliPolyCirc = function(points, o_x, o_y, o_r) {
		o_r /= 2;
		if (Geometry.colliPolyPnt(points, o_x, o_y)) {
			return true;
		}
		for (let i = 2; i < points.length; i += 2) {
			if (Geometry.distLinePnt(false, points[i - 2], points[i - 1], points[i], points[i + 1], o_x, o_y, false) < o_r * o_r) {
				return true;
			}
		}
		return Geometry.distLinePnt(false, points[points.length - 2], points[points.length - 1], points[0], points[1], o_x, o_y, false) < o_r * o_r;
	};

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
	Geometry.colliPoly = function(points1, points2) {
		let t1 = Geometry.boundPoly(points1),
			t2 = Geometry.boundPoly(points2),
			i;
		if (Geometry.colliRect(t1.xMin, t1.yMin, t1.xMax, t1.yMax, t2.xMin, t2.yMin, t2.xMax, t2.yMax)) {
			let len = points1.length > points2.length ? points1.length : points2.length;
			for (i = 0; i < len; i += 2) {
				if (Geometry.colliPolyPnt(points2, points1[i], points1[i + 1]) && i <= points1.length) {
					return true;
				}
				if (Geometry.colliPolyPnt(points1, points2[i], points2[i + 1]) && i <= points2.length) {
					return true;
				}
			}
		}
		return false;
	};

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
	Geometry.isSimplePoly = function(points) {
		let n = points.length >> 1;
		if (n < 4) {
			return true;
		}
		let a1_x, a1_y,
			a2_x, a2_y,
			b1_x, b1_y,
			b2_x, b2_y,
			temp;

		for (let i = 0; i < n; i ++) {
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
				temp = Geometry.intrLine(a1_x, a1_y, a2_x, a2_y, b1_x, b1_y, b2_x, b2_y);
				if (temp.onLine1 && temp.onLine2) {
					return false;
				}
			}
		}
		return true;
	};

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
	Geometry.isConvexPoly = function(points) {
		if (points.length <= 6) {
			return false;
		}
		let check = Geometry.isClockWisePoly(points),
			ccw = Geometry.sideLine(points[points.length - 3], points[points.length - 2], points[0], points[1], points[2], points[3]),
			temp;
		ccw = (ccw > 0 || Math.abs(ccw) < 0);
		for (let i = 2; i < points.length - 2; i += 2) {
			temp = Geometry.sideLine(points[i - 2], points[i - 1], points[i], points[i + 1], points[i + 2], points[i + 3]);
			if ((check ? temp > 0 : temp < 0) !== ccw) {
				return true;
			}
		}
		return false;
	};

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
	Geometry.isClockWisePoly = function(points) {
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
				s += Geometry.normRad(dir - pdir);
				pdir = dir;
			}
		}
		s += Geometry.normRad(-pdir);
		return s >= 0;
	};

	/**
	*	
	* Find bounding box of a polygon (convex, concave, complex)
	*
	* @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	* @return {{xMin: number, yMin: number, xMax: number, yMax: number}}
	*
	* @example
	* Geometry.boundPoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	* //{xMin: 0, yMin: 0, xMax: 100, yMax: 100}
	*
	* @function boundPoly
	* @memberof Geometry
	**/
	Geometry.boundPoly = function(points) {
		let minX = Number.MAX_SAFE_INTEGER,
			minY = Number.MAX_SAFE_INTEGER,
			maxX = Number.MIN_SAFE_INTEGER,
			maxY = Number.MIN_SAFE_INTEGER,
			px, py;
		for (let i = 0; i < points.length; i += 2) {
			px = points[i];
			py = points[i + 1];
			minX = Math.min(minX, px);
			minY = Math.min(minY, py);
			maxX = Math.max(maxX, px);
			maxY = Math.max(maxY, py);
		}
		return {
			xMin: minX,
			yMin: minY,
			xMax: maxX,
			yMax: maxY,
		};
	};

	/**
	*	
	* Triangulate a polygon (convex, concave, complex)
	*
	* @param {number[]} points - array of points [x1, y1, x2, y2, ...]
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
	Geometry.triPoly = function(points) {
		let n, tgs, avl, i, al, i0, i1, i2, ax, ay, bx, by, cx, cy, eF, vi;
		n = points.length >> 1;
		if (n < 3) {
			return [].concat(points);
		}
		tgs = [];
		avl = [];
		for (i = 0; i < n; i++) {
			avl.push(i);
		}

		i = 0;
		al = n;
		while (al > 3) {
			i0 = avl[(i + 0) % al];
			i1 = avl[(i + 1) % al];
			i2 = avl[(i + 2) % al];

			ax = points[2 * i0];
			ay = points[2 * i0 + 1];
			bx = points[2 * i1];
			by = points[2 * i1 + 1];
			cx = points[2 * i2];
			cy = points[2 * i2 + 1];

			eF = false;
			if (Geometry.sideLine(ax, ay, bx, by, cx, cy) >= 0) {
				eF = true;
				for (let j = 0; j < al; j++) {
					vi = avl[j];
					if (vi == i0 || vi == i1 || vi == i2) {
						continue;
					}
					if (Geometry.colliTriPnt(ax, ay, bx, by, cx, cy, points[2 * vi], points[2 * vi + 1])) {
						eF = false;
						break;
					}
				}
			}
			if (eF) {
				tgs.push(i0, i1, i2);
				avl.splice((i + 1) % al, 1);
				al--;
				i = 0;
			} else if (i++ > 3 * al) {
				break; // no convex angles :(
			}
		}
		tgs.push(avl[0], avl[1], avl[2]);
		return tgs;
	};

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
	Geometry.slicePoly = function(points, a_x, a_y, b_x, b_y, accuracy) {
		let a, b, isc, iscs, ps,i, fisc, lisc, i0, i1, ind0, ind1, solved, pgn, result, pg, npg, pgs, dir;
		accuracy = Utils.default(accuracy, 1e-10);
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
			isc = {
				x: 0,
				y: 0,
				flag: false
			};
			isc = Geometry.intrLine(a.x, a.y, b.x, b.y, ps[i].x, ps[i].y, ps[(i + 1) % ps.length].x, ps[(i + 1) % ps.length].y, isc.x, isc.y);
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
				pgn = _helper15(ps, ind0, ind1);
				pgs.push(pgn);
				ps = _helper15(ps, ind1, ind0);
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
	};

	/**
	*	
	* Calculate area of a polygon (convex, concave, complex)
	*
	* @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	* @return {number}
	*
	* @example
	* Geometry.areaPoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	*	//7500
	*
	* @function areaPoly
	* @memberof Geometry
	**/
	Geometry.areaPoly = function(points) {
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
	};

	/**
	*	
	* Find centroid of a polygon (convex, concave, complex)
	*
	* @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	* @return {{x: number, y: number}}
	*
	* @example
	* Geometry.centroidPoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	*	//{x: 38.888888888888886, y: 50}
	*
	* @function centroidPoly
	* @memberof Geometry
	**/
	Geometry.centroidPoly = function(points) {
		let cx = 0.0, cy = 0.0, x1, x2, y1, y2, f, area;
		for (let i = 0; i < points.length - 2; i += 2) {
			x1 = points[i];
			y1 = points[i + 1];
			x2 = points[i + 2];
			y2 = points[i + 3];

			f = x1 * y2 - x2 * y1;
			cx += (x1 + x2) * f;
			cy += (y1 + y2) * f;
		}
		x1 = points[points.length - 2];
		y1 = points[points.length - 1];
		x2 = points[0];
		y2 = points[1];
		f = x1 * y2 - x2 * y1;
		cx += (x1 + x2) * f;
		cy += (y1 + y2) * f;
		area = Geometry.areaPoly(points);
		cx /= 6.0 * area;
		cy /= 6.0 * area;
		return {
			x: cx,
			y: cy
		};
	};

	/**
	*	
	* Find convex hull of a set of points
	*
	* @param {number[]} points - array of points [[x1, y1], [x2, y2], ...]
	* @return {number[]}
	*
	* @example
	* Geometry.convexHullPoly([[0, 0], [50, 0], [100, 50], [50, 100], [0, 100]]);
	* //[[0, 0], [50, 0], [100, 50], [50, 100], [0, 100]]
	*
	* @function convexHullPoly
	* @memberof Geometry
	**/
	Geometry.convexHullPoly = function(points) {
		let lower = [], upper = [], i;

		points.sort(function(a, b) {
			return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0];
		});
		for (i = 0; i < points.length; i++) {
			while (lower.length >= 2 && Geometry.sideLine(lower[lower.length - 2][0], lower[lower.length - 2][1], lower[lower.length - 1][0], lower[lower.length - 1][1], points[i][0], points[i][1]) <= 0) {
				lower.pop();
			}
			lower.push(points[i]);
		}
		for (i = points.length - 1; i >= 0; i--) {
			while (upper.length >= 2 && Geometry.sideLine(upper[upper.length - 2][0], upper[upper.length - 2][1], upper[upper.length - 1][0], upper[upper.length - 1][1], points[i][0], points[i][1]) <= 0) {
				upper.pop();
			}
			upper.push(points[i]);
		}
		upper.pop();
		lower.pop();
		return lower.concat(upper);
	};

	/**
	*	
	* Finds the closest point of a polygon (convex, concave, ~~complex~~) that lay on ray
	*
	* @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	* @param {number} a_x - x position of vertex point of the ray
	* @param {number} a_y - y position of vertex point of the ray
	* @param {number} b_x - x position of direction point of the ray
	* @param {number} b_y - y position of direction point of the ray
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
	Geometry.distPolyRay = function(points, a_x, a_y, b_x, b_y) {
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

		let isc = {
			dist: Infinity,
			edge: 0,
			norm_x: 0,
			norm_y: 0,
			refl_x: 0,
			relf_y: 0
		};

		for (let i = 0; i < len; i += 2) {
			b1.x = points[i];
			b1.y = points[i + 1];
			b2.x = points[i + 2];
			b2.y = points[i + 3];
			nisc = _helper21(a1, a2, b1, b2, c);
			if (nisc) _helper17(b_x, b_y, a1, b1, b2, c, i / 2, isc);
		}
		b1.x = b2.x;
		b1.y = b2.y;
		b2.x = points[0];
		b2.y = points[1];
		nisc = _helper21(a1, a2, b1, b2, c);
		if (nisc) _helper17(b_x, b_y, a1, b1, b2, c, (points.length / 2) - 1, isc);

		return isc;
	};

	/**
	*	
	* Finds the point on polygon edges (convex, concave, complex), which is closest to the point
	*
	* @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	* @param {number} x - x position of the point
	* @param {number} y - y position of the point
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
	Geometry.intrPolyPnt = function(points, x, y) {
		let len = points.length - 2, idst, returnData = {
			dist: Infinity,
			edge: 0,
			point_x: 0,
			point_y: 0,
			norm_x: 0,
			norm_y: 0
		};
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
	};

	/**
	*	
	* Reverse point sequence of a polygon
	*
	* @param {number[]} points - array of points [x1, y1, x2, y2, ...]
	* @return {number[]}
	*
	* @example
	* Geometry.reversePoly([0, 0, 50, 0, 100, 50, 50, 100, 0, 100]);
	* //[0, 100, 50, 100, 100, 50, 50, 0, 0, 0]
	*
	* @function reversePoly
	* @memberof Geometry
	**/
	Geometry.reversePoly = function(points) {
		let np = [];
		for (let j = points.length - 2; j >= 0; j-=2) {
			np.push(points[j], points[j + 1]);
		}
		return np;
	};

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
	Geometry.timeAccel = function(u, v, a) {
		return (v - u) / a;
	};

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
	Geometry.accelAccel = function(u, v, t) {
		return (v - u) / t;
	};

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
	Geometry.distAccel = function(u, v, s) {
		return (v * v - u * u) / (2 * s);
	};

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
	Geometry.timeDistAccel = function(u, s, a) {
		let discr = u * u - 4 * a * -s * 0.5;
		if (discr < 0) {
			return -1;
		}
		let temp = Math.sqrt(discr);
		return Math.abs(Math.max((-u + temp) / a, (-u - temp) / a));
	};

	//Vector
	/**
	*	
	* Convert cartesian to polar coordinates
	*
	* @param {number} x - x position
	* @param {number} y - y position
	* @return {{angle: number, radial: number}}
	*
	* @example
	* Math.pol(1, 0);
	* //{angle: 0, radial: 1}
	*
	* @function pol
	* @memberof Vector
	**/
	Math.pol = function(x, y) {
		return {
			angle: Geometry.getAngle(0, 0, x, y),
			radial: Geometry.distPnt(0, 0, x, y, true),
		};
	};

	/**
	*	
	* Convert polar to cartesian coordinates
	*
	* @param {number} x - x position
	* @param {number} y - y position
	* @param {number} radial - r
	* @param {number} angle - angle
	* @return {{x: number, y: number}}
	*
	* @example
	* Math.rec(0, 0, 1, 0);
	* //{x: 1, y: 0}
	*
	* @function rec
	* @memberof Vector
	**/
	Math.rec = function(x, y, radial, angle) {
		return {
			x: Math.cos(angle) * radial + x,
			y: Math.sin(angle) * radial + y,
		};
	};

	/**
	*	
	* Normalize vector as scaling r to 1
	*
	* @param {number} x - x position
	* @param {number} y - y position
	* @return {{x: number, y: number}}
	*
	* @example
	* Math.normVec(2, 0);
	* //{x: 1, y: 0}
	*
	* @function normVec
	* @memberof Vector
	**/
	Math.normVec = function(x, y) {
		let length = Math.magVec(x, y, true);
		return {
			x: x / length,
			y: y / length,
		};
	};

	/**
	*	
	* Scale vector
	*
	* @param {number} x - x position
	* @param {number} y - y position
	* @param {number} scale - scale position
	* @return {{x: number, y: number}}
	*
	* @example
	* Math.scaleVec(2, 0, 2);
	* //{x: 4, y: 0}
	*
	* @function scaleVec
	* @memberof Vector
	**/
	Math.scaleVec = function(x, y, scale) {
		return {
			x: x * scale,
			y: y * scale,
		};
	};

	/**
	*	
	* Truncate vector to r = 1
	*
	* @param {number} x - x position
	* @param {number} y - y position
	* @param {number} num - truncate ratio
	* @return {{x: number, y: number}}
	*
	* @example
	* Math.truncVec(4, 0, 1);
	* //{x: 0.25, y: 0}
	*
	* @function truncVec
	* @memberof Vector
	**/
	Math.truncVec = function(x, y, num) {
		let scale = num / Math.magVec(x, y);
		scale = scale < 1.0 ? scale : 1.0;
		return Math.scaleVec(x, y, scale);
	};

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
	Math.magVec = function(x, y, square) {
		let tempUnSq = Math.dotVec(x, y, x, y);
		if (square) {
			return Math.sqrt(tempUnSq);
		} else {
			return tempUnSq;
		}
	};

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
	Math.dotVec = function(a_x, a_y, b_x, b_y) {
		//Heavily related to cosine
		return a_x * b_x + a_y * b_y;
	};

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
	Math.crossVec = function(a_x, a_y, b_x, b_y) {
		//Heavily related to sine
		//Also called wedge ?
		return a_x * b_y - a_y * b_x;
	};

	/**
	*	
	* Calculate projection vector from two vectors
	*
	* @param {number} a_x - x position of first vector
	* @param {number} a_y - y position of first vector
	* @param {number} b_x - x position of second vector
	* @param {number} b_y - y position of second vector
	* @return {{x: number, y: number}}
	*
	* @example
	* Math.projVec(5, 0, 5, 5);
	* //{x: 2.5, y: 2.5}
	*
	* @function projVec
	* @memberof Vector
	**/
	Math.projVec = function(a_x, a_y, b_x, b_y) {
		return Math.scaleVec(b_x, b_y, Math.dotVec(a_x, a_y, b_x, b_y) / Math.magVec(b_x, b_y, false));
	};

	/**
	*	
	* Calculate rejection vector from two vectors
	*
	* @param {number} a_x - x position of first vector
	* @param {number} a_y - y position of first vector
	* @param {number} b_x - x position of second vector
	* @param {number} b_y - y position of second vector
	* @return {{x: number, y: number}}
	*
	* @example
	* Math.rejVec(5, 0, 5, 5);
	* //{x: 2.5, y: -2.5}
	*
	* @function rejVec
	* @memberof Vector
	**/
	Math.rejVec = function(a_x, a_y, b_x, b_y) {
		let temp = Math.projVec(a_x, a_y, b_x, b_y);
		return {
			x: a_x - temp.x,
			y: a_y - temp.y,
		};
	};

	/**
	*	
	* Calculate per product from vector
	*
	* @param {number} x - x position
	* @param {number} y - y position
	* @return {{x1: number, y1: number, x2: number, y2: number}}
	*
	* @example
	* Math.perVec(5, 0);
	* //{x1: -0, y1: 5, x2: 0, y2: -5}
	*
	* @function perVec
	* @memberof Vector
	**/
	Math.perVec = function(x, y) {
		return {
			x1: -y,
			y1: x,
			x2: y,
			y2: -x,
		};
	};

	/**
	*	
	* Interpolates from two vectors
	*
	* @param {number} a_x - x position of first vector
	* @param {number} a_y - y position of first vector
	* @param {number} b_x - x position of second vector
	* @param {number} b_y - y position of second vector
	* @param {number} scale
	* @return {{x: number, y: number}}
	*
	* @example
	* Math.lerpVec(5, 0, 5, 5, 0.5);
	* //{x: 5, y: 2.5}
	*
	* @function lerpVec
	* @memberof Vector
	**/
	Math.lerpVec = function(a_x, a_y, b_x, b_y, scale) {
		return {
			x: (b_x - a_x) * scale + a_x,
			y: (b_y - a_y) * scale + a_y,
		};
	};

	/**
	*	
	* Calculate angle of vector
	*
	* @param {number} x - x position
	* @param {number} y - y position
	* @return {number}
	*
	*	Angle in radians
	*
	* @example
	* Math.headVec(5, 5);
	* //0.7853981633974483
	*
	* @function headVec
	* @memberof Vector
	**/
	Math.headVec = function(x, y) {
		return -Math.atan2(-y, x);
	};

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
	Math.revVec = function(x, y) {
		return {
			x: -x,
			y: -y,
		};
	};

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
	Math.clockWiseVec = function(a_x, a_y, b_x, b_y) {
		return -a_x * b_y + a_y * b_x > 0;
	};

	//Trigonometry
	/**
	*	
	* [Sinc function]{@link https://en.wikipedia.org/wiki/Sinc_function}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.sinc(Math.HALFPI);
	* //-0.19765087483668042
	*
	* @function sinc
	* @memberof Trigonometry
	**/
	Math.sinc = function(num) {
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
	};

	/**
	*	
	* [Chord function]{@link https://en.wikipedia.org/wiki/Chord_(geometry)#Chords_in_trigonometry}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.crd(Math.HALFPI);
	* //1.414213562373095
	*
	* @function crd
	* @memberof Trigonometry
	**/
	Math.crd = function(num) {
		return 2 * Math.sin(num / 2);
	};

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
	Math.exsec = function(num) {
		return Math.sec(num) - 1;
	};

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
	Math.excsc = function(num) {
		return Math.csc(num) - 1;
	};

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
	Math.aexsec = function(num) {
		return Math.asec(num + 1);
	};

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
	Math.aexcsc = function(num) {
		return Math.acsc(num + 1);
	};

	/**
	*	
	* [Versine function]{@link https://en.wikipedia.org/wiki/Versine}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.vsin(Math.HALFPI);
	* //0.9999999999999999
	*
	* @function vsin
	* @memberof Trigonometry
	**/
	Math.vsin = function(num) {
		return 1 - Math.cos(num);
	};

	/**
	*	
	* [Vercosine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.vcos(Math.HALFPI);
	* //1
	*
	* @function vcos
	* @memberof Trigonometry
	**/
	Math.vcos = function(num) {
		return 1 + Math.cos(num);
	};

	/**
	*	
	* [Coversine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.cvsin(Math.HALFPI);
	* //0
	*
	* @function cvsin
	* @memberof Trigonometry
	**/
	Math.cvsin = function(num) {
		return 1 - Math.sin(num);
	};

	/**
	*	
	* [Covercosine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.cvcos(Math.HALFPI);
	* //2
	*
	* @function cvcos
	* @memberof Trigonometry
	**/
	Math.cvcos = function(num) {
		return 1 + Math.sin(num);
	};

	/**
	*	
	* [Haversine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.hvsin(Math.HALFPI);
	* //0.49999999999999994
	*
	* @function hvsin
	* @memberof Trigonometry
	**/
	Math.hvsin = function(num) {
		return Math.vsin(num) / 2;
	};

	/**
	*	
	* [Havercosine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.hvcos(Math.HALFPI);
	* //0.5
	*
	* @function hvcos
	* @memberof Trigonometry
	**/
	Math.hvcos = function(num) {
		return Math.vcos(num) / 2;
	};

	/**
	*	
	* [Hacoversine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.hcvsin(Math.HALFPI);
	* //0
	*
	* @function hcvsin
	* @memberof Trigonometry
	**/
	Math.hcvsin = function(num) {
		return Math.cvsin(num) / 2;
	};

	/**
	*	
	* [Hacovercosine function]{@link https://en.wikipedia.org/wiki/Versine#Mathematical_identities}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.hcvcos(Math.HALFPI);
	* //1
	*
	* @function hcvcos
	* @memberof Trigonometry
	**/
	Math.hcvcos = function(num) {
		return Math.cvcos(num) / 2;
	};

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
	Math.avsin = function(num) {
		return Math.acos(1 - num);
	};

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
	Math.avcos = function(num) {
		return Math.acos(1 + num);
	};

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
	Math.acvsin = function(num) {
		return Math.asin(1 - num);
	};

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
	Math.acvcos = function(num) {
		return Math.asin(1 + num);
	};

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
	Math.ahvsin = function(num) {
		return 2 * Math.asin(Math.sqrt(num));
	};

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
	Math.ahvcos = function(num) {
		return 2 * Math.acos(Math.sqrt(num));
	};

	/**
	*	
	* [Cosecant function]{@link https://en.wikipedia.org/wiki/Trigonometric_functions#Cosecant.2C_secant.2C_and_cotangent}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.csc(Math.HALFPI);
	* //1
	*
	* @function csc
	* @memberof Trigonometry
	**/
	Math.csc = function(num) {
		return 1 / Math.sin(num);
	};

	/**
	*	
	* [Hyperbolic cosecant function]{@link https://en.wikipedia.org/wiki/Hyperbolic_function#Definitions}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.csch(Math.HALFPI);
	* //0.4345372080946958
	*
	* @function csch
	* @memberof Trigonometry
	**/
	Math.csch = function(num) {
		return 1 / Math.sinh(num);
	};

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
	Math.sec = function(num) {
		return 1 / Math.cos(num);
	};

	/**
	*	
	* [Hyperbolic secant function]{@link https://en.wikipedia.org/wiki/Hyperbolic_function#Definitions}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.sech(Math.HALFPI);
	* //0.3985368153383867
	*
	* @function sech
	* @memberof Trigonometry
	**/
	Math.sech = function(num) {
		return 1 / Math.cosh(num);
	};

	/**
	*	
	* [Cotangent function]{@link https://en.wikipedia.org/wiki/Trigonometric_functions#Cosecant.2C_secant.2C_and_cotangent}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.cot(Math.HALFPI);
	* //6.123233995736766e-17
	*
	* @function cot
	* @memberof Trigonometry
	**/
	Math.cot = function(num) {
		return 1 / Math.tan(num);
	};

	/**
	*	
	* [Hyperbolic cotangent function]{@link https://en.wikipedia.org/wiki/Hyperbolic_function#Definitions}
	*
	* @param {number} num
	* @return {number}
	*
	* @example
	* Math.coth(Math.HALFPI);
	* //1.0903314107273683
	*
	* @function coth
	* @memberof Trigonometry
	**/
	Math.coth = function(num) {
		return 1 / Math.tanh(num);
	};

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
	Math.acsc = function(num) {
		return 1 / Math.asin(num);
	};

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
	Math.acsch = function(num) {
		return 1 / Math.asinh(num);
	};

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
	Math.asec = function(num) {
		return 1 / Math.acos(num);
	};

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
	Math.asech = function(num) {
		return 1 / Math.acosh(num);
	};

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
	Math.acot = function(num) {
		return 1 / Math.atan(num);
	};

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
	Math.acoth = function(num) {
		return 1 / Math.atanh(num);
	};

	/**
	*	
	* Calculate sine and cosine at a same time
	*
	* @param {number} num
	* @return {number[]}
	* 
	* Cosine on the left, sine on the right
	*
	* @example
	* Math.sincos(Math.HALFPI);
	* //[0, 1]
	*
	* @function sincos
	* @memberof Trigonometry
	**/
	Math.sincos = function(num) {
		let temp = Math.sin(num);
		return [Math.sqrt(1 - temp * temp), temp];
	};

	//Number
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
	Number.isPrime = function(num) {
		if (Number.isNaN(num) || !Number.isFinite(num) || num < 2) return false;
		if (num == _helper8(num)) return true;
		return false;
	};

	//Number
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
	Number.isMinusZero = function(num) {
		return 1 / num === -Infinity;
	};

	//Number
	/**
	*	
	* Check if `num2 ** n === num1`
	*
	* @param {number} num1
	* @param {number} num2
	* @return {boolean}
	*
	* @example
	* Number.isPower(32, 2);
	* //true
	*
	* @function isPower
	* @memberof Number
	**/
	Number.isPower = function(num1, num2, epsilon) {
		epsilon = Utils.default(epsilon, Math.precision(num2));
		let d = Math.ln(Math.abs(num1)) / Math.ln(Math.abs(num2));
		if ((num1 < 0 && num2 < 0) || (num1 > 0 && num2 > 0)) {
			return Math.trunc(d, epsilon) === d;
		} else if (num1 > 0 && num2 < 0) {
			return Math.trunc(d, epsilon) % 2 === 0;
		}
		return false;
	};

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
	Number.isEven = function(num) {
		return Number.isInteger(num) && (num & 1) === 0;//!(num % 2);
	};

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
	Number.isNumeric = function(num) {
		return !(Object.prototype.toString.call(num) === "[object Array]") && (num - parseFloat(num) + 1) >= 0;
	};

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
	Number.epsilon = function() {
		if (Number.EPSILON) {
			return Number.EPSILON;
		}
		return Math.abs(1 - _epsilon_1_ * 3);
	};

	//Tween
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
	Tween.inQuad = function(time) {
		return time * time;
	};

	//Tween
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
	Tween.outQuad = function(time) {
		return time * (2 - time);
	};

	//Tween
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
	Tween.inOutQuad = function(time) {
		return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time;
	};

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
	Tween.inCubic = function(time) {
		return Math.pow(time, 3);
	};

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
	Tween.outCubic = function(time) {
		return (time -= 1) * time * time + 1;
	};

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
	Tween.inOutCubic = function(time) {
		return time < 0.5 ? 4 * Math.pow(time, 3) : (time - 1) * Math.pow(2 * time - 2, 2) + 1;
	};

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
	Tween.inQuart = function(time) {
		return Math.pow(time, 4);
	};

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
	Tween.outQuart = function(time) {
		return 1 - (time -= 1) * Math.pow(time, 3);
	};

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
	Tween.inOutQuart = function(time) {
		return time < 0.5 ? 8 * Math.pow(time, 4) : 1 - 8 * (time -= 1) * Math.pow(time, 3);
	};

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
	Tween.inQuint = function(time) {
		return Math.pow(time, 5);
	};

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
	Tween.outQuint = function(time) {
		return 1 + (time -= 1) * Math.pow(time, 4);
	};

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
	Tween.inOutQuint = function(time) {
		return time < 0.5 ? 16 * Math.pow(time, 5) : 1 + 16 * (time -= 1) * Math.pow(time, 4);
	};

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
	Tween.inPow = function(time, pow) {
		return Math.pow(time, pow);
	};

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
	Tween.outPow = function(time, pow) {
		let check = Number.isEven(pow - 1) ? 1 : -1;
		return 1 + (time -= 1) * Math.pow(time, pow - 1) * check;
	};

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
	Tween.inOutPow = function(time, pow) {
		let temp = Math.pow(2, pow - 1),
			check = Number.isEven(pow - 1) ? 1 : -1;
		return time < 0.5 ? temp * Math.pow(time, pow) : 1 + temp * (time -= 1) * Math.pow(time, pow - 1) * check;
	};

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
	Tween.inSine = function(time, pow) {
		return -Math.pow(Math.cos(time * Math.HALFPI), pow) + 1;
	};

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
	Tween.outSine = function(time, pow) {
		return Math.pow(Math.sin(time * Math.HALFPI), pow);
	};

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
	Tween.inOutSine = function(time, pow) {
		if ((time *= 2) < 1) {
			return -0.5 * Math.pow(Math.cos(Math.PI * time), pow) + 0.5;
		}
		return 0.5 * Math.pow(Math.cos(Math.PI * (time - 1)), pow) + 0.5;
	};

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
	Tween.inExpo = function(time) {
		return (time === 0) ? 0 : Math.pow(2, 10 * (time - 1));
	};

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
	Tween.outExpo = function(time) {
		return (time === 1) ? 1 : (-Math.pow(2, -10 * time) + 1);
	};

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
	Tween.inOutExpo = function(time) {
		if (time === 0) {
			return 0;
		}
		if (time === 1) {
			return 1;
		}
		if ((time *= 2) < 1) {
			return 0.5 * Math.pow(2, 10 * (time - 1));
		}
		return 0.5 * (-Math.pow(2, -10 * (time -= 1)) + 2);
	};

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
	Tween.inCirc = function(time) {
		return -(Math.sqrt(1 - time * time) - 1);
	};

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
	Tween.outCirc = function(time) {
		return Math.sqrt(1 - (time -= 1) * time);
	};

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
	Tween.inOutCirc = function(time) {
		if ((time *= 2) < 1) {
			return -0.5 * (Math.sqrt(1 - time * time) - 1);
		}
		return 0.5 * (Math.sqrt(1 - (time -= 2) * time) + 1);
	};

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
	Tween.inElastic = function(time, amplitude, period) {
		let s;
		amplitude = Utils.default(amplitude, 0.1);
		period = Utils.default(period, 0.1);
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
			s = period * Math.asin(1 / amplitude) / Math.TAU;
		}
		return -(amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time - s) * Math.TAU / period));
	};

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
	Tween.outElastic = function(time, amplitude, period) {
		let s;
		amplitude = Utils.default(amplitude, 0.1);
		period = Utils.default(period, 0.1);
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
			s = period * Math.asin(1 / amplitude) / Math.TAU;
		}
		return (amplitude * Math.pow(2, -10 * time) * Math.sin((time - s) * Math.TAU / period) + 1);
	};

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
	Tween.inOutElastic = function(time, amplitude, period) {
		let s;
		amplitude = Utils.default(amplitude, 0.1);
		period = Utils.default(period, 0.1);
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
			s = period * Math.asin(1 / amplitude) / Math.TAU;
		}
		if ((time *= 2) < 1) {
			return -0.5 * (amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time - s) * Math.TAU / period));
		}
		return amplitude * Math.pow(2, -10 * (time -= 1)) * Math.sin((time - s) * Math.TAU / period) * 0.5 + 1;
	};

	/**
	*	
	* In Back
	*
	* @param {number} time
	* @param {number} overShoot
	* @return {number}
	*
	* @example
	* Tween.inBack(0.25, 2);
	* //0.7024967320129584
	*
	* @function inBack
	* @memberof Tween
	**/
	Tween.inBack = function(time, overShoot) {
		if (overShoot == undefined) {
			overShoot = 1.70158;
		} else {
			overShoot = _helper9(overShoot);
		}
		return 1 * time * time * ((overShoot + 1) * time - overShoot);
	};

	/**
	*	
	* Out Back
	*
	* @param {number} time
	* @param {number} overShoot
	* @return {number}
	*
	* @example
	* Tween.outBack(0.25, 2);
	* //2.732490196038875
	*
	* @function outBack
	* @memberof Tween
	**/
	Tween.outBack = function(time, overShoot) {
		if (overShoot == undefined) {
			overShoot = 1.70158;
		} else {
			overShoot = _helper9(overShoot);
		}
		return 1 * ((time -= 1) * time * ((overShoot + 1) * time + overShoot) + 1);
	};

	/**
	*	
	* In Out Back
	*
	* @param {number} time
	* @param {number} overShoot
	* @return {number}
	*
	* @example
	* Tween.inOutBack(0.25, 2);
	* //1.3976808550930153
	*
	* @function inOutBack
	* @memberof Tween
	**/
	Tween.inOutBack = function(time, overShoot) {
		if (overShoot == undefined) {
			overShoot = 1.70158;
		} else {
			overShoot = _helper9(overShoot);
		}
		if ((time *= 2) < 1) {
			return 0.5 * (time * time * (((overShoot *= (1.525)) + 1) * time - overShoot));
		}
		return 0.5 * ((time -= 2) * time * (((overShoot *= (1.525)) + 1) * time + overShoot) + 2);
	};

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
	Tween.inBounce = function(time) {
		return 1 - this.outBounce(1 - time);
	};

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
	Tween.outBounce = function(time) {
		if (time < _outBounce_1_[0]) {
			return (7.5625 * time * time);
		} else if (time < _outBounce_1_[1]) {
			return (7.5625 * (time -= _outBounce_1_[2]) * time + 0.75);
		} else if (time < _outBounce_1_[3]) {
			return (7.5625 * (time -= _outBounce_1_[4]) * time + 0.9375);
		} else {
			return (7.5625 * (time -= _outBounce_1_[5]) * time + 0.984375);
		}
	};

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
	Tween.inOutBounce = function(time) {
		if (time < 0.5) {
			return this.inBounce(time * 2) * 0.5;
		}
		return this.outBounce(time * 2 - 1) * 0.5 + 0.5;
	};

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
	Tween.smoothStep = function(time, order) {
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
						result += (Math.nCr(-order - 1, n) * Math.nCr(2 * order + 1, order - n) * Math.pow(time, order + n + 1));
					}
					return result;
				}
		}
	};

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
	Tween.overShoot = function(time, mag) {
		time = Tween.outQuad(time);
		return time * (1 + Math.sin(time * Math.PI) * mag); //180 in sin?
	};

	/**
	*	
	* Customizable tween
	*
	* @param {number} time
	* @param {number[]} points - control points [x1, y1, x2, y2, ...]
	* @return {number}
	*
	* @example
	* Tween.curve(0.25, [0.25, 0.5]);
	* //0.5
	*
	* @function curve
	* @memberof Tween
	**/
	Tween.curve = function(time, points) {
		let temp1 = 0, temp2;
		for (let i = 0; i < points.length; i += 2) {
			temp2 = 1;
			for (let j = 0; j < points.length; j += 2) {
				if (j === i) {
					continue;
				}
				temp2 *= (time - points[j]) / (points[i] - points[j]);
			}
			temp1 += points[i + 1] * temp2;
		}
		return temp1;
	};

	/**
	*	
	* [Bezier]{@link https://en.wikipedia.org/wiki/B%C3%A9zier_curve} tween
	*
	* @param {number} time
	* @param {number[]} points - control points [x1, y1, x2, y2, ...]
	* @return {number}
	*
	* @example
	* Tween.bezier(0.25, [0.25, 0.5]);
	* //0.1875
	*
	* @function bezier
	* @memberof Tween
	**/
	Tween.bezier = function(time, points) {
		let temp = 0, temp2 = 0, temp3 = 0, tempL = points.length;
		for (let i = 0; i < tempL; i += 2) {
			temp3 = _helper11(time, i / 2 + 1, tempL) * points[i + 1];
			temp += temp3;
			temp2 += temp3 * points[i];
		}
		return temp;
	};

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
	Tween.spline = function(continuty, bias, tension, density, points, loop) {
		let tangent = [], tempA, tempB, tempC, tempD, tempX, tempY, tempX2, tempY2, count, iteration, lines;
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
		lines = [];
		while (count < points.length - 4) {
			lines.push(points[count], points[count + 1]);
			iteration = density;
			while (iteration < 1.0) {
				tempA = (2 * Math.pow(iteration, 3)) - (3 * Math.pow(iteration, 2)) + 1;
				tempB = (1 * Math.pow(iteration, 3)) - (2 * Math.pow(iteration, 2)) + iteration;
				tempC = (-2 * Math.pow(iteration, 3)) + (3 * Math.pow(iteration, 2));
				tempD = (1 * Math.pow(iteration, 3)) - (1 * Math.pow(iteration, 2));
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
	};

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
	Tween.count = (function() {
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
				data.next = Utils.default(data.next, data.max);
			} else if (data.change > 0) {
				data.next = Utils.default(data.next, data.min);
			}

			/**
			*	
			* Configurable counting number function, see `Tween.count` for the function that returned this function
			*
			* @param {boolean} _check - `true` if you want the function to return internal object, else just number
			* @param {number} _min
			* @param {number} _max
			* @param {number} _change
			* @param {number} _current - current start number (not minimum)
			* @param {number} _mode - there are different modes from 0 to 5, you can test it yourself (recommended to use 1 and 3)
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

	//Boolean
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
	Boolean.andNot = function(a, b) {
		return !a && b;
	};

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
	Boolean.notAnd = function(a, b) {
		return a && !b;
	};

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
	Boolean.nand = function(a, b) {
		return !(a && b);
	};

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
	Boolean.orNot = function(a, b) {
		return a || !b;
	};

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
	Boolean.notOr = function(a, b) {
		return !a || b;
	};

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
	Boolean.nor = function(a, b) {
		return !(a || b);
	};

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
	Boolean.xor = function(a, b) {
		return a ? !b : b;
	};

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
	Boolean.xnor = function(a, b) {
		return !Boolean.xor(a, b);
	};

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
	Boolean.all = function(x) {
		for (let loopCount = 0; loopCount < x.length; loopCount++) {
			if (x[loopCount] != true) {
				return false;
			} else if (loopCount >= x.length - 1) {
				return true;
			}
		}
	};

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
	Boolean.nall = function(x) {
		for (let loopCount = 0; loopCount < x.length; loopCount++) {
			if (x[loopCount] == true) {
				return true;
			}
		}
		return false;
	};

})(
	('undefined' !== typeof window) ? window : {}
);
