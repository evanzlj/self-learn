// 树形结构总结
class Node {
  constructor(key) {
    this.key = key
    this.left = null
    this.right = null
  }
}
/**
 * B tree
 */
class BTree {
  constructor() {
    this.head = null
  }
  insert(key) {
    if (!this.head) {
      this.head = new Node(key)
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
      return node
    }
  }
  min() {
    let cur = this.head
    while (cur && cur.left) {
      cur = cur.left
    }
    return cur
  }
  max() {
    let cur = this.head
    while (cur && cur.right) {
      cur = cur.right
    }
    return cur
  }
  remove(key) {
    if (!this.head) {
      return
    }
    this.head = _remove(this.head, key)
    function min(node) {
      let cur = node
      while (cur && cur.left) {
        cur = cur.left
      }
      return cur
    }
    function _remove(node, key) {
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
        if (!(node.left && node.right)) {
          node = null
        }
        else if (node.left === null) {
          node = node.right
        }
        else if (node.right === null) {
          node = node.left
        }
        else {
          let temp = min(node.right)
          node = _remove(node, temp.key)
          node.key = temp.key
        }
      }
      return node
    }
  }
  inOrder(cb) {
    if (!this.head) {
      return null
    }
    function _in (node, cb) {
      if (!node) {
        return
      }
      _in(node.left, cb)
      cb && cb(node.key)
      _in(node.right, cb)
    }
    _in(this.head, cb)
  }
  preOrder(cb) {
    if (!this.head) {
      return null
    }
    function _pre (node, cb) {
      if (!node) {
        return
      }
      cb && cb(node.key)
      _pre(node.left, cb)
      _pre(node.right, cb)
    }
    _pre(this.head, cb)
  }
  postOrder(cb) {
    if (!this.head) {
      return null
    }
    function _post (node, cb) {
      if (!node) {
        return
      }
      _post(node.left, cb)
      _post(node.right, cb)
      cb && cb(node.key)
    }
    _post(this.head, cb)
  }
}
/**
 * AVL tree
 */
class AVL extends BTree {
  constructor () {
    super()
  }
  // 获取树高
  static const getH = (node) => {
    if (!node) {
      return -1
    }
    return Math.max(getH(node.left), getH(node.right)) + 1
  }
  // 左左单旋转
  static const ll = (node) => {
    let a = node,
        b = node.left;
    a.left = b.right;
    b.right = a;
    return b
  }
  // 左右双旋转
  static const lr = (node) => {
    let a = node,
        b = node.left,
        c = node.left.right;
    b.right = c.left;
    a.left = c.right;
    c.left = b;
    c.right = a;
    return c
  }
  // 右右单旋转
  static const rr = (node) => {
    let a = node,
        b = node.right;
    a.right = b.left;
    b.left = a;
    return b
  }
  // 右左双旋转
  static const rl = (node) => {
    let a = node,
        b = node.right,
        c = ndoe.right.left;
    a.right = c.left;
    b.left = c.right;
    c.left = a;
    c.right = b;
    return c
  }
  static const blance = (node, key) => {
    if (node === null) {
      return node
    }
    if (getH(node.left) - getH(node.rigth) > 1) {
      if (key > node.left.key) {
        node.left = lr(node.left)
      }
      else {
        node.left = ll(node.left)
      }
    }
    else if (getH(node.right) - getH(node.left) > 1) {
      if (key > node.right) {
        node.right = rr(node.right)
      }
      else {
        node.right = rl(node.right)
      }
    }
    return node
  }
  insert (key) {
    if (!this.head) {
      this.head = new Node(key)
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
      node = blance(node, key)
      return node
    }
  }
  remove (key) {

  }
}
/**
 * 红黑树
 */
 class RedBlack extends BTree {
   constructor () {
     super()
   }
   insert () {

   }
   remove () {

   }
 }
