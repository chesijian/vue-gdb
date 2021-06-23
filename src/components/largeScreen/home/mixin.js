// 首页与环境监测共同js

// import MapCon from '../map/map.vue'

var timerNum = 0,
    scrollTimer = null;

export const operationMixin = {
    data() {
        return {
            distributionObj: {},
            distributionChartData:{},
            yeTaiScreen:false,//业态筛选
            yeTaiCheckType:"",
            projDistrList:[],//项目地图省份分布情况
            progressFlag:"percent",//进度指标
            mapSearch:"",//地图项目搜索
            progressDatas:[],//进度指标数据
            showProgressPagination:false,//进度分页
            checkItemFlag:"qualityCheckItem",//检查项分布指标
            showCheckItemPagination:false,//显示检查项分页
            safetyClassify:"",//安全
            showSafetyPagination:false,//显示安全指标分页
            showSafetyScreen:false, //显示安全筛选项
            showProcedureScreen:false,//工序
            procedureFlag:"percent",
            procedureClassify:"",
            procedureRanking:[],//工序指标数据列表
            procedurePageIndex:1,//工序分页页数
            procedureTotalCount:0,//工序
            showprocedurePagination:false,
            showmeasureScreen:false,//实测
            measureFlag:"percent",
            measureClassify:"",
            measureRanking:[],//实测指标数据列表
            measurePageIndex:1,//实测分页页数
            measureTotalCount:0,//实测
            showMeasurePagination:false,
            carouselIndex: 0,
            carouselHeight: 0,
            mapModel:{
                scheduleObj: {},
                showInfo: false,
                currentObj: {},
                callBack: this.showProjInfo
            },
            progressPageIndex:1,//累计进度
            progressPercentTotalCount:0,
            progressTotalCount:0,
            progressList:[],
            projConHeight: 0,
            rankList: [],
            rankData: [],
            pagesize: 10,
            popUpFlag: false,
            btnFlag: false,
        }
    },
    mounted() {
        this.$nextTick(()=> {
            // this.carouselHeight = this.$refs.projMiddleTop.offsetHeight;
            // this.projConHeight = this.$refs.projCon.offsetHeight;
            // this.onresize()
        });
    },
    methods: {
        currentChange(value,pageType){//分页
            if(pageType=='qualityCheckItem'){//质量检查项
                let pageNum = value=='prev'? this.qualityCheckItemPageIndex-1:this.qualityCheckItemPageIndex+1;
                if(pageNum >this.qualityCheckItemTotalCount||pageNum<1){
                    return;
                }
                this.qualityCheckItemPageIndex=pageNum;
                this.getCheckItemData("quality");
            }else if(pageType=='safetyCheckItem'){//安全检查项
                let pageNum = value=='prev'? this.safetyCheckItemPageIndex-1:this.safetyCheckItemPageIndex+1;
                if(pageNum >this.safetyCheckItemTotalCount||pageNum<1){
                    return;
                }
                this.safetyCheckItemPageIndex=pageNum;
                this.getCheckItemData("safety");
            }else if(pageType=='qualityIndicator'){//质量指标
                let pageNum = value=='prev'? this.qualityRankingPageIndex-1:this.qualityRankingPageIndex+1;
                if(pageNum >this.qualityRankingTotalCount||pageNum<1){
                    return;
                }
                this.qualityRankingPageIndex=pageNum;
                this.getCheckRanking("quality");
            }else if(pageType=='safetyIndicator'){//安全指标
                let pageNum = value=='prev'? this.safetyRankingPageIndex-1:this.safetyRankingPageIndex+1;
                if(pageNum >this.safetyRankingTotalCount||pageNum<1){
                    return;
                }
                this.safetyRankingPageIndex=pageNum;
                this.getCheckRanking("safety");
            }else if(pageType=='procedureIndicator'){//工序指标
                let pageNum = value=='prev'? this.procedurePageIndex-1:this.procedurePageIndex+1;
                if(pageNum >this.procedureTotalCount||pageNum<1){
                    return;
                }
                this.procedurePageIndex=pageNum;
                this.getCheckRanking("procedure");
            }else if(pageType=='measureIndicator'){//实测指标
                let pageNum = value=='prev'? this.measurePageIndex-1:this.measurePageIndex+1;
                if(pageNum >this.measureTotalCount||pageNum<1){
                    return;
                }
                this.measurePageIndex=pageNum;
                this.getCheckRanking("measure");
            }else if(pageType=='progressPercent'){//进度比例
                let pageNum = value=='prev'? this.pageIndex-1:this.pageIndex+1;
                if(pageNum >this.progressPercentTotalCount||pageNum<1){
                    return;
                }
                this.pageIndex=pageNum;
                this.getProgressData();
            }else if(pageType=='progress'){//进度
                let pageNum = value=='prev'? this.progressPageIndex-1:this.progressPageIndex+1;
                if(pageNum >this.progressTotalCount||pageNum<1){
                    return;
                }
                this.progressPageIndex=pageNum;
                this.getProgressListData();
            }
        },
        changeMeasureFlag(value){//切换实测指标选项
            this.measureFlag = value;
            this.measurePageIndex=1;
            this.getCheckRanking("measure");
        },
        changeProcedureFlag(value){//切换工序指标选项
            this.procedureFlag = value;
            this.procedurePageIndex=1;
            this.getCheckRanking("procedure");
        },
        changeSafetyFlag(value){//切换安全指标选项
            this.safetyFlag = value;
            this.safetyRankingPageIndex=1;
            this.getCheckRanking("safety");
        },
        changeQualityFlag(value){//切换质量指标选项
            this.qualityFlag = value;
            this.qualityRankingPageIndex=1;
            this.getCheckRanking("quality");
        },
        // 获取项目分布数据
        getData(){
            this.util.restGet('/api_v1/modules/statistics/projectDistribution', {pageIndex:0,pageSize:0},(res)=>{
                if(res.status == 200&&res.data){
                    //项目分布
                    this.distributionObj = res.data.projDistribution;
                    let purchaseNumList= this.distributionObj.purchaseNumList||[];
                    let leaseNumList= this.distributionObj.leaseNumList||[];
                    let rows = ['筹备','竣工','在建','停工'];
                    let dataList=[];
                    rows.forEach(item=>{
                        let purchaseObj = purchaseNumList.find(obj=>obj.STATUS_===item);
                        let leaseObj = leaseNumList.find(obj=>obj.STATUS_===item);
                        let purchaseNum =purchaseObj? purchaseObj.numCount:0;
                        let leaseNum =leaseObj? leaseObj.numCount:0;
                        let obj={
                            status:item,
                            '自购地':purchaseNum,
                            '租赁':leaseNum
                        }
                        dataList.push(obj);
                    });
                    this.distributionChartData={
                        columns: ['status', '自购地','租赁'],
                        rows: dataList
                    }
                    //项目地图分布
                    this.projDistrList = res.data.projDistr;
                    
                    
                }else{
                    this.distributionObj={};
                }
            })
        },
        changeProgressFlag(value){
            this.progressFlag = value;
            if(value=="progress"&&this.progressList.length==0){
                this.pageIndex=1;
                this.getProgressListData("quality");
            }else{
                this.getProgressData();
            }
        },
        // 获取进度指标比例数据
        getProgressData() {
            let params={
                // classify:this.progressClassify,
                orderType: this.progressFlag,
                pageSize:this.pageSize,
                pageIndex:this.pageIndex,
            }
            this.util.restGet('/api_v1/modules/statistics/projProgressRanking', params, (res)=>{
                this.progressPercentTotalCount = Math.ceil(res.totalCount/5);
                if(res.status == 200 && res.data){
                    this.progressDatas = res.data;
                }else{
                    this.progressDatas=[];
                }
            })
        },
        getProgressListData(){
            let params={
                classify:this.progressClassify,
                pageSize:this.pageSize,
                pageIndex:this.progressPageIndex,
            }
            this.util.restGet('/api_v1/modules/statistics/projProgress', params, (res)=>{
                this.progressTotalCount = Math.ceil(res.totalCount/5);
                if(res.status == 200 && res.data){
                    this.progressList = res.data;
                }else{
                    this.progressList=[];
                }
            })
        },
        // 展示地图信息
        showProjInfo(data){
            console.log("data===展示地图信息===>",data);
            if(data){
                this.mapModel.showInfo = true;
                this.mapModel.currentObj = data;
                this.util.restGet('/api_v1/business/project/projSchedule', {projUid:data.ID_}, (res)=>{
                    if(res.status==200&&res.data){
                        this.mapModel.scheduleObj = res.data;
                    }else{
                        this.mapModel.scheduleObj = {};
                    }
                });
            }
            
            
        },
        // 查看项目大屏
        showProject(data){
            let Logistics= this.$router.resolve({
                path:'/projLargeIndex/projLargeScreen',
                query:{
                    projUid:data.id
                }
            })
            window.open(Logistics.href, '_blank');
        }
    }
}