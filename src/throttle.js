// https://github.com/mqyqingfeng/Blog/issues/26
// use timestamp
function throttle(fn, wait) {
  let previous = 0;
  return function(...args) {
    const context = this;
    const now = Date.now()
    if(now - previous > wait) {
      fn.apply(context,args)
      previous = now;
    }
  }
}

// use setTimeout
function throttle(fn, wait) {
  let timer = null;
  return function(...args) {
    const context = this;
    if(!timer) {
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      fn.apply(context, args)
    }
  }
}
