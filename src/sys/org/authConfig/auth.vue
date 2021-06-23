<template>
<div class="main">
    <div class="main-left">
      <div class="title">
        <h4>角色列表</h4>
        <div class="search-box">
            <input type="text" v-model="search" @keyup.enter="loadRoleList()" placeholder="请输入关键字搜索">
            <i></i>
            <button class="theme-btn" @click="loadRoleList()">搜索</button>
        </div>
      </div>
      <div class="theme-table">
          <el-table :data="roleList"
            border
            ref="roleTalble"
            height="100%"
            highlight-current-row
            @current-change="handleCurrentChange">
              <el-table-column label="角色名称">
                  <template slot-scope="scope">
                      <span style="white-space: nowrap;">{{scope.row.roleName}}</span>
                      <span style="color: rgb(59, 140, 255);float: right;" v-if="scope.row.isSys">内置角色</span>
                  </template>
              </el-table-column>
          </el-table>
      </div>
    </div>
        <div style="height:100%;width:100%;display:flex;">
             <div class="unit-com" style="width: 100%;">
               <h4>菜单权限：{{selectRoleName}}
                    <div class="button-list">
                        <button v-if="sessionUtil.isAllowBtn('btn_senior')" style="background: #3B8CFF;border: 1px solid #3B8CFF;color: #fff;margin-left: 10px;" @click="seniorConfig()">高级配置</button>
                        <button v-if="sessionUtil.isAllowBtn('btn_save')" style="background: #3B8CFF;border: 1px solid #3B8CFF;color: #fff;margin-left: 10px;" @click="saveData()">保存权限</button>
                    </div>
                </h4>
                <el-tabs v-model="activeName" class="jr-tabs" >
                  <el-tab-pane label="角色权限" name="role-auth" class="jr-tab" >
                    <tree-table  v-if="show" :columns="treeColumns"
                      :data="treeData"
                      :treeType="true"
                      @tree-icon-click="treeIconClick"
                      id="ncy"
                      max-height="700px"
                      childrenProp="children"
                      :selectable="false"
                      :expandType="false"
                      @cell-click="clickRow"
                      ref="treeTable"
                    >
                      <template slot="btnLook" slot-scope="scope">
                        <el-checkbox v-model="scope.row[scope.column.key]" :true-label="1" :false-label="0" @change="handleCheckChange(scope, 1)"></el-checkbox>
                      </template>
                      <template slot="btnAdd" slot-scope="scope">
                        <el-checkbox v-model="scope.row[scope.column.key]" :disabled="disabled(scope.row)" :true-label="1" :false-label="0" @change="handleCheckChange(scope, 1)"></el-checkbox>
                      </template>
                      <template slot="btnDelete" slot-scope="scope">
                        <el-checkbox v-model="scope.row[scope.column.key]" :disabled="disabled(scope.row)" :true-label="1" :false-label="0" @change="handleCheckChange(scope, 1)" ></el-checkbox>
                      </template>
                      <template slot="btnEdit" slot-scope="scope">
                        <el-checkbox v-model="scope.row[scope.column.key]" :disabled="disabled(scope.row)" :true-label="1" :false-label="0" @change="handleCheckChange(scope, 1)" ></el-checkbox>
                      </template>
                      <template slot="btnExport" slot-scope="scope">
                        <el-checkbox v-model="scope.row[scope.column.key]" :disabled="disabled(scope.row)" :true-label="1" :false-label="0" @change="handleCheckChange(scope, 1)"></el-checkbox>
                      </template>
                    </tree-table>
                  </el-tab-pane>
                  <el-tab-pane label="人员情况" name="user-auth" class="jr-tab" style="width: 100%;">
                     <el-table
                        :data="tableData1"
                        border
                        :cell-style="{textAlign:'center',color:'#fff'}"
                        height="100%" width="100%"
                        id="el-table"
                        highlight-current-row
                        :header-cell-style="headerCell">
                        <!-- <el-table-column type="selection" width="45"></el-table-column>
                        <el-table-column label="操作" fixed width="60">
                            <template slot-scope="scope">
                                <p class="operation">
                                    <img src="../../../assets/administrationIcon/removedepart.png"  @click="deleteRoleUser(scope.row)" alt="">
                                </p>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="姓名">
                            <template slot-scope="scope">
                                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.userName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="性别">
                            <template slot-scope="scope">
                                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.gender==1? '男':'女' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="账号" >
                            <template slot-scope="scope">
                                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.userId}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="手机号" >
                            <template slot-scope="scope">
                                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.mobileNo}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
             </div>
        </div>
        <div v-if="selectFormVisible" >
          <div class="mask" ></div>
          <div class="boxs" :style="{width:'800px',height:'600px'}">
            <h4>高级配置：{{config.title}}
                <div class="button-list">
                    <button style="background: #3B8CFF;border: 1px solid #3B8CFF;color: #fff;margin-left: 10px;" @click="selectFormVisible = false">返回</button>
                </div>
            </h4>
             <el-tabs v-model="formId" v-if="config"  class="jr-tabs" >
                <el-tab-pane :key="form.id" :label="form.title" :name="form.id" v-for="(form,index) in config.forms" class="jr-tab">
                  <tree-table
                      :columns="columns"
                      :data="form.columns"
                      :treeType="false"
                      :selectable="false"
                      :expandType="false"
                      :show-row-hover="true"
                      @cell-click="clickRow"
                      ref="table"
                    >
                      <template slot="btnLook" slot-scope="scope">
                        <el-checkbox v-model="scope.row[scope.column.key]" :true-label="1" :false-label="0" @change="handleCheckChange(scope, 2)"></el-checkbox>
                      </template>
                      <template slot="btnEdit" slot-scope="scope">
                        <el-checkbox v-model="scope.row[scope.column.key]" :true-label="1" :false-label="0" @change="handleCheckChange(scope, 2)" ></el-checkbox>
                      </template>
                    </tree-table>
                </el-tab-pane>
              </el-tabs>
          </div>
        </div>
    </div>
</template>

<script>
import { tableMixin } from '../../../public/js/mixins.js'
import { setTimeout } from 'timers';
export default {
  mixins:[tableMixin],
  data() {
    return {
      props: {
          label: 'title',
          children: 'children',
          isLeaf: 'leaf'
      },
      defaultExpandedKeys:['root'],
      title:'角色授权',
      show: true,
      selectFormVisible: false,
      fontColor:'',
      search:'',
      treeData:[],
      tableData1: [],
      roleList:[],
      selectRoleName:'',
      selectRole:null,
      selectMenu:null,
      bgColor:'',
      name:1,
      activeName:'role-auth',
      formId: '',
      config: {},
      clickCell: null,
      columns:[
        {
          title: '显示',
          key: 'btnLook',
          Width: '100px',
          align:'center',
          headerAlign:'center',
          type: 'template',
          template: 'btnLook'
        },
        {
          title: '可编辑',
          key: 'btnEdit',
          Width: '100px',
          align:'center',
          headerAlign:'center',
          type: 'template',
          template: 'btnEdit'
        },
        {
          title: '字段名称',
          key: 'title',
          minWidth: '100px',
          headerAlign:'center',
          align:'center'
        },
        {
          title: '字段名',
          key: 'columnName',
          minWidth: '100px',
          headerAlign:'center',
          align:'center'
        },
        {
          title: '类型',
          key: 'widgetType',
          minWidth: '100px',
          headerAlign:'center',
          align:'center'
        }
      ],
      treeColumns: [
        {
          title: '菜单',
          key: 'title',
          width: '400px',
          minWidth: '300px',
          headerAlign:'center',
          align:'left'
        },
        {
          title: '查看',
          key: 'btnLook',
          Width: '100px',
          align:'center',
          headerAlign:'center',
          type: 'template',
          template: 'btnLook'
        },
        {
          title: '添加',
          key: 'btnAdd',
          Width: '100px',
          align:'center',
          headerAlign:'center',
          type: 'template',
          template: 'btnAdd'
        },{
          title: '修改',
          key: 'btnEdit',
          Width: '100px',
          headerAlign:'center',
          align:'center',
          type: 'template',
          template: 'btnEdit'
        },{
          title: '删除',
          key: 'btnDelete',
          Width: '100px',
          headerAlign:'center',
          align:'center',
          type: 'template',
          template: 'btnDelete'
        },{
          title: '导出',
          key: 'btnExport',
          headerAlign:'center',
          Width: '100px',
          align:'center',
          type: 'template',
          template: 'btnExport'
        }
      ]
    };
  },
  components: {

  },
  created() {
    this.fontColor=this.$store.state.themeBG
    this.bgColor=this.$store.state.themeColor;
  },
  activated() {

  },
  mounted() {
    // 数据初始化
    this.loadRoleList();
  },
  computed: {
    disabled (row){
      return function (row) {
        return false
        // 过滤权限
        // return row.formKey === undefined
      }
    }
  },
  methods: {
     // 点击展开行
     treeIconClick(row, rowIndex, $event){
       let theHeight = document.querySelector('#ncy .zk-table__body-wrapper').scrollTop
       let edit = this.setHiden(row, row._isFold)
       this.setChecked(this.treeData, edit)
       this.clickCell = edit
       setTimeout(()=>{
         document.querySelector('#ncy .zk-table__body-wrapper').scrollTop = theHeight
       },1)
     },
     setHiden(items, isFold){
        if(this.hasChildren(items)){
          items.children = items.children.map((item, index) => {
            item._isHide = isFold
            if (isFold){
              item = this.setHiden(item, isFold)
            }
            return item
          })
        }
        return items
     },
     loadRoleList(){//加载角色
      this.util.mask()
      // this.util.restGet('/api_v1/org/roles', { companyUid: this.$store.state.companyUid,start:0,pageSize:100,search:this.search,ifContainCommon:false }, (res)=> {
      this.util.restGet('http://api.com', null, (res)=> {
          this.util.unmask();
          console.log("ttp://api.com=======>",res);
          if (res.status == 200 && res.data) {
              this.roleList=res.data
              this.selectRole = res.data[0]
              // this.loadTree()
              // this.$refs['roleTalble'].setCurrentRow(this.roleList[0])
              // this.handleCurrentChange(res.data[0])
          }
      });
     },
     //行点击事件
     clickRow(row){
       this.selectMenu = row
     },
     loadRoleAuth(){//加载授权信息
      this.util.mask()
      this.setCheckedKeys([]);//先清空选择
      var _this = this;
      let params = {
        parentId: _this.sessionUtil.getAppId(),
        businessKey: _this.selectRole.id
      }
      if(_this.clickCell && _this.clickCell.id){
        params.parentId = _this.clickCell.id
      }
      _this.util.restPost('/api_v1/auth/auths', params, (res)=> {
          console.log("auths=====",res);
          if (res.status == 200) {
            this.treeData = this.setTree(this.treeData, res.data)
            this.show = false;
            this.$nextTick(() => {
              this.show = true;
            })
          }else{
            _this.util.error(res.errorMsg);
          }
          _this.util.unmask();
      });
     },
     setTree(tree, list){
      tree.map((item, index) => {
        let v = list.find(eidt => {
          return eidt.id === item.id
        })
        if (v) item = Object.assign(item, v)
        if (this.hasChildren(item)) item.children = this.setTree(item.children,list)
        // 如果
        if (this.hasChildren(item)) {
          item['btnAdd'] = this.getChecked(item.children,'btnAdd')
          item['btnEdit'] = this.getChecked(item.children,'btnEdit')
          item['btnDelete'] = this.getChecked(item.children,'btnDelete')
          item['btnExport'] = this.getChecked(item.children,'btnExport')
        }
        return item
      })
      return tree
     },
     getChecked (list , key) {
       let falg = 0
       if(!list) return 0
       list.forEach(item => {
         if (item[key] === 1) falg = 1
         if (this.hasChildren(item)) {
           if (this.getChecked(item.children , key) === 1) falg = 1
         }
       })
       return falg
     },
     getTreeData (tree, level, defaultHide) {
        tree.map((item, index) => {
          item._isHide = level === 1 ? false : defaultHide
          item._isFold = defaultHide
          if (this.hasChildren(item)) item.children = this.getTreeData(item.children, level+1, defaultHide)
          return item
        })
        return tree
     },
     loadTree(){
      this.setCheckedKeys([]);//先清空选择
      var _this = this;
      let params = {
        parentId: this.sessionUtil.getAppId(),
        businessKey: this.selectRole.id
      }
      if(this.clickCell && this.clickCell.id){
        params.parentId = this.clickCell.id
      }
      this.treeData = []
      this.util.restPost('/api_v1/auth/menus', params, (res)=> {
          if (res.status == 200 && res.data && res.data.length>0) {
            _this.treeData =  _this.getTreeData(res.data, 1, true)
          }else{
            _this.util.error(res.errorMsg);
          }
      });
     },
     handleCurrentChange(data){//点击左边角色选中
      //console.info("========handleSelectionChange========");
      this.selectRole=data;
      this.selectMenu=null
      this.selectRoleName = this.selectRole.roleName;
      this.refreshRoleList()
      this.loadRoleAuth(this.selectRole.id);
     },
     refreshRoleList(){ //加载角色人员列表
        this.util.restGet('/api_v1/org/users', { companyUid: this.$store.state.companyUid ,roleUid:this.selectRole.id,start: 0, pageSize: 100,ifContainCommon:false}, (res)=> {
            // console.log("users=====",res);
            if(res.status==200){
                this.tableData1=res.data;
            }else {
                this.util.error("系统错误");
            }
        });
     },
     getParents(data, value) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === value) {
            return [data[i]]
          }
          if (data[i].children) {
            var ro = this.getParents(data[i].children, value)
            if (ro !== undefined) {
              return ro.concat(data[i])
            }
          }
        }
     },
     handleCheckChange(scope, type){
       // let params = {}
       if(type == 1){
         // 向下勾选
         this.handleCheckAll(scope.row, scope.column.key, scope.row[scope.column.key])
         // 向上勾选
         if(scope.column.key == 'btnLook' && scope.row[scope.column.key] == 1){
           let list = this.getParents(this.treeData, scope.row.id)
           if(list.length >1){
             for (let index = 1; index < list.length; index++) {
               list[index][scope.column.key] = 1
             }
           }
         }
         if('btnLook' != scope.column.key && !scope.row.formKey && !(scope.row.children && scope.row.children.length > 0)){
            scope.row[scope.column.key] = 0
            this.util.error('不可操作')
         }
         this.$forceUpdate()
       }else if(type == 2){
          // 如果是高级配置
          let orgRoleAuthList = [{
            roleUid: this.selectRole.id,
            resourceUid: scope.row.id + '@' + scope.column.key,
            type: 4
          }]
          let params = {
            orgRoleAuthList: orgRoleAuthList,
            saveType: 2,
            roleUid: this.selectRole.id,
            checked: scope.row[scope.column.key]
          }
          if(params.orgRoleAuthList && params.orgRoleAuthList.length>0){
              this.util.mask()
              this.util.restPost('/api_v1/auth/save', params, (res)=> {
                if (res.status == 200) {
                    this.util.success("保存成功！")
                    // 修改点击状态
                } else {
                    // 保存错误则修改点击状态
                    scope.row[scope.column.key] = scope.row[scope.column.key] === 0 ? 1 : 0
                    this.util.error(res.errorMsg)
                }
                // 解决被选择选择框值状态无法改变bug
                this.util.unmask()
            })
          }
       }
       this.setChecked(this.treeData, scope.row)
       // 刷新页面
       this.show = false;
       this.$nextTick(() => {
         this.show = true;
       })
       let theHeight = document.querySelector('#ncy .zk-table__body-wrapper').scrollTop
       setTimeout(()=>{
         document.querySelector('#ncy .zk-table__body-wrapper').scrollTop = theHeight
       },1)
     },
     getAuthList(data) {
        let _this = this
        let tmp = []
        Array.from(data).forEach(function (record) {
          if (record.btnLook === 1){
            tmp.push({
              roleUid: _this.selectRole.id,
              resourceUid: record.id,
              type: 3
            })
          }
          if (record.formKey){
            if(record.btnAdd === 1){
              tmp.push({
                roleUid: _this.selectRole.id,
                resourceUid: record.formKey + '@btnAdd',
                type: 3
              })
            }
            if (record.btnDelete === 1){
              tmp.push({
                roleUid: _this.selectRole.id,
                resourceUid: record.formKey + '@btnDelete',
                type: 3
              })
            }
            if (record.btnEdit === 1){
              tmp.push({
                roleUid: _this.selectRole.id,
                resourceUid: record.formKey + '@btnEdit',
                type: 3
              })
            }
            if (record.btnExport === 1){
              tmp.push({
                roleUid: _this.selectRole.id,
                resourceUid: record.formKey + '@btnExport',
                type: 3
              })
            }
          }
          if (record.children && record.children.length > 0) {
            let children = _this.getAuthList(record.children)
            tmp = tmp.concat(children)
          }
        })
        return tmp
     },
     // 展开行
     expandCell(tree, row, data){
       for (let i = 0; i < tree.length; i++) {
        if (tree[i].children) {
         tree[i].children = this.expandCell(tree[i].children, row, data)
        }
        if (tree[i].id === row.id) {
          tree[i].children = data
          return
        }
      }
     },
     setChecked (data, row) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === row.id) {
          data[i] = row
        }
        if (data[i].children) {
         data[i].children = this.setChecked(data[i].children, row)
        }
      }
      return data
     },
     handleCheckAll(items, key, checked){
        if(this.hasChildren(items)){
          items.children = items.children.map((item, index) => {
            item[key] = checked
            if(item.hasChildren !== 1 && item.formKey === undefined && key !== 'btnLook'){
              item[key] = 0
            }
            item = this.handleCheckAll(item, key, checked)
            return item
          })
        }
        return items
     },
     hasChildren(item){
       return item.children && item.children.length !== 0
     },
     setCheckedKeys(data) {//设置选中
      if(data != undefined && data != null && data.length>0){
           //this.$refs.tree.setCheckedKeys(['root']);
           //this.$refs.tree.setCheckedKeys(data);
           //this.$refs.tree.setCheckedKeys(data,true);
           var _this = this;
            data.forEach(function(node,index) {
             // _this.$refs.tree.setChecked(node,true,false);
            });

      }else{
        // this.$refs.tree.setCheckedKeys([]);
      }
     },
     getCheckedNodes() {//获取选中数据
        //console.log(this.$refs.tree.getCheckedNodes());
        var data = [];
        var roleUid = this.selectRole.id;
        this.$refs.tree.getCheckedNodes(false,true).forEach(function(node,index) {
          if(node.id != 'root'){
              data.push({
                resourceUid:node.id,
                title:node.title,
                roleUid:roleUid,
                type:node.resourceType,
              });
          }
        });
        return data;
      },
      seniorConfig(){
        if(this.selectMenu == null){
          this.util.warn('请选择菜单！');
          return;
        }
        if(!this.selectMenu.formKey){
          this.util.warn('请选择其他菜单！');
          return;
        }
        let params = {
          formKey:this.selectMenu.formKey,
          businessKey: this.selectRole.id
        }
        this.util.restPost('/api_v1/auth/forms', params, (res)=> {
          if (res.status == 200) {
            if(res.data.forms && res.data.forms.length>0){
              // 过滤掉没有高级查询的表单
              res.data.forms = res.data.forms.filter((item, index) => {
                  return item.columns.length > 0
              })
              // 如果有高级查询则显示
              if(res.data.forms.length>0){
                this.formId = res.data.forms[0].id
                this.config = res.data
                this.selectFormVisible = true
              }else{
                this.util.error('无法高级配置')
              }
            } else {
              this.util.error('无法高级配置')
            }
          } else {
              this.util.error(res.errorMsg);
          }
          this.util.unmask();
        })
      },
      // 去重函数
      unique(arr){
        var hash=[];
        for (var i = 0; i < arr.length; i++) {
          for (var j = i+1; j < arr.length; j++) {
            if(arr[i].columnName === arr[j].columnName){
              ++i;
            }
          }
            hash.push(arr[i]);
        }
        return hash;
      },
      saveData(){
        var roleUid = this.selectRole.id
        var _this = this
        if(this.selectRole == null){
          this.util.warn('请选择角色！')
          return
        }
        var data = this.getAuthList(this.treeData)
        let params = {
          orgRoleAuthList: data,
          roleUid: _this.selectRole.id,
          saveType: 1,
        }
        this.util.mask()
        this.util.restPost('/api_v1/auth/save', params, (res)=> {
            if (res.status == 200) {
                this.util.success("保存成功！")
                // 修改点击状态
            } else {
                this.util.error(res.errorMsg)
            }
            this.util.unmask()
        })
      }
  }
};
</script>
<style scoped lang="scss">
.main{
  width:100%;
  height:100%;
  display:flex;
  &-left{
    width: 616px;
    height: 100%;
    box-sizing: border-box;
    margin-right: 10px;
    .title{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .theme-table{
      height: 100%;
    }
  }
}

.el-table .success-row {
    background: #f0f9eb;
  }
.list-box{
    width: 100%;height: 100%;
}
.selectedRow{
    background: #000;
}
.unit-left{
    width: 616px;
    float: left;
    height: 100%;
    box-sizing: border-box;
}
.unit-left>div{
    width: 100%;
    height: 85%;
    padding: 0 30px;
    box-sizing: border-box;
}
.people-list{
    overflow: hidden;
    background: #fff;
    height: 100%;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10)
}
h4{
    color: #fff;
    font-size: 18px;
    font-family: SourceHanSansCN-Medium;
    padding-left: 30px;
    position: relative;
    margin:15px 0;
}
h4 i{
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    height: 20px;
    width: 2px;
}

.button-list{
    overflow: hidden;
    float: right;
    margin-top: -2px;
}
 .search{
    float: left;
    width: 220px;
    height: 28px;
    padding:0 28px 0 10px;
    box-sizing: border-box;
    position: relative;
    border: 1px solid #e7e7e7;
    background: #fff;
    margin-right: 20px;
}
.button-list>div button{
    width: 26px;
    min-width: 26px;
    border: 0 none;
    height: 26px;
    position: absolute;
    top: 0px;
    right:0px;
    background: url(../../../assets/administrationIcon/search.png) no-repeat center center;
    background-size: 75% 75%;
    margin: 0;
}
.button-list>div input{
    width: 100%;
    height: 20px;

}
.button-list button{
    float: left;
    background: #fff;
    height: 28px;
    min-width: 60px;
    border:1px solid #666;
    line-height: 27px;
    box-sizing: border-box;
    padding: 0 10px;color: #666;
}
.jr-container{
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.jr-form-tool {
  /*border-top:1px solid #efefef;*/
  padding-top: 0px;
  padding-bottom: 0px;
  /*border-bottom:1px solid #efefef;*/
  margin-bottom: 10px;
}

.jr-form-main {
  background-color: white;
  border: 1px solid #efefef;
  border-radius: 5px;
  padding: 10px;
  /*display:table;*/
  /*display: flex;*/
  /*flex-flow: column;*/
  margin-bottom: 10px;
  /*height:100%;*/
}

.jr-form-sub {
  margin-top: 10px;
  border: 1px solid #efefef;
  height: 100%;
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
  padding: 0 15px;
  display: flex;
  flex-flow: column;
  overflow: auto;
  box-sizing: border-box;
}


</style>
<style lang="scss">
.jr-tabs .el-tabs__item{
  color: #fff;
}
.jr-tabs .el-tabs__item.is-active {
    color: #409eff;
}
.jr-tab .el-table th>.cell {
    position: relative;
    word-wrap: normal;
    text-overflow: ellipsis;
    color: #fff;
}
</style>
