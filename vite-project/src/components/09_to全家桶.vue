<template>
  <div>
    09_to全家桶-----------------------------------------------------------
  </div>
  <div class="">hobby：{{ hobby }}</div>
  <div class="">hobby2：{{ hobby2 }}</div>
  <div class="">直接解构的值不会更新 age：{{ age }}</div>
  <button @click="change">修改</button>
  <hr />
  <div>refs:{{ refs }}</div>
  <div>refs2:{{ refs2 }}</div>
  <button @click="change2">修改</button>
</template>
<script setup lang="ts">
import { reactive, toRef, toRefs, toRaw } from "vue";

/**
 * 一、toRef (reactiveObj, key)
 * 1、接收两个参数，第一个是响应式对象，第二个是指定的key
 * 2、将 “响应式对象” 的一部分也变为响应式
 *      - toRef 对非响应式对象无能为力，修改后视图不会更新
 *      - 若直接解构，不使用 toRef，会丧失响应式
 * 3、应用场景：某个单独的 属性key 需要被单独使用，并希望它是响应式的
 *
 */

//  普通对象
const man = {
  name: "xiaoman",
  age: 18,
  hobby: "ball",
};

// reactive 响应式对象
const man2 = reactive({
  name: "xiaoman",
  age: 18,
  hobby: "ball",
});

// toRef 接收两个参数，第一个是响应式对象，第二个是指定的 key
const hobby = toRef(man, "hobby"); // 对普通对象使用，修改后仅修改值 但不更新视图
const hobby2 = toRef(man2, "hobby");
const { age } = man2; // 直接解构会丧失响应式

const change = () => {
  // hobby.value = "sing";
  // console.log("hobby", hobby); // Ref<"sing">，但视图不更新

  hobby2.value = "dance";
  console.log("hobby2", hobby2, man2); // Ref<"dance">，// hobby2 和 man2 都会更新，视图也会更新

  // man2.age = 20;
  // console.log("age", age); // 直接解构会丧失响应式，age 的数据和视图都不会更新
};

// ----------------------------------------------------------------------

/**
 * 二、toRefs (reactiveObj)
 * 1、和 toRef 作用一样，只是不再指定某个key，而是把全部属性都变为响应式
 * 2、也是需要传入响应式对象，之后 若对其解构，解构出的也是响应式对象
 * 3、外层不再是响应式，内部的每一个key才是响应式
 */

// 1、简单实现 toRefs 的源码

const toRefsCopy = <T extends object>(obj: T) => {
  const map: any = {};

  for (let key in obj) {
    map[key] = toRef(obj[key]);
  }
  return map;
};

// 2、需要传入响应式对象
const blue = reactive({
  name: "blue",
  age: 19,
});

const refs = toRefsCopy(blue);
const refs2 = toRefs(blue);

console.log("refs---", refs, refs2);
// {
//   age: Ref<19>,
//   name: Ref<"blue">
// }

const change2 = () => {
  // const { age } = refs;
  // age.value = 22;
  // console.log("toRefsCopy", refs, age);

  // 外层不再是响应式，内部的每一个key才是响应式
  const { age } = refs2;
  age.value = 24;
  console.log("toRefs", refs, age);
  // {
  //   age: Ref<19>,
  //   name: Ref<"blue">
  // }
  // Ref<24>
};

// ----------------------------------------------------------------

/**
 * 三、toRaw(reactiveObj)
 *
 * 1、使 响应式对象 变为 普通原始对象
 * 2、取出 响应式对象中 '__v_raw' 对应的值，跟 toRaw 的结果相同，都是普通对象（__v_raw 是源码内部的操作）
 *
 */

const people = reactive({
  name: "bill",
  age: 12,
});

// 打印结果：people 是具有响应式的对象，toRaw 后就变成了普通原始对象
console.log("toRaw-------", people, toRaw(people));

// 取出 __v_raw 对应的值，跟 toRaw 的结果相同
// console.log("__v_raw-------", people["__v_raw"]);

// --------------------------------------------------------------

/**
 * 四、源码（reactivity.cjs.prod.js）
 *     搜索 function toRef 即可找到
 *
 * 1、function toRef (source, key, defaultValue)
 *    - 先判断 isRef，true的话直接返回
 *    - 再判断是不是函数类型，GetterRefImpl 内部仍然是直接返回，但会增加一些必要的标记（__v_isRef、__v_isReadonly）
 *
 *    - 再判断是不是object，是的话走进 propertyToRef
 *        - 看 source[key] 是否满足 isRef，
 *            true的话直接返回（已经设置过响应式了）
 *            否则走进 ObjectRefImpl，这就是 toRef 的核心方法
 *        - ObjectRefImpl 与 RefImpl（ref） 内部同样有 get、set方法，
 *          但是区别在于 ObjectRefImpl 没有收集依赖(track)、触发更新(trigger) 的操作
 *          所以 toRef 对普通对象来讲没有响应式，只对已经有响应式的对象有用
 *
 *    - 上述类型都不属于的话，直接 ref(source)
 *
 *
 *
 * 2、function toRefs (object)
 *
 *    - 和上面自己写的 toRefsCopy 思路基本一致
 *        - 先初始化一下，[]或者{}
 *        - 然后循环，
 *                判断每个值 若 isRef=true 直接返回
 *                否则都 走进 ObjectRefImpl 中变为 ref 类型
 *
 *
 * 3、function toRaw(observed)
 *
 *    - 判断 observed 是否存在 __v_raw ，存在的话继续递归 toRaw，否则直接返回 observed
 *    - 取出的结果就是 不带 __v_raw 的原始普通对象
 *
 *
 */
</script>
<style lang="scss" scoped></style>
