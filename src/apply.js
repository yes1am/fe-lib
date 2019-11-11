// https://github.com/mqyqingfeng/Blog/issues/11

Function.prototype.fakeApply = function(...args) {
  const context = args[0] || window;   // if the args[0] is null, we should regard [this] as the global
  const arg = args[1] || [];   // arg[1] should be array
  context.fn = this; // [this] is the function, like foo.sayName
  const result = context.fn(...arg);  // if [this] has return value, we should return the value
  delete context.fn;
  return result;
}

// test code
// const name = 'global name'

// const foo = {
//   name: 'foo name'
// }

// const bar = {
//   name: 'bar name',
//   say(...age) {
//     console.log(`name: ${this.name}, age: ${age}`);
//     return `i am the say function's returnValue`;
//   }
// }

// bar.say.apply(foo,[1,2,3])
// bar.say.fakeApply(foo,[1,2,3])