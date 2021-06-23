<template>
    <div class="proj-box">
        <el-dialog  :title="deleteObj.deleteMsg"
            :visible.sync="deleteObj.dialogVisible"
            width="30%">
            <p>你确定要删除吗？</p>
            <span slot="footer" class="dialog-footer">
            <el-button @click="deleteObj.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteProj">确 定</el-button>
            </span>
        </el-dialog>
        <div class="tabs-box">
            <div class="tabs">
                <!-- <span v-if="sessionUtil.isAllowMenu('020401')" class="active">进度编制</span> -->
                <router-link :class="{active:$route.path=='/page/progress'}" to="/page/progress" tag="span" v-if="sessionUtil.isAllowMenu('020401')" >进度编制</router-link>
                <!-- <router-link active-class="active" to="/page/progress/form/query/t_ProjectProgress_Plan" tag="span">计划编制</router-link> -->
            </div>
            
        </div>

        <div v-if="$route.path=='/page/progress/form/query/t_ProjectProgress_Plan'" style="width:100%;height: 100%;padding-top:0px;overflow: hidden;">
            <router-view :key="$route.path"></router-view>
        </div>

        <div class="proj-box" style="padding:36px 0 10px ;" v-if="$route.path=='/page/progress'&&activeStr=='进度'">
            <div class="tabs-box tabs-box1" style="text-align:left;">
                <button @click="back()">返回上一级</button>
                <div v-show="scheduleNode.version==maxVersion">
                    <button @click="save" v-if="sessionUtil.isAllowEdit('t_ProjectProgress_Plan')">保存</button>
                    <!-- <button @click="importTemp()"  v-if="sessionUtil.isAllowExport('t_ProjectProgress_Plan')">导入模板</button> -->
                    <!-- <button @click="ProjImport('xml')"  v-if="sessionUtil.isAllowExport('t_ProjectProgress_Plan')">导入project</button> -->
                    <button @click="ProjImport('excel')"  v-if="sessionUtil.isAllowExport('t_ProjectProgress_Plan')">导入excel</button>
                    <button  @click="addTask();"  v-if="sessionUtil.isAllowAdd('t_ProjectProgress_Plan')">添加任务</button>
                    <button  @click="deleteTask();"  v-if="sessionUtil.isAllowDelete('t_ProjectProgress_Plan')">删除任务</button>
                    <button  @click="batchImport()" v-if="sessionUtil.isAllowEdit('t_ProjectProgress_Plan')">批量设置</button>
                </div>
                
                <!-- <button>降级</button> -->
                <!-- <button @click="ondo">撤销</button>
                <button @click="redo">恢复</button> -->
            </div>
            <div style="width:100%;height:100%;overflow:auto;">
                <gantt :tasks="tasks" :projUid="projUid" :scheduleUid="scheduleUid" :scheduleNode="scheduleNode" ref="gantt"></gantt>
            </div>
        </div>
        <div class="proj-box" style="padding:36px 0 10px ;" v-if="$route.path=='/page/progress'&&activeStr=='首页'">
            <button style="position:absolute;top:5px;right:0px;" @click="addProgress" v-if="sessionUtil.isAllowAdd('t_ProjectProgress_Plan')">添加</button>
            <div style="width:100%;height:100%;overflow:auto;">
                <div class="proress-box" >
                    <div class="proress" v-for="(item, index) in progressList" :key="index">
                        <div class="box-style" style="height:302px;">
                            <div>
                                <h4 style="overflow:hidden">V{{item.version}}
                                    <div style="float:right;">
                                        <button @click="proressDetails(item)"  v-if="sessionUtil.isAllowAdd('t_ProjectProgress_Plan')">进度</button>
                                        <button v-show="maxVersion==item.version" @click="changeVersions(item)"  v-if="sessionUtil.isAllowEdit('t_ProjectProgress_Plan')">调整</button>
                                        <button v-show="maxVersion==item.version" @click="setProress(item)"  v-if="sessionUtil.isAllowEdit('t_ProjectProgress_Plan')">设置</button>
                                        <button v-show="maxVersion==item.version" @click="deleteProress(item)"  v-if="sessionUtil.isAllowDelete('t_ProjectProgress_Plan')">删除</button>
                                    </div>
                                </h4>
                                <div style="padding: 5px 0px;">标题:&nbsp;&nbsp;{{item.title}}</div>
                                <div style="float:right;width:100px;height:110px;padding-top:10px;">
                                    <el-progress type="circle" :width="90" :stroke-width="10" :percentage="item.progress"></el-progress>
                                </div>
                                <div class="proress-body" >
                                    <p style="padding-top:0;"><span>是否启用</span><el-switch  v-model="item.ifShow" :disabled="true" active-color="#13ce66"  inactive-color="#ff4949"></el-switch></p>
                                    <p><span>计划开始</span><span>{{item.startDate}}</span></p>
                                    <p><span>计划完成</span><span>{{item.endDate}}</span></p>
                                    <p><span>计划工期</span><span>{{item.duration}}</span></p>
                                    <p><span>实际开始</span><span>{{item.actStartDate}}</span></p>
                                    <p><span>实际完成</span><span>{{item.actEndDate}}</span></p>
                                    <p><span>实际工期</span><span>{{item.actDuration}}</span></p>
                                    <p><span>创建人</span><span>{{item.createUserName}}</span></p>
                                    <p v-if="item.adjustReason"><span>调整原因</span><span>{{item.adjustReason}}</span></p>
                                </div>

                            </div>
                            <i class="box-style-top-left"></i>
                            <i class="box-style-top-right"></i>
                            <i class="box-style-bottom-left"></i>
                            <i class="box-style-bottom-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isChangePart">
            <div  class="add-part-box" @click.stop.prevent="cancelChange" ></div>
            <div class="add-part">
                <p>调整计划</p>
                <div class="select-msg-box" >
                    <span style="float:left;width:60px;">原版本</span>&nbsp;&nbsp;
                    <el-input v-model="changePartObj.Old_VERSIONS_" size="mini" :disabled="true"  style="background:#F5F7FA" class="select-msg-ele" placeholder="请选择"></el-input>
                </div>
                <div class="select-msg-box" >
                    <span style="float:left;width:60px;">变更版本</span>&nbsp;&nbsp;
                    <el-input v-model="changePartObj.New_VERSIONS_" size="mini" :disabled="true"  style="background:#F5F7FA" class="select-msg-ele" placeholder="请选择"></el-input>
                </div>
                <div style="display: flex;align-items: center;">
                    <span style="min-width:63px">调整原因<i style="color:red">*</i></span>&nbsp;&nbsp;
                    <el-input v-model="changePartObj.adjustReason" type="textarea" :rows="2" placeholder="请选择"></el-input>
                </div>
                <div style="float:right;padding-top:10px">
                    <button style="margin-right:20px;" @click.stop.prevent="cancelChange">关闭</button>
                    <button @click.stop.prevent="saveMsgChange">保存</button>
                </div>
            </div>
        </div>
        <div v-if="isAddPart">
            <div  class="add-part-box" @click.stop.prevent="cancel" ></div>
                <div class="add-part" style="width:950px;">
                    <p>进度</p>
                    <div class="select-msg-box" >
                        <span style="float:left;width:60px;">标题</span>&nbsp;&nbsp;
                        <el-input v-model="addPartObj.title" style="width:89%" size="mini" class="select-msg-ele" placeholder="请输入标题"></el-input>
                    </div>
                    <div class="select-msg-box wd50" >
                        <span >版本</span>&nbsp;&nbsp;
                        <el-input v-model="addPartObj.version" :disabled="true" style="background:#F5F7FA" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>
                    </div>
                    <div class="select-msg-box wd50" >
                        <span style="white-space: nowrap;">完成进度(%)</span>&nbsp;&nbsp;
                        <input disabled v-model="addPartObj.progress" type="number" style="background:#F5F7FA" size="mini" class="select-msg-ele" placeholder="请输入进度">
                    </div>
                    <div class="select-msg-box wd50" style="text-align:left">
                        <span >是否启用</span>&nbsp;&nbsp;
                        <el-switch style="margin-left:18px" v-model="addPartObj.ifShow"  active-color="#13ce66"  inactive-color="#ff4949"></el-switch>
                    </div>

                    <div class="select-msg-box wd50" >
                        <span style="float:left;width:60px;">计划开始</span>&nbsp;&nbsp;
                        <el-date-picker disabled
                        v-model="addPartObj.startDate"
                        @change="changePlan()"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        class="select-msg-ele"
                        :editable="false"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div class="select-msg-box wd50" >
                        <span>计划完成</span>&nbsp;&nbsp;
                        <el-date-picker  v-model="addPartObj.endDate"  @change="changePlan()" disabled
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        class="select-msg-ele"
                        :editable="false"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div class="select-msg-box wd50" >
                        <span>计划工期</span>&nbsp;&nbsp;
                        <el-input v-model="addPartObj.duration" style="background:#F5F7FA"  size="mini" class="select-msg-ele" :disabled="true" placeholder="请选择"></el-input>
                    </div>
                    <div class="select-msg-box wd50" >
                        <span >实际开始</span>&nbsp;&nbsp;
                        <el-date-picker disabled
                        v-model="addPartObj.actStartDate"
                        value-format="yyyy-MM-dd"
                        @change="changePrac()"
                        format="yyyy-MM-dd"
                        class="select-msg-ele"
                        :editable="false"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    
                     <div class="select-msg-box wd50" >
                        <span style="float:left;width:60px;">实际完成</span>&nbsp;&nbsp;
                        <el-date-picker disabled @change="changePrac()" v-model="addPartObj.actEndDate"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        class="select-msg-ele"
                        :editable="false"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    
                    <div class="select-msg-box wd50" >
                        <span style="float:left;width:60px;">实际工期</span>&nbsp;&nbsp;
                        <el-input v-model="addPartObj.actDuration" style="background:#F5F7FA"  size="mini" class="select-msg-ele" :disabled="true" placeholder="请选择"></el-input>
                    </div>
                   
                    <!-- <div class="select-msg-box">
                        <span>类别</span>&nbsp;&nbsp;
                        <el-select v-model="rectificationValue" size="mini" class="select-msg-ele" placeholder="请选择">
                            <el-option v-for="(item, index) in items" :key="index"></el-option>
                        </el-select>
                    </div> -->
                    <div style="padding-right: 26px;text-align: right;">
                        <button style="margin-right:20px;" @click.stop.prevent="cancel">关闭</button>
                        <button @click.stop.prevent="saveMsg">保存</button>
                    </div>
                </div>
            </div>
            

            <!-- <div  v-show="importVisable" >
        <div class="add-part " style="height: 90%;width:850px;overflow: hidden;padding-bottom:150px;box-sizing:border-box;">
          <div style="margin-bottom: 10px;">
            <p style="margin-bottom: 10px;">批量设置任务</p>
           
          </div>
          
          <div style="height:100%;overflow: auto;display: flex">
            <div style="width:420px;box-sizing: border-box;border: 1px solid #44d2ff;padding: 5px;margin-right: 5px;height: 100%;overflow: auto;">
              <div style="text-align: left;font-size: 18px;color:#000;">
                <span style="margin-right: 10px;">选择节点</span>
              </div>
              
              <div  style="margin-top: 10px;">
                <el-tree show-checkbox :expand-on-click-node="false" check-strictly highlight-current node-key="id" :load="loadEnterpriseList" lazy :props="defaultProps" ref="tree"></el-tree>
              </div>
              
            </div>
            <div style="width:420px;box-sizing: border-box;text-align: left;border: 1px solid #44d2ff;padding: 5px;">
              <div style="font-size: 18px;color:#000;">下达任务</div>
              <el-form :model="form">
                <el-form-item label="施工负责人" label-position="left" :label-width="formLabelWidth">
                  <el-select v-model="form.principal"  class="item_date addbernum" multiple collapse-tags  placeholder="请选择">
                    <el-option v-for="(item,index) in cities" :key="index" :label="item.label" :value="item.id">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="检查人员" label-position="left" :label-width="formLabelWidth">
                  <el-select v-model="form.inspect" class="item_date addbernum" multiple collapse-tags placeholder="请选择">
                    <el-option v-for="(item,index) in cities1" :key="index" :label="item.label" :value="item.id">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="抽查人员" :label-width="formLabelWidth">
                  <el-select v-model="form.spot" multiple collapse-tags class="item_date addbernum" placeholder="请选择">
                    <el-option v-for="(item,index) in cities2" :key="index" :label="item.label" :value="item.id">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="计划开始" :label-width="formLabelWidth">
                  <el-date-picker class="item_date" v-model="form.startDate" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="计划完成" :label-width="formLabelWidth">
                  <el-date-picker class="item_date" v-model="form.endDate" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-form>
              <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">
                <button style="margin-right:20px;" @click="importVisable=false">关闭</button>
                <button @click="saveImportData()">保存</button>
              </div>
            </div>
          </div>
        </div>
      </div> -->

        <div v-if="isUpLoadingShow">
            <div  class="add-part-box" style="z-index:98" @click.stop.prevent="cancelLoading" ></div>
                <div class="add-part" style="height:270px;z-index:99">
                <p style="margin-bottom:10px;">上传文件</p>
                <a :href="tempFileUrl" style="text-decoration: none;"><p style="margin-bottom:10px;font-size:14px;color:#44d2ff;text-align:center">文件模板下载</p></a>
                <uploading v-model="uploadingName"   :config="uploadConfig" ref="uploading" ></uploading>
                <div style="float:right;padding-top:10px;position:absolute;bottom:20px;right: 20px;">
                    <button style="margin-right:20px;" @click.stop.prevent="cancelLoading">关闭</button>
                    <button @click.stop.prevent="saveFill">保存</button>
                </div>
                </div>
            </div>
    </div>
</template>
<script>
import uploading from '../common/uploading.vue'
import XLSX from "xlsx";
import gantt from './gantt.vue'
export default {
    data() {
        return {
            tempFileUrl:"",//下载模板url地址
            importVisable:false,
            formLabelWidth:"90px",
            form:{},
            cities:[],
            uploadConfig:{
                limit: 1,
                limitSize: 50048576,
                readOnly: false,
                xtype: "test",
                accept: ".xml",
                acceptMsg:'只能上传.xml文件',
            },
            uploadingName:'',
            scheduleUid:'',
            scheduleNode:{},
            projUid:'',
            isUpLoadingShow:false,//任务添加窗口
            taskDialogVisible:false,//任务添加窗口
            taskInfo:{
                uid:'',
                id:null,
                text:'',
                planStartDate:'',
                planEndDate:'',
                planDuration:'',
                start_date:'',
                end_date:'',
                duration:'',
                progress:'',
                assigne:'',
                parent:''
            },
            tasks:{
                data:[
                    // {uid:'1',id: 1, text: 'Task #1', actStartDate: '2019-01-01', start_date: '02-01-2019', duration: 3, progress: 0.6},
                    // {uid:'1-1',id: 2, text: 'Task #1-1', start_date: '13-02-2019', duration: 2, progress: 0.4, parent:1},
                    // {uid:'1-2',id: 3, text: 'Task #1-2', start_date: '16-02-2019', duration: 2, progress: 1, parent:1},
                    // {uid:'1-3',id: 4, text: 'Task #1-3', start_date: '18-02-2019', duration: 2, progress: 0, parent:1},
                    // {uid:'1-4',id: 5, text: 'Task #1-4', start_date: '22-02-2019', duration: 4, progress: 0, parent:1},
                    // {uid:'2',id: 6, text: 'Task #2', start_date: '01-01-2019', duration: 3, progress: 0.6},
                    // {uid:'2-1',id: 7, text: 'Task #2-1', start_date: '13-02-2019', duration: 2, progress: 0.4, parent:6},
                    // {uid:'2-2',id: 8, text: 'Task #2-2', start_date: '16-02-2019', duration: 2, progress: 1, parent:6},
                    // {uid:'2-3',id: 9, text: 'Task #2-3', start_date: '18-02-2019', duration: 2, progress: 0, parent:6},
                    // {uid:'2-4',id: 10, text: 'Task #2-4', start_date: new Date('2019-01-04'), duration: 4, progress: 0, parent:6},
                    // {uid:'33',id: '33', text: 'Task #3', start_date: new Date('2019-01-04'), duration: 4, progress: 0},
                    // {uid:'33-1',id: '33-1', text: 'Task #3-1', start_date: new Date('2019-01-04'), duration: 4, progress: 0, parent:'33'}
                ],
                links:[
                    // {uid:'l-1',id: '1', source: 1, target: 2, type: '0'},
                    // {uid:'l-2',id: '2ww', source: 2, target: 3, type: '1'},
                    // {uid:'l-3',id: 3, source: 3, target: 4, type: '2'},
                    // {uid:'l-4',id: 4, source: 4, target: 5, type: '3'}
                ],
            },
            activeStr:'首页',
            deleteObj:{dialogVisible:false},
            addPartObj:{},
            changePartObj:{},
            isChangePart:false,
            isAddPart:false,
            maxVersion:1,//最大版本号
            progressList:[]
        }
    },
    components:{
        gantt,uploading
    },
    created() {
        this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.loadData()
    },
    watch:{
        '$store.state.selectProjectObj.id':function(val,oldVal){
            this.loadData()
        },
        'addPartObj.progress':function(val,oldVal){
           if(oldVal!=undefined){
                val=String(val)
            if(((Number(val)<100||Number(val)==100)&&Number(val)>0&&(val.indexOf('.')==-1||val.split('.')[1].length<3))||val==''){
                this.addPartObj.progress=val
            }else{
                this.addPartObj.progress=oldVal
            }
           }
        }
    },

    methods: {
        ProjImport(str){
            if(str=='xml'){
                this.tempFileUrl=`${this.util.getBaseUrl()}/static/Project.xml`;
                this.uploadConfig.acceptMsg='只能上传.xml文件';
                this.uploadConfig.accept='.xml,.mpp';
                this.uploadConfig.xtype='test';
            }else if(str=='excel'){
                // this.tempFileUrl="http://qy.zhuzhu.biz/gdb/static/gantt_import.xlsx";
                this.tempFileUrl=`${this.util.getBaseUrl()}/static/gantt_import.xlsx`;
                this.uploadConfig.acceptMsg='只能上传.xls或.xlsx文件';
                this.uploadConfig.accept='.xls,.xlsx';
                this.uploadConfig.xtype='test1';
            }
            this.isUpLoadingShow=true;
        },
        // uploadTextExcel(e){
        //     if(e){
        //         let files = e.target.files[0];
        //         if (files.name.split(".")[1] != "xls" &&files.name.split(".")[1] != "xlsx") {
        //             this.util.error('请上传".xls"或".xlsx"文件格式的文件')
        //             return;
        //         }
        //         var fileReader = new FileReader();
        //         console.log(fileReader)
        //          var reader = new FileReader();
        //         reader.onload = function (e) {
        //             var data = e.target.result;
        //             var wb = XLSX.read(data, { type: "binary" });
        //             console.log(wb);
        //         };
        //         reader.readAsBinaryString(files);
        //     }
        // },
        saveFill(){
            var fileId=this.uploadConfig.filesList[0].id+'.'+this.uploadConfig.filesList[0].suffix
            this.isUpLoadingShow=false
            if(this.uploadConfig.filesList[0].suffix=='xml'){
                var url='/api_v1/business/progress/importXmlTasks'
            // var fileId=this.uploadConfig.filesList[0].id+'.'+this.uploadConfig.filesList[0].suffix
            }else{
                var url='/api_v1/business/progress/importExcelTasks'
            // var fileId=this.uploadConfig.filesList[0].id
            }
            var param={
                fileId:fileId,
                projUid:this.$store.state.selectProjectObj.id,
                scheduleUid:this.scheduleUid,
            }
            this.util.mask("正在导入..");
            this.util.restGet(url,param,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.$refs.gantt.loadData(this.scheduleUid)
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        cancelLoading(){
            this.isUpLoadingShow=false
        },
        save(){
            this.$refs.gantt.saveData();
        },
        back(returnType){
            // this.activeStr='首页'
            var ifnotData =this.$refs.gantt.callBack();
            if(ifnotData||returnType){
                this.activeStr='首页'
            }else{
                this.util.confirm("数据尚未保存，是否放弃修改?","提示",(res)=>{
                    this.activeStr='首页'
                });
            }
            
            
        },
        deleteProress(node){
            this.deleteObj.obj=node;
            this.deleteObj.dialogVisible=true;
            this.deleteObj.deleteMsg='删除进度！';
        },
        deleteProj(){
            this.util.restDelete('/api_v1/business/progress/'+this.deleteObj.obj.id,null,(res)=>{
                if(res.status==200){
                    this.deleteObj.dialogVisible=false;
                    this.deleteObj.obj={}
                    this.util.success('删除成功！！');
                    this.loadData();
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        saveMsgChange(){
            if(!this.changePartObj.adjustReason){
                this.util.warn("请填写调整原因!");
                return;
            }
            var data={
                projUid:this.$store.state.selectProjectObj.id,
                id:this.changePartObj.node.id,
                parentId:this.changePartObj.node.id,
                version:this.changePartObj.New_VERSIONS_,
                adjustReason:this.changePartObj.adjustReason,
                startDate:this.changePartObj.node.startDate,
                endDate:this.changePartObj.node.endDate,
                duration:this.changePartObj.node.duration? this.changePartObj.node.duration:0,
                actStartDate:this.changePartObj.node.actStartDate,
                actEndDate:this.changePartObj.node.actEndDate,
                actDuration:this.changePartObj.node.actDuration? this.changePartObj.node.actDuration:0,
                progress:this.changePartObj.node.progress,
                enable:this.changePartObj.node.enable,
                title:this.changePartObj.node.title,
                remark:'',
            }
            this.util.mask("正在变更..");
            this.util.restPut('/api_v1/business/progress/updateProgressVersions',data,(res)=>{
                this.util.unmask()
                if(res.status==200){
                    this.cancelChange()
                    this.util.success('调整计划成功！！')
                    this.loadData()
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        setProress(node){
            this.addPartObj=node
            this.isAddPart=true
            // var params={
            //     id:node.id,
            // }
            //  this.util.restGet('/api_v1/business/progress/getProgressById',params,(res)=>{
            //     if(res.status==200){
            //         res.data.enable==1?res.data.ifShow=true:res.data.ifShow=false;
            //         this.addPartObj=res.data
            //         this.isAddPart=true
            //     }else{
            //         this.util.error(res.errorMsg)
            //     }
            // })
        },
        cancelChange(){
            this.changePartObj={};
            this.isChangePart=false;
        },
        changeVersions(node){
            this.changePartObj.Old_VERSIONS_=node.version
            this.changePartObj.New_VERSIONS_=node.version-0+1
            this.changePartObj.node=node
            this.isChangePart=true;
        },
        proressDetails(node){
            this.activeStr='进度'
            console.info("------打开甘特图------");
            // this.$nextTick(()=>{
            //     this.$refs.upload.$el.querySelector('.uploading-excel .el-upload__input').setAttribute("accept", ".xlsx, .xls")
            //     this.$refs.upload.$el.querySelector('.uploading-excel .el-upload__input').addEventListener('change', e => {
            //         this.uploadTextExcel(e);
            //     })
            // })

            //console.info(node);
            this.scheduleUid = node.id;
            this.scheduleNode = node;
            this.projUid = node.projUid;
        },
        changePlan(){

            if(!this.addPartObj.startDate||!this.addPartObj.endDate){
                this.addPartObj.duration=''
            }else{
                let data1=new Date(this.addPartObj.startDate)
                let data2=new Date(this.addPartObj.endDate)
                let iDays= Date.parse(data2)-Date.parse(data1)
                let Daynum=Math.floor(iDays / (24 * 3600 * 1000))
                this.$forceUpdate()
                if(Daynum<0){
                    this.util.error('请选择正确的计划开工时间与计划完工时间')
                }
                this.addPartObj.duration=Daynum;
            }
        },
        changePrac(){
            if(!this.addPartObj.actStartDate||!this.addPartObj.actEndDate){
                this.addPartObj.actDuration=''
            }else{
                let data1=new Date(this.addPartObj.actStartDate)
                let data2=new Date(this.addPartObj.actEndDate)
                let iDays= Date.parse(data2)-Date.parse(data1)
                let Daynum=Math.floor(iDays / (24 * 3600 * 1000))
                this.$forceUpdate()
                if(Daynum<0){
                    this.util.error('请选择正确的开工时间与完工时间')
                }
                this.addPartObj.actDuration=Daynum;
            }
            // this.addPartObj.actStartDate=this.addPartObj.actStartDate?this.addPartObj.actStartDate:''
            // this.addPartObj.actEndDate=this.addPartObj.actEndDate?this.addPartObj.actEndDate:''
        },
        saveMsg(){
            if(!this.validUtil.isNotEmpty(this.addPartObj.title)){
                this.util.error('请填写标题')
                return;
            }
          
            // if(this.addPartObj.duration<0){
            //     this.util.error('请选择正确的计划开工时间与计划竣工时间')
            //     return;
            // }
            // if(this.addPartObj.actDuration<0){
            //     this.util.error('请选择正确的实际开工时间与实际竣工时间')
            //     return;
            // }

            var mainData={};
            // mainData.TITLE_='V'+this.addPartObj.version
            mainData.TITLE_=this.addPartObj.title
            mainData.ENABLE_=this.addPartObj.ifShow?1:0
            mainData.START_DATE_=this.addPartObj.startDate
            mainData.END_DATE_=this.addPartObj.endDate
            mainData.ACT_START_DATE_=this.addPartObj.actStartDate;
            mainData.ACT_END_DATE_=this.addPartObj.actEndDate
            
            mainData.DURATION_=this.addPartObj.duration
            mainData.ACT_DURATION_=this.addPartObj.actDuration
            mainData.VERSION_=this.addPartObj.version
            mainData.PROGRESS_ =this.addPartObj.progress
            mainData.PROJ_UID_=this.$store.state.selectProjectObj.id

            var params = {mainFormData:JSON.stringify(mainData),sqlTableName:'GA_SCHEDULE',ifSaveWorkflow:false};
            if(this.validUtil.isNotEmpty(this.addPartObj.id)){
                params['id']=this.addPartObj.id;
                params['businessKey']=this.addPartObj.id;
            }
            if(mainData.ENABLE_==1){
                var id=this.addPartObj.id?this.addPartObj.id:''
                this.util.restPost("/api_v1/business/progress/updateScheduleStatus?projUid="+this.$store.state.selectProjectObj.id+'&id='+id,null,(res)=>{
                    if(res.status==200){
                        this.saveData(params);
                    }else{
                        this.util.error(res.errorMsg)
                    }
                });
            }else{
                this.saveData(params);
            }

        },
        saveData(params){
            this.util.mask("正在保存...");
              this.util.restPost("/api_v1/form/business",params,(res)=>{
                  this.util.unmask()
                if(res.status==200){
                    this.cancel()
                    this.util.success('保存成功');
                    this.loadData();
                }else{
                    this.util.error(res.errorMsg)
                }
                this.util.unmask();
            });
        },
        loadData(){
            // /api_v1siness/progressarchProgressList
                let params={
                    projUid:this.$store.state.selectProjectObj.id,
                    pageSize:10,
                    pageIndex:1,
                    search:''
                }
                var _this = this;
                this.util.restGet('/api_v1/business/progress/searchProgressList',params,(res)=>{
                if(res.status==200){
                    if(res.data&&res.data.length>0){
                        for (let i = 0; i < res.data.length; i++) {
                            res.data[i].enable==1?res.data[i].ifShow=true:res.data[i].ifShow=false;
                            //res.data[i].ifShow=true;
                        }
                        // res.data.forEach(item=>{
                        //     item.duration = this.getDuration(item.startDate,item.endDate);
                        //     item.actDuration = this.getDuration(item.actStartDate,item.actEndDate);
                        // });
                        this.progressList = res.data;
                        
                        var versionList = this.progressList.map(item=>item.version);
                        this.maxVersion = Math.max.apply(null, versionList);
                    }else{
                        this.progressList = [];
                    }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        getDuration(startDate,endDate){
            if(!startDate||!endDate){
                return "";
            }else{
                let data1=new Date(startDate)
                let data2=new Date(endDate)
                let iDays= Date.parse(data2)-Date.parse(data1)
                let Daynum=Math.floor(iDays / (24 * 3600 * 1000))
                return Daynum;
            }
        },
        addProgress(){
            if(this.progressList.length>0){
                this.util.error("本项目已创建进度计划，如需做计划调整，请点击【调整】按钮!");
                return;
            }
            this.addPartObj={};
            this.addPartObj.version=1;
            this.isAddPart=true;
        },
        cancel(){
            this.addPartObj={};
            this.isAddPart=false;
        },
        importTemp(){
            // this.$refs.gantt.importTempVisable = true;
            this.$refs.gantt.insertTemplate();
        },
        batchImport(){
            
            this.$refs.gantt.batchSetVisable = true;
            this.$refs.gantt.clearTreeSelect();

        },
        addTask(){
            this.$refs.gantt.addTask();
            // this.$refs.gantt.taskDialogVisible = true;

        },
        deleteTask(){
            this.$refs.gantt.deleteTask();
        },
        saveTask(){
            var gantt = this.$refs.gantt.getGantt();
            console.info(this.currentTask);
            this.taskDialogVisible = false;
            var task = this.taskInfo;
            console.info(task);
            var taskId = task.id;
            //判断是否新增
            if(this.validUtil.isNotEmpty(task.uid)){
                console.info("========修改======="+task.id);
                //说明是修改
                var old = gantt.getTask(taskId);
                for(var key in task){
                    old[key] = task[key];
                }
                gantt.updateTask(taskId);
            }else{
                //说明是新增
                console.info("========新增======="+task.id);
                task.uid = task.id;
                gantt.addTask(task,task.parent);
            }
        }
    },
}
</script>
<style scoped>
@import url('../../public/css/dhtmlxgantt.css');
.tabs-box1 button{
    float: left;
}
.proress-box{
    overflow:hidden;
}
.proress{
    width:33.3333333%;float:left;padding-right:10px;
    box-sizing: border-box;
}
.proress-box .proress:nth-child(3n){
    padding-right:0px;
}
.proress-body{
    text-align: left
}
.proress-body p{
    padding: 2px 0;
    overflow: hidden;
}
.proress-body p span:first-child{
    float: left;
    width: 70px;
}
.select-msg-box{
    color: #333;
    line-height: 38px;
    height: 38px;
    margin: 20px 0;
    position: relative;
}

.select-msg-ele{
    line-height: 38px;
    height: 38px;
    color: #333;
    width: 223px;
    border: 1px solid #ccc;
    border-radius: 1px ;
    box-sizing: border-box;
}
.tabs-box button{
    margin-right: 10px;margin-top: 5px;
}
.wd50{
    width: 33%;
    float: left;
}
.wd50 span{
    float:left;
    width:60px;
}
</style>
<style>
.batch-set .el-dialog__body {
    padding: 0px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
}
</style>

