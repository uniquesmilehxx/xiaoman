<template>
  <div class="">
    <div ref="title">
      14_生命周期--------------------------------------------------
      {{ str }}
    </div>
    <button @click="change">触发update</button>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onRenderTracked,
  onRenderTriggered,
  getCurrentInstance,
} from "vue";
/**
 * 一、组件的引入方式
 *  - 若使用 setup 语法糖，只需引入即可使用，不需要注册
 */

/**
 * 二、组件的生命周期
 *    - beforeCreated、created  => setup      (setup没有这两个生命周期，用 setup去代替)
 *    - onBeforeMount 读取不到 dom，要在 onMounted 中读
 *    - onBeforeUpdate 获取的是更新前的 dom, onUpdated 获取的是更新之后的 dom
 */

const title = ref<HTMLDivElement>();
const str = ref<string>("");

// 触发 update
const change = () => {
  str.value = String(Math.random());
};

// -----------------------------------------创建顺序
// setup
console.log("setup");

// 创建之前
onBeforeMount(() => {
  console.log("onBeforeMount——创建之前", title.value);
});

// 触发收集依赖（用于调试），创建实例时收集依赖
onRenderTracked((e) => {
  console.log("onRenderTracked", e);
});

// 创建完成
// 创建完成之后才可以获取到 dom
onMounted(() => {
  console.log("onMounted——创建完成", title.value);
});

// ---------------------------------------------------------更新顺序

// 触发更新（用于调试），在更新之前
onRenderTriggered((e) => {
  console.log("onRenderTriggered", e);
});

// 更新之前
// 读取的dom 是更新之前的dom
onBeforeUpdate(() => {
  console.log("onBeforeUpdate——更新之前", title.value?.innerText);
});

// 更新完成
// 读取的dom 是更新之后的dom
onUpdated(() => {
  console.log("onUpdated——更新完成", title.value?.innerText);
});

// ------------------------------------------------------------------销毁顺序

// 卸载之前
onBeforeUnmount(() => {
  console.log("onBeforeUnmount——卸载之前");
});

// 卸载完成
onUnmounted(() => {
  console.log("onUnmounted——卸载完成");
});

/***
 * 三、源码
 *
 * @vue/runtime-core/dist/runtime-core.cjs.prod.js
 * 
 * 
 * 1、
 * 
 *    柯里化：一个柯里化的函数首先会接收一些参数，接收了这些参数后，该函数并不会立即求值，而是继续返回另外一个函数，
 *           刚才传入的参数在函数形成的闭包中被保存起来。待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值
 *            
              function add(x, y) {
                  return x + y;
              }
              console.log(add(1, 2)); // 3

              柯里化后：

              function add(x) {
                return function (y) {
                  return x + y;
                }
              }
              console.log(add(1)(2)); // 3

              柯里化不会调用函数。它只是对函数进行转换。
 * 
 * 
 * 
 * 
 * 
 * 
      const createHook = (lifecycle) => (hook, target = currentInstance) => (
        // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
        (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
      );
      const onBeforeMount = createHook("bm");
      const onMounted = createHook("m");
      const onBeforeUpdate = createHook("bu");
      const onUpdated = createHook("u");
      const onBeforeUnmount = createHook("bum");
      const onUnmounted = createHook("um");
      const onServerPrefetch = createHook("sp");
      const onRenderTriggered = createHook(
        "rtg"
      );
      const onRenderTracked = createHook(
        "rtc"
      );


      - 源码中 createHook 使用柯里化对生命周期做一个封装，在 组件实例 instance 上挂载了一些生命周期函数的简称
      - 注册 hook：在 injectHook 中对 hooks 做了一个缓存（有值读取，没值设置为[]），hooks 始终是 function类型的数组
      - componentUpdateFn 创建/更新组件
          - 创建过程（!instance.isMounted）
              - beforeMount hook: 使用 invokeArrayFns(bm)
              - render
              - patch
              - mounted hook : 使用 queuePostRenderEffect
          - 更新过程（instance.isMounted）
              - beforeUpdate hook：使用 invokeArrayFns(bu)
              - render
              - patch
              - updated hook：使用 queuePostRenderEffect
              - 再执行对应的钩子：invokeVNo deHook
      - unmount 卸载组件
          - unmountComponent 清除组件引用的 effect 副作用函数
          - invokeDirectiveHook 执行 onbeforeUnmount
          - unmountChildren 清空组件下面所有子树
          - 卸载完成后 执行 onunmounted (invokeDirectiveHook)
 *
 *
 */
// getCurrentInstance 获取组件实例
const instance = getCurrentInstance();
// 可以看到 instance 上挂载了一些生命周期函数的简称，如 bm、bu等（可以验证生命周期有没有正确挂载）
console.log("instance", instance);

// ---------------------------------------------------------------
</script>
<style lang="scss" scoped></style>
