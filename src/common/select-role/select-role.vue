<template>
    <div class="box" v-if="selectRoleModels.isShow">
        <div class="mask-box" @click.stop.prevent="cancel"></div>
        <div class="querter-box">
            <div class="querter-list-box">
                <h4 style="margin:20px 0;width:270px;color: #000;"><i></i>选择角色
                    <input type="text" style="float:right;height:28px;border:1px solid #e7e7e7;padding-left:10px;font-size:12px;margin-top: -5px;" v-model="search" @keyup.enter="searchRole" placeholder="搜索">
                </h4>
                <div class="item-box">

                    <ul v-if="RoleList.length != 0">
                        <li v-for="(item, index) in RoleList" :key="index" @click.stop.prevent="radioSelect(item)">
                            <img src="../../assets/asideIcon/bule.png" width="12" height="12" alt="">
                            <span>{{item.roleName}}</span>
                            <div style="float:right;margin-top:3px;" v-if="!selectRoleModels.radioSelectFlags">
                                <img src="../../assets/administrationIcon/active.png" class="checked-icon" v-if="item.active" @click.stop.prevent="checked(item)" alt="">
                                <img src="../../assets/administrationIcon/defult.png" class="checked-icon" v-if="!item.active" @click.stop.prevent="checked(item)" alt="">
                            </div>
                        </li>
                    </ul>
                    <span v-else class="noResult">赞无数据</span>
                </div>
            </div>
            <div class="select-list">
                <h4 style="margin:20px 0;width:100%;color: #000;"><i></i>已选角色</h4>
                <div class="item-box" style="border:0 none;">
                    <el-table ref="multipleTable" :data="selectList"
                    border
                    :cell-style="{textAlign:'center',}" height="460"
                    :header-cell-style="headerCell"
                    highlight-current-row
                    >
                    <el-table-column label="角色名称" >
                        <template slot-scope="scope">
                            <p>{{scope.row.roleName}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" >
                         <template slot-scope="scope">
                            <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#fff" @click="cancelSelect(scope.row)">一</button>
                        </template>
                    </el-table-column>
                    </el-table>

                </div>
            </div>
            <div class="footer">
                <el-button @click="cancel" size="small">关闭</el-button>
                <el-button type="warning" size="small" @click="success">确定</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import {tableMixin} from '../../public/js/mixins.js'
import { mapMutations, mapGetters } from 'vuex'
export default {
    props:['selectRoleModels'],
    mixins:[tableMixin],
    data(){
        return{
            active:false,
            dialogVisible: false,
            level:0,
            selectList:[],
            RoleList:[],
            search: ''
        }
    },
    created () {
      this.bgColor = this.$store.state.themeColor
      this.fontColor = this.$store.state.themeBG
      this.loadData()
    },

  mounted() {
    // console.log('-------mounted----1----',this.selectRoleModels)
    for (let i = 0; i < this.RoleList.length; i++) {
      this.RoleList[i].active=false;
      for (let j = 0; j < this.selectRoleModels.selectList.length; j++) {
        if(this.selectRoleModels.selectList[j].id==this.RoleList[i].id){
          this.RoleList[i].active=true;
        }
      }
    }
    // console.log('-------mounted--------',this.selectRoleModels)
    this.selectList=this.selectRoleModels.selectList
  },
    computed: {
        ...mapGetters([
            'roleDatas'
        ])
    },
    watch:{
        'selectRoleModels.isShow'(newVal,oldVal){
          console.log('------watch--------',newVal,this.RoleList,this.selectRoleModels.selectList)
          if(newVal){
                for (let i = 0; i < this.RoleList.length; i++) {
                       this.RoleList[i].active=false;
                       for (let j = 0; j < this.selectRoleModels.selectList.length; j++) {
                           if(this.selectRoleModels.selectList[j].id==this.RoleList[i].id){
                               this.RoleList[i].active=true;
                           }
                       }
                    }
                this.selectList=this.selectRoleModels.selectList
            }
        }
    },
    methods: {
        ...mapMutations([
            'setRoleDatas'
        ]),
        searchRole() {
            this.loadData()
        },
        radioSelect(data){
            if(!this.selectRoleModels.radioSelectFlags){
                this.checked(data)
                return
            }
            // if(this.selectRoleModels.editObj&&this.selectRoleModels.editObj.id==data.id){
            //     return
            // }
            var arr=[];
            arr.push(data)
            this.selectList=arr
            this.success()
        },
        loadData(){
            var param={
                Authorization:this.sessionUtil.getAccessToken(),
              ifContainCommon:true,
              companyUid:this.$store.state.companyUid,
                type:'depart',
                projType:this.searchText,
                start:0,
                search: this.search,
                pageSize:1000,
            }
            // 设置缓存
            if(this.roleDatas && this.roleDatas.id){
                this.RoleList.push(this.roleDatas);
                return ;
            }
            this.util.restGet('/api_v1/org/roles',param,(res)=>{
                if(res.status==200){
                    if(res.data) {
                        for (let i = 0; i < res.data.length; i++) {
                        res.data[i].active=false;
                        }
                        this.RoleList = res.data;
                        this.setRoleDatas(res.data);
                    } else {
                        this.RoleList = [];
                        this.setRoleDatas(this.RoleList);
                    }
                    // console.log(this.RoleList)
                }else{
                    this.util.error(res.msg)
                }
            })
        },
        checked(node){
            node.active=!node.active
            if(node.active){
                this.selectList.push(node)
            }else{
                this.deleteRepeat(this.selectList,node)
            }
        },
        deleteRepeat(arr,node){
            for (var i = 0; i < arr.length; i++) {
                if(arr[i].id==node.id){
                    arr.splice(i,1)
                }
            }
        },
        cancel(){
            this.$store.state.selectProjectNode={}
            this.selectRoleModels.isShow=false;
            this.search = '';
            this.loadData()
        },
        cancelSelect(data){
            data.active=false;
            this.deleteRepeat(this.selectList,data);
            this.$forceUpdate()
        },
        success(){
            this.selectRoleModels.selectList=this.selectList
            this.selectRoleModels.callBack()
            this.cancel()
        },
    }
}
</script>
<style scoped>
.noResult {
    display: block;
    margin-top: 50%;
    color: #909399;
    text-align: center;
}
.mask-box{
    width: 100%;height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 998;
}
.querter-box{
    transform: translate(-50%,-50%);
    position: fixed;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 5px ;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    height: 600px;
    z-index: 999;
    overflow: hidden;
}
.querter-list-box{
    width: 320px;
    height: 100%;
    box-sizing: border-box;
    padding:68px 20px 70px;
    overflow: hidden;
    float: left;
}
.querter-list-box h4{
    position: absolute;
    left: 20px;
    top:0px;
}
.footer{
    position: absolute;
    bottom: 20px;
    right: 20px;
}
.item-box{
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    overflow: auto;
    border: 1px solid #E7E7E7;
}
.select-list{
    width: 252px;
    height: 100%;
    float: left;
    padding: 68px 20px 70px;
    box-sizing: border-box;
    position: relative;
}
.select-list h4{
    position: absolute;
    left: 20px;
    top: 0;
}
img{
    vertical-align: middle;
}
.item-box li{
    padding:10px 20px;
}
.item-box li .checked-icon{
    width: 16px;
    float: right;
}
</style>
