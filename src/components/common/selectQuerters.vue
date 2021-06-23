<template>
    <div class="box" v-if="selectQuertersModels.isShow" style="color:#333">
        <div class="mask-box" @click.stop.prevent="cancel"></div>
        <div class="querter-box">
            <div class="querter-list-box">
                <h4 style="margin:20px 0;width:270px"><i></i>选择部门
                    <!--<input type="text" style="float:right;height:28px;border:1px solid #e7e7e7;padding-left:10px;font-size:12px" placeholder="搜索">-->
                </h4>
                <div class="item-box ">
                    <selectQuertersItem v-for="(item, index) in models"  :key="index" :models="item" :level="level" :radioSelectFlags="selectQuertersModels.radioSelectFlags"></selectQuertersItem>
                </div>
                
            </div>
            <div class="select-list">
                <h4 style="margin:20px 0;width:100%"><i></i>已选部门</h4>
                <div class="item-box" style="border:0 none;">
                    <el-table ref="multipleTable" :data="selectList" :stripe="true" style="width: 100%"
                  :header-row-style="{background:fontColor,overflow:'hidden',}"  border
                  :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}" height="460"
                  :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center'}"
                  >
                    <el-table-column  fixed label="部门名称" >
                        <template slot-scope="scope">
                            <p>{{scope.row.label}}</p>
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
import selectQuertersItem from './selectQuertersItem.vue'
export default {
    props:['selectQuertersModels'],
    data(){
        return{
            dialogVisible: false,
            level:0,
            selectList:[],
            searchText: '',
            models:[],
        }
    },
    components:{selectQuertersItem},
    created () {
        this.bgColor = this.$store.state.themeColor
      this.fontColor = this.$store.state.themeBG
      this.$bus.on('handelDepartItem', this.addOrEditDepart)
      this.loadAsideData()
    },
    watch:{
        'selectQuertersModels.isShow'(newVal,oldVal){
            if(newVal){
                    this.selectList=this.selectQuertersModels.selectList
                if(!this.selectQuertersModels.radioSelectFlags){
                    this.digui()
                    // this.selectList=[]
                    console.log(this.models)
                }else{
                }
            }
        }
    },
    beforeDestroy () {
      this.$bus.off('handelDepartItem', this.addOrEditDepart)
    },
    methods: {
        digui(){
            var _this=this
            function digui2(arr){
                // debugger
                for (let i = 0; i < arr.length; i++) {
                    arr[i].checked=false
                    for (let j = 0; j < _this.selectList.length; j++) {
                         if(_this.selectList[j].id==arr[i].id){
                             arr[i].checked=true
                         }
                    }
                    if(arr[i].children&&arr[i].children.length>0){
                        digui2(arr[i].children)
                    }
                }
                
            };
            digui2(this.models)
        },
        loadAsideData(){
            var param={
                Authorization:this.sessionUtil.getAccessToken(),
                companyUid:this.$store.state.companyUid,
                type:'depart',
                projType:this.searchText,
            }
            this.util.restGet('/api_v1/org',param,(res)=>{
                if(res.status==200){
                    this.models.push(res.data)
                }else{
                    this.util.error(res.msg)
                }
            })
        },
        addOrEditDepart(data){
            // console.log('addOrEditDepart')
            console.log(1)
            if(this.selectQuertersModels.radioSelectFlags){
                this.selectList=[]
            }
            if(data.active){
                this.selectList.push(data.models)
            }else{
                this.deleteRepeat(this.selectList,data.models)
            }
            if(this.selectQuertersModels.radioSelectFlags){
                this.success()
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
            // console.log('cancel')
            this.$store.state.selectProjectNode={}
            this.selectQuertersModels.isShow=false;
        },
        cancelSelect(data){
            this.deleteRepeat(this.selectList,data);
            this.digui()
            this.$forceUpdate()
        },
        success(){
            this.selectQuertersModels.selectList=this.selectList
            this.selectQuertersModels.callBack()
            this.cancel()
        },
    }
}
</script>
<style scoped>

.box{
    color: #333;
}
.box h4{
    color: #333;
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
</style>
<style>
.box .item-box .el-table,.box .item-box .el-table thead{
    color: #333;
}
.bg .box .item-box .el-table--border, .bg .box .item-box .el-table--group, .bg .box .item-box .el-table td, .bg .box .item-box .el-table th.is-leaf{
        border-color: #e7e7e7;
}
.bg .box .item-box .el-table--border:after, .bg .box .item-box .el-table--group:after, .bg .box .item-box .el-table:before{
    background:#e7e7e7;
}
.bg .box .item-box .el-table__fixed-right:before, .bg .box .item-box .el-table__fixed:before{
    background:transparent;
}
</style>
