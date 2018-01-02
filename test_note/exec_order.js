/*
  node.js中的这些东东的执行顺序
    process.nextTick
    setImmediate
    setTimeout
    setInterval
    promise.then
*/

// setTimeout(function() {
//   console.log(3)
// },0)
//
// process.nextTick(function() {
//   console.log(1)
// })

// 执行顺序不固定的
//  2 7 6
//  2 6 7
// setImmediate(function() {
//   console.log(2)
//
//   setTimeout(function() {
//     console.log(6)
//   },0)
//
//   setImmediate(function() {
//     console.log(7)
//   })
// })
var start = Date.now()

setImmediate(function() {
  console.log(9)
})


setTimeout(function() {
  console.log(8)
  console.log(start - Date.now())
},0)
//
// new Promise(function(res) {
//   console.log(4)
//   res(5)
// }).then(function(v) {
//   console.log(v)
// })
