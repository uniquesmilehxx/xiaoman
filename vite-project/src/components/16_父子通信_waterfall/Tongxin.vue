<script setup lang="ts">
// import { ref } from "vue";

//-----------------------------------------------------父组件给子组件传值 defineProps、withDefaults
// 一、如果没有用 ts 的话可以直接这么写
// defineProps 是个函数：

// 1、接收一个对象，对象内的每个值 在模板中都可以直接使用
// defineProps({
//   str: {
//     type: String,
//     // default: "默认值",  // default 两种使用方式
//     default: () => "默认值",
//   },
// });

// 2、如果不定义默认值，还可以接收数组，在模板中都可以直接使用
// defineProps(["str"]);

// 但是会发现 js 内无法使用，必须使用 defineProps 的执行结果
// console.log(str);

// 3、接收 defineProps 的执行结果
// 在 js 中通过接收的变量去访问，模板中 可以直接访问，也可以通过执行结果去访问
// const props = defineProps(["str"]);
// console.log("接收 defineProps 的执行结果", props.str);

// 二、若在 ts 中使用
// 1、defineProps 用法相同，只是 在【泛型】中直接通过一个对象定义接收的变量
// const props2 = defineProps<{
//   str: string;
// }>();
// console.log(props2.str);

// 2、如果在 ts 中需要定义默认值，使用 withDefaults 函数
// withDefaults(defineProps, 默认值对象)
const props3 = withDefaults(
  // 第一个参数是 defineProps
  defineProps<{
    str: string;
  }>(),
  // 第二个参数中默认值
  {
    str: "abcd",
  }
);
// js 中使用的话，都是需要接收 withDefaults、defineProps 执行后的结果
console.log("props3", props3.str);

//-----------------------------------------------------子组件调用父组件的事件 defineEmits

// 一、js中使用

// // 注册事件
// const emit = defineEmits(["on-click"]);

// // 在 js 中使用的话，需要使用 emit 接收 defineEmits 的执行结果（模板中使用不需要）
// const postName = () => {
//   emit("on-click", "笑笑");
// };

// 二、ts 的写法

// 也是直接在泛型中定义函数的结构
// (e: 方法名称, 参数1：参数1的类型, ......) : 返回值
const emit2 = defineEmits<{
  (e: "on-click", name: string): void;
  // 多个事件
  // (e: "on-click", name: string): void;
  // (e: "on-click", name: string): void;
  // (e: "on-click", name: string): void;
}>();

// ----------------------------------------------------- 父组件调用子组件的事件

const open = () => {
  console.log("open");
};

defineExpose({
  name: props3.str,
  open,
});
</script>

<template>
  <!-- ---------------------------------------父组件给子组件传值 -->
  <!-- js 测试 -->
  <!-- <div>{{ str }}</div>
  <div>{{ props.str }}</div> -->

  <!-- ts 测试 -->
  <div>{{ str }}</div>
  <!-- <div>{{ props2.str }}</div> -->
  <div>{{ props3.str }}</div>

  <!-- -------------------------------------子组件调用父组件的事件 -->

  <!-- 使用接收的 emit -->
  <!-- <button @click="postName" style="margin-right: 10px">
    给父组件传值111111
  </button>
  <button @click="emit('on-click', '笑笑2')">给父组件传值2222222</button> -->

  <!-- $emit 可以直接在模板里面使用，不需要（const emit = ...）接收执行结果  -->
  <!-- <button @click="$emit('on-click', '笑笑3')">给父组件传值3333333</button> -->

  <!-- ts使用 -->
  <button @click="emit2('on-click', '笑笑--ts')">给父组件传值-----ts</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
