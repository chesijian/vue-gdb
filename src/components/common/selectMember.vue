<template>
    <div class="box" v-if="selectMemberModels.isShow">
        <div class="mask-box" @click.stop.prevent="cancel"></div>
        <div class="querter-box">
            <h4 class="search" style="margin:20px 0;width:100%;padding:0;position:absolute;z-index:999;"><input @click="activeName='部门'"  type="text" @keydown.enter="loadData" v-model="searchText" style="float:left;height:28px;border:1px solid #e7e7e7;padding-left:10px;font-size:12px;" placeholder="请选择人员">
            </h4>
            <div class="tab">
                <div @click="changetab('部门')"
                    :style="{color:(activeName=='部门'?bgColor:'#999'),borderBottomColor:(activeName=='部门'?bgColor:'transparent')}">
                    <span  :class="{active:activeName=='部门'}">部门</span>
                </div>
                <div @click="changetab('常用联系人')" 
                    :style="{color:(activeName=='常用联系人'?bgColor:'#999'),borderBottomColor:(activeName=='常用联系人'?bgColor:'transparent')}">
                    <span  :class="{active:activeName=='常用联系人'}">常用联系人</span>
                </div>
                <!-- <div @click="changetab('项目')" 
                    :style="{color:(activeName=='项目'?bgColor:'#999'),borderBottomColor:(activeName=='项目'?bgColor:'transparent')}">
                    <span  :class="{active:activeName=='项目'}">项目</span>
                </div> -->
            </div>
            <div v-show="activeName=='部门'" style="height:100%">
                <div class="querter-list-box">
                    <div class="item-box">
                        <selectProjectItem v-for="(item, index) in models"  :key="index" :models="item" :level="level" :radioSelectFlags="selectMemberModels.radioSelectFlags"></selectProjectItem>
                    </div>
                </div>
                <div class="select-list">
                    <div class="item-box" style="border:0 none;">
                        <el-table ref="multipleTables" :data="QuertPeopleList" :stripe="true" style="width: 100%"
                    :header-row-style="{background:fontColor,overflow:'hidden',}"  border @row-click="radioSelect"
                    :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}" height="460"
                    :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center',color:'#333',fontWeight:'400'}"
                    @select="handleSelectionChange" @select-all="handleSelectionAll">
                        <el-table-column type="selection" v-if="!selectMemberModels.radioSelectFlags"  fixed width="40"></el-table-column>
                        <el-table-column  fixed label="姓名" >
                            <template slot-scope="scope">
                                <div>
                                    <img :src="scope.row.url" alt="">
                                    <span style="white-space: nowrap;text-align:left;color:#333">{{ scope.row.userName }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column  fixed label="添加常用联系人" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#fff" @click="addSelect(scope.row)"><img src="../../assets/indexImg/Add-l.png" alt=""></button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                </div>
            </div>
            <div v-show="activeName=='常用联系人'" style="height:100%">
                <div class="select-list select-list2">
                    <div class="item-box" style="border:0 none;">
                        <el-table ref="multipleCommTables" :data="linkPeopleList" :stripe="true" style="width: 100%"
                    :header-row-style="{background:fontColor,overflow:'hidden',}"  border @row-click="radioSelect"
                    :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}" height="460"
                    :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center',color:'#333',fontWeight:'400'}"
                    @select="handleSelectionChange" @select-all="handleSelectionAll">
                        <el-table-column type="selection" fixed width="40" v-if="!selectMemberModels.radioSelectFlags"></el-table-column>
                        <el-table-column  fixed label="姓名" >
                            <template slot-scope="scope">
                                <div>
                                    <img :src="scope.row.url" alt="">
                                    <span style="white-space: nowrap;text-align:left;color:#333">{{ scope.row.userName }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column  fixed label="岗位" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#fff">{{ scope.row.departName}}</button>
                            </template>
                        </el-table-column> -->
                        <el-table-column  fixed label="删除常用联系人" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#fff" @click="deleteSelect(scope.row)">一</button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                </div>
            </div>
            <div v-if="activeName=='项目'" style="height:100%">
                <div class="select-list select-list2">
                    <div class="item-box" style="border:0 none;">
                        <el-table ref="multipleTables" :data="projPeopleList" :stripe="true" style="width: 100%"
                    :header-row-style="{background:fontColor,overflow:'hidden',}"  border
                    :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}" height="460"
                    :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center',color:'#333',fontWeight:'400'}"
                    @selection-change="handleSelectionChange">
                        <el-table-column type="selection" fixed width="40"></el-table-column>
                        <el-table-column  fixed label="姓名" >
                            <template slot-scope="scope">
                                <div>
                                    <img :src="scope.row.url" alt="">
                                    <span style="white-space: nowrap;text-align:left;color:#333">{{ scope.row.label }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column  fixed label="岗位" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#333" >{{ scope.row.departName}}</button>
                            </template>
                        </el-table-column>
                        <el-table-column  fixed label="项目负责人" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#333" >{{ scope.row.departName}}</button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                </div>
            </div>
             <div class="select-list select-list1">
                    <h4 style="margin:20px 0;width:100%;color:#333"><i></i>已选人员</h4>
                    <div class="item-box" style="border:0 none;">
                        <el-table ref="multipleTable" :data="selectList" :stripe="true" style="width: 100%"
                    :header-row-style="{background:fontColor,overflow:'hidden',}"  border 
                    :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}" height="460"
                    :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center',color:'#333',fontWeight:'400'}"
                    >
                        <el-table-column  fixed label="人员"  width="160">
                            <template slot-scope="scope">
                                <div>
                                    <img :src="scope.row.url" alt="">
                                    <span style="white-space: nowrap;text-align:left;color:#333">{{ scope.row.userName}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column  fixed label="部门" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#fff">{{scope.row.departName}}</button>
                            </template>
                        </el-table-column> -->
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
                <el-button type="warning" size="small" @click="success">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import selectProjectItem from './selectProjectItem.vue'
export default {
    props:['selectMemberModels', 'memberList'],
    data(){
        return{
            checked:require('@/assets/administrationIcon/active1.png'),
            unChecked:require('@/assets/administrationIcon/defult.png'),
            dialogVisible: false,
            searchText: '',
            activeName: '部门',
            level:0,
            selectNode:{},
            QuertPeopleList:[],
            linkPeopleList:[],
            projPeopleList:[],
            selectList:[],
            models:[],
            user:{},
            changeData:false,
        }
    },

    components:{selectProjectItem},
    created () {
        this.bgColor = this.$store.state.themeColor
      this.fontColor = this.$store.state.themeBG
      this.$bus.on('handelDepart', this.addOrEditDepart);
        this.user=this.sessionUtil.getUser();
      this.loadAsideData()
      this.selectNode.id='';
     
      this.loadData()
    },
   
    beforeDestroy () {
      this.$bus.off('handelDepart', this.addOrEditDepart)
    },
    methods: {
        reset(userList){
            this.selectList= userList? userList:[];
            // if (userList) {
            //     userList.forEach(row => {
            //         this.$refs.multipleTables1.toggleRowSelection(row);
            //     });
            // } else {
            //     this.$refs.multipleTables1.clearSelection();
            // }
        },
        radioSelect(node){
            if(!this.selectMemberModels.radioSelectFlags){
                return
            };
           
            this.selectList.push(node);
            this.success()
        },
        addSelect(data){
            var o={
                linkUid :data.id,
                userUid :this.user.id,
            }
            var arr=[o]
            var param={
                Authorization:this.sessionUtil.getAccessToken(),
                id:this.user.id,
                _list:arr
            }
            this.util.restPost('/api_v1/org/users/{id}/links',param,(res)=>{
                if(res.status==200){
                    this.util.success('添加成功')
                    // this.linkPeopleList=res.data;
                    // this.$forceUpdate()
                }else{
                    this.util.error(res.errorMsg)
                }
            })
            
        },
        deleteSelect(data){
           var param={
                Authorization:this.sessionUtil.getAccessToken(),
                id:this.user.id,
                linkUid:data.id
        }
        this.util.restDelete('/api_v1/org/users/{id}/links/{linkUid}',param,(res)=>{
            if(res.status==200){
                this.util.success('删除成功')
                this.loadOftendata()
            }else{
                this.util.error(res.errorMsg)
            }
        })
        },
        changetab (str) {
            this.activeName = str
            if(str=='常用联系人'){
                this.loadOftendata()
                
            }else if(str=='项目'){
                
            }else{
                this.loadAsideData()
            }
        },
        initSelect(userList){
            // console.log(this.$refs);
            var selectArr = this.linkPeopleList.filter(item=>{
                return this.selectList.findIndex(obj=>obj.id===item.id)>=0;
            });
            this.$nextTick(()=> {
                // DOM 现在更新了
                // this.$refs.multipleCommTables.toggleRowSelection(this.linkPeopleList[1]);
                selectArr.forEach(row => {
                    this.$refs.multipleCommTables.toggleRowSelection(row);
                });
            })
           
        },
        loadAsideData(){
            var param={
                Authorization:this.sessionUtil.getAccessToken(),
                companyUid:this.$store.state.companyUid,
                type:'depart',
                projType:this.searchText,
            }
            this.util.restGet('/api_v1/org',param,(res)=>{
                // console.log(res)
                if(res.status==200){
                    if(res.data){
                        this.models[0]=res.data;
                        this.$forceUpdate()
                    }else{
                        this.models[0]=[];
                        this.$forceUpdate()
                    }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        loadOftendata(){
            var param={
                Authorization:this.sessionUtil.getAccessToken(),
                id:this.user.id,
            }
            this.util.restGet('/api_v1/org/users/{id}/links',param,(res)=>{
                if(res.status==200){
                    if(res.data){
                        this.linkPeopleList=res.data;
                        this.initSelect();
                        this.$forceUpdate()
                    }else{
                        this.linkPeopleList=[];
                        this.$forceUpdate()
                    }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        addOrEditDepart(data){
            // console.log("data====",data);
            this.selectNode=data;
            this.changeData=true;
            this.loadData()
        },
        loadData(){
            var param={
                Authorization:this.sessionUtil.getAccessToken(),
                companyUid:this.$store.state.companyUid,
                departUid:this.selectNode.id,
                ifContainChild:true,//默认递归查找下级用户
                // positionUid:'',
                // roleUid:false,
                // ifContainChild:false,
                // ifQueryPosition:true,
                start:0,
                pageSize:1000,
                search:this.searchText,
            }
             this.util.restGet('/api_v1/org/users',param,(res)=>{
                if(res.status==200){
                    if(res.data){
                        this.QuertPeopleList=res.data
                        this.toggleSelection(this.selectList)
                    }else{
                        this.QuertPeopleList=[]
                        this.toggleSelection(this.selectList)
                    }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        delete(arr,node){
            for (var i = 0; i < arr.length; i++) {
                if(arr[i].id==node.id){
                    arr.splice(i,1)
                }                    
            }
        },
        cancel(){
            this.$store.state.selectProjectNode={}
            this.selectMemberModels.isShow=false;
        },
        cancelSelect(data){
         
            this.delete(this.selectList,data);
            this.$refs.multipleTables.setCurrentRow(data)
            this.$forceUpdate()
        },
       toggleSelection(rows){
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTables.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTables.clearSelection();
            }
        },
        success(){
            if(this.selectMemberModels.type == 0) {
                if(this.selectList.length > 1) {
                    this.util.warn('只能选择一个人员')
                    return false;
                }
            }
            this.selectMemberModels.selectList=this.concatArr(this.selectList,this.selectMemberModels.selectList);
            
            this.selectMemberModels.callBack(this.selectList)
            this.cancel()
        },
        handleSelectionChange(val,row) {
            console.log("row=====",row);
            if(!row){
                return
            }
            var index = this.selectList.findIndex(item=>item.id===row.id);
            if(index>=0){
                this.selectList.splice(index,1);
            }else{
                this.selectList.push(row);
            }
            
        },
        handleSelectionAll(val){//全选
            this.selectList=[...val];
        },
        concatArr(arr1,arr2){  
            //不要直接使用var arr = arr1，这样arr只是arr1的一个引用，两者的修改会互相影响  
            var arr = arr1.concat();  
            //或者使用slice()复制，var arr = arr1.slice(0)  
            for(var i=0;i<arr2.length;i++){  
                arr.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0;  
            }  
            return arr;  
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
    width: 370px;
    height: 100%;
    float: left;
    padding: 68px 20px 70px;
    box-sizing: border-box;
    position: relative;
}
.select-list1{
    position: absolute;
    right: 0;
    top: 0;
}
.select-list2{
    width: 680px;
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

