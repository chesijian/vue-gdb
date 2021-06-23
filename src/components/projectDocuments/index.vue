<template>
    <div class="check-box">
        <div class="tabs-box">
             <div class="tabs" style="">
                <div ><router-link :class="{active:$route.path=='/page/SystemDocumentation'}" to="/page/SystemDocumentation">文档管理</router-link></div>
                <!-- <div ><router-link :class="{active:$route.path=='/page/SystemDocumentation/form/query/t_proj_document'}" to="/page/SystemDocumentation/form/query/t_proj_document" >项目文档</router-link></div> -->
            </div>
        </div>
        <router-view :key="$route.path"></router-view>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
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
