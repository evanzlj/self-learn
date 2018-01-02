var start = Date.now();
setTimeout(function () {console.log(start - Date.now())}, 8000)
var a
while(Date.now() - start < 5000) { a = 1 }
