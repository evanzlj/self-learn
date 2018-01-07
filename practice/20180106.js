/**
 * avl tree 自平衡二叉树
 */
class Node {
  constructor (key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}
/**
 * 自平衡二叉树的关键点在于插入和删除时，
 * 需要计算平衡，努力成为一颗完整二叉树
 */
class AVL {
  constructor () {
    this.head = null;
  }
  insert (key) {
    // 插入
    function _insert(node, key) {
      if (node === null) {
        node = new Node(key)
        return node
      }
      // 判断
      if (node.key > key) {
        node.left = _insert(node.left, key)
        if (getH(node.left) - getH(node.right) > 1) {
          // 选择旋转策略
          if (node.left.key > key) {
            node = ll(node)
          }
          else {
            node = lr(node)
          }
        }
      }
      else {
        node.right = _insert(node.right, key)
        if (getH(node.right) - getH(node.left) > 1) {
          // 选择旋转策略
          if (node.right.key > key) {
            node = rl(node)
          }
          else {
            node = rr(node)
          }
        }
      }
      return node
    }
    this.head = _insert(this.head, key)
  }
  remove (key) {
    this.head = _remove(this.head, key);
    function _remove(node, key) {
      if (node === null) {
        return null
      }
      if (node.key > key) {
        node.left = _remove(node.left, key)
        return blance(node)
      }
      else if (node.key < key) {
        node.right = _remove(node.right, key)
        return blance(node)
      }
      else {
        var key = node.key;
        if (node.left && node.right) {
          var temp = min(node.right)
          node.key = temp.key
          node.right = _remove(node.right, temp.key)
        }
        else if (node.left) {
          node = node.left
        }
        else if (node.right) {
          node = node.right
        }
        else {
          node = null
        }
        return node
      }
    }
    function min(node) {
      while (node.left) {
        node = node.left
      }
      return node
    }
    function blance(node) {
      if (getH(node.left) - getH(node.right) > 1) {
        if (key > node.left.key) {
          node = lr(node)
        }
        else {
          node = ll(node)
        }
      }
      else {
        if (key > node.right.key) {
          node = rr(node)
        }
        else {
          node = rl(node)
        }
      }
      return node
    }
  }
}
// 获取树的高度
function getH(node) {
  if (node === null) {
    return -1
  }
  return Math.max(getH(node.left), getH(node.right)) + 1
}
/**
 * 通过分析，得出4种情况下，移动的方式
 */
// 最左侧的插入，导致超过平衡
function ll (node) {
  var a = node,
      b = node.left,
      c = node.left.right;
  a.left = c;
  b.right = a;
  return b;
}
// 最右侧的插入，导致超过平衡
function rr (node) {
  var a = node,
      b = node.right,
      c = node.right.left;
  a.right = c;
  b.left = a;
  return b;
}

// 左树下右节点的插入，导致超过平衡
function lr (node) {
  var a = node,
      b = node.left,
      c = node.left.right,
      d = node.left.right.left;
  b.right = d;
  c.left = b;
  a.left = c.right;
  c.right = a;
  return c;
}

// 右树下左节点的插入，导致超过平衡
function rl (node) {
  var a = node,
      b = node.right,
      c = node.right.left,
      d = node.right.left.right;
  a.right = c.left;
  c.left = a;
  b.left = d;
  c.right = b;
  return c;
}

var avl =  new AVL(5);
avl.insert(4);
console.log(avl.head);
avl.insert(3);
console.log(avl.head);
avl.insert(2);
console.log(avl.head);
avl.insert(1);
console.log(avl.head);
avl.insert(0);
console.log(avl.head);


avl.remove(4);
console.log(avl.head);
