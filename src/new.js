// https://github.com/mqyqingfeng/Blog/issues/13

function objectFactory(...args) {
  const Constructor = args[0];
  const arg = args.slice(1);
  const obj = new Object();
  const ret = Constructor.apply(obj,arg);
  obj.__proto__ = Constructor.prototype;
  // if return a object, use the object, else use the new Object()
  return typeof ret === 'object' ? ret : obj;
}

// function Otaku (name, age) {
//   this.name = name;
//   this.age = age;
//   this.habit = 'Games';
// }

// Otaku.prototype.strength = 60;

// Otaku.prototype.sayYourName = function () {
//   console.log('I am ' + this.name);
// }

// // var person = new Otaku('Kevin', '18');
// var person = objectFactory(Otaku,'Kevin', '18');

// console.log(person.name) // Kevin
// console.log(person.habit) // Games
// console.log(person.strength) // 60
// person.sayYourName(); // I am Kevin