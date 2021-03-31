import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/home/home'
import user from '../components/user/user'
import login from '../components/login/login'
import category from "../components/category/category";
import admin from '../components/admin/admin'
import role from "../components/role/role";
import jurisdiction from "../components/jurisdiction/jurisdiction";
import product from "../components/category/product";
import updateproduct from "../components/category/updateproduct";
import approvepost from "../components/approvepost/approvepost.vue";
import approvejob from "../components/approvejob/approvejob.vue";

Vue.use(Router)


//定义路由
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'home',
      component: home,
      children: [
        {
          path: '/user',
          name: '/user',
          component: user,
        },
        {
          path: '/admin',
          name: '/admin',
          component: admin
        },
        {
          path: '/category',
          name: '/category',
          component: category
        },
        {
          path: '/role',
          name: '/role',
          component: role
        },
        {
          path: '/jurisdiction',
          name: '/jurisdiction',
          component: jurisdiction
        },
        {
          path: '/product',
          name: '/product',
          component: product,
          meta:{
            keepAlive : true
          }
        },
        {
          path: '/product/update',
          name: '/product',
          component: updateproduct,
        },
        {
          path: '/approve-post',
          name: '/approve-post',
          component: approvepost,
        },
        {
          path: '/approve-job',
          name: '/approve-job',
          component: approvejob,
        },
      ]
    },
  ],
  mode: 'history',
})

//拦截器
router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    next()
  } else {
    let userInfo = localStorage.getItem("userInfo")
    if(!userInfo){
      next('/login');
    }else{
      next()
    }
  }
})

export default router
