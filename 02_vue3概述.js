// vue2 使用 object.defineProperty 监听，监听数组时，需要重写数组的push、pop等方法进行劫持
// vue3 使用 proxy 监听

// vue3：
// 【patch flag】：打上静态标记（TEXT、PROPS等），diff比较时只需要比较动态的部分，静态的部分不需要比较，所以性能上会有很大提升
// 【fragment】：一个template内可以写多个节点（vue2只能写一个），原理是vue3帮助开发者增加了一个虚拟节点（容器），虚拟节点不会被渲染
// 【suspense】
// 【teleport】
// 【多 v-model】
// 【tree-shaking】
// 【composition-api】
