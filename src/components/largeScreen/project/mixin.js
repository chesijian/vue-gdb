// 首页与环境监测共同js

export const operationMixin = {
    data() {
        return {
            distributionObj: {},
            partList:[],//项目区域集合
            queryCheckItemList:[],//项目检查项集合
            areaValue:"",
            checkNumList:[],//问题统计数据
            problemFlag:"month",
            qualityNumObj:{},
            safetyNumObj:{},
            measureNumObj:{},
            procedureNumObj:{},
            totalNumObj:{},
            statusTotalCount:0,//楼栋总览状态总数
            statusList:[],
            checkStatus:"",//检查状态
            procedureCountObj:{},//工序数量统计对象
            measureCountObj:{},//实测数量统计对象
            carouselIndex: 0,
            carouselHeight: 0,
            mapModel:{
                positionArr: [],
                showInfo: false,
                currentObj: {},
                callBack: this.showMapInfo
            },
            projConHeight: 0,
            currentPage: 0,
            curPage: 1,
            pages: 0,
            rankList: [],
            rankData: [],
            pagesize: 10,
            popUpFlag: false,
            btnFlag: false,
        }
    },
    mounted() {
        
    },
    methods: {
        getParData(){//获取区域筛选数据
            let params ={
                projUid:this.projUid,
                checkType:this.areaFlag 
            }
            this.util.restGet("/api_v1/construction/inspect/checkPartDatas",params,(res)=>{
                if(res.status==200&&res.data){
                    this.partList=res.data;

                }else{
                    this.partList=[];
                }

            });
        },
        getRecordCheckItems(){//获取检查项筛选数据
            let params ={
                projUid:this.projUid,
                checkType:this.areaFlag 
            }
            this.util.restGet("/api_v1/construction/inspect/checkItems",params,(res)=>{
                if(res.status==200&&res.data){
                    this.queryCheckItemList=res.data;

                }else{
                    this.queryCheckItemList=[];
                }

            });
        },
        // 获取数据
        getCheckNumRanking(){
            
            let params ={
                projUid:this.projUid,
                dateType:this.problemFlag
            }
            this.util.restGet('/api_v1/modules/statistics/checkNumRanking', params,(res)=>{
                if(res.status == 200&&res.data){
                   this.checkNumList = res.data;
                   this.qualityNumObj = this.getCheckObj("quality");
                   this.safetyNumObj = this.getCheckObj("safety");
                   this.measureNumObj = this.getCheckObj("measure");
                   this.procedureNumObj = this.getCheckObj("procedure");
                   this.totalNumObj = this.getCheckObj("totalType");
                   var rows=[];
                   res.data.forEach(item=>{
                       if(item.checkType=="totalType"){
                        return;
                       }
                        rows.push({
                            checkType:this.initCheckName(item.checkType),
                            totalCount:item.totalCount
                        });
                   }); 
                   this.problemChartData={
                        columns:['checkType','totalCount'],
                        rows:rows
                   }
                }else{
                    this.problemChartData={};
                }

                let titleText = this.problemFlag =='month'? '本月问题分布':'本年问题分布';
                this.problmtitle= {
                    text: titleText,
                    left: 'center',
                    top: '118',
                    textStyle:{
                        //文字颜色
                        color:'#ccc',
                        //字体风格,'normal','italic','oblique'
                        fontStyle:'normal',
                        //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                        fontWeight:'bold',
                        //字体系列
                        fontFamily:'sans-serif',
                        //字体大小
                        fontSize:16
                    }
                }
                
            })
        },
        // 获取楼栋总览状态分类数据
        getCheckStatus() {
            let params ={
                projUid:this.projUid,
                checkType:this.areaFlag,
                areaUid:this.areaValue,
                checkItemUid:this.checkItemVal,
                status:this.checkStatus
            }
            this.util.restGet('/api_v1/modules/statistics/checkStatus', params,(res)=>{
                this.statusTotalCount = res.totalCount;
                if(res.status == 200&&res.data){
                    res.data.forEach(item=>{
                        item.statusName=this.initStatusName(item.status);
                        item.percent = res.totalCount==0? 0:(item.countNum*100/res.totalCount).toFixed(1)
                    });
                    this.statusList = res.data;
                    this.statusChartData= {
                        columns: ['statusName', 'countNum'],
                        rows: res.data
                    }
                }else{
                    this.statusChartData= {
                        columns: ['statusName', 'countNum'],
                        rows: []
                    }
                    this.statusList=[];
                }
            })
        },
        // 获取状态名称
        initStatusName(value) {
            //状态，0:记录，1:待指派，2:待修，3:待销项，4:已销项，5:超期完成，6:不通过
            if(value=="0"){
                return "记录"
            }else if(value=="1"){
                return "待指派"
            }else if(value=="2"){
                return "待整改"
            }else if(value=="3"){
                return "待销项"
            }else if(value=="4"){
                return "已销项"
            }else if(value=="5"){
                return "超期完成"
            }else if(value=="6"){
                return "不通过"
            }
        },
        // 获取排行的高度
        getRankDetails(num) {
            this.pages = Math.ceil(this.rankList.length/num);
           
        },
        // 排行榜点击事件
        handleClick(index) {
            var top = -(this.projConHeight*index) +'px';
            this.$refs.container.style.top = top;
            this.currentPage = index;
            timerNum = index;
        },
        // 获取工序数量统计数据
        getProcedureCount(type) {
            let params ={
                projUid:this.projUid
            }
            this.util.restGet('/api_v1/modules/statistics/procedureCount', params,(res)=>{
                if(res.status == 200&&res.data){
                    res.data.monthPassPercent = res.data.monthActNum==0? 0:(res.data.monthPassNum*100/res.data.monthActNum).toFixed(1);
                    res.data.lastMonthPassPercent = res.data.lastMonthActNum==0? 0:(res.data.lastMonthPassNum*100/res.data.lastMonthActNum).toFixed(1);
                    res.data.yearPassPercent = res.data.yearActNum==0? 0:(res.data.yearPassNum*100/res.data.yearActNum).toFixed(1);
                    res.data.allPassPercent = res.data.allActNum==0? 0:(res.data.allPassNum*100/res.data.allActNum).toFixed(1);

                    res.data.monthFinishPercent = res.data.monthProblemNum==0? 0:(res.data.monthFinishNum*100/res.data.monthProblemNum).toFixed(1);
                    res.data.lastMonthFinishPercent = res.data.lastMonthProblemNum==0? 0:(res.data.lastMonthFinishNum*100/res.data.lastMonthProblemNum).toFixed(1);
                    res.data.yearFinishPercent = res.data.yearProblemNum==0? 0:(res.data.yearFinishNum*100/res.data.yearProblemNum).toFixed(1);
                    res.data.allFinishPercent = res.data.allProblemNum==0? 0:(res.data.allFinishNum*100/res.data.allProblemNum).toFixed(1);
                    this.procedureCountObj = res.data;
                }else{
                    this.procedureCountObj={};
                }
            })
        },
        // 获取实测数量统计
        getMeasureCount(){
            let params ={
                projUid:this.projUid
            }
            this.util.restGet('/api_v1/modules/statistics/measureCount', params,(res)=>{
                if(res.status == 200&&res.data){
                    res.data.monthPassPercent = res.data.monthActNum==0? 0:(res.data.monthPassNum*100/res.data.monthActNum).toFixed(1);
                    res.data.lastMonthPassPercent = res.data.lastMonthActNum==0? 0:(res.data.lastMonthPassNum*100/res.data.lastMonthActNum).toFixed(1);
                    res.data.yearPassPercent = res.data.yearActNum==0? 0:(res.data.yearPassNum*100/res.data.yearActNum).toFixed(1);
                    res.data.allPassPercent = res.data.allActNum==0? 0:(res.data.allPassNum*100/res.data.allActNum).toFixed(1);

                    res.data.monthFinishPercent = res.data.monthProblemNum==0? 0:(res.data.monthFinishNum*100/res.data.monthProblemNum).toFixed(1);
                    res.data.lastMonthFinishPercent = res.data.lastMonthProblemNum==0? 0:(res.data.lastMonthFinishNum*100/res.data.lastMonthProblemNum).toFixed(1);
                    res.data.yearFinishPercent = res.data.yearProblemNum==0? 0:(res.data.yearFinishNum*100/res.data.yearProblemNum).toFixed(1);
                    res.data.allFinishPercent = res.data.allProblemNum==0? 0:(res.data.allFinishNum*100/res.data.allProblemNum).toFixed(1);
                    this.measureCountObj = res.data;
                }else{
                    this.measureCountObj={};
                }
            })
        },
        // 地图走马灯
        changeCarousel(value){
            this.carouselIndex = value;
        }
    }
}