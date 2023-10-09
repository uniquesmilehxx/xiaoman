<template>
  <div class="xm-content">
    <div class="xm-content__items" v-for="item in 100">
      {{ item }}{{ title }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const title = ref<string>("哈哈");
</script>
<style lang="scss" scoped>
@include b(content) {
  flex: 1;
  overflow: auto;
  border: 1px solid #ccc;

  // 列表
  @include e(items) {
    padding: 10px;
    margin: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
}
</style>
