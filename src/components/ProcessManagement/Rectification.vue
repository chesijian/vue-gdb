<template>
  <div class="proj-box" style="padding:46px 0 30px 0;box-sizing: border-box;">
    <div class="tabs-box">
      <div class="tabs" style="border-top:0 none;">
        <span :class="{active:processStatus==''&&dataType!='record'}" @click="changeChild('')">全部</span>
        <span :class="{active:processStatus=='3'}" @click="changeChild('3')">待销项</span>
        <span :class="{active:processStatus=='1'}" @click="changeChild('1')">待指派</span>
        <span :class="{active:processStatus=='2'}" @click="changeChild('2')">待修复</span>
        <span :class="{active:processStatus=='finish'}" @click="changeChild('finish')">已销项</span>
        <span :class="{active:dataType=='record'}" @click="dataType='record';processStatus='';loadData()">记录</span>
        <div class="tabs-button-box" style="float: right;position: relative;">
          
          <div class="select-boxs" >
            <span>区域</span>
            <span @click="selectShow" style="text-align: left;line-height: 26px;display: inline-block;width:120px;height:26px;background-color: rgba(255,255,255,.1);color:#ccc;box-sizing: border-box">
            {{searchName}}  <i style="position: relative;left:60px;" v-if="createIsShow" class="el-icon-arrow-up"></i>
            <i style="position: relative;left:60px;" v-if="!createIsShow" class="el-icon-arrow-down"></i>
          </span>
            <div :class="{selcetData:createIsShow==false}" style="color:#000;z-index: 9999;overflow: auto;position: absolute;text-align: left;top:26px;left:27px;width:250px;height:250px;background-color: #fff;">
              <div @click="handelDeparts({label:'全部'})" style="color: #44d2ff;padding-top: 10px;padding-left: 21px;">全部</div>
              <asideItems v-for="(item, index) in models"  :key="index" :models="item" :level="0" ></asideItems>
            </div>
          </div>
          
          
          <div class="select-boxs">
            <span>整改人</span>
            <el-select @change="loadData" v-model="rectificationValue" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
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
          <button @click="excels()"  v-if="sessionUtil.isAllowExport('t_InspectProcedure_Record')">导出Excel</button>
        </div>
      </div>
    </div>
    <div v-if="!buttonActive" class="body-box">
      <div style="height:285px;float:left" class="box-style" v-for="(item, index) in dataList" :key="index">
        <div class="problem-tab-item" >
          <p class="title">{{item.inspectPart}}</p>
          <p class="belongs"><span>{{item.inspectItem}} </span><span>{{item.createTime}}</span></p>
          <img @click="showPicture(item.imgs)" :src="item.imgs==undefined? '':util.getBaseUrl() + '/api_v1/files/'+item.imgs[0].id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" alt="">
          <span class="reading-content">{{item.desc_}}</span>
          <span class="reading-num">{{item.lookCount}}人已读</span>
        </div>
      </div>

    </div>
    <div v-if="buttonActive" class="table-box" style="height:100%;" ref="tablebox">
      <el-table :data="dataList" border :height="tableHeightNum"
                style="width: 100%;color:rgba(255,255,255,1);">
        <el-table-column type="selection" label="选择" width="55"></el-table-column>
        <el-table-column prop="" label="操作" width="60" v-if="sessionUtil.isAllowEdit('t_InspectProcedure_Record')||sessionUtil.isAllowDelete('t_InspectProcedure_Record')">
          <template slot-scope="scope">
                <span>
                <i style="color: rgba(68,210,255,1);width: 15px;" class="el-icon-edit" v-if="sessionUtil.isAllowEdit('t_InspectProcedure_Record')"
                    @click="editMember(scope.row)"></i>
                <i style="color: rgba(68,210,255,1);" class="el-icon-delete" v-if="sessionUtil.isAllowDelete('t_InspectProcedure_Record')" @click="deleteData(scope.row)"></i>
                </span>
          </template>
        </el-table-column>
        <el-table-column prop="sn" label="编号"></el-table-column>
        <el-table-column prop="inspectPart" width="357" label="区域"> </el-table-column>
        <el-table-column prop="inspectItem" width="387" label="检查项"> </el-table-column>
        <el-table-column prop="desc_" width="150" label="描述"></el-table-column>
        <el-table-column prop="createDate"  width="110" label="检查日期"> </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <div class="table-column-viewer-cell" v-viewer="viewerOption">
                <img v-for="(img,x) in scope.row.imgs" :fileId="img.id" :key="x" style="width:30px;height:30px;padding-right: 6px;" :src="util.getBaseUrl() + '/api_v1/files/'+img.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt="">
            </div>
            <!-- <div>
              <img v-for="(img,x) in scope.row.imgs" :key="x" style="width:30px;height:30px;padding-right: 6px;" :src="util.getBaseUrl() + '/api_v1/files/'+img.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt="">
            </div> -->
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;">
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
			  <div style="overflow: auto;">
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
                            <!-- <span>{{editMembershow.formType == 'inspect' ? '问题 ': '记录'}}</span> -->
                            <span>{{editMembershow.DATA_TYPE_=='record'? '记录':'检查'}}</span>
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
                        <el-input :disabled="true" v-model="editMembershow.INSPECT_ITEM_NAME_"></el-input>
                    </div>
                 </el-row>
                 <el-row style="display: flex; padding-bottom: 15px;" >
                    <div style="width:80px">规范要求：</div>
                    <div class="bz_le" style="width: 84%;">
                        <el-input :disabled="true" v-model="editMembershow.CHECK_REQUIRE_"></el-input>
                    </div>
                 </el-row>
                 <el-row style="padding-bottom: 15px;">
                    <el-col :span="16" style="display: flex;">
                        <div style="width:80px">检查部位：</div>
                        <div class="bz_le" style="width: 83%;">
                            <el-input :disabled="true" v-model="editMembershow.INSPECT_PART_NAME_"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">图纸位置：</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.lb"></el-input>
                        </div>
                    </el-col>
                 </el-row>
                 <el-row style="padding-bottom: 15px;">
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">整改负责人：</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.rectifyPrincipal"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">整改参与人：</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.takePartUsers"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
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
                        <el-input type="textarea" :disabled="true" v-model="editMembershow.DESC_"></el-input>
                    </div>
                </div>
			  	
                <el-popover placement="right-start" width="500" trigger="click">
                <div style="height: 500px;overflow: auto">
                    <el-timeline >
                        <el-timeline-item :timestamp="editMembershow.createTime"  placement="top">
                            <el-card>
                                <div>
                                    <span>{{editMembershow.createUserName+':'+editMembershow.DESC_}}</span>
                                    <span style="float: right;">{{editMembershow.DATA_TYPE_=='record'? '记录':'整改前'}}</span>
                                </div>
                                <p style="text-align: left; width: 100px;">附件:</p>
                                <ul @click="showPicture(editMembershow.imgs)" style="display: flex;flex-wrap：wrap;width: 870;">
                                    <el-image style="width: 100px; height: 100px" v-for="(item, index) in editMembershow.imgs" :key="index"
                                        :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" 
                                    fit="cover"></el-image>
                                </ul>
                            </el-card>
                        </el-timeline-item>
                        <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.createTime" placement="top">
                            <el-card>
                                <div>
                                    <span>{{activity.createUserName+':'+activity.DESC_}}</span>
                                    <span style="float: right;">{{initDescStatus(activity.status)}}</span>
                                </div>
                                <p style="text-align: left; width: 100px;">附件:</p>
                                <ul @click="showPicture(activity.imgs)" style="display: flex;flex-wrap：wrap;width: 870;">
                                    <el-image style="width: 100px; height: 100px" v-for="(item, index) in activity.imgs" :key="index"
                                        :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" 
                                    fit="cover"></el-image>
                                </ul>
                            </el-card>
                         
                        </el-timeline-item>
                    </el-timeline>
            	</div>
                <el-button slot="reference">查看整改记录</el-button>
                </el-popover>
			  </div>
			</el-dialog>
      
    </div>
    <div v-show="imgshows" @click.stop="imgshows = false" style="position: fixed;top:6px;left: 160px;right: 160px;bottom: 0px;z-index: 9999; background: rgba(0,0,0,.6);">
        <el-carousel :interval="5000" arrow="always" height="600px" style="padding-top:30px" >
            <el-carousel-item v-for="(item,index) in imgList" :key="index" style="display:flex;align-items:center;justify-content:center;">
                <img style="height:100%;width:auto;" :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=false&access_token='+sessionUtil.getAccessToken()" alt="">
            </el-carousel-item>
        </el-carousel>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import asideItems from '@/components/common/asideItem.vue'
  export default {
    data(){
      const $vm = this;
      return {
        viewerOption: {
            shown(...args) {
                $vm.currentViewer = this.viewer;
            },
            url(image) {
                return $vm.util.getBaseUrl() + '/api_v1/files/'+image.getAttribute('fileid')+'/look?ifThumb=false&access_token='+$vm.sessionUtil.getAccessToken();
                // return getFileLookUrl(image.getAttribute('fileid'));
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
                    console.log('123: ', $vm.currentViewer)
                    const viewer = $vm.currentViewer;
                    const img = viewer.images[viewer.index]
                    if (img && img.getAttribute('fileid')) {
                        $vm.openDownload({id: img.getAttribute('fileid')});
                    }
                },
            }
        },
        currentViewer: null,
        imgshows:false,
        indexImg:require('../../assets/indexImg/2.png'),
        editMembershow:{},
        partList:[],
        models:[],
        dataType:'',
        areaValue:'',
        rectificationValue:'',
        searchValue:'',
        activeStr:'全部',
        checkType:'',
        buttonActive:true,
        dataList:[],
        memberList:[],
        totalCount:0,
        pageSize:10,
        pageIndex:1,
        tableHeightNum:0,
        processStatus:'',
        searchName:'请选择',
        createIsShow:false,
        regionId:'',
        dialogVisible:false,
        imgitem:"",
        imgList:[],
        activities:[]
      }
    },
    computed: {
      ...mapState({
        userUid: state => state.userUid,
        selectProjectObj: state => state.selectProjectObj
      }),
    },
    components:{
      asideItems
    },
    created(){
      this.$bus.on('handelDeparts', this.handelDeparts);
      // this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
    },
    mounted(){
      var projObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
      })
      this.$store.state.selectProjectObj =projObj;
      this.pageIndex=1;
      this.loadData();
      this.getMemberData();
      this.getParData();
    },
    beforeDestroy(){
      this.$bus.off('handelDeparts', this.handelDeparts);
    },
    watch:{
       '$store.state.selectProjectObj.id':function(val,oldVal){
            this.pageIndex=1;
            this.loadData();
            this.getMemberData();
            this.getParData();
        }
    },
    methods:{
    	excels(){
        var paramsStr = "fileName="+this.selectProjectObj.proName+"工序检查记录&search="+this.searchValue+"&projUid="+this.selectProjectObj.id+"&formType=process&partUid="+this.areaValue+"&principal="+this.rectificationValue;
        window.open(this.util.getBaseUrl()+"/api_v1/construction/inspect/exportCheckRecord?"+paramsStr+"&access_token="+this.sessionUtil.getAccessToken());
                 
  		  // var  paramsStr = "projUid="+this.$store.state.selectProjectObj.id+"&projName="+this.$store.state.selectProjectObj.proName +"&status="+ '' +"&areaUid="+this.regionId+"&abarbeitungUid="+this.rectificationValue+"&search="+this.searchValue
        // window.open(this.util.getBaseUrl() + "/api_v1/business/process/export?" + paramsStr+ "&access_token=" + this.sessionUtil.getAccessToken()) 
      },
      showPicture(dataList){
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
        this.dataType ='';
        this.processStatus=str;
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
      selectShow(){
        this.createIsShow=!this.createIsShow;
      },
      getParData(){
        this.util.restGet('/api_v1/construction/inspect/partTree',{projUid:this.$store.state.selectProjectObj.id},(res)=>{
          if(res.status==200&&res.data!=undefined){
            this.models=res.data;
          }else{
            this.models=[];
          }

        });
      },
      handelDeparts(data){
        this.regionId=data.id;
        this.searchName=data.label;
        this.createIsShow=false;
        this.loadData();
      },
      loadData() {
        var params = {
          dataType:this.dataType,
          search:this.searchValue,
          projUid:this.selectProjectObj.id,
          // projUid:'b67e0c7e84e94ce8b1cccfe93e30f5d2',
          // checkType:this.checkType,
          formType:"process",
          partUid:this.areaValue,
          processPerson:this.rectificationValue,
          pageSize:this.pageSize,
          pageIndex: this.pageIndex,
          status:this.processStatus,
          partUid:this.regionId,
        };
        this.util.mask();
        this.util.restGet('/api_v1/construction/inspect/getCheckRecordDatas', params, (res)=> {
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
    }
  }
</script>
<style scoped>
  .selcetData{
    display: none;
    transition: all 0.5s;
  }
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
