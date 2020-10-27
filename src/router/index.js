import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("views/login/Login.vue"),
  },
  {
    path: "/container",
    name: "container",
    component: () => import("views/container/Container.vue"),
    children: [
      {
        path: "/index",
        name: "index",
        component: () => import("views/index/Index.vue"),
      },
      {
        path: "/public/home",
        name: "public/home",
        component: () => import("views/public/home/Home.vue"),
      },
      {
        path: "/public/type",
        name: "public/type",
        component: () => import("views/public/type/Type.vue"),
      },
      {
        path: "/user",
        name: "user",
        component: () => import("views/user/User.vue"),
      },
      {
        path: "/menu",
        name: "menu",
        component: () => import("views/menu/Menu.vue"),
      },
      {
        path: "/table",
        name: "table",
        component: () => import("views/table/Table.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
