<template>
  <div>
    11_computed计算属性--------------------------------------------------
  </div>
  <div class="">
    firstName: <input type="text" v-model="firstName" />
    <br />
    lastName: <input type="text" v-model="lastName" />
    <br />
    fullName: {{ fullName }}
    <br />
    <button @click="change">设置fullName</button>
    <br />
    fullName2: {{ fullName2 }}
  </div>
  <hr />
  <div>
    <input
      type="text"
      v-model="keyword"
      placeholder="computed购物车案例——搜索"
      style="width: 400px"
    />
    <br />
    <table
      border
      width="500"
      cellspacing="0"
      cellpadding="0"
      style="margin-top: 10px"
    >
      <thead>
        <tr>
          <th>物品名称</th>
          <th>物品单价</th>
          <th>物品数量</th>
          <th>物品总价</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in searchData" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.price }}</td>
          <td>
            <!-- vue3支持多事件，逗号隔开 -->
            <button
              @click="item.num > 1 ? (item.num--, console.log('减')) : null"
            >
              -
            </button>
            {{ item.num }}
            <button @click="item.num < 99 ? item.num++ : null">+</button>
          </td>
          <td>{{ item.num * item.price }}</td>
          <td>
            <button @click="del(index)">删除</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>总价：{{ total }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";

/**
 * 一、支持两种定义形式：
 *
 * 1、选项形式：传入对象，对象内部有 get set函数
 */

const firstName = ref<string>("张");
const lastName = ref<string>("三");
const fullName = computed({
  // get 函数用于获取
  get() {
    return firstName.value + "-" + lastName.value;
  },
  // set 函数用于设置
  set(newVal) {
    // 数组的解构赋值
    [firstName.value, lastName.value] = newVal.split("-");
  },
});

const change = () => {
  fullName.value = "李-四";
};

/**
 * 2、函数形式：只读，不允许修改
 */

const fullName2 = computed(() => {
  return firstName.value + "***" + lastName.value;
});

// Cannot assign to 'value' because it is a read-only property
// fullName2.value = "王-五";

/**
 * 二、computed 购物车实战
 */

const keyword = ref<string>("");

interface Data {
  name: string;
  price: number;
  num: number;
}

// 原始数组
const data = reactive<Data[]>([
  {
    name: "小满的绿帽子",
    price: 100,
    num: 1,
  },
  {
    name: "小满的红衣服",
    price: 200,
    num: 1,
  },
  {
    name: "小满的黑袜子",
    price: 300,
    num: 1,
  },
]);

// 总价
const total = computed(() => {
  return data.reduce((pre, cur) => {
    return pre + cur.num * cur.price;
  }, 0);
});

// 删除
const del = (index: number) => {
  data.splice(index, 1);
};

// 搜索数组
const searchData = computed(() => {
  return data.filter((item) => item.name.includes(keyword.value));
});

/**
 *
 * 三、理解源码
 *
 * reactivity.cjs.prod.js 中搜索 function computed...
 * 
 * 
 * function computed(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    const onlyGetter = shared.isFunction(getterOrOptions);
    if (onlyGetter) {
      getter = getterOrOptions;
      setter = shared.NOOP;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
    return cRef;
  }

  class ComputedRefImpl {
    constructor(getter, _setter, isReadonly, isSSR) {
      this._setter = _setter;
      this.dep = void 0;
      this.__v_isRef = true;
      this["__v_isReadonly"] = false;
      this._dirty = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerRefValue(this);
        }
      });
      this.effect.computed = this;
      this.effect.active = this._cacheable = !isSSR;
      this["__v_isReadonly"] = isReadonly;
    }
    get value() {
      const self = toRaw(this);
      trackRefValue(self);
      if (self._dirty || !self._cacheable) {
        self._dirty = false;
        self._value = self.effect.run();
      }
      return self._value;
    }
    set value(newValue) {
      this._setter(newValue);
    }
  }
 */

/**
 *
 * computed()
 *
 * 1、如果 computed 的第一个参数是函数，说明是只读的传入形式，将参数赋值给 getter, setter为空或在开发环境抛出警告
 *
 * 2、否则则为选项式传参，直接去第一个参数里面读 get 和 set 并赋值
 *
 *
 * ComputedRefImpl
 *
 * 1、这个类是创建 computed 的核心函数
 *
 * 2、_dirty：是否是脏的，是否需要重新计算（脏值检测原理！！），默认是 true（如果值没有发生变化，就会使用缓存中的值）
 *
 * 3、get value() 的写法，可以看出，内部是劫持了 value 属性 (ref)
 *
 *    - toRaw 先将 this 脱离 proxy 代理
 *    - _dirty 若为 true，则需要重新计算
 *
 *          - _dirty 设置为 false（下次不需要再走进来）
 *          - self.effect.run() 读取 return出来值的操作（根据依赖变化后计算出的新值）
 *
 *
 *    - _cacheable 若为 false,即缓存不可用，那肯定也是要走进重新计算的
 *    - 否则直接返回现有的值
 *
 * 4、构造函数 中的 ReactiveEffect，源码中搜索 class ReactiveEffect
 *
 *    - ReactiveEffect(fn, scheduler, scope)
 *    - 跟上一章学习的 effect 是一样的，对其进行扩展，支持了调度（scheduler）
 *          - effect(() => { 依赖函数 })
 *
 * 5、调度函数又是在哪里调用的？  trigger ->  triggerEffect 函数中调用
 *    - 也就是说 当依赖发生变化时，才会调用 scheduler
 *
 * 6、new ReactiveEffect 传入的 scheduler 函数体中会将 _dirty 置为 true（即依赖发生变化时，_dirty置为true）
 *      然后在 get value() 时，走进的就是 run()，即重新获取不读缓存
 *
 * 7、依赖未改变时，_dirty 一直是 false,再次访问就会取老的值，不会重新获取
 *
 */

/**
 * 四、手写源码
 *
 *    见 utils/computed.js、utils/响应式.html（启动需要使用 live server）
 */
</script>
<style lang="scss" scoped></style>
