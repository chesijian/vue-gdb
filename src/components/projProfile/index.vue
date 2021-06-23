<template>
    <div class="proj-box lj_box" :style="{paddingTop:activeStr=='工作联系单'? '0px':'36px'}">
        <div class="tabs-box" >
            <div class="tabs" style="overflow:hidden">
                <span :class="{active:activeStr=='首页'&&$route.path=='/page/proj'}" @click="changeIndex()">
                    <router-link active-class="active" to="/page/proj">首页</router-link>
                </span>
                
                <router-link active-class="active" to="/page/proj/news" tag="span" v-if="sessionUtil.isAllowMenu('020201')" >通知公告</router-link>
                <!-- <router-link active-class="active" v-if="sessionUtil.isAllowMenu('020202')" to="/page/proj/projReport" tag="span">项目汇报</router-link> -->
                <!-- <router-link active-class="active" tag="span" to="/page/proj/form/query/t_work_contact" v-if="sessionUtil.isAllowMenu('020204')">工作联系单</router-link> -->
                
            </div>
        </div>

        <div v-if="$route.path!='/page/proj'" class="page-proj-index" style="width:100%;padding-top:0px">
            <router-view :key="$route.path"></router-view>
        </div>

        <div v-show="$route.path=='/page/proj'" class="page-proj-index">
        	
            <div style="width:20%" class="proj-left">
                <div style="min-height:465px;height:100%" class="box-style">
                    <div class="proj-synopsis">
                        <div style="position:absolute;top:10px">
                            <h4 >项目简介</h4>
                            <div class="proj-synopsis-img-box">
                                <div class="proj-synopsis-right-box">
                                    <!-- this.QRcodeObj.url=encodeURIComponent(this.util.getBaseUrl() + '/static/wechat/index.html#/ewm?id='+ this.QRcodeObj.id + '&projUid=' + this.$store.state.selectProjectObj.id); -->
                                    <img :src='this.util.getBaseUrl()+"/api_v1/qr?content="+encodeURIComponent(this.util.getBaseUrl()+"/static/wechat/index.html#/app/projDetails?projUid="+$store.state.selectProjectObj.id)+"&access_token="+this.sessionUtil.getAccessToken()' style="width: 70px;height: 70px;" alt="">
                                    <!-- <img :src='this.util.getBaseUrl()+"/api_v1/qr?content=http%3A%2F%2Fqy.zhuzhu.biz%2Fgdb%2Fstatic%2Fwechat%2Findex.html%23%2Fapp%2FprojDetails%3FprojUid="+$store.state.selectProjectObj.id+"&access_token="+this.sessionUtil.getAccessToken()' style="width: 70px;height: 70px;" alt=""> -->
                                    关注项目
                                </div>
                                <div class="proj-synopsis-left-box">
                                    <img :src="util.getBaseUrl() + '/api_v1/files/'+projObj.projectLogo+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" style="width: 100%;height: 100%;margin-bottom:10px" alt="">
                                </div>
                            </div>
                        </div>
                        <!--  -->
                         <div style="width:100%;height:100%;overflow:auto">
                            <ul>
                                <!--<li>项目类型：{{projObj.classify}}</li>-->
                                <li>项目类型：{{classify}}</li>
                                <li>建设性质：{{projObj.construction}}</li>
                                <li>建筑面积：{{projObj.coveredArea}}</li>
                                <li>工程总投资(万)：{{projObj.investment}}</li>
                                <li>工期要求(天)：{{projObj.sj}}</li>
                                <li>工期：{{projObj.date}}</li>
                                <div v-for="(item,key) in unit" :key="key">
                                <li>{{item.unitType}}: {{item.unitName}}</li>
                                </div>
                            </ul>
                         </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
            
            </div>
            <div style="width:60%" class="proj-middle">
                 <div style="min-height:529px;height:100%" class="box-style ">
                    <div>
                        <div ref="projMiddleTop" style="height:100%">
                            <el-carousel :height="carouselHeight+'px'" trigger="click">
                                <el-carousel-item v-for="(item,key) in carouselList" :key="key">
                                    <img @click="editNews(item,1)" :src="util.getBaseUrl() + '/api_v1/files/'+item.fileId+'/look?ifThumb=false&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt="">
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
            
            </div>
            <div  style="width:20%"  class="proj-right">
                <div style="min-height:155px;height:33%;" class="box-style">
                    <div class="progress">
                        <h4>进度</h4>
                        <div style="padding-top:10px">
                            <p> 
                                <span v-if="infoObj.flag==true" style="float:left;color:#44d2ff">正常</span> 
                                <span v-if="infoObj.flag==false" style="float:left;color:red">超时</span> 
                                <span>{{infoObj.schedule}}%</span>
                            </p>
                            <el-progress :percentage="infoObj.schedule" :stroke-width="31" :text-inside="true" ></el-progress>
                            <p>计划完工倒计时：{{infoObj.sj}}天</p>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
         
                <div style="min-height:155px;height:33%;" class="box-style">
                     <div class="statistics">
                        <h4>质量</h4>
                        <div class="circle-left" style="text-align:right;padding-right:20px">
                            <el-progress type="circle" :width="90" :stroke-width="10" :percentage="qualityObj.percentage"></el-progress>
                        </div>
                        <div class="circle-right">
                            <p>问题数<span>{{qualityObj.totalNum}}</span></p>
                            <p>整改数<span>{{qualityObj.completeNum}}</span></p>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
                <div style="min-height:155px;height:33.5%;" class="box-style">
                    <div class="statistics">
                        <h4>安全</h4>
                        <div class="circle-left" style="text-align:right;padding-right:20px">
                            <el-progress type="circle" :width="90" :stroke-width="10" :percentage="safetyObj.percentage"></el-progress>
                        </div>
                        <div class="circle-right">
                            <p>问题数<span>{{safetyObj.totalNum}}</span></p>
                            <p>整改数<span>{{safetyObj.completeNum}}</span></p>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
            </div>
            
                 <!-- <div style="min-height:155px;height:24%;width: 100%;" class="box-style">
                    <div  class="locale">
                        <h4>现场</h4>
                        <div class="locale-img-box" @mouseover="arrowShow=true" @mouseout="arrowShow=false">
                            <img v-if="localeMsgList.length>0" src="../../assets/indexImg/left_arrow.png" width="20px" style="left:10px" @click="addLeft()"  alt="">
                            <img v-if="localeMsgList.length>0" src="../../assets/indexImg/right_arrow.png" width="20px"  style="right:10px" @click="prveNum()"  alt="">
                            <div  class="locale-msg-box">
                                <div  v-if="localeMsgList.length<=0"  class="no-msg">暂无现场信息</div>
                                <div class="msg-list-box"
                                    v-if="localeMsgList.length>0"
                                    :style="{transform:'translateX('+leftNum+'px)',width:(localeMsgList.length*214+40)+'px'}">
                                    <div v-for="(item,key) in localeMsgList" :key="key" class="msg-list" @click="toLocaleMsg(item)">
                                        <img v-if="item.id!=undefined" :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt="">
                                        <i v-if="item.id==undefined"></i>
                                        <p>{{item.content}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>  -->
            
        </div>
        
        

      <div v-if="showPhotoVisable" class="page-diary-index" style="padding:0;position: absolute;z-index: 8;top:0;left:0;box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);">
            <div class="box-style" style="height:100%;">
                <div class="add-page" style="padding:66px 0 0 0">
                    <div class="add-page-button">
                        <button @click="showPhotoVisable=false">返回上一级</button>
                    </div>
                    <div class="add-page-form" style="overflow:auto;width:100%;height:100%;">
                        <div style="width:1094px;margin:0 auto;text-align:center">
                            <p style="font-size:18px;margin-bottom:10px;">{{newsObj.subject}}</p>
                            <p style="color:#c4c4c4;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid rgba(231,231,231,1);">{{newsObj.title}}</p>
                            <p style="padding: 0 6px;box-sizing:border-box;">{{newsObj.content}}</p>
                            <!-- <pre style="padding: 0 6px;box-sizing:border-box;width: 1000px;">
                            	{{newsObj.CONTENT_}}
                            </pre> -->
                            
                            <ul>
                                <li v-for="(item, index) in newsObj.picture" :key="index" style="margin:20px 0;">
                                    <img style="width:auto;height:500px;" :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=false&access_token='+sessionUtil.getAccessToken()" alt="">
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <i class="box-style-top-left"></i>
                <i class="box-style-top-right"></i>
                <i class="box-style-bottom-left"></i>
                <i class="box-style-bottom-right"></i>
            </div>
        </div>


      <div v-show="imgshows" @click.stop="imgshows = false" style="position: fixed;top:0;left: 0;right: 0;bottom: 0;z-index: 9999; background: rgba(0,0,0,.2);">
      	<div style="width: 1070px;margin: 150px auto;">
      		<img width="830px" :src="imgitem" alt="" />
      	</div>
      </div>

    </div>
</template>
<script>
import $ from 'jquery';
import asideItem from '../common/asideItem.vue'
import uploading from '../common/uploading.vue'
export default {
    data(){
        return{
            defaultLogo:require('@/assets/sflogo.jpg'),
        	imgitem:'',
        	imgshows:false,
        	classify:'',
        	currentRow:null,
        	mainweather:'',
        	addlist:[],
        	yeTai:'',
        	listsm:[
        		{label:'仓库楼',value:1},
        		{label:'分拣中心',value:2},
        		{label:'办公楼',value:3},
        		{label:'综合楼',value:4},
        		{label:'中转站',value:5},
        	],
        	partName:"",
            code: "",
            pageIndex:1,
            pageSize:10,
            workPageIndex:1,
            workPageSize:10,
            totalCount:0,
            workTotalCount:0,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                },],
            },
            deleteObj:{dialogVisible:false,deleteMsg:''},
            addReportObj:{},
            arrowShow:false,
            uploadingName:'',
            uploadConfig:{
                limit: 10,
                limitSize: 50048576,
                readOnly: false,
                xtype: "test",
                accept: ".jpg,.jpeg,.png,.JPG,.JPEG,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.xlsx",
            },
            isUpLoadingShow:false,
            isAddPart:false,
            models:[],
            model:[],
            activeStr:'首页',
            carouselHeight:0,
            leftNum:0,
            stepNum:0,
            BoxWidth:0,
            // reportObj:{finish:50},
            diaryList:[],
            reportList:[],
            newsList:[],
            localeMsgList:[],
            defaultImg:require('../../assets/indexImg/loading.png'),
            carouselList:[],
            environmentObj:{},
            realObj:{},
            qualityObj:{},
            safetyObj :{},
            infoObj :{},
            buildingNode:{},
            projObj:[],
            deleteFilesList:[],
            projList:[],
            unit:[],
            type:'',
            dataType:3,
            leafletLoaded: false,
            isEditFlag: false,
            addPartType:0, //添加部位类型
            imageUrl:"",
            tempPartObj:{},//当前选择部位
            childPartObj:{},//子部位对象
            currentEntity:{},//当前图层对象
            rectangleData:[],//当前图层数据
            partChildren:[],
            partSort:0, //部位排序号,
            JournalData:[],
            isJournal:false,
            DetailedObj:{},
            showPhotoVisable:false,//查看现场图片
            newsObj:{},
            isTeam:false,
            TeamList:[],
            sendMessage: '抄送人',
            memberList: []
        }
    },
    watch:{
       '$store.state.selectProjectObj.id':function(val,oldVal){
           if(this.$route.path=='/page/proj'){
               this.changeIndex();
           }
            
        }
    },
    created(){
        this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.$bus.$on('handelDeparts',this.refreshPicture)
        if(this.$route.path=='/page/proj'){
            this.changeIndex();
        }


    },
    activated(){
    	this.refreshPicture();
    	this.addlist=[];
    	this.listsm=[];
    	this.yeTai='';
    },
    beforeDestroy(){
        this.$bus.$off('handelDeparts',this.refreshPicture)
    },
    mounted() {
        this.$nextTick(()=>{
            var num=this.$refs.projMiddleTop.offsetHeight;
            this.carouselHeight=num;
        })

        // var box=document.querySelector('.locale-msg-box')
        // this.BoxWidth=parseInt(window.getComputedStyle(box).width)
        this.$store.state.selectProjectNode={};
    },
    components:{uploading,asideItem},
    methods:{
        editNews(node,num){
            this.util.restGet('/api_v1/business/news/searchNewsById?id='+node.id,null,(res)=>{
                if(res.status==200&&res.data){
                    res.data.title = res.data.createUserName+' · '+res.data.createDate;
                    this.newsObj=res.data;
                    this.showPhotoVisable=true;
                }
            })
        },
    	ruoter(){
    		this.$route.push('projProfile/checkSet')
        },
    	imgdgu(item, index){
    		this.imgshows = !this.imgshows
    		this.imgitem = this.util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=false&access_token='+this.sessionUtil.getAccessToken()

    	},
    	handleDelete(index, row) {
            this.addlist.splice(index,1)
        },
      Teambtn(item){
        this.isTeam=false;
        this.DetailedObj.GROUP_NAME_=item.name;
        this.DetailedObj.GROUP_UID_=item.id;
      },
      GetList(){
        let params={
          pageSize:100,
          pageNum:1,
          company:this.sessionUtil.getCompanyUid(),
          projUid:this.$store.state.selectProjectObj.id
        };
        this.util.mask();
        this.util.restGet('/api_v1/modules/teams',params,(res)=>{
          this.util.unmask();
          this.TeamList =res.data;
        });
      },
      addList(){
        this.util.restGet('/api_v1/construction/inspect/partTree',{projUid:this.$store.state.selectProjectObj.id},(res)=>{
          if(res.status==200&&res.data!=undefined){
            this.model=res.data;
          }else{
            this.model=[];
          }

        });
      },
        handleSelectionChange(val){
          this.currentRow = val;
        },
        toLocaleMsg(node){
            console.log("node======",node);
            this.showPhotoVisable=true;
            var title = node.parents.createDate+' · '+node.parents.createUserName;
            // if(node.parents.drawing){
            //     title=node.parents.drawing+' · '+node.parents.createDate+' · '+node.parents.createUserName
            // }
            this.newsObj={
                subject:node.parents.partName?node.parents.partName:'',
                content:node.parents.content?node.parents.content:'',
                title:title,
                picture : node.parents.accessory
            }
            // this.newsObj.subject=node.parents.partName?node.parents.partName:''
            // this.newsObj.CONTENT_=node.parents.content?node.parents.content:''
            // this.newsObj.fileList=node.parents.accessory
        },
        delReport(node){
            this.deleteObj={dialogVisible:true,deleteMsg:'删除汇报',obj:node};
        },
        getProjList(){
              let params={
              search:'',
              projStatus:'',
              pageSize:10,
              pageIndex:1,
          }
          this.util.restGet('/api_v1/business/project/searchProjectList',params,(res)=>{
                if(res.status==200){
                    if(res.data){
                      this.projList=res.data
                      this.addReportObj.projUid=this.$store.state.selectProjectObj.id
                    }else{
                      this.projList=[]
                    }
                }else{
                    this.util.error(res.msg)
                }
            })
        },
        downLoadFile(node){//下载附件
            window.open(this.util.getBaseUrl()+"/api_v1/files/"+node.id+"/download?access_token="+this.sessionUtil.getAccessToken());

        },
        cancelLoading(){
            this.isUpLoadingShow=false
        },
        upLoadIngFill(){
            this.isUpLoadingShow=true
        },
        changeIndex(str){
            this.util.mask("正在加载...");
                this.util.restGet('/api_v1/business/project/searchHomeByProjUid',{projUid:this.$store.state.selectProjectObj.id},(res)=>{
                    var listst=[];
                    var constructor='';
                    this.util.unmask();
                    if(res.status==200){
                    	constructor=res.data.brief.classify
                    	this.classify=res.data.brief.classify
                    	this.$store.commit("projPurpose",res.data.brief.projPurpose)
                        this.projObj=res.data.brief;
                        if(res.data.brief.unit){
                            this.unit = res.data.brief.unit;
                        }else{
                            this.unit=[]
                        }
                        if(res.data.newsList){
                            this.carouselList = res.data.newsList;
                        }else{
                            this.carouselList=[]
                        }
                        if(res.data.photograph&&res.data.photograph[0].accessory){
                            var arr=[]
                            for (let i = 0; i < res.data.photograph.length; i++) {
                                    res.data.photograph[i].accessory[0].content=res.data.photograph[i].content
                                    res.data.photograph[i].accessory[0].parents=res.data.photograph[i]
                                    arr.push(res.data.photograph[i].accessory[0])
                            }
                            this.localeMsgList =arr;
                        }else{
                            this.localeMsgList=[]
                        }
                        if(res.data.dustCheck){
                            this.environmentObj = res.data.dustCheck;
                        }else{
                            this.environmentObj={}
                        }
                        if(res.data.info){
                            this.infoObj = res.data.info;
                        }else{
                            this.infoObj={}
                        }
                        if(res.data.real){
                            this.realObj = res.data.real;
                            if(res.data.real.projWorkerCount==0){
                                this.realObj.percentage=0
                            }else{
                                let a=parseInt((res.data.real.presentCount/res.data.real.projWorkerCount)*100).toFixed(2)
                                this.realObj.percentage = (a-0);
                            }
                        }else{
                            this.realObj={}
                        }
                        if(res.data.qualityObj){
                            this.qualityObj = res.data.qualityObj;
                            if(res.data.qualityObj.totalNum==0){
                                this.qualityObj.percentage=0
                            }else{
                                let a = parseInt((res.data.qualityObj.completeNum/res.data.qualityObj.totalNum)*100).toFixed(2);
                                this.qualityObj.percentage =(a-0);
                            }
                        }else{
                            this.qualityObj={}
                        }
                        if(res.data.safetyObj ){
                            this.safetyObj = res.data.safetyObj ;
                            if(res.data.safetyObj.totalNum==0){
                                this.safetyObj.percentage=0
                            }else{
                                let a = parseInt((res.data.safetyObj.completeNum/res.data.safetyObj.totalNum)*100).toFixed(2);
                                this.safetyObj.percentage = (a-0);
                            }
                        }else{
                            this.safetyObj={}
                        }

							this.util.restGet('/api_v1/dic/20190621/items',null, (rese)=> {
					  				listst =rese.data
					  				listst.forEach((item)=>{
					  					if(item.id == constructor){
					  					 this.classify = item.name
					  					 this.$store.commit("projectName",item.id)

					  					}
					  				})

					  		})


                    }else{
                        this.util.error(res.errorMsg)
                    }
                })
        },
        addLeft(){
            var box1=document.querySelector('.msg-list-box')
            if(this.BoxWidth>parseInt(window.getComputedStyle(box1).width)){
                return
            }
            if(this.stepNum==0){
                return
            }
            var num=Math.round(this.BoxWidth/214)
             if(this.stepNum<((-this.localeMsgList.length)+num)){
                this.stepNum=this.stepNum+2
                this.leftNum=this.stepNum*214
            }else{
                this.stepNum++
                this.leftNum=this.stepNum*214
            }

            //   console.log(this.stepNum)
        },
        prveNum(){
              var box1=document.querySelector('.msg-list-box')
            if(this.BoxWidth>parseInt(window.getComputedStyle(box1).width)){
                return
            }
            var num=Math.round(this.BoxWidth/214)
            if(this.stepNum<((-this.localeMsgList.length)+num+2)){
                this.stepNum=(-this.localeMsgList.length)+2
                this.leftNum=-(this.localeMsgList.length*214)+this.BoxWidth
            }else{
                this.stepNum--
                this.leftNum=this.stepNum*214
            }
        },
        refreshPicture(data) {//刷新图纸
            this.yeTai='';
           this.tempList=[];
           this.getPartFullName(data);
           data.partFullName=this.tempList.reverse().join(">");
           this.tempPartObj=data;
           this.yeTai=data.yeTai;
           this.tempPartSort= this.tempPartObj.childCount;
           this.imageUrl = data.fileId==undefined? "":this.util.getBaseUrl() + '/api_v1/files/'+data.fileId+'/look?ifThumb=false&access_token='+this.sessionUtil.getAccessToken();
           lmap.remove();
           this.loaded(data.mapData);
        },
        editPart(){//编辑部位
        	//this.$bus.$on('handelDeparts',this.refreshPicture)
             if(this.tempPartObj.id==undefined){
                this.util.error("请先选择部位");
                return;
            }
            this.partName=this.tempPartObj.label;
            this.yeTai=this.tempPartObj.yeTai;
            this.code = this.tempPartObj.code;
            this.partSort=this.tempPartObj.sort;
            this.addPartType=0;
            this.isEditFlag=true;
            this.isAddPart=true;

        },
        addPart(type){//添加部位
            if(type=="root"){
                this.tempPartObj={};
            }
            this.partName="";
            this.code = '';
            this.partSort= this.tempPartSort==undefined||type=="root"? this.models.length:this.tempPartSort++;
            this.isAddPart=true;
            this.isEditFlag=false;
            this.yeTai='';
            this.addPartType=0;
        },
        loadDrawing(){
            if(this.tempPartObj.id==undefined||this.tempPartObj.id=="root"){
                this.util.error("请先选择部位");
                return;
            }
            this.isUpLoadingShow=true
        },
        savePartData(type){//保存部位
            if(type==1){

                if(!this.validUtil.isNotEmpty(this.partName.id)){
                    this.util.error("请选择部位!");
                    return;
                }
                this.childPartObj = this.partChildren.find(item=>item.id===this.partName.id);
                this.currentEntity.entity.partUid=this.childPartObj.id;
                this.currentEntity.entity.title=this.childPartObj.label;
                this.currentEntity.entity.uuid=this.childPartObj.id+"_measure";
                this.rectangleData.push(this.currentEntity.entity);
                lmap.updateText(this.currentEntity);
                this.isAddPart=false;
                return;
            }

            if(!this.validUtil.isNotEmpty(this.partName)){
                this.util.error("请输入部位名称!");
                return;
            }
            if(!this.validUtil.isNotEmpty(this.code)){
                this.util.error("请输入编码!");
                return;
            }
            if(!this.validUtil.isNotEmpty(this.yeTai)){
                this.util.error("请选择业态!");
                return;
            }
            

            var mainData={
                NAME_:this.partName,
                YE_TAI_:this.yeTai,
                SORT_:this.partSort,
                CODE_: this.code
            }
            if(!this.isEditFlag){//新增
                mainData.PROJ_UID_ = this.$store.state.selectProjectObj.id;
                mainData.PARENT_UID_ = this.tempPartObj.id==undefined? "root":this.tempPartObj.id;
                // var snNum = this.tempPartSort==undefined? this.models[this.models.length-1].sn:"01";
                var snString = this.models[0].children.length==0? "01":this.models[0].children[this.models[0].children.length-1].sn;
                
                if(this.models[0].children.length==0){
                    snString="01";
                }else if(this.tempPartObj.id&&this.tempPartObj.id!="root"){
                    var snNum =this.tempPartObj.children? parseInt(this.tempPartObj.children[this.tempPartObj.children.length-1].sn.slice(this.tempPartObj.sn.length))+1:1;
                    snString = snNum>9? this.tempPartObj.sn+snNum:this.tempPartObj.sn+"0"+snNum;
                }else{
                    var snStr = this.models[0].children[this.models.length-1].sn;
                    var snNum = parseInt(snStr)+1;
                    snString = snNum>9? snNum:"0"+snNum;
                }
                mainData.SN_ = snString;
            }
            var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"T_WORK_PART",ifSaveWorkflow:false};
            if(this.isEditFlag){//编辑
                params['id']=this.tempPartObj.id;
                params['businessKey']=this.tempPartObj.id;
            }
            this.util.mask("正在保存..");
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                if(res.status==200){
                this.util.successToast('保存成功');
                this.isAddPart=false;
                if(this.tempPartObj.id!=undefined){
                    this.tempPartObj.label=this.partName;
                    this.tempPartObj.yeTai =this.yeTai;
                    this.tempPartObj.code =this.code;
                }

                this.getPartList();

                }
                this.util.unmask();
            });
        },
        saveDrawingData(type){//保存图纸
            var mainData={
                NAME_:this.tempPartObj.label+"图纸",
                PROJ_UID_:this.$store.state.selectProjectObj.id,
                AREA_UID_:this.tempPartObj.id,
                PART_NAME_:this.tempPartObj.partFullName,
                SORT_:this.tempPartObj.childCount +1
            }
            if(type==1){
                var mapData =lmap.getData();
                mainData={MAP_DATA_:JSON.stringify(mapData)};
            }
            var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"T_DRAWING",ifSaveWorkflow:false};
            if(type==undefined){
                params['filesData']=JSON.stringify(this.uploadConfig.filesList);
            }
            if(this.tempPartObj.drawingId!=undefined){
                params['id']=this.tempPartObj.drawingId;
                params['businessKey']=this.tempPartObj.drawingId;
            }
            if(type==undefined&&this.tempPartObj.fileId!=undefined){
                params['deleteFilesData']=JSON.stringify([this.tempPartObj.fileId]);
            }
            this.util.mask("正在保存..");
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.util.successToast('保存成功');
                    this.isAddPart=false;
                    if(type==undefined){
                        this.tempPartObj.fileId=this.uploadConfig.filesList[0].id;
                        this.tempPartObj.drawingId=res.data.id;
                        this.refreshPicture(this.tempPartObj);
                    }

                    this.getPartList();

                }

            });
        },
        deletePart(){//删除部位
            if(this.tempPartObj.id==undefined){
                this.util.error("请选择要删除的部位!");
                return;
            }
            this.util.confirm("确定要删除该部位吗?",null,()=>{
                this.util.mask("正在删除..");
                this.util.restDelete("/api_v1/business/project/delete/"+this.tempPartObj.id,null,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.tempPartObj={};
                    this.tempPartSort=undefined;
                    this.util.successToast('删除成功!');
                    this.getPartList();
                }else{
                    this.util.failueToast('删除失败!');
                }
                });
            });
        },
        deleteDrawing(){
            if(this.tempPartObj.drawingId==undefined){
                this.util.error("改部位尚未上传图纸!");
                return;
            }
            this.util.confirm("确定要删除该图纸吗?",null,()=>{
                this.util.mask("正在删除..");
                this.util.restDelete("/api_v1/business/project/"+this.tempPartObj.drawingId,null,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.util.successToast('删除成功!');
                    this.tempPartObj.fileId="";
                    this.tempPartObj.mapData="[]";
                    this.refreshPicture(this.tempPartObj);
                }else{
                    this.util.failueToast('删除失败!');
                }


                });
            });
        },
        loaded(mapData) {
        var data = mapData==undefined? []:JSON.parse(mapData);
        this.rectangleData = data;
        if (this.leafletLoaded) {
            // var data =  JSON.parse(data);
            var config = {
            tools: {
                polygon:false,//是否允许绘制多边形，不配置默认是允许
                rectangle:false,//是否允许绘制多边形，不配置默认是允许
                marker:false,//是否允许绘制多边形，不配置默认是允许
                save: false,//是否允许保存,不配置默认是允许
                edit: false//是否允许编辑，不配置默认是允许
            },
            listeners: {
                'layer:click' : this.onLmapLayerClick,
                'layer:created' : this.onLmapLayerCreated,
                'save' : this.onLmapSave
            },
            data: data,
            center: [512, 384],
            bounds: [1024, 768], //坐标范围
            imageUrl: this.imageUrl
            };
            if(this.sessionUtil.isAllowBtn('gc1_4:drawing_edit')){
                config.tools.edit=true
                config.tools.rectangle=true
            }
            lmap.$ = $;
            // lmap.getData();
            lmap.init(this,config);
        }
        },
        onLmapLayerClick(layer){
        },
        onLmapLayerCreated(layer){
            // this.currentEntity=layer.entity;
            this.currentEntity=layer;
            this.isAddPart=true;
            this.partName="";
            this.addPartType=1;
            if(this.tempPartObj.children){
                this.partChildren=this.tempPartObj.children.filter(item=>{
                    return this.rectangleData.findIndex(obj=>obj.partUid===item.id)<0;
                });
            }else{
                this.partChildren=[];
            }
            
        },onLmapSave(data){
            console.info("======onLmapSave=====");
            this.cookieUtil.set('data',JSON.stringify(data));

        }
    }
}
</script>

<style scoped>
    .proj-box{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0 10px ;
        color: #44D2FF;
        font-size: 14px;
        padding-top: 36px;
        position: relative;
    }
    .tabs-box{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 10px;
        box-sizing: border-box;
    }

    .news-tabs,
    .tabs{
        width: 100%;
        height: 36px;
        border: 1px solid #44D2FF ;
        box-sizing: border-box;
        padding: 0 10px;
        text-align: center;
    }

    .news-tabs>span,
    .tabs>span{
        width: 78px;
        float: left;
        height: 26px;
        line-height: 26px;
        margin-top: 4px;
        cursor: pointer;
        color: #fff;
        margin-bottom: 10px;
    }
    .tabs>.active,.news-tabs>.active{
        background: url(../../assets/indexImg/select.png) no-repeat  top center;
    }
    .page-proj-index{
        width: 100%;
        height: 100%;
        padding-top: 10px;
        overflow: hidden;
        box-sizing: border-box;
    }
    .page-proj-index>div{
        box-sizing: border-box;
        height: 100%;
        float: left;
    }
    .proj-left{
        padding-right: 10px;
    }
    .proj-right{
        padding-left: 10px;
    }
    .proj-synopsis{
        position: relative;
        padding-top: 198px
    }
    .proj-synopsis,.environment{
        color: #fff;
    }
    .proj-synopsis li{
        text-align: left;
        margin-top: 5px;
    }
    .proj-synopsis-left-box{
        overflow: hidden;
        height: 154px;
    }
    .proj-synopsis-right-box{
        width: 80px;
        float: right;
        box-sizing: border-box;
        padding: 33px 0 0 10px;
    }
    .environment h4 span{
        float: right;
        font-size: 14px;
        font-weight: normal;
        margin-top: 6px;
    }
    .environment li{
        width: 33.3333333333333333%;
        float: left;
        overflow: hidden;
        height: 45px;
    }
    .environment li p{
        text-align: center;
        font-size: 14px;
        color: #44D2FF;
        height: 45px;
        line-height: 22px;
    }
    .environment li p span{
        color: #fff;
        font-size: 18px;
        display: block;
    }
    .locale {
        padding-top: 44px;
        position: relative;
    }
    .locale  h4{
        position: absolute;top: 10px;
    }
    .locale-img-box{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .locale-img-box>img{
        position: absolute;
        top: 50%;
        z-index: 2;
    }
    .locale-msg-box{
        width:100%;overflow:hidden;height:100%
    }
    .no-msg{
        width:100%;color:#fff;font-size:26px;text-align:center;height:100%
    }
    .msg-more{
        background:#ECECEC;
        height:100%;padding:10px;float:left;width:40px;box-sizing:border-box;text-align:center;color:#999;
    }
    .msg-list-box{
        height: 100%;
        transition:all 0.5s;
    }
    .msg-list {
        height: 100%;
        width: 200px;
        margin-right: 14px;
        float: left;
        position: relative;
    }
    .msg-list p{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background:rgba(68,210,255,0.5);
        font-size: 14px;
        height: 24px;
        line-height: 24px;
        color: #FFFFFF;
        position: absolute;
        width: 100%;
        bottom: 0;
    }
    .msg-list i{
        width: 100%;
        height: 100%;
        background: #e7e7e7 ;
        display: inline-block;
        position: relative;
    }
    .msg-list i::after{
        background: url(../../assets/indexImg/nonePic.png) no-repeat center ;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .progress{
        text-align: left;
    }
    .progress p{
        margin: 5px 0;
    }
    .progress p span{
        font-size: 18px;
        color: #FFFFFF;
        float: right;
    }
    .statistics>div{
        float: left;
        width: 50%;
        text-align: left;
        box-sizing: border-box;
    }
    .circle-right p span{
        font-size: 18px;
        color: #FFFFFF;
        display: block;
        margin-top: 5px;
    }
    .page-news-index,.page-diary-index{
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
        padding: 10px 0;
    }
    .page-news-index{
        padding-top: 99px;
    }
    .page-news-index .news-tabs{
        width: 100%;
        position: absolute;
        top: 10px;
        height: 80px;
    }
    .news-content{
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .news-content>div>div{
        width: 25%;
        float: left;
        padding-right: 10px;
        box-sizing: border-box;
    }
    .news-content>div>div:nth-child(4n){
        padding-right: 0;
    }
    .news-tab-item .title,.reading-content{
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
    .news-tab-item .belongs{
       font-size: 12px;
        color: #C4C4C4;
        text-align: left;
        margin-bottom: 5px;
    }
    .news-tab-item>img,
    .news-tab-item>i
    {
        width: 100%;
        height: 160px;
    }
    .news-tab-item>i{
        display: inline-block;
        margin-bottom: 5px;
        background: url(../../assets/indexImg/nonePic.png) no-repeat center ;
    }
    .reading-num{
        display: block;
        text-align: left;
        font-size: 12px;
        color: #FFFFFF;
        padding-left: 16px;
        float: left;
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
    .page-report-index{
        width: 100%;
        height: 100%;
        padding: 62px 0 10px;
        box-sizing: border-box;
        position: relative;
    }

    .report-header{
        position: absolute;
        top: 10px;
        width: 100%;
        overflow: hidden;
        height: 80px;
        padding-left: 260px;
        box-sizing: border-box;
    }
    .report-header .report-tabs{
        height: 42px;
        margin-bottom: 10px;
        width: 260px;
        float: left;
        position: absolute;
        top: 0;
        left: 0;
    }
    .report-header .report-tabs>span{
        margin : 8px 0;
    }
    .report-header-statistics{
        height: 100%;
        border: 1px solid #44D2FF;
        border-left: 0 none;
        box-sizing: border-box;
        padding: 10px 0 0 10px
    }
    .report-header-statistics p{
        float: left;
        width: 89px;
        font-size: 14px;
        color: #44D2FF;
        text-align: left;
        margin-top: 5px;
    }
    .report-header-statistics p span{
        color: #FFFFFF;
        display: block;
    }
    .report-header-button button,.diary-button button{
        float: right;
        margin-left: 10px;
        margin-top: 5px;
    }
    .report-body{
        width: 100%;
        height: 100%;
        overflow: auto;
        border: 1px solid #44D2FF;
        box-sizing: border-box;
        padding: 44px 10px 10px 10px
    }
    .report-body-item>div{
        float: left;
    }
    .report-item-img{
        width: 50px;
        height: 50px;
        padding: 0 10px;
    }
    .report-item-img img{
        width: 100%;
        height: 100%;
        border-radius: 50%
    }
    .report-item-title p span{
        float: left;
        margin: 2px 0;
        font-size: 14px;
    }
    .report-item-title{
        text-align: left;
    }
    .report-body-item>.item-operate{
        text-align: right;
        float: right;
    }
    .item-operate>div{
        margin: 2px 0;
        font-size: 14px;
        padding-right: 10px;
    }
    .item-operate>p{
        margin: 2px 0;
    }
    .item-operate>p span{
        float: right;
        padding: 0 10px 0 18px;
        position: relative;
    }
    .item-operate>p span::before{
        position: absolute;
        content: '';
        width: 16px;
        height: 16px;
        top: 2px;
        left: 0px;
    }
    .item-operate>p .operate-comment::before{
        /* background: #000; */
        background: url('../../assets/indexImg/comment.png') no-repeat center;
    }
    .item-operate>p .operate-read::before{
        /* background: #000; */
        background: url('../../assets/indexImg/read.png') no-repeat center;
    }
    .item-operate>p .operate-file::before{
        /* background: #000; */
        background: url('../../assets/indexImg/file.png') no-repeat center;
    }
    .page-building-index{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-top: 10px;
    }

    .building-fl{
        width: 300px;
        float: left;
        height: 100%;
    }
    .building-fr{
        overflow:hidden;
        height:100%;
        padding-left: 10px;
        box-sizing: border-box;
    }
    .page-building-index>div>div{
        height: 100%;
    }
    .building-box{
        width: 100%;
        height: 100%;
        padding-top: 55px;
        box-sizing: border-box;
        position: relative;
    }
    .building-box .building-title{
        width: 100%;
        position: absolute;
        width:100%;
        top:10px;
        left:0px;
        box-sizing: border-box;
        padding: 0 10px;
    }
    .building-drawing{
        width: 100%;
        height: 100%;
        background: #fff;
    }
    .add-part-box{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 80;
    }
    .add-part-box .add-part{
        width: 406px;
        position: absolute;
        top: 50%;
        left: 50%;
        background: #fff;
        height: 156px;
        transform: translate(-50%,-50%);
        padding: 10px 20px;
    }
    .add-part p{
        font-size: 18px;
        color: #333;
        text-align: left
    }
    .select-msg-box{
        color: #333;
        line-height: 38px;
        height: 38px;
        margin: 20px 0;
    }
    .select-part-box{
        color: #333;
        margin-top: 20px;
        margin-bottom: 5px;
    }
    .select-msg-ele{
        width: 296px;
        line-height: 38px;
        height: 38px;
        color: #333;
        width: 296px;
        border: 1px solid #ccc;
        border-radius: 1px ;
        box-sizing: border-box;
    }
    .add-part-box button{
        font-size: 14px;
        background: #5C9AD4;min-width: 60px;
        padding: 5px;
        height: 28px;

    }
    .add-page{
        position: relative;
        padding:20px;
        padding-top:66px;
        text-align: left;
        /* color: #fff; */
        background: #fff;
        color: #333;
    }
    .add-page button{
        background: #F08B00;
        color: #fff;
        border:1px solid #F08B00;
    }
    .add-page-button{
        position: absolute;
        top: 20px;
        left: 20px;
        /* display: flex; */
        justify-content: space-between;
        align-items: center;
        width: 1050px;
    }
    .add-page-button>div:nth-of-type(2) button{
        background-color: red;
        border-color: red;
    }
    .add-page-form{
        width:100%;height:100%;overflow:auto
    }
    .add-page-form-title{
        font-size: 18px;
        color: #333;
        text-align: left;
        padding-bottom: 10px;
    }
    .member-box li{
        float: left;
        position: relative;
    }
    .member-box li img{
        width: 42px;
        height: 42px;
    }

    .member-item i{
        position: absolute;
        right: 10px;
        top: -5px;
        background: url(../../assets/indexImg/delete.png) no-repeat center;
        width: 12px;
        height: 12px;
        background-size: cover;
    }
    .clear::after{
        content:"";
        height:0;
        line-height: 0;
        display: block;
        visibility: hidden;
        clear: both;
  }
  .title_text{
    font-size: 18px;
    color:#000;
    margin-bottom: 20px;
  }
    .li_span{
  	padding: 5px 18px;
  	background: #F08B00;
  	border-radius: 3px;
  	color: #fff;
  	margin: 0 10px 0 0 ;

  }
</style>

<style>
	
	
.bg .add-page .el-table, .bg .add-page .el-table thead{
    color: #606266;
    border-color:#ccc;
}
.bg .add-page .el-table--border, .bg .add-page .el-table--group, .bg .add-page .el-table td, .bg .add-page .el-table th.is-leaf{
    border-color:#ccc;
}
.bg .add-page .el-table--border:after, .bg .add-page .el-table--group:after, .bg .add-page .el-table:before{
    background:#ccc;
}
.select-msg-ele.el-select .el-input .el-select__caret.el-input__icon{
    color: #44D2FF;
}

.progress .el-progress-bar .el-progress-bar__inner{
    border-radius: 0 ;
    background-image: linear-gradient(left, #06FCFF 0%, #20A5FF 100%);
}

.el-textarea__inner{
    /*border: 0 none;*/
    min-height:100%!important;
}
.lj_box .el-table .cell, .el-table th div{
	/*text-overflow:clip;*/
}
.lj_box  .el-table .cell{
	/*overflow: auto;*/
}


</style>
<style >
@import "../../../static/js/leaflet/lib/leaflet.css";
@import "../../../static/js/leaflet/lib/leaflet.draw.css";
.tabs a{
	color: #FFF ;
	text-decoration : none;

}
</style>
