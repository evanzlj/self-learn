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

左右:
            50
        30      60
    20      40
          35
  自平衡过程：
            50
        40     60
    30
20      35

          40
      30      50
   20    35       60
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
      b = node.left,
      c = node.left.right,
      d = node.left.right.left;
  a.left = c.right;
  b.right = c.left;
  c.left = b;
  c.right = a;
  return c
}
// 右右翻转
function rr (node) {
  var a = node,
      b = node.right;
  a.right = b.left;
  b.left = a;
  return b
}
// 右左翻转
function rl (node) {
  var a = node,
      b = node.right,
      c = node.right.left,
      d = node.right.left.right;
  a.right = c.left;
  b.left = c.right;
  c.left = a;
  c.right = b;
  return c;
}
// 平衡主函数
function balance(node, key) {
  if (getH(node.left) - getH(node.right) > 1) {
    if (node.left.key > key) {
      return ll(node)
    }
    else {
      return lr(node)
    }
  }
  else if (getH(node.right) - getH(node.left) > 1){
    if (node.right.key > key) {
      return rl(node)
    }
    else {
      return rr(node)
    }
  }
  return node
}
// 寻找树中最小节点
function min(node) {
  let result = node;
  while (result.left) {
    result = result.left
  }
  return result
}
class AVL {
  constructor (key) {
    this.head = new Node(key)
  }
  insert (key) {
    if (this.head.key === null) {
      this.head.key = key;
      return
    }
    this.head = _insert(this.head, key)
    function _insert(node, key) {
      if (!node) {
        return new Node(key)
      }
      if (node.key > key) {
        node.left = _insert(node.left, key)
      }
      else {
        node.right = _insert(node.right, key)
      }
      node = balance(node, key);
      return node
    }
  }
  remove (key) {
    if (this.head.key === null) {
      return
    }
    this.head = _remove(this.head, key)
    function _remove(node, key) {
      console.log(12312312)
      if (!node) {
        return null
      }
      if (node.key > key) {
        node.left = _remove(node.left, key)
      }
      else if (node.key < key) {
        node.right = _remove(node.right, key)
      }
      else {
        // 四种情况判断
        if (!(node.left && node.right)) {
          node = null
        }
        else if (node.left !== null) {
          node = node.right
        }
        else if (node.right !== null) {
          node = node.left
        }
        else {
          let temp = min(node.right)
          node.right = _remove(node.right, temp.key)
          node.key = temp.key
        }
        if (!node) return node
      }
      // 平衡树
      node = balance(node, key)
      return node
    }
  }
}
let avl = new AVL(1);
avl.insert(2);
avl.insert(3);
avl.insert(4);
avl.insert(5);
avl.insert(6);
console.log(avl.head)
console.log(getH(avl.head.left))
console.log(getH(avl.head.right))

avl.remove(6)
console.log(avl.head)
console.log(getH(avl.head.left))
console.log(getH(avl.head.right))
avl.remove(5)
console.log(avl.head)
console.log(getH(avl.head.left))
console.log(getH(avl.head.right))
