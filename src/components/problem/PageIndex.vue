<template>
    <div class="check-box">
        <!-- <div class="tabs-box">
             <div class="tabs" style="">
                <div ><router-link :class="{active:$route.path=='/page/problem'}" to="/page/measured">首页</router-link></div>
                <div ><router-link :class="{active:$route.path=='/page/problem/jurisdiction'}"  to="/page/problem/jurisdiction" v-if="sessionUtil.isAllowMenu('/page/problem/jurisdiction')||sessionUtil.isAllowBtn('gc4_1:view')">权限配置</router-link></div>
                <div ><router-link :class="{active:$route.path=='/page/problem/areaMeasured'}" to="/page/problem/areaMeasured"  v-if="sessionUtil.isAllowMenu('/page/problem/areaMeasured')||sessionUtil.isAllowBtn('gc4_2:view')">区域测点</router-link></div>
                <div ><router-link :class="{active:$route.path=='/page/problem/checkProblem'}"  to="/page/problem/checkProblem"  v-if="sessionUtil.isAllowMenu('/page/problem/checkProblem')||sessionUtil.isAllowBtn('gc4_3:view')">问题整改</router-link></div>
                <div ><router-link :class="{active:$route.path=='/page/problem/checkSet'}"  to="/page/problem/checkSet"  v-if="sessionUtil.isAllowMenu('/page/problem/checkSet')||sessionUtil.isAllowBtn('gc4_4:view')">检查项设置</router-link></div>
                <div ><router-link :class="{active:$route.path=='/page/problem/planning'}"  to="/page/problem/planning" >计划编制</router-link></div>
            </div>

             </div> -->
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data(){
        return {
            activeStr:'检查问题',
        }
    },
}
</script>

<style scoped>
    .check-box{
        width: 100%;
        height: 100%;
        padding:0 10px 10px;
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
        width: 78px;
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
    }
</style>
