import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";

import VueHighlightJS from 'vue3-highlightjs'
import 'vue3-highlightjs/styles/default.css'

const app = createApp(App)

app.use(router)

app.use(VueHighlightJS)

app.mount('#app')