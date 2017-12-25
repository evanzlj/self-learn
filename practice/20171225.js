// 01背包
function bags01(weights, values, cap, n) {
  var i,j,arr = [],a,b
  for (i = 0; i <= n; i++) {
    arr[i] = []
  }
  for (i = 0; i <= n; i++) {
    for (j = 0; j <= cap; j++) {
      if (i === 0 || j === 0) {
        arr[i][j] = 0
      }
      else if (weights[i - 1] <= j) {
        arr[i][j] = values[i - 1] + arr[i - 1][j - weights[i - 1]]
      }
      else {
        a = arr[i-1][j];
        b = arr[i][j-1];
        arr[i][j] = a > b ? a: b;
      }
    }
  }
  return arr[n][cap]
}
// 最少硬币找零
function getChanges(chas, sum) {
  if (!sum) {
    return []
  }
  var min = [], newMin, i, j, newAmount
  for (i = 0; i < chas.length; i++) {
    newAmount = sum - chas[i]
    if (newAmount >= 0) {
      newMin = getChanges(chas, newAmount)
    }
    if (newAmount >= 0 && (min.length-1 > newMin.length || !min.length)) {
      min = [chas[i]].concat(newMin)
    }
  }
  return min
}
// LCS
function LCS(str1, str2) {
  var i,j,len1=str1.length,len2=str2.length,arr=[],a,b
  for (i = 0; i <= len1; i++) {
    arr[i] = []
  }
  for (i = 0; i <= len1; i++) {
    for (j = 0; j <= len2; j++) {
      if (i===0||j===0) {
        arr[i][j] = 0
      }
      else if (str1[i-1] === str2[i-1]) {
        arr[i][j] = arr[i][j-1] + 1
      }
      else {
        a = arr[i-1][j];
        b = arr[i][j-1];
        arr[i][j] = a>b?a:b;
      }
    }
  }
  return arr[len1][len2]
}
// curry
function curry(fn) {
  var arr = [];
  var cb = function () {
    if (arguments.length < 1) {
      return fn.apply(this, arr)
    }
    var args = [].slice.call(arguments);
    arr.push(fn(args));
    return cb
  }
  cb.toString = cb.valueOf =function () {
    return fn.apply(this, arr)
  }
  return cb
}
function Promise (fn) {
  if (isFunc(fn)) {
    throw new Error('fn 类型有误')
  }
  var resFn = handle.bind(this, 'fulfilled')
  var rejFn = handle.bind(this, 'rejected')
  this.cbArr = {fulfilled: [], rejected: []}
  this.status = 'pending'
  setTimeout(fn,4,resFn,rejFn)
  function handle(status, v) {
    if (status === 'pending') {
      return
    }
    this.status = status;
    this.v = v;
    var cb = this.cbArr[status].shift();
    while (cb) {
      cb(v)
      cb = this.cbArr[status].shift()
    }
  }
}
Promise.prototype.then = function (resFn, rejFn) {
  var me = this
  return new Promise(function (res, rej) {
    switch (me.status) {
      case 'pending':
        me.cbArr.fulfilled.push(realRes)
        me.cbArr.fulfilled.push(realRej)
        break;
      case 'fulfilled':
        realRes(me.v);
        break;
      default:
        realRej(me.v)
    }
    function realRes(val) {
      if (!isFunc(resFn)) {
        return res(val)
      }
      try {
        var r = resFn(val);
        if (isThenable(r)) {
          r.then(res, rej)
        }
        else {
          res(r)
        }
      } catch (e) {
        rej(r)
      }
    }
    function realRes(val) {
      if (!isFunc(rejFn)) {
        return res(val)
      }
      try {
        var r = rejFn(val);
        if (isThenable(r)) {
          r.then(res, rej)
        }
        else {
          res(r)
        }
      } catch (e) {
        rej(r)
      }
    }
  })
}
function isFunc(fn) {
  return typeof fn === 'function'
}
function isThenable(obj) {
  return obj && isFunc(obj.then)
}
