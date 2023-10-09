<template>
  <div class="xm-menu">{{ title }}</div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const title = ref("menu");
</script>
<style lang="scss" scoped>
@include b(menu) {
  min-width: 200px;
  height: 100%;
  border: 1px solid #ccc;
}
</style>
