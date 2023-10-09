import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
const app = createApp(App);

// 注册全局组件
import Card from "./components/17_组件/Card.vue";
app.component("Card", Card);

app.mount("#app");
