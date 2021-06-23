<template>
    <div class="news-box lj_box" style="padding-top:0px;position: relative;">
        
        
        <div  class="page-news-index">
            <div class="news-tabs" >
                <h4 style="margin:7px 0">通知公告</h4>
                <span :class="{active:activeNewsStr==''}" @click="changeNews('')">全部</span>
                <span :class="{active:activeNewsStr=='news'}" @click="changeNews('news')">新闻</span>
                <span :class="{active:activeNewsStr=='inform'}" @click="changeNews('inform')">通知</span>
                <span :class="{active:activeNewsStr=='announcement'}" @click="changeNews('announcement')">公告</span>
                <div style="position:absolute;right:10px;top:50%;transform:translateY(-50%)">
                    <button  v-if="sessionUtil.isAllowAdd('t_Materials_purchase')" @click="addNews">添加</button>
                </div>
            </div>
            <div class="news-content">
                <div>
                    <div style="height:280px;float:left" class="box-style" v-for="(item, index) in newsList" :key="index" @click.stop.prevent="editNews(item,1)">
                        <div class="news-tab-item" style="position:relative">
                            <img  v-if="sessionUtil.isAllowEdit('t_Materials_purchase')" src="../../assets/indexImg/chayuan.png" style="width:20px;height:20px;position:absolute;right:40px;top:10px;"
                            @click.stop.prevent="editNews(item,0)" alt="">
                            <img v-if="sessionUtil.isAllowDelete('t_Materials_purchase')" src="../../assets/indexImg/del.png" style="width:20px;height:20px;position:absolute;right:10px;top:10px;"
                            @click.stop.prevent="deleteNews(item)" alt="">
                            <p class="title" style="text-align:left;padding-right: 57px;box-sizing: border-box;"><span>{{item.title}}</span></p>
                            <p class="belongs"><span>{{item.userName}} </span><span>{{item.date}}</span></p>
                            <img v-if="item.picture&&item.picture.length>0" :src="util.getBaseUrl() + '/api_v1/files/'+item.picture[0].id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()"
                            style="margin-bottom:5px;" alt="">
                            <i v-if="!(item.picture&&item.picture.length>0)"></i>
                            <span class="reading-content">{{item.content}}</span>
                            <span class="reading-num">{{item.lookCount?item.lookCount:'0'}}人已读</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        
        <div v-show="addNewVisable" class="page-diary-index" >
            <div class="box-style" style="height:100%;">
                <div class="add-page" >
                    <div class="add-page-button">
                        <button @click="addNewVisable=false">返回上一级</button>
                        <button @click="saveNews" style="min-width:90px;">保存</button>
                    </div>
                    <div class="add-page-form" >
                        <div style="width:1050px" class="add-page-form-body">
                            <div class="select-msg-box" style="width:100%;">
                                <span style="float:left;width:100px">标题</span>
                                <div style="overflow:hidden">
                                    <el-input v-model="newsObj.SUBJECT_" size="mini" class="select-msg-ele" style="width:100%;background:#fff;overflow:hidden" placeholder="请输入标题"></el-input>
                                </div>
                            </div>
                            <div class="select-msg-box" style="width:100%;margin-bottom:0;">
                                <span style="float:left;width:100px">类型</span>
                                <div style="overflow:hidden">
                                    <div style="float:left;margin-right:20px" @click="newsObj.TYPE_='news';$forceUpdate()">
                                        <input type="radio" v-model="newsObj.TYPE_" value="news" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">新闻</label>
                                    </div>
                                    <div style="float:left;margin-right:20px" @click="newsObj.TYPE_='inform';$forceUpdate()">
                                        <input type="radio" v-model="newsObj.TYPE_" value="inform" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">通知</label>
                                    </div>
                                    <div style="float:left;margin-right:20px" @click="newsObj.TYPE_='announcement';$forceUpdate()">
                                        <input type="radio" v-model="newsObj.TYPE_" value="announcement" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">公告</label>
                                    </div>
                                    
                                </div>
                            </div>
                            <div style="width:100%;overflow:hidden">
                               
                                <div class="select-msg-box" style="width:330px;float:left;">
                                    <span style="float:left;width:100px">发布人</span>
                                    <div style="overflow:hidden">
                                        <el-input v-model="newsObj.fabuMan" size="mini" :disabled="true" class="select-msg-ele" style="width:100%;background:#F5F7FA;overflow:hidden" placeholder="请输入发布人"></el-input>
                                    </div>
                                </div>
                                <div class="select-msg-box" style="width:330px;float:left;margin-left:30px;">
                                    <span style="float:left;width:100px">日期</span>
                                    <div style="overflow:hidden">
                                        <el-date-picker
                                        style="width:100%;background:#fff;overflow:hidden"
                                        v-model="newsObj.DATE_"
                                        value-format="yyyy-MM-dd"
                                        class="select-msg-ele"
                                        type="date"
                                        placeholder="选择日期">
                                        </el-date-picker>
                                    </div>
                                </div>
                            </div>
                            <div class="select-msg-box" style="width:100%;margin-top:0;height:auto">
                                <span style="float:left;width:100px">内容</span>
                                <div style="overflow:hidden;height:180px">
                                    <el-input v-model="newsObj.CONTENT_"  height="180px" :autosize="true" type="textarea" size="medium" class="select-msg-ele"
                                     style="height:180px;width:100%;background:#fff;padding:0;overflow-x:hidden;overflow-y:auto" placeholder="请输入内容"></el-input>
                                </div>
                            </div>
                            <div class="select-msg-box" style="width:100%;">
                                <span style="float:left;width:100px">发布类型</span>
                                <div style="overflow:hidden">
                                    <div style="float:left;margin-right:20px" @click="newsObj.isOpen=1;$forceUpdate()">
                                        <input type="radio" v-model="newsObj.isOpen" value="1" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">公开</label>
                                    </div>
                                    <div style="float:left;margin-right:20px" @click="newsObj.isOpen=0;$forceUpdate();newsObj.TOP_=0">
                                        <input type="radio" v-model="newsObj.isOpen" value="0" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">私有</label>
                                    </div>
                                </div>
                            </div>
                            <div class="select-msg-box" style="width:100%;margin-bottom:0;">
                                <span style="float:left;width:100px">添加到首页</span>
                                <div style="overflow:hidden">
                                    <div v-if="newsObj.isOpen!=0" style="float:left;margin-right:20px" @click="newsObj.TOP_='1';$forceUpdate()">
                                        <input type="radio" v-model="newsObj.TOP_" value="1" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">是</label>
                                    </div>
                                    <div style="float:left;margin-right:20px" @click="newsObj.TOP_='0';$forceUpdate()">
                                        <input type="radio" v-model="newsObj.TOP_" value="0" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">否</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div  class="add-page-form-body" style="width:1050px;margin-bottom:20px;">
                            <p class="add-page-form-title" style="color:#333;">附件
                                <button style="float:right" @click="upLoadIngFill">添加</button>
                            </p>
                            <div style="margin-left:100px;width:948px">
                                <el-table :data="newsObj.fileList"  border style="width: 100%" >
                                    <el-table-column type="index" label="序号" width="55">
                                    </el-table-column>
                                    <el-table-column prop="fileName" label="文件名称">
                                    </el-table-column>
                                    <el-table-column prop="createUserName" label="上传者"  width="150">
                                    </el-table-column>
                                    <el-table-column prop="createTime" label="上传时间"  width="160">
                                    </el-table-column>
                                    <el-table-column label="操作" width="70">
                                        <template slot-scope="scope">
                                            <div>
                                                <a v-if="!scope.row.isNewFlag" :href="util.getBaseUrl() + '/api_v1/files/'+scope.row.id+'/download?access_token='+sessionUtil.getAccessToken()"><img src="../../assets/administrationIcon/daoru.png" width="18" alt=""></a>
                                                <img src="../../assets/administrationIcon/remove.png" style="width:18px;" @click="delFile(scope.row)" alt="">
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            	<div style="margin-left: 80px;">
                        		  <ul style="display: flex;flex-wrap：wrap;width: 970;">
		                                <li @click="imgdgu(item, index)" v-for="(item, index) in newsObj.fileList" :key="index" style="margin:20px 0 20px 20px;flex: 0 0 100px; height: 100px;overflow: hidden;">
		                                    <img style="width:100px;" :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=false&access_token='+sessionUtil.getAccessToken()" alt="">
		                                </li>
		                            </ul>
                        	</div>
                        </div>
                        <div class="add-page-form-body" v-if="newsObj.isOpen==0" style="width:1050px;margin-bottom:20px;">
                            <p class="add-page-form-title" style="color:#333;">{{sendMessage}}</p>
                            <div class="member-box">
                               <ul class="clear" style="padding-left:100px;box-sizing:border-box">
                                    <li v-for="(item, index) in newsObj.memberList" :key="index" class="member-item"><i @click.stop.prevent="deleteMember(item)"></i><img :src="item.picture" alt=""><span style="display:block;width:60px">{{item.userName}}</span></li>
                                    <li style="margin-left:9px;"><img style="width: 42px;height: 42px;" src="../../assets/indexImg/add.png" @click.stop.prevent="addMember(newsObj.memberList)" alt=""></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <i class="box-style-top-left"></i>
                <i class="box-style-top-right"></i>
                <i class="box-style-bottom-left"></i>
                <i class="box-style-bottom-right"></i>
            </div>
        </div>
        <div v-if="newsDetailsVisable" class="page-diary-index" style="padding:0;">
            <div class="box-style" style="height:100%;">
                <div class="add-page" style="padding:66px 0 0 0">
                    <div class="add-page-button">
                        <button @click="newsDetailsVisable=false">返回上一级</button>
                    </div>
                    <div class="add-page-form" style="overflow:auto;width:100%;height:100%;">
                        <div style="width:1094px;margin:0 auto;text-align:center">
                            <p style="font-size:18px;margin-bottom:10px;">{{newsObj.SUBJECT_}}</p>
                            <p style="color:#c4c4c4;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid rgba(231,231,231,1);">{{titleNewsStr}}</p>
                            <p style="padding: 0 6px;box-sizing:border-box;">{{newsObj.CONTENT_}}</p>
                            <!-- <pre style="padding: 0 6px;box-sizing:border-box;width: 1000px;">
                            	{{newsObj.CONTENT_}}
                            </pre> -->
                            
                            <ul>
                                <li v-for="(item, index) in newsObj.fileList" :key="index" style="margin:20px 0;">
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
        
        
        
        <div v-if="isUpLoadingShow">
          <div  class="add-part-box" style="z-index:988" @click.stop.prevent="cancelLoading" ></div>
          <div class="add-part" style="z-index:990;min-height:234px;padding-bottom:50px;">
            <p style="margin-bottom:10px;">添加附件</p>
            <div style="max-height:500px;overflow-y:auto;overflow-x:hidden">
                <uploading v-model="uploadingName"   :config="uploadConfig" ref="uploading" ></uploading>
            </div>
            <div style="padding-top:10px;position:absolute;bottom:20px;right: 20px;">
                <button style="margin-right:20px;" @click.stop.prevent="cancelLoading">关闭</button>
                <button @click.stop.prevent="saveFill">保存</button>
            </div>
          </div>
        </div>

      

    

       <el-dialog
          :title="deleteObj.deleteMsg"
          :visible.sync="deleteObj.dialogVisible"
          width="30%">
          <p>你确定要删除吗？</p>
          <span slot="footer" class="dialog-footer">
          <el-button @click="deleteObj.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteProj">确 定</el-button>
          </span>
      </el-dialog>

      <selectMember ref="selectMemberFun" :selectMemberModels='selectMemberModels'></selectMember>


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
import selectMember from '../common/selectMember.vue'
export default {
    data(){
        return{
            formKey:"t_new_find",
            addNewVisable:false,
            newsDetailsVisable:false,
            activeNewsStr:"",
            pageIndex:1,
            pageSize:10,
            imgshows:false,
            imgitem:'',
            deleteObj:{dialogVisible:false,deleteMsg:''},
            selectMemberModels:{
                isShow:false,
                selectList:[],
                callBack:this.callBack3,
                radioSelectFlags:false,
                type: ''
            },
            newsObj:{},
            addReportObj:{},
            NotifierObj:{children:[],memberList:[],fileList:[],deleteFilesList:[]},
            arrowShow:false,
            uploadingName:'',
            uploadConfig:{
                limit: 10,
                limitSize: 50048576,
                readOnly: false,
                xtype: "test",
                formKey:"t_new_find",
                accept: ".jpg,.jpeg,.png,.JPG,.JPEG,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.xlsx",
            },
            isUpLoadingShow:false,
            isAddPart:false,
            models:[],
            model:[],
            carouselHeight:0,
            leftNum:0,
            stepNum:0,
            BoxWidth:0,
            diaryList:[],
            reportList:[],
            newsList:[],
            localeMsgList:[],
            defaultImg:require('../../assets/indexImg/loading.png'),
            realObj:{},
            projObj:[],
            deleteFilesList:[],
            projList:[],
            unit:[],
            type:'',
            dataType:3,
            leafletLoaded: false,
            isEditFlag: false,
            imageUrl:"",
            DetailedObj:{},
            isregion:false,
            isTeam:false,
            sendMessage: '抄送人',
            memberList: []
        }
    },
    watch:{
       '$store.state.selectProjectObj.id':function(val,oldVal){
           this.changeIndex();
            
        }
    },
    created(){
        this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.changeIndex();
        this.getdatas = new Date().format("yyyy-MM-dd");

    },
    activated(){

    },
    mounted() {
        

        // var box=document.querySelector('.locale-msg-box')
        // this.BoxWidth=parseInt(window.getComputedStyle(box).width)
        // this.$store.state.selectProjectNode={};
    },
    components:{uploading,selectMember,asideItem},
    methods:{
    	imgdgu(item, index){
    		this.imgshows = !this.imgshows
    		this.imgitem = this.util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=false&access_token='+this.sessionUtil.getAccessToken()

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
        delchildren(data){
            this.NotifierObj.children=this.NotifierObj.children.filter(item=>{
            return item!=data
            })
            this.$forceUpdate();
        },
        handleSelectionChange(val){
          this.currentRow = val;
        },
        changeType(str){
            this.addReportObj.TYPE_=str;
            this.$forceUpdate();
            this.addReportObj.TITLE_=this.addReportObj.CREATE_USER_ ?this.addReportObj.CREATE_USER_:''+'-'+this.addReportObj.TYPE_?this.addReportObj.TYPE_:''+'-'+this.addReportObj.projectName?this.addReportObj.projectName:''+'项目 '+this.addReportObj.CREATE_TIME_?this.addReportObj.CREATE_TIME_:''
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
        deleteProj(){
            this.util.restDelete("/api_v1/business/news/deleteNewsByIds?ids="+this.deleteObj.obj.id,{formKey:this.formKey},(res)=>{
                if(res.status==200){
                    this.util.success('删除成功');
                    this.deleteObj={dialogVisible:false};
                    this.changeIndex('新闻公告')
                }else{
                    this.util.error(res.errorMsg)
                }
            });

        },
        deleteNews(node){
            this.deleteObj={dialogVisible:true,deleteMsg:'删除新闻',obj:node};
        },
        saveNews(){
            if(!this.validUtil.isNotEmpty(this.newsObj.SUBJECT_)){
                this.util.error('请输入标题');
                return
            }
            if(!this.validUtil.isNotEmpty(this.newsObj.CONTENT_)){
                this.util.error('请输入内容');
                return
            }
            if((!this.newsObj.fileList||this.newsObj.fileList.length==0)&&this.newsObj.TOP_=="1"){
                this.util.error('请上传附件');
                return
            }
            let mainData={},subFormList=[],memberData=[],filesList=[],deleteFilesIdList=[];
            mainData.PROJ_UID_=this.$store.state.selectProjectObj.id;
            mainData.SUBJECT_=this.newsObj.SUBJECT_;
            mainData.TOP_=this.newsObj.TOP_;
            mainData.TYPE_=this.newsObj.TYPE_;
            mainData.DATE_=this.newsObj.DATE_;
            mainData.CONTENT_=this.newsObj.CONTENT_;
            if(this.newsObj.fileList){
                for (let j = 0; j < this.newsObj.fileList.length; j++) {
                    if(this.newsObj.fileList[j].isNewFlag){
                        filesList.push(this.newsObj.fileList[j])
                    }
                }
            }
            
            for (let u = 0; u < this.deleteFilesList.length; u++) {
                deleteFilesIdList.push(this.deleteFilesList[u].id)
            }
            if(this.newsObj.isOpen==0){
                if(this.newsObj.memberList&&this.newsObj.memberList.length>0){
                    for (let i = 0; i < this.newsObj.memberList.length; i++) {
                    let o={}
                    o.USER_NAME_=this.newsObj.memberList[i].userName
                    o.USER_UID_=this.newsObj.memberList[i].id
                    memberData.push(o);
                    }
                    var memberSubForm ={subFormForeignKey:"NEWS_UID_",subFormTable:"T_NEWS_USER",data:JSON.stringify(memberData)};
                    subFormList.push(memberSubForm);
                    var params = {formKey:this.formKey,mainFormData:JSON.stringify(mainData),sqlTableName:"T_NEWS",subFormData:JSON.stringify(subFormList),filesData: JSON.stringify(filesList), deleteFilesData: JSON.stringify(deleteFilesIdList),ifSaveWorkflow:false};
                }else{
                    this.util.error('请选择' + this.sendMessage)
                    return ;
                }
            }else{
                var params = {formKey:this.formKey,mainFormData:JSON.stringify(mainData),subFormData:JSON.stringify([{subFormForeignKey:"NEWS_UID_",subFormTable:"T_NEWS_USER",data:null}]),sqlTableName:"T_NEWS",filesData: JSON.stringify(filesList), deleteFilesData: JSON.stringify(deleteFilesIdList),ifSaveWorkflow:false};
            }

            if(this.validUtil.isNotEmpty(this.newsObj.id)){
                params['id']=this.newsObj.id;
                params['businessKey']=this.newsObj.id;
            }
            this.util.mask("正在保存...");
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.util.success('保存成功');
                    this.addNewVisable=false;
                    this.changeIndex();
                }else{
                    this.util.error(res.errorMsg)
                }
            });
        },
        addMember(userList,type){
            this.$refs.selectMemberFun.reset(userList);
            this.selectMemberModels.selectList=[];
            this.selectMemberModels.isShow=true
            this.selectMemberModels.type = type;
        },
        callBack3(){
            this.newsObj.memberList=this.selectMemberModels.selectList;
            this.$forceUpdate()
        },
        deleteMember(node,type){
            this.newsObj.memberList=this.newsObj.memberList.filter((item)=>{
                return item.id!=node.id
            })
            this.$forceUpdate()
        },
        downLoadFile(node){//下载附件
            window.open(this.util.getBaseUrl()+"/api_v1/files/"+node.id+"/download?access_token="+this.sessionUtil.getAccessToken());

        },
        delFile(node){
            this.deleteFilesList.push(node)
            this.newsObj.fileList=this.newsObj.fileList.filter((item)=>{
                return item.id!=node.id
            })

            this.$forceUpdate()
        },
        saveFill(){
            this.isUpLoadingShow=false
            for (let i = 0; i < this.uploadConfig.filesList.length; i++) {
                 this.uploadConfig.filesList[i].isNewFlag=true;
            }
           if(this.newsObj.fileList){
                this.newsObj.fileList = this.newsObj.fileList.concat(this.uploadConfig.filesList)
            }else{
                this.newsObj.fileList=this.uploadConfig.filesList
            }
        },
        cancelLoading(){
            this.isUpLoadingShow=false
        },
        upLoadIngFill(){
            this.isUpLoadingShow=true
        },
        editNews(node,num){
            this.util.restGet('/api_v1/business/news/searchNewsById?id='+node.id,{formKey:this.formKey},(res)=>{
                if(res.status==200){
                    this.newsObj={
                        id:res.data.id,
                        DATE_:res.data.date,
                        fabuMan:res.data.createUserName,
                        TOP_:res.data.tops,
                        SUBJECT_:res.data.subject,
                        CONTENT_:res.data.content,
                        TYPE_:res.data.type,
                    }
                    this.newsObj.memberList=[]
                    if(res.data.informPerson&&res.data.informPerson.length>0){
                        this.newsObj.isOpen=0;
                        for (let i = 0; i < res.data.informPerson.length; i++) {
                            var o={}
                            o.id = res.data.informPerson[i].userId;
                            o.userName = res.data.informPerson[i].userName;
                            o.picture = res.data.informPerson[i].picture;
                            this.newsObj.memberList.push(o)
                        }
                    }else{
                        this.newsObj.memberList=[];
                        this.newsObj.isOpen=1;
                    }
                    this.newsObj.fileList=res.data.picture? res.data.picture:[];
                    this.newsObj.fileList.forEach(item=>{
                        item.createUserName= item.createUser;
                        item.createTime= item.createDate;
                    });
                    num ==0? this.addNewVisable=true:this.newsDetailsVisable=true;
                    this.titleNewsStr=this.newsObj.fabuMan+' · '+this.newsObj.DATE_
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        addNews(){
            this.newsObj={
                DATE_:new Date().format('yyyy-MM-dd'),
                isOpen :1,
                TOP_ :1,
                TYPE_ :this.activeNewsStr==""? "news":this.activeNewsStr,
                fabuMan:this.sessionUtil.getUserName()
            }
            this.addNewVisable=true;
        },
        changeIndex(str){
            let params={
                    projUid:this.$store.state.selectProjectObj.id,
                    pageSize:10,
                    pageIndex:1,
                    type:this.activeNewsStr,
                    search:''
                }
                 this.util.restGet('/api_v1/business/news/searchNewsList',params,(res)=>{
                    if(res.status==200){
                        this.newsList=res.data
                    }else{
                        this.util.error(res.errorMsg)
                    }
                })



            
        },
        changeNews(str){
            this.activeNewsStr=str;
            this.changeIndex()
        },
        
        
        
       
    }
}
</script>

<style scoped>
    .news-box{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0px ;
        color: #44D2FF;
        font-size: 14px;
        position: relative;
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
    .page-diary-index{
        width: 100%;
        height: 100%;
        padding: 0px;
        position: absolute;
        top: 0;
        /* overflow: hidden;
        position: relative;
        box-sizing: border-box;
        padding: 10px 0; */
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
    min-height:100%!important;
}


</style>

