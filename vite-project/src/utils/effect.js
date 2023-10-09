// 1、effect 的实现

// 使用一个全局变量收集当前副作用函数，并且在初始化的时候调用一下
let activeEffect;

// 写法1
// export const effect = (fn) => {
//   const _effect = function () {
//     // 收集
//     activeEffect = _effect;
//     fn();
//   };

//   // 首次调用
//   _effect();
// };

// 写法2：兼容 computed (有返回值的情况)
// interface Options {
//   scheduler?: Function
// }
export const effect = (fn, options) => {
  const _effect = function () {
    // 收集
    activeEffect = _effect;
    let res = fn();
    return res;
  };

  // 将调度函数挂在 _effect 上
  _effect.options = options;

  // 首次调用
  _effect();

  return _effect;
};

// --------------------------------------------------------------

// 2、track(object, key) 的实现：收集依赖

// 副作用订阅将被存储在一个全局的 WeakMap<target, Map<key, Set<effect>>> 数据结构中

// 实现如下数据结构的存储

/**
 *     ____________________________________________________________
 *    |_____________________targetMap(WeakMap)____________________|
 *
 *          |                              |
 *         丨key                           | value
 *         |                       _______|___________________
 *    {name: '小满',age: 18}       |_________new Map()________|
 *                                  |          |
 *                                  | key      | value
 *                                  |          |
 *                                name       new Set()
 *                                              |
 *                                              |
 *                                              |
 *                                          effect, effect...
 *
 */

// WeakMap 的 key 要求是一个 object
const targetMap = new WeakMap();

// 这里的 target 刚好就是 object，所以将这里的 object 当做 targetMap 的 key 收集起来
export const track = (target, key) => {
  // 获取 target 对应的 value 值
  let depsMap = targetMap.get(target);

  // 第一次的时候是没有这个值，取不到的
  if (!depsMap) {
    // 手动赋值为 new Map()
    depsMap = new Map();
    // 并且填充进 targetMap
    targetMap.set(target, depsMap);
  }

  // 以上 已经将第一层数据结构组装完成，接下来继续往下

  // 获取 depsMap 对应的 value 值
  let deps = depsMap.get(key);
  // 第一次仍然是获取不到的
  if (!deps) {
    // 手动赋值为 new Set()
    deps = new Set();
    // 并且填充进 depsMap
    depsMap.set(key, deps);
  }

  // 以上 把第二层数据也填充好了，接下来添加副作用

  deps.add(activeEffect);
};

// ------------------------------------------------------------------

// 3、trigger(object, key) 的实现：更新依赖

// 从 track 中定义好的数据结构中逐层取出（weakMap -> Map -> Set）
export const trigger = (target, key) => {
  // 从 targetMap（weakMap结构） 中取出 depsMap （Map结构）
  const depsMap = targetMap.get(target);

  // 取出 deps （Set结构）
  const deps = depsMap.get(key);

  // Set循环，里面是一个个副作用的函数体 activeEffect，调用一下即可
  deps.forEach((effect) => {
    // 调度函数也要调用一下
    if (effect?.options?.scheduler) {
      effect?.options?.scheduler?.();
    }

    effect();
  });
};
