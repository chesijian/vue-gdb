<template>
    <div class="proj-box">
        <div class="tabs-box">
            <div class="tabs">
                <span class="active" >首页</span>
            </div>
        </div>
        <div>
            <div v-for="(item, index) in boxList" :key="index" class="box-style box-style1">
                <div>
                    <p class="title">[{{index}}]{{item.title}}
                        <span style="">{{item.status}}</span>
                    </p>
                    <img :src="item.url" width="100%" height="233px" alt="">
                </div>
                <i class="box-style-top-left"></i>
                <i class="box-style-top-right"></i>
                <i class="box-style-bottom-left"></i>
                <i class="box-style-bottom-right"></i>
            </div>
        </div>
        <div></div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            boxList:[
                {
                    title:'施工工地',
                    status:'在线',
                    url:require('../../assets/indexImg/test.jpg'),
                },
                {
                    title:'施工工地',
                    status:'在线',
                    url:require('../../assets/indexImg/test.jpg'),
                },
                {
                    title:'施工工地',
                    status:'在线',
                    url:require('../../assets/indexImg/test.jpg'),
                },
            ],
        }
    }
}
</script>

<style scoped>
    .proj-box{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0 10px ;
        color: #44D2FF;
        font-size: 14px;
        padding-top: 46px;
        position: relative;
        overflow: auto;
    }
    .tabs-box{
        width: 100%; 
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 10px;
        box-sizing: border-box;
    }
    .tabs{
        width: 100%;
        height: 36px;
        border: 1px solid #44D2FF ;
        box-sizing: border-box;
        padding: 0 10px;
        text-align: center;
    }
     .tabs>span{
        width: 78px;
        float: left;
        height: 26px;
        line-height: 26px;
        margin-top: 4px;
        cursor: pointer;
        margin-bottom: 10px;
    }
    .tabs>.active{
        background: url(../../assets/indexImg/select.png) no-repeat  top center;
    }
    .box-style1{
        height:300px;width:33.33333%;padding-right:11px;float: left;
    }
    .box-style1:nth-child(3n){
        padding-right:0;
    }
    .box-style1 .box-style-top-right,.box-style1 .box-style-bottom-right{
        right: 10px;
    }
    .box-style1:nth-child(3n) .box-style-top-right,.box-style1:nth-child(3n) .box-style-bottom-right{
        right: 0;
    }
    .title{
        font-size: 18px;margin-bottom: 10px;
        box-sizing: border-box;
        padding-left: 26px;
        position: relative;
        text-align: left;
    }
    .title::before{
        position: absolute;
        content: '';
        width: 20px;
        height: 20px;
        background: url(../../assets/indexImg/camera.png) no-repeat  top center;
        left: 0;
        top: 4px;
    }
    .title>span{
        float: right;
        font-size: 14px;
        color: #FFFFFF;
    }
</style>

