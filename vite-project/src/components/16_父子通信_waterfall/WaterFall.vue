<template>
  <div class="list">
    <div
      class="item"
      v-for="(item, index) in waterList"
      :style="{
        width: width + 'px',
        height: item.height + 'px',
        left: item.left + 'px',
        top: item.top + 'px',
        background: item.background,
      }"
    >
      {{ index }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

/***
 * 瀑布流的思路：
 *
 * 1、每个图片都是根据 left、top值进行绝对定位的，所以 【瀑布流的数组】 要维护这两个属性
 * 2、取出屏幕的宽度，假定图片的宽度固定为一个值，计算可以铺多少列
 * 3、按列数 先铺上第一行（记得维护 left、top 值）
 * 4、第一行铺满以后，后面的每一张都要铺在 高度最低的列 ！！！！ 这是瀑布流的核心！！所以要维护一个【长度为列数的高度数组】用于比较
 */

const props = defineProps<{
  list: any[];
}>();

// 图片宽度
const width = 120;
// 图片上下间距
const gap = 20;
// 瀑布流数组
const waterList = ref<any[]>([]);
// 列高度数组
const heightList = reactive<number[]>([]);

// 屏幕宽度需要在 mounted 之后拿到
onMounted(() => {
  // 计算列数
  const column = Math.floor(document.body.clientWidth / width);

  // 核心内容就是维护每个图片的 left、top
  for (let i = 0; i < props.list.length; i++) {
    // 先铺上第一行（i < column 则表示是第一行）
    if (i < column) {
      props.list[i].top = 0;
      props.list[i].left = width * i;
      // 塞进瀑布流
      waterList.value?.push(props.list[i]);
      // 高度数据更新
      heightList[i] = props.list[i].height;
    }

    // 后面的就要一张张塞进去，每次找出最低的列往里塞
    else {
      // 最低的高度，先默认为第一列高度
      let current = heightList[0];
      // 最低的列，先默认为第一个
      let col = 0;

      // 循环每一列进行比较
      heightList.forEach((h, i) => {
        if (h < current) {
          current = h;
          col = i;
        }
      });
      console.log("最低的列", col, "高度为", current);

      // 由此计算出该图片的 left、top
      props.list[i].left = col * width;
      props.list[i].top = current + gap;
      // 塞进瀑布流
      waterList.value.push(props.list[i]);

      // 更新列高度数组
      heightList[col] = current + gap + props.list[i].height;
    }
  }
  console.log("waterList", waterList.value);
  console.log("heightList", heightList);
});
</script>
<style lang="scss" scoped>
.list {
  position: relative;
  height: 100%;
  overflow: auto;
  .item {
    position: absolute;
    font-size: 30px;
  }
}
</style>
