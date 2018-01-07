/**
 * 前序遍历实现文件夹目录输出
 */
var fs = require('fs')
var Path = require('path')
/**
 * 包装cb方法成promise 便于async await
 */
function wrap (fn) {
  return function () {
    var args = [].slice.call(arguments)
    return new Promise(function (res) {
      fn.apply(fs, args.concat(function(err,st){res(st)}))
    })
  }
}

var stat = wrap(fs.stat)
var readd = wrap(fs.readdir)

async function list(path, depth) {
  printP(path, depth);
  var st = await stat(path);

  if (st.isDirectory()) {
    var files = await readd(path)
    if (!files) {
      return
    }
    for (let file of files) {
      await list(Path.resolve(path,file), depth + 1);
    }
  }
}

function printP(path, depth) {
  var str = '';
  for (var i = 0; i < depth; i++) {
    str += '   ';
  }
  str += path;
  console.log(str)
}

list(Path.resolve(__dirname, '../'), 0)
