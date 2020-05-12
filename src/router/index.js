import Vue from 'vue'
import VueRouter from 'vue-router'

import Welcome from '../views/Welcome.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import page404 from '../views/404.vue'
import Timeline from "@/views/layout/Timeline";
import MyBlog from "@/views/layout/MyBlog";
import CommentMe from "@/views/layout/CommentMe";
import MyComment from "@/views/layout/MyComment";
import MyCollect from "@/views/layout/MyCollect";
import MyFollow from "@/views/layout/MyFollow";
import MyFollower from "@/views/layout/MyFollower";
import UserInfo from "@/views/layout/UserInfo";
import UserInfoUpdate from "@/views/layout/UserInfoUpdate";
import PasswordUpdate from "@/views/layout/PasswordUpdate";
import LoginLog from "@/views/layout/LoginLog";
import CommentDetail from "@/views/layout/CommentDetail";
import SearchUser from "@/views/layout/SearchUser";


Vue.use(VueRouter)

const routes = [
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/home',
    component: Home,
    children: [
      {
        path: 'home',
        name: 'Timeline',
        component: Timeline,
        meta: {
          scrollTop: 0,
          title: '科研动态',
          id: 1
        }
      },
      {
        path: 'myblog',
        name: 'MyBlog',
        component: MyBlog,
        meta: {
          scrollTop: 0,
          title: '我的主页',
          id: 1
        }
      },
      {
        path: 'commentme',
        name: 'CommentMe',
        component: CommentMe,
        meta: {
          scrollTop: 0,
          title: '评论我的',
          id: 1
        }
      },
      {
        path: 'mycomment',
        name: 'MyComment',
        component: MyComment,
        meta: {
          scrollTop: 0,
          title: '我的评论',
          id: 1
        }
      },
      {
        path: 'mycollect',
        name: 'MyCollect',
        component: MyCollect,
        meta: {
          scrollTop: 0,
          title: '我的收藏',
          id: 1
        }
      },
      {
        path: 'myfollow',
        name: 'MyFollow',
        component: MyFollow,
        meta: {
          scrollTop: 0,
          title: '我的关注',
          id: 1
        }
      },
      {
        path: 'myfollower',
        name: 'MyFollower',
        component: MyFollower,
        meta: {
          scrollTop: 0,
          title: '我的粉丝',
          id: 1
        }
      },
      {
        path: 'settings/userinfo',
        name: 'UserInfo',
        component: UserInfo,
        meta: {
          scrollTop: 0,
          title: '用户信息',
          id: 1
        }
      },
      {
        path: 'settings/userinfo-update',
        name: 'UserInfoUpdate',
        component: UserInfoUpdate,
        meta: {
          scrollTop: 0,
          title: '修改信息',
          id: 1
        }
      },
      {
        path: 'settings/password-update',
        name: 'PasswordUpdate',
        component: PasswordUpdate,
        meta: {
          scrollTop: 0,
          title: '修改密码',
          id: 1
        }
      },
      {
        path: 'settings/login-log',
        name: 'LoginLog',
        component: LoginLog,
        meta: {
          scrollTop: 0,
          title: '登录日志',
          id: 1
        }
      },
      {
        path: 'comments/*',
        name: 'CommentDetail',
        component: CommentDetail,
        meta: {
          hasBack: true,
          scrollTop: 0,
          title: '评论详情',
          id: 1
        }
      },
      {
        path: 'searchuser',
        name: 'SearchUser',
        component: SearchUser,
        meta: {
          hasBack: true,
          scrollTop: 0,
          title: '搜索用户',
          id: 1
        }
      },
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    redirect: '/settings/userinfo',
  },
  {
    path: '/404',
    name: '404',
    component: page404
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      const y = to.meta.scrollTop
      if (y !== undefined) {
        return { x: 0, y: y }
      }
      return { x: 0, y: 0 }
    }
  }
})

export default router
