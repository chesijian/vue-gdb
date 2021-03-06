import Vue from 'vue'
import Router from 'vue-router'
// import index from '@/components/index'
import { util } from '@/utils/api.js'

import sys from './sys/sys'
Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/login',
            meta: {
                title: '智慧工地管理平台'
            },
            component: resolve => require(['@/components/login.vue'], resolve),
        },
        {
            path: '*',
            redirect: '/login',
        },
        {
            path: '/form',
            component: resolve => require(['@/views/index.vue'], resolve),
            children: [
                ...sys
            ]
        },
        {
            path: '/index',
            name: 'index',
            meta: {
                title: '项目'
            },
            component: resolve => require(['@/views/index.vue'], resolve),
            children: [
                {
                    path: 'project',
                    meta: {
                        title: '项目'
                    },
                    component: resolve => require(['@/views/project/index.vue'], resolve),
                },
                {
                    path: 'largeScreen',
                    meta: {
                        title: '集团大屏'
                    },
                    component: resolve => require(['@/components/largeScreen/home/home.vue'], resolve)
                },
                {
                    path: 'report',
                    meta: {
                        title: '集团报表'
                    },
                    component: resolve => require(['@/components/largeScreen/report/report.vue'], resolve)
                },
                {
                    path: 'documentManage',
                    meta: {
                        title: '文档模板管理'
                    },
                    component: resolve => require(['@/components/document-manage/index.vue'], resolve),
                },
                {
                    path: 'menu/manage',
                    name: 'menu/manage',
                    meta: {
                      title: '菜单管理'
                    },
                    component: resolve => require(['@/sys/menu/index.vue'], resolve)
                },
                {
                    path: 'roleAuth',
                    meta: {
                        title: '角色授权'
                    },
                    component: resolve => require(['@/components/sys/roleAuth.vue'], resolve),
                },
                {
                    path: 'dataDictionary',
                    meta: {
                        title: '数据字典'
                    },
                    component: resolve => require(['@/components/proj/dataDictionary.vue'], resolve),
                },
                {
                    path: 'enterprisesSet',
                    meta: {
                        title: '组织架构'
                    },
                    component: resolve => require(['@/components/administration/enterprisesSet.vue'], resolve),
                },
                {
                    path: 'library',
                    component: resolve => require(['@/components/library/index-library.vue'], resolve),
                    children: [
                        {
                            path: '',
                            meta: {
                                title: '检查项设置'
                            },
                            component: resolve => require(['@/components/library/checkSet.vue'], resolve)
                        },
                        {
                            path: 'checkSets',
                            name: 'checkSets',
                            meta: {
                                title: '检查项设置'
                            },
                            component: resolve => require(['@/components/library/checkSet2.vue'], resolve)
                        },

                    ]
                },
            ]
        },
        {
            path: '/project',
            name: 'project',
            meta: {
                title: '项目'
            },
            component: resolve => require(['@/views/project-home.vue'], resolve),
            children:[
                {
                    path: 'home',
                    meta: {
                        title: '项目概况'
                    },
                    component: resolve => require(['@/views/projProfile/index.vue'], resolve),
                    children: [
                        {
                            path: 'news',
                            name: 'news',
                            meta: {
                                title: '新闻公告'
                            },
                            component: resolve => require(['@/views/projProfile/news.vue'], resolve)
                        },
                        
                    ]
                },
                {
                    path: 'projArea',
                    name: 'projArea',
                    meta: {
                        title: '楼栋管理'
                    },
                    component: resolve => require(['@/views/projProfile/proj-area.vue'], resolve)
                },
            ]
        }
    ]
})

export default router
