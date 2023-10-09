<script setup lang="ts">
// import Com5 from "./components/05_vue基本语法.vue";
// import Com6 from "./components/06_虚拟DOM和diff算法.vue";
// import Com7 from "./components/07_ref全家桶.vue";
// import Com8 from "./components/08_reactive全家桶.vue";
// import Com9 from "./components/09_to全家桶.vue";
// import Com10 from "./components/10_响应式原理源码.vue";
// import Com11 from "./components/11_computed计算属性.vue";
// import Com12 from "./components/12_watch监听器.vue";
// import Com13 from "./components/13_watchEffect高级侦听器.vue";
// import Com14 from "./components/14_生命周期.vue";
// import Com15 from "./components/15_BEM架构+layout.vue";

// Com14 内用到的变量
// const bool = ref<Boolean>(true);

// Com15 layout展示
// import Menu from "./components/15_layout/Menu.vue";
// import Header from "./components/15_layout/Header.vue";
// import Content from "./components/15_layout/Content.vue";

// import Com16 from "./components/16_父子组件传参.vue";
import Com17 from "./components/17_全局、局部、递归组件.vue";
</script>

<template>
  <!-- <Com5 /> -->
  <!-- <Com6 /> -->
  <!-- <Com7 /> -->
  <!-- <Com8 /> -->
  <!-- <Com9 /> -->
  <!-- <Com10 /> -->
  <!-- <Com11 /> -->
  <!-- <Com12 /> -->
  <!-- <Com13 /> -->
  <!-- <Com14 v-if="bool" /> -->
  <!-- <button @click="bool = !bool">销毁组件Com14</button> -->
  <!-- <Com15 /> -->

  <!-- Com15__layout_demo -->
  <!-- <div class="xm-wrap">
    <div class="xm-wrap__left">
      <Menu></Menu>
    </div>
    <div class="xm-wrap__right">
      <Header></Header>
      <Content></Content>
    </div>
  </div> -->

  <!-- <Com16 /> -->
  <Com17 />
</template>

<style lang="scss">
/* 在这里配置不行，无法变成全局通用的样式，必须在 vite.config.ts 中配置 */
// @import "./bem.scss";

#app {
  @include bfc;
}

@include b(wrap) {
  @include bfc;
  @include flex;

  // 右侧
  @include e(right) {
    @include flex;
    flex-direction: column;
    flex: 1;
  }
}
</style>
