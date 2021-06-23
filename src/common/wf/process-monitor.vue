<template>
    <div style="margin-top:0px;height:100%" :space="200">
        <!-- <el-steps direction="vertical" :active="1">
            <el-step v-for="(item,key) in actList" :key="key" :title="item.name" :status="item.startTime == undefined?'wait':(item.endTime == undefined?'process':'finish')" :description="item.comment"></el-step>
        </el-steps> -->
        <div class="el-steps el-steps--vertical">
            <div v-for="(item,key) in actList" :key="key" class="el-step is-vertical" style="flex-basis: 50%;">
                <div class="el-step__head " :style="item.startTime == undefined?'color:#c0c4cc':(item.endTime == undefined?'color:#409eff':'color:#67c23a')">
                    <div class="el-step__line" :style="item.startTime == undefined?'margin-right: 0px;    background-color:#c0c4cc':(item.endTime == undefined?'margin-right: 0px;background-color:#409eff':'margin-right: 0px;background-color:#67c23a')">
                        <i class="el-step__line-inner" style="transition-delay: 0ms; border-width: 0px; height: 0%;"></i>
                    </div>
                    <div class="el-step__icon is-text"  :style="item.startTime == undefined?'border-color:#c0c4cc':(item.endTime == undefined?'border-color:#409eff':'border-color:#67c23a')">
                        <!---->
                        <div class="el-step__icon-inner">{{key+1}}</div>
                    </div>


                </div>
                <div class="el-step__main">
                    <div class="el-step__title " :style="item.startTime == undefined?'color:#c0c4cc;font-size: 12px;':(item.endTime == undefined?'color:#409eff;font-size: 12px;':'color:#67c23a;font-size: 12px;')">[{{item.name}}] &nbsp;{{item.assignee}}</div>
                    <div class="el-step__description " :style="item.startTime == undefined?'color:#c0c4cc':(item.endTime == undefined?'color:#409eff':'color:#67c23a')" v-if="item.startTime != undefined">{{item.startTime.substring(0,11)+(item.endTime == undefined?'':' ~ '+item.endTime.substring(0,11))}}</div>
                    <div class="el-step__description " :style="item.startTime == undefined?'color:#c0c4cc':(item.endTime == undefined?'color:#409eff':'color:#67c23a')" style="margin-top:3px;" v-if="item.comment != undefined">{{item.comment}}</div>
                </div>
                <div v-if="item.category == '1'" class="el-step-type" >
                        抄送
                    </div>
            </div>
        </div>

    </div>
</template>
<script>

export default {
    name:'ProcessMonitor',
    props: ['model'],
    data() {
        return {
            defaultConfig: {
            },
            showProcUserDelete: false,//显示处理人的删除按钮
            showCopyUserDelete: false,//显示抄送人的删除按钮
            showSelectProcUser: false,//显示选择处理人
            showSelectCopyUser: false,//显示选择抄送人
            actList: [],
            procDefId: '',//流程定义主键
            procInstId: ''//流程实例主键

        };
    },
    components: {
    },
    created() {
        this.util.init(this);
        //console.info("processMonitor=======created========");
        //this.config =  this.defaultConfig;
    },
    activated() {
        //console.info("processMonitor=======activated========");
    },
    mounted() {
       // console.info("processMonitor=======mounted========");
        if (this.model.ifHasProcess != undefined && !this.model.ifHasProcess) {
            this.defaultConfig.ifHasProcess = false;
        }
        if (this.validUtil.isNotEmpty(this.util.getUrlParam('_procInstId'))) {
            this.procInstId = this.util.getUrlParam('_procInstId');
        }
        if (this.validUtil.isNotEmpty(this.util.getUrlParam('_procDefId'))) {
            this.procDefId = this.util.getUrlParam('_procDefId');
        }
        //this.initProcess();
    },
    methods: {

        initProcess(procInstId, procDefId) {
             this.actList = [];
            procInstId = (procInstId == undefined ? this.procInstId : procInstId);
            procDefId = (procDefId == undefined ? this.procDefId : procDefId);
            if (this.validUtil.isNotEmpty(procDefId)) {
                var _this = this;
                this.util.restGet('/api_v1/wf/tasks/historic', { procDefId: procDefId, procInstId: procInstId,flag:false }, function (res) {
                    if (res.status == 200) {
                        _this.actList = res.data;
                        // _this.actList.push({
                        //     assignee: "管理员",
                        //     category: "0",
                        //     name: "结束",
                        //     taskDefKey: "node4",
                        // });
                    }
                });
            }
        }
    }
};
</script>

<style scoped>
.el-step-type{
        position: absolute;
    width: 25px;
    left: 200px;
    font-size: 9pt;
    border: 1px solid #ff7e00;
    padding: 2px;
    height: 14px;
    line-height: 15px;
    top: 1px;
    color: #ff6000;
}
</style>
