<template>
    <div class="check-box">
        <div class="tabs-box">
             <div class="tabs">
                <div v-if="sessionUtil.isAllowMenu('02020401')"><router-link active-class="active"  to="/page/workContactBill/form/query/t_work_contact">工作联系单</router-link></div>
                <div v-if="sessionUtil.isAllowMenu('02020402')"><router-link active-class="active"  to="/page/workContactBill/form/query/t_work_contact_Approval">我审批的</router-link></div>
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
        // this.$router.push({
        //     path: '/page/projMeeting/form/query/wx_meeting_report'
        // })
    },
    methods: {
        changeType(str) {
            this.activeStr = str
        }
    }
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

