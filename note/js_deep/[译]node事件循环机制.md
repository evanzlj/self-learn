# Nodejs事件循环(Event Loop)，定时器(Timers)以及process.nextTck()

原文地址为:[The Node.js Event Loop, Timers, and process.nextTick()](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

## 什么是事件循环？

事件循环是Node.js面对单线程的javascript编程语言时，实现非阻塞I/O的核心机制。尽可能的将操作安排到系统内核上。

由于现代的内核都是多线程的，他们可以在后台处理多个操作的实施。当任何一个操作完成，这个内核就会通知Node.js，把对应的回调可能扔到poll队列中等待执行。我们会在下面的内容中去解释这块东东。

## 阐述事件循环

当Node.js启动时，他就会初始化事件循环并执行脚本的内容，包括异步API调用、分配定时器或者调用process.nextTick()，然后开始执行事件循环。

接下来的图展示了一个简单描述了Event Loop的执行顺序：

<img src="https://github.com/evanzlj/self-learn/blob/dev/note/js_deep/imgs/event_loop.png" alt="Event Loop" title="Event Loop Model" width="794" height="538">

<small>PS:本想抓图，发现是个html，遂作罢</small>

**注意：每个块可以被当作事件循环中的一个阶段**

每个阶段都会执行一个先进先出的回调队列。然而每个阶段都有自己的规则，通常当事件循环进入到了某个给定的阶段，他会按照该阶段规则去执行该阶段的所有操作，然后执行该阶段的回调队列，直到该队列为空或者达到执行数量的上限为止。当队列为空或者达到执行数量上线时，事件循环会进入到下一个阶段中，接着继续执行。

任何定时器操作都可能增加新的定时器和新的事件(在poll阶段执行的io操作等)，在poll事件执行时，新的poll事件也可以被进入poll队列中。

ps:有点绕，其实就是定时器执行时，可以产生新定时器和新的io事件。io事件执行时，也可以加入新的io操作。

**NOTE:在windows和Unix/Linux中，实现可能有些许不同，对这个规范来说并不重要。最重要的是，这个过程有7/8个步骤，而我们关心的是node.js使用的那些步骤。**

## 阶段概述

- timers:这个阶段会去执行setTimeout/setInterval计划的回调函数
- I/O回调:执行除了关闭类回调、定时器计划的回调、setImmediate的回调外的所有回调函数。
- idle,prepare:仅供node.js内部使用
- poll:检查新的I/O事件，当占用的时候node进程可能会阻塞
- check:setImmediate的回调函数在这里被调用
- close callbacks:例如 socket.on('close', ...)

在运行事件循环时，Node.js会查看是否在等待任何异步操作或者定时器，并且在没有任何任务的情况下，将会快速停下本次事件循环。

## 阶段详解

### Timers

timer(定时任务)有一个指定执行回调的最短延迟时间(<a href="#sp1">注1</a>)，也就是说回调执行的时间可能不是编码者希望它执行的时间。timers的回调函数会按照之前定义的时间之后执行；但是，I/O操作或者是其他正在进行的回调可能会导致timers的回调执行时间延后。

**NOTE:技术上来看，poll阶段决定了何时timers回调被执行。**

比如说，你设置了一个在100ms后执行的函数，然后你的脚本开始做异步的读取一个文件的任务耗时95ms：

```javasciprt
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

当事件循环进入到poll阶段时，还是一个空的poll队列(fs.readFile()还没有能够完成)，所以poll队列会等待一段时间直到最快的那个完成。当95ms之后，fs.readFile()结束了读取文件的操作，而他的回调函数被加入到poll队列中执行。当这个fs的回调函数结束后，poll队列清空，事件循环会去查看Timers队列中最新的定时器(timer)回调(<a href="#sp2">注2</a>)，然后去执行它。在这个例子中，你会发现从定时器被设置到他的回调被执行，这个过程共105毫秒。

**NOTE:为了预防poll阶段一直占用事件循环，[libuv](http://libuv.org)(<a href="#sp3">注3</a>)也有最大的执行上限(上限数取决于操作系统)**

### I/O callbacks

这个阶段会执行一些系统操作的回调函数，例如tcp的错误回调。举个例子，如果一个TCP链接在尝试连接时，接收到了<span style="background:#eee;">ECONNREFUSED</span>，一些*nix系统想要去上报这个错误。这个信息的回调就会被加入到I/O callbacks队列中，到I/O callbacks阶段就会去执行。

### poll

poll阶段有两个主要的功能：

1.为已经达到延迟时间的timer执行脚本操作(译者:根据个人理解，是将到达时间的定时器回调加入到对应的队列中去，如setTimeout进入timer);
2.处理poll队列中的事件;

当事件循环进入到poll阶段并且没有timers安排时，下面两件事有一件会触发:

- 如果poll队列不为空，那么事件循环将同步按队列顺序执行直到队列为空，或者达到系统支持的上限为止
- 如果poll队列为空，下面两件事有一件会触发:
  - 如果是setImmediate()中设置，那么事件循环会结束poll阶段并且去check阶段执行在setImmediate中设置的脚本
  - 如果不是setImmediate()中设置，那事件循环会等待回调加入队列，并立即执行他们

一旦poll队列为空，事件循环将去检测是否有timers达到时间。如果有一个或多个timers准备好，事件循环就会到Timers阶段去执行这些定时器回调。

### check

这个阶段允许编码者设置在poll阶段完成后立即执行的回调。如果poll阶段空闲并且setInmmediate任务被推入队列中，事件循环可能不会一直等待而会进入check阶段。

setImmediate()实际上是一个特殊的运行在事件循环中另一个阶段的定时器(timer)。它使用了libuv的API，专职于poll阶段结束后的回调。

通常来说，随着代码被执行，事件循环最后会到poll阶段等待连接或者请求等等。但是如果有一个setImmediate的回调进入队列并且poll阶段队列空闲，那么事件循环会进入check阶段。

### close callbacks

如果有一个连接或者处理被关闭，'close'事件就会在这个阶段触发。要不然它就会通过process.nextTick()弹出。

## setImmediate VS setTimeout

setImmediate和setTimeout很相似，但是他们被调用的方式是不一样的:

- setImmediate()被设计成一旦poll阶段完毕后就去执行setImmediate的回调
- setTimeout()中的回调会有延迟时间的要求，也就是说至少要在最少延迟时间后才能执行。

这两个timer的执行顺序取决于他们的调用上下文环境。如果都是在主模块中调用，那么执行的先后时间，取决于进程的性能(它可能会被这个机器上的其他应用影响)。

举个例子，如果我们运行这段没有放在I/O操作内部的代码(也就是主模块环境中)，那么他们俩的执行顺序是不确定的，也就是说顺序是由性能情况决定的:

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

但是，如果你将这两个调用放置到一个I/O处理中，immediate回调永远会先执行:

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

使用setImmediate相对于setTimeout的主要优势是，如果执行环境在一个I/O处理中的话，setImmediate会一直在任何定时器之前执行，和当前有多少个定时器没关系。

## process.nextTick()

### 理解process.nextTick()

你可能注意到了process.nextTick()虽然是一个异步的API但是并没有出现在这个图里。这是因为process.nextTick()并不是事件循环中的一部分。换句话来说，不论当前处于事件循环的哪个阶段，nextTickQueue都会在当前操作完成后执行。

回过头看我们的图，在一个给定的阶段中任何时间你调用process.nextTick()，<b>process.nextTick中的回调都会在事件循环切入到下一个阶段前完成</b>。需要注意的是，如果process.nextTick递归执行的话，那么事件循环将无法进入到poll阶段，会使I/O被阻塞，这样一来就会出现一些bug。。

### 为什么这种情况会被node.js容许呢？(译者注:代指上述的process.nextTick特性，可能阻塞事件循环)

为什么在node.js里面会有process.nextTick这样的东西呢？一部分原因是整体的设计思路，无论哪里一个API应该一直是异步处理，即便它实际上并不需要这么做。下面一个示例片段:

```javascript
function apiCall(arg, callback) {
  if (typeof arg !== 'string') {
    return process.nextTick(callback, new TypeError('arguments should be a string'))
  }
}
```

这段代码在做实参的校验，如果不正确，它会将错误的上报信息传递给回调函数。这个API在node.js最近的更新中已经支持了新的特性，process.nextTick()中回调函数后的所有参数，都会作为回调函数的实参传入，所以不再需要去嵌套函数传参了。

我们做的事儿，其实是想告诉用户出错了，但是我们仍然允许用户的剩余代码继续执行。通过使用process.nextTick()，我们保证了apiCall()的回调函数代码永远执行，并且在事件循环开始前执行。为了实现这样的思路，js调用栈中会立即执行我们递归待用process.nextTick()时的回调函数，永远不会出现RangeError: Maximum call stack size exceeded(超过) from v8。

这样的思路可以解决一些潜在的问题，例如:

```javascript
let bar;

// 这里虽然是个异步函数的标志，但是实际上是同步调用的。。
function someAsyncApiCall(callback) { callback() }

// 这个回调在 someAsyncApiCall 完成之前被调用了。
someAsyncApiCall(() => {
  // 因为 someAsyncApiCall 已经结束，bar却还没能赋值
  console.log('bar', bar); // undefined
})

bar = 1;
```

用户定义了someAsyncApiCall()一个有异步标志的函数，但是它实际的操作时同步的。因为someAysncApiCall()实际上没有做什么异步操作，所以当它被调用时，提供给它的回调函数callback，会和someAysncApiCall()在事件循环同一阶段被调用。所以结果就是，由于callback被调用时，整体代码没跑完，callback输出bar的值为undefined。

通过将回调函数放到process.nextTick()中，剩余的代码将会跑完，无论什么变量，同步函数操作，都会在回调函数前完成。这是不允许事件循环进入其他阶段的好处(译者注:就是将代码真正异步化，又不影响事件循环的后续执行)。在事件循环继续之前，它会向用户上报错误。这是上个例子在使用process.nextTick()后的代码:

```javascript
let bar;

function someAsyncApiCall(callback) {
  process.nextTick(callback);
}

someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});

bar = 1;
```

这是另一个真实的例子:

```javascript
const server = net.createServer(() => {}).listen(8080);

server.on('listening', () => {});
```

当仅有一个端口传递时，很快就能执行。所以'listening'回调会被立即调用。问题在于.on('listening')回调可能没设置上。(译者注:node.js底层的机制面临这样的挑战。)

为了避免这个问题，'listening'事件会被加入到nextTick()队列中，保证这段代码可以完成。这样就允许用户设置他们想要的任意事件处理回调函数了。

### process.nextTick() vs setImmediate()

对用户来说，这两个API调用方式类似，名称很容易混淆。

- process.nextTick()在同一阶段理解执行
- setImmediate在事件循环接下来的迭代或者直接(译者注:还记得上面说过的poll队列为空的情况么~)执行

从本质上来说，这两个名字应该交换过来，process.nextTick居然比setImmediate执行还要快，但这是一个历史遗留问题，很难修改过来了。当npm的包被大量下载，每天都有新的模块增加，这些都是我们修复这个问题的潜在风险。尽管他们容易混淆，但名字应该不会改正了。(todo:为什么不适用新的名称呢？替代这两个名称，来达到渐进式的修复)

我们倡导开发者在所有场景使用setImmediate()，因为它更容易排查。(并且它可以使代码的跨端兼容性更好，更广阔，如兼容浏览器js)

## 为什么使用process.nextTick?

有主要两个原因:

1.允许用户在事件循环继续进行之前，处理上报的错误，清理不需要的资源，或者重试请求等等。
2.有时候，我们需要允许回调函数在调用栈结束后事件循环继续执行之前执行。(译者注：如上述apiCall例子。)

有个和用户期望匹配的例子:

```javascript
const server = net.createServer();
server.on('connection', conn => {});

server.listen(8080);
server.on('listening', () => {});
```

之前说过listen()运行在事件循环开始之前，但是listening回调被放在了setImmediate()中(译者注:这个地方有误，listening其实在process.nextTick里)。除非传入主机名，绑定端口的操作才会立刻执行。因为事件循环开始时，一定是在poll阶段的，那样的话，在listening回调触发之前，connection回调有机会被触发。(译者注:connection也是在poll阶段进行的。)

另一个例子是在继承自EventEmitter的构造函数中调用一个event:

```javascript
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);
  this.emit('event');
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

实际上你并不能从构造函数中发出event，因为但没有执行到分配给event回调的时候。所以如果想要在构造函数内部调用event，可以使用process.nextTick()设置一个回调去调用event:

```javascript
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);

  // 一旦handler被设置后，使用nextTick发射事件
  process.nextTick(() => {
    this.emit('event');
  });
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

注解：

<span id="sp1">1.HTML5标准规范为4ms，即setTimeout(fn, n) {n < 4? (n = 4) : n}，可参考setTimeout method 定义的第5条。</span>
<span id="sp2">2.这里的回调是指，timer到达设定时间后，会将自身的回调压入timers队列中等待。</span>
<span id="sp3">3.libuv是实现node.js异步操作的底层C语言依赖包</span>
