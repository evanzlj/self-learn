// 跨域通信方式
/*
1. HTML postmessage，onmessage
2. jsonP 利用script标签和匿名函数的参数进行
3. window.domain + iframe 限制在于需要同一域名 不能从lenovo.com.cn => baidu.com
4. window.name + iframe 限制在于2MB的长度
  iframe域内设置window.name = JSON字符串
  在父级页面中使用iframe.contentWindow.name获取到数据
  使用iframe.contentWindow.close() 关闭子页面
  删除元素document.body.removeChild(iframe)
  iframe.src='';
  iframe = null;
5. websocket
6. cors 在服务器端配置ALLOW-ACCESS-ORIGIN等头部

// 信息传递而已
cookie 跨子域
*/

// 获取url中的参数
/*
window.location.search.replace(/[^&|?]([^&]+)=([^&]+)/g, function($0, $1, $2) {
  console.log($1, ':', $2)
})
*/

// 数组扁平化
// 1
function flatten(arr) {
  return arr.reduce((prev, cur)=>prev.concat(Array.isArray(cur)?flatten(cur):cur),[])
}
// 2
function flattern1(arr) {
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr)
  }
  return arr
}

// 对象深克隆
// 1 递归
function extend1(obj) {
  var result;

  return result
}

// 2 JSON.stringify JSON.parse 在函数状态下GG
function extend2(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// Promise
function Promise(fn) {
  if (!isFunc(fn)) throw new TypeError('fn must be a function')
  this.status = 'pending'
  this.cbArr = {'fulfilled': [], 'rejected': []}
  var resFn = handle.bind(this, 'fulfilled');
  var rejFn = handle.bind(this, 'rejected');
  setTimeout(fn, 4, resFn, rejFn)
  function handle(status, v) {
    if (status === 'pending') {
      return
    }
    this.status = status;
    this.v = v;
    var cb = this.cbArr[status].shift();
    while (cb) {
      cb(v);
      cb = this.cbArr[status].shift()
    }
  }
}

Promise.prototype.then = function(resFn, rejFn) {
  var me = this
  return new Promise(function(res, rej) {
    switch(me.status){
      case 'pending':
        me.cbArr.fulfilled.push(realRes)
        me.cbArr.rejected.push(realRej)
        break;
      case 'fulfilled':
        realRes(me.v);
        break;
      case 'rejected':
        realRej(me.v);
        break;
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
      } catch(e) {
        rej(r)
      }
    }
    function realRej(val) {
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
      } catch(e) {
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
Promise.prototype.all = function(arr) {
  if (!arr instanceof Array) throw new TypeError('arr must be a array')
  if (arr.some(item => !item instanceof Promise)) throw new TypeError('arr\'s item must be a Promise instance')
  return new Promise(function(res, rej) {
    var num = 0;
    var rArr = []
    if (arr.length === 0) {
      res(rArr);
      return
    }
    for (let item of arr) {
      item(resCb, rej)
    }
    function resCb(result) {
      rArr.push(result);
      num ++;
      if (num === arr.length) {
        res(rArr)
      }
    }
  })
}

// curry
function curry(fn) {
  if (!isFunc(fn)) throw new TypeError('fn must be a function')
  var arr = [];
  var cb = function () {
    if (arguments.length === 0) {
      return fn.apply(this, arr)
    }
    var args = [].slice.call(arguments);
    arr.push.apply(this, args);
    return cb
  }
  cb.toString = cb.valueOf = function () {
    return fn.apply(this, arr)
  }
}

// debounce 函数节流
function debounce(fn, wait, leading) {
  var me,
      args,
      timer;
  function call() {
    clearTimeout(timer);
    timer = null;
    if (!leading) {
      fn.apply(me, args)
    }
  }
  return function() {
    me = this;
    args = [].slice.call(arguments);

    if (leading) {
      fn.apply(me, args);
    }
    timer = setTimeout(call, wait);
  }
}
