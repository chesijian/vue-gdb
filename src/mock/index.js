//引入mockjs
const Mock = require('mockjs')

//响应模拟数据
Mock.mock('http://api.com', {
    "status":200,
    "data|5-100": [{
        'roleName': '@ctitle(3, 5)',   //中文名称
        'age|1-100': 100,   //100以内随机整数
        'birthday': '@date("yyyy-MM-dd")',  //日期
        'remark': '@csentence'   //中国城市
    }]
});

Mock.mock('http://api.com/api_v1/org/roles', {
    "status":200,
    "data|5-100": [{
        'roleName': '@ctitle(3, 5)',   //中文名称
        'age|1-100': 100,   //100以内随机整数
        'birthday': '@date("yyyy-MM-dd")',  //日期
        'city': '@city(true)'   //中国城市
    }]
});