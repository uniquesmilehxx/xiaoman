<script setup lang="ts">
/**
 * 一、BEM 架构：block(块)   element(元素)   modifier(修饰符)
 *
 * -  namespace-block__element--modifier
 */

/**
 * 二、sass 语法（https://www.sass.hk/docs/）
 *
 *  1、嵌套规则
 *
 *    嵌套写法，编译后 带着父级选择器 一个个平铺
 *
 *  2、变量
 *
 *    sass 使用 $ 开头
 *    less 使用 @ 开头
 *
 *  3、插值      #{变量名}
 *
 *    $name: foo;
 *    .#{$name} {
 *      color: red;
 *    }
 *
 *    编译后：
 *
 *    .foo {
 *      color: red;
 *    }
 *
 *  4、@at-root 用来跳出嵌套
 *
 *    .parent {
 *      @at-root .child {
 *      }
 *    }
 *
 *    编译后：
 *
 *    .parent {}
 *    .child {}
 *
 * 5、混入 @minxin @include (用法可参照印象笔记)
 * 
 * 6、& 的用法
 * 
 *  #main {
      color: black;
      &-sidebar { border: 1px solid; }
    }

    编译后：

    #main {
      color: black; 
    }
    #main-sidebar {
      border: 1px solid; 
    }
 *
 *
 * 三、sass 实战，见 bem.scss
 *
 *    npm i sass
 *
 *
 *
 */
</script>
<template>
  <div class="">
    <div>15_BEM架构+layout-----------------------------------------</div>
    <div class="blue">
      哈哈哈
      <div class="blue-name">笑笑</div>
    </div>
    <div class="xm-test">
      B
      <div class="xm-test__inner">E</div>
      <div class="xm-test--success">M</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
// blue-name 这样写编译出来的 是 .blue .blue-name {}
.blue {
  font-size: 30px;
  .blue-name {
    font-size: 40px;
  }
}

// blue-name 这样写编译出来的是 .blue-name {}
.blue {
  font-size: 30px;
  &-name {
    font-size: 40px;
  }
}

// 书写时必须保持对应的嵌套关系，否则无效
@include b(test) {
  color: red;
  font-size: 40px;
  @include e(inner) {
    color: blue;
    font-size: 30px;
  }
  @include m(success) {
    color: green;
    font-size: 16px;
  }
}
</style>
