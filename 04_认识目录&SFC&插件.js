// 1、目录介绍：以 vite-projeect 项目为例：

// vite-env.d.ts：env的 ts 声明文件扩充
// main.ts 全局配置的ts文件（非入口文件）
// index.html：vite项目的入口文件，使用 ESModule 的形式（前面熟悉的项目都是以 js 做入口文件）
// tsconfig.json 是 ts 的配置文件
// vite.config.ts 是 vite 的配置文件

// vite 是 基于 esbuild 做编译，打包基于 rollup

// 2、SFC

// setup形式的script只能有一个，非setup的可多个
// template只能有一个
// style可以有多个

// <script setup>
// </script>
// <template></template>
// <style></style>

// 3、vscode 插件

// 插件市场搜索 volar, 安装 Vue Language Feature、Typescript Vue Plugin
// 如果装过vue2的插件 vetur，在书写 vue3时，需要将其禁用（写 vue2 的时候就要把 vue3 的给禁用掉）

// 4、项目启动相关

// npm run dev，直接执行 vite 是不好使的，这是为什么呢？
// node_modules/.bin 源码中，有三个vite相关的文件，执行命令后会先找到 vite 文件，执行shell脚本，脚本内进行了跨平台命令（linux、windows、macOS）的兼容
