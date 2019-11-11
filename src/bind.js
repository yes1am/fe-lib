// https://github.com/mqyqingfeng/Blog/issues/12

Function.prototype.fakeBind = function(...args) {
  const context = args[0];
  const bindArg = args.slice(1);   // when bind function, we may pass arguments
  const fn = this;   // this is a Function instance

  if (typeof this !== "function") {
    throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
  }

  const boundFun = function(...arg) {
    let newContext = context;
    if(this instanceof boundFun) {
      // it means boundFun used as a constructor
      newContext = this;
    }

    return fn.apply(
      newContext,
      [].concat(bindArg,arg))    // if [fn] has return value, we should return the value 
  }

  function NOOP() {}  // use the NOOP function, when we set boundFun.prototype.*** = ***, wont change this.prototype
  NOOP.prototype =  this.prototype;  // if this's prototype has some method or property, we should copy them 
  boundFun.prototype = new NOOP();

  return boundFun;
}

// const name = 'global name'
// const foo = {
//   name: 'foo name'
// }

// const bar = {
//   name: 'bar name',
//   say(age,sex) {
//     console.log(`name: ${this.name}, age: ${age}, sex: ${sex}`);
//   }
// }

// test code

// const newSay = bar.say.bind(foo,10);
// newSay('male')

// const newSay = bar.say.fakeBind(foo,10);
// newSay('male')

// test constructor
var value = 2;
var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.fakeBind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin