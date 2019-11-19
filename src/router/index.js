import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    meta: {
      title: "Tarefas"
    },
    component: Home
  },
  {
    path: "/clientes",
    name: "clientes",
    meta: {
      title: "Clientes"
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Clientes.vue")
  },
  {
    path: "/notas",
    name: "notas",
    meta: {
      title: "Notas"
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Notas.vue")
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
