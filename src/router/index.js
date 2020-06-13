import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/home/home'
import user from '../components/user'
import login from '../components/login/login'
import store from '../store/index'

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
          name: 'user',
          component: user
        }
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
    if(userInfo === 'null'){
      next('/login');
    }else{
      next()
    }
  }
})

export default router
