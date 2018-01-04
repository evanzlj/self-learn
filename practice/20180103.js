/**
 * 二叉树实现(B-Tree)
 *
 *
 **/
function TreeNode(val) {
  this.val = val || null;
  this.left = null;
  this.right = null;
}
function Tree() {
  this.head = null;
}
Tree.prototype = {
  add() {},
  has() {},
  clean() {
    this.head = null;
  },
  insert() {},
  remove() {},
  removeAt() {},
}

/**
 * 背包九讲之01背包
 * input:  N件物品 容量为V的背包 放入第i件物品耗费的空间为Ci 得到的价值为Wi
 * output: 最优价值
 *
 * @param {number} N 物品数量
 * @param {number} V 容量
 * @param {array} C 空间数组
 * @param {array} W 价值数组
 *
 * @return {number}
 **/
function bags01(N, V, C, W) {
  if (typeof N === 'number'
      && typeof V === 'number'
      && C instanceof Array
      && W instanceof Array){
    throw new Error('Arguments must be number / number / array /array')
  }
  let arr = [], i, j, a, b;
  for (i = 0; i <= N; i++) {
    arr[i] = []
  }
  for (i = 0; i <= N; i++) {
    for (j = 0; j <= V; j++) {
      if (i === 0 || j === 0) {
        arr[i][j] = 0
      }
      else if (C[i - 1] <= V) {
        arr[i][j] = arr[i - 1][V - C[i - 1]] + W[i - 1]
      }
      else {
        a = arr[i - 1][j];
        b = arr[i][j - 1];
        arr[i][j] = a > b? a: b;
      }
    }
  }
  return arr[N][V];
}

/**
 * 背包九讲之
 *
 **/
