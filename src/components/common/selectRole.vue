<template>
    <div class="box" v-if="selectRoleModels.isShow">
        <div class="mask-box" @click.stop.prevent="cancel"></div>
        <div class="querter-box">
            <div class="querter-list-box">
                <h4 style="margin:20px 0;width:270px;color: #333;"><i></i>选择角色
                    <!--<input type="text" style="float:right;height:28px;border:1px solid #e7e7e7;padding-left:10px;font-size:12px" placeholder="搜索">-->
                </h4>
                <div class="item-box">
                    <ul>
                        <li v-for="(item, index) in RoleList" :key="index" @click.stop.prevent="radioSelect(item)">
                            <img src="../../assets/common/last.png" alt="">
                            <span>{{item.roleName}}</span>
                            <span style="margin-left:20px;" v-if="item.isSys">内置角色</span>
                            <div style="float:right;margin-top:3px;" v-if="!selectRoleModels.radioSelectFlags">
                                <img src="../../assets/administrationIcon/active.png" class="checked-icon" v-if="item.active" @click.stop.prevent="checked(item)" alt="">
                                <img src="../../assets/administrationIcon/defult.png" class="checked-icon" v-if="!item.active" @click.stop.prevent="checked(item)" alt="">
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="select-list">
                <h4 style="margin:20px 0;width:100%;color: #333;"><i></i>已选角色</h4>
                <div class="item-box" style="border:0 none;">
                    <el-table ref="multipleTable" :data="selectList" :stripe="true" style="width: 100%;color:#000"
                  :header-row-style="{background:fontColor,overflow:'hidden',}"  border
                  :row-style="{overflow:'hidden',color:'#000'}" :cell-style="{textAlign:'center',}" height="460"
                  :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center'}"
                  >
                    <el-table-column  fixed label="角色名称" >
                        <template slot-scope="scope">
                            <p>{{scope.row.roleName}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column  fixed label="操作" >
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
export default {
    props:['selectRoleModels'],
    data(){
        return{
            active:false,
            dialogVisible: false,
            level:0,
            selectList:[],
            RoleList:[],
        }
    },
    created () {
        this.bgColor = this.$store.state.themeColor
      this.fontColor = this.$store.state.themeBG
    //   this.loadData()
    },
    watch:{
        'selectRoleModels.isShow'(newVal,oldVal){
            
            if(newVal){
                this.loadData()
                // for (let i = 0; i < this.RoleList.length; i++) {
                //        this.RoleList[i].active=false;
                //        for (let j = 0; j < this.selectRoleModels.selectList.length; j++) {
                //            if(this.selectRoleModels.selectList[j].id==this.RoleList[i].id){
                //                this.RoleList[i].active=true;
                //            }
                //        }
                //     }
                this.selectList=this.selectRoleModels.selectList
            }
        }
    },

    methods: {
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
                companyUid:this.$store.state.companyUid,
                type:'depart',
                ifContainCommon:true,
                projType:this.searchText,
                start:0,
                pageSize:1000,
            }
            this.util.restGet('/api_v1/org/roles',param,(res)=>{
                if(res.status==200){
                    if(res.data) {
                        for (let i = 0; i < res.data.length; i++) {
                            res.data[i].active=false;
                        }
                        this.RoleList=res.data
                    }
                    
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
