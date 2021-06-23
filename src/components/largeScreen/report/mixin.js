// 首页与环境监测共同js
export const operationMixin = {
    data() {
        return {
            tabList:[
                {name:"质量中心",value:"quality",menu:"050101"},
                {name:"安全中心",value:"safety",menu:"050102"},
                {name:"工序中心",value:"procedure",menu:"050103"},
                {name:"实测实量",value:"measure",menu:"050104"},
                {name:"任务跟进",value:"conferenceTask",menu:"050105"},
                {name:"问题检查项分布",value:"checkItem",menu:"050106"},
                {name:"问题楼栋分布",value:"recordArea",menu:"050106"},
                {name:"应用统计",value:"application",menu:"050107"},
                {name:"项目应用",value:"projApp",menu:"050107"},
                {name:"项目进度明细",value:"leaseReport",menu:"050107"},
                {name:"项目进度汇总",value:"leaseProgress",menu:"050107"},
            ],
            partList:[],//项目区域集合
            projLists:[],//项目检查项集合
            taskList:[],//会议任务数据
            taskStatus: "1",
            taskProjUid:"",
            taskSearch:"",//搜索
            taskTotalCount:0,
            taskPageIndex:1,
            checkItemList:[],//问题检查项
            measureList:[],//实测实量数据
            measureSearchDate:null,
            measureProjUid:null,
            measureTotalCount:0,
            measurePageIndex:1,
            checkTypeFlag:"",
            checkItemTotalCount:0,//问题检查项总数
            checkItemPageIndex:1,
            areaProblemList:[],
            areaTotalCount:0,
            areaPageIndex:1,
            areaCheckType:"",//检查类型
            pageIndex:1,
            pageSize:10,
            totalCount:0,
            dialogTableVisible:false,
            projAreaItemList:[],
            areaProj:{},
            projCheckType:"",
            projYeTai:"",
            applicationList:[], //应用统计
            projAppList:[],//项目应用
            moduleName:"",//模块名称
            moduleDataList:[],//模块数据
            pojectDataList:[],//项目数据
            projPageIndex:1,//项目详情分页
            projPageSize:15,
            projTotalCount:0,
        }
    },
    mounted() {
        this.loadProjData();
    },
    methods: {
        changeProjCheckType(value){
            this.projCheckType=value;
            this.showProjAreaReport();
        },
        changeProjYetai(value){
            this.projYeTai=value;
            this.showProjAreaReport();
        },
        showProjAreaReport(item){
            if(item){
                this.areaProj=item;
                this.dialogTableVisible=true;
            }
            let params ={
                projUid:this.areaProj.id,
                checkType:this.projCheckType,
                yeTai:this.projYeTai,
                pageSize:this.pageSize,
                pageIndex:this.taskPageIndex,
            }
            this.util.mask();
            this.util.restGet('/api_v1/modules/statistics/projAreaReport', params,(res)=>{
                this.util.unmask();
                if(res.status == 200&&res.data){
                   this.projAreaItemList = res.data;
                   
                }else{
                    this.projAreaItemList=[];
                }
            })
        },
        changeReport(item){
            let value = item.value;
            this.activeReport=value;
            this.activeName=item.name;
            if(value=="measure"){
                this.getMeasureNumCollect();
                if(this.measureProjUid){
                    this.getParData(value)
                }
                
            }else if(value=="conferenceTask"){
                this.getTaskCollect();
            }else if(value=="checkItem"){
                this.getCheckItemCollect();
            }else if(value=="recordArea"){
                this.getAreaProblemCollect();
            }else if(value=="application"){
                this.getApplication();
            }else if(value=="projApp"){
                // this.getProjAppInfo();
            }else{
                this.pageIndex=1;
                this.getCheckNumCollect();
            }
        },
        goBack(){
            if(this.moduleName.projName){
                this.moduleName.projName =null;
            }else{
                this.activeReport='application';
            }
            
        },
        changeProjPageNum(value){
            this.projPageIndex=value;
            this.showProjecDet();
        },
        //查看项目详情
        showProjecDet(node){
            if(node){
                this.columnList = this.moduleName.columnList;
                this.$set(this.moduleName,'projName',node.projName);
                this.projUid = node.projUid;
            }
            this.util.mask();
            let params ={
                tableName:this.moduleName.table,
                param:this.moduleName.param,
                projUid:this.projUid,
                columnName:this.columnList.map(item=>item.field).join(","),
                pageIndex:this.projPageIndex,
                pageSize:this.projPageSize
            }
            this.util.restGet('/api_v1/modules/statistics/projStatistics', params,(res)=>{
                this.util.unmask();
                if(res.status == 200&&res.data){
                   
                   this.pojectDataList = res.data;
                   this.projTotalCount = res.totalCount;
                }else{
                    this.pojectDataList=[];
                    this.projTotalCount=0;
                }
            })
        },
        //查看应用详情
        showApplication(node){
            if(node.name=="项目登记"){
                this.util.error("项目登记不支持查看明细!");
                return;
            }
            this.moduleName = node;
            this.activeReport='moduleInfo';
            this.util.mask();
            let params ={
                tableName:node.table,
                param:node.param,
                pageIndex:1,
                pageSize:100
            }
            this.util.restGet('/api_v1/modules/statistics/application', params,(res)=>{
                this.util.unmask();
                if(res.status == 200&&res.data){
                   
                   this.moduleDataList = res.data;
                }else{
                    this.moduleDataList=[];
                }
            })
        },
        getApplication(){
            this.util.mask();
            this.util.restGet('/api_v1/modules/statistics/applications', null,(res)=>{
                this.util.unmask();
                if(res.status == 200&&res.data){
                   let data = res.data;
                   let dataList = [];
                   dataList.push({table:"wx_project",name:"项目登记",totalNum:data.projNum,weekNum:data.projWeekNum});
                   dataList.push({table:"T_NEWS",name:"新闻公告",totalNum:data.newsNum,weekNum:data.newsWeekNum,
                        columnList:[
                            {field:'SUBJECT_',name:'标题'},
                            {field:'CONTENT_',name:'内容'},
                        ]
                    });
                   dataList.push({table:"T_WORK_PART",name:"楼栋管理",totalNum:data.partsNum,weekNum:data.partsWeekNum,
                        columnList:[
                            {field:'NAME_',name:'部位名称'},
                            {field:'CODE_',name:'编码'},
                        ]
                    });
                   dataList.push({table:"T_DRAWING",name:"楼栋图纸",totalNum:data.drawingNum,weekNum:data.drawingWeekNum,
                        columnList:[
                            {field:'NAME_',name:'图纸名称'},
                            {field:'CODE_',name:'图纸编号'},
                            {field:'PART_NAME_',name:'部位'},
                        ]
                    });
                   dataList.push({table:"WX_WORK_LOG",name:"项目日报",totalNum:data.dailyNum,weekNum:data.dailyWeekNum,
                        columnList:[
                            {field:'SUBJECT_',name:'标题'},
                            {field:'WORK_CONDITION_',name:'当日工作情况'},
                            {field:'ALTERATION_CONDITION_',name:'变更情况'},
                            {field:'ISSUE_ANNOUNCE_',name:'问题披露'},
                        ]
                    });
                   dataList.push({table:"WX_WORK_REPORT",name:"项目周月报",totalNum:data.reportNum,weekNum:data.reportWeekNum,
                        columnList:[
                            {field:'TYPE_',name:'类型'},
                            {field:'TITLE_',name:'标题'},
                            {field:'WORK_PLAN_',name:'工作计划'},
                            {field:'WORK_RECORD_',name:'工作记录'},
                            {field:'WORK_SUMMARY_',name:'工作总结'},
                        ]
                    });
                   dataList.push({table:"T_MEETING",name:"会议纪要",totalNum:data.meetingNum,weekNum:data.meetingWeekNum,
                        columnList:[
                            {field:'TITLE_',name:'会议主题'},
                            {field:'CONTENT_',name:'会议内容'},
                            {field:'START_DATE_',name:'会议开始时间'},
                            {field:'END_DATE_',name:'会议结束时间'},
                            {field:'SUMMARY_',name:'会议纪要'},
                        ]
                    });
                   dataList.push({table:"wx_work_order",name:"会议任务",totalNum:data.meetingTaskNum,weekNum:data.meetingTaskWeekNum,
                        columnList:[
                            {field:'SUBJECT_',name:'任务主题'},
                            {field:'CONTENT_',name:'任务描述'},
                            {field:'START_TIME_',name:'开始时间'},
                            {field:'END_TIME_',name:'结束时间'},
                            {field:'PRIORITY_',name:'优先级'},
                        ]
                    });
                   dataList.push({table:"T_FILE",name:"工程文档上传",totalNum:data.fileNum,weekNum:data.fileWeekNum,
                        columnList:[
                            {field:'FILE_NAME_',name:'文件名称'},
                            {field:'FILE_CODE_',name:'文件编码'},
                        ]
                    });
                   dataList.push({table:"ga_task",name:"进度计划",totalNum:data.gaTaskNum,weekNum:data.gaTaskWeekNum,
                        columnList:[
                            {field:'TEXT_',name:'任务名称'},
                            {field:'CODE_',name:'任务编码'},
                            {field:'START_DATE_',name:'计划开始时间'},
                            {field:'END_DATE_',name:'计划结束时间'},
                            {field:'PROGRESS_',name:'进度'},
                        ]
                    });
                   dataList.push({table:"ga_task_record",name:"进度上报",totalNum:data.taskReportNum,weekNum:data.taskReportWeekNum});
                   dataList.push({table:"t_inspection_plan",param:'quality',name:"质量计划",totalNum:data.inspectionPlanNum,weekNum:data.inspectionPlanWeekNum,
                        columnList:[
                            {field:'SUBJECT_',name:'计划名称'},
                            {field:'START_DATE_',name:'开始日期'},
                            {field:'END_DATE_',name:'结束日期'},
                            {field:'TYPE_',name:'类型'},
                        ]
                    });
                   dataList.push({table:"t_inspect_record",param:'quality',name:"质量检查",totalNum:data.qualityNum,weekNum:data.qualityWeekNum,
                        columnList:[
                            {field:'INSPECT_ITEM_NAME_',name:'检查项'},
                            {field:'INSPECT_PART_NAME_',name:'检查部位'},
                            {field:'DESC_',name:'描述'},
                            {field:'RECTIFY_DEADLINE_',name:'整改期限'},
                        ]
                    });
                   dataList.push({table:"t_inspect_record",param:'safety',name:"安全检查",totalNum:data.safetyNum,weekNum:data.safetyWeekNum,
                        columnList:[
                            {field:'INSPECT_ITEM_NAME_',name:'检查项'},
                            {field:'INSPECT_PART_NAME_',name:'检查部位'},
                            {field:'DESC_',name:'描述'},
                            {field:'RECTIFY_DEADLINE_',name:'整改期限'},
                        ]
                    });
                   dataList.push({table:"T_PROCESS_CHECKOUT",name:"工序检验批",totalNum:data.checkoutNum,weekNum:data.checkoutWeekNum,
                        columnList:[
                            {field:'NAME_',name:'检验批名称'},
                            {field:'AREA_FULL_NAME_',name:'区域名称'},
                            {field:'REMARK_',name:'说明'},
                        ]
                    });
                   dataList.push({table:"t_process_task",name:"工序任务",totalNum:data.processTaskNum,weekNum:data.processTaskWeekNum,
                        columnList:[
                            {field:'AREA_FULL_NAME_',name:'区域名称'},
                            {field:'CHECKOUT_NAME_',name:'检验批名称'},
                            {field:'PROCESS_NAME_',name:'工序名称'},
                        ]
                    });
                   dataList.push({table:"t_process_task",param:'finish',name:"工序报验",totalNum:data.processTaskFinshNum,weekNum:data.processTaskFinshWeekNum,
                        columnList:[
                            {field:'AREA_FULL_NAME_',name:'区域名称'},
                            {field:'CHECKOUT_NAME_',name:'检验批名称'},
                            {field:'PROCESS_NAME_',name:'工序名称'},
                        ]
                    });
                   dataList.push({table:"t_inspect_record",param:'procedure',name:"工序检查",totalNum:data.procedureNum,weekNum:data.procedureWeekNum,
                        columnList:[
                            {field:'INSPECT_ITEM_NAME_',name:'检查项'},
                            {field:'INSPECT_PART_NAME_',name:'检查部位'},
                            {field:'DESC_',name:'描述'},
                            {field:'RECTIFY_DEADLINE_',name:'整改期限'},
                        ]
                    });
                   dataList.push({table:"t_inspection_plan",param:'measure',name:"实测计划",totalNum:data.measurePlanNum,weekNum:data.measurePlanWeekNum,
                        columnList:[
                            {field:'SUBJECT_',name:'计划名称'},
                            {field:'START_DATE_',name:'开始日期'},
                            {field:'END_DATE_',name:'结束日期'},
                            {field:'TYPE_',name:'类型'},
                        ]
                    });
                   dataList.push({table:"t_inspect_record",param:'measure',name:"实测检查",totalNum:data.measureNum,weekNum:data.measureWeekNum,
                        columnList:[
                            {field:'INSPECT_ITEM_NAME_',name:'检查项'},
                            {field:'INSPECT_PART_NAME_',name:'检查部位'},
                            {field:'DESC_',name:'描述'},
                            {field:'RECTIFY_DEADLINE_',name:'整改期限'},
                        ]
                    });
                   dataList.push({table:"t_inspect_record",param:'measureValue',name:"实测测量值",totalNum:data.measureValueNum,weekNum:data.measureValueWeekNum,
                        columnList:[
                            {field:'INSPECT_ITEM_NAME_',name:'检查项'},
                            {field:'INSPECT_PART_NAME_',name:'检查部位'},
                            {field:'MEASURE_VALUE_',name:'实测值'},
                            {field:'DESIGN_VALUE_',name:'设计值'},
                        ]    
                    });
                   dataList.push({table:"t_ims_purchase_order",name:"物料合同",totalNum:data.materialNum,weekNum:data.materialWeekNum,
                        columnList:[
                            {field:'CODE_',name:'单据编码'},
                            {field:'SUBJECT_',name:'单据名称'},
                            {field:'CONTRACT_NAME_',name:'合同名称'},
                            {field:'TAX_MONEY_',name:'金额'},
                        ]    
                    });
                   dataList.push({table:"t_ims_in_store",name:"物料验收入库",totalNum:data.inStoreNum,weekNum:data.inStoreWeekNum,
                        columnList:[
                            {field:'CODE_',name:'单据编码'},
                            {field:'SUBJECT_',name:'单据名称'},
                            {field:'CONTRACT_NAME_',name:'合同名称'},
                            {field:'SUPPLIER_NAME_',name:'供应商'},
                        ]
                    });
                   dataList.push({table:"t_contactsheet",name:"工作联系单",totalNum:data.contactsheetNum,weekNum:data.contactsheetWeekNum,
                        columnList:[
                            {field:'APPLY_PERSON_',name:'申请人'},
                            {field:'APPLY_DEPART_',name:'申请部门'},
                            {field:'REASONS_',name:'事由'},
                            {field:'CONTENT_',name:'内容'},
                            {field:'SPYJ_',name:'审批意见'},
                        ]    
                    });
                   this.applicationList = dataList;
                }else{
                    this.applicationList=[];
                }
            })
        },
        loadProjData(){
            let params={
                pageSize:1000,
                pageIndex:1,
            }
            this.util.restGet('/api_v1/business/project/searchProjectList',params,(res)=>{
                  if(res.status==200&&res.data){
                    this.projLists=res.data;
                  }else{
                    this.projLists=[]
                  }
              })
        },
        changeTaskStatus(value){
            this.taskPageIndex=1;
            this.taskStatus=value;
            this.getTaskCollect();
        },
        changeTaskPage(value){//分页
            this.taskPageIndex = value;
            this.getTaskCollect();
        },
        // 获取会议任务数据
        getTaskCollect(){
            let params ={
                projUid:this.taskProjUid,
                taskStatus:this.taskStatus,
                search:this.taskSearch,
                pageSize:this.pageSize,
                pageIndex:this.taskPageIndex,
            }
            this.util.restGet('/api_v1/modules/statistics/taskCollect', params,(res)=>{
                this.taskTotalCount =res.totalCount;
                if(res.status == 200&&res.data){
                    res.data.forEach(item=>{
                        if(item.feedBackCount>0&&item.statusVal==1){
                            item.statusName = "已执行(结束)";
                            item.actFinishDate=item.updateDate;
                        }else if(item.feedBackCount>0&&item.statusVal!=1){
                            item.statusName = "已执行(执行中)"
                        }else{
                            item.statusName = "未执行"
                        }
                    });
                   this.taskList = res.data;
                   
                }else{
                    this.taskList=[];
                }
            })
        },
        changeCheckType(value){
            this.checkTypeFlag = value;
            this.getCheckItemCollect();
        },
        changeCheckItemPage(value){
            this.checkItemPageIndex= value;
            this.getCheckItemCollect();
        },
        // 获取问题检查项统计报表
        getCheckItemCollect() {
            let params ={
                checkType:this.checkTypeFlag,
                pageSize:this.pageSize,
                pageIndex:this.checkItemPageIndex
            }
            this.util.restGet('/api_v1/modules/statistics/checkItemCollect', params,(res)=>{
                this.checkItemTotalCount = res.totalCount;
                if(res.status == 200&&res.data){
                    
                    this.checkItemList = res.data;
                   
                }else{
                    this.checkItemList=[];
                }
            })
        },
        getParData(checkType){//获取区域筛选数据
            let params ={
                projUid:this.measureProjUid,
                checkType:checkType 
            }
            this.util.restGet("/api_v1/construction/inspect/checkPartDatas",params,(res)=>{
                if(res.status==200&&res.data){
                    this.partList=res.data;

                }else{
                    this.partList=[];
                }

            });
        },
        // 获取检查名称
        initCheckTypeName(value) {
            //状态，0:记录，1:待指派，2:待修，3:待销项，4:已销项，5:超期完成，6:不通过
            if(value=="quality"){
                return "质量"
            }else if(value=="safety"){
                return "安全"
            }else if(value=="measure"){
                return "实测"
            }else if(value=="procedure"){
                return "工序"
            }
        },
        changeMeasurePage(value){//实测分页
            this.measurePageIndex=value;
            this.getMeasureNumCollect();
        },
        // 获取实测实量统计数据
        getMeasureNumCollect() {
            let params ={
                pageSize:this.pageSize,
                pageIndex:this.measurePageIndex,
                projUid:this.measureProjUid
            }
            if(this.measureSearchDate){
                params['startDate']=this.measureSearchDate[0];
                params['endDate']=this.measureSearchDate[1];
            }
            this.util.restGet('/api_v1/modules/statistics/measureNumCollect', params,(res)=>{
                this.measureTotalCount = res.totalCount;
                if(res.status == 200&&res.data){
                    res.data.forEach(item=>{
                        item.passPercent=(item.hadCheckNum==0? 0:(item.passNum*100/item.hadCheckNum).toFixed(2))+"%";
                        item.finishPercent=(item.problemNum==0? 0:(item.hasRectifyNum*100/item.problemNum).toFixed(2))+"%";
                    });
                    this.measureList = res.data;
                }else{
                    this.measureList={};
                }
            })
        },
        changeAreaCheckType(value){
            this.areaPageIndex=1;
            this.areaCheckType = value;
            this.getAreaProblemCollect();
        },
        changeAreaPage(value){//楼栋报表分页
            this.areaPageIndex=value;
            this.getAreaProblemCollect();
        },
        // 获取问题楼栋分布数据
        getAreaProblemCollect() {
            let params ={
                pageSize:this.pageSize,
                checkType:this.areaCheckType,
                pageIndex:this.areaPageIndex,
            }
            this.util.restGet('/api_v1/modules/statistics/areaProblemCollect', params,(res)=>{
                this.areaTotalCount = res.totalCount;
                if(res.status == 200&&res.data){
                    
                    this.areaProblemList = res.data;
                }else{
                    this.areaProblemList=[];
                }
            })
        },
        // 查询项目情况报表
        showProjReport(projInfo){
            projInfo.proName = projInfo.projName;
            this.$store.commit("projectName",projInfo.projName)
            this.cookieUtil.set('projectNode',JSON.stringify(projInfo));
            this.setFormConfig({formKey:'_session_proj' + this.sessionUtil.getUser().id, data:projInfo})
            window.localStorage.setItem('_session_proj' + this.sessionUtil.getUser().id, JSON.stringify(projInfo))
            this.cookieUtil.set('sessionProj', projInfo)
            this.$store.state.selectProjectObj=projInfo

            let pathUrl="/page/checkManage/checkProblem";
            if(this.activeReport=="safety"){
                pathUrl="/page/safetyCheck/checkProblem";
            }else if(this.activeReport=="procedure"){
                pathUrl="/page/ProcessManagement/Rectification";
            }else if(this.activeReport=="measure"){
                pathUrl="/page/measured/checkProblem";
            }
            let Logistics= this.$router.resolve({
                path:pathUrl,
                query:{
                    checkType:this.activeReport
                }
            })

            window.open(Logistics.href, '_blank');
        },
        // 地图走马灯
        changeCarousel(value){
            this.carouselIndex = value;
        }
    }
}