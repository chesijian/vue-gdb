<template>
  <div style="position:relative;" class="wf-container">
    <message :models="deleteMsg"></message>

    <div v-if="isAddFormShow">
      <div class="mask" @click.stop.prevent="cancel"></div>
      <div class="boxs">
        <h4 style="margin:20px 0;"><i></i>添加流程</h4>
        <div>
          <div class="add-from">
            <div class="add-from-left">
              <div class="add-from-label">流程名称</div>
              <div class="add-from-input">
                <input type="text" v-model="addObject.name">
              </div>
            </div>
            <div class="add-from-right">
              <div class="add-from-label">表单名称</div>
              <div class="add-from-input add-from-disable">
                <input type="text" disabled style="background: #F4F4F4;" v-model="selectNode.formName">
              </div>
            </div>
          </div>
          <div class="add-from">
            <div class="add-from-left">
              <div class="add-from-label">适用部门</div>
              <div class="add-from-input add-from-input-img" @click="selectQuerterShow()">
                <span v-for="(item, index) in addObject.selectQuertersModelsselectList" :key="index">{{item.label}}<span
                  v-if="addObject.selectQuertersModelsselectList&&addObject.selectQuertersModelsselectList.length>1&&(index+1)!=addObject.selectQuertersModelsselectList.length">,</span></span>
              </div>
            </div>
            <div class="add-from-right">
              <div class="add-from-label">适用人员</div>
              <div class="add-from-input add-from-input-img" @click="selectMemberShow()">
                <span v-for="(item, index) in addObject.selectMemberModelsselectList"
                      :key="index">{{item.userName}}<span
                  v-if="addObject.selectMemberModelsselectList&&addObject.selectMemberModelsselectList.length>1&&(index+1)!=addObject.selectMemberModelsselectList.length">,</span></span>
              </div>
            </div>
          </div>
          <div class="add-from">
            <div class="add-from-left">
              <div class="add-from-label">发布日期</div>
              <div class="add-from-input add-from-disable">
                <input type="text" disabled style="background: #F4F4F4;" v-model="addObject.updateTime">
              </div>
            </div>
            <div class="add-from-right">
              <div class="add-from-label">添加人</div>
              <div class="add-from-input add-from-disable">
                <input type="text" disabled style="background: #F4F4F4;" v-model="addObject.myself">
              </div>
            </div>
          </div>
          <div class="add-from">
            <div class="add-from-left">
              <div class="add-from-label">说明</div>
              <div class="add-from-input">
                <input type="text" v-model="addObject.description">
              </div>
            </div>
            <div class="add-from-right">
              <div class="add-from-label">修改人</div>
              <div class="add-from-input add-from-disable">
                <input type="text" disabled style="background: #F4F4F4;" v-model="addObject.updateUserName">
              </div>
            </div>
          </div>
          <div class="add-from">
            <div class="add-from-left">
              <div class="add-from-label">设置监听</div>
              <el-button type="primary" @click="openListenerConf('PROCESS',addObject)">设置监听</el-button>
            </div>
            <div class="add-from-right">
              <div class="add-from-label">是否启用</div>
              <div style="box-sizing: border-box;padding-top: 9px;">
                <el-switch
                  v-model="addObject.enable"
                  :active-color="bgColor"
                  @change="qiyong"
                >
                </el-switch>
              </div>
            </div>
          </div>

        </div>
        <div class="footer">
          <el-button @click="cancel" size="small">关闭</el-button>
          <el-button type="warning" size="small" @click="success">确定</el-button>
        </div>
      </div>
    </div>
    <div class="aside">
        <div class="aside-title">
            <h4>表单名称</h4>
        </div>
        <div class="aside-wrap">
            <asideItem  v-for="(item, index) in models"  :key="index" :models="item" :level="0" :btnFlag="false" :selectProjectNode="selectProjectNode"></asideItem>
        </div>
    </div>
    <div class="unit-com">
      <div class="top">
        <h4 style="margin: 20px 0;"><i></i>流程名称
          <div class="content-button">
            <div class="input"><input type="text" @keydown.enter="loadData()" placeholder="搜索">
              <button @click="loadData()"></button>
            </div>
            <div>
              <button><img src="@/assets/common/add.png" @click="addWorkflow" alt=""></button>
              <button><img src="@/assets/common/edit.png" @click="editWorkflow" alt=""></button>
              <!-- <button v-if="isEdit"><img src="../../assets/common/save2.png" @click="saveWorkflow" alt=""></button> -->
              <button><img src="@/assets/common/delete.png" @click="deleteWorkflow" alt=""></button>
            </div>
          </div>
        </h4>
        <div class="manu-table manu-table1">
          <el-table ref="multipleTable" :data="manuList"
                    border
                    height="275"
                    @current-change='nodeLIstShow'
                    :cell-style="{textAlign:'center',}"
                    highlight-current-row
                    :header-cell-style="headerCell"
          >
            <!-- @selection-change="handleSelectionChange"> -->
            <!-- <el-table-column type="selection" width="50" ></el-table-column> -->
            <el-table-column label="流程名称">
              <template slot-scope="scope">
                <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;">
                  <span>{{scope.row.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="表单名称">
              <template slot-scope="scope">
                <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;">
                  <span>{{selectNode.formName}}</span>
                </div>
                <!-- <div>
                    <input style="white-space: nowrap;text-align:left;" disabled="disabled"  v-model="selectNode.formName">
                </div> -->
              </template>
            </el-table-column>
            <el-table-column label="是否启用" width="80">

              <template slot-scope="scope">

                <div>
                  <el-switch
                    v-model="scope.row.enable"
                    :active-color="bgColor"
                    :disabled="true"
                  >
                  </el-switch>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="流程权限">
              <template slot-scope="scope">
                <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;">
                  <span v-for="(item, index) in scope.row.authList" :key="index"
                        style="margin-right:3px">{{item.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="发布日期" width="100">
              <template slot-scope="scope">
                <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;">
                  <span>{{scope.row.updateTime}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="修改人">
              <template slot-scope="scope">
                <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;">
                  <span>{{scope.row.updateUserName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="高级设置">
              <template slot-scope="scope">
                <p class="operation">
                  <img src="../../../assets/administrationIcon/edit1.png" style="vertical-align: initial;" @click="handlerModelExtendSet(scope.row)"
                       alt="">
                </p>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </div>
      <div class="">
        <div style="margin: 20px 0;height:31px" class="title clearfix ">
          <div class="tab">
            <div @click="changetab('流程节点')" style="padding-left:0"
                 :style="{color:(activeName=='流程节点'?bgColor:'#999'),borderBottomColor:(activeName=='流程节点'?bgColor:'transparent')}">
              <span :class="{active:activeName=='流程节点'}">流程节点</span>
            </div>
            <div @click="changetab('流程图')"
                 :style="{color:(activeName=='流程图'?bgColor:'#999'),borderBottomColor:(activeName=='流程图'?bgColor:'transparent')}">
              <span :class="{active:activeName=='流程图'}">流程图</span>
            </div>
          </div>
          <div class="content-button" v-if="activeName=='流程节点'">
            <div>
              <button><img src="@/assets/common/add.png" @click="addNode" alt=""></button>
              <button v-if="!isStartEdit"><img src="@/assets/common/save.png" alt=""></button>
              <button v-if="isStartEdit"><img src="@/assets/common/save2.png" @click="saveNode('保存')" alt=""></button>
              <button><img src="@/assets/common/delete.png" @click="deleteNode" alt=""></button>
            </div>
          </div>
          <div v-if="activeName=='流程图'"
               style=" height: 432px;float: left;margin-top: 30px;margin-left: 50px;">
            <div style="">
              <img :src="pngSrc"/>
            </div>
          </div>
        </div>
        <div class="manu-table" v-if="activeName=='流程节点'">
          <el-table ref="multipleTable" :data="nodeList"
                    border
                    height="275"
                    :cell-style="{textAlign:'center'}"
                    highlight-current-row
                    :header-cell-style="headerCell"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column label="环节名称">
              <template slot-scope="scope">
                <div>
                  <input style="white-space: nowrap;text-align:left;" @focus="isStartEdit=true"
                         v-model="scope.row.name">
                </div>
              </template>
            </el-table-column>
            <el-table-column label="下一步骤">
              <template slot-scope="scope">
                <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;">
                  <input type="text" @onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" @focus="isStartEdit=true"
                         v-model="scope.row.nextNameStrs">
                </div>
              </template>
            </el-table-column>
            <el-table-column label="审批人设置">
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.userNameStr" placement="top">
                  <div :title="scope.row.userNameStr"
                    style="white-space: nowrap;text-align:left;background:#fff;text-overflow: ellipsis;overflow: hidden;">
                  <span v-for="(item, index) in scope.row.UserNameList" :key="index">{{item.name}}<span
                    v-if="scope.row.UserNameList.length!=index+1">,</span></span>
                  </div>
                </el-tooltip>

              </template>
            </el-table-column>
            <el-table-column label="抄送人设置">
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.copyUserNameStr" placement="top">
                  <div title="scope.row.copyUserNameStr"
                  style="white-space: nowrap;text-align:left;background:#fff;text-overflow: ellipsis;overflow: hidden;">
                  <span v-for="(item, index) in scope.row.CopyUserNameList" :key="index">{{item.name}}<span
                    v-if="scope.row.CopyUserNameList.length!=index+1">,</span></span>
                </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="是否会签" width="80">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.index!=1"
                           v-model="scope.row.ifMultiInst"
                           :active-color="bgColor"
                           @change="huiqian(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="处理人" width="150">
              <template slot-scope="scope">
                <div class="operation">
                  <span v-if="scope.row.index!=1"><span style="white-space: nowrap;text-align:left;"
                                                        @click="xuanren(scope.row)" :style="{color:bgColor}">选人</span> |</span>
                  <span v-if="scope.row.index!=1"><span style="white-space: nowrap;text-align:left;"
                                                        @click="xuanshangji(scope.row)"
                                                        :style="{color:bgColor}">选上级</span> |</span>
                  <span v-if="scope.row.index!=1"style="white-space: nowrap;text-align:left;" :style="{color:bgColor}"
                        @click="selectRole(scope.row,1)">角色</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="抄送人" width="150">
              <template slot-scope="scope">
                <div class="operation">
                  <span style="white-space: nowrap;text-align:left;" :style="{color:bgColor}"
                        @click="copyPeople(scope.row)">选人</span> </span> |</span>
                  <span style="white-space: nowrap;text-align:left;" :style="{color:bgColor}"
                        @click="selectRole(scope.row,4)">角色</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <div class="operation">
                  <span style="white-space: nowrap;text-align:left;" :style="{color:bgColor}"
                        @click="openListenerConf('TASK',scope.row)">监听</span>
                  <span v-if="scope.row.index!=1" style="white-space: nowrap;text-align:left;margin-left: 10px" :style="{color:bgColor}"
                        @click="openFormAuthConf(scope.row)">表单权限</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 选角色 -->
    <selectRole v-if="selectRoleModels.isShow" :selectRoleModels="selectRoleModels"></selectRole>
    <selectMember v-if="selectMemberModels.isShow" :selectMemberModels='selectMemberModels'></selectMember>
    <selectQuerters v-if="selectQuertersModels.isShow" :selectQuertersModels='selectQuertersModels'></selectQuerters>
    <div v-if="formAuthConfVisible">
    <div class="mask" @click.stop.prevent="cancel"></div>
    <div class="boxs" style="    height: 438px;">
      <h4 style="margin:20px 0;margin-bottom: 10px"><i></i>{{currentNode.name}}-表单权限

      </h4>
      <div>
        <wf-form-auth ref="form-auth" :formKey="selectNode.formKey" :node="currentNode" style="height: 336px;"></wf-form-auth>
        <div class="footer">
          <button @click="formAuthConfVisible = false;" type="button"
                  class="el-button el-button--default el-button--small">
            <span>取消</span></button>
          <button @click="saveFormAuth()" type="button" class="el-button el-button--warning el-button--small">
            <span>确定</span></button>
        </div>
      </div>
    </div>
  </div>

    <div v-if="listenerConfVisable">
      <div class="mask" @click.stop.prevent="cancel"></div>
      <div class="boxs" style="">
        <h4 style="margin:20px 0;"><i></i>流程监听配置
          <div class="content-button" sttle="margin-bottom: 10px;margin-right:10px;">
            <div>
              <button><img src="@/assets/common/add.png" @click="listeners.push({})" alt=""></button>
              <button style="border-right: 1px solid #c4c4c4;"><img src="@/assets/common/delete.png" @click="deleteListener"
                                                                    alt=""></button>
            </div>
          </div>
        </h4>
        <div>

          <el-table
            class="table-change"
            :data="listeners"
            style="width: 100%"
            @current-change="handlerListenerSelect"
            :header-row-style="{background:fontColor,overflow:'hidden',}" border height="225"
            :row-style="{overflow:'hidden',height:'70px;'}" :cell-style="{textAlign:'center',}"
            :header-cell-style="{background:fontColor,height:'45px',padding:0,textAlign:'center',color:'#333',fontWeight:'400'}">
            <el-table-column type="index" width="57" label="序号"></el-table-column>
            <el-table-column label="事件类型" prop="event" width="200">
              <template slot-scope="scope">
                <div>
                  <el-select v-model="scope.row.event" placeholder="Select">
                    <el-option
                      v-for="item in listererType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="事件类名" prop="clazz">
              <template slot-scope="scope">
                <div>
                  <input style="width: 100%;height: 23px;white-space: nowrap;text-align:left;background:#fff;"
                         v-model="scope.row.clazz">
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <button @click="listenerConfVisable = false;" type="button"
                    class="el-button el-button--default el-button--small">
              <span>取消</span></button>
            <button @click="saveListener()" type="button" class="el-button el-button--warning el-button--small">
              <span>确定</span></button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showRuleSetting">
      <div class="mask" @click.stop.prevent="cancel"></div>
      <div class="boxs" style="width:1060px;height:600px;">
        <h4 style="margin:20px 0;"><i></i>高级配置</h4>
        <div style="height: 500px;overflow: auto;">
          <wf-rules :model="ruleSettingModel"></wf-rules>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import selectRole from '@/common/select-role/select-role.vue'
  import selectMember from "@/common/select-user/select-user.vue";
  import selectQuerters from "@/common/select-depart/select-depart.vue";
  import message from '@/common/business/message.vue'
  import WfRules from '@/sys/wf/manage/wf-rules/wf-rules.vue'
  import asideItem from '@/common/base/asideItemTree/asideItem.vue'
  import {tableMixin} from '../../../public/js/mixins.js'
  import WfFormAuth from '@/sys/wf/manage/wf-form-auth/index.vue'

  export default {
    mixins:[tableMixin],
    data() {
      return {
        ruleSettingModel: null,
        showRuleSetting: false,
        taskListererType: [{label: '创建', value: 'create'}, {label: '设置处理人', value: 'assignment'}, {
          label: '完成',
          value: 'complete'
        }, {label: '删除', value: 'delete'}],
        processListererType: [{label: '启动', value: 'start'}, {label: '结束', value: 'end'}],
        listererType: this.taskListererType,
        listererObj: null,
        selectedListener:null,
        formAuthConfVisible:false,
        currentNode:null,
        formAuthList:[],
        listeners: [],
        listenerConfVisable: false,
        pngSrc: '',
        selectQuertersModels: {
          isShow: false,
          selectList: [],
          callBack: this.QuertersCallBack,
          radioSelectFlags: false,
        },
        selectMemberModels: {
          isShow: false,
          selectList: [],
          callBack: this.memberCallBack,
          radioSelectFlags: false,
        },
        selectRoleModels: {// 角色控件
          isShow: false,
          selectList: [],
          callBack: this.selectRoleCallBack,
          radioSelectFlags: false
        },
        activeName: '流程节点',
        selectNode: '',
        addObject: {},
        manuSelectNode: {},
        isEdit: false,
        isStartEdit: false,
        isAddFormShow: false,
        deleteFlag: false,
        searchText: '',
        deleteMsg: {
          show: false,
          title: '',
          content: '',
          callback: this.callback,
        },
        manuList: [],
        nodeList: [],
        selectList: [],
        // selectList1:[],
        models: [],
        user: {},
        isNodeChange: false,
        operationNode: {},
        operationNum: 0,
        selectProjectNode: {
          id: ''
        },
      }
    },
    components: {
      WfRules,WfFormAuth,asideItem, message, selectMember, selectQuerters,selectRole
    },
    created() {
      this.bgColor = this.$store.state.themeColor
      this.fontColor = this.$store.state.themeBG
      this.$bus.on('handelDepart', this.changeFormKey);
      this.user = this.sessionUtil.getUser()
      this.loadData()
    },
    beforeDestroy() {
      this.$bus.off('handelDepart', this.changeFormKey)
    },
    methods: {
      qiyong() {
        this.manuSelectNode.enables = !this.manuSelectNode.enables;
        this.$forceUpdate()
      },
      huiqian(node) {
        console.log(node.num)
        node.num = node.num + 1
        if (node.num % 2 == 0) {
          this.isNodeChange = false;
        } else {
          this.isNodeChange = true;
        }

        this.isStartEdit = true
      },

      xuanren(node) {
        this.isStartEdit = true
        this.operationNode = node;
        this.operationNum = 1;
        this.selectMemberModels.isShow = true;
        let selectList = []
        let userList = undefined
        let category = 1
        let type = 0
        let nameField = 'userName'
        // 判断是否处理人
        if(this.operationNum === 1){
          category = 1
          userList = this.operationNode.UserNameList
        }else{
          // 抄送
          category = 2
          userList = this.operationNode.CopyUserNameList
        }
        userList.forEach(item=>{
          // 判断是否角色
          if(item.type === type){
            let o = {
              id: item.value
            }
            o[nameField] = item.name
            selectList.push(o)
          }
        })
        console.log('---------xuanren-----------',this.operationNode,userList,selectList)

        this.selectMemberModels.selectList = selectList
      },
      selectRole(node, operationNum) {
        this.isStartEdit = true
        this.operationNode = node;
        this.operationNum = operationNum;
        this.selectRoleModels.radioSelectFlags = false
        let selectList = []
        let userList = undefined
        let category = 1
        // 判断是否处理人
        if(this.operationNum === 1){
          category = 1
          userList = this.operationNode.UserNameList
        }else{
          // 抄送
          category = 2
          userList = this.operationNode.CopyUserNameList
        }
        if(userList === undefined){
          userList = []
        }
        userList.forEach(item=>{
          // 判断是否角色
          if(item.type === 5){
            selectList.push({
              id: item.value,
              roleName: item.name
            })
          }
        })
        console.log('---------selectRole-----------',this.operationNode,userList,selectList)

        this.selectRoleModels.selectList = selectList
        this.selectRoleModels.isShow = true
      },
      // 选角色回调函数
      selectRoleCallBack () {
        let vm = this
        /*if (this.selectRoleModels.selectList.length == 0) {
          this.util.warn('请至少选择一个角色！')
          return false
        }*/
        let userList = undefined
        let category = 1
        // 判断是否处理人
        if(this.operationNum === 1){
          category = 1
          userList = this.operationNode.UserNameList
        }else{
          // 抄送
          category = 2
          userList = this.operationNode.CopyUserNameList
        }
        if (!userList) {
          userList = []
        }
        if(this.selectRoleModels.selectList  && this.selectRoleModels.selectList.length>0){
          this.selectRoleModels.selectList.forEach(role => {
            let find = userList.find(item => {
              // 判断角色是否存在
              if(item.type === 5 && item.value === role.id){
                return true
              }
              return false
            })
            if(!find){
              var o = {}
              o.category = category
              o.relationType = 0
              o.type = 5
              o.name = role.roleName
              o.value = role.id;
              userList.push(o)
            }

            // 判断是否有删除
            userList = userList.filter(item => {
              if(item.type === 5){
                // 判断角色是否存在
                let find = this.selectRoleModels.selectList.find(role => {
                  // 判断角色是否存在
                  if(item.value === role.id){
                    return true
                  }
                  return false
                })
                if(find){
                  return true
                }else{
                  return false
                }
              }else{
                return true
              }
            })

          })
        }else{
          // 说明是清空角色数据
          userList = userList.filter(item=>{
            return item.type !== 5
          })
        }
        console.log('---------userList--------',userList)
        this.selectRoleModels.isShow = false
        let userNameArr = []
        userList.forEach(item =>{
          userNameArr.push(item.name)
        })
        // 判断是否处理人
        if(this.operationNum === 1){
          this.operationNode.UserNameList = userList
          this.operationNode.userNameStr = userNameArr.join(',')
        }else{
          // 抄送

          this.operationNode.CopyUserNameList = userList
          this.operationNode.copyUserNameStr = userNameArr.join(',')
        }

      },
      xuanshangji(node) {
        this.isStartEdit = true
        this.operationNode = node
        var obj
        if (!this.operationNode.UserNameList) {
          this.operationNode.UserNameList = []
          this.operationNum = 4;
          var o = {}
          o.category = 1
          o.relationType = 1
          o.type = 1
          o.name = '直接上级';
          o.value = 'currentUser';
          this.operationNode.UserNameList.push(o)
        } else {
          obj = this.operationNode.UserNameList.find(item => item.value == 'currentUser')
          if (!obj) {
            this.operationNum = 4;
            var o = {}
            o.category = 1
            o.relationType = 1
            o.name = '直接上级';
            o.type = 1
            o.value = 'currentUser';
            this.operationNode.UserNameList.push(o)
          }else{
            this.operationNode.UserNameList =  this.operationNode.UserNameList.filter(item => {return item.value !== 'currentUser'})
          }
        }

        let userNameArr = []
        this.operationNode.UserNameList.forEach(item =>{
          userNameArr.push(item.name)
        })

        this.operationNode.userNameStr = userNameArr.join(',')
        this.$forceUpdate()
        //console.log(this.operationNode.UserNameList)

      },
      selectQuerterShow() {
        this.selectQuertersModels.isShow = true
        this.selectQuertersModels.selectList = [];
        this.$forceUpdate()
      },
      selectMemberShow() { // 选择适用人员
        this.operationNum = 0
        this.selectMemberModels.isShow = true;
        this.selectMemberModels.selectList = [];
        this.$forceUpdate()
      },
      copyPeople(node) {
        this.isStartEdit = true
        this.operationNode = node;
        this.operationNum = 4;
        this.selectMemberModels.isShow = true;
        this.selectMemberModels.selectList = [];
      },
      QuertersCallBack() {
        console.log(this.selectQuertersModels)
        this.addObject.selectQuertersModelsselectList = this.selectQuertersModels.selectList
        this.$forceUpdate()
      },
      memberCallBack() {
        let userList = undefined
        let category = 1
        let nameField = 'userName'
        let selectModel = this.selectMemberModels
        let selectModelList = selectModel.selectList
        // 处理人类型,默认是0；0表示普通用户（具体的人）；1表示流程环节处理人；3表示部门；4表示岗位；5表示角色；7表示表单字段参数
        let type = 0
        // 判断是否处理人
        if(this.operationNum === 1){
          category = 1
          userList = this.operationNode.UserNameList
        }else if(this.operationNum === 4){
          // 抄送
          category = 2
          userList = this.operationNode.CopyUserNameList
        }else if(this.operationNum === 0){
          this.addObject.selectMemberModelsselectList = this.selectMemberModels.selectList;
          this.$forceUpdate()
          return
        }
        if (!userList) {
          userList = []
        }
        if(selectModelList  && selectModelList.length>0){
          selectModelList.forEach(obj => {
            let find = userList.find(item => {
              // 判断人是否存在
              if(item.type === 0 && item.value === obj.id){
                return true
              }
              return false
            })
            if(!find){
              var o = {}
              o.category = category
              o.relationType = 0
              o.type = type
              o.name = obj[nameField]
              o.value = obj.id;
              userList.push(o)
            }

            // 判断是否有删除
            userList = userList.filter(item => {
              if(item.type === type){
                // 判断角色是否存在
                let find = selectModelList.find(obj => {
                  // 判断角色是否存在
                  if(item.value === obj.id){
                    return true
                  }
                  return false
                })
                if(find){
                  return true
                }else{
                  return false
                }
              }else{
                return true
              }
            })

          })
        }else{
          // 说明是清空角色数据
          userList = userList.filter(item=>{
            return item.type !== type
          })
        }
        console.log('---------userList--------',userList)
        selectModel.isShow = false
        let userNameArr = []
        userList.forEach(item =>{
          userNameArr.push(item.name)
        })
        // 判断是否处理人
        if(this.operationNum === 1){
          this.operationNode.UserNameList = userList
          this.operationNode.userNameStr = userNameArr.join(',')
        }else{
          // 抄送

          this.operationNode.CopyUserNameList = userList
          this.operationNode.copyUserNameStr = userNameArr.join(',')
        }
      },
      cancel() {
        this.addObject = {'enable':true};
        this.isAddFormShow = false
      },
      success() {
        var arr = []
        for (var index = 0; index < this.selectQuertersModels.selectList.length; index++) {
          var o = {}
          console.info(this.selectQuertersModels.selectList[index]);
          o.value = this.selectQuertersModels.selectList[index].id;
          o.name = this.selectQuertersModels.selectList[index].text;
          o.type = 3
          arr.push(o)
        }
        for (var j = 0; j < this.selectMemberModels.selectList.length; j++) {
          var o = {}
          o.value = this.selectMemberModels.selectList[j].id;
          o.name = this.selectMemberModels.selectList[j].userName;
          o.type = 1
          arr.push(o)
        }
        this.addObject.enable = this.manuSelectNode.enable = this.manuSelectNode.enables;
        var param = {
          name: this.addObject.name,
          modelId: this.addObject.modelId,
          formKey: this.selectNode.formKey,
          enable: this.addObject.enable ? 1 : 0,
          newFlag: !this.isEdit,
          listenerList: this.addObject.listenerList,
          authList: arr,
          description: this.addObject.description,
        }
        console.log(param)
        this.util.restPost('/api_v1/wf/model/simple', param, (res) => {
          //console.log(res)
          if (res.status == 200) {
            if (this.isEdit) {
              this.util.success('修改成功')
            } else {
              this.util.success('保存成功')
            }
            this.addObject = {}
            this.loadData()
            this.cancel()
          } else {
            this.util.error(res.msg)
          }
        })
      },
      nodeLIstShow(node) {
        if (node) {
          this.manuSelectNode = node
          this.changetab(this.activeName)
          this.isNodeChange = false;
        }
      },
      handleSelectionChange(val) {
        this.selectList = val
      },
      changetab(str) {
        if (!this.validUtil.isNotEmpty(this.manuSelectNode.modelId)) {
          this.util.warn('请选择流程！');
          return;
        }
        this.activeName = str
        if (str == "流程图") {

          this.pngSrc = this.util.getBaseUrl() + "/api_v1/wf/png?modelId=" + this.manuSelectNode.modelId + "&access_token=" + this.sessionUtil.getAccessToken();

        } else {
          var param = {
            modelId: this.manuSelectNode.modelId//,profDefId:this.manuSelectNode.procDefId,
          }
          //console.log(param)
          this.util.restGet('/api_v1/wf/model/simple/{modelId}', param, (res) => {
            if (res.status == 200) {
              for (var i = 0; i < res.data.nodeList.length; i++) {

                var strName = '';
                // var strUserName=''
                // var strCopyUserName=''
                res.data.nodeList[i].oldName = res.data.nodeList[i].name;
                res.data.nodeList[i].UserNameList = []
                res.data.nodeList[i].userNameStr = ''
                res.data.nodeList[i].CopyUserNameList = []
                res.data.nodeList[i].copyUserNameStr = ''
                let userNameArr = []
                let copyUserNameArr = []
                if (res.data.nodeList[i].userList && res.data.nodeList[i].userList.length > 0) {
                  for (var index = 0; index < res.data.nodeList[i].userList.length; index++) {
                    if (res.data.nodeList[i].userList[index].category == 1) {
                      res.data.nodeList[i].UserNameList.push(res.data.nodeList[i].userList[index])
                      userNameArr.push(res.data.nodeList[i].userList[index].name)
                    } else if (res.data.nodeList[i].userList[index].category == 2) {
                      res.data.nodeList[i].CopyUserNameList.push(res.data.nodeList[i].userList[index])
                      copyUserNameArr.push(res.data.nodeList[i].userList[index].name)
                    }
                  }
                }

                // 判断是否处理人
                res.data.nodeList[i].userNameStr = userNameArr.join(',')
                  // 抄送
                res.data.nodeList[i].copyUserNameStr = copyUserNameArr.join(',')

                if (res.data.nodeList[i].nextNodeIds) {
                  if (res.data.nodeList[i].nextNodeIds.indexOf(',')) {
                    var arr = res.data.nodeList[i].nextNodeIds.split(',');
                  } else {
                    var arr = [res.data.nodeList[i].nextNodeIds]
                  }
                  for (var j = 0; j < arr.length; j++) {
                    var obj = res.data.nodeList.find(item => item.nodeId == arr[j]);
                    // console.info(obj)
                    if (obj && obj.index) {
                      strName = strName + obj.index + ',';
                    }
                  }
                  strName = strName.substring(0, strName.length - 1)
                  res.data.nodeList[i].nextNameStrs = strName;
                  res.data.nodeList[i].nextNameStr = strName;
                }
                res.data.nodeList[i].num = 0
                res.data.nodeList[i].ifMultiInst == 0 ? res.data.nodeList[i].ifMultiInst = false : res.data.nodeList[i].ifMultiInst = true
              }
              console.info(this.nodeList)
              this.nodeList = res.data.nodeList
            } else {
              this.util.error(res.msg)
            }
          })

        }
      },
      changeFormKey(data) {
        if (data.hasOwnProperty('formName')) {
          this.manuList = [];
          this.selectNode = data;
          this.loadData()
        }
      },
      callback() {
        // if(!this.manuSelectNode.enable){
        if (this.deleteFlag) {
          // this.util.restDelete('/api_v1/wf/model?formKey='+this.selectNode.formKey+'&modelId='+this.manuSelectNode.modelId,null,(res)=>{
          console.log(1111111111111111111111111111111)//formKey='+this.selectNode.id+'&
          this.util.restDelete('/api_v1/wf/model?modelId=' + this.manuSelectNode.modelId, null, (res) => {
            //console.log(res)
            if (res.status == 200) {
              this.util.success('删除成功');
              this.nodeList = [];
              this.loadData();
            } else {
              this.util.error(res.msg)
            }
          })
        }
      },
      loadData() {
        //return;
        console.log('==================loadData===============')
        this.nodeList = []
        this.manuSelectNode = {}
        // console.log(this.selectNode.id)
        var param = {
          formKey: this.selectNode.formKey,
          // formKey:'mat_purchase_order',
          search: this.searchText
        }
        this.util.restGet('/api_v1/wf/model', param, (res) => {
          if (res.status == 200) {
            if (res.data && res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                res.data[i].enable == 0 ? res.data[i].enable = false : res.data[i].enable = true;
              }
              this.manuList = res.data
            }
          } else {
            this.util.error(res.msg)
          }
        })
        this.util.restGet('/api_v1/form', null, (res) => {
          if (res.data != null) {
            var models = []
            var num = 0
            for (let i = 0; i < res.data.length; i++) {
              const model = res.data[i];
              model.nodeId = model.id
              model.label = model.title
              model.text = model.title
              model.isResp = 0
              model.gender = 0
              model.leaf = false
              model.checked = 0
              if(model.children){
                for (let j = 0; j < model.children.length; j++) {
                  const formVo = model.children[j];
                  formVo.nodeId = formVo.id
                  formVo.label = formVo.title
                  formVo.text = formVo.title
                  formVo.formName = formVo.title
                  formVo.isResp = 0
                  formVo.gender = 0
                  formVo.leaf = false
                  formVo.checked = 0
                }
              }

              models.push(model)
            }
            this.models = models
            console.log(models)
          }
        })
      },
      addWorkflow() {
        if (!this.selectNode.id) {
          this.util.error('请先选择表单！')
          return false;
        }
        this.isEdit = false
        var str = (new Date()).format("yyyy-MM-dd")
        this.addObject.updateTime = str;
        this.addObject.listenerList = [];
        this.addObject.selectQuertersModelsselectList = this.selectQuertersModels.selectList
        this.addObject.selectMemberModelsselectList = this.selectMemberModels.selectList
        this.addObject.myself = this.sessionUtil.getUserName();
        this.isAddFormShow = true
      },
      editWorkflow() {
        if (!this.selectNode.id) {
          this.util.error('请先选择表单！')
          return
        }
        if (JSON.stringify(this.manuSelectNode) == '{}') {
          this.util.error('请选择要修改的流程！')
          return
        }

        this.addObject.selectQuertersModelsselectList = []
        this.addObject.selectMemberModelsselectList = []
        if (this.manuSelectNode.authList && this.manuSelectNode.authList.length > 0) {
          for (var index = 0; index < this.manuSelectNode.authList.length; index++) {
            if (this.manuSelectNode.authList[index].type == 3) {
              var o = {}
              o.label = this.manuSelectNode.authList[index].name
              this.addObject.selectQuertersModelsselectList.push(o)
            } else if (this.manuSelectNode.authList[index].type == 1) {
              var obj = {}
              obj.userName = this.manuSelectNode.authList[index].name
              this.addObject.selectMemberModelsselectList.push(obj)
            }
          }
        }
        this.addObject.listenerList = this.manuSelectNode.listenerList;
        this.addObject.description = this.manuSelectNode.description
        this.addObject.myself = this.manuSelectNode.createUserName
        this.addObject.updateUserName = this.manuSelectNode.updateUserName
        this.addObject.name = this.manuSelectNode.name
        this.addObject.modelId = this.manuSelectNode.modelId
        this.addObject.updateTime = this.manuSelectNode.updateTime
        this.addObject.enable = this.manuSelectNode.enables = this.manuSelectNode.enable
        // this.manuSelectNode.enable==1?this.addObject.enable=true:this.addObject.enable=false;
        console.log(this.manuSelectNode)
        console.log(this.addObject)
        this.isEdit = true
        this.isAddFormShow = true
      },
      deleteWorkflow() {
        if (JSON.stringify(this.manuSelectNode) == '{}') {
          this.util.error('请选择要删除的流程！')
          return
        }
        this.deleteFlag = true
        if (!this.manuSelectNode.value) {
          this.deleteMsg.show = true;
          this.deleteMsg.title = '删除流程';
          this.deleteMsg.content = '此操作为不可恢复操作，请确认是否删除本流程；是，请点击【确定】，否，请点击【取消】';
        } else {
          this.deleteMsg.show = true;
          this.deleteMsg.title = '删除流程';
          this.deleteMsg.content = '当前已有审批单据启用本流程，请【取消】对本流程的删除操作。如需不再启用本流程，请在“启用”栏停止本流程的启用';
        }

      },
      addNode() {
        if (JSON.stringify(this.manuSelectNode) == "{}") {
          this.util.error('请先选择流程模型！')
          return;
        }
        this.isNodeChange = true;
        this.isStartEdit = true
        var o = {
          index: this.nodeList.length + 1,
          nodeId: 'node' + (this.nodeList.length + 1)
        }
        this.nodeList.push(o)
      },
      saveNode(strss) {
        console.info("=======saveNode=======");
        if (JSON.stringify(this.manuSelectNode) == "{}") {
          this.util.error('请先选择流程模型！')
          return;
        }
        if (!this.nodeList && this.nodeList.length < 1) {
          this.util.error('至少有两个流程环节才可以保存！')
          return;
        }
        var _this = this;
        this.util.mask('正在保存...');
        var arr = []
        var num = 0
        for (var i = 0; i < this.nodeList.length; i++) {
          console.info(this.nodeList[i]);
          if (this.nodeList[i].nextNameStr != this.nodeList[i].nextNameStrs) {
            this.isNodeChange = true;
            this.nodeList[i].nextNameStr = this.nodeList[i].nextNameStrs
          }
          //如果修改了名字，也重新保存
          if (this.nodeList[i].oldName != this.nodeList[i].name) {
            this.isNodeChange = true;
          }
          var arr1 = [];
          var o = {};
          var str = ''
          o.nodeId = this.nodeList[i].nodeId;
          o.name = this.nodeList[i].name;
          var arrs = []
          var arrs1 = []

          if (this.nodeList[i].UserNameList) {
            arrs = this.nodeList[i].UserNameList
          }
          if (this.nodeList[i].CopyUserNameList) {
            arrs1 = this.nodeList[i].CopyUserNameList
          }
          o.userList = arrs.concat(arrs1);
          if (this.nodeList[i].nextNameStr) {
            arr1 = this.nodeList[i].nextNameStr.split(/[',','，']/)
            var nextNodeArr = [];
            //console.info(arr1);
            for (var j = 0; j < arr1.length; j++) {
              if (arr1[j] == 0 || arr1[j] > this.nodeList.length) {
                this.util.warn(o.name + '的后置环节不存在');
                this.util.unmask();
                return;
              }
              //str+=('node'+arr1[j]);
              nextNodeArr.push('node' + arr1[j])
            }
            o.nextNodeIds = nextNodeArr.join(",");
          } else {
            o.nextNodeIds = ''
          }
          o.formAuthList = this.nodeList[i].formAuthList
          o.listenerList = this.nodeList[i].listenerList;
          o.ifMultiInst = this.nodeList[i].ifMultiInst ? 1 : 0;
          arr.push(o)
        }
        console.log(arr)
        var param = {
          formKey: this.selectNode.formKey,
          name: this.manuSelectNode.name,
          modelId: this.manuSelectNode.modelId,
          enable: this.manuSelectNode.enable ? 1 : 0,
          newFlag: this.isNodeChange,
          authList: this.manuSelectNode.authList,
          nodeList: arr,
        }
        //console.log(param)
        this.util.restPost('/api_v1/wf/model/simple', param, (res) => {
          //console.log(res)
          _this.util.unmask();
          if (res.status == 200) {
            this.util.success(strss + '成功')
            this.isStartEdit = false
            this.isNodeChange = false
          } else {
            this.util.error(res.errorMsg)
          }
        })
      },
      deleteNode() {
        if (this.selectList.length < 1) {
          this.util.error('请选择要删除的流程环节！');
          return
        }
        console.info(this.selectList);
        if (this.nodeList.length - this.selectList.length < 2) {
          this.util.error('至少需要2个环节！');
          return;
        }
        for (var i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].index == 1) {
            this.util.error('首环节不能删除！');
            return;
          }
        }
        var _this = this;
        var newIndex = 1;
        var nodeList = this.nodeList.filter(function (element, index) {
          for (var i = 0; i < _this.selectList.length; i++) {
            if (_this.selectList[i] == element) {
              return false;
            }
          }
          element.nodeId = 'node' + newIndex;
          newIndex++;
          return true;
        });
        this.isNodeChange = true;
        this.isStartEdit = true;
        this.nodeList = nodeList;
        return;
        this.deleteFlag = false
        this.isNodeChange = true;
        this.deleteMsg.show = true;
        this.deleteMsg.title = '删除流程';
        this.deleteMsg.content = '此操作为不可恢复操作，请确认是否删除本流程；是，请点击【确定】，否，请点击【取消】';
      }, openListenerConf(type, row) {//设置流程监听
        this.listererObj = row;
        if (type == 'TASK') {
          this.listererObj = row;
          this.listererType = this.taskListererType;
          this.listererObj.listererType = 'TASK';

        } else if (type == 'PROCESS') {
          this.listererType = this.processListererType;
          this.listererObj.listererType = 'PROCESS';
        }
        this.listeners = this.listererObj.listenerList == undefined ? [] : this.listeners = this.listererObj.listenerList;
        this.listenerConfVisable = true;
      }, openFormAuthConf( row) {//设置流程监听
         this.currentNode = row
        this.formAuthList = this.currentNode.formAuthList == undefined ? [] : this.currentNode.formAuthList
        this.procDefId = row.procDefId
        this.formAuthConfVisible = true;
      },saveFormAuth(){
        let data = this.$refs['form-auth'].getData()
        this.currentNode.formAuthList = data
        this.formAuthConfVisible = false
        this.isStartEdit = true
      },handlerListenerSelect(currentRow){
        // console.info('-----handlerListenerSelect------')
        this.selectedListener = currentRow
      },deleteListener(){
        if(this.selectedListener){
          let _this = this
          this.listeners = this.listeners.filter(function (item, index) {
            return item != _this.selectedListener
          })
        }
      }, saveListener() {//保存设置的监听
        var _this = this;
        if (this.listererObj != undefined && this.listererObj != null) {
          var result = this.listeners.some(function (element, index) {
            if (!_this.validUtil.isNotEmpty(element.event) || !_this.validUtil.isNotEmpty(element.clazz)) {
              return true;
            }
          });
          if (result) {
            _this.util.warn('事件类型或事件类名不能为空！');
            return;
          }
          this.listererObj.listenerList = this.listeners;
          // console.info(this.listererObj);
          this.isStartEdit = true;
        }
        this.listenerConfVisable = false;
      }, handlerModelExtendSet(row) {
        //console.info(this.selectNode)
        //console.info(row)
        // 模型高级设置
        //console.info(row.modelId + '-----handlerModelExtendSet------' + this.selectNode.id)
        // this.$router.push({name: 'sys/wf/manage/rule',params: {
        //     modelId: row.modelId,
        //     formKey: this.selectNode.id
        //   }});
        this.showRuleSetting = true
        this.ruleSettingModel= {
          parent : this,
          key: row.key,
          modelId: row.modelId,
          formKey: this.selectNode.formKey
        }
      }
    }
  }
</script>
<style scoped >
  .wf-container{
    display: flex;
    /* background-color: white; */
    width: 100%;
  }
  .aside{
    width: 30%;
  }
  .unit-com{
    width: 70%;
  }

  .manu-table input {
    /*background: transparent;*/
  }
  .content-button {
    float: right;
    margin-top: -5px;
  }

  .content-button > .input {
    padding: 8px 5px 10px;
    margin-right: 20px;
    border: 1px solid #e7e7e7;
    border-radius: 1px;
    font-size: 12px;
    width: 190px;
    position: relative;
    height: 36px;
    box-sizing: border-box;
  }

  .content-button > .input > button {
    position: absolute;
    width: 36px;
    height: 36px;
    background: url(../../../assets/administrationIcon/search.png) no-repeat center;
    background-size: 16px 16px;
    right: 0;
    top: 0;
    border: 0 none;
    border-left: 1px solid
  }

  .content-button > div button {
    border: 1px solid #c4c4c4;
    box-sizing: border-box;
  }

  .content-button > div button img {
    width: 34px;
  }

  .content-button > input,
  .content-button > div,
  .content-button > div button {
    float: left;
  }

  .content-button > div button:nth-child(2) {
    border-left: 0 none;
    border-right: 0 none;
  }

  .title {
    position: relative;
  }

  .tab {
    position: absolute;
    top: 0;
    left: 10px;
    z-index: 2;
  }

  .tab > div {
    float: left;
    padding: 0 10px;
  }

  .active {
    position: relative;
  }

  .active::after {
    content: '';
    position: absolute;
    width: 100%;
    bottom: -6px;
    left: 0;
    height: 2px;
    background: #3B8CFF;
  }

  .operation span {
    cursor: pointer;
  }

  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 98;
    background: rgba(0, 0, 0, 0.6);
  }

  .boxs {
    width: 812px;
    transform: translate(-50%, -50%);
    position: fixed;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    height: 391px;
    z-index: 99;
    overflow: hidden;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .footer {
    position: absolute;
    bottom: 10px;
    right: 20px;
  }

  .add-from {
    overflow: hidden;
    margin-bottom: 20px;
  }

  .add-from .add-from-left {
    float: left;
  }

  .add-from .add-from-right {
    float: right;
  }

  .add-from > div > div {
    float: left;
  }

  .add-from-input {
    width: 296px;
    height: 38px;
    border: 1px solid #d4d4d4;
    border-radius: 1px;
    box-sizing: border-box;
    padding: 6px 0 10px 5px;
    font-size: 14px;
    color: #333333;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .add-from-input-img {
    position: relative;
  }

  .add-from-input-img::after {
    position: absolute;
    width: 38px;
    height: 38px;
    content: "";
    right: 1px;
    top: 1px;
    background: url(../../../assets/common/sheng.png) no-repeat center;
    background-size: 20px;
  }

  .add-from-input input {
    width: 100%;
  }

  .add-from-input.add-from-disable {
    background: #F4F4F4;
  }

  .add-from-label {
    height: 38px;
    line-height: 38px;
    width: 70px;
    text-align: left;
  }

</style>
<style>
  .manu-table .el-table__body tr.hover-row > td {
    background: #fff;
  }

  .manu-table1.manu-table .el-table__body tr.hover-row > td, .manu-table1.manu-table .el-table__body tr.current-row > td {
    /*background: #f6f6f6;*/
    background: #3a8ee6;
  }

  .table-change .el-table__row td {
    padding: 0;
  }
</style>
