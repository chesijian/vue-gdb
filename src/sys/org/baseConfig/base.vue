<template>
    <div style="width:100%;height:100%;display:flex;overflow-x: auto;">
        <div style="height:100%;width:100%;display:flex;">
             <div class="unit-com" style="width: 100%;">
               <h4>数据权限：{{selectRoleName}}
                    <div class="button-list">
                        <button v-if="util.isAllowBtn('btn_save')" style="background: #3B8CFF;border: 1px solid #3B8CFF;color: #fff;margin-left: 10px;" @click="saveData()">保存权限</button>
                    </div>
                </h4>
                <el-tabs v-model="activeName" @tab-click="handleTabClick" class="jr-tabs" >
                  <el-tab-pane label="数据权限" name="role-auth" class="jr-tab">
                    <tree-table
                      v-if="show"
                      :columns="treeColumns"
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
                      <template slot="btnAll" slot-scope="scope">
                        <el-checkbox v-model="scope.row[scope.column.key]" :true-label="1" :false-label="0" @change="handleCheckChange(scope,scope.column.key)"></el-checkbox>
                      </template>
                      <template slot="btnSuperior" slot-scope="scope">
                        <el-checkbox v-model="scope.row[scope.column.key]" :disabled="disabled(scope.row)" :true-label="1" :false-label="0" @change="handleCheckChange(scope,scope.column.key)"></el-checkbox>
                      </template>
                      <template slot="btnDepart" slot-scope="scope">
                        <el-checkbox v-model="scope.row[scope.column.key]" :disabled="disabled(scope.row)" :true-label="1" :false-label="0" @change="handleCheckChange(scope,scope.column.key)" ></el-checkbox>
                      </template>
                      <template slot="btnProject" slot-scope="scope">
                        <el-checkbox v-model="scope.row[scope.column.key]" :disabled="disabled(scope.row)" :true-label="1" :false-label="0" @change="handleCheckChange(scope,scope.column.key)" ></el-checkbox>
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
import { getConfig } from '@/api/form-render'
import { debuglog } from 'util';
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
          title: '所有人员',
          key: 'btnAll',
          Width: '100px',
          align:'center',
          headerAlign:'center',
          type: 'template',
          template: 'btnAll'
        },
        {
          title: '下级',
          key: 'btnSuperior',
          Width: '100px',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'btnSuperior'
        },{
          title: '同部门',
          key: 'btnDepart',
          Width: '100px',
          headerAlign:'center',
          align:'center',
          type: 'template',
          template: 'btnDepart'
        },{
          title: '项目人员',
          key: 'btnProject',
          Width: '100px',
          headerAlign:'center',
          align:'center',
          type: 'template',
          template: 'btnProject'
        }
      ]
    };
  },
  components: {

  },
  created() {
    this.util.init(this);
    this.fontColor=this.$store.state.themeBG
    this.bgColor=this.$store.state.themeColor;
  },
  activated() {

  },
  mounted() {
    // 数据初始化
    this.util.init(this);
    this.init();
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
     init: function () {
       this.loadTree()
     },
     handleTabClick(tab, event){
       //console.log(tab, event)
     },
     //行点击事件
     clickRow(row){
       this.selectMenu = row
     },
     loadDataAuth(){//加载授权信息
      this.util.mask()
      this.setCheckedKeys([]);//先清空选择
      var _this = this;
      let params = {
        parentId: _this.sessionUtil.getAppId(),
      }
      if(_this.clickCell && _this.clickCell.id){
        params.parentId = _this.clickCell.id
      }
      _this.util.restPost('/api_v1/auth/data/auths', params, (res)=> {
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
          item['btnAll'] = this.getChecked(item.children,'btnAll')
          item['btnSuperior'] = this.getChecked(item.children,'btnSuperior')
          item['btnDepart'] = this.getChecked(item.children,'btnDepart')
          item['btnProject'] = this.getChecked(item.children,'btnProject')
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
        parentId: this.sessionUtil.getAppId()
      }
      this.treeData = []
      this.util.restPost('/api_v1/auth/menus', params, (res)=> {
          if (res.status == 200 && res.data && res.data.length>0) {
            _this.treeData = _this.getTreeData(res.data, 1, true)
            _this.loadDataAuth()
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
        this.util.restGet('/api_v1/org/users', { companyUid: this.$store.state.companyUid ,roleUid:this.selectRole.id,start: 0, pageSize: 100}, (res)=> {
            // console.log(res);
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
     handleCheckChange(scope, key){
       // let params = {}
       // 向下勾选
       this.handleCheckAll(scope.row, key, scope.row[key])
       // 左右勾选
       if(key == 'btnAll' && scope.row[key] == 1){
          // 修改上级
         // scope.row['btnSuperior'] == 1
         this.$set(scope.row,'btnSuperior', 1)
         this.handleCheckChange(scope, 'btnSuperior')
         // 修改同部门
         this.$set(scope.row,'btnDepart', 1)
         this.handleCheckChange(scope, 'btnDepart')
         // 修改同项目
         this.$set(scope.row,'btnProject', 1)
         this.handleCheckChange(scope, 'btnProject')
       }
       if(!scope.row.formKey && !(scope.row.children && scope.row.children.length > 0)){
           scope.row[key] = 0
       }
       this.$forceUpdate()
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
          if (record.formKey){
            if(record.btnAll === 1){
              tmp.push({
                resourceUid: record.formKey + '@btnAll',
                type: 3
              })
            }
            if (record.btnSuperior === 1){
              tmp.push({
                resourceUid: record.formKey + '@btnSuperior',
                type: 3
              })
            }
            if (record.btnDepart === 1){
              tmp.push({
                resourceUid: record.formKey + '@btnDepart',
                type: 3
              })
            }
            if (record.btnProject === 1){
              tmp.push({
                resourceUid: record.formKey + '@btnProject',
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
            if(!this.hasChildren(item) && item.formKey === undefined){
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
              }else{
                this.util.error('无法高级配置')
              }
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
        var _this = this
        var data = this.getAuthList(this.treeData)
        let params = {
          orgRoleAuthList: data
        }
        this.util.mask()
        this.util.restPost('/api_v1/auth/data/save', params, (res)=> {
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
<style scoped>
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
    color: #333;
    font-size: 18px;
    font-family: SourceHanSansCN-Medium;
    padding-left: 12px;
    position: relative;
    margin:30px 0;
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
  padding-left: 12px;
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