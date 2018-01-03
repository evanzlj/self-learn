# Nodejs事件循环(Event Loop)，定时器(Timers)以及process.nextTck()

原文地址为:(The Node.js Event Loop, Timers, and process.nextTick())[https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/]

## 什么是事件循环？

事件循环是在面对单线程的javascript编程语言时，实现Node.js非阻塞I/O的核心机制。尽可能的将操作安排到系统内核。

由于现代的内核都是多线程的，他们可以在后台处理多个操作的实施。当任何一个操作完成，这个内核就会通知Node.js，把对应的回调可能扔到poll队列中等待执行。我们会在下面的内容中去解释这块东东。

## 阐述事件循环

当Node.js启动时，他就会初始化事件循环，执行输入script内容，包括异步API调用、分配定时器或者调用process.nextTick()，然后开始执行事件循环。

接下来的图展示了一个简单描述了Event Loop的执行顺序：

![Event Loop](https://")
