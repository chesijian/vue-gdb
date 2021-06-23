<template>
    <div class="proj-box">
        <transition name="el-zoom-in-center">
            <!-- <div class="catalogue" v-show="initialized"> 
                <div class="box-style catalogue-con" style="height: 100%;">
                    <button class="prev" @click="initialized=false"></button>
                    <div>
                        <h4>目录</h4>
                        <div class="aside-box">
                            <asideItem v-for="(item, index) in models" :key="index" :models="item" :level="0" ></asideItem>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
                
            </div> -->
            <div class="left_1 catalogue" style="cursor: pointer;" v-show="initialized" @mouseover="overShow=true"  @mouseleave="overShow=false">
                <button class="prev" v-show="overShow" @click="initialized=false"></button>
                <!--左上边框-->
                <div class="t_line_box">
                    <i class="t_l_line"></i> 
                    <i class="l_t_line"></i> 
                </div> 
                <!--右上边框-->
                <div class="t_line_box">
                    <i class="t_r_line"></i> 
                    <i class="r_t_line"></i> 
                </div> 
                <!--左下边框-->
                <div class="t_line_box">
                    <i class="l_b_line"></i> 
                    <i class="b_l_line"></i> 
                </div> 
                    <!--右下边框-->
                    <div class="t_line_box">
                    <i class="r_b_line"></i> 
                    <i class="b_r_line"></i> 
                </div> 
                <div class="main_title" @click="loadProjData('all')">
                    <img src="../static/picture/t_1.png" alt="">
                  项目目录
                </div>
                <div class="aside-box">
                    <asideItem v-for="(item, index) in models" :key="index" :models="item" :level="0" ></asideItem>
                </div>
                
            </div>
        </transition>
        <div v-show="!initialized" class="catalogue-hide" >
            <button class="next" @click="initialized=true"></button>
        </div>
        
        <div class="monitoring-wrap" :style="{width:initialized? '79%':'98%'}">
            <project ref="project"></project>
        </div>
        
    </div>
</template>

<script>
import project from '@/components/largeScreen/project/project.vue'
import asideItem from '@/components/common/asideItem.vue'
export default {
    data() {
        return {
            initialized: true,
            overShow:false,
            selectNode: {},
            models: [],
            selectNode: {},
            projUid: '',
        }
    },
    created() {
        this.$parent.showPictures =false;
        this.$bus.on('handelDeparts', this.changeTable);
        this.getModels()
    },
    beforeDestroy() {
      this.$bus.off('handelDeparts', this.changeTable)
    },
    methods: {
        changeTable(data) {
            if(data.id) {
                this.$refs.project.initDatas(data.id);
            }
        },
        getModels() {
            this.util.restGet('/api_v1/business/supervise/searchVideoMonitoring', null, (res)=> {
                if(res.status == 200){
                //    console.log("searchVideoMonitoring====",res);
                    this.models = res.data;
                    this.$forceUpdate()
                }else {
                    this.util.error(res.errorMsg)
                }
            })
        },
    },
    components: {
        asideItem,
        project
    }
}
</script>

<style scoped>
.catalogue {
    width: 20%;
    height: 1030px;
    float: left;
    margin-top: 20px;

    box-sizing: border-box;
    border: 1px solid #2C58A6;
    position: relative;
    box-shadow: 0 0 10px #2C58A6;
    }
.catalogue>button {
    position: absolute;
    right: -30px;
    top: 50%;
    width: 28.5px;
    height: 28.5px;
    line-height: 28.5px;
    text-align: center;
    background-color: transparent;
    border: 1px solid #0E94EA;
    color: white;
    padding-left: 10px;
    cursor: pointer;
}
.catalogue-hide{
    width: 2%;
    height: 1068px;
    float: left;
    position: relative;
}
.catalogue-hide>button {
    position: absolute;
    right: 0px;
    top: 50%;
    width: 28.5px;
    height: 28.5px;
    line-height: 28.5px;
    text-align: center;
    background-color: transparent;
    border: 1px solid #0E94EA;
    color: white;
    padding-left: 10px;
    cursor: pointer;
}
.proj-box>button {
    width: 28.5px;
    height: 28.5px;
    line-height: 28.5px;
    text-align: center;
    background-color: transparent;
    border: 1px solid #0E94EA;
    color: white;
    padding-left: 10px;
    cursor: pointer;
}
.prev {
    background: url(../static/images/prev.png) center center no-repeat;
    background-size: 12px;
}
.next {
    background: url(../static/images/next.png) center center no-repeat;
    background-size: 12px;
}
.main_title{
    width: 245px;
    height: 35px;
    line-height: 33px;
    background-color: #2C58A6;
    border-radius: 18px;
    position: absolute;
    top: -17px;
    left: 40%;
    margin-left: -90px;
    color:#fff;
    font-size: 18px;
    font-weight: 600;
    box-sizing: border-box;
    padding-left: 45px;
    z-index: 1000;
    text-align: left;
}
.l_t_line{
    width: 5px;
    height: 24px;
    left: -3px;
    top: -3px;
}
.t_l_line{
    height: 5px;
    width: 26px;
    left: -3px;
    top: -3px;
}
.t_line_box {
    position: absolute;
    width: 100%;
    height: 100%;
}
.t_line_box i{
    background-color: #4788fb;
    box-shadow: 0px 0px 10px #4788fb;
    position: absolute;
}
.t_r_line{
    height: 5px;
    width: 26px;
    right: -3px;
    top: -3px;
}
.r_t_line{
    width: 5px;
    height: 24px;
    right: -3px;
    top: -3px;
}
.l_b_line{
    width: 5px;
    height: 24px;
    left: -3px;
    bottom: -3px;
}
.b_l_line{
    height: 5px;
    width: 26px;
    left: -3px;
    bottom: -3px;
}
.r_b_line{
    width: 5px;
    height: 24px;
    right: -3px;
    bottom: -3px;
}
.b_r_line{
    height: 5px;
    width: 26px;
    right: -3px;
    bottom: -3px;
}
.aside-box {
    text-align: left;
    box-sizing: border-box;
    padding: 26px 10px 0 0px;
    height: 95%;
    overflow: auto;
}
.proj-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 10px ;
    color: #fff;
    font-size: 14px;
    position: relative;
    overflow: hidden;
}
    
  
.monitoring-wrap {
    /* width: 95%; */
    float: right;
    height: 100%;
    overflow-y: hidden;
}


.monitoring-wrap  >>> .el-scrollbar__wrap {
    overflow-x: hidden;
}
.noResult {
    margin-top: 20%;
    color: #ccc;
    text-align-last: center;
}
</style>

