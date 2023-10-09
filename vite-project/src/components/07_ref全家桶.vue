<template>
  <div>07 ref全家桶-----------------------------------------------------</div>
  <div>Man:{{ Man }}</div>
  <div>Man2:{{ Man2 }}</div>
  <div>blue:{{ blue }}</div>
  <div>custom:{{ custom }}</div>

  <div ref="dom">我是dom</div>

  <button @click="changeMan">改变ref</button>
  <button @click="change">改变customRef</button>
  <button @click="getDom">获取dom</button>
</template>

<script setup lang="ts">
import {
  ref,
  Ref,
  isRef,
  shallowRef, // 用的不多，偶尔
  ShallowRef, // 用的不多，偶尔
  triggerRef, // 用的不多
  customRef, // 用的不多
} from "vue";
// import type { Ref } from "vue";
import { reactive } from "vue";

type M = {
  name: string;
};

const blue = reactive({ name: "blue" });
const blue2: Ref<string> = ref("abc");
blue2.value = "cba";

// 一、ref：深层次的响应式，直接触发视图更新
const Man: Ref<M> = ref({ name: "小满" });
// 二、shallowRef：浅层的响应式，整体修改才会视图更新，修改内部不会视图更新
const Man2: ShallowRef<M> = shallowRef({ name: "小满" });

function changeMan() {
  // 三、isRef：判断是不是ref类型
  console.log(isRef(Man)); // true
  console.log(isRef(blue)); // false

  console.log(Man); // Ref<Object>
  console.log(Man2); // ShallowRef<Object>
  console.log(blue); // ShallowRef<Object>

  // ref：通过 .value 进行修改，触发响应式更新
  // Man.value.name = "大满1";

  // 四、shallowRef：
  // 1、浅层的，整体修改才可有响应式，触发视图更新；
  // 2、若直接修改内部 name 不会触发视图更新（只改变值不改变视图）
  // 3、但是：若修改name的同时，有其他触发视图更新的操作，这里也会顺带更新！！！！！（比如把上面的 Man 修改打开注释）
  //    所以 ref 和 shallowRef 不能混着写（或者说不能触发视图更新）
  Man2.value.name = "大满2";
  console.log("Man2.value.name", Man2.value.name); // 这里打印更新，但是不更新视图

  // Man2.value = {
  //   name: "大满3",
  // }; // 更新视图

  // blue.name = "smile"; // 这里用reactive进行测试，会触发更新视图，也会顺带更新 Man2 的视图

  // 五、triggerRef 相当于手动触发视图更新
  triggerRef(Man2); // ref 底层实现响应式，就是在最后调用了这个手动更新，可以理解为 ref = shallowRef + triggerRef
}

// 六、customRef
// 1、用来自定义 ref，接受一个函数
// 2、函数有两个参数，track 追踪器收集变化；trigger触发更新
// 3、函数返回一个对象，里面自定义 get 和 set 函数。get中先收集变化再返回值，set中先设置新值再触发更新
// function MyRef<T>(value: T) {
//   return customRef((track, trigger) => {
//     return {
//       get() {
//         track();
//         return value;
//       },
//       set(newVal) {
//         value = newVal;
//         console.log("触发set");
//         trigger();
//       },
//     };
//   });
// }
// 4、在以上功能上再给set加个防抖（n 秒后再执行该事件，若在 n 秒内被重复触发，则重新计时）
function MyRef<T>(value: T, delay = 500) {
  let timer: any = null;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newVal) {
        // 防抖在这里要先清除老定时器，再建立新的定时器，规定时间内每次触发重新计时，在最后才会走进
        //      - 连续操作，最后触发（或者理解为触发后置，在这个时间段内的触发以最后一次为准，前面的触发不理会）
        // 节流在这里 if (timer) return，即：有定时器先不走，等上一个定时器内容走完（走完后要清除定时器），然后触发再建立新的定时器
        //      - 连续操作，固定频率触发（或者理解为触发前置，后面再触发先不管，超过这个定时器时间再管）
        clearTimeout(timer);
        timer = setTimeout(() => {
          console.log("触发set", newVal);
          value = newVal;
          trigger();
        }, delay);
      },
    };
  });
}

const custom = MyRef<string>("xiaoman");
function change() {
  // customRef 定义的值进行更新
  custom.value = "daman";
  console.log("obj-----", custom); // Ref<"daman">
}

// 七、获取dom
// 1、dom上绑定 ref 属性，并用 ref 设置为同名的响应式变量，类型是 HTMLElement
// 2、使用时，仍然通过.value
const dom = ref<HTMLElement>();
function getDom() {
  // ?.的形式，先判断再获取
  console.log(dom.value?.innerText);
}

// 八、ref 源码
// node_modules/@vue/reactivity/dist/reactivity.cjs.prod  搜索  function ref

/**
 *  createRef 中
 *    1、若 isRef = true，则直接返回；否则走进 RefImpl（实现 ref 的类）中
 *
 *    2、RefImpl：跟上面的 customRef 非常类似，原理相同（get\set，track\trigger）
 *
 *        - get 时要追踪变化，trackRefValue（依赖收集）
 *        - set 时要触发更新，triggerRefValue -> triggerEffects（依赖更新）
 *
 *            ref 和 triggerRef 在源码中都会调用 triggerRefValue -> triggerEffects，所以都会触发更新
 *            所以 ref 不能和 shallowRef 混用！会导致 shallowRef 被更新
 *
 *    3、若 shallow 传 true（即为shallowRef）
 *          - _rawValue 直接返回
 *          - _value 直接返回
 *
 *    4、若 shallow 传 false（即为 ref）
 *          - _rawValue 走进 toRaw 中（后续学习）
 *          - _value 则会走进 toReactive 中，toReactive 中先判断是不是引用类型，
 *                - 如果是的话调用 toReactive 函数将其变为响应式对象
 *                - 如果不是直接返回
 *          - 相当于 ref 内部实现响应式还是用的 reactive !!
 *
 */
</script>
