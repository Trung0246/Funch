# Funch
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/426b8adb46464fcfb618dc22d4c7d73d)](https://www.codacy.com/app/Trung0246/Funch?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Trung0246/Funch&amp;utm_campaign=Badge_Grade)
![Shields Badge](https://img.shields.io/badge/license-MIT-blue.svg)

An all-in-one library that dedicated to provide more functions mostly focus on game development (and dumb things).

This library is mostly used for my personal stuffs, and I updated this library very frequently. I constantly added many functions and deleted many things without warning during Alpha version. Basically this library is a collections of functions.

#### TODO:
- Test coverage? (Too lazy... There are too many functions...)
- A website to introduce this library and other things like geting started, documentation, example,...

Version 0.27a (Alpha version)

[Download](https://cdn.rawgit.com/Trung0246/Funch/e61f3939/src/funch.js) ([Minified](https://cdn.rawgit.com/Trung0246/Funch/e61f3939/src/funch.min.js))

[Documentation](https://cdn.rawgit.com/Trung0246/Funch/7117fafc/docs/index.html) (may not update to lastest version) (0.26a)

You can generate document yourself by using [JSDoc](http://usejsdoc.org/).

---

### Features
- Over 250 functions that you can use right now

- Simple to add by copy `<script type="text/javascript" src="funch.js"></script>` or `require("./funch.js");`

- Medium-sized ? (**42.6 KB** compressed using [UglifyJS2](https://github.com/mishoo/UglifyJS2))

- Easy to copy and paste any function you like to use without include whole library *(I'm sad :( )*

- No additional objects or classes (except Geometry and Tween obviously for exporting functions)

- No dependencies

- Extendable with plugins

```
//Require funch.js v0.27a
(function(root, global) {
	root = root.bind(this, global);
	if (typeof define === "function" && define.amd) {
		define(["funch"], function(Funch) {
			Funch._PLUGINS_(root);
		});
	} else if (typeof module === "object" && module.exports) {
		module.exports = root;
		
		//Example usage in node (there's no way to automate this, sory :():
		//let funch = require(funch)
		//let funch_extend = require(funch_extend)
		//funch._PLUGINS_(funch_extend)
	} else {
		global._FUNCH_PLUGINS_(root);
	}
})(function (global, local, main) {
	let Math_QTR_PI = Math.HALF_PI / 2;

	//Array to export function
	return [
		"M", "QRT_PI", Math_QRT_PI
	];
},
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	typeof global !== "undefined" ? global : this
);
```

### Changelog

- Optimized some functions and added new features
- Fixed some nasty bugs

##### Notes
    
  - If a function depends on another functions, try to use funch.js provided functions if it had, else ask me if that function can be generalized...
    
  - This is my first library. There maybe some bad coding practice in the codebase :(
  
  - I am very inexperienced in Node and modules related stuff, any helps really appreciated :D
  
  - Also I am still don't know how to use git and github properly yet...
