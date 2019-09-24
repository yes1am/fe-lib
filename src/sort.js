const arr1 = [{ a: 2 }, { a: 1 }, { a: 4 }, { a: 3 }]

// 升序, 如果函数返回值 < 0, 则 a 在 b 前面。
// 当前 { a: 2 }, { a: 1 }, a.a - b.a > 0
// 所以 a 在 b 后面, [{ a: 1 }, { a: 2 }]
const increaceFun = (a, b, key) => {
  return key ? a[key] - b[key] : a - b
}

// 降序, 如果函数返回值 > 0, 则 a 在 b 后面
// 当前 { a: 2 }, { a: 1 }, b.a - a.a < 0
// 所以 a 在 b 前面, [{ a: 2 }, { a: 1 }]
const decreaseFun = (a, b, key) => {
  return key ? b[key] - a[key] : b - a
}

// console.log(arr1.sort((a, b) => increaceFun(a, b, 'a')))
// [ { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 } ]

// console.log(arr1.sort((a, b) => decreaseFun(a, b, 'a')))
// [ { a: 4 }, { a: 3 }, { a: 2 }, { a: 1 } ]

/**
 *
 * @param {*} arr
 * @param {*} key
 * @param {*} isDecrease 是否降序， 默认升序
 */
function sort (arr, key = '', isDecrease) {
  if (isDecrease) {
    return arr.sort((a, b) => decreaseFun(a, b, key))
  } else {
    return arr.sort((a, b) => increaceFun(a, b, key))
  }
}

module.exports = sort

// TODO: 支持 key 为 a.b.c 类似的路径
