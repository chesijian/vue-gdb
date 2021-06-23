<template>
    <div class="box" v-if="selectProjectModels.isShow">
        <div class="mask-box" @click.stop.prevent="cancel"></div>
        <div class="querter-box">
            <div class="querter-list-box">
                <h4 style="margin:20px 0;width:270px"><i></i>项目分类
                    
                </h4>
                <div class="item-box">
                    <selectProjectItem v-for="(item, index) in models"  :key="index" :models="item" :level="level" :radioSelectFlags="selectProjectModels.radioSelectFlags"></selectProjectItem>
                </div>
                
            </div>
            <div class="select-list">
                <h4 style="margin:20px 0;width:100%;padding:0"><input type="text" @keydown.enter="loadAsideData" v-model="searchText" style="float:left;height:28px;border:1px solid #e7e7e7;padding-left:10px;font-size:12px" placeholder="搜索"></h4>
                <div class="item-box" style="border:0 none;">
                    <el-table ref="multipleTable" :data="projectList" :stripe="true" style="width: 100%"
                  :header-row-style="{background:fontColor,overflow:'hidden',}"  border
                  :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}" height="460"
                  :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center',color:'#333',fontWeight:'400'}"
                  @selection-change="handleSelectionChange">
                    <el-table-column type="selection" fixed width="40"></el-table-column>
                    <el-table-column type="index" fixed label="序号" width="50"></el-table-column>
                    <el-table-column  fixed label="项目名称" >
                        <template slot-scope="scope">
                            <span style="white-space: nowrap;text-align:left">{{ scope.row.label }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  fixed label="开工日期" width="100">
                         <template slot-scope="scope">
                            <span style="white-space: nowrap;text-align:left">{{ scope.row.import_time }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  fixed label="完工日期" width="100">
                         <template slot-scope="scope">
                            <span style="white-space: nowrap;text-align:left">{{ scope.row.import_time }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  fixed label="项目负责人"  width="100">
                         <template slot-scope="scope">
                            <span style="white-space: nowrap;text-align:left">{{ scope.row.import_time }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  fixed label="区域"  width="100">
                         <template slot-scope="scope">
                            <span style="white-space: nowrap;text-align:left">{{ scope.row.import_time }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  fixed label="地址"  width="100">
                         <template slot-scope="scope">
                            <span style="white-space: nowrap;text-align:left">{{ scope.row.import_time }}</span>
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
import selectProjectItem from './selectProjectItem.vue'
export default {
    props:['selectProjectModels'],
    data(){
        return{
            dialogVisible: false,
            searchText: '',
            models:[],
            level:0,
            projectList:[],
            selectList:[],
        }
    },
    components:{selectProjectItem},
    created () {
        this.bgColor = this.$store.state.themeColor
      this.fontColor = this.$store.state.themeBG
      this.$bus.on('handelDepart', this.addOrEditDepart);
      this.loadAsideData()
    },
    beforeDestroy () {
      this.$bus.off('handelDepart', this.addOrEditDepart)
    },
    methods: {
        loadAsideData(){
            var param={
                Authorization:this.sessionUtil.getAccessToken(),
                companyUid:this.$store.state.companyUid,
                type:'depart',
                projType:this.searchText,
            }
            this.util.restGet('/api_v1/org',param,(res)=>{
                if(res.status==200){
                    if(res.data){
                        this.models.push(res.data)
                    }else{
                        this.models.push([])
                    }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        addOrEditDepart(data){
            data
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
            this.selectProjectModels.isShow=false;
        },
        cancelSelect(data){
            data.checked=false;
            this.deleteRepeat(this.selectList,data);
            this.$forceUpdate()
        },
        success(){
            this.selectProjectModels.selectList=this.selectList
            this.selectProjectModels.callBack()
            this.cancel()
        },
        handleSelectionChange (val) {
            this.selectList = val
        }
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
    width: 1060px;
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
    width: 740px;
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
