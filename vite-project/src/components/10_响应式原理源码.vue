<template>
  <div class=""></div>
</template>
<script setup lang="ts">
// import { ref, reactive } from "vue";
/**
 *
 * 响应式原理：Vue2 通过 Object.defineProperty 实现，Vue3 通过 ES6 的 Proxy 实现
 *
 * -  vue2   Object.defineProperty：
 *       对象只能劫持设置好的数据，新增属性时只能通过 vue.$set；
 *       数组也只是劫持（重写）了七个api，修改某一项无法劫持，或者说也可以实现但是有很大的性能问题
 *
 *
 *
 *
 *
 * - 简单用 proxy 实现 reactive（见 utils/reactive.js）
 *
 * - 简单用 proxy 实现 effect 副作用函数（见 utils/effect.js）
 *
 *
 * - demo查看效果：utils/响应式.html 右键点击选择 open with live server
 *
 *
 *
 */
</script>
<style lang="scss" scoped></style>
