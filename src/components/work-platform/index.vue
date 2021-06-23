<template>
    <div class="work_platform page-body">
        <div class="top">
            <div class="box">
                <h4>{{sessionUtil.getUserName()}},你好！</h4>
                <div class="date">
                    <span>{{getDate()}}</span>
                    <span class="day">{{week}}</span>
                </div>
                <iframe name="weather_inc" class="weather" src="https://i.tianqi.com/index.php?c=code&amp;id=0" width="200" height="60" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
            </div>
            <div class="box">
                <h4>今日签到</h4>
                <ul class="work-satus">
                    <li>
                        <span style="width:80px;">{{setup.STANDARDUP?setup.STANDARDUP:'9:00'}}<span> 上班</span></span>
                        <span>{{setup.FIRSTUP}}<span> 打卡</span></span>
                        <span :class="{'miss': (setup.SW == '迟到' || !setup.SW )}">{{setup.SW}}</span>
                    </li>
                    <li>
                        <span style="width:80px;">{{setup.STANDARDDOWN?setup.STANDARDDOWN:'18:00'}} <span>下班</span></span>
                        <span>{{setup.LASTTIME}} <span>打卡</span></span>
                        <span :class="{'miss': (setup.XW == '早退' || !setup.XW)}">{{setup.XW}}</span>
                    </li>
                </ul>
                <!-- <div class="more" >
                    <span>更多</span>
                    <i></i>
                </div> -->
            </div>
            <div class="box">
                <h4>工作汇报</h4>
                <ul class="work_list" v-if="workReport.length > 0">
                    <li v-for="(item, index) in workReport" v-if="index < 2">
                        <p>{{item.TITLE_}}</p>
                        <span>{{item.CREATE_USER_}} {{item.RECORD_DATE_}}</span>
                    </li>
                </ul>
                <div class="work_report" v-else>
                    <span>今日未汇报</span>
                    <el-button type="primary" size="small" @click="goToReport">现在汇报</el-button>
                </div>
                <div class="more" @click="more(1)">
                    <span>更多</span>
                    <i></i>
                </div>
            </div>
        </div>   
        <div class="middle">
            <h4>新闻公告</h4>
            <div class="wrapper">
                <swiper :options="noticeSwiperOption" class="swiper-container" ref="noticeSwiper">
                    <!-- slides -->
                    <swiper-slide class="swiper-item" v-for="(item, index) in newsList" :key="index">
                        <img class="pic" v-if="item.TPID" :src="util.getBaseUrl() + '/api_v1/files/' + item.TPID + '/look?&access_token=' + sessionUtil.getAccessToken() + '&id=' + item.TPID + '&suffix=' + item.SUFFIX_ + '&fileName=' + encodeURIComponent(item.FILE_NAME_)"  alt="">
                        <i v-if="!(item.TPID)"></i>
                        <div class="con" @click="more(2)">
                            <p>{{item.DATE}}</p>
                            <div class="details">
                                <span class="text">{{item.CONTENT_}}</span>
                                <span>查看详情</span>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
                <div class="noticeSwiper-button-next" :class="{'gray': noticeSwiperIndex == 9}"></div>
                <div class="noticeSwiper-button-prev" :class="{'gray': noticeSwiperIndex == 0}"></div> 
            </div>
        
            <div class="more" @click="more(2)">
                <span>更多</span>
                <i></i>
            </div>
        </div>
        <div class="bottom">
            <div class="title">
                <h4>审批</h4>
                <div class="btn-wrap">
                    <el-button size="small" :type="tabIndex == 0 ? 'primary' : 'default'" @click="check(0)">待办（{{approvalTotal}}）</el-button>
                    <el-button size="small" :type="tabIndex == 1 ? 'primary' : 'default'"  @click="check(1)">申请（{{applyTotal}}）</el-button>
                    <el-button size="small" :type="tabIndex == 2 ? 'primary' : 'default'"  @click="check(2)">已办（{{finishedTotal}}）</el-button>
                </div>
            </div>
            
            <div class="wrapper">
                <swiper :options="swiperOption" class="swiper-container" ref="mySwiper">
                    <!-- slides -->
                    <swiper-slide class="swiper-item" v-for="(item,index) in approval" :key="index">
                        <h5>{{item.procDefName}}</h5>
                        <div class="content">
                            <div class="con_top">
                                <p><span>主题：</span>{{item.subject}}</p>
                                <p><span>摘要：</span></p>
                            </div>
                            <div class="con_bottom">
                                <div>
                                    <p><span>申请人：</span>{{item.createUser ? item.createUser : item.startUserName}}</p>
                                    <p style="width: 130px;"><span>审批人：</span></p>
                                </div>
                                <div>
                                    <p><span>日期：</span>{{item.createTime ? item.createTime : item.startTime}}</p>
                                </div>
                                <div>
                                    <p style="width: 130px;"><span>用时：</span>{{  getTime(item.startTime, item.finishTime) }}</p>
                                </div>
                            </div>
                        </div>

                    </swiper-slide>
                </swiper>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div> 
            </div>
        </div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'////这里注意具体看使用的版本是否需要引入样式，以及具体位置。
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { getByApi, updateByApi } from "@/api/api"
export default {
    data(){
        return{
            companyCode: this.sessionUtil.getCompanyId(),
            week: '',
            tabIndex: 0,
            noticeSwiperIndex: 0,
            noticeSwiperOption:{
                notNextTick: true,
                initialSlide: 0,
                freeMode: true,
                grabCursor: true,
                slidesPerView: 4,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.noticeSwiper-button-next',
                    prevEl: '.noticeSwiper-button-prev',
                },  
                on: {
                    slideChangeTransitionEnd:()=>{
                        let swiper = this.$refs.noticeSwiper.swiper;
                        this.noticeSwiperIndex = swiper.activeIndex;
                    },
                }
            },
            swiperOption:{
                notNextTick: true,
                initialSlide: 0,
                freeMode: true,
                grabCursor: true,
                slidesPerView: 4,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },  
            },
            setup: {},
            workReport: [],
            newsList: [],
            approval: [],
            approvalTotal: 0,
            applyTotal: 0,
            finishedTotal: 0

        }
    },
    components: {
      swiper, 
      swiperSlide
    },
    mounted() {
        this.getData()
        this.check()
    },
    // beforeRouteEnter (to, from, next) {
    //     next(vm => {
    //         vm.getData()
    //         vm.check()
    //     })
    // },
    computed: {
        routeList: {
            get: function () {
                return this.$store.state.routeList
            },
            set: function () {}
        },
    },
    methods: {
        getDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var ddy = date.getDay();//获取存储当前日期
            var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            this.week = weekday[ddy]
            return currentdate;
        },
        getData() {
            getByApi('t_setup', {id: this.sessionUtil.getUserUid(),pageSize: 30, pageIndex: 1}).then(res => {
                if(res && res[0]) {
                    this.setup = res[0]
                }
            })
            getByApi('t_gzt_gzhb', {id: this.sessionUtil.getUserUid(),pageSize: 30, pageIndex: 1}).then(res => {
                if(res && res[0]) {
                    this.workReport = res
                }
            })
            getByApi('t_news_gg', {companyCode: this.companyCode, type: '全部',pageSize: 30, pageIndex: 1}).then(res => {
                if(res && res[0]) {
                    this.newsList=res
                }
            })
        },

        getTime(faultDate,completeTime){
            if(!faultDate || !completeTime) {
                return '0天0时0分'
            }
            var stime = Date.parse(new Date(faultDate));
            var etime = Date.parse(new Date(completeTime));
            var usedTime = etime - stime;  //两个时间戳相差的毫秒数
            var days=Math.floor(usedTime/(24*3600*1000));
            //计算出小时数
            var leave1=usedTime%(24*3600*1000);    //计算天数后剩余的毫秒数
            var hours=Math.floor(leave1/(3600*1000));
            //计算相差分钟数
            var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
            var minutes=Math.floor(leave2/(60*1000));
            var time = days + "天"+hours+"时"+minutes+"分";
            return time;
        },
        check(type) {
            if(type == undefined || type == null) {
                this.tabIndex = 0;
            } else {
                this.tabIndex = type;
            }
            if(type == 0 || type == undefined || type == null) {
                this.util.restGet('/api_v1/wf/tasks/approval', {pageSize: 30, pageIndex: 1},(res)=>{
                    if(res.status==200){
                        if(res.data){
                            if(this.tabIndex == 0) {
                                this.approval=res.data
                            }
                            this.approvalTotal = res.data.length
                        }else {
                            this.approval = []
                        }
                    }else{
                        this.util.error(res.msg)
                    }
                })
            }
            if(type == 1 || type == undefined || type == null) {
                this.util.restGet('/api_v1/wf/tasks/apply', {pageSize: 30, pageIndex: 1},(res)=>{
                    if(res.status==200){
                        if(res.data){
                            if(this.tabIndex == 1) {
                                this.approval=res.data
                            }
                            this.applyTotal = res.data.length
                        } else {
                            this.approval = []
                        }
                    }else{
                        this.util.error(res.msg)
                    }
                })
            }
             if(type == 2 || type == undefined || type == null) {
                this.util.restGet('/api_v1/wf/tasks/finished', {pageSize: 30, pageIndex: 1},(res)=>{
                    if(res.status==200){
                        if(res.data){
                            if(this.tabIndex == 2) {
                                this.approval=res.data
                            }
                            this.finishedTotal = res.data.length
                        }else {
                            this.approval = []
                        }
                    }else{
                        this.util.error(res.msg)
                    }
                })
            }
        },
        goToReport() {
            this.$router.push({
                path: '/form/edit/wx_work_report',
            })
        },
        more(type) {
            if(type == 1) {
                this.$router.push({path: '/form/query/wx_work_report'})
            }
            if(type == 2) {
                this.$router.push({path: '/platform/notice'})
            }
        },
    }
}
</script>
<style scoped lang="scss">
.more {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 50px;
    height: 20px;
    background: #3B8CFF;
    text-align: center;
    line-height: 20px;
    border-radius: 20px;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    i {
        width: 7px;
        height: 7px;
        display: inline-block;
        vertical-align: middle;
        border-left: 1px solid #fff;
        border-top: 1px solid #fff;
        transform: rotate(135deg)
    }
}
.wrapper {
    width: 100%;
    overflow: hidden;
    position: relative;
    .swiper-item {
        height: 180px;
    }
    .noticeSwiper-button-prev, .noticeSwiper-button-next, .swiper-button-prev, .swiper-button-next {
        height: 44px;
        width: 24px;
        background: url('../../assets/indexImg/next.png') ;
        position: absolute;
        top: 50%;
        margin-top: -22px;
        z-index: 999;
    }
    .noticeSwiper-button-prev, .swiper-button-prev {
        left: 0;
        transform: rotate(-180deg);
        &.gray {
            opacity: 0.35;
        }
    }
    .noticeSwiper-button-next, .swiper-button-next {
        right: 0;
        &.gray {
            opacity: 0.35;
        }
    }
}
h4 {
    margin: 20px 0;
}
.miss {
    color: red;
}
.work_platform {
    height: 100%;
    overflow-y: auto;
    .top {
        display: flex;
        justify-content: space-between;
        .box {
            flex: 1;
            overflow: hidden;
            background: #fff;
            padding: 0 20px;
            margin-right: 12px;
            height: 150px;
            position: relative;
            h4 {
                font-size: 18px;
                color: #333;
            }
            .date {
                padding-top: 32px;
                overflow: hidden;
                font-size: 26px;
                color: #333;
                .day {
                    color: #666;
                }
            }
            .weather {
                text-align: center;
                position: absolute;
                right: 0px;
                top: 0px;
            }
            .work-satus {
                li {
                    overflow: hidden;
                    height: 38px;
                    color: #333;
                    &>span {
                        height: 38px;
                        line-height: 38px;
                        font-size: 14px;
                        display: inline-block;
                        overflow: hidden;
                        margin-right: 20px;
                        span {
                            float: right;
                        }
                        &:nth-last-of-type(1) {
                            float: right;
                        }
                    }
                    border-bottom: 1px solid #E7E7E7;
                    &:nth-last-of-type(1) {
                        border: none;
                    }
                }
            }
            .work_report {
                text-align: center;
                span {
                    display: block;
                    margin-bottom: 10px;
                }
            }
            .work_list {
                li {
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid #E7E7E7;
                    padding: 10px 0;
                    color: #333;
                    p {
                        max-width: 80%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    &:nth-of-type(2) {
                        border-bottom: none;
                    }
                }
            
            }
            
        }
    }
    .middle {
        position: relative;
        padding: 0 20px;
        height: 260px;
        margin-top: 14px;
        overflow: hidden;
        .swiper-item {
            position: relative;
            border: 1px dashed #333;   
            box-sizing: border-box;
            i{
                display: inline-block;
                width: 100%;
                height: 180px;
                background: url(../../assets/administrationIcon/nonePic.png) no-repeat center ;
            }
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
            .con {
                background: rgba(0, 0, 0, 0.5);
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                color: #fff;
                padding: 5px;
                box-sizing: border-box;
                .details {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    .text {
                        max-width: 80%;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
            }
        }
    }
    .bottom {
        padding: 0 20px;
        height: 350px;
        margin-top: 14px;
        overflow: hidden;
        .title {
            display: flex;
            align-items: center;
            .btn-wrap {
                margin-left: 20px;
            }
        }
        .wrapper {
            padding-top: 10px;
        }
        .swiper-item {
            height: 250px;
            box-sizing: border-box;
            border: 1px solid #E7E7E7;
            h5 {
                height: 40px;
                font-size: 14px;
                font-weight: normal;
                padding: 0 10px;
                line-height: 40px;
                border-bottom: 1px solid #E7E7E7;
            }
            .content {
                position: relative;
                height: 210px;
                p {
                    font-size: 14px;
                    text-align: left;
                    span {
                        color: #999;
                    }
                }
                .con_top {
                    width: 100%;
                    position: absolute;
                    left: 0;
                    padding: 10px;
                    top: 0;
                    box-sizing: border-box;
                }
                .con_bottom {
                    width: 100%;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    padding: 10px;
                    box-sizing: border-box;
                    &> div {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                }
            }
        }
    }
    
}
</style>




