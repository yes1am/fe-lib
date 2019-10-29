const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function PPromise (fn) {
  this.state = PENDING
  this.value = null
  this.resolvedCallback = []
  this.rejectedCallback = []

  // function resolve (val) {
  //   if (this.state === PENDING) {    this 为 global
  //     this.state = RESOLVED
  //     this.value = val
  //   }
  // }
  // 因为最终 resolve() 是直接调用的， this 指向全局 global， 而不是 PPromise 实例
  // 所以需要使用 箭头函数 this 绑定到 PPromise实例上
  const resolve = (val) => {
    setTimeout(() => { // 使用 setTimeout 使得 .then 的代码异步执行
      if (this.state === PENDING) {
        this.state = RESOLVED
        this.value = val
        this.resolvedCallback.map(v => v(this.value))
      }
    }, 0)
  }

  const reject = (err) => {
    setTimeout(() => {
      if (this.state === PENDING) {
        this.state = REJECTED
        this.value = err
        this.rejectedCallback.map(v => v(this.value))
      }
    }, 0)
  }

  fn(resolve, reject)
}

PPromise.prototype.then = function (onFulfilled, onRejected) {
  const newPromise = new PPromise((resolve, reject) => {
    const isOnFulFilledFun = typeof onFulfilled === 'function'
    const isOnRejectedFun = typeof onRejected === 'function'

    console.log(onFulfilled.toString(), this.state)

    function resolutionProcess (promise, x, resolve, reject) {
      // 防止循环引用
      // const p1 = new Promise((resolve, reject) => {
      //   resolve(1)
      // })
      // const p = p1.then(res => {
      //   return p
      // })
      if (promise === x) {
        return reject(new TypeError('Error'))
      }

      // 如果还是 返回值是 Promise 则取 Promise resolve之后的值
      if (x instanceof PPromise) {
        console.log('#######')
        x.then(res => {
          resolve(res)
          // resolutionProcess(promise, res, resolve, reject)
        }, reject)
      }

      resolve(x)

      // 有待理解
      // let called = false
      // if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      //   try {
      //     const then = x.then
      //     if (typeof then === 'function') {
      //       then.call(
      //         x,
      //         y => {
      //           if (called) return
      //           called = true
      //           resolutionProcess(promise, y, resolve, reject)
      //         },
      //         e => {
      //           if (called) return
      //           called = true
      //           reject(e)
      //         }
      //       )
      //     } else {
      //       resolve(x)
      //     }
      //   } catch (e) {
      //     if (called) return
      //     called = true
      //     reject(e)
      //   }
      // } else {
      //   resolve(x)
      // }
    }

    if (isOnFulFilledFun && this.state === RESOLVED) {
      try {
        const value = onFulfilled(this.value)
        resolutionProcess(newPromise, value, resolve, reject)
      } catch (e) {
        reject(e)
      }
    }
    if (isOnRejectedFun && this.state === REJECTED) {
      try {
        const value = onRejected(this.value)
        resolutionProcess(newPromise, value, resolve, reject)
      } catch (e) {
        reject(e)
      }
    }

    if (this.state === PENDING) {
      if (isOnFulFilledFun) {
        this.resolvedCallback.push(() => {
          try {
            const value = onFulfilled(this.value)
            resolutionProcess(newPromise, value, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (isOnRejectedFun) {
        try {
          const value = onRejected(this.value)
          resolutionProcess(newPromise, value, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }
    }
  })

  return newPromise
}

// // const p = new PPromise((resolve, reject) => {
// //   // reject(1)
// //   console.log(123)
// //   resolve(456)
// // })

// // p.then(res => {
// //   console.log('res', res)
// // }, err => {
// //   console.log('err', err)
// // })
// // console.log(789)

// // p.then(res => {
// //   console.log('res2', res)
// // })

// // new Promise((resolve, reject) => {
// //   console.log(123)
// //   resolve(456)
// // }).then(res => {
// //   console.log(res)
// // })
// // console.log(789)
// // 123, 789, 456

// new PPromise((resolve, reject) => {
//   console.log(123)
//   resolve(456)
// }).then(res => {
//   console.log(res)
// })
// console.log(789)
// // 123, 789, 456

// // new PPromise((resolve, reject) => {
// //   console.log(123)
// //   resolve(456)
// // }).then(res => {
// //   console.log(res)
// // })
// // console.log(789)
// // 123, 789, 456

console.log('@@', new PPromise((resolve, reject) => {
  // console.log(123)
  resolve(456)
}).then(res => {
  // console.log('res1', res)
  const a = new PPromise((resolve, reject) => {
    resolve('rrr')
  })
  // setTimeout(() => {
  //   console.log(a.resolvedCallback.toString())
  // }, 200)
  // console.log('!!!', a)
  return a

  // return 789
  // console.log(res)
}))

// new PPromise((resolve, reject) => {
//   console.log(123)
//   resolve(456)
// }).then(res => {
//   console.log('res1', res)
//   const a = new PPromise((resolve, reject) => {
//     resolve('rrr')
//   })
//   // setTimeout(() => {
//   //   console.log(a.resolvedCallback.toString())
//   // }, 200)
//   console.log('!!!', a)
//   return a

//   // return 789
//   // console.log(res)
// })
//   .then(res => {
//     console.log('res2', res)
//   })

// const p1 = new Promise((resolve, reject) => {
//   resolve(1)
// })

// const p = p1.then(res => {
//   return p
// })
