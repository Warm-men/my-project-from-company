var INFINITY = 1 / 0
var MAX_INTEGER = 1e308

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 *  _.toInteger('3.14');
 *  // => 3
 *
 * _.toInteger(NaN);
 * // => 0
 *
 * _.toInteger(-Infinity)
 * // => -1e308
 */
function toInteger(value) {
  if (value === INFINITY || value === -INFINITY) {
    return (value < 0 ? -1 : 1) * MAX_INTEGER
  }
  value = +value
  var remainder = value % 1
  return remainder ? value - remainder : value
  // FIXME:自身与自身比较，fix warning
  // return value === value ? (remainder ? value - remainder : value) : 0
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
    length = array.length

  start = start == null ? 0 : toInteger(start)
  if (start < 0) {
    start = -start > length ? 0 : length + start
  }
  end = end === undefined || end > length ? length : toInteger(end)
  if (end < 0) {
    end += length
  }
  length = start > end ? 0 : (end - start) >>> 0
  start >>>= 0

  var result = Array(length)
  while (++index < length) {
    result[index] = array[index + start]
  }
  return result
}

var nativeCeil = Math.ceil
// var nativeMax = Math.max

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size, guard) {
  // if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
  // size = 1;
  // } else {
  //   size = nativeMax(toInteger(size), 0);
  // }
  var length = array == null ? 0 : array.length
  if (!length || size < 1) {
    return []
  }
  var index = 0,
    resIndex = 0,
    result = Array(nativeCeil(length / size))

  while (index < length) {
    result[resIndex++] = baseSlice(array, index, (index += size))
  }
  return result
}

export default chunk
