import TaskComp from '@/components/TaskComp.vue';
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/tasks',
        component: TaskComp
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;