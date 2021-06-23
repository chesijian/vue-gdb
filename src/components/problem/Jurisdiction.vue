<template>
    <div class="proj-box" style="padding:46px 0 0 0">
         <div class="tabs-box">
            <!-- <div class="tabs" style="overflow:hidden;border-top:0 none;">
                <span :class="{active:statusVal==''}" @click="changeChild('')">全部</span>
                <span :class="{active:statusVal==3}" @click="changeChild(3)">待销项</span>
                <div class="tabs-button-box" style="float: right;">
                    <div class="select-box">
                        <span>区域</span>
                        <el-select @change="loadData" v-model="areaValue" size="mini" class="select-ele" placeholder="请选择">
                            <el-option  label="全部" value=""></el-option>
                            <el-option v-for="(item, index) in partList " :label="item.partName" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </div>
                    <div style="float:left"  class="search-box">
                        <input type="text" v-model="searchValue" @keyup.enter="loadData">
                        <i></i>
                        <button @click="loadData">搜索</button>
                    </div>
                    <button>导出Excel</button>
                </div>
            </div> -->
        </div>
       
        <div class="table-box">
                <el-table :data="dataList" border :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
            style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);">
                
                <el-table-column prop="groupName" width="387" label="组名"> </el-table-column>
                <el-table-column prop="userNameArr"  label="人员"></el-table-column>
                <el-table-column prop="" label="操作" width="100">
                <template slot-scope="scope">
                    <span>
                    <i style="color: rgba(68,210,255,1);width: 35px;" class="el-icon-edit" v-if="sessionUtil.isAllowBtn('gc4_1:edit')" @click="editMember(scope.row)"></i>
                    </span>
                </template>
                </el-table-column>
            </el-table>
           
        </div>

        <selectMember ref="selectMemberFun" :selectProjMemberModels='selectMemberModels'></selectMember>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import selectMember from '../common/selectProjMember.vue'
export default {
    data(){
        return {
            // indexImg:require('../../assets/indexImg/2.png'),
            mainData:{},
            selectMemberModels:{
                isShow:false,
                selectList:[],
                callBack:this.selectUserCallBack,
                radioSelectFlags:false,
            },
            tempUser:{},
            areaValue:'',
            rectificationValue:'',
            searchValue:'',
            activeStr:'全部',
            statusVal:'',
            buttonActive:true,
            defaultList:[{userType:"measurer",groupName:"整改负责人",userNameArr:""},{userType:"rummager",groupName:"整改参与人",userNameArr:""}],
            dataList:[],
            memberList:[],
            totalCount:0,
            pageSize:10,
            pageIndex:1
        }
    },
    components:{selectMember},
    computed: {
        ...mapState({
            userUid: state => state.userUid,
            selectProjectObj: state => state.selectProjectObj
        }),
      },
    mounted(){
        var projObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.$store.state.selectProjectObj =projObj;
        this.pageIndex=1;
        this.getMemberData();
    },
    methods:{
        editMember(item){
            this.tempUser=item;
            this.selectMemberModels.isShow=true;
        },
        selectUserCallBack(data) {
            // console.log(this.selectMemberModels.selectList);
            var userNameArr = this.selectMemberModels.selectList.map(item=> item.userName);
            var userUidArr = this.selectMemberModels.selectList.map(item=> item.id);
            // this.dataList.forEach(item=>{
            //     if(item.userType==this.tempUser.userType){
            //         item.userNameArr=userNameArr.join(",");
            //     }
            // });
            this.mainData={
                USER_UID_ARR_:userUidArr.join(","),
                USER_NAME_ARR_:userNameArr.join(","),
                PROJ_UID_:this.selectProjectObj.id,
                USER_TYPE_:this.tempUser.userType,
                GROUP_NAME_:this.tempUser.groupName,
            }
            this.saveData();

        },
        getMemberData(){
            var params={
                projUid:this.selectProjectObj.id,
                   type:"procedure"
            }
            this.util.mask();
            this.util.restGet("/api_v1/construction/inspect/measureMember",params,(res)=>{
//          this.util.restGet("/api_v1/construction/inspect/getUserPermission",params,(res)=>{	
                // console.log("measureMember===",res);
                this.util.unmask();
                if(res.status==200&&res.data!=undefined){
                    this.dataList=res.data;
                    if(res.data.length==1){
                        var defaultArr =this.defaultList.filter(item=>{
                            return item.userType!=res.data[0].userType
                        });
                        this.dataList.push(defaultArr[0]);
                    }
                }else{
                this.dataList=this.defaultList;
                }
            });
        },
        saveData(){//保存数据
            var params = {mainFormData:JSON.stringify(this.mainData),sqlTableName:"T_INSPECT_USER",ifSaveWorkflow:false};
            if(this.tempUser.id!=undefined){
                params['id']=this.tempUser.id;
                params['businessKey']=this.tempUser.id;
            }
            this.util.mask("正在保存..");
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                this.util.unmask();
                // console.log(res);
                if(res.status==200){
                    this.getMemberData();
                
                }
                
            });
        },
    }
}
</script>
<style scoped>
.tabs-button-box>button,.tabs-button-box>div{
    float: left;
    margin-left: 10px;
    margin-top: 5px;
}
.tabs-img-button button{
    width: 25px;
    height: 25px;
    float: left;
    border-radius: 0px;
}
.tabs-img-button .buttonActive{
    box-shadow: inset 0 0 15px 0 #44D2FF;
}
.tabs-button{
    background: url('../../assets/indexImg/2.png') no-repeat center;
}
.tabs-img{
    background: url('../../assets/indexImg/home1.png') no-repeat center;
}
.body-box{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}
.body-box>div{
    width: 25%;
    float: left;
    padding-right: 10px;
    box-sizing: border-box;
}
.body-box>div:nth-child(4n){
    padding-right: 0;
}
.problem-tab-item .title,.reading-content{
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 5px;
        text-align: center;
}
.reading-content{
    display: block;
    text-align: left;
    font-size: 12px;
    color: #FFFFFF;
}
.problem-tab-item .belongs{
    font-size: 12px;
    color: #C4C4C4;
    text-align: left;
    margin-bottom: 5px;
}
.problem-tab-item>img{
    width: 100%;
    height: 160px;
}
.reading-num{
    display: block;
    text-align: left;
    font-size: 12px;
    color: #FFFFFF;
    padding-left: 16px;
    position: relative;
}
.reading-num::after{
    width: 16px;
    height: 16px;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    background: url('../../assets/indexImg/yuedu.png') no-repeat center;
}
.select-box{
    margin-right: 20px;
}
.select-box span{
    padding-right: 10px;
    font-size: 12px;
}

</style>
