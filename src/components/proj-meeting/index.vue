<template>
    <div class="check-box">
        <div class="tabs-box">
             <div class="tabs" style="">
                <!-- <div @click="changeType('会议室')"><router-link :class="{active:activeStr=='会议室'}" to="/page/projMeeting/form/query/t_meeting_room">会议室</router-link></div>
                <div @click="changeType('我发起的会议')"><router-link :class="{active:activeStr=='我发起的会议'}"  to="/page/projMeeting/form/query/t_meeting">我发起的会议</router-link></div> -->
                <!-- <div @click="changeType('会议纪要')"><router-link :class="{active:activeStr=='会议纪要'}"  to="/page/projMeeting/form/query/wx_meeting_report">会议纪要</router-link></div> -->
                <div v-if="sessionUtil.isAllowMenu('022401')"><router-link active-class="active"  to="/page/projMeeting/form/query/wx_meeting_report">会议纪要</router-link></div>
                <div v-if="sessionUtil.isAllowMenu('022404')"><router-link active-class="active"  to="/page/projMeeting/form/query/wx_work_order">项目任务</router-link></div>
                <div v-if="sessionUtil.isAllowMenu('022402')"><router-link active-class="active"  to="/page/projMeeting/form/query/wx_work_order_concern">我处理的任务</router-link></div>
                <div v-if="sessionUtil.isAllowMenu('022403')"><router-link active-class="active"  to="/page/projMeeting/form/query/wx_work_order_Launch">我发起的任务</router-link></div>
            </div>
        </div>
        <div class="page-proj-index">
            <router-view :key="$route.path"></router-view>
        </div>
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            activeStr:'会议室',
        }
    },
    mounted() {
        this.$router.push({
            path: '/page/projMeeting/form/query/wx_meeting_report'
        })
    },
}
</script>

<style scoped>
    .page-proj-index{
        width: 100%;
        height: 100%;
        padding-top: 10px;
        overflow: hidden;
        box-sizing: border-box;
    }
    .check-box{
        width: 100%;
        height: 100%;
        padding:36px 10px 10px;
        box-sizing: border-box;
        position: relative;
    }
    .tabs-box{
        position: absolute;top: 0;padding: 0 10px;box-sizing: border-box;left: 0;width: 100%;
    }
    .tabs{
        width: 100%;
        height: 36px;
        border: 1px solid #44D2FF ;
        box-sizing: border-box;
        padding: 0 10px;
        text-align: center;
     
    }
     .tabs div a{
        width: 100px;
        float: left;
        height: 26px;
        line-height: 26px;
        margin-top: 4px;
        cursor: pointer;
        margin-bottom: 10px;
        font-size: 14px;
        color: #fff;
        text-decoration: none;
    }
    .tabs .active{
        background: url(../../assets/indexImg/select.png) no-repeat  top center;
        background-size: 100px 26px;
    }
</style>

