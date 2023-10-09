<template>
  <div class="xm-card">
    <header class="xm-card__header">
      <div>标题</div>
      <div>副标题</div>
    </header>
    <section class="xm-card__content">内容</section>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
</script>
<style lang="scss" scoped>
$border: #ccc;

@include b(card) {
  border: 1px solid $border;
  width: 500px;
  @include e(header) {
    display: flex;
    justify-content: space-between;
    height: 50px;
    border-bottom: 1px solid $border;
    align-items: center;
    padding: 5px;
  }
  @include e(content) {
    padding: 5px;
    min-height: 200px;
  }
}
</style>
