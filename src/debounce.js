// https://github.com/mqyqingfeng/Blog/issues/22

function debounce(fn, wait, immediate) {
  var timer = null;
  const debounced =  function(...args) {
    clearTimeout(timer)
    const context = this;
    if(immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if(callNow) {
        fn.apply(context, args)
      }
    } else {
      timer = setTimeout(function() {
        fn.apply(context, args)
      }, wait);
    }
  }
  debounced.cancel = function() {
    clearTimeout(timer)
    timer = null
  }
  return debounced;
}