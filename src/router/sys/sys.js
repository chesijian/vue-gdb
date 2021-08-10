
export default [
  // {
  //   path: '/form/page/html5',
  //   name: 'page-html5',
  //   meta: {
  //     title: '打印预览'
  //   },
  //   component: resolve => require(['@/sys/report/html5.vue'], resolve)
  // },
  {
    path: '/form/query/:formKey',
    name: 'form-query',
    meta: {
      // title: '表单查询'
    },
    component: () => import('@/common/form/form-view/form-view.vue')
  },
  // {
  //   path: '/form/edit/:formKey',
  //   name: 'form-edit',
  //   meta: {
  //     // title: '表单编辑'
  //   },
  //   component: () => import('@/common/form/form-edit/form-edit.vue')
  // },
  {
    path: '/form/config/edit/:formKey',
    name: 'form-config',
    meta: {
      title: '表单管理'
    },
    component: () => import('@/sys/form-v2/form-config/form-config.vue')
  },
  {
    path: '/manage/run',
    name: 'api-run',
    meta: {
      title: '调试运行'
    },
    component: resolve => require(['@/sys/api-manage/api-run/api-run.vue'], resolve)
  },
  {
    path: '/sys/org/auth-config',
    name: 'sys/org/auth-config',
    meta: {
      title: '权限设置'
    },
    // component: resolve => require(['@/sys/org/authConfig/auth.vue'], resolve)
    component: resolve => require(['@/components/sys/roleAuth.vue'], resolve),
  },
  // {
  //   path: '/form/upload',
  //   name: 'form-upload',
  //   meta: {
  //     title: '表单上传'
  //   },
  //   component: () => import('@/sys/form-v2/form-upload/index.vue')
  // },
  // {
  //   path: '/sys/wf/manage',
  //   name: '/sys/wf/manage',
  //   meta: {
  //     title: '流程管理'
  //   },
  //   component: resolve => require(['@/sys/wf/manage/workflow-manage.vue'], resolve)
  // }

]
