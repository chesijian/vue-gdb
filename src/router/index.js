import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import { util, cookieUtil } from '@/utils/utils.js'
import sys from './sys/sys'
Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/form',
            component: resolve => require(['@/components/proj.vue'], resolve),
            children: [
                ...sys
            ]
        },
        {
            path: '/projLargeIndex',
            component: resolve => require(['@/components/largeScreen/projectGather/index.vue'], resolve),
            children: [
                {
                    path: 'projLargeScreen',
                    name: 'projLargeScreen',
                    meta: {
                        title: '项目大屏'
                    },
                    component: resolve => require(['@/components/largeScreen/project/project.vue'], resolve)
                },
                {
                    path: 'distribution',
                    name: 'distribution',
                    meta: {
                        title: '项目看板'
                    },
                    component: resolve => require(['@/components/largeScreen/projectGather/projectGather.vue'], resolve)
                   
                },
            ]
        },
   	    {

            path: '/page',
            component: index,
            children: [
                {
                    path: 'proj',
                    meta: {
                        title: '工程概况'
                    },
                    component: resolve => require(['@/components/projProfile/index.vue'], resolve),
                    children: [
                        {
                            path: 'form/query/:formKey',
                            name: 'form-query',
                            meta: {
                            // title: '表单查询'
                            },
                            component: () => import('@/common/form/form-view/form-view.vue')
                        },
                        {
                            path: 'news',
                            name: 'news',
                            meta: {
                                title: '新闻公告'
                            },
                            component: resolve => require(['@/components/projProfile/news.vue'], resolve)
                        },
                        
                    ]
                },
                {
                    path: 'projReport',
                    name: 'projReport',
                    meta: {
                        title: '项目汇报'
                    },
                    component: resolve => require(['@/components/projProfile/projReport.vue'], resolve)
                },
                {
                    path: 'projArea',
                    name: 'projArea',
                    meta: {
                        title: '楼栋管理'
                    },
                    component: resolve => require(['@/components/projProfile/proj-area.vue'], resolve)
                },
                {
                    path: 'projMeeting',
                    meta: {
                        title: '项目会议'
                    },
                    component: resolve => require(['@/components/proj-meeting/index.vue'], resolve),
                    children: [
                        {
                            path: 'form/query/:formKey',
                            name: 'form-query',
                            meta: {
                                title: '项目会议'
                            },
                            component: () => import('@/common/form/form-view/form-view.vue')
                        },
                    ]
                },
                {
                    path: 'workContactBill',
                    meta: {
                        title: '工作联系单'
                    },
                    component: resolve => require(['@/components/work-contact/index.vue'], resolve),
                    children: [
                        {
                            path: 'form/query/:formKey',
                            name: 'form-query',
                            meta: {
                                title: '工作联系单'
                            },
                            component: () => import('@/common/form/form-view/form-view.vue')
                        },
                    ]
                },
                {
                    path: 'progress',
                    name: 'progress',
                    meta: {
                        title: '工程进度'
                    },
                    component: resolve => require(['@/components/progress/progressIndex.vue'], resolve),
                    children: [
                        {
                            path: 'form/query/:formKey',
                            name: 'form-query',
                            meta: {
                                title: '计划编制'
                            },
                            component: () => import('@/common/form/form-view/form-view.vue')
                        },
                    ]
                },
                {
                    path: 'equipmentIndex',
                    name: 'equipmentIndex',
                    meta: {
                        title: '设备管理'
                    },
                    component: resolve => require(['@/components/equipment/equipmentIndex.vue'], resolve)
                },
                {
                    path: 'environmental',
                    name: 'environmental',
                    meta: {
                        title: '环境监控'
                    },
                    component: resolve => require(['@/components/environmental/environmentalIndex.vue'], resolve)
                },
                {
                    path: 'crane',
                    name: 'crane',
                    meta: {
                        title: '塔机监测'
                    },
                    component: resolve => require(['@/components/crane/craneIndex.vue'], resolve)
                },
                {
                    path: 'SystemDocumentation',
                    meta: {
                        title: '工程文档'
                    },
                    component: resolve => require(['@/components/projectDocuments/index.vue'], resolve),
                    children: [
                        {
                            path: '',
                            meta: {
                                title: '文档管理'
                            },
                            component: resolve => require(['@/components/projectDocuments/SystemDocumentation.vue'], resolve)
                        },
                        {
                            path: 'form/query/:formKey',
                            name: 'form-query',
                            meta: {
                            // title: '表单查询'
                            },
                            component: () => import('@/common/form/form-view/form-view.vue')
                        },
                    ]
                },
                {
                    path: 'projProfile/checkSet',
                    name: 'projProfile/checkSet',
                    meta: {
                        title: '检查项设置'
                    },
                    component: resolve => require(['@/components/projProfile/checkSet.vue'], resolve)
                },
                {
                    path: 'check/authorization',
                    name: 'check/authorization',
                    meta: {
                        title: '检查权限'
                    },
                    component: resolve => require(['@/components/checkManage/authorization/authorization.vue'], resolve)
                },
                {
                    path: 'checkManage',
                    component: resolve => require(['@/components/checkManage/checkManageIndex.vue'], resolve),
                    children: [
                        {
                            path: '',
                            meta: {
                                title: '首页'
                            },
                            component: resolve => require(['@/components/checkManage/checkIndex.vue'], resolve)
                        },
                        {
                            path: 'checkProblem',
                            name: 'checkProblem',
                            meta: {
                                title: '检查问题'
                            },
                            component: resolve => require(['@/components/checkManage/checkProblem.vue'], resolve)
                        },
                        {
                            path: 'jurisdiction',
                            name: 'jurisdiction',
                            meta: {
                                title: '权限配置'
                            },
                            component: resolve => require(['@/components/checkManage/Jurisdiction.vue'], resolve)
                        },
                        {
                          path: 'planning',
                          meta: {
                            title: '计划编制'
                          },
                          component: resolve => require(['@/components/checkManage/Planning.vue'], resolve)
                        },
                        {
                            path: 'checkSet',
                            name: 'checkSet',
                            meta: {
                                title: '检查项设置'
                            },
                            component: resolve => require(['@/components/checkManage/checkSet.vue'], resolve)
                        },
                        {
                            path: 'form/query/:formKey',
                            name: 'form-query',
                            meta: {
                                   title: '表单查询'
                            },
                            component: () => import('@/common/form/form-view/form-view.vue')
					    },
                    ]
                },
                {

                    path: 'safetyCheck',
                    component: resolve => require(['@/components/checkManage/safetyManageIndex.vue'], resolve),
                    children: [
                        {
                            path: '',
                            meta: {
                                title: '首页'
                            },
                            component: resolve => require(['@/components/checkManage/checkIndex.vue'], resolve)
                        },
                        {
                            path: 'checkProblem',
                            name: 'checkProblem',
                            meta: {
                                title: '检查问题'
                            },
                            component: resolve => require(['@/components/checkManage/checkProblem.vue'], resolve)
                        },
                        {
                            path: 'jurisdiction',
                            name: 'jurisdiction',
                            meta: {
                                title: '权限配置'
                            },
                            component: resolve => require(['@/components/checkManage/Jurisdiction.vue'], resolve)
                        },
                        {
                          path: 'planning',
                          meta: {
                            title: '计划编制'
                          },
                          component: resolve => require(['@/components/checkManage/Planning.vue'], resolve)
                        },
                        {
                            path: 'checkSet',
                            name: 'checkSet',
                            meta: {
                                title: '检查项设置'
                            },
                            component: resolve => require(['@/components/checkManage/checkSet.vue'], resolve)
                        },
                        {
                            path: 'form/query/:formKey',
                            name: 'form-query',
                            meta: {
                                   title: '表单查询'
                            },
                            component: () => import('@/common/form/form-view/form-view.vue')
					    },
                    ]
                },
                {
                    path: 'problem',
                    component: resolve => require(['@/components/problem/PageIndex.vue'], resolve),
                    children: [
                        {
                            path: 'form/query/:formKey',
                            name: 'form-query',
                            meta: {
                                   title: '表单查询'
                            },
                            component: () => import('@/common/form/form-view/form-view.vue')
					    },
                        {
                            path: '',
                            meta: {
                                title: '首页'
                            },
                            component: resolve => require(['@/components/problem/MeasuredIndex.vue'], resolve)
                        },
                        {
                            path: 'areaMeasured',
                            path: 'areaMeasured',
                            meta: {
                                title: '区域测点'
                            },
                            component: resolve => require(['@/components/problem/AreaMeasured.vue'], resolve)
                        },
                        {
                            path: 'jurisdiction',
                            path: 'jurisdiction',
                            meta: {
                                title: '权限配置'
                            },
                            component: resolve => require(['@/components/problem/Jurisdiction.vue'], resolve)
                        },
                        {
                            path: 'checkProblem',
                            path: 'checkProblem',
                            meta: {
                                title: '问题整改'
                            },
                            component: resolve => require(['@/components/problem/MeasuredProblem.vue'], resolve)
                        },
                        {
                          path: 'planning',
                          meta: {
                            title: '计划编制'
                          },
                          component: resolve => require(['@/components/problem/Planning.vue'], resolve)
                        },
                        {
                            path: 'checkSet',
                            name: 'checkSet',
                            meta: {
                                title: '检查项设置'
                            },
                            component: resolve => require(['@/components/problem/checkSet.vue'], resolve)
                        },
                    ]
                },
                {
                    path: 'material',
                    component: resolve => require(['@/components/material/PageIndex.vue'], resolve),
                    children: [
                        // {
                        //     path: '',
                        //     meta: {
                        //         title: '首页'
                        //     },
                        //     component: resolve => require(['@/components/material/MeasuredIndex.vue'], resolve)
                        // },
                        {
					      path: 'form/query/:formKey',
					      name: 'form-query',
					      meta: {
					         title: '表单查询'
					      },
					      component: () => import('@/common/form/form-view/form-view.vue')
					    },
                        {
                            path: 'areaMeasured',
                            name: 'areaMeasured',
                            meta: {
                                title: '区域测点'
                            },
                            component: resolve => require(['@/components/material/AreaMeasured.vue'], resolve)
                        },
                        {
                            path: 'jurisdiction',
                            name: 'jurisdiction',
                            meta: {
                                title: '权限配置'
                            },
                            component: resolve => require(['@/components/material/Jurisdiction.vue'], resolve)
                        },
                        {
                            path: 'checkProblem',
                            name: 'checkProblem',
                            meta: {
                                title: '问题整改'
                            },
                            component: resolve => require(['@/components/material/MeasuredProblem.vue'], resolve)
                        },
                        {
                          path: 'planning',
                          meta: {
                            title: '计划编制'
                          },
                          component: resolve => require(['@/components/material/Planning.vue'], resolve)
                        },
                        {
                            path: 'checkSet',
                            name: 'checkSet',
                            meta: {
                                title: '检查项设置'
                            },
                            component: resolve => require(['@/components/material/checkSet.vue'], resolve)
                        },
                    ]
                },
                {
                    path: 'realNameSystem',
                    component: resolve => require(['@/components/realNameSystem/realNameSystemIndex.vue'], resolve),
                    children: [
                        {
                            path: '',
                            meta: {
                            title: '实名制-首页'
                            },
                            component: resolve => require(['@/components/realNameSystem/index.vue'], resolve)
                        },
                        {
                            path: 'ShiftManagement',
                            name: 'ShiftManagement',
                            meta: {
                            title: '实名制-班次管理'
                            },
                            component: resolve => require(['@/components/realNameSystem/ShiftManagement.vue'], resolve),
                        },
                        {
                            path: 'signinRecord',
                            meta: {
                            title: '实名制-考勤'
                            },
                            component: resolve => require(['@/components/realNameSystem/signinRecord.vue'], resolve)
                        },
                        {
                            path: 'memberManage',
                            name: 'memberManage',
                            meta: {
                            title: '实名制-人员管理'
                            },
                            component: resolve => require(['@/components/realNameSystem/memberManage.vue'], resolve),
                        },
                        {
                            path: 'gateBrake',
                            name: 'gateBrake',
                            meta: {
                            title: '实名制-闸机设置'
                            },
                            component: resolve => require(['@/components/realNameSystem/gateBrake.vue'], resolve),
                        },
                        {
                            path: 'LaborContract',
                            name: 'LaborContract',
                            meta: {
                            title: '实名制-劳动合同'
                            },
                            component: resolve => require(['@/components/realNameSystem/LaborContract.vue'], resolve),
                        },
                        {
                            path: 'WorkforceManagement',
                            name: 'WorkforceManagement',
                            meta: {
                            title: '实名制-排班管理'
                            },
                            component: resolve => require(['@/components/realNameSystem/WorkforceManagement.vue'], resolve),
                        },
                        {
                            path: 'signinRecord',
                            name: 'signinRecord',
                            meta: {
                            title: '实名制-考勤记录'
                            },
                            component: resolve => require(['@/components/realNameSystem/signinRecord.vue'], resolve),
                        },
                        {
                            path: 'CreditRecord',
                            name: 'CreditRecord',
                            meta: {
                            title: '实名制-征信记录'
                            },
                            component: resolve => require(['@/components/realNameSystem/CreditRecord.vue'], resolve),
                        },
                        {
                            path: 'AdvanceAndRetreat',
                            name: 'AdvanceAndRetreat',
                            meta: {
                            title: '实名制-人员进退场'
                            },
                            component: resolve => require(['@/components/realNameSystem/AdvanceAndRetreat.vue'], resolve),
                        },
                        {
                            path: 'WageManagement',
                            name: 'WageManagement',
                            meta: {
                            title: '实名制-工资管理'
                            },
                            component: resolve => require(['@/components/realNameSystem/WageManagement.vue'], resolve),
                        },
                        {
                            path: 'TrainingManagement',
                            name: 'TrainingManagement',
                            meta: {
                            title: '实名制-培训管理'
                            },
                            component: resolve => require(['@/components/realNameSystem/TrainingManagement.vue'], resolve),
                        },
                    ]
                },
                {
                  path: 'ProcessManagement',
                  component: resolve => require(['@/components/ProcessManagement/index.vue'], resolve),
                  children: [
                    {
                      path: '',
                      meta: {
                        title: '工序-首页'
                      },
                      component: resolve => require(['@/components/ProcessManagement/ProcessManagementIndex.vue'], resolve)
                    },
                    {
                      path: 'workingProcedure',
                      meta: {
                        title: '工序-工序管理'
                      },
                      component: resolve => require(['@/components/ProcessManagement/workingProcedure.vue'], resolve)
                    },
                    {
                      path: 'InspectionLot',
                      meta: {
                        title: '工序-工序检验批'
                      },
                      component: resolve => require(['@/components/ProcessManagement/InspectionLot.vue'], resolve)
                    },
                    {
                        path: 'jurisdiction',
                        path: 'jurisdiction',
                        meta: {
                            title: '权限配置'
                        },
                        component: resolve => require(['@/components/ProcessManagement/Jurisdiction.vue'], resolve)
                    },
                    {
                        path: 'planning',
                        meta: {
                        title: '计划编制'
                        },
                        component: resolve => require(['@/components/ProcessManagement/Planning.vue'], resolve)
                    },
                    {
                      path: 'ProcessTask',
                      meta: {
                        title: '工序-工序任务'
                      },
                      component: resolve => require(['@/components/ProcessManagement/ProcessTask.vue'], resolve)
                    },
                    {
                      path: 'Rectification',
                      meta: {
                        title: '工序-问题整改'
                      },
                      component: resolve => require(['@/components/ProcessManagement/Rectification.vue'], resolve)
                    },
                    {
                      path: 'ProcessStatistics',
                      meta: {
                        title: '工序-统计'
                      },
                      component: resolve => require(['@/components/ProcessManagement/ProcessStatistics.vue'], resolve)
                    },
                    {
                        path: 'form/query/:formKey',
                        name: 'form-query',
                        meta: {
                           title: '表单查询'
                        },
                        component: () => import('@/common/form/form-view/form-view.vue')
                    },
                  ]
                },
                {
                    path: 'measured',
                    component: resolve => require(['@/components/measured/PageIndex.vue'], resolve),
                    children: [
                        {
                            path: '',
                            meta: {
                                title: '首页'
                            },
                            component: resolve => require(['@/components/measured/MeasuredIndex.vue'], resolve)
                        },
                        {
                            path: 'areaMeasured',
                            path: 'areaMeasured',
                            meta: {
                                title: '区域测点'
                            },
                            component: resolve => require(['@/components/measured/AreaMeasured.vue'], resolve)
                        },
                        {
                            path: 'jurisdiction',
                            path: 'jurisdiction',
                            meta: {
                                title: '权限配置'
                            },
                            component: resolve => require(['@/components/measured/Jurisdiction.vue'], resolve)
                        },
                        {
                            path: 'checkProblem',
                            path: 'checkProblem',
                            meta: {
                                title: '问题整改'
                            },
                            component: resolve => require(['@/components/measured/MeasuredProblem.vue'], resolve)
                        },
                        {
                          path: 'planning',
                          meta: {
                            title: '计划编制'
                          },
                          component: resolve => require(['@/components/measured/Planning.vue'], resolve)
                        },

                        {
                            path: 'checkSet',
                            name: 'checkSet',
                            meta: {
                                title: '检查项设置'
                            },
                            component: resolve => require(['@/components/measured/checkSet.vue'], resolve)
                        },
                        {
					      path: 'form/query/:formKey',
					      name: 'form-query',
					      meta: {
					         title: '表单查询'
					      },
					      component: () => import('@/common/form/form-view/form-view.vue')
					    },

                    ]
                },
                {
                    path: '*',
                    redirect: '/page',
                },
            ],
        },
        {
            path: '/common',
            component: resolve => require(['@/common/index.vue'], resolve),
            children: [{
                path: 'leaflet',
                meta: {
                    title: '图片预览'
                },
                component: resolve => require(['@/common/leaflet.vue'], resolve)
            }]
        },
        {
            path: '/login',
            meta: {
                title: '智慧工地管理平台'
            },
            component: resolve => require(['@/components/login.vue'], resolve),
        },
        {
            path: '/register',
            meta: {
                title: '注册'
            },
            component: resolve => require(['@/components/Register.vue'], resolve),
        },
        {
            path: '/proj',
            name: 'proj',
            meta: {
                title: '项目'
            },
            component: resolve => require(['@/components/proj.vue'], resolve),
            children: [
                {
                    path: '',
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
                // {
                //     path: 'spreadForm/query/:formKey',
                //     name: 'spreadForm-query',
                //     meta: {
                //        title: '报表设计'
                //     },
                //     component: resolve => require(['@/views/FeatureDrillDown/Design.vue'], resolve),
                // },
                // {
                //     path: 'spreadForm/view/:formKey',
                //     name: 'spreadForm-view',
                //     meta: {
                //        title: '预览报表'
                //     },
                //     component: resolve => require(['@/views/report/index.vue'], resolve),
                // },
                {
                    path: 'form/query/:formKey',
                    name: 'form-query',
                    meta: {
                        // title: '计划模板管理'
                    },
                    component: () => import('@/common/form/form-view/form-view.vue')
                },
                {
                    path: 'menuManage',
                    meta: {
                        title: '菜单管理'
                    },
                    component: resolve => require(['@/components/sys/menuManage.vue'], resolve),
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
                            path: 'form/query/:formKey',
                            name: 'form-query',
                            meta: {
                               title: '表单查询'
                            },
                            component: () => import('@/common/form/form-view/form-view.vue')
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
                {
                    path: '*',
                    redirect: '/proj',
                },
            ]
        },
        {
            path:'/gb-library-select',
            name: 'gb-library-select',
            meta:{
            title: '选择国标库',
            },
            component:resolve => require(['@/components/gb-library/select/index.vue'], resolve)
        },
        {
            path:'/select-areaItem',
            name: 'select-areaItem',
            meta:{
            title: '选择区域检查项',
            },
            component:resolve => require(['@/components/checkManage/select-areaItem/select-areaItem.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/login',
        },
    ]
})
router.beforeEach((to, from, next) => {
    // to and from are both route objects
    if(to.meta.title){
        document.title = to.meta.title;
    }
    
    // util.mask('正在跳转..')
    if (to.path == '/login'||to.path == '/register') {
        next()
        util.unmask()
    } else {
        next()
            util.unmask()
        // if (cookieUtil.validToken()) { // 如果有就直接到首页
 		// 	next()
        //     util.unmask()
        // } else {
        //     util.error('没有获取到用户信息');
        //     next('/login');
        //     util.unmask()
        // }
    }
})
export default router
