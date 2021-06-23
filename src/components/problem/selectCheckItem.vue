<template>
    <div class="box" v-if="checkItemModels.isShow">
        <div class="mask-box" @click.stop.prevent="cancel"></div>
        <div class="querter-box">
            <div class="tab">
                <div :style="{color:(activeName=='部门'?bgColor:'#999'),borderBottomColor:(activeName=='部门'?bgColor:'transparent')}">
                    <span >选择检查项</span>
                </div>
            </div>
            <div style="height:100%">
                <div class="querter-list-box">
                    <div class="item-box">
                        <selectProjectItem v-for="(item, index) in models"  :key="index" :models="item" :level="level"></selectProjectItem>
                    </div>
                </div>
                <div class="select-list">
                    <div class="item-box" style="border:0 none;">
                        <el-table ref="multipleTables" :data="QuertPeopleList" :stripe="true" style="width: 100%"
                    :header-row-style="{background:fontColor,overflow:'hidden',}"  border 
                    :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}" height="460"
                    :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center',color:'#333',fontWeight:'400'}"
                    @selection-change="handleSelectionChange">
                        <el-table-column type="selection"  fixed width="40"></el-table-column>
                        <el-table-column  fixed label="实测项" >
                            <template slot-scope="scope">
                                <div>
                                    <span style="white-space: nowrap;text-align:left;color:#333">{{ scope.row.itemName }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column  fixed label="规范要求" >
                            <template slot-scope="scope">
                                <span style="white-space: nowrap;text-align:left;color:#333">{{ scope.row.checkRequire }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <el-button @click="cancel" size="small">关闭</el-button>
                <el-button type="warning" size="small" @click="success">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import selectProjectItem from '../common/selectProjectItem.vue'
export default {
    props:['checkItemModels'],
    data(){
        return{
            dialogVisible: false,
            searchText: '',
            activeName: '部门',
            level:0,
            currentRow:0,
            selectNode:{},
            QuertPeopleList:[],
            catalogList:[],
            projPeopleList:[],
            selectList:[],
            models:[],
            user:{},
        }
    },
    components:{selectProjectItem},
    created () {
        this.bgColor = this.$store.state.themeColor
      this.fontColor = this.$store.state.themeBG
      this.$bus.on('handelDepart', this.addOrEditDepart);
        this.user=this.sessionUtil.getUser();
        var projObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.$store.state.selectProjectObj =projObj;
      this.loadAsideData()
      this.selectNode.id='';
     
    //   this.loadData()
    },
   
    beforeDestroy () {
      this.$bus.off('handelDepart', this.addOrEditDepart)
    },
    methods: {
        loadAsideData(){
            this.util.restGet('/api_v1/construction/inspect/checkItemCatalog', {projUid:this.$store.state.selectProjectObj.id}, (res)=> {
                console.log(res);
                if(res.status==200){
                    this.models=res.data;
                }else{
                    this.models=[];
                }
                this.$forceUpdate();
            });
            
        },
        addOrEditDepart(data){
          this.selectNode =data;
          var params = {
              projUid:this.$store.state.selectProjectObj.id,
              parentUid:data.id,
              itemLb:"实测项",
              pageSize:100,
              pageIndex: 1
          };
          this.util.mask();
          this.util.restGet('/api_v1/construction/inspect/getCheckItemData', params, (res)=> {
              this.util.unmask();
              if(res.status==200){
                this.QuertPeopleList=res.data;
                this.totalCount=res.totalCount;
              }else{
                this.QuertPeopleList=[];
              }
          });
        },
        cancel(){
            this.$store.state.selectProjectNode={}
            this.checkItemModels.isShow=false;
        },
        success(){
            // console.log(this.selectNode);
            this.catalogList=[];
            this.concatArr(this.selectNode);
            // console.log(this.checkItemModels);
            var catalogArr=this.catalogList.reverse();
            this.selectList.forEach(item=>{
                item.measureMarker=JSON.stringify([this.checkItemModels.measureMarker]);
                item.measureUid=this.checkItemModels.measureMarker.uuid;
                item.inspectItemName = catalogArr.join("-")+"-"+item.itemName;
                item.isNewFlag =true;
            });
            this.checkItemModels.callBack(this.selectList)
            this.cancel()
        },
        handleSelectionChange(val) {
            this.selectList=val
        },
        concatArr(itemObj){  //获取选中目录
            this.catalogList.push(itemObj.label);
            if(itemObj.parents!=undefined){
                this.concatArr(itemObj.parents);
            }
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
    color: #333;
    text-align: left
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
    border: 1px solid #44d2ff;
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
.tab{
    position: absolute;top: 0;
    left: 10px;
    z-index: 99;
}
.tab>div{
    float: left;
    padding: 20px 10px;
}
.active{
    position: relative;
}
.active::after{
    content: '';
    position: absolute;
    width: 100%;
    bottom: -6px;
    left: 0;
    height: 2px;
    background: #F08B00;
}
.search{
    position: absolute;
    left: 340px;
}
.search::before{
    background: transparent;
}
</style>
<style>
.querter-box .el-table__fixed-right:before,.querter-box .el-table__fixed:before{
    background:#44d2ff;
}
</style>

