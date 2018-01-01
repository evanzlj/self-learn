# 获取两个升序数组中第N大的值

## 题目描述：

现有两个数组a、b，均为升序数组(e.g. [1,2,3,4,5,6])，找出第n大的值。

要求空间复杂度除了a,b两个给定的数组外，为O(1)，时间复杂度为O(n).

### input：

```
a = [1,2,3,4,5,6];
b = [5,6,7,9,10];
n = 4
getNLarge(a, b, n)
```

### output：

```
result : 6
```

## 题目分析：

本身这个问题不难，解决方案采用指针即可，考察的地方在于：

1.边界情况处理(指针是否超长)；
2.输入值的验证；
3.遍历时重复的值的过滤；

编码时只要思考到上述三点

## 代码及注释

```js
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
```

## 总结启示

其实本题没有什么特别的困难，仅仅是一个简单题，但是其中的道道需要好好思辨

1.无论何时，保证你的代码健壮性，输入验证要清晰。
2.在收集需求(面试的问题也一样是需求收集)过程中，写好自己的边界条件，想清楚再动键盘。

我是红烧肉，每个人的思维方式不同，希望求同存异，共同进步~，如果有不对之处，也请多多指教~
