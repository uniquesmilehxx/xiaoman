<template>
  <div style="display: none">
    <button @click="openHandler">我是父组件，点击调用子组件的方法</button>
    <div>---------------------下面是子组件 Tongxin</div>
    <Tongxin ref="helloRef" :str="str" @on-click="getName"></Tongxin>
  </div>

  <!-- 瀑布流 -->
  <WaterFall :list="list" />
</template>
<script setup lang="ts">
import Tongxin from "./16_父子通信_waterfall/Tongxin.vue";
import WaterFall from "./16_父子通信_waterfall/WaterFall.vue";

// ---------------------------------------------------父组件给子组件传参
import { ref } from "vue";
let str = ref<string>("测试组件传参");

const getName = (name: string) => {
  console.log("父组件拿到name了=========>", name);
};

// ---------------------------------------------------父组件使用子组件的方法
// 1、js 会这样写
// const helloRef = ref();
// 2、ts 会这样写，在泛型中 使用：
//    ref名    = ref< InstanceType<typeof 组件名>  >()
const helloRef = ref<InstanceType<typeof Tongxin>>();

const openHandler = () => {
  console.log(helloRef.value?.name);
  helloRef.value?.open();
};

// -------------------------------------------------------- 瀑布流
const list = [
  {
    height: 300,
    background: "red",
  },
  {
    height: 400,
    background: "pink",
  },
  {
    height: 500,
    background: "blue",
  },
  {
    height: 200,
    background: "green",
  },
  {
    height: 300,
    background: "gray",
  },
  {
    height: 400,
    background: "#CC00FF",
  },
  {
    height: 200,
    background: "gray",
  },
  {
    height: 100,
    background: "#996666",
  },
  {
    height: 500,
    background: "skyblue",
  },
  {
    height: 300,
    background: "#993366",
  },
  {
    height: 100,
    background: "#33FF33",
  },
  {
    height: 400,
    background: "skyblue",
  },
  {
    height: 200,
    background: "#6633CC",
  },
  {
    height: 300,
    background: "#666699",
  },
  {
    height: 300,
    background: "#66CCFF",
  },
  {
    height: 300,
    background: "skyblue",
  },
  {
    height: 200,
    background: "#CC3366",
  },
  {
    height: 200,
    background: "#CC9966",
  },
  {
    height: 200,
    background: "#FF00FF",
  },
  {
    height: 500,
    background: "#990000",
  },
  {
    height: 400,
    background: "red",
  },
  {
    height: 100,
    background: "#999966",
  },
  {
    height: 200,
    background: "#CCCC66",
  },
  {
    height: 300,
    background: "#FF33FF",
  },
  {
    height: 400,
    background: "#FFFF66",
  },
  {
    height: 200,
    background: "red",
  },
  {
    height: 100,
    background: "skyblue",
  },
  {
    height: 200,
    background: "#33CC00",
  },
  {
    height: 300,
    background: "#330033",
  },
  {
    height: 100,
    background: "#0066CC",
  },
  {
    height: 200,
    background: "skyblue",
  },
  {
    height: 100,
    background: "#006666",
  },
  {
    height: 200,
    background: "yellow",
  },
  {
    height: 300,
    background: "skyblue",
  },
  {
    height: 120,
    background: "#33CCFF",
  },
  {
    height: 400,
    background: "#999966",
  },
  {
    height: 630,
    background: "#CC9966",
  },
  {
    height: 250,
    background: "#33FF00",
  },
  {
    height: 300,
    background: "yellow",
  },
  {
    height: 500,
    background: "green",
  },
];
</script>
<style lang="scss" scoped></style>
