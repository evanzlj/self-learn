// 最长公共子序列
function LCS(str1, str2) {
  var arr = [], i, j, a, b, len1 = str1.length, len2 = str2.length;
  for (i = 0; i <= len1; i++) {
    arr[i] = []
  }
  for (i = 0; i <= len1; i++) {
    for (j = 0; j <= len2; j++) {
      if (i === 0 || j === 0) {
        arr[i][j] = 0
      }
      else if (str1[i] === str2[j]) {
        arr[i][j] = arr[i][j - 1] + 1
      }
      else {
        a = arr[i - 1][j];
        b = arr[i][j - 1];
        arr[i][j] = (a > b)? a: b;
      }
    }
  }
  return arr[len1][len2]
}

// 寻找最长公共子序列集合
function LCSARR(str1, str2) {
  var arr = [], len1 = str1.length, len2 = str2.length, i, j, a, b;
  for (i = 0; i <= len1; i++) {
    arr[i] = []
  }
  for (i = 0; i <= len1; i++) {
    for (j = 0; j <= len2; j++) {
      if (i === 0 || j === 0) {
        arr[i][j] = 0
      }
      else if (str1[i] === str2[j]) {
        arr[i][j] = arr[i][j - 1] + 1
      }
      else {
        a = arr[i-1][j]
        b = arr[i][j-1]
        arr[i][j] = (a > b)? a: b;
      }
    }
  }
  return findValues(str1, arr, len1, len2)
}
function findValues(str1, arr, len1, len2) {
  var result = [], i = len1, j = len2;
  while (i > 0 && j > 0) {
    if (arr[i][j] > arr[i][j-1] && arr[i][j] > arr[i-1][j]) {
      i--;
      j--;
      result.unshift(str1[i])
    }
    else if (arr[i][j] > arr[i-1][j]) {
      j--;
    }
    else if (arr[i][j] > arr[i][j-1]) {
      i--;
    }
    else if (arr[i][j] > arr[i-1][j-1]){
      i--;
      j--;
      result.unshift(str1[i])
    }
    else {
      i--;
      j--;
    }
  }
  return result.join('')
}

// console.log(LCSARR('ACBD','BDAA'))

// 01背包问题
function bags01(weights, values, cap, n) {
  var arr = [], i, j, a, b;
  for (i = 0; i <= n; i ++) {
    arr[i] = []
  }
  for (i = 0; i <= n; i ++) {
    for (j = 0; j <= cap; j++) {
      if (i === 0 || j === 0) {
        arr[i][j] = 0
      }
      else if (weights[i - 1] <= j) {
        arr[i][j] = values[i - 1] + arr[i - 1][j - weights[i - 1]]
      }
      else {
        a = arr[i - 1][j]
        b = arr[i][j - 1]
        arr[i][j] = a > b ? a: b;
      }
    }
  }
  console.log(arr)
  // return arr[n][cap]
  return findBags(arr, cap, n, weights)
}
var weights = [3,4,5],
    values = [1,2,3],
    n = 3,
    cap = 10;
// console.log(bags01(weights, values, cap, n))

function findBags(arr, cap, n, weights) {
  var result = [], i = n, j = cap;
  while (i > 0 && j > 0) {
    if (arr[i][j] > arr[i-1][j]) {
      i --;
      j = j - weights[i];
      result.push(i)
    }
    else {
      i --;
    }
  }
  return result
}

// 最少硬币找零
function getChanges(sum, arr) {
  if (sum === 0) {
    return []
  }
  var min = [], newMin, i, len = arr.length, newSum;
  for (i = 0; i < len; i++) {
    newSum = sum - arr[i];
    if (newSum >= 0) {
      newMin = getChanges(newSum, arr);
    }
    if (
        newSum >= 0 &&
        (min.length - 1 >= newMin.length || min.length === 0)

    ) {
      min = [arr[i]].concat(newMin)
    }
  }
  return min
}

// console.log(getChanges(15,[1,2,6]))

// 给定m个数，有n个相加为sum
function getSumArr(arr, m, n, sum) {
  if (arguments.length < 4) {
    throw new Error('Params length must be 4, but now is '+arguments.length)
  }
  if (!sum) {
    return []
  }
  var result = [], i, j, newR = [], newSum
  for (i = 0; i < m; i++) {
      newSum = sum - arr[i]
      if (newSum >= 0) {
        newR = getSumArr(arr.slice(0,i).concat(arr.slice(i + 1)), m - 1, n - 1, newSum)
      }
      if (newSum >= 0 && newR.length === n - 1) {
        result = [arr[i]].concat(newR)
      }
  }
  return result
}

var narr = []
function getSumArrls(arr, n, sum) {
  if (n <= 0 || sum <= 0) {
    return
  }
  if (sum === n) {
    arr.reverse()
    if (arr === []) {
      console.log(n)
    }
    else {
      console.log(n, '+', arr.join('+'))
    }
    narr.reverse()
  }
  narr.push(n)
  getSumArrls(sum - n, n - 1)
  narr.pop();
  getSumArrls(sum, n - 1)
}
getSumArrls(narr, 100, 27)
console.log(narr)
var arr = [1,2,4,3,5,7,6,8,9,10]
var n = 3;
var sum = 23
// console.log(getSumArr(arr, arr.length, n, sum))

// 柯里化题目 add()()()
function curry(fn) {
  var arr = [];
  var cb = function cc () {
    if (arguments.length === 0) {
      return fn.apply(this, arr)
    }
    var args = [].slice.call(arguments);
    arr.concat(args)
    return cc
  }
  cb.toString = cb.valueOf = function () {
    return fn.apply(this, arr)
  }
  return cb
}
function add() {
  var arr = [].slice.call(arguments);
  var result = 0;
  arr.map(item => {
    if (arr)
    result += item
  })
  return result
}

// 反转二叉树
// 反转单链表
// 寻找单链表中间点
// Promise手写
// 观察者模式
//
