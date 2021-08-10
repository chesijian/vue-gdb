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
              <div class="theme-table" style="width:100%;height:100%;" ref="tableHeight">
                  <el-table ref="multipleTable" :data="roleList" style="width: 100%;"   border stripe
                      :header-row-style="{overflow:'hidden',}"  highlight-current-row class="highlight-current-row"
                      :height="tableHeightNum" :header-cell-style="{height:'34px',padding:0,textAlign:'center'}"
                        @current-change="handleCurrentChange">
                      
                      <el-table-column label="角色名称">
                          <template slot-scope="scope">
                              <span style="white-space: nowrap;margin-left: 10px">{{scope.row.roleName}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="角色描述">
                          <template slot-scope="scope">
                              <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.remark}}</span>
                          </template>
                      </el-table-column>
                  </el-table>
              </div>
        </div>
        <div class="main-right">
             <div class="role-list box-style" style="width: 100%;padding-right: 0px;">
                  <div style="padding-top:46px">
                        <div style="position:relative;width:100%;">
                            <h4 style="position:absolute;top:-34px;width:100%;box-sizing:border-box;">菜单权限：{{selectRoleName}}
                                <div class="button-list">
                                    <button v-if="sessionUtil.isAllowBtn('010105:btn_save')"  :style="{background:bgColor,borderColor:bgColor,color:'#fff'}" @click="saveData()">保存权限</button>
                                </div>
                            </h4>
                        </div>
                      <div style="height: 100%;overflow: auto;">
                        <el-tree
                          :data="treeData"
                          :props="props" 
                          show-checkbox
                          ref="tree"
                          node-key="id"
                          :default-expanded-keys="defaultExpandedKeys"
                          highlight-current
                          @check-change="handleCheckChange">
                        </el-tree>
                      </div>
                  
                   </div>
             </div>

        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      props: {
          label: 'title',
          children: 'children',
          isLeaf: 'leaf'
        },
        defaultExpandedKeys:['root'],
      title:'角色授权',
      fontColor:'',
      search:'',
      treeData:[],
      roleList:[],
      selectRoleName:'',
      selectRole:null,
      bgColor:'',
      tableHeightNum:0,
      name:1
    };
  },
  mounted() {
    this.fontColor=this.$store.state.themeBG
    this.bgColor=this.$store.state.themeColor;
    this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tableHeight.offsetHeight-1
    })
    // 数据初始化
    this.loadRoleList();
    this.loadTree();

  },
  methods: {
    loadRoleList(){//加载角色
      this.util.mask()
      this.util.restGet('/api_v1/org/roles', {start:0,pageSize:100,search:this.search,ifContainCommon:true }, (res)=> {
          this.util.unmask();
          if (res.status == 200) {
              this.roleList=res.data;
          } else {
              this.util.error(res.errorMsg);
          }
      });
    },
    loadRoleAuth(roleUid){//加载授权信息
      this.util.mask()
      this.setCheckedKeys([]);//先清空选择
        this.util.restGet(`/api_v1/org/roles/${roleUid}/auths`, null, (res)=> {
            if (res.status == 200) {
                if(res.data){
                  var list = [];
                  res.data.forEach(function(item,index) {
                    list.push(item['resourceUid']);
                  });
                  this.setCheckedKeys(list);
                }
            } else {
                this.util.error(res.errorMsg);
            }
            this.util.unmask();
      });
    },
    loadTree(){
      this.util.restGet('/api_v1/org/menus?parentId=root', { companyUid: this.$store.state.companyUid,isContainAuth:true }, (res)=> {
          if (res.status == 200) {
              this.treeData=[{
                title:'全选',
                id:'root',
                leaf:false,
                children:res.data
              }];
          } else {
              this.util.error(res.errorMsg);
          }
          this.util.unmask();
      });
    },
    handleCurrentChange(data){//点击左边角色选中
      this.selectRole=data;
      this.selectRoleName = this.selectRole.roleName;
      this.loadRoleAuth(this.selectRole.id);
    },
    handleCheckChange(e){
            //console.info(e);
    },
    setCheckedKeys(data) {//设置选中
      console.info(data);
      if(data != undefined && data != null && data.length>0){
           //this.$refs.tree.setCheckedKeys(['root']);
           //this.$refs.tree.setCheckedKeys(data);
           //this.$refs.tree.setCheckedKeys(data,true);
           var _this = this;
            data.forEach(function(node,index) {
              _this.$refs.tree.setChecked(node,true,false);
          
            });
           
      }else{
        this.$refs.tree.setCheckedKeys([]);
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
      saveData(){
        if(this.selectRole == null){
          this.util.warn('请选择角色！');
          return;
        }
        var data  = this.getCheckedNodes();
        var roleUid = this.selectRole.id;
        this.util.restPost(`/api_v1/org/roles/${roleUid}/auths`, data, (res)=> {
            if (res.status == 200) {
                this.util.success("保存成功！");
            } else {
                this.util.error(res.errorMsg);
            }
            this.util.unmask();
        });
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
  &-right{
    height:100%;
    width:100%;
    display:flex;
  }
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
    border: 1px solid #44d2ff;
    color: #fff;
    background: transparent;
}
.button-list>div button{
    width: 26px;
    min-width: 26px;
    border: 0 none;
    height: 26px;
    position: absolute;
    top: 0px;
    right:0px;
    background: url(../../assets/administrationIcon/search.png) no-repeat center center;
    background-size: 50% 50%;
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
</style>
<style>
.role-list .el-tree{
    background:transparent;
    color:#fff;
}
.role-list .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content,.role-list .el-tree-node__content:hover{
    background:rgba(68,210,255,.2);
}
 .bg .role-list  .el-table--striped .el-table__body tr.el-table__row--striped td{
    background: transparent;
  }
</style>
