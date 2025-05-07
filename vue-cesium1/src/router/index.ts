import { createRouter, createWebHistory } from 'vue-router';

import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Navigation from '../components/Navigation.vue';
import CesiumViewer from '../components/CesiumViewer.vue';
import DataTable from '../components/DataTable.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
        path: '/home',
        component: Navigation,
        children:[
            { path: '/cesium', component: CesiumViewer }, // 子路由：cesiumviewer
            { path: '/datatable', component: DataTable }, // 子路由：活动管理
        ],
        beforeEnter: (to, from, next) => {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn === 'true') {
                next();
            } else {
                next('/login');
            }
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;