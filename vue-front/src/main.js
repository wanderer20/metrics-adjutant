import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";

import VueCodeHighlight from 'vue-code-highlight';
import 'vue-code-highlight/themes/window.css';
import 'vue-code-highlight/themes/duotone-sea.css'

// import Prism from "prism-es6/components/prism-core";
// import 'prism-es6/components/prism-markup-templating'
// import 'prism-es6/components/prism-haml';
// import 'prism-es6/components/prism-markup';
// import 'prism-es6/components/prism-bash';


// import VueHighlightJS from 'vue3-highlightjs'
// import 'vue3-highlightjs/styles/dracula.css'

const app = createApp(App)

app.use(router)

// app.use(VueHighlightJS)


app.use(VueCodeHighlight) //registers the v-highlight directive

app.mount('#app')