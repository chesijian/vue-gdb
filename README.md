# zhuzhu

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


##2019-3-6 update by Blueeyedboy
###修改视频监控页面monitoring/monitoringIndex.vue
  修改在线和离线状态改为用status == '1'来判断
  修改获取直播地址接口成功后拼接地址
    let hostURL =res.data.hostURL;
    this.UrlStr=hostURL + res.data.url;

##2019-7-8 update by Blueeyedboy
表单增加字段来源是下周一，并且规则计算增加调用日期相加，规则计算增加当前周，当前年，当前月，例如质量检查计划中标题 = [当前年]+'年'+[当前月]+'月'+'第'+[当前周]+'周'+'质量检查'+[计划类型]
表单修改computeRuleComputeConfig规则计算如果是loadData后执行且目标字段值不为空，一般是表单修改时，不执行规则计算
util.js增加获取下周一，日期相加的方法
修改明细表样式display: flex;flex-flow: column，解决合计无法显示问题
修改grid-table中.jr-query-form{
                 display: inline-grid;
               } 解决苹果系统中模糊查询行无法正常显示
修改明细表支持隐藏TopButton和CellButton

##2019-7-10 update by Blueeyedboy
修改cmp-loader在createElement增加ref设定，在方法中增加获取弹框选中数据的方法getSelectedData (index)
query-form增加topButtons渲染时增加|| button.hidden === 0，当topButton触发弹框时调用父组件grid-tree-table处理
grid-tree-table增加对query-form监听handlerTopButtonClick，对于openDialog增加确定取消按钮，并且增加确定时调用获取弹框的选中数据
修改form-view增加拷贝属性desFormKey传参，并且在getSelectedData中增加index索引
query-form中去掉topButtons中关于单选和多选的判断
修改列表关于单选和多选对于getSelected的影像，全部使用selection,并且修改cellClick阻止冒泡
form-render增加拷贝树表数据方法copyTreeData
修改全局样式jrstyle.css中关于表格数据.el-table .cell，单元格数据长度过长则隐藏不换行



##2019-7-11 update by Blueeyedboy
修改grid-tree-table中loadData传参queryParams,只传递参数，不传递表单字段,解决api等数据无法查看的问题
修改顺丰下拉选择项目设置到全局sessionProj
修改proj.vue切换项目changeVideo中增加把项目信息存到session

##2019-7-12 update by Blueeyedboy
修改grid-tree-table中如果是树则不显示序号
修改如果是拷贝按钮单击，则可以通过this.queryParams替换desQueryParams,解决企业库动态传参
修改grid-tree-table中loadData传参queryParams,只传递参数，不传递表单字段,解决api等数据无法查看的问题
修改form-edit中select-user-list增加color为黑色，
修改form-edit中修改loadData中关于mainData处理改为合并，并修改select-date-time时把后台label值赋值本身，解决日期时间控件解析long型时间报错

##2019-7-13 update by Blueeyedboy
修改form-view对于左右联动时singleSelect和multipleSelect各自维护queryForm[index],并且默认左边singleSelect是true,如果需要左侧显示复选框时根据表单传参_this.queryForm[1].showCheckBox = this.assignShowCheckBox[_this.queryForm[1]['tableName']] === undefined? false :this.assignShowCheckBox[_this.queryForm[1]['tableName']]
修改grid-tree-table复选框只有在多选multipleSelect还有showCheckBox时显示，修改操作按钮增加条件!readOnly && !singleSelect && !multipleSelect，修改init中关于TopButtons也增加上述条件
增加树控件，修改按钮控制逻辑，及修改样式
修改gridMixin初始化emptyText为空，修改rowClick方法关于树，树表，类表的选中判断

##2019-7-15 update by Blueeyedboy
修改树控件默认不支持拖拽，修改gridMixin中关于getRouteConfigByName的逻辑
修改form-edit中选人列表增加procUser.userName非空判断，在初始化获取数据时增加初始化空数组

##2019-7-24 update by Blueeyedboy
修改gridMixin和form-render中复制拷贝树节点方法中传参

##2019-7-25 update by Blueeyedboy
主表字段配置增加常量本月第一天，本月最后一天，下月第一天，下月最后一天，
util中增加第一天和最后一天的计算
form-edit增加规则计算支持计划日期和结束日期根据计划类型计算，参照质量检查计划

##2019-8-6 update by Blueeyedboy
修改form-view.vue,gridMixin.js,form-view/mixin.js中级联页面的逻辑，修改级联新增表单的逻辑
修改form-view多层结构在init方法中是最顶层单选和多选进行判断
修改grid-tree-table和tree中handlerParentClick中设置this.rootId = null
修改util.js中request关于后台status的判断
修改grid-tree-table在初始化中对于下拉框字段，渲染dicMap时判断是否整型，解决无法显示问题
修改form-view级联页面时如果上下结构多个子表，工具栏的位置问题
修改form-edit保存校验时，如果是下拉框为整型的判断逻辑解决，无法保存问题

##2019-8-7 update by Blueeyedboy
修改form-view修改根节点样式width:100%
修改grid-tree-table中分页的样式，和loading的样式


##2019-8-12 update by Blueeyedboy
修改明细表edit-table增加 show-overflow-tooltip属性，修改表达式计算增加日期支持
修改组织架构新增用户时对于签名图片逻辑处理解决新增js报错
修改query-form中导出时对数组进行深度拷贝
修改选择部门的样式

##2019-8-18 update by Blueeyedboy
修改const.js表单增加EDIT_RENDER编辑时渲染事件
修改edit-table.vue中单元格中删除增加scope.row
修改form-edit中loadData之后判断流程状态，如果不为空则设置this.readOnly = true
修改edit-table中loadData中如果有业务id则增加判断编辑初始化事件，增加单元格编辑时判断如果明细表数据中PROC_STATUS_ 有值则不能编辑
修改edit-table中初始化queryColumns，避免重复加载上次初始化的数据

##2019-8-19 update by Blueeyedboy
修改edit-table中明细表选择回填因调用deleteRow删除空行无法传参row导致报错问题
引入tree-table-vue
  npm i tree-table-vue -S

##2019-8-20 update by Blueeyedboy
顺丰新增权限控制页面和菜单管理页面
修改index.html指定app_id = 02
main.js引入tree-table-vue
login.vue中登录之后去掉initAuths
修改菜单管理和权限设置的路由
修改util.js中request增加appId传参，修改initSession和initAuths和isAllowMenu方法
util.js增加是否isAllowAdd, isAllowEdit,isAllowDelete,isAllowExport按钮权限判断

##2019-8-26 update by Blueeyedboy
修改store增加加同步获取权限getFormAuths的方法，调用接口
修改util增加权限控制的方法isAllowAdd, isAllowEdit,isAllowDelete,isAllowExport等
修改proj.vue中关于组织架构，数据字典，菜单管理等权限控制的判断，修改 class="proj-box"中overflow:auto
修改进度管理中添加按钮权限控制
修改检查项设置checkSet中关于增删改查导出的按钮权限控制

##2019-9-20 update by Blueeyedboy
修改grid-tree-table中弹框增加class="openDialog",并在zzStyle中增加相关样式，解决弹框最大化时样式错乱

##2019-9-23 update by Blueeyedboy
升级表单
修改全局样式zzStyle
  .openDialog .el-input__inner {
    background: transparent;
    border: 1px solid #dcdfe6;
    min-height: 32px;
    color: #000!important;
    font-size: 14px;
    width: 100%;
    height: 100%;
  }

##2019-9-26 update by Blueeyedboy
顺丰修改全局样式.openDialog .edit-val,解决企业标准库维护弹框中树表显示错误
顺丰增加流程配置页面，配置工作联系单流程
顺丰升级表单中如果没有配置流程不显示流程监控
顺丰升级表单中如果没有配置流程不显示流程监控

##2019-9-25 update by Blueeyedboy
顺丰修改全局样式.openDialog .edit-val,解决企业标准库维护弹框中树表显示错误
顺丰增加流程配置页面，配置工作联系单流程
顺丰升级表单中如果没有配置流程不显示流程监控
顺丰升级表单中如果没有配置流程不显示流程监控

##2019-9-26 update by Blueeyedboy
修改zzStyle中.openDialog .edit-val解决明细表无法编辑问题
修改明细表增加loading控制
修改grid-tree-table全屏弹框是设置display:flex等样式，解决页面无法显示完整问题
修改zzStyle中.openDialog .edit-val解决企业库维护无法显示

##2019-9-27 update by Blueeyedboy
优化webpack打包，增加gzip
  npm install --save-dev compression-webpack-plugin@1.1.11
修改顺丰index.html中去掉视频播放的引入
修改顺丰main.js去掉关于GridTable和SimpleTreeTable的引入

##2019-10-10 update by Blueeyedboy
修改角色授权中角色列表不包含内置超级管理员和公司管理员
修改组织架构管理中用户授权角色显示内置角色，并且修改应用的角色组件改为select-role,解决已选中组件无法选中
修改proj.vue中摆到你管理和菜单管理的权限控制改为sessionUtil.isAdmin()

##2019-10-14 update by Blueeyedboy
1.修改角色授权页面，不显示内置公司管理员角色
2.修改gridMixin增加列中标签控制不能单击，需要再表单配置如下：发布,1;取消发布,2;已发布,5,0;此时，标签未已发布时无法点击
3.增加附件工具类attachment.js
4.修改tag的样式

##2019-10-15 update by Blueeyedboy
1.修改质量检查-检查项设置中导入功能，逻辑为，如果多个业态，客户先选择业态，然后加载选择的企业库目录（t_gdb_jcbz_company），然后调用通用拷贝到目标（t_inspect_item），需要配置后台sys_copy_mapping相关表，
2.修改检查项设置导入兼容安全检查，let desId = this.itemParentObj.id.indexOf('root_')>-1?'root'
3.修改实测-检查设置中导入功能跟质量检查一致
4.修改质量检查、安全检查、工序管理、实测导入功能

##2019-10-16 update by Blueeyedboy
修改组织架构添加用户默认性别是男
修改前台proj.vue支持查看日志功能

##2019-10-17 update by Blueeyedboy
解决计划编制新增页面里的“选择区域检查项”按钮，弹框里面期望：叶子节点前面，不要那个展开的按钮
  修改select-areaItem增加isLeaf: 'leaf'
  companyProps: {
    children: 'children',
    label: 'itemName',
    isLeaf: 'leaf'
  }
修改项目立项添加了参建单位后，不用填写信用代码也能保存，修改项目头像提示

##2019-10-18 update by Blueeyedboy
1.修改流程启动规则配置包含复选框时value保存的label的bug
2.表单配置字段配置中触发api接口支持下拉框多选

##2019-10-21 update by Blueeyedboy
修改甘特图前端修改添加任务，修改任务、删除任务监听，增加根据权重和进度递归计算上级进度，修改批量设置子节点不需要再次展开，增加leaf

##2019-10-22 update by Blueeyedboy
修改gridMixin中dicValue支持空值默认值的显示
修改form-config解决事件监听无法删除的问题

##2019-10-23 update by Blueeyedboy
修改工序管理工序导入，如果没有企业库提示
修改util.js中request请求解决无权限删除退出登陆问题

##2019-10-24 update by Blueeyedboy
前端增加表单安装页面，并且增加路由/form/upload，开发人员可以直接访问该路由安装表单

##2019-10-25 update by Blueeyedboy
增加退出登录重置store的功能

##2019-10-28 update by Blueeyedboy
修改前端login.vue，引入import {encrypt} from "../../plugins/crypto-js";
  npm i --save crypto-js

##2019-10-29 update by Blueeyedboy
修改组织架构中密码配置增加强度
修改登陆增加验证码
修改前端不再url中传递access_token改为在headers中传递

##2019-10-30 update by FeiQqin
解决流程审批状态生成报表无法显示问题
修改高级查询点击全部查询逻辑

##2019-12-27

