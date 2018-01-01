// 函数防抖
function debounce(fn, wait, lead) {
  var me,
      args,
      timer,
      result;
  function cb() {
    clearTimeout(timer);
    timer = null;
    if (!lead) {
      result = fn.apply(args)
      return result
    }
  }
  return function() {
    var isLead = lead && !timer;
    me = this,
    args = [].slice.call(arguments);
    clearTimeout(timer)
    timer = setTimeout(cb, wait)
    if (isLead) {
      result = fn.apply(args)
      return result
    }
  }
}

// 函数防抖
function throttle(fn, wait) {
  var me,
      args,
      timer,
      result,
      lastCalled = 0;
  function cb() {
    clearTimeout(timer);
    timer = null;
    fn.apply(me, args);
  }
  return function() {
    var now = new Date;
    var remain = wait - (now - lastCalled);
    me = this;
    args = [].slice.call(arguments)
    if (remain <= 0)  {
      clearTimeout(timer);
      timer = null;
      lastCalled = now
      result = fn.apply(me, args);
    }
    else if (!timer) {
      timer = setTimeout(cb, remain)
    }
    return result
  }
}

// 防抖
function debounce(fn, wait, lead) {
  var me,
      args,
      timer,
      result;
  function cb() {
    clearTimeout(timer);
    timer = null;
    if (!lead) {
      fn.apply(me, args)
    }
  }
  return function() {
    var isLead = lead && !timer;
    me = this,
    args = [].slice.call(arguments)
    if (isLead) {
      clearTimeout(timer);
      timer = null;
      result = fn.apply(me, args)
    }
    timer = setTimeout(cb, wait)
    return result
  }
}

// 节流
function throttle(fn, wait) {
  var me,
      args,
      timer,
      result,
      lastCalled = 0;
  function cb() {
    clearTimeout(timer);
    timer = null;
    fn.apply(me, args)
  }
  return function() {
    var now = new Date;
    var remain = wait - (now - lastCalled);
    args = [].slice.call(arguments);
    me = this;
    if (remain <= 0) {
      clearTimeout(timer);
      timer = null;
      lastCalled = now;
      result = fn.apply(me, args)
    }
    else if (!timer) {
      timer = setTimeout(cb, remain)
    }
    return result
  }
}

// 数组扁平化
function flattern(arr) {
  var result = [].concat(...arr)
  return result.some(Array.isArray) ? flattern(result): result;
}

function flattern1(arr) {
  var result = arr.reduce((prev, item) => {
    if (Array.isArray(item)) {
      prev = prev.concat(flattern1(item))
      return prev
    }
    prev.push(item)
    return prev
  }, [])
  return result
}
// 仅限于纯数字数组
function flatternNum(arr) {
  return Array.from(arr.toString()).split(',')
}

// curry
function curry(fn) {
  var arr = [];
  function cb () {
    if (arguments.length === 0) {
      return fn.apply(this, arr)
    }
    var temp = [].slice.call(arguments)
    arr.concat(temp);
    return cb
  }
  cb.toString = cb.valueOf = function () {
    return fn.apply(this, arr)
  }
  return cb
}

// 二分搜索
function searchDou(arr, e) {
  var mid,
      low = 0,
      high = arr.length - 1;
  while (low <= high) {
    mid = Math.floor((high + low)/2)
    if (arr[mid] === e) {
      return mid
    }
    else if (arr[mid] < e) {
      low = mid + 1
    }
    else {
      high = mid - 1
    }
  }
  return -1
}

// 寻找和为定值的2个数
function search2Num(arr, m) {
  var map = {};
  for (let item of arr) {
    if (map[item]) {
      return [map[item], item]
    }
    else {
      map[m - item] = item
    }
  }
}

function searchN(arr, n, m){
  var result = [],
      results = [];
  function findNum(arr, n, m, result, results) {
    
  }
}
