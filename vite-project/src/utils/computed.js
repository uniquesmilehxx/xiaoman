import { effect } from "./effect.js";
// 这里暂时只考虑传入函数(getter)的情况，不考虑选项式（get\set）
export const computed = (getter) => {
  let _value = effect(getter, {
    // 调度函数，依赖更新的时候需要一起调用的函数
    scheduler: () => {
      // 通过 _dirty 的值去判断依赖是否更新（_dirty = true 表示数据更新，即数据脏了）
      _dirty = true;
    },
  });

  let _dirty = true;
  let cacheValue;

  class ComputedRefImpl {
    get value() {
      // 如果数据脏了，要重新获取
      if (_dirty) {
        cacheValue = _value();
        _dirty = false;
      }
      return cacheValue;
    }
  }

  return new ComputedRefImpl();
};
