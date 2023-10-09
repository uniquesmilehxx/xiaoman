<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";

const b: string = "05-vue基本语法";
const arr: number[] = [1, 2, 3];
let arr2 = reactive([11, 22, 33]);
const ele = `<b>v-text和v-html演示</b>`;

const eventName = "click";
const clickHandler = () => {
  console.log("点击了");
};

// ref、reactive实现响应式
// 使用ref后，左侧不能再写 txt:string了（类型“Ref＜string＞”不可分配给类型“string”）
const txt = ref("happy");

let once = ref("只渲染一次");
onMounted(() => {
  // once = "更新了"; // Type 'string' is not assignable to type 'Ref<string>'
  once = ref("更新了也不会再次渲染");

  setTimeout(() => {
    console.time();
    arr2[1] = 2222;
    console.timeEnd();
  }, 2000);
});
</script>

<template>
  <div>05---------------------------------------------------------------</div>
  <div>{{ b }}{{ arr }}</div>

  <!-- 注意是：({ num: v }) -->
  <div>{{ arr.map((v) => ({ num: v })) }}</div>
  <!-- 可以直接使用js的内置函数 -->
  <div>{{ arr.join("___") }}</div>

  <!-- v-text 显示文本 -->
  <div v-text="ele"></div>

  <!-- v-html显示富文本：只支持普通html标签，不支持组件 -->
  <div v-html="ele"></div>

  <!-- 动态的事件交互 -->
  <button @[eventName]="clickHandler">按钮1</button>

  <!-- v-model 和 ref/reactive 响应式 -->
  <div><input type="text" v-model="txt" /></div>
  <div>{{ txt }}</div>

  <!-- v-once：只会渲染一次（可用于性能优化） -->
  <div v-once>{{ once }}</div>

  <!-- v-memo用于缓存，性能优化，一般在v-for时使用，并且循环次数非常多时有效（>1000），一般用不到 -->
  <!-- tips: 当搭配 v-for 使用 v-memo，确保两者都绑定在同一个元素上。v-memo 不能用在 v-for 内部 -->
  <!-- v-memo 里面写的是跳过渲染的条件，即：里面的条件如果成立，就会跳过渲染；不成立才会重新渲染 -->
  <!-- v-memo = "[]"时，和 v-once作用是一样的-->
  <div v-memo="[]">
    'v-memo=[]时，相当于v-once，不会二次渲染'：{{ arr2[1] }}
  </div>
  <!-- 暂时感受不到区别。（应该是因为数据量太小） -->
  <div v-for="i in arr2" :key="i" v-memo="[i == 1]">{{ i }}</div>

  <div>
    -----------------------------------------------------------------------
  </div>
</template>
