# 理解node事件循环机制

在译文中，我们对官方的文章进行了翻译。但是理解起来需要一定的基础，现在我们从几个问题出发，
一步步探寻译文中说到的事件循环机制。

**声明:本文内容均为个人理解，如果有其他观点，欢迎发邮件哈~ linjun911@gmail.com，拜谢看官**

## timer被I/O阻塞

这是在译文中出现的一个示例：

```javascript
const fs = require('fs');

function someAsyncOperation(callback) {
  // 假设这个任务需要95ms完成
  fs.readFile('/path/to/file', callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);


// 在95ms之后完成一些其他的任务
someAsyncOperation(() => {
  const startCallback = Date.now();

  // 执行一些同步任务，耗时10ms
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
});
```

分析下这段代码的执行：

1.Node.js初始化事件循环、声明变量fs为模块fs的输出；

2.声明函数someAsyncOperation；

3.声明变量timeoutScheduled；

4.调用setTimeout方法(setTimeout会被放入Node.js实现的timer容器中等待计时器到达最少延迟时间)；

5.调用someAsyncOperation方法，执行fs.readFile操作；

6.同步代码执行完毕，事件循环开始行动，按照模型，从timer => i/o callback => idle/prepare => poll => check => close callback
如果所有执行阶段回调队列均为空，那么事件循环会停留在poll阶段，检测i/o处理是否完成或是接受Timer释放定时器到时的信息。

7.fs.readFile在95ms时完成，事件循环收到内核信息，将fs.readFile的回调放入Poll的队列中等待执行

8.事件循环将fs.readFile回调放入Poll后，执行回调，由于回调中有10ms的操作，占用了事件循环，事件循环停留10ms。而另一边在到达100ms后，setTimeout中的回调放入timer队列中等待执行。

9.当poll阶段执行完毕后，检测到没有其他回调可以执行，timer队列中仍有回调时，会立即运行到timer阶段，执行setTimeout的回调函数，输出'105ms have passed since I was scheduled'

这也是为什么我们在node.js中写的定时器有时会超过最少延迟时间的执行的原因。

## setTimeout vs setImmediate

译文中有两个对比的场景，我会对它们进行分析，导出它们的执行顺序，进而更好的理解事件循环

### example1：

直接在主代码中执行：

```javascript
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
})
```

```
$ node timeout_vs_immediate.js
timeout
immediate

$ node timeout_vs_immediate.js
immediate
timeout
```

上述代码，描述了在主模块中直接执行两者的顺序是不一致的，为什么不一致呢？

译文中的答案是进程的性能问题，我觉得应该细化的再说下:

当nodejs执行完毕同步代码后，setTimeout被声明到TIMER容器中计时，setImmediate被放入check阶段队列中，而node会开始运行事件循环(正如之前所讲，node会在一开始执行同步代码同时初始化事件循环的队列)，如果setTimeout在事件循环运行到timer阶段前就已经注册到timer阶段的队列中，那么setTimeout会比setImmediate先输出。反之如果没有注册上，就会在下一次事件循环中执行，那么setImmediate比setTimeout先输出。

无关紧要的面试题: setTimeout(fn, 0)在node环境下或浏览器环境下的最少延迟时间是？

<a href="https://nodejs.org/dist/latest-v8.x/docs/api/timers.html#timers_settimeout_callback_delay_args">setTimeout(fn, delay)</a>，在node.js中delay最小值为1，如果设置的值为1以下的，在node.js运行时统统会被重写为1。

<a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Reasons_for_delays_longer_than_specified">setTimeout(fn, delay)</a>，在浏览器中delay最小值为4，如果设置的值为4以下的，在浏览器运行时统统会被重写为4。


### example2:

```javascript
// timeout_vs_immediate.js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

```
$ node timeout_vs_immediate.js
immediate
timeout

$ node timeout_vs_immediate.js
immediate
timeout
```

上述代码描述了在I/O操作的回调中，setTimeout与setImmediate的执行顺序是一定的。为什么？

事件循环在执行fs的回调时，已经在Poll阶段了，事件循环会往下执行，先执行check阶段中的setImmediate回调，得知timer阶段中有setTimeout回调，就会去执行setTimeout回调。所以如果两者的环境处于同一个I/O回调中，那么setImmediate永远比setTimeout先执行。

## 总结

在使用事件循环分析上述两个问题后，我们不难发现，定时器执行顺序对比，node.js操作被阻塞没有执行这一类问题，在后续排查过程中，都可以使用这样的思路去分析，更快的排查问题根源。

在接下来的安排中，我会去继续探索浏览器内部的JS事件运行机制，也请各位同学不吝指点~~。
