<template>
  <div>13_watchEffect高级侦听器------------------------------------------</div>
  <div class="">
    <input type="text" v-model="message1" />
    <br />
    <input type="text" v-model="message2" />
    <br />
    <button @click="stopWatch">停止watchEffect</button>
    <br />
    <input id="ipt" v-model="iptVal" />
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";

const message1 = ref<string>("飞机");
const message2 = ref<string>("火车");

// watchEffect(fn, options)

/**
 * 1、watchEffect 简单使用
 *    - 第一个参数就是要运行的副作用函数
 *    - 函数内 用到哪些数据 才会 监听哪些数据
 *    - 且会立刻执行一次（immediate）
 *
 */
// watchEffect(() => {
//   console.log("message1========>,", message1);
//   console.log("message2========>,", message2);
// });

/**
 * 2、副作用函数的参数
 *
 *      - 参数也是一个函数，用来注册清理回调。清理回调会在【该副作用下一次执行前被调用】，可以用来清理无效的副作用，例如等待中的异步请求
 *
 */
// watchEffect((onCleanup) => {
//   console.log("message11111========>,", message1);
//   console.log("message22222========>,", message2);

//   onCleanup(() => {
//     console.log("onCleanup —————— 下一次运行之前要做的事");
//   });
// });

/**
 * 3、watchEffect 返回值
 *      - 返回值是一个用来停止侦听器的函数，调用后不再侦听
 *      - 停止时，不影响最后一次 onCleanup 的执行
 */

const stop = watchEffect((onCleanup) => {
  console.log("message11111========>,", message1);
  console.log("message22222========>,", message2);

  onCleanup(() => {
    console.log("onCleanup —————— 下一次运行之前要做的事");
  });
});

const stopWatch = () => {
  stop();
};

/***
 * 4、选项配置
 *
 *  - flush
 *        - 'pre' | 'post' | 'sync' // 默认：'pre'
 *        - 一般需要在 dom 更新之后再获取的情况，可以设置为 post
 *
 *  - onTrack?: (event: DebuggerEvent) => void  用于开发环境调试
 *  - onTrigger?: (event: DebuggerEvent) => void 用于开发环境调试
 */
const iptVal = ref<string>("aa");
watchEffect(
  () => {
    // 测试 flush
    const spanEle = document.getElementById("ipt");
    console.log("spanEle========>,", spanEle); // flush=pre时，打印 null; flush=post时，打印 span节点

    // 测试 onTrack、onTrigger
    console.log("iptVal============>", iptVal.value);
  },
  {
    flush: "post",
    onTrack: () => {
      // debugger;
    },
    onTrigger: () => {
      // debugger;
    },
  }
);
</script>
<style lang="scss" scoped></style>
