<template>
    <div class="box" v-if="selectProjMemberModels.isShow">
        <div class="mask-box" @click.stop.prevent="cancel"></div>
        <div class="querter-box" style="width: 600px;">
            <div class="querter-list-box">
                <h4 style="margin:20px 0;width:270px;color:#000;"><i></i>选择项目成员
                    <input @keydown.enter="loadAsideData" v-model="searchText" type="text" style="float:right;height:28px;border:1px solid #e7e7e7;padding-left:10px;font-size:12px" placeholder="搜索">
                </h4>
                <div class="item-box" style="color:#000;">
                  <!--<span>{{roleList}}</span>-->
                    <ul>
                        <li v-for="(item, index) in roleList" :key="index" style="text-align: left;">
                            <img src="../../assets/indexImg/last.png" alt="">
                            <span>{{item.userName}}</span>
                            <img src="../../assets/indexImg/unselected.png" class="checked-icon" v-if="!ifSelectd(item)" @click.stop.prevent="checked(item)" alt="">
                            <img src="../../assets/indexImg/selected.png" class="checked-icon" v-if="ifSelectd(item)" @click.stop.prevent="checked(item)" alt="">
                        </li>
                    </ul>
                </div>
            </div>
            <div class="select-list">
                <h4 style="margin:20px 0;width:100%;color:#000;"><i></i>已选项目成员</h4>
                <div class="item-box" style="border:0 none;">
                    <el-table ref="multipleTable" :data="selectList" :stripe="true" style="width: 100%"
                  :header-row-style="{background:fontColor,overflow:'hidden',}"  border
                  :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}" height="460"
                  :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center'}"
                  >
                    <el-table-column  fixed label="项目成员" >
                        <template slot-scope="scope">
                            <p style="color:#000;">{{scope.row.userName}}</p>
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
    props:['selectProjMemberModels'],
    data(){
        return{
            active:false,
            dialogVisible: false,
            level:0,
            selectList:[],
            roleList:[],
            searchText: '',
            activeName: '部门',
        }
    },
    created () {
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.bgColor = this.$store.state.themeColor
      this.fontColor = this.$store.state.themeBG
      this.loadData()
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.loadData()
      }
    },
    beforeDestroy () {
    },
    methods: {
        initData(){
            this.selectList=this.selectProjMemberModels.selectList;
        },
        ifSelectd(obj){
            var index = this.selectList.findIndex(item=>item.id==obj.id);
            if(index>=0){
                return true;
            }else{
                return false;
            }
        },
        loadData(){
               var param={
                projUid:this.$store.state.selectProjectObj.id,
            }
            this.util.restGet('/api_v1/business/project/getMemberByProjUid',param,(res)=>{
                if(res.status==200){
                    if(res.data){
                    	console.log("getMemberByProjUid==",res.data)
                        this.roleList=res.data.member
                    }else{
                        this.roleList=[]
                    }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
            loadAsideData(){
            var param={
				projUid:this.$store.state.selectProjectObj.id,
                search:this.searchText,
            }
            this.util.restGet('/api_v1/business/project/getMemberByProjUid',param,(res)=>{
                   console.log('res',res)
                if(res.status==200){
                    if(res.data){
                        this.roleList=res.data.member;
                        this.$forceUpdate()
                    }else{
                        this.roleList=[];
                        this.$forceUpdate()
                    }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        checked(node){
            node.active=!node.active
            if(!this.ifSelectd(node)){
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
            this.selectProjMemberModels.isShow=false;
        },
        cancelSelect(data){
            data.active=false;
            this.deleteRepeat(this.selectList,data);
            this.$forceUpdate()
        },
        success(){
            this.selectProjMemberModels.selectList=this.selectList
            this.selectProjMemberModels.callBack()
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
  color:#000;
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
<style>
  .box .select-list .el-table th>.cell{
    color:#000;
  }
</style>
