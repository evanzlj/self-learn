/**
 * 平衡二叉树
 *
 * */
class Node {
  constructor (key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}
// 获取树的高度
/**


**/
function getH(node) {
  if (!node) {
    return -1
  }
  return Math.max(getH(node.left),getH(node.right)) + 1
}
// 左左翻转
function ll (node) {
  var a = node,
      b = node.left;
  a.left = b.right;
  b.right = a;
  return b
}
// 左右翻转
function lr (node) {
  var a = node,
      b = node.left;
  a.left = b.right;
  b.right = a;
  return b
}
// 右右翻转
function rr (node) {
  var a = node,
      b = node.right;
  a.right = b.left;
  b.left = a;
  return b
}
class AVL {
  constructor (key) {
    this.head = new Node(key)
  }
  add () {

  }
}
