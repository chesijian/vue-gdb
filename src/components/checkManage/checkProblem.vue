<template>
    <div class="proj-box select_box" style="padding:46px 0 0 0">
         <div class="tabs-box">
            <div class="tabs" style="overflow:hidden;border-top:0 none;">
                <span :class="{active:statusValue==null&&dataType!='record'}" @click="changeChild(null)">全部</span>
                <span :class="{active:statusValue=='1'&&dataType!='record'}" @click="changeChild('1')">待指派</span>
                <span :class="{active:statusValue=='2'&&dataType!='record'}" @click="changeChild('2')">待修复</span>
                <span :class="{active:statusValue=='3'&&dataType!='record'}" @click="changeChild('3')">待销项</span>
                <span :class="{active:statusValue=='finish'&&dataType!='record'}" @click="changeChild('finish')">已销项</span>
                <span :class="{active:dataType=='record'}" @click="changeChild('record')">记录</span>

                <div class="tabs-button-box" style="float: right;">

                    <!-- <div class="elect-boxs">
                        <span>检查状态</span>
                        <el-select @change="loadData" v-model="statusValue" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                            <el-option  label="全部" value=""></el-option>
                            <el-option label="未指派" value="1"></el-option>
                            <el-option label="待修复" value="2"></el-option>
                            <el-option label="待销项" value="3"></el-option>
                            <el-option label="已销项" value="finish"></el-option>
                        </el-select>
                    </div> -->
                    <div class="elect-boxs">
                        <span>检查部位</span>
                        <el-select @change="loadData" v-model="areaValue" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                            <el-option  label="全部" value=""></el-option>
                            <el-option v-for="(item, index) in partList " :label="item.partName" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </div>
                    <div class="elect-boxs"  >
                        <span>整改人</span>
                        <el-select @change="loadData" v-model="rectificationValue" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;position: relative;">
                            <el-option  label="全部" value=""></el-option>
                            <el-option v-for="(item, index) in memberList" :key="index" :label="item.userName" :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <div style="float:left"  class="search-box">
                        <input type="text" v-model="searchValue" @keyup.enter="loadData">
                        <i></i>
                        <button @click="loadData">搜索</button>
                    </div>
                    <div class="tabs-img-button">
                        <button :class="{buttonActive:buttonActive}" @click="buttonActive=true" class="tabs-img"></button>
                        <button :class="{buttonActive:!buttonActive}" @click="buttonActive=false" class="tabs-button"></button>
                    </div>
                    <button v-if="sessionUtil.isAllowExport('t_InspectQuality_Record')"  @click="exportExcel">导出Excel</button>
                    <button v-if="sessionUtil.isAllowExport('t_InspectQuality_Record')" @click="exportWord">导出Word</button>
                </div>
            </div>
        </div>
        <div v-if="!buttonActive" class="body-box" style="height:93%;width:100%;padding-bottom:32px;position:relative;box-sizing:border-box;">
            <div style="height:285px;float:left" class="box-style" v-for="(item, index) in dataList" :key="index">
                <div class="problem-tab-item" @click="exportWordObj=item">
                    <p class="title">
                        <img  style="width: 20px;height: 20px;float: left;" :src="exportWordObj.id==item.id? radioedIcon:radioIcon" alt="">
                        <span style="float: left;">【{{item.statusName}}】</span>
                        <span>{{item.inspectPart}}</span>
                    </p>
                    <p class="belongs"><span>{{item.inspectItem}} </span></p>
                    <img @click="showPicture(item.imgs)" :src="util.getBaseUrl() + '/api_v1/files/'+item.imgs[0].id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" alt="">
                    <span class="reading-content">{{item.desc_}}</span>
                    <div style="text-align: right;">
                        <span style="float: left;" class="reading-num">{{item.lookCount}}人已读</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span class="reading-num" v-if="dataType=='inspect'">整改负责人:{{item.rectifyPrincipal}}&nbsp;&nbsp;&nbsp;整改期限:{{item.rectifyDeadline}}</span>
                        <span class="reading-num" v-else>记录人:{{item.checkerName}}&nbsp;&nbsp;&nbsp;记录日期:{{item.createTime}}</span>
                    </div>
                    
                </div>
            </div>

        </div>
        <div v-if="buttonActive" class="table-box" style="height:100%;width:100%;padding-bottom:32px;position:relative;box-sizing:border-box;">
            <div style="height:100%;width:100%;" ref="tableHeight">
                <el-table class="table__wordWraped" :data="dataList" ref="multipleTable" border  @selection-change="handleSelectionChange" :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
                :height="tableHeightNum" style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);"
                          :show-overflow-tooltip="true"
                >
                    <el-table-column type="selection" label="选择" width="55"></el-table-column>
                    <el-table-column prop="" label="操作" width="60">
                        <template slot-scope="scope">
                            <span>
                            <i style="color: rgba(68,210,255,1);width: 15px;" class="el-icon-edit" @click="editMember(scope.row)"></i>
                            <!-- <i style="color: rgba(68,210,255,1);" class="el-icon-delete" @click="deleteData(scope.row)"></i> -->
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sn" width="125" label="编号"></el-table-column>
                    <el-table-column prop="inspectPart" width="357" label="区域" :show-overflow-tooltip="true"> </el-table-column>
                    <el-table-column prop="inspectItem" width="387" label="检查项" :show-overflow-tooltip="true"> </el-table-column>
                    <el-table-column prop="desc_" width="150" label="描述" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="statusName" width="80" label="状态"></el-table-column>
                    <el-table-column prop="createDate"  width="110" label="检查日期"> </el-table-column>
                    <el-table-column label="图片">
                        <template slot-scope="scope">
                            <div class="table-column-viewer-cell" v-viewer="viewerOption">
                                <img v-for="(img,x) in scope.row.imgs" :fileId="img.id" :key="x" style="width:30px;height:30px;padding-right: 6px;" :src="util.getBaseUrl() + '/api_v1/files/'+img.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt="">
                                <!-- <img @click="showPicture(scope.row.imgs)" v-for="(img,x) in scope.row.imgs" :key="x" style="width:30px;height:30px;padding-right: 6px;" :src="util.getBaseUrl() + '/api_v1/files/'+img.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt=""> -->
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
              </div>

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


            <el-dialog :visible.sync="dialogVisible" width="1000px" >
			  <div class="edit-record-dialog-body" style="overflow: auto;">
                  <el-row style="padding-bottom: 15px;">
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">编号：</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.sn"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">类型：</div>
                        <div class="bz_le" style="width: 66%;">
                            <span>{{editMembershow.DATA_TYPE_ == 'inspect' ? '问题 ': '记录'}}</span>
                        </div>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">状态：</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.statusName"></el-input>
                        </div>
                    </el-col>
                 </el-row>
                 <el-row style="display: flex; padding-bottom: 15px;" >
                    <div style="width:80px">检查项：</div>
                    <div class="bz_le" style="width: 84%;">
                        <el-input type="textarea" :rows="2" :disabled="true" v-model="editMembershow.INSPECT_ITEM_NAME_"></el-input>
                    </div>
                 </el-row>
                 <el-row style="display: flex; padding-bottom: 15px;" >
                    <div style="width:80px">规范要求：</div>
                    <div class="bz_le" style="width: 84%;">
                        <el-input type="textarea" :rows="2" :disabled="true" v-model="editMembershow.checkRequire"></el-input>
                    </div>
                 </el-row>
                 <el-row style="padding-bottom: 15px;">
                    <el-col :span="16" style="display: flex;">
                        <div style="width:80px">检查部位：</div>
                        <div class="bz_le" style="width: 83%;">
                            <el-input type="textarea" :rows="2" :disabled="true" v-model="editMembershow.INSPECT_PART_NAME_"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">图纸位置：</div>
                        <div class="bz_le">
                            <el-input type="textarea" :rows="2" :disabled="true" v-model="editMembershow.lb"></el-input>
                        </div>
                    </el-col>
                 </el-row>
                 <el-row style="padding-bottom: 15px;">
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">检查人</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.createUserName"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <div style="width:88px">整改负责人：</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.rectifyPrincipal"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">整改参与人</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.takePartUsers"></el-input>
                        </div>
                    </el-col>
                 </el-row>
                 <el-row style="padding-bottom: 15px;">

                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">复查人</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.createUserName"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="12" style="display: flex;">
                        <div style="width:80px">整改期限</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.RECTIFY_DEADLINE_"></el-input>
                        </div>
                    </el-col>
                 </el-row>
                  <div style="display: flex;align-items: center;padding-bottom: 15px;">
                    <div style="width:80px">
                        描述：
                    </div>
                    <div style="width: 87%;">
                        <el-input type="textarea" :rows="2" :disabled="true" v-model="editMembershow.DESC_"></el-input>
                    </div>
                </div>

                <el-popover placement="right-start" width="500" trigger="click">
                    <div style="height: 500px;overflow: auto">
                        <el-timeline >
                            <el-timeline-item :timestamp="editMembershow.createTime"  placement="top">
                                <el-card>
                                    <div>
                                        <span>{{editMembershow.createUserName+':'+(editMembershow.DESC_? editMembershow.DESC_:"")}}</span>
                                        <span style="float: right;">{{editMembershow.firstStatus}}</span>
                                    </div>
                                    <p style="text-align: left; width: 100px;">附件:</p>
                                    <ul @click="showPicture(editMembershow.imgs)" style="display: flex;flex-wrap：wrap;width: 870;">
                                    <!-- <ul v-viewer="viewerOption" style="display: flex;flex-wrap：wrap;width: 870;"> -->
                                    <div v-for="(item, index) in editMembershow.imgs" :key="index" style="display: flex;flex-flow: column">
                                        <el-image  :fileid="item.id" style="width: 100px; height: 100px"
                                                :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()"
                                                fit="cover"></el-image>
                                        <el-button type="primary" icon="el-icon-download" size="mini" circle  style="position: relative;right: -70px; bottom: 28px;width: 30px;" @click.stop="openDownload(item)"></el-button>
                                        <!--<el-button class="el-icon-download" type="primary" size="mini" style="margin-top: 5px;" @click="openDownload(item)">下载</el-button>-->
                                    </div>


                                    </ul>
                                </el-card>
                            </el-timeline-item>
                            <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.createTime" placement="top">
                                <el-card>
                                    <div>
                                        <span>{{activity.createUserName+':'+(activity.DESC_? activity.DESC_:'')}}</span>
                                        <span style="float: right;">{{initDescStatus(activity.status)}}</span>
                                    </div>
                                    <p style="text-align: left; width: 100px;">附件:</p>
                                    <ul @click="showPicture(activity.imgs)" style="display: flex;flex-wrap：wrap;width: 870;">
                                    <div v-for="(item, index) in activity.imgs" :key="index" style="display: flex;flex-flow: column">
                                        <el-image  style="width: 100px; height: 100px"
                                            :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()"
                                        fit="cover"></el-image>
                                        <el-button type="primary" icon="el-icon-download" size="mini" circle  style="position: relative;right: -70px; bottom: 28px;width: 30px;" @click.stop="openDownload(item)"></el-button>
                                    </div>
                                    </ul>
                                </el-card>

                            </el-timeline-item>
                        </el-timeline>
                    </div>
                    <el-button v-show="editMembershow.DATA_TYPE_ == 'inspect'" slot="reference">查看整改记录</el-button>
                </el-popover>

			  </div>

			</el-dialog>
            <div v-show="imgshows" @click.stop="imgshows = false" style="position: fixed;top:5px;left: 160px;right: 160px;bottom: 0px;z-index: 9999; background: rgba(0,0,0,.6);">
                <!-- <div style="width: 1070px;margin: 50px auto;">
                    <img width="630px" :src="imgitem" alt="" />
                </div> -->
                <el-carousel :interval="5000" arrow="always" height="630px" style="padding-top:30px">
                    <el-carousel-item v-for="(item,index) in imgList" :key="index" style="display:flex;align-items:center;justify-content:center;">
                        <img style="height:100%;width:auto;" :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=false&access_token='+sessionUtil.getAccessToken()" alt="">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <!-- <div v-show="imgshows">
                <el-carousel :interval="5000" arrow="always">
                    <el-carousel-item v-for="item in 4" :key="item">
                    <h3>{{ item }}</h3>
                    </el-carousel-item>
                </el-carousel>
            </div> -->

    </div>
</template>
<script>
import {mapState} from 'vuex'
import {getFileDownloadUrl, getFileLookUrl} from "../../api/attachment";


export default {
    data(){
        const $vm = this;
        return {
            viewerOption: {
                shown(...args) {
                    $vm.currentViewer = this.viewer;
                },
                url(image) {
                    // return $vm.util.getBaseUrl() + '/api_v1/files/'+image.getAttribute('fileid')+'/look?ifThumb=false&access_token='+$vm.sessionUtil.getAccessToken();
                    return getFileLookUrl(image.getAttribute('fileid'));
                },
                toolbar: {
                    zoomIn: 0,
                    zoomOut: 0,
                    oneToOne: 1,
                    reset: 1,
                    prev: 1,
                    play: {
                        show: 0,
                        size: 'large',
                    },
                    next: 1,
                    rotateLeft: 1,
                    rotateRight: 1,
                    flipHorizontal: 0,
                    flipVertical: 0,
                    download: function(e) {
                        const viewer = $vm.currentViewer;
                        const img = viewer.images[viewer.index]
                        if (img && img.getAttribute('fileid')) {
                            $vm.openDownload({id: img.getAttribute('fileid')});
                        }
                    },
                }
            },
            radio:0,
            currentViewer: null,
            imgshows:false,
            reverse: true,
            statusValue:null,
            indexImg:require('../../assets/indexImg/2.png'),
            radioIcon:require('@/assets/common/radio.png'),
            radioedIcon:require('@/assets/common/radioed.png'),
            partList:[],
            dataType:'',
            areaValue:'',
            rectificationValue:'',
            searchValue:'',
            activeStr:'全部',
            checkType:'',//检查类型:quality:质量，safety:安全
            buttonActive:true,
            dataList:[],
            memberList:[],
            selectedList:[],
            exportWordObj:{},//导出word对象
            tableHeightNum:0,
            totalCount:0,
            pageSize:10,
            pageIndex:1,
            editMembershow:{},
            dialogVisible: false,
            imgitem:"",
            imgList:[],
            activities:[],
        }
    },
    computed: {
        ...mapState({
            userUid: state => state.userUid,
            selectProjectObj: state => state.selectProjectObj
        }),
      },
    watch:{
       '$store.state.selectProjectObj.id':function(val,oldVal){
          this.pageIndex=1;
            this.loadData();
            this.getMemberData();
            this.getParData();

        }
    },
    mounted(){
        var projObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.$store.state.selectProjectObj =projObj;
        this.checkType=this.$route.query.checkType;
        this.pageIndex=1;
        this.loadData();
        this.getMemberData();
        this.getParData();
        this.$nextTick(()=>{
            this.tableHeightNum=this.$refs.tableHeight.offsetHeight
        })
    },
    methods:{
        // stopPropagationHandler(e) {
        //     console.log('click', e.target);
        //     if (!e.target.classList.contains('viewer-close')) {
        //         e.stopPropagation();
        //     }
        // },
      openDownload(item){
        window.open(getFileDownloadUrl(item.id))
      },
        showPicture(dataList){
            console.log("查看图片=====");
            this.imgshows=true;
            this.imgList=dataList;
        },
        initDescStatus(status){
            //when '0' then '记录' when '1' then '未指派' when '2' then '整改前' when '3' then '整改后' when '4' then '复查后' when '5' then '复查后' else '' end
            if(status==0){
                return "记录";
            }else if(status==1){
                return "未指派";
            }else if(status==2){
                return "整改前";
            }else if(status==3){
                return "整改后";
            }else if(status==4){
                return "复查后";
            }else if(status==5){
                return "复查后";
            }
        },
        editMember(item) {
            this.dialogVisible = true;
            this.util.mask();
            this.util.restGet('/api_v1/construction/inspect/getCheckRecordById', {id:item.id}, (res)=> {
                this.util.unmask();
                var takePartUsers=res.data.takePartUsers==undefined? []:res.data.takePartUsers;
                res.data.takePartUsers= takePartUsers.map(item=>item.userName).join(",");
                this.editMembershow = res.data;

                this.activities=res.data.descList;

            });

        },
        changeIndex(str){
            this.activeStr=str
        },
        changeChild(str){
            if(str=="record"){
                this.statusValue=null;
                this.dataType="record";
            }else{
                this.dataType ="";
                this.statusValue=str;
            }
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
        handleSelectionChange(value){//选中
            // this.$refs.multipleTable.clearSelection();
            this.selectedList = value;
        },
        getParData(){
            this.util.mask();
            this.util.restGet("/api_v1/construction/inspect/checkPartDatas",{projUid:this.selectProjectObj.id,checkType:this.checkType},(res)=>{
                this.util.unmask();
                console.log("checkPartDatas====",res);
                if(res.status==200){
                    this.partList=res.data;

                }else{
                    this.partList=[];
                }

            });
      },
        loadData() {
            var params = {
                dataType:this.dataType,
                search:this.searchValue,
                projUid:this.selectProjectObj.id,
                checkType:this.checkType,
                formType:"inspect",
                status:this.statusValue,
                partUid:this.areaValue,
                principal:this.rectificationValue,
                pageSize:this.pageSize,
                pageIndex: this.pageIndex
            };
            this.util.mask();
            this.util.restGet('/api_v1/construction/inspect/getCheckRecordDatas', params, (res)=> {
                // console.debug("getCheckRecordDatas=====",res);
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
            var params = {
                projUid :this.selectProjectObj.id,
                type:"inspect",
                userType:"principal"
            }
            this.util.mask();
            this.util.restGet("/api_v1/business/project/getMemberByProjUid",{projUid:this.selectProjectObj.id},(res)=>{
            // this.util.restGet('/api_v1/construction/inspect/permissionUser',params,(res)=>{
                this.util.unmask();
                if(res.status==200&&res.data){
                    // var userList=res.data.data;
                    // var roleUsers=res.data.roleUsers? res.data.roleUsers:[];
                    // this.memberList=userList.concat(roleUsers);
                    this.memberList = res.data.member;
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
            var paramsStr = "fileName="+this.selectProjectObj.proName+"检查记录&dataType="+this.dataType+"&search="+this.searchValue+"&projUid="+this.selectProjectObj.id+"&checkType="+this.checkType+"&formType=inspect&partUid="+this.areaValue+"&principal="+this.rectificationValue;
            window.open(this.util.getBaseUrl()+"/api_v1/construction/inspect/exportCheckRecord?"+paramsStr+"&access_token="+this.sessionUtil.getAccessToken());
        },
        exportWord(){
            if((this.buttonActive&&this.selectedList.length==0)||(!this.buttonActive&&this.exportWordObj.id==undefined)){
                this.util.failueToast('请选择需要导出的数据!');
                return;
            }
            var exportObj = this.buttonActive? this.selectedList[0]:this.exportWordObj;
            var paramsStr = "id="+exportObj.id+"&projName="+this.selectProjectObj.proName+"&projUid="+this.selectProjectObj.id
            window.open(this.util.getBaseUrl()+"/api_v1/construction/inspect/exportInspectReport?"+paramsStr+"&access_token="+this.sessionUtil.getAccessToken());

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
    /*width: 100%;*/
    height: 160px;
}
.reading-num{
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
.elect-boxs{
    margin-right: 20px;
}
.elect-boxs span{
    padding-right: 10px;
    font-size: 12px;
}
.bz_le{
	/* flex: 0 0 350px; */
	 border:1px solid #ddd ;
	 padding: 5px 8px;
	 border-radius:4px;
	 background: #f5f7fa;
	 }

</style>
<style type="text/css">
    .table-column-viewer-cell {
        white-space: normal;
    }
    .edit-record-dialog-body textarea[disabled] {
        border: none!important;
    }
    .viewer-download {
        color: #fff;
        font-family: element-icons!important;
        font-weight: 400;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        font-size:16px;
        text-align:center;
        vertical-align: middle;
        line-height: 24px;
    }

    .viewer-download::before {
        content: "\e77c";
    }
 
	.select_box .el-input--mini .el-input__inner {
		width: 100px;
	}
    .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  .table__wordWraped.el-table .cell.el-tooltip {
      white-space: normal!important;
  }
</style>
