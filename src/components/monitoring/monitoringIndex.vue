<template>
    <div class="proj-box">
        <div class="tabs-box">
            <div class="tabs">
                <span :class="{active:activeStr=='首页'}" @click="changePage('首页')">首页</span>
                <span :class="{active:activeStr=='摄像点设置'}" v-if="sessionUtil.isAllowBtn('sb1_1:view')" @click="changePage('摄像点设置')">摄像点设置</span>
            </div>
        </div>
        <div v-if="activeStr=='首页'">
            <div v-for="(item, index) in boxList" :key="index" @click="changeVideo(item,index)" class="box-style box-style1">
                <div>
                    <p class="title">[{{index}}]{{item.name}}
                        <span :style="{color:item.status=='online'?'#fff':'#999'}">{{item.status=="1"?'在线':'离线'}}</span>
                    </p>
                    <img :src="baseImgUrl+item.snapURL" width="100%" height="233px" alt="">
                </div>
                <i class="box-style-top-left"></i>
                <i class="box-style-top-right"></i>
                <i class="box-style-bottom-left"></i>
                <i class="box-style-bottom-right"></i>
            </div>
        </div>
        <div v-if="activeStr=='摄像点设置'">
            <gateBrake :equipmentList='equipmentList' @msgOut='loadMData' :deviceType='3'></gateBrake>
        </div>
        <div  v-if="condition">
            <div class="mask"  @click="cancel"></div>
            <div class="play-box">
                <p class="title">[{{selectNode.num}}]{{selectNode.node.name}}
                </p>
                <div>
                    <easy-player :video-url="UrlStr" live="true" aspect="300:170" style="height:100% " show-custom-button="true"></easy-player>
                </div>
                <button @click="cancel">关闭</button>
            </div>
        </div>
    </div>
</template>

<script>
import gateBrake from '../common/gateBrake.vue'
export default {
    components:{gateBrake},
    data(){
        return {
            initialized: false,
            activeStr: '首页',
            currentTech: '',
            UrlStr: '',
            condition:false,
            baseImgUrl:'',
            boxList:[],
            equipmentList:[],
            selectNode:{},
            channel:"",
            serial:""
        }
    },
    watch:{
       '$store.state.selectProjectObj.id':function(val,oldVal){
            this.changePage(this.activeStr)
        }
    },
    created(){
        this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'))
        this.changePage('首页');
    },
    methods:{
        changePage(str){
            this.activeStr=str;
            if(str=='首页'){
                this.loadData()
            }else{
                this.loadMData()
            }
        },
        loadMData(){
            var params = {
                    type: '3',
                    pageNum: 1,
                    pageSize: 100000,
                }
                params.projUid = this.$store.state.selectProjectObj.id;
                // params.projUid = 'cfa27678e0164beea37027f1173ba99d'//测试用
                this.util.restGet('/api_v1/modules/check_devices', params, (res) => {
                    if (res.status == 200) {
                        if(res.data&&res.data.length>0){
                            for (let i = 0; i < res.data.length; i++) {
                                res.data[i].enable==1?res.data[i].enable=true:res.data[i].enable=false
                            }
                                this.equipmentList = res.data
                        }else{
                            this.equipmentList=[]
                        }
                    } else {
                        this.util.error(res.errorMsg)
                    }
                })
        },
        changeVideo(node,num){
            this.condition=true;
            let params={
                projUid:this.$store.state.selectProjectObj.id,
                serial:node.serial,
                channel:node.channel,
            }
            this.channel = node.channel
            this.serial = node.serial
            this.selectNode={
                node:node,
                num:num
            };
            this.util.restGet('/api_v1/modules/dvr/stream',params,(res)=>{
                console.log(res.data)
                if(res.status==200){
                    let hostURL =res.data.hostURL;
                    this.UrlStr=hostURL + res.data.url;
                    setInterval(this.updateStream, 30000);
                    this.$forceUpdate()
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        updateStream() {
            console.info('-------updateStream-----')
            let params = {
                serial: this.serial,
                channel: this.channel,
            }
            this.util.restGet('/api_v1/modules/dvr/touch', params, (res) => {
            // console.log(res.data)
            if (res.status == 200) {

            }
            })
        },
        cancel(){
            this.condition=false;
        },
        loadData(){
            let params={
                projUid:this.$store.state.selectProjectObj.id,
                pageIndex:1,
                pageSize:10,
            }
            this.util.restGet('/api_v1/modules/dvr/channels',params,(res)=>{
                console.log(res)
                if(res.status==200){

                  if(res.data&&res.data.channels){
                    this.boxList=res.data.channels
                    this.baseImgUrl=res.data.hostURL
                  }else{
                    this.boxList=[]
                    this.baseImgUrl=''
                  }
                  this.$forceUpdate()
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        }

    },
}
</script>

<style scoped>
    .proj-box{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0 10px ;
        color: #fff;
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
    .mask{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 98;
    }
    .play-box{
        width: 910px;
        height: 565px;
        box-sizing: border-box;
        padding: 20px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background: rgba(255,255,255,0.20);
        box-shadow: inset 0 0 15px 0 #44D2FF;
        z-index: 99;
    }
    .play-box button{
        position: absolute;top: 20px;
        right: 20px;
    }
    .play-box>div{
        width: 100%;
        height: 490px;
    }
    .play-box>div video{
        width: 100%;
        height:  100%;
    }
</style>

