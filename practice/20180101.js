/**
 * 实现取两个升序数组中的第n大值
 * @param {number} n
 * @param {array} a
 * @param {array} b
 * @return {number | null}
 **/
function getNLarge(n, a, b) {
  if (arguments.length < 3) {
    throw new Error('arugments length must be 3!')
  }
  if (typeof n !== 'number') {
    throw new Error('n must be a number')
  }
  if (!(a instanceof Array || b instanceof Array)) {
    throw new Error('a, b must be array')
  }
  var i = a.length,
      j = b.length,
      prev,
      result;
  // 循环直到遍历了len - n次
  while (n) {
    prev = result;
    // 当前a的指针已经为不可移动
    if (i === 0 && j !== 0) {
      result = b[j - 1];
      j--;
    }
    // 当前b的指针已经为不可移动
    else if (i !== 0 && j === 0) {
      result = a[i - 1];
      i--;
    }
    // 没有指针可以移动了，说明没有第N大值
    else if (i === 0 && j === 0) {
      return null
    }
    // 判断当前的指针是否为0及0以上
    // 比较大小
    if (i !== 0 && j !== 0) {
      if (a[i - 1] > b[j - 1]) {
        result = a[i - 1]
        i--;
      } else {
        result = b[j - 1]
        j--;
      }
    }
    // 判断是否有重复的值
    if (prev !== result) {
      n--;
    }
  }
  return result
}
// var a = [1,2,3,4,5,6];
// var b = [5,6,7,9,10];
// console.log(getNLarge(9, a, b))

/**
 * Promise 实现
 * @param {func} fn
 * @return {promise} 实例化对象
 **/
function Promise(fn) {
  if (!isFunc(fn)) {
    throw new TypeError('fn must be a function!')
  }
  this.status = 'pending';
  this.cbArr = {fulfilled: [], rejected: []}

  var resFn = handle.bind(this, 'fulfilled');
  var rejFn = handle.bind(this, 'rejected');

  setTimeout(fn, 4, resFn, rejFn)

  function handle(status, val) {
    if (status === 'pending') {
      return
    }
    this.status = status;
    this.val = val;
    var cb = this.cbArr.shift();
    while (cb) {
      cb.call(this);
      cb = this.cbArr.shift();
    }
  }
}

Promise.prototype.then = function (resFn, rejFn) {
  var me = this;
  return new Promise(function (res, rej) {
    switch(me. status) {
      case 'pending':
        me.cbArr.fulfilled.push(realRes)
        me.cbArr.rejected.push(realRej)
        break;
      case 'fulfilled':
        realRes(val);
        break;
      default:
        realRej(val)
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
        rej(e)
      }
    }
    function realRej(val) {
      if (!isFunc(rejFn)) {
        return rej(val)
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
        rej(e)
      }
    }
  })
}
// 传数组，内部计数器，返回新的Promise，全部resolve才执行res，一个错直接调rej
Promise.prototype.all
// 传数组，内部计数器，返回新的Promise，一个resolve执行res，一个错rej
Promise.prototype.race
// 传值、有then成员的对象、promise对象，只要不报错，直接走res，
// 作用，可以将同步操作走promise queue，vue.nextTick我需要看看
Promise.prototype.resolve
Promise.prototype.reject
Promise.prototype.catch

/**
 * 判断函数
 * @param {func} fn
 * @return {bool}
 **/
function isFunc(fn) {
  return typeof fn === 'function'
}

/**
 * 判断是否为promise对象
 * @param {promise} pro
 * @return {bool}
 **/
function isThenable(pro) {
  return pro && isFunc(pro.then)
}
