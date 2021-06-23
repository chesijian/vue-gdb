export default [
    {
            path: '/common/select-user',
            name: 'common/select-user',
            meta: {
                title: '选人',
            },
            component: resolve => require(['@/common/select-user/select-user.vue'], resolve)
        },
        {
            path: '/common/select-depart',
            name: 'common/select-depart',
            meta: {
                title: '选部门',
            },
            component: resolve => require(['@/common/select-depart/select-depart.vue'], resolve)
        },
        {
            path: '/common/select-position',
            name: 'common/select-position',
            meta: {
                title: '选岗位',
            },
            component: resolve => require(['@/common/select-position/select-position.vue'], resolve)
        },
        {
            path: '/common/select-role',
            name: 'common/select-role',
            meta: {
                title: '选角色',
            },
            component: resolve => require(['@/common/select-role/select-role.vue'], resolve)
        },
        {
            path: '/common/select-project',
            name: 'common/select-project',
            meta: {
                title: '选项目',
            },
            component: resolve => require(['@/common/select-project/select-project.vue'], resolve)
        }
]
