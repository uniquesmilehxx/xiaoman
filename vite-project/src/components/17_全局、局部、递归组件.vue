<template>
  <div class="">
    <!-- 使用局部组件 -->
    <!-- <CardVue></CardVue> -->

    <!-- 全局组件不需要引入可以直接使用 -->
    <!-- <Card></Card> -->

    <!-- 递归组件 -->
    <Tree :data="mock" />
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
// 1、引入局部组件
// import CardVue from "../components/17_组件/Card.vue";

// ------------------------------------------------------------------------

// 2、将组件注册为全局组件（main.ts）
// -  语法：app.component(组件名称, 组件路径)
// -  批量注册全局组件的例子：
//      - element-ui:  https://element-plus.gitee.io/zh-CN/component/icon.html#%E5%AE%89%E8%A3%85
//                     找到“注册所有图标”，可看到如下示例：

// import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// const app = createApp(App);
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component);
// }

// ------------------------------------------------------------------------

// 3、递归组件
// 如 无限级的菜单，需要递归
// 数据必须在外面定义，作为props传进去，这样才能在递归组件使用时传入数据
import Tree from "../components/17_组件/Tree.vue";
interface ITree {
  name: string;
  checked: boolean;
  children?: ITree[];
}

const mock = reactive<ITree[]>([
  {
    name: "1",
    checked: false,
    children: [
      {
        name: "1-1",
        checked: true,
      },
    ],
  },
  {
    name: "2",
    checked: false,
  },
  {
    name: "3",
    checked: false,
    children: [
      {
        name: "3-1",
        checked: false,
        children: [
          {
            name: "3-1-1",
            checked: true,
          },
        ],
      },
    ],
  },
]);
</script>
<style lang="scss" scoped></style>
