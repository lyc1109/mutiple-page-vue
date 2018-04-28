/**
 * 规格sku操作
 * @author luoyc
 * @created 2018-04-26
 */

// 实现笛卡尔积 解法 一
const descarte = ((specArray = []) =>
  // 从第一组数组开始进行累加遍历
  specArray.reduce((total, currentValue) =>
    // 遍历每一组的数组情况,然后合并累加
    total.map((a) =>
      currentValue.map((b) =>
        a.concat(b)
      )
    ).reduce((total, currentValue) => total.concat(currentValue), []), [[]])
)

// 实现笛卡尔积 解法 二
const descarte2 = (specArray = []) => {
  if (!Array.isArray(specArray)) {
    return
  }

  let head = specArray.shift()
  if (Array.isArray(head) && specArray.length === 0) {
      return map((item) => [item], head)
  }

  let tailProduct = descarte(specArray)
  return flatMap(
    (item) => flatMap((items) => [[item, ...items]], tailProduct), head)
}

function concat(array) {
  return [].concat.apply([], array)
}

function map(fn, array) {
  return [].map.call(array, fn)
}

function flatMap(fn, array) {
  return concat(map(fn, array))
}

export default {
  descarte,
  descarte2
}
