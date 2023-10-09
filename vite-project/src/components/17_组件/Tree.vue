<template>
  <div class="">
    <!-- 第一层数据 -->
    <div
      v-for="item in data"
      style="margin-left: 16px"
      @click.stop="clickTap(item, $event)"
    >
      <input type="checkbox" v-model="item.checked" />
      {{ item.name }}
      <!-- 下面层的数据，使用递归组件（须有数据传入），有三种使用方式 -->

      <!-- 1、直接使用当前组件的名称，不需要引入 -->
      <!-- <Tree v-if="item?.children?.length" :data="item.children"></Tree> -->

      <!-- 2、需要单独再定义一个 script，并暴露出 name -->
      <!-- <TreeVue v-if="item?.children?.length" :data="item.children"></TreeVue> -->

      <!-- 3、直接使用 defineOptions，定义组件名称（老的版本可能需要插件，新的暂不需要） -->
      <Self v-if="item?.children?.length" :data="item.children"></Self>

      <!-- 需要注意：都需要传入子集的数据，并且加上递归的判断条件 -->
    </div>
  </div>
</template>

<script setup lang="ts">
interface ITree {
  name: string;
  checked: boolean;
  children?: ITree[];
}
defineProps<{
  data?: ITree[];
}>();

defineOptions({
  name: "Self",
});

const clickTap = (item: ITree, e: Event) => {
  console.log("111111", item);
  console.log("222222", e.target);
};
</script>

<!-- 再起一个 script（lang必须保持一致），用来定义该组件的 name -->
<script lang="ts">
export default {
  name: "TreeVue",
};
</script>
<style lang="scss" scoped></style>
