//This file contains junk code that may or may not useful or serve other purposes

/*
Logit function inverse of sigmoid
Inverse pythagon: 1/h^2 = 1/a^2+1/b^2
//https://www.youtube.com/watch?v=p-0SOWbzUYI
function modf(v){ //Returns the fractional part of the given real number.
	if(v > 0){
		let tmp = floor(v);
		return v - tmp;
	}
	else if(v < 0){
		let tmp = abs(v);
		return floor(tmp) + tmp;
	}
	return 0;
}
////u * u - 4 * a * -s * 0.5;
https://github.com/gorhill/Javascript-Voronoi
https://github.com/zsoltc/worley-noise
var y = ~~(x);
if (x < 0 && x !== y) {
    y--;
}
return y;
reduceAngle = function(theta) {
        theta %= MathUtils.TWO_PI;
        if (Math.abs(theta) > MathUtils.PI) {
            theta = theta - MathUtils.TWO_PI;
        }
        if (Math.abs(theta) > MathUtils.HALF_PI) {
            theta = MathUtils.PI - theta;
        }
        return theta;
    };
//https://github.com/webinista/angleconverter/blob/master/convertangles.js
https://github.com/anoff/is-opposed-angle

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
}

//debugger;
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
		epsilon = _helper0(epsilon, 1e-17);
		iteration = _helper0(iteration, 1e7);
		let temp1, temp2, temp3;
		while (x1 - x0 > epsilon && i < iteration) {
			//debugger;
			/*temp1 = (x1 + x0) / 2;
			temp2 = func(temp1);
			temp3 = func(x1);
			if (temp3 * temp2 < 0) {
				x1 = temp1;
			} else if (temp3 * temp2 > 0) {
				x0 = temp1;
			} else if (temp3 * func(x1) === 0) {
				if (temp3 === 0) {
					return x0;
				}
				return x1;
			}***
			temp1 = (x0 + x1) / 2;
			if (func(temp1) > 0) {
				x1 = temp1;//(temp1 + x0) / 2;
			} else if (func(temp1) < 0) {
				x0 = temp1;//(temp1 + x1) / 2;
			} else if (func(x0) * func(x1) === 0) {
				if (temp3 === 0) {
					return x0;
				}
				return x1;
			}
			i ++;
		}
		//if (func(x0) * func(x1) < 0) {
			return (x1 + x0) / 2;
		//}
		//return NaN;
	
*/

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
