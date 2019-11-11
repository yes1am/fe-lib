// https://github.com/mqyqingfeng/Blog/issues/32

function clone(obj,isDeep) {
  if(typeof obj !== 'object') {
    throw new Error('obj should be an object');
  }
  const newObj = obj instanceof Array ? [] : {};
  Object.keys(obj).forEach(key => {
    if(isDeep && typeof obj[key] === 'object') {
      newObj[key] = clone(obj[key])
    } else {
      newObj[key] = obj[key]
    }
  })

  return newObj;
}

const a = {
  a: 1,
  b: {
    c: 3
  }
}

// shallow
// const shallowCloneA = clone(a);
// a.b.c = 4;
// console.log(a,shallowCloneA);

// deep
// const deepCloneA = clone(a,true);
// a.b.c = 4;
// console.log(a,deepCloneA)