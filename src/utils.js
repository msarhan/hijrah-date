var slice             = [].slice,
    splice            = [].splice,
    push              = [].push,
    getPrototypeOf    = Object.getPrototypeOf;

var lowercase = function(string) {return isString(string) ? string.toLowerCase() : string;};
var uppercase = function(string) {return isString(string) ? string.toUpperCase() : string;};

function toInt(value){
	return parseInt(value, 10);
}

function isUndefined(value) {return typeof value === 'undefined';}

function isDefined(value) {return typeof value !== 'undefined';}

function isString(value) {return typeof value === 'string';}

function isNumber(value) {return typeof value === 'number';}

function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]';
}

function isValidDate(value) {
  return isDate(value) && !isNaN(value.getTime());
}

var isArray = Array.isArray;

function isFunction(value) {return typeof value === 'function';}

function concat(array1, array2, index) {
  return array1.concat(slice.call(array2, index));
}

function forEach(obj, iterator, context) {
  var key, length;
  if (obj) {
    if (isFunction(obj)) {
      for (key in obj) {
        if (key !== 'prototype' && key !== 'length' && key !== 'name' && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (isArray(obj) || isArrayLike(obj)) {
      var isPrimitive = typeof obj !== 'object';
      for (key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
    } else if (isBlankObject(obj)) {
      // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
      for (key in obj) {
        iterator.call(context, obj[key], key, obj);
      }
    } else if (typeof obj.hasOwnProperty === 'function') {
      // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else {
      // Slow path for objects which do not have a method `hasOwnProperty`
      for (key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    }
  }
  return obj;
}

function floorDiv(x, y){
	var r = toInt(x / y);
	if ((x ^ y) < 0 && (r * y != x)) {
		r--;
	}
	return r;
}

function floorMod(x, y){
	return x - floorDiv(x, y) * y;
}

function addExact(x, y) {
	var r = x + y;
	if (((x ^ r) & (y ^ r)) < 0) {
		throw "integer overflow";
	}
	return r;
}

function arrayBinarySearch(a, key) {
	var low = 0;
	var high = a.length - 1;

	while (low <= high) {
		var mid = (low + high) >>> 1;
		var midVal = a[mid];

		if (midVal < key){
			low = mid + 1;
		} else if (midVal > key){
			high = mid - 1;
		} else {
			return mid;
		}
	}
	return -(low + 1);  // key not found.
}
