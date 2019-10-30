const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function PPromise (fn) {
  this.state = PENDING
  this.value = null
  this.resolvedCallback = []
  this.rejectedCallback = []

  const resolve = (val) => {
    setTimeout(() => {
      if (this.state === PENDING) {
        this.state = RESOLVED
        this.value = val
        this.resolvedCallback.map(v => v(this.value))
      }
    }, 0)
  }

  const reject = (err) => {
    console.log('err', err)
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

const promises = []

PPromise.prototype.then = function (onFulfilled, onRejected) {
  // console.log('then', onFulfilled.toString())
  var newPromise = new PPromise((resolve, reject) => {
    const isOnFulFilledFun = typeof onFulfilled === 'function'
    const isOnRejectedFun = typeof onRejected === 'function'

    function resolutionProcess (promise, x, resolve, reject) {
      // 防止循环引用
      // const p1 = new Promise((resolve, reject) => {
      //   resolve(1)
      // })
      // const p = p1.then(res => {
      //   return p
      // })
      // if (promise === x) {
      //   return reject(new TypeError('Error'))
      // }

      // 如果还是 返回值是 Promise 则取 Promise resolve之后的值
      if (x instanceof PPromise) {
        x.then(resolve, reject)
      } else {
        resolve(x)
      }

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
        console.log(newPromise)
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
        this.rejectedCallback.push(() => {
          try {
            const value = onRejected(this.value)
            resolutionProcess(newPromise, value, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    }
  })

  promises.push(newPromise)

  // console.log('before return')
  return newPromise
}

new PPromise((resolve, reject) => {
  console.log('123')
  resolve('promise1')
}).then(res => {
  console.log('res1', res)
  return new PPromise((resolve, reject) => {
    resolve('promise2')
  })
}).then(res => {
  console.log('res2', res)
})

// const oldThen = Promise.prototype.then
// Promise.prototype.then = function (...args) {
//   console.log('then', args[0].toString())
//   const pro = oldThen.apply(this, args)
//   promises.push(pro)
//   return pro
// }
// new Promise((resolve, reject) => {
//   // console.log('123')
//   resolve('promise1')
// }).then(res => {
//   console.log('res1', res)
//   return new Promise((resolve, reject) => {
//     resolve('promise25')
//   })
// }).then(res => {
//   console.log('res2', res)
//   return '3'
// })
