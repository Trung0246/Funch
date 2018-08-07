(function(root, global) {
	root = root.bind(this, global);
	if (typeof define === "function" && define.amd) {
		define(["funch"], function(Funch) {
			Funch._PLUGINS_(root);
		});
	} else if (typeof module === "object" && module.exports) {
		module.exports = root;
	} else {
		global._FUNCH_PLUGINS_(root);
	}
})(function (global, local, main) {
	/*
	Funch-extend.js, v0.2a
	Require funch.js v0.28a

	MIT License

	Copyright (c) 2017-2018 Trung Tran

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

	Some portion of this code is under MIT, BSD-3, Apache-2.0, and some were modified to suit this library:
	<https://opensource.org/licenses/MIT>
	<https://opensource.org/licenses/BSD-3-Clause>
	<https://opensource.org/licenses/Apache-2.0>
	
	For a copy, see:
	- StackOverflow (many authors)                   <stackoverflow.com>
	*/

	//Namespace
	let Geometry = main.Geometry, Tween = main.Tween, Bit = main.Bit,
		Math = _helper9(global.Math, main.Math),
		Number = _helper9(global.Number, main.Number),
		Boolean = _helper9(global.Boolean, main.Boolean),

	_rec3D2_1_ = 2 / Math.PI;

	function _helper9(obj2, obj3) {
		let obj1 = {},
			tempKey = Object.getOwnPropertyNames(obj2);
		for (let i = 0; i < tempKey.length; i ++) {
			obj1[tempKey[i]] = obj2[tempKey[i]];
		}
		Object.assign(obj1, obj3);
		return obj1;
	}

	function _helper10(x, y, z, c_x, c_y, c_z, max, returnData) {
		returnData = local.helper1(returnData, true);

		let dist = x * x + y * y + z * z;

		if (dist > max * max) {
			dist = Math.sqrt(dist);
			if (dist < 1) {
				dist = 1;
			}
			x /= dist;
			y /= dist;
			z /= dist;
			x *= max;
			y *= max;
			z *= max;
		}

		returnData.x = x - c_x;
		returnData.y = y - c_y;
		returnData.z = z - c_z;

		return returnData;
	}

	function _helper11(a_x, a_y, a_z, b_x, b_y, b_z, d_x, d_y, d_z, max, returnData) {
		let offsetX = b_x - a_x,
			offsetY = b_y - a_y,
			offsetZ = b_z - a_z;

		let dist = Math.sqrt(offsetX * offsetX + offsetY * offsetY + offsetZ * offsetZ) / max;
		if (dist < 1) {
			dist = 1;
		}

		returnData.x = b_x + d_x * dist,
		returnData.y = b_y + d_y * dist,
		returnData.z = b_z + d_z * dist;

		return returnData;
	}

	function _helper12(x, y, z, c_x, c_y, c_z, radius, min, max, flag, returnData) {
		returnData = local.helper1(returnData, true);
		let dist = Math.sqrt(x * x + y * y + z * z);
		if (dist <= 0) {
			dist = 0;
			x = 0;
			y = 0;
			z = 0;
		} else {
			x /= dist;
			y /= dist;
			z /= dist;
		}

		if (dist < radius) {
			if (flag) {
				min = (radius - dist) / radius * (max - min) + min;
			} else {
				min = dist / radius * max;
			}
		} else if (!flag) {
			min = max;
		}
		x *= min;
		y *= min;
		z *= min;

		returnData.x = x - c_x;
		returnData.y = y - c_y;
		returnData.z = z - c_z;

		return returnData;
	}

	function _helper13(x, y, z, num, returnData) {
		let scale = num / Math.sqrt(x * x + y * y + z * z);
		scale = (scale < 1.0 ? scale : 1.0);
		returnData.x = x * scale;
		returnData.y = y * scale;
		returnData.z = z * scale;
		return returnData;
	}

	/**
	 * @constant {number} QTR_PI
	 * 
	 * Equal to half of `Math.HALF_PI`, specific value is `0.7853981633974483`
	 * 
	 * @memberof Math
	 */
	let Math_QTR_PI = Math.HALF_PI / 2;

	/**
	 * @constant {number} GRAVITY
	 * 
	 * Earth's average gravity constant, specific value is `9.80665`
	 * 
	 * @memberof Math
	 */
	let Math_GRAVITY = 9.80665223;

	/**
	 *
	 * Rotate a point around (0, 0, 0) (3D) 
	 *
	 * @param {number} x - x position of current point
	 * @param {number} y - y position of current point
	 * @param {number} z - z position of current point
	 * @param {number} x_x - x angle in radians to rotate
	 * @param {number} x_y - y angle in radians to rotate
	 * @param {number} x_z - z angle in radians to rotate
	 * @param {number=} [x_y=x_x] - y angle in radians to rotate
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, z: number}}
	 *
	 * @example
	 * Geometry.rotPnt3D(0, 1, 0, Math.QTR_PI, 0, 0);
	 * //{x: 0, y: 0.7071067811865476, z: -0.5}
	 *
	 * @function rotPnt3D
	 * @memberof Geometry
	 **/
	function Geometry_rotPnt3D(x, y, z, x_x, x_y, x_z, correct, returnData) {
		let tempsr, tempcr, tempt, temp1, temp2;
		returnData = local.helper1(returnData, true);
		//X
		if (x_x !== undefined) {
			tempsr = Math.sin(x_x);
			tempcr = Math.cos(x_x);
			if (correct) {
				y = y * tempcr + z * tempsr;
				z = y * tempsr - z * tempcr;
			} else {
				temp1 = y * tempcr - z * tempsr;
				temp2 = y * tempsr + z * tempcr;
				y = temp1;
				z = temp2;
			}
		}
		//Y
		if (x_y !== undefined) {
			tempt = x;
			tempsr = Math.sin(x_y);
			tempcr = Math.cos(x_y);
			if (correct) {
				x = x * tempcr + z * tempsr;
				z = tempt * tempsr - z * tempcr;
			} else {
				temp1 = z * tempsr + x * tempcr;
				temp2 = z * tempcr - x * tempsr;
				x = temp1;
				z = temp2;
			}
		}
		//Z
		if (x_z !== undefined) {
			tempt = x;
			tempsr = Math.sin(x_z);
			tempcr = Math.cos(x_z);
			if (correct) {
				x = x * tempcr - y * tempsr;
				y = tempt * tempsr + y * tempcr;
			} else {
				temp1 = x * tempcr - y * tempsr;
				temp2 = x * tempsr + y * tempcr;
				x = temp1;
				y = temp2;
			}
		}
		returnData.x = x;
		returnData.y = y;
		returnData.z = z;
		return returnData;
	}

	/**
	 *
	 * Normal gravity formula
	 *
	 * @param {number} num - latitude in radians
	 * @return {number}
	 *
	 * @example
	 * Geometry.gravity(Math.QTR_PI);
	 * //9.806199202469186
	 *
	 * @function gravity
	 * @memberof Geometry
	 **/
	function Geometry_gravity(num) {
		num = Math.sin(num);
		num *= num;
		return 9.7803267714 * ((1 + 0.00193185138639 * num) /  Math.sqrt(1 - 0.00669437999013 * num));
	}

	/**
	 *
	 * Convert cartesian to spherical coordinates
	 *
	 * @param {number} x - x position
	 * @param {number} y - y position
	 * @param {number} z - z position
	 * @param {object=} returnData - Object to put data
	 * @return {{angle: number, radial: number}}
	 *
	 * @example
	 * Math.pol3D(1, 0, 0);
	 * //{radial: 1, angle1: 1.5707963267948966, angle2: 0}
	 *
	 * @function pol3D
	 * @memberof Vector
	 **/
	function Math_pol3D(x, y, z, returnData) {
		returnData = local.helper1(returnData, true);
		returnData.radial = Math.sqrt(x * x + y * y + z * z);
		returnData.angle1 = Math.atan2(Math.sqrt(x * x + y * y), z);
		returnData.angle2 = Math.atan2(y, x);
		return returnData;
	}

	/**
	 *
	 * Convert spherical to cartesian coordinates
	 *
	 * @param {number} radial - r
	 * @param {number} angle1 - angle in radians
	 * @param {number} angle2 - angle in radians
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, z: number}}
	 *
	 * @example
	 * Math.rec3D(1, 0, 0);
	 * //{x: 0, y: 0, z: 1}
	 *
	 * @function rec3D
	 * @memberof Vector
	 **/
	function Math_rec3D(radial, angle1, angle2, returnData) {
		let temp = Math.sin(angle1) * radial;
		returnData = local.helper1(returnData, true);
		returnData.x = temp * Math.cos(angle2);
		returnData.y = temp * Math.sin(angle2);
		returnData.z = radial * Math.cos(angle1);
		return returnData;
	}

	/**
	 *
	 * Convert plane to sphere coordinates
	 *
	 * @param {number} x - x position (between -1 and 1)
	 * @param {number} y - y position	(between -1 and 1)
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Math.pol3D2(0.5, 0.5);
	 * //{x: 0.7071067811865476, y: -0.7071067811865475}
	 *
	 * @function pol3D2
	 * @memberof Vector
	 **/
	function Math_pol3D2(x, y, returnData) {
		returnData = local.helper1(returnData, true);
		returnData.x = Math.sin(x * Math.PI) * Math.cos(y * Math.HALF_PI);
		returnData.y = Math.sin(-y * Math.HALF_PI);
		return returnData;
	}

	/**
	 *
	 * Convert sphere to plane coordinates
	 *
	 * @param {number} x - x position (between -1 and 1)
	 * @param {number} y - y position	(between -1 and 1)
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number}}
	 *
	 * @example
	 * Math.rec3D2(0.7071067811865476, -0.7071067811865475);
	 * //{y: 0.49999999999999994, x: 0.4999999917845593}
	 *
	 * @function rec3D2
	 * @memberof Vector
	 **/
	function Math_rec3D2(x, y, returnData) {
		returnData = local.helper1(returnData, true);
		returnData.y = -_rec3D2_1_ * Math.asin(y);
		returnData.x = Math.asin(x * Math.sec(returnData.y * Math.HALF_PI)) / Math.PI;
		return returnData;
	}

	/**
	 *
	 * Verlet integration between 2 points
	 *
	 * @param {number} x - x position of first point
	 * @param {number} y - y position of first point
	 * @param {number} z - z position of first point
	 * @param {number} x - x position of second point
	 * @param {number} y - y position of second point
	 * @param {number} z - z position of second point
	 * @param {number} length - length of the line
	 * @param {number=} [power=2] - power of the line
	 * @param {number=} [strength=1] - strength of the line
	 * @param {object=} returnData - Object to put data
	 * @return {{x1: number, y1: number, z1: number, x2: number, y2: number, z2: number}}
	 *
	 * @example
	 * Math.vrltVec(123.234, 234.345, 0, 345.456 - 78.89, 456.567 - 67.78, 0, Geometry.distPnt(123.234, 234.345, 345.456, 456.567, true));
	 * //{x1: 88.00894376367708, y1: 196.38956691283047, z1: 0, x2: 301.79105623632296, y2: 426.74243308716956, z2: 0}
	 *
	 * @function vrltVec
	 * @memberof Vector
	 **/
	function Math_vrltVec(a_x, a_y, a_z, b_x, b_y, b_z, length, power, strength, returnData) {
		power = local.helper0(power, 2);
		power2 = local.helper0(power2, 1);
		returnData = local.helper1(returnData, true);
		let tempX = a_x - b_x, tempY = a_y - b_y, tempZ = a_z - b_z,
			dist = Math.sqrt(tempX * tempX + tempY * tempY + tempZ * tempZ),
			temp = (length - dist) / (dist * power) * power2,
			offset_x = tempX * temp,
			offset_y = tempY * temp,
			offset_z = tempZ * temp;
		returnData.x1 = a_x + offset_x;
		returnData.y1 = a_y + offset_y;
		returnData.z1 = a_z + offset_z;
		returnData.x2 = b_x - offset_x;
		returnData.y2 = b_y - offset_y;
		returnData.z2 = b_z - offset_z;
		return returnData;
	}

	/**
	 *
	 * Update for behaviours, use with Steer functions
	 *
	 * @param {number} a_x - x steer velocity
	 * @param {number} a_y - y steer velocity
	 * @param {number} a_z - z steer velocity
	 * @param {number} b_x - x current velocity
	 * @param {number} b_y - y current velocity
	 * @param {number} b_z - z current velocity
	 * @param {number} force - max force
	 * @param {number} mass - mass
	 * @param {number} speed - max speed
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, z: number}}
	 *
	 * @example
	 * let temp = Math.seekSteer(10, 10, 0, 20, 20, 0, 0, 0, 0, 2);
	 * Math.updateSteer(temp.x, temp.y, 0, 0, 0, 0, 1, 1, 1, temp);
	 * //{x: 0.7071067811865476, y: 0.7071067811865476, z: 0}
	 *
	 * @function updateSteer
	 * @memberof Vector
	 **/
	function Math_updateSteer(a_x, a_y, a_z, b_x, b_y, b_z, force, mass, speed, returnData) {
		returnData = local.helper1(returnData, true);

		_helper13(a_x, a_y, a_z, force, returnData);
		returnData.x /= mass;
		returnData.y /= mass;
		returnData.z /= mass;
		returnData.x += b_x;
		returnData.y += b_y;
		returnData.z += b_z;
		return _helper13(returnData.x, returnData.y, returnData.z, speed, returnData);
	}

	/**
	 *
	 * Seek behavior
	 *
	 * @param {number} a_x - x current position
	 * @param {number} a_y - y current position
	 * @param {number} a_z - z current position
	 * @param {number} b_x - x target position
	 * @param {number} b_y - y target position
	 * @param {number} b_z - z target position
	 * @param {number} c_x - x velocity
	 * @param {number} c_y - y velocity
	 * @param {number} c_z - z velocity
	 * @param {number} max - max force
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, z: number}}
	 *
	 * @example
	 * Math.seekSteer(10, 10, 0, 20, 20, 0, 0, 0, 0, 2);
	 * //{x: 1.414213562373095, y: 1.414213562373095, z: 0}
	 *
	 * @function seekSteer
	 * @memberof Vector
	 **/
	function Math_seekSteer(a_x, a_y, a_z, b_x, b_y, b_z, c_x, c_y, c_z, max, returnData) {
		return _helper10(b_x - a_x, b_y - a_y, b_z - a_z, c_x, c_y, c_z, max, returnData);
	}

	/**
	 *
	 * Flee behavior
	 *
	 * @param {number} a_x - x current position
	 * @param {number} a_y - y current position
	 * @param {number} a_z - z current position
	 * @param {number} b_x - x target position
	 * @param {number} b_y - y target position
	 * @param {number} b_z - z target position
	 * @param {number} c_x - x velocity
	 * @param {number} c_y - y velocity
	 * @param {number} c_z - z velocity
	 * @param {number} max - max force
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, z: number}}
	 *
	 * @example
	 * Math.fleeSteer(10, 10, 0, 20, 20, 0, 0, 0, 0, 2);
	 * //{x: -1.414213562373095, y: -1.414213562373095, z: 0}
	 *
	 * @function fleeSteer
	 * @memberof Vector
	 **/
	function Math_fleeSteer(a_x, a_y, a_z, b_x, b_y, b_z, c_x, c_y, c_z, max, returnData) {
		return _helper10(a_x - b_x, a_y - b_y, a_z - b_z, c_x, c_y, c_z, max, returnData);
	}

	/**
	 *
	 * Pursuit behavior
	 *
	 * @param {number} a_x - x current position
	 * @param {number} a_y - y current position
	 * @param {number} a_z - z current position
	 * @param {number} b_x - x target position
	 * @param {number} b_y - y target position
	 * @param {number} b_z - z target position
	 * @param {number} c_x - x current velocity
	 * @param {number} c_y - y current velocity
	 * @param {number} c_z - z current velocity
	 * @param {number} d_x - x target velocity
	 * @param {number} d_y - y target velocity
	 * @param {number} d_z - z target velocity
	 * @param {number} max - max force
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, z: number}}
	 *
	 * @example
	 * Math.pursuitSteer(10, 10, 0, 20, 20, 0, 1, 1, 0, 1, 1, 0, 2);
	 * //{x: 0.41421356237309515, y: 0.41421356237309515, z: 0}
	 *
	 * @function pursuitSteer
	 * @memberof Vector
	 **/
	function Math_pursuitSteer(a_x, a_y, a_z, b_x, b_y, b_z, c_x, c_y, c_z, d_x, d_y, d_z, max, returnData) {
		returnData = local.helper1(returnData, true);
		_helper11(a_x, a_y, a_z, b_x, b_y, b_z, d_x, d_y, d_z, max, returnData);
		Math_seekSteer(a_x, a_y, a_z, returnData.x, returnData.y, returnData.z, c_x, c_y, c_z, max, returnData);
		return returnData;
	}

	/**
	 *
	 * Evade behavior
	 *
	 * @param {number} a_x - x current position
	 * @param {number} a_y - y current position
	 * @param {number} a_z - z current position
	 * @param {number} b_x - x target position
	 * @param {number} b_y - y target position
	 * @param {number} b_z - z target position
	 * @param {number} c_x - x current velocity
	 * @param {number} c_y - y current velocity
	 * @param {number} c_z - z current velocity
	 * @param {number} d_x - x target velocity
	 * @param {number} d_y - y target velocity
	 * @param {number} d_z - z target velocity
	 * @param {number} max - max force
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, z: number}}
	 *
	 * @example
	 * Math.evadeSteer(10, 10, 0, 20, 20, 0, 1, 1, 0, 1, 1, 0, 2);
	 * //{x: 0.41421356237309515, y: 0.41421356237309515, z: 0}
	 *
	 * @function evadeSteer
	 * @memberof Vector
	 **/
	function Math_evadeSteer(a_x, a_y, a_z, b_x, b_y, b_z, c_x, c_y, c_z, d_x, d_y, d_z, max, returnData) {
		returnData = local.helper1(returnData, true);
		_helper11(a_x, a_y, a_z, b_x, b_y, b_z, d_x, d_y, d_z, max, returnData);
		Math_fleeSteer(a_x, a_y, a_z, returnData.x, returnData.y, returnData.z, c_x, c_y, c_z, max, returnData);
		return returnData;
	}

	/**
	 *
	 * Arrival behavior
	 *
	 * @param {number} a_x - x current position
	 * @param {number} a_y - y current position
	 * @param {number} a_z - z current position
	 * @param {number} b_x - x target position
	 * @param {number} b_y - y target position
	 * @param {number} b_z - z target position
	 * @param {number} c_x - x current velocity
	 * @param {number} c_y - y current velocity
	 * @param {number} c_z - z current velocity
	 * @param {number} radius - slow radius
	 * @param {number} max - max force
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, z: number}}
	 *
	 * @example
	 * Math.arrivalSteer(10, 10, 0, 20, 20, 0, 1, 1, 0, 100, 5);
	 * //{x: -0.5, y: -0.5, z: 0}
	 *
	 * @function arrivalSteer
	 * @memberof Vector
	 **/
	function Math_arrivalSteer(a_x, a_y, a_z, b_x, b_y, b_z, c_x, c_y, c_z, radius, max, returnData) {
		return _helper12(b_x - a_x, b_y - a_y, b_z - a_z, c_x, c_y, c_z, radius, undefined, max, false, returnData);
	}

	/**
	 *
	 * Away behavior
	 *
	 * @param {number} a_x - x current position
	 * @param {number} a_y - y current position
	 * @param {number} a_z - z current position
	 * @param {number} b_x - x target position
	 * @param {number} b_y - y target position
	 * @param {number} b_z - z target position
	 * @param {number} c_x - x current velocity
	 * @param {number} c_y - y current velocity
	 * @param {number} c_z - z current velocity
	 * @param {number} radius - slow radius
	 * @param {number} min - min force
	 * @param {number} max - max force
	 * @param {object=} returnData - Object to put data
	 * @return {{x: number, y: number, z: number}}
	 *
	 * @example
	 * Math.awaySteer(10, 10, 0, 20, 20, 0, 1, 1, 0, 100, 5, 10);
	 * //{x: -7.571067811865475, y: -7.571067811865475, z: 0}
	 *
	 * @function awaySteer
	 * @memberof Vector
	 **/
	function Math_awaySteer(a_x, a_y, a_z, b_x, b_y, b_z, c_x, c_y, c_z, radius, min, max, returnData) {
		return _helper12(a_x - b_x, a_y - b_y, a_z - b_z, c_x, c_y, c_z, radius, min, max, true, returnData);
	}

	/**
	 *
	 * In Atan
	 *
	 * @param {number} time
	 * @param {number=} [power=15]
	 * @return {number}
	 *
	 * @example
	 * Tween.inAtan(0.25);
	 * //0.014683755187299807
	 *
	 * @function inAtan
	 * @memberof Tween
	 **/
	function Tween_inAtan(time, power) {
		power = local.helper0(power, 15);
		return (Math.atan((time - 1) * power) / Math.atan(power)) + 1;
	}

	/**
	 *
	 * Out Atan
	 *
	 * @param {number} time
	 * @param {number=} [power=15]
	 * @return {number}
	 *
	 * @example
	 * Tween.outAtan(0.25);
	 * //0.8710074490414546
	 *
	 * @function outAtan
	 * @memberof Tween
	 **/
	function Tween_outAtan(time, power) {
		power = local.helper0(power, 15);
		return Math.atan(time * power) / Math.atan(power);
	}

	/**
	 *
	 * In Out Atan
	 *
	 * @param {number} time
	 * @param {number=} [power=15]
	 * @return {number}
	 *
	 * @example
	 * Tween.inOutAtan(0.25);
	 * //0.044516364648252205
	 *
	 * @function inOutAtan
	 * @memberof Tween
	 **/
	function Tween_inOutAtan(time, power) {
		power = local.helper0(power, 15);
		return (Math.atan((time - 0.5) * power) / (2 * Math.atan(power / 2))) + 0.5;
	}

	/**
	 *
	 * Mix many easing functions together
	 *
	 * @param {number} time
	 * @param {number} eases - structure of easing function connected together, see example below
	 * @param {number} ratio - efeective range for eases structure
	 * @return {number}
	 *
	 * @example
	 * Tween.mix(
	 *   0.45,
	 *   [
	 *     (x) => Tween.outCirc(x),                    (x) => Tween.inOutSine(x, 1),
	 *     (x) => Math.snap(Math.round, 2, x, 1 / 30), (x) => x,
	 *     (x) => Math.snap(Math.round, 2, x, 1 / 30), (x) => Tween.inOutSine(x, 1),
	 *     (x) => Tween.inCirc(x)
	 *   ],
	 *   [
	 *     0, 0.43,
	 *     0.57, 1
	 *   ],
	 * );
	 * //1.5999999999999999
	 *
	 * @function mix
	 * @memberof Tween
	 */
	function Tween_mix(time, eases, ratio) {
		if (time > ratio[ratio.length - 1]) {
			return eases[eases.length - 1](time);
		} else if (time < ratio[0]) {
			return eases[0](time);
		}
		let tempI, tempT;
		for (let i = 0; i < ratio.length; i += 1) {
			if (ratio[i] <= time && time <= ratio[i + 1]) {
				tempI = i * 2;
				tempT = eases[tempI + 1](Math.norm(time, ratio[i], ratio[i + 1]));
				return eases[tempI + 2](time) * tempT + eases[tempI](time) * (1 - tempT);
			}
		}
		return 1;
	}

	/**
	 *
	 * 2D linear intepolation
	 *
	 * @param {number} x - x coord of point to filter
	 * @param {number} y - y coord of point to filter
	 * @param {number} x1 - x coord of top-left corner
	 * @param {number} y1 - y coord of top-left corner
	 * @param {number} x2 - coord of bottom-right corner
	 * @param {number} y2 - y coord of bottom-right corner
	 * @param {number} tl - top-left value
	 * @param {number} tr - top-right value
	 * @param {number} bl - bottom-left value
	 * @param {number} br - bottom-right value
	 * @return {number}
	 *
	 * @example
	 *	Tween.bilinear(0.75, 0.85, 0, 1, 1, 0, 1, 2, 0, 1);
	 * //1.5999999999999999
	 *
	 * @function bilinear
	 * @memberof Tween
	 */
	function Tween_bilinear(x, y, x1, y1, x2, y2, tl, tr, bl, br) {
		let denom = 1 / ((x2 - x1) * (y2 - y1));
		let dx1 = (x - x1) * denom;
		let dx2 = (x2 - x) * denom;
		let dy1 = y - y1;
		let dy2 = y2 - y;
		return (tl * dx2 * dy2 + tr * dx1 * dy2 + bl * dx2 * dy1 + br * dx1 * dy1);
	}
	
	return [
		"M", "QTR_PI", Math_QTR_PI,
		"M", "GRAVITY", Math_GRAVITY,
		"G", "gravity", Geometry_gravity,
		"G", "rotPnt3D", Geometry_rotPnt3D,
		"M", "pol3D", Math_pol3D,
		"M", "rec3D", Math_rec3D,
		"M", "pol3D2", Math_pol3D2,
		"M", "rec3D2", Math_rec3D2,
		"M", "vrltVec", Math_vrltVec,
		"M", "updateSteer", Math_updateSteer,
		"M", "seekSteer", Math_seekSteer,
		"M", "fleeSteer", Math_fleeSteer,
		"M", "pursuitSteer", Math_pursuitSteer,
		"M", "arrivalSteer", Math_arrivalSteer,
		"M", "awaySteer", Math_awaySteer,
		"M", "evadeSteer", Math_evadeSteer,
		"T", "inAtan", Tween_inAtan,
		"T", "outAtan", Tween_outAtan,
		"T", "inOutAtan", Tween_inOutAtan,
		"T", "mix", Tween_mix,
		"T", "bilinear", Tween_bilinear,
	];
},
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	typeof global !== "undefined" ? global : this
);
