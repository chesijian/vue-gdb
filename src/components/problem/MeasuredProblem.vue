<template>
    <div class="proj-box" style="padding:46px 0 0 0">
         <div class="tabs-box">
             
            <div class="tabs" style="overflow:hidden;border-top:0 none;">
                
                <span :class="{active:statusVal==''}" @click="changeChild('')">全部</span>
                <span :class="{active:statusVal==3}" @click="changeChild(3)">待销项</span>
                <span :class="{active:statusVal==1}" @click="changeChild(1)">待指派</span>
                <span :class="{active:statusVal==2}" @click="changeChild(2)">待修复</span>
                <span :class="{active:statusVal=='finish'}" @click="changeChild('finish')">已销项</span>
                <div class="tabs-button-box" style="float: right;">
                    <div class="select-boxs">
                        <span>区域</span>
                        <el-select @change="loadData" v-model="areaValue" size="mini" class="select-ele" placeholder="请选择">
                            <el-option  label="全部" value=""></el-option>
                            <el-option v-for="(item, index) in partList " :label="item.partName" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </div>
                    <div class="select-boxs">
                        <span>整改人</span>
                        <el-select @change="loadData" v-model="rectificationValue" size="mini" class="select-ele" placeholder="请选择">
                            <el-option  label="全部" value=""></el-option>
                            <el-option v-for="(item, index) in memberList" :key="index" :label="item.userName" :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <div style="float:left"  class="search-box">
                        <input type="text" v-model="searchValue" @keyup.enter="loadData">
                        <i></i>
                        <button @click="loadData">搜索</button>
                    </div>
                    
                    <button v-if="sessionUtil.isAllowBtn('gc4_3:export')" @click="exportExcel">导出Excel</button>
                </div>
            </div>
        </div>
        <div v-if="!buttonActive" class="body-box">
            <div style="height:285px;float:left" class="box-style" v-for="(item, index) in dataList" :key="index">
                <div class="problem-tab-item" >
                    <p class="title">{{item.inspectPart}}</p>
                    <p class="belongs"><span>{{item.inspectItem}} </span><span>{{item.createTime}}</span></p>
                    <img :src="util.getBaseUrl() + '/api_v1/files/'+item.imgs[0].id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" alt="">
                    <span class="reading-content">{{item.desc_}}</span>
                    <span class="reading-num">{{item.lookCount}}人已读</span>
                </div>
            </div>
            
        </div>
        <div v-if="buttonActive" class="table-box" style="height:100%;width:100%;padding-bottom:32px;position:relative;box-sizing:border-box;">
            <div style="height:100%;width:100%;" ref="tableHeight">
                <el-table :data="dataList" border :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}" :height="tableHeightNum"
                style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);">
                    <el-table-column type="selection" label="选择" width="55"></el-table-column>
                    <el-table-column prop="" label="操作" width="60">
                    <template slot-scope="scope" v-if="sessionUtil.isAllowBtn('gc4_3:btn_edit')||sessionUtil.isAllowBtn('gc4_3:btn_delete')">
                        <span>
                        <i style="color: rgba(68,210,255,1);width: 15px;" class="el-icon-edit"
                        v-if="sessionUtil.isAllowBtn('gc4_3:btn_edit')" @click="editMember(scope.row)"></i>
                        <i style="color: rgba(68,210,255,1);" v-if="sessionUtil.isAllowBtn('gc4_3:btn_delete')" class="el-icon-delete" @click="deleteData(scope.row)"></i>
                        </span>
                    </template>
                    </el-table-column>
                    <el-table-column prop="sn" width="157" label="编号"></el-table-column>
                    <el-table-column prop="statusName" width="87" label="状态"> </el-table-column>
                    <el-table-column prop="inspectPart" width="157" label="区域"> </el-table-column>
                    <el-table-column prop="inspectItem" width="387" label="检查项"> </el-table-column>
                    <el-table-column prop="desc_" width="250" label="描述"></el-table-column>
                    <el-table-column prop="createDate"  width="110" label="检查日期"> </el-table-column>
                    <el-table-column prop="rectifyPrincipal"  width="110" label="整改人"> </el-table-column>
                    <el-table-column prop="rectifyDeadline"  width="110" label="整改期限"> </el-table-column>
                    <el-table-column label="图片">
                        <template slot-scope="scope">
                            <div>
                                <img v-for="(img,x) in scope.row.imgs" :key="x" style="width:30px;height:30px;padding-right: 6px;" :src="util.getBaseUrl() + '/api_v1/files/'+img.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt="">
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%)">
                <el-pagination
                @size-change="changePageSize($event)"
                @current-change="changePageNum($event)"
                :current-page="pageIndex"
                :page-sizes="[10, 25, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
              </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    data(){
        return {
            indexImg:require('../../assets/indexImg/2.png'),
            partList:[],
            areaValue:'',
            rectificationValue:'',
            searchValue:'',
            activeStr:'全部',
            statusVal:'',
            buttonActive:true,
            dataList:[],
            memberList:[],
            tableHeightNum:0,
            totalCount:0,
            pageSize:10,
            pageIndex:1
        }
    },
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
        this.loadData();
        this.getMemberData();
        this.getParData();
        this.$nextTick(()=>{
            this.tableHeightNum=this.$refs.tableHeight.offsetHeight
        })
    },
    methods:{
        changeIndex(str){
            this.activeStr=str
        },
        changeChild(value){
            this.statusVal=value;
            this.loadData();
        },
        changePageSize(value){
            this.pageSize=value;
            this.loadData();
        },
        changePageNum(value){
            this.pageIndex=value;
            this.loadData();
        },
        getParData(){
            this.util.mask();
            this.util.restGet("/api_v1/construction/inspect/checkPartDatas",{projUid:this.selectProjectObj.id,formType:"measured"},(res)=>{
                
                this.util.unmask();
                if(res.status==200){
                    this.partList=res.data;
                    
                }else{
                    this.partList=[];
                }

            });
      },
        loadData() {
            var params = {
                dataType:"inspect",
                search:this.searchValue,
                projUid:this.selectProjectObj.id,
                status:this.statusVal,
                partUid:this.areaValue,
                formType:"measured",
                principal:this.rectificationValue,
                pageSize:this.pageSize,
                pageIndex: this.pageIndex
            };
            
            this.util.mask();
            this.util.restGet('/api_v1/construction/inspect/getCheckRecordDatas', params, (res)=> {
                console.info("getCheckRecordDatas==",res);
                this.util.unmask();
              if(res.status==200){
                this.dataList=res.data;
                this.totalCount=res.totalCount;
              }else{
                this.dataList=[];
              }
            });

        },
        getMemberData(){
            this.util.mask();
            this.util.restGet("/api_v1/business/project/getMemberByProjUid",{projUid:this.selectProjectObj.id},(res)=>{
                // console.debug(res);
                this.util.unmask();
                if(res.status==200){
                    this.memberList=res.data.member;
                    var principalObj={
                    id:res.data.userId,
                    userName:res.data.userName,
                    picture:res.data.picture,
                    position:res.data.position
                    };
                    var principal = this.memberList.find(item=>item.id===res.data.userId);
                    if(principal==undefined){
                        this.memberList.push(principalObj);
                    }
                }else{
                    this.memberList=[];
                }

            });
      },
      deleteData(item){//删除数据
            this.util.confirm("确定要删除该数据吗?","提示",(res)=>{
                this.util.mask("正在删除..");
                this.util.restDelete("/api_v1/construction/inspect/"+item.id,null,(res)=>{
                    this.util.unmask();
                    if(res.status==200){
                        this.util.successToast('删除成功!');
                        this.loadData();
                    }else{
                        this.util.failueToast('删除失败!');
                    }
                
                });
            });
        },
        exportExcel(){
            var paramsStr = "fileName="+this.selectProjectObj.proName+"实测记录&dataType=inspect&search="+this.searchValue+"&projUid="+this.selectProjectObj.id+"&formType=measured&partUid="+this.areaValue+"&principal="+this.rectificationValue;
            window.open(this.util.getBaseUrl()+"/api_v1/construction/inspect/exportCheckRecord?"+paramsStr+"&access_token="+this.sessionUtil.getAccessToken());
                 
        }
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
.select-boxs{
    margin-right: 20px;
}
.select-boxs span{
    padding-right: 10px;
    font-size: 12px;
}

</style>
