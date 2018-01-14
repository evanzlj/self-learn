# 总结js代码执行机制

之前笔者翻译了两篇文章，对node下的事件循环机制有了一定的了解，对浏览器下的任务队列、微观任务队列也有了一定的了解。现在放空大脑，笔者会以自己的视角，解释js代码执行的机制。主要是node.js下的机制，需要好好解释下，毕竟花样比浏览器多些。

## 结论:

先说结论，在js运行的环境(chrome浏览器、node.js)中，总是有两个队列：

1.任务队列(在node.js中更多是概念存留)

2.微观任务队列

切记，是至少有2个队列，不同的任务可能还有自己的队列，比如 timer ，如果delay相同，总是按顺序执行定时器内容。

总是有事件循环机制，来处理队列任务的执行顺序。

事件循环机制在不同的宿主环境内，作用不太一致：

1.在chrome中，事件循环负责调度任务队列和微观任务队列的执行。

2.在node.js中，事件循环负责调度任务队列的执行，并分成了6个阶段来执行不同种类的任务队列。微观任务由v8来解释、执行，如promise.then。

不论在哪个宿主环境，微观任务的执行总是在满足下面两个条件的情况下发生：

1.当前任务(切记事件回调函数也是一个任务呐！)处于结束阶段。

2.js执行栈内没有正在处理的js代码。

这张图代表了node.js下的执行机制:

![task&microtask&tick callback](https://github.com/evanzlj/self-learn/blob/dev/note/js_deep/imgs/task_micro_tick.jpeg)

## 正文:

笔者经历的面试过程中，有一个反复被问到的问题:

> setTimeout / setImmediate / process.nextTick / Promise.then 执行顺序是什么样子呀？

例如:

```JavaScript
setTimeout(() => {
  console.log('timeout')
}, 0)

setImmediate(() => {
  console.log('immediate')
})

Promise.resolve().then(() => {console.log('promise.then')})

// tick queue
process.nextTick(() => {
  console.log('process.nextTick')
})
```

答案是:

```bash
$ process.nextTick
$ promise.then
$ timeout
$ immediate
```

请解释下，为什么是这样输出呢？

### 阐述过程:

这段代码的运行环境9成是node.js下。(process.nextTick属于node.js下的API)

1.node启动一个主线任务 Run Script ，运行js代码，将执行内容放到JS执行栈中；
2.执行到setTimeout，会将它加入到node初始化的Timer容器中计时等待，虽然DELAY为0，但Timer内部默认最少为1；
3.执行到setImmediate，将它放到事件循环中的check队列中等待；
4.执行到promise.then()，将它派发的微观任务放入到微观任务队列中；
5.执行到process.nextTick()，将它放入到TickQueue中，该队列会在任务结束前，js执行栈为空时，先于微观任务，直接顺序执行；
6.主线任务 Run Script 处于结束阶段，执行栈清空，TickQueue 中的 Tick callback 首先加入执行栈执行，输出 process.nextTick；
7.Tick callback 出栈，执行栈再次为空，开始执行微观任务队列中的任务，promise.then callback 进栈执行，输出 promise.then；
8.promise.then callback 出栈，微观任务队列为空，而另一方面Timer容器中计时早已到达最少延迟时间，setTimeout(fn, 0)进入到事件循环的 timers 阶段队列中；
9.事件循环按阶段开始运行，首先进入到了 timers 阶段，setTimeout callback 进栈执行，输出 timeout ；
10.完毕后，事件循环继续进行，直到 check 阶段，开始执行 check 阶段的任务队列，setImmediate callback 进栈执行，输出 immediate;
11.完毕后，js执行栈清空，事件循环停止。


而实际上，在 Run script 任务结束的阶段，任务的分布是这样的:

![任务分布示意图](https://github.com/evanzlj/self-learn/blob/dev/note/js_deep/imgs/cur_queue.jpeg)

所以答案就是 process.nextTick promise.then timeout immediate

timeout 和 immediate 输出不固定的问题，在本题中几乎不会存在，因为 process.nextTick 和 promise.then 的执行，已经足够将进程初始化 Timer 的事件问题忽略不计了。

**现在 node.js 内的 js 任务执行机制就总结完毕了。而浏览器内的问题只需要对照[任务队列、微观任务队列及执行机制](https://github.com/evanzlj/self-learn/blob/dev/note/js_deep/%5B%E8%AF%91%5D%E4%BB%BB%E5%8A%A1%E9%98%9F%E5%88%97%E3%80%81%E5%BE%AE%E8%A7%82%E4%BB%BB%E5%8A%A1%E9%98%9F%E5%88%97%E5%8F%8A%E6%89%A7%E8%A1%8C%E6%9C%BA%E5%88%B6.md)一文即可。**

## 尾：

有任何问题，请直接email=> linjun911@gmail.com，如有帮助，star个呗~
