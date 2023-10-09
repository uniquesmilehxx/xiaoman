import { track, trigger } from "./effect.js";

// 判断深层次
const isObject = (target) => {
  return typeof target !== null && typeof target == "object";
};

export const reactive = (target) => {
  return new Proxy(target, {
    // 拦截一些操作，如 get set deleteProperty ownKeys apply 等

    // get
    get(target, key, receiver) {
      // receiver 其实就是 target，它的存在是为了保证上下文不错乱
      const res = Reflect.get(target, key, receiver);

      // 在这做依赖收集（当前层级）
      track(target, key);

      // 深层次递归依赖收集
      if (isObject(res)) {
        return reactive(res);
      }

      return res;
    },

    // set
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);

      // 在这触发更新
      trigger(target, key);

      return res;
    },
  });
};
