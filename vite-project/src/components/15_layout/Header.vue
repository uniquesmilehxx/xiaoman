<template>
  <div class="xm-header">{{ title }}</div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const title = ref<string>("header");
</script>
<style lang="scss" scoped>
@include b(header) {
  height: 50px;
  border: 1px solid #ccc;
}
</style>
