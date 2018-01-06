/**
 * 完成二叉树
 */
class Node {
  constructor (val) {
    this.val = val;
    this.right = null;
    this.left = null;
  }
}
class BTree {
  constructor () {
    this.head = null;
  }
  insert (val) {
    if (this.head === null) {
      this.head = new Node(val)
      return
    }
    _insert(this.head, val)
    function _insert (node, val) {
      if (node.val < val) {
        if (node.right) {
          _insert(node.right, val)
        }
        else {
          node.right = new Node(val)
        }
      }
      else {
        if (node.left) {
          _insert(node.left, val)
        }
        else {
          node.left = new Node(val)
        }
      }
    }
  }
  search (val) {
    var node = this.head;
    if (!node) {
      return false;
    }
    while (node.val !== val && node) {
      if (node.val > val) {
        node = node.left
      }
      else {
        node = node.right
      }
    }
    return Boolean(node)
  }
  inOrderTraverse (cb) {
    function _in (node, cb) {
      if (!node) {
        return
      }
      _in(node.left, cb);
      cb(node);
      _in(node.right, cb);
    }
    _in(this.head, cb)
  }
  preOrderTraverse (cb) {
    function _pre (node, cb) {
      if (!node) {
        return
      }
      cb(node);
      _pre(node.left, cb);
      _pre(node.right, cb);
    }
    _pre(this.head, cb)

  }
  postOrderTraverse (cb) {
    function _post (node, cb) {
      if (!node) {
        return
      }
      cb(node);
      _post(node.left, cb);
      _post(node.right, cb);
    }
    _post(this.head, cb)
  }
  min () {
    function _min (node) {
      if (!node.left) {
        return node.val
      }
      return _min(node.left)
    }
    return _min(this.head)
  }
  max () {
    function _max (node) {
      if (!node.right) {
        return node.val
      }
      return _max(node.right)
    }
    return _max(this.head)
  }
  remove (val) {
    root = _remove(this.head, val)
    function _remove (node, val) {
      if (!node) {
        return null
      }
      else if (node.val > val) {
        node.left = _remove(node.left, val)
        return node
      }
      else if (node.val < val) {
        node.right = _remove(node.right, val)
        return node
      }
      else {
        // 三种情况
        // 1.node是叶子节点
        if (!(node.left && node.right)) {
          return null
        }
        // 2.node是一颗子树的根结点
        else if (node.left && node.right) {
          let cur = min(node.right);
          node.val = cur.val;
          node.right = _remove(node.right, cur.val);
          return node
        }
        // 3.node只有一个分支
        else if (node.left === null) {
          return node.right
        }
        else {
          return node.left
        }
      }
    }
    function min(node) {
      while (node.right) {
        node = node.right
      }
      return node
    }
  }
}

/**
 * 26个字母转成二叉树
 */
function convertTree (arr) {
  if (!arr instanceof Array) {
    throw new TypeError('arr must be a array')
  }
  // 二叉树左子树公式为2n - 1
  // 二叉树右子树公式为2n
  var node = new Node(arr[0]);
  _convert(node, arr, 0);
  function _convert(node, arr, i) {
    if (2 * i > 26) {
      return null
    }
    node.left = new Node(arr[2 * i + 1])
    node.right = new Node(arr[2 * i + 2])
    _convert(node.left, arr, 2 * i + 1)
    _convert(node.right, arr, 2 * i + 2)
  }
  return node
}

convertTree('abcdefghijklmnopqursvwtyz'.split(''))

/**
 * 从n个数中，取2个值，和为m
 */
function get2num(m, arr, n) {
  var obj = {};
  for (var i = 0; i < n; i++) {
    obj[m - arr[i]] = arr[i]
    if (obj[arr[i]]) {
      return [obj[arr[i]], arr[i]]
    }
  }
}
