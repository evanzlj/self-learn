// 快排 指针实现
function quickSort(arr) {
  return _quickSort(arr, 0, arr.length - 1)
}
function _quickSort(arr, l, r) {
  if (l >= r) {
    return
  }
  var i = partition(arr, l, r);
  _quickSort(arr, l, i-1)
  _quickSort(arr, i+1, r);

}
function partition(arr, l, r) {
  var temp = arr[l];
  var j = l;
  for (var i = j+1; i <= r; i++) {
    if (arr[i] < temp) {
      [arr[i], arr[j+1]] = [arr[j+1], arr[i]]
    }
  }
  [arr[l], arr[j]] = [arr[j], arr[i]]
  return j;
}
