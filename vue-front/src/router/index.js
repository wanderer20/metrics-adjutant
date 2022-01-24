import { createWebHistory, createRouter} from "vue-router";

import Index from "../views/Index.vue"
import NotFound from "../views/NotFound.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Index
    },
    {
        path: "/:pathMatch(.*)*",
        name: "Not Found",
        component: NotFound
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router