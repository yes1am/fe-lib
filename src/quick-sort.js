function quickSort (arr) {
  if (arr.length <= 1) {
    return arr
  }

  const midIndex = Math.floor(arr.length / 2)
  const midValue = arr[midIndex]

  const leftArr = []
  const rightArr = []

  arr.forEach((item, index) => {
    if (index === midIndex) {
      return
    }
    if (item < midValue) {
      leftArr.push(item)
    } else {
      rightArr.push(item)
    }
  })

  return quickSort(leftArr).concat([midValue]).concat(quickSort(rightArr))
}

const arr = [85, 24, 63, 45, 17, 31, 96, 50]

const result = quickSort(arr)

console.log(result)
