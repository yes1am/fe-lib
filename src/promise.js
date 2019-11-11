const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

class PPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = null;
    this.error = null;
    this.onResolvedCallback = []
    this.onRejectedCallback = []
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    executor(this.resolve, this.reject)
  }
  resolve(value) {
    setTimeout(() => {
      if (this.state === PENDING) {
        this.state = RESOLVED;
        this.value = value;
        this.onResolvedCallback.forEach(fun => {
          fun(this.value)
        })
      }
    }, 0);
  }
  reject(error) {
    setTimeout(() => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.error = error;
        this.onRejectedCallback.forEach(fun => {
          fun(this.error)
        })
      }
    }, 0);
  }
  then(onFulFilled, onRejected) {
    const newPromise = new PPromise((resolve, reject) => {
      onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : v => v
      onRejected = typeof onRejected === 'function' ? onRejected : r => {
        throw r
      }
      if (this.state === RESOLVED) {
        try {
          const returnValue = onFulFilled(this.value)
          this.resolutionProcedure(newPromise,returnValue,resolve,reject)
        } catch (error) {
          reject(error)
        }
      }
      if (this.state === REJECTED) {
        try {
          const returnValue = onRejected(this.error)  
          this.resolutionProcedure(newPromise,returnValue,resolve,reject)
        } catch (error) {
          reject(error)
        }
      }

      if (this.state === PENDING) {
        this.onResolvedCallback.push(() => {
          try {
            const returnValue = onFulFilled(this.value)
            this.resolutionProcedure(newPromise,returnValue,resolve,reject)
          } catch (error) {
            reject(error)
          }
        })
        this.onRejectedCallback.push(() => {
          try {
            const returnValue = onRejected(this.error)
            this.resolutionProcedure(newPromise,returnValue,resolve,reject)
          } catch (error) {
            reject(error)
          } 
        })
      }
    })
    return newPromise;
  }
  resolutionProcedure(promise,x,resolve,reject) {
    let then = null;
    let isCalled = false;

    // 防止循环引用
    if(x === promise) {
      return reject(new TypeError('Error'))
    }

    // 如果 x 是 thenable 对象, 那么将 x.then 的结果，再进行处理
    if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
      try {
        then = x.then
        if (typeof then === 'function') {
          then.call(x, function rs(y) {
            if (!isCalled){
              isCalled = true;
              this.resolutionProcedure(promise, y, resolve, reject)
            }
          }, function rj(r) {
            if(!isCalled) {
              isCalled = true;
              reject(r)
            }
          })
        } else {
          resolve(x)
        }
      } catch(e) {
        if(!isCalled) {
          isCalled = true;
          reject(e)
        }
      }
    } else {
      resolve(x)
    }
  }
  catch(onRejected) {
    return this.then(null,onRejected)
  }
  // 当取值时进行调用
  valueOf() {
    return this.value;
  }
}

PPromise.resolve = (value) => {
  return new PPromise((resolve, reject) => {
    resolve(value)
  })
}

PPromise.reject = (value) => {
  return new PPromise((resolve, reject) => {
    reject(value)
  })
}

PPromise.race = (promises) => {
  return new PPromise(function(resolve, reject) {
    for (var i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(function(value) {
        return resolve(value)
      }, function(error) {
        return reject(error)
      })
    }
  })
}

PPromise.all = (promises) => {
  return new PPromise(function(resolve, reject) {
    const promiseLen = promises.length;
    let resolvedCount = 0;
    const result = [];

    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(function(value) {
        result[i] = value;
        resolvedCount++;
        if(resolvedCount === promiseLen) {
          resolve(result)
        }
      }, function(error) {
        reject(error)
      })
    }
  })
}