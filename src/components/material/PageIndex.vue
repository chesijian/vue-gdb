<template>
    <div class="check-box">
        <div class="tabs-box">
             <div class="tabs" style="">
                <!--<div ><router-link :class="{active:$route.path=='/page/material'}" to="/page/material">首页</router-link></div>-->
                
               <div @click="ali()"><router-link :class="{active:$route.path=='/page/material/form/query/t_Materials_purchase'}" to="" v-if="sessionUtil.isAllowMenu('020901')">合同清单</router-link></div>
               <div @click="ali2()"><router-link :class="{active:$route.path=='/page/material/form/query/t_Materials_storage'}" to=""  v-if="sessionUtil.isAllowMenu('020902')">物料验收</router-link></div>
               
                <!--<div ><router-link :class="{active:$route.path=='/page/material/jurisdiction'}"  to="/page/measured/jurisdiction" v-if="sessionUtil.isAllowMenu('/page/material/jurisdiction')||sessionUtil.isAllowBtn('gc4_1:view')">权限配置</router-link></div>-->
               <!--<div ><router-link :class="{active:$route.path=='/page/material/areaMeasured'}" to="/page/material/areaMeasured"  v-if="sessionUtil.isAllowMenu('/page/material/areaMeasured')||sessionUtil.isAllowBtn('gc4_2:view')">区域测点</router-link></div>-->
                <!--<div ><router-link :class="{active:$route.path=='/page/material/checkProblem'}"  to="/page/material/checkProblem"  v-if="sessionUtil.isAllowMenu('/page/material/checkProblem')||sessionUtil.isAllowBtn('gc4_3:view')">问题整改</router-link></div>-->
                <!--<div ><router-link :class="{active:$route.path=='/page/material/checkSet'}"  to="/page/material/checkSet"  v-if="sessionUtil.isAllowMenu('/page/material/checkSet')||sessionUtil.isAllowBtn('gc4_4:view')">检查项设置</router-link></div>-->
                <!--<div ><router-link :class="{active:$route.path=='/page/material/planning'}"  to="/page/material/planning" >计划编制</router-link></div>-->
                
            </div>

             </div>
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
    created(){
    	this.ali()
//    this.$router.push('/page/material/form/query/t_Materials_purchase')

    },
    methods:{
    	
    	ali(){
    		this.$router.push('/page/material')
    		setTimeout(()=>{
    			this.$router.push('/page/material/form/query/t_Materials_purchase')
    		},1)
    	},
    	ali2(){
    		this.$router.push('/page/material')
    		setTimeout(()=>{
    			this.$router.push('/page/material/form/query/t_Materials_storage')
    		},1)
    	},
    },
}
</script>

<style scoped>
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
