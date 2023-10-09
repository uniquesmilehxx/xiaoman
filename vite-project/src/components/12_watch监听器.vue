<template>
  <div class="">
    <div>
      12_watch监听器------------------------------------------------------------
    </div>
    <input type="text" v-model="xiaoman1" />
    <br />
    <input type="text" v-model="xiaoman2" />
    <br />
    <input type="text" v-model="message.foo.bar" />
    <br />
    <input type="text" v-model="message2.foo.bar" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from "vue";

/**
 * 被 ref、reactive 包裹起来的数据，才可以被 watch 监听到
 */

/**
 * 一、基础使用 watch(source, cb, options)
 *
 *    - watch(监听的目标，回调函数，配置项)
 *    - source 有很多种类型，reactive、ref、数组、函数
 *            - 如果监听单个，并且是引用类型，新值 和 旧值 是一样的
 *            - 可监听多个数据放进数组里，新值 旧值 也都是数组
 *    - options
 *        - deep:
 *            - ref 监听深层 要开启 deep，reactive 监听深层不需要开启
 *            - 若只想监听深层中的单个属性，(第一个参数 source)引用类型可直接写，否则使用函数形式
 *        - immediate 立刻执行回调函数
 *        - flush：watch的执行顺序。 pre 组件更新之前调用（默认）；sync 同步执行；post 组件更新之后执行
 */

const xiaoman1 = ref<string>("小满1");
const xiaoman2 = ref<string>("小满2");

const message = ref({
  foo: {
    bar: "aaaaa",
  },
});

const message2 = reactive({
  foo: {
    bar: "aaaaa",
  },
});

watch(xiaoman1, (newVal, oldVal) => {
  console.log("监听单个数据源", newVal, oldVal);
});

// 用数组监听多个数据源，[新值数组], [旧值数组]
watch([xiaoman1, xiaoman2], (newVal, oldVal) => {
  console.log("用数组监听多个数据源，[新值数组], [旧值数组]", newVal, oldVal);
});

// ref 深层监听
watch(
  message,
  (newVal, oldVal) => {
    // 如果是引用类型，新值 和 旧值 是一样的
    console.log("ref 深层监听&立刻执行", newVal, oldVal);
  },
  {
    deep: true, // 深度监听，ref 若需要深度监听，这里要开启
    immediate: true, // callback 立刻先执行一次
    flush: "pre", // 【watch的执行顺序】 pre 组件更新之前调用（默认）；sync 同步执行；post 组件更新之后执行
    // flush 属性在 watch 中用的不多，watchEffect中可能用到
  }
);

// reactive 深层监听：不必开启深度监听
watch(
  message2,
  (newVal, oldVal) => {
    // 如果是引用类型，新值 和 旧值 是一样的
    console.log("reactive 深层监听&立刻执行", newVal, oldVal);
  },
  {
    // deep: true, // reactive 不必开启深度监听，源码已做了深层监听
    // immediate: true,
  }
);

// 若只想监听深层中的单个属性，(第一个参数)引用类型可直接写，否则使用函数形式
watch(
  message2.foo, // 监听到 foo，foo是引用类型，直接写就行
  // () => message2.foo.bar, // 监听到 bar，需要用函数形式

  (newVal, oldVal) => {
    // 如果是引用类型，新值 和 旧值 是一样的
    console.log("reactive 监听深层中的单个属性", newVal, oldVal);
  }
);

/**
 * 二、源码学习
 *
 * @vue/runtime-core/runtime-core.cjs.prod.js 搜索 function watch
 *
 * -  watch(source, cb, options)
 *
 * -  source 有很多种类型，reactive、ref、数组、函数，所以先判断类型，格式化source
 *    - ref 类型，直接把 value 取出来，赋值给 getter
 *    - reactive 类型，直接把整体赋值给 getter，deep 手动置为 true 即可（reactive已经进行了深度监听）
 *    - 数组类型，做遍历，对每一项再判断类型，分别处理完之后丢进新数组返回
 *          - ref类型，返回.value
 *          - reactive类型，递归处理后返回
 *          - 函数的话，进行加工
 *    - 函数类型
 *          - 判断有没有 cb
 *              - 有 cb 的话，同样也是对函数做了加工赋值给 getter
 *              - 没有 cb，走进 watchEffect（下一章）
 *
 * - deep处理：
 *          - cb、deep 若同时存在，即 有回调函数 且设置了 深度监听，进行 traverse 递归深度监听（当然是更耗时的）
 *
 * - flush处理：先初始化出 scheduler 调度器
 *          - sync 同步执行，scheduler = job
 *          - post 组件更新后，将 job 通过 queuePostRenderEffect 函数处理后再赋值给 scheduler
 *                  - 注意，源码中看到 queuePostRenderEffect 这个函数，一定表示是在组件更新之后再去执行
 *          - pre 组件更新前，queueJob 处理 job 后赋值给 scheduler
 *
 * - ReactiveEffect 收集依赖：
 *          - 上面步骤 将 getter、scheduler处理好后作为参数 给到 ReactiveEffect 函数
 *          - ReactiveEffect 收集好依赖之后，有更新的话 就会触发 scheduler，也就是说会执行 job
 *
 *
 * - cb 存在
 *          - immediate 为 true 时，会立即调用一下 job（job执行完即是更新了 oldVal）
 *                - 内部会先获取到新值 newVal
 *                - 如果是第一次执行，旧值 oldVal 会置为 undefined
 *                - （执行完这里才会更新）然后 把新值赋值给旧值，为下一次使用准备 （所以如果是对象，新旧值是相等的）
 *          - immediate 为 false 时,
 *                - 先给旧值做初始化，如 oldVal = '小满'
 *                - 依赖如果更新，会触发 scheduler，执行 job
 *                      - job 内新值 newVal = '小满1'
 *                      - 旧值 oldVal 不会走进 undefined，会等于原有的 oldVal = '小满'
 *                      - （执行完这里才会更新）会把 oldVal = '小满1'
 *
 *
 *
 *
 */
</script>
<style lang="scss" scoped></style>
