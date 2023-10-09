<template>
  <div>
    08 reactive全家桶-----------------------------------------------------
  </div>
  <form class="">
    <input v-model="form.name" type="text" name="" id="" />
    <br />
    <input v-model="form.age" type="text" name="" id="" />
    <br />
    <!-- 不加 prevent 修饰符页面会刷新 -->
    <button @click.prevent="submit">提交</button>
  </form>
  <div>list：{{ list }}</div>
  <div>obj.list：{{ obj.list }}</div>
  <div>obj2: {{ obj2 }}</div>
  <div>obj3: {{ obj3 }}</div>
</template>
<script setup lang="ts">
import { reactive, readonly, shallowReactive } from "vue";

/**
 * 一、reactive 与 ref 的区别：
 * 1、ref可以接收所有类型，reactive只能接收引用类型（array、object、Map、Set）
 * 2、ref 在取值和赋值时都要通过 .value，reactive不需要
 * 3、reactive 不能直接整体赋值，因为它是通过proxy创建的响应式对象，直接赋值会破坏响应式。
 *    解决方案 1：可以调用一些原生方法，比如 数组可用push、pop等去修改
 *    解决方案 2：再包上一层
 */

const form = reactive({
  name: "xiaoman",
  age: 18,
});

const submit = () => {
  console.log(form);
};

const list = reactive<string[]>([]);

// 错误。直接整体赋值会破坏响应式
// list = ["a", "b", "c"];

// 可以通过原生方法去操作内部的某项，不会破坏响应式
setTimeout(() => {
  // list.push("aaa");
  // const res = ["jay chou", "jolin"];
  // list.push(...res);
}, 1000);

// 要是不想使用上述方法，可以在外面包一层
const obj = reactive<{ list: string[] }>({
  list: [],
});
setTimeout(() => {
  // obj.list = ["a", "b", "c"];
}, 2000);

// ----------------------------------------------------------------------
/**
 * 二、readonly
 * 1、设置为 readonly 后不可修改
 * 2、修改源数据,readonly的值也会受影响
 */

const info = reactive({
  name: "xiaoman",
});
const rd = readonly(info);

// 设置为 readonly 后不可修改
// rd.name = 'daman'

// 但是可以修改它的源数据
// info.name = "blue";
console.log("修改源数据,readonly的值也会受影响", info, rd);

// ---------------------------------------------------------------------------
/**
 * 三、shallowReactive
 * 1、与 shallowRef 用法接近，都是浅层的响应式（只改变值不改变视图）
 *    即修改第一层会触发更新，修改深层不会触发更新
 * 2、与 shallowRef 相似，有其他触发视图更新的操作，也会顺带将其更新
 */

//  reactive 是深层的响应式
const obj2 = reactive({
  foo: {
    bar: {
      name: "xiaoman",
    },
  },
});
setTimeout(() => {
  // obj2.foo.bar.name = "blue222222222";
  // console.log("obj2", obj2);
}, 1000);

// shallowReactive 是浅层的响应式
const obj3 = shallowReactive({
  foo: {
    bar: {
      name: "xiaoman",
    },
  },
});
setTimeout(() => {
  // 修改浅层才会触发响应式
  // obj3.foo = {
  //   bar: {
  //     name: "小满",
  //   },
  // };

  // 修改深层不会触发更新
  obj3.foo.bar.name = "blue3333333333";
  console.log("obj3", obj3); // 打印成功，但是视图不会更新
  // obj2.foo.bar.name = "blue555555"; // 除非有会其他会触发更新视图的代码，才会顺带着obj3一起更新
}, 1000);

// ------------------------------------------------------------------------------------------------

/**
 * 四、源码
 *
 * 1、reactivity.d.ts中，关于 reactive 的类型定义：
 *    export declare function reactive<T extends object>(target: T): UnwrapNestedRefs<T>;
 *    即只能传入 object 类型
 * 
 * 2、reactivity.cjs.prod.js中，
 *      function reactive(target) {
          if (isReadonly(target)) {
            return target;
          }
        .....
 *      即：reactive 如果传入只读类型的，会直接返回
          
   3、createReactiveObject 函数中，
      - 若传入的不是 object 类型，会抛出警告（dev环境）并直接返回；
      - 若传入的是被 proxy 代理过的（并且不是为了将其变为只读），也会直接返回
      - 如果能从缓存中找到，则直接返回（weakMap）
      - 如果在白名单中，也会直接返回，例如 __skip__（后面会讲的 markRaw 处理过的会加一个 __skip__，会跳过proxy代理 ）
 *    - 如果以上条件都没触发，就会进行 proxy代理
 *
 */
</script>
<style lang="scss" scoped></style>
