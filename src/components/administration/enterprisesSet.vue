<template>
  <div class="enter-box" style="text-align:left;color:#333;padding:46px 0px   0px;position:relative;box-sizing:border-box;">
    <selectQuarters :selectQuertersModels="selectQuertersModels"></selectQuarters>
    <selectRole :selectRoleModels="selectRoleModels"></selectRole>
    <selectPosition :selectPositionModels="selectPositionModels"></selectPosition>
    <selectUser :selectMemberModels="selectUserModels"></selectUser>
    
    <div v-if="isDelete" class="delete-show-box">
      <div class="delete-show">
        <h5 style="font-size:18px;margin:30px 0;font-weight:400" >删除{{removeNode.title}}</h5>
        <p>{{removeNode.content}}</p>
        <div class="delete-show-footer">
          <button :style="{color:'#fff',backgroundColor:bgColor,borderColor:bgColor}" @click="deleteBacth()">提交</button>
          <button @click="isDelete=false">取消</button>
        </div>
      </div>
    </div>
    <!--修改密码-->
    <div v-if="isChangePsw" class="delete-show-box">
      <div class="delete-show">
        <h5 style="font-size:18px;margin:30px 0;font-weight:400" >修改密码</h5>
        <el-input type="text" v-model="newPsw" minlength="10" maxlength="18" placeholder="大写字母、小写字母、数字、特殊字符中任意3种" style="margin:10px 0;border:1px solid #ccc;padding:10px 5px;color:#333"></el-input>
        <div class="delete-show-footer">
          <button :style="{color:'#fff',backgroundColor:bgColor,borderColor:bgColor}" @click="subPsw()">提交</button>
          <button @click="isChangePsw=false">取消</button>
        </div>
      </div>
    </div>
    <div v-if="isUploading">
      <uploading></uploading>
    </div>
    <div v-if="isSync" class="delete-show-box">
      <div class="delete-show">
        <h5 style="font-size:18px;margin:30px 0;font-weight:400" >微信同步到系统</h5>
        <div class="issync-content">
          <i class="issync-content-img"></i>
          <p>即将进行同步…</p>
          <button @click="synchWxToOrg()">开始同步</button>
        </div>
        <div class="delete-show-footer">
          <button :style="{color:'#fff',backgroundColor:bgColor,borderColor:bgColor}" @click="SyncSave()">完成</button>
          <button @click="isSync=false">返回</button>
        </div>
      </div>
    </div>
    <div class="tabs-box">
      <div class="tabs" style="color:#fff">
        <span @click="changetab('组织管理')"
            :class="{active:activeName=='组织管理'}">
          组织管理
        </span>
        <span @click="changetab('角色管理')"  v-if="sessionUtil.isAllowMenu('SYS_02')"
            :class="{active:activeName=='角色管理'}">
          角色管理
        </span>
        <span @click="changetab('岗位管理')" v-if="sessionUtil.isAllowMenu('SYS_03')"
            :class="{active:activeName=='岗位管理'}">
          岗位管理
        </span>
              
      </div>
    </div>

    <!-- 人员、部门新增编辑框 -->
    <div class="content-item edit" v-show="addOrganization||addPeople">
      <div>
        <button class="theme-btn primary" @click="back()">返回上一级</button>
      </div>
      <div v-show="addOrganization">
        <h5 style="font-size:18px;margin:30px 0;font-weight:400" >部门信息</h5>
        <div style="overflow:hidden;">
          <div class="gain">
            <div>部门名称 <span class="Required">*</span></div>
            <input type="text" v-model="departObj.label" placeholder="请输入部门名称">
          </div>
          <div class="gain">
            <div>上级部门 <span class="Required">*</span></div>
             <p :style="{color: departObj.parentId==undefined? '#C4C4C4':'#666'}"
               @click="departObj.parentName=='root'? '':parentPost()">{{departObj.parentId==undefined?
              '请选择上级部门':departObj.parentName}} <img src="../../assets/administrationIcon/more.png" style="width:6px" alt="">
               </p>
          </div>
        </div>
        <div style="overflow:hidden;">

        <div class="gain">
          <div>请设置排序号</div>
          <input type="text" v-model="departObj.sort" placeholder="用于显示先手顺序，数值小的排前面">
        </div>
        <div class="gain">
            <div>单位类型</div>
            <select v-model="departObj.departType"
                    :style="{color:departObj.departType==undefined||departObj.departType==''?'#757575':'#000'}">
              <option value='' disabled selected style='display:none;'>请选择单位类型</option>
              <option value="depart">建设单位</option>
              <option value="construstion">施工单位</option>
              <option value="supervisor">监理单位</option>
              <option value="design">设计单位</option>
              <option value="wmanage">项管单位</option>
            </select>
          </div>
        </div>
      </div>
      <!--添加编辑员工-->
      <div v-if="addPeople" style="position:relative;" class="edit-people">
        <h5 style="font-size:18px;margin:30px 0;font-weight:400" >成员信息</h5>
        <div style="overflow:hidden;position:relative">
          <div class="gain">
            <div>姓名 <span class="Required">*</span></div>
            <input type="text" v-model="userObj.userName" placeholder="员工姓名">
          </div>
          <div class="gain">
            <div>账号 <span class="Required">*</span></div>
            <input type="text" v-model="userObj.userId" placeholder="账号">
          </div>
        </div>
        <div v-if="this.userObj.id==undefined" style="overflow:hidden;position:relative">
          <div class="gain">
            <div>密码 <span class="Required">*</span></div>
            <input type="password" v-model="userObj.password"  minlength="10" maxlength="18"  placeholder="大写字母、小写字母、数字、特殊字符中任意3种">
          </div>
          <div class="gain">
            <div>确认密码 <span class="Required">*</span></div>
            <input type="password" v-model="userObj.surePassword"  minlength="10" maxlength="18"  placeholder="请确认密码">
          </div>
        </div>
        <div style="overflow:hidden;">
          <div class="gain">
            <div>性别</div>
            <select v-model="userObj.gender"
                    :style="{color:userObj.gender==undefined||userObj.gender==''?'#757575':'#000'}">
              <option value='' disabled selected style='display:none;'>请选择性别</option>
              <option value="1">男</option>
              <option value="0">女</option>
            </select>
          </div>
          <div class="gain">
            <div>手机号</div>
            <input type="text" v-model="userObj.mobileNo" placeholder="请输入手机号">
          </div>
        </div>
        <div style="overflow:hidden;">
          <div class="gain">
            <div>微信号</div>
            <input type="text" v-model="userObj.wxNo" placeholder="请输入微信号">
          </div>
          <div class="gain">
            <div>邮箱</div>
            <input type="text" v-model="userObj.email" placeholder="请输入邮箱">
          </div>
        </div>
        <div>
          <div class="gain">
            <div>职能</div>
            <select v-model="userObj.remark" :style="{color:userObj.remark?'#000':'#757575'}">
              <option :value="item.value" v-for="(item,index) in functions" :key="index">{{item.name}}</option>
            </select>
          </div>
        </div>
        <div class="gain" style="float:none;border:0 none;width:100%;">
        <h5 style="font-size:18px;margin:10px 0 10px;font-weight:400;width: 694px" >部门岗位
            <button class="add-edit-depart" @click="selectDepart()"></button>
        </h5>
           
          <el-table  :data="departList" :stripe="true" style="width: 694px"
              :header-row-style="{background:fontColor,overflow:'hidden',}" border
              :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}"
              :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center'}">
              <el-table-column label="部门">
                <template slot-scope="scope">
                  <span style="white-space: nowrap;">{{ scope.row.departName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="岗位">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.positionUid" placeholder="请选择">
                      <el-option v-for="item in positionList" :key="item.id" :label="item.positionName" :value="item.id">
                      </el-option>
                  </el-select>
                  <!-- <span style="white-space: nowrap;">{{ scope.row.positionName}}</span> -->
                </template>
              </el-table-column>
              <el-table-column label="岗位类型" width="180">
                <template slot-scope="scope">
                  <div class="depart-type" style="">
                      <p >
                        <img v-if="scope.row.isMain==1" src="../../assets/administrationIcon/active.png" alt="">
                        <img v-if="scope.row.isMain!=1" @click="changeIsMain(scope.row,1)" src="../../assets/administrationIcon/defult.png" alt="">
                        <span>主职</span>
                      </p>
                      <p>
                        <img v-if="scope.row.isMain==0" src="../../assets/administrationIcon/active.png" alt="">
                        <img v-if="scope.row.isMain!=0" @click="changeIsMain(scope.row,0)" src="../../assets/administrationIcon/defult.png" alt="">
                        <span>兼职</span>
                      </p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作"  width="80">
                <template slot-scope="scope">
                  <img @click="removeDepart(scope.row.departUid)" src="../../assets/administrationIcon/removedepart.png" alt="">
                </template>
              </el-table-column>

          </el-table>
        </div>
        <div class="gain" style="float:none;border:0 none;width:100%;">
          <div style="padding:0 0 10px;">角色</div>
          <ul>
            <li class="gain-button" @click="addNews(selectedRoles,1)">请选择</li>
            <li class="gain-button gain-button1" v-for="(item,key) in selectedRoles" :key="key" @click="shanchu(item,1)"
                :style="{color:bgColor,background:fontColor,borderColor:bgColor}">{{item.roleName}}
            </li>
          </ul>
        </div>
        <div class="gain" style="float:none;border:0 none;">
          <div style="padding:0 0 10px;">直接上级</div>
          <ul>
            <li class="gain-button" @click="addNews(memberList,2)">请选择</li>
            <li class="gain-button gain-button1" v-if="memberList.length>0" @click="memberList=[]">{{memberList[0].userName}}
            </li>
          </ul>
          <!-- <el-radio-group v-model="identity">
            <el-radio :label="1">普通成员</el-radio>
            <el-radio :label="2">上级</el-radio>
          </el-radio-group> -->
        </div>
        <img :src="userObj.picture==undefined? defaultPerson:userObj.picture" class="gain-img" alt="">
      </div>
      <div class="section-footer">
        <button style="border-color:#F08B00;background:#F08B00;color:#fff;" @click="submit()">提交</button>
        <button style="color:#666;background:#fff;" @click="reset">重置</button>
      </div>
    </div>
    <div class="content-item enter-setion1" v-if="activeName=='组织管理'&&!addOrganization&&!addPeople">
      <div class="box-style enter-setion-ul" v-if="sessionUtil.isAllowMenu('SYS_01')"  style="box-sizing:border-box;">
         <div  style="position:relative;padding-top:57px;">
          <div class="enter-setion-title" style="height:108px;position:absolute;left:0;top:0;width:100%;padding: 10px;box-sizing: border-box;">
            <h4   style="padding:0;padding-left:26px;">
              组织架构
              <span class="add-icon" @click="addDepart()" v-if="sessionUtil.isAllowAdd('org_Structure')"></span>
            </h4>
          </div>
          <div style="width:100%;height:100%;overflow:auto;color:#fff;">
            <enterprisesSetItem v-for="(item,key) in orgDatas" :key="key" :level="0" :models="item"></enterprisesSetItem>
          </div>
        </div>
      </div>
      <div class="box-style "  v-if="sessionUtil.isAllowMenu('SYS_01')" style="overflow:hidden;width:auto;height:100%;">
        <div>
          <div class="enter-content" style="color:#333;text-align:left;">
            <h4 style="position:absolute;top:10px;left:10px;">{{orgSelected.label}}({{orgSelected.totalCount}}人)</h4>
            <div style="width:100%;overflow-x:auto;position:absolute;top:60px;left:10px;">
              <div class="operations">
                <div>
                  <button class="theme-btn" @click="SyncWeChat()">微信同步</button>
                  <button class="theme-btn" @click="addmember()" v-if="sessionUtil.isAllowAdd('org_Structure')">添加成员</button>
                  <button class="theme-btn" v-if="sessionUtil.isAllowBtn('010102:change_psw')" @click="changePsw()">修改密码</button>
                  <button class="theme-btn danger" v-if="sessionUtil.isAllowDelete('org_Structure')" @click="removeMember()">删除</button>
                </div>
                <div class="search-box">
                  <input type="text" v-model="search" @keyup.enter="seachUsers()" placeholder="请输入关键字搜索">
                  <button @click="seachUsers()" class="theme-btn" style="background:transparent">
                    <img src="../../assets/administrationIcon/search.png" alt="">
                  </button>
                </div>
                
                
                
              </div>
            </div>
            <div ref="tableHeight" class="theme-table" style="height:100%;width:100%;">
              <el-table ref="multipleTable" :data="orgUserDatas"  style="width: 100%"
                      :header-row-style="{background:'transparent',overflow:'hidden',}" border
                      :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}" :height="tableHeightNum"
                      :header-cell-style="{background:'transparent',height:'34px',padding:0,textAlign:'center'}"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="操作" fixed width="70"  v-if="sessionUtil.isAllowEdit('org_Structure')||sessionUtil.isAllowDelete('org_Structure')">
                  <template slot-scope="scope">
                    <p class="operation">
                      <span @click="editUser(scope.row.id)" v-if="sessionUtil.isAllowEdit('org_Structure')" class="editIcon editIcon1"></span>
                      <span @click="deleteUser(scope.row.id)" v-if="sessionUtil.isAllowDelete('org_Structure')" class="delete editIcon"></span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="姓名">
                  <template slot-scope="scope">
                    <p style="white-space: nowrap;text-align:left;">{{ scope.row.userName}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="性别" width="80">
                  <template slot-scope="scope">
                    <span style="white-space: nowrap;">{{ scope.row.gender==1? '男':'女' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="账号">
                  <template slot-scope="scope">
                    <p style="white-space: nowrap;text-align:left;">{{ scope.row.userId}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="手机号">
                  <template slot-scope="scope">
                    <span style="white-space: nowrap;">{{ scope.row.mobileNo}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="岗位">
                  <template slot-scope="scope">
                    <span style="white-space: nowrap;">{{ scope.row.positionName}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%)" class="table-footer">
              <!-- <el-pagination background layout="prev, pager, next" :small="true" @current-change="currentPage($event)"
                        :pager-count="5" :page-size="pageSize" :total="orgSelected.totalCount">
              </el-pagination> -->
              <el-pagination @size-change="changePageSize($event)"  @current-change="currentPage($event)"
                  :page-sizes="[10, 25, 50, 100]" :small="true" :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper" :total="orgSelected.totalCount">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-item" v-if="activeName=='角色管理'">
      <RoleManage ref="roleLoadData"></RoleManage>
    </div>

    <div class="content-item" v-if="activeName=='岗位管理'">
      <PostManage></PostManage>
    </div>
     <div class="content-item" v-if="activeName=='公司信息'">
      <CompanyInfo></CompanyInfo>
    </div>
    
  </div>
</template>
<script>
  import {mapState, mapGetters, mapActions} from 'vuex'
  import selectQuarters from '../common/selectQuerters.vue'
  import selectPosition from "../common/select-position/select-position.vue";
  import selectRole from '../common/selectRole.vue'
  // import selectRole from '../../common/select-role/select-role.vue'
  import selectUser from '../common/selectMember.vue'
  import enterprisesSetItem from './enterprisesSetItem.vue'
  import uploading from '../common/uploading.vue'
  import selectmore from './selectmore.vue'
  import RoleManage from './RoleManage.vue'
  import PostManage from './PostManage.vue'
  import CompanyInfo from './Company_info.vue'
  export default {
    data () {
      return {
        search1: '',
        functions:[],//职能
        departTypeList:[],
        selectQuertersModels: {
          isShow: false,
          selectList: [],
          callBack: this.selectQuarterIn,
          radioSelectFlags: false
        },
        selectRoleModels: {
          isShow: false,
          selectList: [],
          callBack: this.selectRoleCallBack,
          radioSelectFlags: false
        },
        selectUserModels: {
          isShow: false,
          selectList: [],
          callBack: this.selectUserCallBack,
          radioSelectFlags: true
        },
        selectPositionModels: {
          isShow: false,
          selectList: [],
          callBack: this.selectPositionCallBack,
          radioSelectFlags: true
        },
        selectPositionObj:{},
        search: '',
        selectType: '',//选择类型(单选、多选)
        selectmoreObj: {
          selectType:'',
          centerList: []
        },
        departObj: {sex: '请选择性别'}, //部门对象
        isChangePsw:false,
        userObj: {//成员信息
          userName: '',//姓名
          account: '',//账号
          gender: '',//性别
          password: '',//密码
          surePassword: '',//密码确认
          mobileNo: '',//手机号
          wxNo: '',//微信号
          email: '',//邮箱
          remark:"",//职能
          deapart: '',//
          job: '',//岗位
          identityType: '',//身份类型
        },
        defaultPerson: require('../../assets/defaultPerson.jpg'),
        removeNode: {},
        isUploading: false,
        tableHeightNum:0,
        isSync: false,
        isDelete: false,
        memberOrPost: false,
        ismask: false,
        isSelect: true,
        departList: [],
        postList: [],
        roleLists: [],
        selectedRoles: [],
        memberList: [],
        addOrganization: false,
        addPeople: false,
        isChangePsw: false,
        identity: 1,
        bgColor: '',
        fontColor: '',
        activeName: '组织管理',
        station: {},
        pageSize: 10,
        pageNum:5,
        currentPageNum:1,//当前页数
        multipleSelection: [],
        tableData: [],
        newPsw:""
      }
    },
    computed: {
      ...mapState({
        companyUid: state => state.companyUid,
        companyName: state => state.companyName,
        orgDatas: state => state.orgDatas,
        positionList: state => state.positionList,
        editDepart: state => state.editDepart,
        totalUsers: state => state.totalUsers,
        orgUserDatas: state => state.orgUserDatas,
        orgSelected: state => state.orgSelected
      }),

    },
    created () {
      this.$bus.on('handelDepart1', this.addOrEditDepart)
    },
    beforeDestroy () {
      this.$bus.off('handelDepart1', this.addOrEditDepart)
    },
    mounted () {
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tableHeight.offsetHeight;
      })
      this.bgColor = this.$store.state.themeColor
      this.fontColor = this.$store.state.themeBG;
      this.$store.state.companyUid=this.sessionUtil.getCompanyUid();
      // this.$store.dispatch('getTotalData',{departUid: this.companyUid,label: this.companyName});
      this.$store.dispatch('getOrgDatas', {companyUid: this.companyUid, type: '',operate:"root"})
      var params = {companyUid: this.companyUid, start: 0, pageSize: this.pageSize, type: 'total'}
      this.$store.dispatch('getAllUser', params)
      this.$store.dispatch('getPositionList', {companyUid: this.companyUid})
      this.getAllUsersList(this.companyUid, 'all');
      this.getRoleList();
      this.getfunctionDic();
    },
    components: {
      enterprisesSetItem, selectQuarters, selectmore, uploading, RoleManage, PostManage,selectRole,selectPosition,selectUser,CompanyInfo
    //   ListManage
    },
    methods: {
      changeIsMain(node,num){
        node.isMain=num;
        this.$forceUpdate()
      },
      //获取职能数据字典
      getfunctionDic(){
        this.util.restGet('/api_v1/dic/FUNCTION/items',null, (res)=> {
          if(res.status==200&&res.data){
            this.functions=res.data;
          }else{
            this.functions=[];
          }
        })

      },
      getRoleList(){ //获取角色列表
          this.util.restGet('/api_v1/org/roles', { companyUid: this.$store.state.companyUid,start:0,pageSize:100,ifContainCommon:true }, (res)=> {
              if (res.status == 200) {
                  var selectList = [...this.selectedRoles]
                  this.roleLists=res.data;
                  this.selectmoreObj = {
                    title: '选择角色',
                    type: 'role',
                    // selectType:'single',
                    centerList: this.roleLists,
                    selectDatas: selectList
                  }
                  this.$forceUpdate()
              } else {
                  this.util.error(res.errorMsg);
              }
          });
      },
      refreshDepart(){
          this.util.mask();
          if(this.search!=""){
              this.util.restGet('/api_v1/org/departs', { companyUid: this.$store.state.companyUid ,start:0,pageSize:100,search:this.search1}, (res)=> {
                // console.log(res);
                if(res.status==200){
                    this.$store.commit('setOrgDatas', res.data)
                }else {
                    this.util.error("系统错误");
                }
                this.util.unmask();
            });
          }else{
            this.$store.dispatch('getOrgDatas', {companyUid: this.companyUid, type: '',operate:"root"})
          }

      },
      deleteBacth(){
          this.isDelete=false;
          this.util.mask("正在删除..");
          Promise.all([this.multipleSelection.forEach(item => {
              this.util.restDelete('/api_v1/org/users/{id}', { id:item.id}, (res)=> {});
          })]).then((result) => {
              this.util.unmask()
              this.util.success("删除成功！");
              setTimeout(() => {
                  this.$store.dispatch('getTotalData', this.orgSelected)
                  var params = {companyUid: this.orgSelected.departUid, start: 0, pageSize: this.pageSize}
                  this.$store.dispatch('getAllUser', params)
              }, 500);

          }).catch((error) => {
              this.util.unmask()
              this.util.error(error);
          });

      },
      removeDepart(departUid){
        //departList
        this.departList = this.departList.filter(item => item.departUid != departUid);
      },
      changePsw(){
        if(this.multipleSelection.length==0){
          this.util.error('请勾选要修改密码的账号')
          return
        }
        if(this.multipleSelection.length!=1){
          this.util.error('只能修改单个账号的密码')
          return
        }
        this.isChangePsw=true;
        this.newPsw='';
      },
      subPsw(){//修改密码
          if (!this.validUtil.isNotEmpty(this.newPsw)) {
            this.util.error('请填写新密码!')
            return
          }
          this.util.mask();
          this.util.restPut('/api_v1/org/users/{id}/pwd', { id: this.multipleSelection[0].id,oldPwd:this.multipleSelection[0].password,newPwd:this.newPsw}, (res)=> {
              this.util.unmask();
              if (res.status == 200) {
                  this.isChangePsw=false;
                  this.util.success('修改成功！')
              } else {
                  this.util.error(res.errorMsg);
              }
          });
      },

      getAllUsersList (departUid, type) { //获取公司所有人员列表
        var params = {}
        if (type == 'all') {
          params = {companyUid: departUid}
        } else {
          params = {departUid: departUid}
        }
        params.Authorization=this.sessionUtil.getAccessToken()
        params.start=0
        params.pageSize=1000
        params.search=this.$store.state.memberSearchText,
        params.ifContainChild=false,
        params.ifQueryPosition=false,

        this.util.mask()
        this.util.restGet('/api_v1/org/users', params, (res) => {
          if (res.status == 200) {
            if (type == 'all') {
              this.$store.state.totalUsers = res.data
            } else {
              this.memberList = res.data
            }
          } else {
            this.util.error(res.errorMsg)
          }
          this.util.unmask()
        })
      },
      addDepart () {//添加部门
        this.memberList = []
        this.departObj = {
          parentId: this.companyUid,
          parentName: this.orgDatas[0].label,
          addType: 'all'
        }
        this.addOrganization = true
      },
      addOrEditDepart (data) {//添加编辑部门
        // this.util.loadDic('SYS_ORG_DEPART_TYPE',null,(res)=>{
        //   this.departTypeList=res
        // })
        // debugger
        if (data.type == 'add') {
          this.memberList = []
          this.departObj = {
            parentId: this.editDepart.id,
            sort: this.editDepart&&this.editDepart.children?this.editDepart.children.length+1:1,
            parentName: this.editDepart.label
          }
        } else {
          // debugger
          this.getAllUsersList(this.editDepart.id)
          this.departObj = {}
          this.util.clone(this.editDepart, this.departObj)
          this.departObj.departType=this.departObj.type
        }
        this.addOrganization = true
      },
      seachUsers () {
        var params = {start: 0, pageSize: this.pageSize, search: this.search}
        if (this.orgSelected.departUid == this.companyUid) {
          params['companyUid'] = this.companyUid
        } else {
          params['departUid'] = this.orgSelected.departUid
        }

        this.$store.dispatch('getAllUser', params)
      },
      changePageSize(pageSize){
          this.pageSize = pageSize;
          var params = {start: this.pageSize * (this.currentPageNum - 1), pageSize: this.pageSize}
          if (this.orgSelected.departUid == this.companyUid) {
            params['companyUid'] = this.companyUid
          } else {
            params['departUid'] = this.orgSelected.departUid
          }
          this.$store.dispatch('getAllUser', params)
      },
      currentPage(value) {
        this.currentPageNum=value;
        var params = {start: this.pageSize * (value - 1), pageSize: this.pageSize}
        if (this.orgSelected.departUid == this.companyUid) {
          params['companyUid'] = this.companyUid
        } else {
          params['departUid'] = this.orgSelected.departUid
        }

        this.$store.dispatch('getAllUser', params)
      },
      synchWxToOrg () {//微信通讯录同步到系统
        this.util.mask('正在同步...')
        this.util.restGet('/api_v1/wx/synchWxToOrg', {companyUid: this.companyUid, suite_id: window.suite_id}, (res) => {
          if (res != null) {
            if (res['status'] == 200) {
              this.util.success('同步完成！')
            } else {
              this.util.error(res['errorMsg'])
            }
          } else {
            this.util.error('同步失败！')
          }
          this.util.unmask()
        })
      },
      SyncSave () {
        this.cancelSync()
      },
      SyncWeChat () {
        this.isSync = true
      },
      removeMember () {
        this.isDelete = true
        this.removeNode = {
          title: '成员',
          content: '确定从部门中删除该成员吗?'
        }
      },
      moveMember () {
        if (this.multipleSelection.length == 0) {
          this.util.error('请选择需要移动部门的员工!')
          return
        }
        this.cancelSelect(this.orgDatas)
        this.selectType = 'single'
        this.ismask = true
      },
      cancelSelect (data) {
        data.forEach(obj => {
          if (this.departList.findIndex(item => item.id === obj.id) > -1) {
            this.$set(obj, 'select', true);
          } else {
            this.$set(obj, 'select', false);
          }
          if (obj.children != undefined && obj.children.length > 0) {
            this.cancelSelect(obj.children)
          }
        })
      },
      selectDepart () {//添加编辑员工选择部门/
        this.selectQuertersModels.isShow=true
       this.selectQuertersModels.isdepart=false
       var list=[]
       console.log
       this.departList.forEach(item => {
              var obj = {
                id:item.departUid,
                label:item.departName,
                active:true,
                positionUid:item.positionUid,
                positionName:item.positionName,
              }
              list.push(obj);
            });
        this.selectQuertersModels.selectList=list
        // this.cancelSelect(this.orgDatas)
        // this.selectType = 'singleSelect'
        // // this.selectType = 'multiple'
        // this.ismask = true
      },
      parentPost () {//添加部门时选择部门
        this.selectQuertersModels.isShow=true
        this.departList = []
        this.selectQuertersModels.isdepart=true
        //   if(res.status==200){
        //     if(res.data){
        //       this.departTypeList=res.data
        //     }else{
        //       this.departTypeList=[]
        //     }
        //   }else{
        //     this.util.error(res.errorMsg)
        //   }
        // })
        // this.cancelSelect(this.orgDatas)
        // this.selectType = 'single'
        // this.ismask = true
      },
      selectQuarterIn () {//选择部门回调
      var data=this.selectQuertersModels.selectList
        if (this.selectQuertersModels.isdepart) {
          this.departObj.parentId = data[0].id
          this.departObj.parentName = data[0].label
        } else {
          var departArr = [];
          // var obj = {
          //   departUid:data[0].id,
          //   departName:data[0].label,
          //   isMain:0
          // }
          // this.departList.push(obj);
          data.forEach(item => {
              var obj = {
                departUid:item.id,
                departName:item.label,
                positionUid:item.positionUid?item.positionUid:'',
                positionName:item.positionName?item.positionName:'',
                isMain:0
              }
              departArr.push(obj);
            });
          this.departList = departArr;
          this.userObj.deapart = data
        }
        this.$forceUpdate()

      },
      selectPositionShow(node){
        this.selectPositionModels.isShow=true;
          this.selectPositionObj=node;
        if(node){
          this.selectPositionModels.selectList=[node];
        }else{
          this.selectPositionModels.selectList=[];
        }
      },
      selectRoleCallBack(){
        this.selectedRoles = this.selectRoleModels.selectList;
      },
      selectUserCallBack(){
        this.memberList=this.selectUserModels.selectList;
      },
      selectPositionCallBack(){
         var data=this.selectPositionModels.selectList;
          this.selectPositionObj.positionUid=data[0].id
          this.selectPositionObj.positionName=data[0].positionName
          this.$forceUpdate()
      },
      selectMoreIn (data) {//选中岗位、人员回调
        if (this.selectmoreObj.title == '选择角色') {
          this.selectedRoles = data;
        } else {
          this.memberList = data
        }
      },
      qingkongArrSelect (arr) {
        for (var i = 0; i < arr.length; i++) {
          arr[i].select = false
        }
        arr = []
      },
      addNews (arr, num) {
        var selectList = arr?[...arr]:[]
        if (num == 1) {
          this.selectRoleModels.isShow=true
          this.selectRoleModels.selectList=selectList
          // this.getRoleList()
          // this.selectmoreObj = {
          //   title: '选择角色',
          //   type: 'role',
          //   // selectType:'single',
          //   centerList: this.roleLists,
          //   selectDatas: selectList
          // }
        } else {
          this.selectUserModels.isShow=true
        this.selectUserModels.selectList=this.memberList;
          // this.memberOrPost = true
          // this.selectmoreObj = {
          //   title: '选择上级',
          //   type: 'member',
          //   selectType:'single',
          //   centerList: this.totalUsers,
          //   selectDatas: selectList
          // }
        }
      },
      changetab (str) {
        this.back()
        this.activeName = str
        // if(str=='角色管理'){
        //   this.$nextTick(()=>{
        //     this.$refs.roleLoadData.getRoleList()
        //   })
        // }
      },
      addmember() {//添加员工
        this.addPeople = true
        this.userObj = {
          gender:1
        }
        this.postList = []
        this.departList = [{
          departUid:this.orgSelected.departUid,
          departName:this.orgSelected.label,
          positionUid:"",
          isMain:0
        }];
        this.memberList=[];
        this.selectedRoles=[];
      },
      editUser(userUid) {
        this.util.mask()
          this.util.restGet('/api_v1/org/users/{id}', {id: userUid, company: this.sessionUtil.getCompanyUid()}, (res) => {
          this.util.unmask();
          if (res != undefined  ) {
            if(res.status == 200){
              this.userObj = res.data;
              this.departList = res.data.positions;
              if(res.data.roles){
                this.selectedRoles =res.data.roles;
              }else{
                this.selectedRoles=[]
              }
              if(res.data.leader){
                var o={id:res.data.leader,userName:res.data.leaderName}
                this.memberList=[o]
              }else{
                this.memberList=[]
              }
            }else{
              this.util.alert(res.errorMsg)
            }

          } else {
            this.util.alert('网络开小差，服务端无响应!')
          }

        })
        this.addPeople = true
      },
      deleteUser (userUid) {
        this.util.confirm('确定要删除此员工吗?', null, (result) => {
          this.util.mask('正在删除..')
          this.util.restDelete('/api_v1/org/users/{id}', {id: userUid}, (res) => {
            // console.log(res);
            if (res.status == 200) {
              this.util.success('删除成功！')
              this.$store.dispatch('getTotalData', this.orgSelected)
              var params = {companyUid: this.orgSelected.departUid, start: 0, pageSize: this.pageSize}
              this.$store.dispatch('getAllUser', params)
            } else {
              this.util.error('删除失败!'+res.errorMsg)
            }
            this.util.unmask()
          })

        })
      },
      shanchu (node, num) {
        if (num == 1) {//移除角色
          this.selectedRoles = this.selectedRoles.filter((item) => {
            return item.id != node.id
          })
        } else {//移除成员
          this.memberList = this.memberList.filter((item) => {
            return item.id != node.id
          })
        }
      },
      reset () {
        this.departObj = {addType: 'all'}
        this.userObj = {}
      },
      submit () {//提交
        if (this.addPeople) {//添加人
          if (!this.validUtil.isNotEmpty(this.userObj.userName)) {
            this.util.error('请输入员工姓名!')
            return
          }
          if (!this.validUtil.isNotEmpty(this.userObj.userId)) {
            this.util.error('请输入员工账号!')
            return
          }
          if(this.userObj.id==undefined){
            if (!this.validUtil.isNotEmpty(this.userObj.password) && !this.validUtil.isNotEmpty(this.userObj.surePassword)) {
              this.util.error('请输入密码、确认密码!')
              return
            }
            if (this.userObj.password!==this.userObj.surePassword) {
              this.util.error('两次密码不一致!')
              return
            }
          }


          if (!this.validUtil.isNotEmpty(this.userObj.mobileNo)) {
            this.util.error('请输入员工手机号!')
            return
          }
           if (!this.selectedRoles||!(this.selectedRoles.length>0)) {
            this.util.error('请选择角色！')
            return
          }
          

          if(!this.departList||this.departList.length == 0){
            this.util.error('请设置一个部门!')
            return
          }
          for(var i=0;i<this.departList.length;i++){
              var item = this.departList[i];
              if(item.positionUid==undefined||item.positionUid==""){
                this.util.error(item.departName+'请设置岗位!');
                return;
            }
          }

          // console.info(this.selectedRoles);
          const roleIds = this.selectedRoles.map(item => item.id);
          var roleIdStr = roleIds.length==0? "_empty":roleIds.join(",");

          if (this.userObj.id == undefined) {
            param = {
              userId:this.userObj.userId,
              userName: this.userObj.userName,
              roleUid: roleIdStr,
              gender: this.userObj.gender,
              mobileNo: this.userObj.mobileNo,
              // positions:[{
              //   departUid: this.departList[0].departUid,
              //   positionUid:this.departList[0].positionUid
              // }],
              positions:this.departList,
              leader:this.memberList.length==0? "":this.memberList[0].id,//直接上级
              level:this.identity,
              pwd:this.userObj.password,
              email:this.userObj.email,
              wxNo:this.userObj.wxNo,
              remark:this.userObj.remark,
            }
          } else {
            param = {
              id: this.userObj.id,
              userId:this.userObj.userId,
              userName: this.userObj.userName,
              roleUid: roleIdStr,
              gender: this.userObj.gender,
              mobileNo: this.userObj.mobileNo,
              positions:this.departList,
              leader:this.memberList.length==0? "":this.memberList[0].id,//直接上级
              level:this.identity,
              pwd:this.userObj.password,
              email:this.userObj.email,
              wxNo:this.userObj.wxNo,
              remark:this.userObj.remark,
            }
          }

          this.util.mask('正在保存...')
           //v2.0 改为restful风格
          this.util.request(this.userObj.id == undefined ? 'POST' : 'PUT',this.userObj.id == undefined ? '/api_v1/org/users' : '/api_v1/org/users/{id}', param, (res) => {
           if (res['status'] == 200) {
              this.util.success('保存成功！')
              var params = {start: 0, pageSize: this.pageSize}
              if (this.orgSelected.departUid == this.companyUid) {
                params['companyUid'] = this.companyUid
              } else {
                params['departUid'] = this.orgSelected.departUid
              }
              this.$store.dispatch('getAllUser', params)
              this.back();
            } else {
              this.util.error('保存失败!'+res.errorMsg)
            }
            this.util.unmask()
          })
        } else {
          if (!this.validUtil.isNotEmpty(this.departObj.label)) {
            this.util.error('请输入部门名称!')
            return
          }
          if (!this.validUtil.isNotEmpty(this.departObj.departType)) {
            this.util.error('请选择部门类型!')
            return
          }

          this.util.mask('正在保存...')
          var param = null
          if (this.departObj.id != undefined) {
            param = {
              id: this.departObj.id,  departName: this.departObj.label,
              parentId: this.departObj.parentId, sort: this.departObj.sort,
              departType:this.departObj.departType
            }
          } else {
            param = {
              departName: this.departObj.label,
              parentId: this.departObj.parentId,
              sort: this.departObj.sort,
              departType:this.departObj.departType
            }
          }
            //v2.0 改为restful风格
          this.util.request(this.departObj.id == undefined ? 'POST' : 'PUT',this.departObj.id == undefined ? '/api_v1/org/departs' : '/api_v1/org/departs/{id}', param, (res) => {
            if (res != null) {
              if (res['status'] == 200) {
                this.util.success('保存成功！')
                if (this.departObj.id == undefined) {
                  res.data.label = res.data.departName
                  // this.$store.dispatch('getOrgDatas',{companyUid: this.companyUid,type: ''});
                  // if (this.editDepart.children == undefined) {
                  //   console.log("1111=====")
                  //   this.$store.dispatch('getOrgDatas', {companyUid: this.companyUid, type: ''})
                  // } else {
                  //   console.log("22222=====")
                  //   this.editDepart.children.push(res.data)
                  // }
                  this.$store.dispatch('getOrgDatas', {companyUid: this.companyUid, type: ''})
                } else {

                  this.$store.dispatch('getOrgDatas', {companyUid: this.companyUid, type: ''})
                }
                this.back()
                // this.$store.dispatch('getOrgDatas',{companyUid: this.companyUid,type: 'all'});
              } else {
                this.util.error('保存失败!'+res.errorMsg)
              }
            }
            this.util.unmask()
          })
        }


      },
      back () {
        if (this.addOrganization) {
          this.addOrganization = false
        } else if (this.addPeople) {
          this.addPeople = false
        }
      },
      handleClick (tab, event) {

      },
      handleSelectionChange (val) {
        this.multipleSelection = val;
      }
    }
  }
</script>
<style scoped lang="scss">
.operations {
  display: flex;
  justify-content: space-between;
  padding-right: 22px;
  button{
    margin-right: 10px;
  }
}
  .enter-box {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .enter-header {
    width: 100%;
    background: #fff;
    /* height: ; */
    color: #999;
    font-size: 18px;
    overflow: hidden;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.10);
  }

  .enter-header > div {
    width: 88px;
    float: left;
    text-align: center;
    padding: 18px 0 14px;
    margin: 0 30px;
    border-bottom: 4px solid #F08B00;
    border-bottom-color: transparent;
    cursor: pointer;
  }

  .content-item {
    width: 100%;
    height: 100%;
  }
  .content-item.edit{
    background:#fff;padding:30px;box-sizing: border-box;box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10);overflow:auto;
  }
  .enter-setion1 .enter-setion-ul {
    width: 320px;
    margin-right: 10px;
    float: left;
    /* background: #FAFAFA; */
    text-align: left;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.10);
  }

  .enter-setion1 .enter-content {
    height: 100%;
    overflow: hidden;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.10);
    padding:100px 10px 40px;
    box-sizing: border-box;
    position: relative;
  }

  .enter-setion-title {
    overflow: hidden;
  }

.search-box{
  border:1px solid #44d2ff;
  input{
    border: none;
  }
}
 
  .prises-set {
    height: 54px;
    line-height: 54px;
    padding: 0 20px;
    font-size: 18px;
    color: #333333;
    font-family: SourceHanSansCN-Normal;
    position: relative;
  }

  .add-icon {
    width: 12px;
    height: 12px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: url('../../assets/administrationIcon/add.png') no-repeat center center;
    background-size: cover;
  }



  .operation span {
    cursor: pointer;
  }

  
  // input{
  //   border:  0 none;
  //   outline: 0 none;
  // }
 

  .editIcon {
    margin-left: 20px;
    position: relative;
  }

  .editIcon::before {
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    background-size: cover;
    left: -13px;
    top: 4px;
  }

  .delete {
    color: #FF4848;
  }

.delete::before {
    background: url(../../assets/administrationIcon/delete.png) no-repeat ;
    height: 16px;
    margin-top: -1px;
    background-size: 100%
}
.editIcon1::before{
    background: url(../../assets/administrationIcon/edit.png) no-repeat ;
    background-size: 100%
  }

 

  .gain {
    border-bottom: 1px solid #E7E7E7;
    margin: 0 30px 20px 0;
    float: left;
    width: 300px;
    overflow: hidden;
  }

  .gain input, .gain p, .gain select {
    border: 0 none;
    width: 100%;
    outline: none;
    margin: 10px 0px;
    height: 15px;
    line-height: 15px;
  }

  .gain select {
    margin: 0;
    padding: 10px 0;
    height: auto;
    border: 0 none;
    outline: 0 none;
  }

  .gain .gain-button {
    height: 28px;
    text-align: center;
    border: 1px solid #666;
    color: #666;
    background: #fff;
    position: relative;
    padding: 7px 16px;
    width: auto;
    float: left;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 13px;
    margin-right: 20px;
  }

  .gain-button1::after {
    position: absolute;
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    top: -4px;
    right: -4px;
    background: red;
  }

  .gain p img {
    width: 6px;
    float: right;
    padding: 5px;
  }

  .Required {
    color: #FF4848;
  }

  .member {
    margin: 20px 0;
    font-size: 14px;
    overflow: hidden;
  }

  .member ul {
    margin: 16px 0 30px;
  }

  .member li {
    float: left;
    width: 42px;
    margin-right: 20px;
    font-size: 12px;
    position: relative;
  }

  .section-footer {
    width: 530px;
    height: 28px;
    overflow: hidden;
    box-sizing: border-box;
  }

  .section-footer button {
    float: right;
    box-sizing: border-box;
    margin-left: 20px;
    border: 2px solid #666666;
    height: 100%;
    width: 60px;
    line-height: 26px;
    text-align: center;
  }

  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 998;
    background: rgba(0, 0, 0, 0.6);

  }

  .gain-img {
    width: 120px;
    height: 120px;
    position: absolute;
    left: 650px;
    top: 50px;
  }
 
  .delete-show-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 998;
    color: #333;
  }

  .delete-show {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.10);
    padding: 0 30px;
    box-sizing: border-box;
    transform: translate(-50%, -50%)
  }

  .delete-show > p {
    margin: 50px 0 60px;
    text-align: center;
    font-size: 18px;
    color: #333;
  }

  .delete-show .delete-show-footer {
    overflow: hidden;
    margin-bottom: 30px;
  }

  .delete-show .delete-show-footer button {
    float: right;
    margin-right: 20px;
    width: 60px;
    height: 28px;
    color: #666;
    border: 1px solid #666;
    background: #fff;
    line-height: 27px;
  }

  .issync-content {
    width: 100%;
    height: 184px;
    padding-top: 36px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid #e7e7e7;
    margin-bottom: 20px;
  }

  .issync-content button {
    background: #FFFFFF;
    border: 1px solid #666666;
    width: 88px;
    height: 28px;
    line-height: 28px;
  }

  .issync-content > p {
    height: 14px;
    line-height: 14px;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .issync-content-img {
    width: 42px;
    height: 50px;
    margin-bottom: 5px;
    display: inline-block;
    background: url(../../assets/administrationIcon/wx.png) no-repeat center center;
    background-size: cover;
  }
  .add-edit-depart{
    width: 24px;
    height: 24px;
    float: right;
    background: url(../../assets/administrationIcon/add2.png) no-repeat center center;
    background-size: cover;
  }
  .depart-type{
    width:134px;margin:0 auto;height: 20px;line-height: 20px
  }
  .depart-type p{
    width: 60px;
    float: left;
    margin: 0;
  }
  .depart-type p img{
    width: 18px;
    height: 18px;
    float: left;
    padding: 0;
  }
   .depart-type p span{
    margin-top: 1px;
    display: inline-block;
   }
</style>
<style>

  .gain .el-radio__input.is-checked + .el-radio__label {
    color: #333;
  }
 
.bg .edit-people .el-table--border, .bg .edit-people .el-table--group, .bg .edit-people .el-table td, .bg .edit-people .el-table th.is-leaf,.bg .edit-people .el-input__inner{
  border-color:#44d2ff;
  color:#333;
  }
  .bg .table-footer .el-input__inner{
    border:1px solid #44d2ff;
    color:#fff;
  }
  .bg .edit-people .el-table--border:after, .bg .edit-people .el-table--group:after, .bg .edit-people .el-table:before{
    background: #44d2ff;
  }
  .bg .delete-show-box .el-input__inner{
    color: #333;
  }
   .bg .enter-box .el-table__fixed-right:before,.bg .enter-box  .el-table__fixed:before{
    background: #44d2ff;
   }
 
</style>
