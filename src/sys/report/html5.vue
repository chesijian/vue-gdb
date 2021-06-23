<template>
    <div>
        <div id="toolbar" class="row">
            <el-button type="primary" @click="webapp({})">打印预览</el-button>
            <el-select v-if="hasSelect" v-model="title" @change="change">
                <el-option v-for="(edit, index) in subList"  clearable :key="index" :label="edit.config.title" :value="edit.config.title" ></el-option>
            </el-select>
        </div>
        <div id="report_holder"> </div>
    </div>
</template>
<script>
import grhtml5 from './grhtml5-6.6-min.js'
import webapp from './grwebapp.js'
import utils from './utils.js';
import {getMainData , getConfig , getReport, getGridData} from '@/api/form-render'
import {mapGetters, mapMutations} from 'vuex'
export default {
    data () {
        return{
            data:[],
            grf:{},
            subList:[],
            title:'',
            formConfig:{},
            type:'',
            hasSelect:false,
            subdata:[],
            subFormId:''
        }
    },
    mounted(){
        this.type = this.$route.params.type;
        this.formConfig = this.$route.params.formConfig;
        this.subConfig = this.$route.params.subConfig;
        this.init();
    },
    computed: {
    ...mapGetters([
    'getFormConfig'
    ])
    },
    methods:{
        init(){
            let vm = this
            // 判断是否是传有grf参数
            if(vm.$route.params.id){
                let params = {
                    'type': vm.$route.params.type,
                    'formInfoId': vm.$route.params.formInfoId
                }
                // 获取模板
                getReport(params).then(data => {
                    if(data){
                        data.forEach(e => {
                            if(e.id === this.$route.params.id){
                                vm.subFormId = e.subFormId
                                vm.grf = e.grf
                            }
                        })
                        vm.getFormData();
                        vm._onload();
                    }
                })
            }else{
                if(vm.formConfig){
                    // 先从模板数据库查找
                    if(vm.type == 2){
                        // 过滤掉所有子表
                        vm.formConfig.formColumns.filter(e => {
                            if(e && e.widgetType === 'sub-form'){
                                vm.subList.push(e)
                            }
                            return e.widgetType != 'sub-form'
                        });
                        // 将第一个子表放入配置
                        vm.formConfig.formColumns.push(vm.subList[0])
                    }
                    vm.grf = JSON.stringify(utils.getReport(vm.formConfig,vm.type,vm.subConfig));
                }
            }
            if(vm.$route.params.data){
                if(vm.formConfig){
                    vm.formConfig.formColumns.forEach(e => {
                        if(e && e.widgetType === 'sub-form'){
                            vm.subList.push(e)
                        }
                    });
                }
                vm.getFormData(); // 获取传入的数据
                vm._onload();
            }else{
                //获取表单配置
                getConfig(vm.$route.params.formId, vm).then(data => {
                    if(data && data.forms){
                        data.forms.forEach(item => {
                            if(item.id === vm.$route.params.formInfoId){
                                vm.formConfig = item
                            }
                        })
                    }
                    vm.data = {"Table":[]};
                    if(vm.type == 1){ // 1代表列表
                        let params = {
                            'formId': vm.$route.params.formId,
                            'id': vm.$route.params.formInfoId,
                        }
                        getGridData(params, this).then(res => {
                            if (res.data) {
                                vm.data = {"Table":vm.filterData(res.data)}
                            }
                            vm._onload()
                        })
                    }else if(vm.type == 2){ // 2代表表单
                        vm.data = {"Table":[]};
                        let params = {
                            'formId': vm.$route.params.formId,
                            'id': vm.$route.params.formInfoId,
                        }
                        getMainData(params).then(data => {
                            // 判断获取参数是否为object
                            vm.data.Table.push(vm.filterData(data))
                            vm._onload()
                        })
                    }
                })
            }
        },
        // 过滤数据
        filterData(data){
            if(!data || !this.formConfig) return
            if(this.type == 1){ // 1代表列表
                data.forEach(item => {
                    this.formConfig.queryColumns.forEach(e => {
                        if(e && (e.widgetType === 'select-form' || e.widgetType === 'select-user'|| e.widgetType === 'select-depart' || e.widgetType === 'select-date' || e.widgetType === 'select-role' || e.widgetType === 'select-dic' || e.widgetType === 'select-time' || e.widgetType === 'select-date-time')){
                            if(item[e.columnName+'LABEL_']){
                                item[e.columnName] = item[e.columnName+'LABEL_'];
                            }
                        }
                    })
                })
            }else if(this.type == 2){ // 2代表表单
                if(data && typeof data === 'object'){
                    this.formConfig.formColumns.forEach(e => {
                        if(e && (e.widgetType === 'select-form' || e.widgetType === 'select-user'|| e.widgetType === 'select-depart' || e.widgetType === 'select-date' || e.widgetType === 'select-role' || e.widgetType === 'select-dic' || e.widgetType === 'select-time' || e.widgetType === 'select-date-time')){
                            if(data[e.columnName+'LABEL_']){
                                data[e.columnName] = data[e.columnName+'LABEL_'];
                            }
                        }
                    })
                }else{
                    data = {}
                    this.formConfig.formColumns.forEach(e => {
                        data[e.columnName] = '[#{'+e.columnName+'}#]';
                    })
                }
            }
            return data
        },
        filterSubData(data, config){
            if(!data || !config) return
             data.forEach(item => {
                config.queryColumns.forEach(e => {
                    if(e && (e.widgetType === 'select-form' || e.widgetType === 'select-user'|| e.widgetType === 'select-depart' || e.widgetType === 'select-date' || e.widgetType === 'select-role' || e.widgetType === 'select-dic' || e.widgetType === 'select-time' || e.widgetType === 'select-date-time')){
                        if(item[e.columnName+'LABEL_']){
                            item[e.columnName] = item[e.columnName+'LABEL_'];
                        }
                    }
                })
            })
            return data
        },
        getFormData(){
            let data = this.filterData(this.$route.params.data);
            if(!data) return
            if(data.constructor === Array){
                 this.data = {"Table":data};
            }else{
               this.data = {"Table":[]};
               this.data.Table.push(data);
               if(this.subConfig){
                 this.subdata = this.filterSubData(this.subConfig.config.tableData,this.subConfig.config);
               }
               if(this.subdata){
                 this.data.Detail1 = this.subdata;
               }
            }
        },
        _onload(){
            if(this.grf && this.data){
                webapp.webapp_urlprotocol_startup();
                var reportViewer = window.rubylong.grhtml5.insertReportViewer("report_holder");
                reportViewer.reportPrepared = false; //指定报表生成需要加载报表模板
                reportViewer.dataPrepared = false;   //指定报表生成需要加载报表数据
                reportViewer.loadReport(this.grf);
                reportViewer.loadData(JSON.stringify(this.data));
                reportViewer.start();
            }
        },
        //下啦框值改变
        change(val){
            this.formConfig.formColumns.filter(e => {
                return e.widgetType != 'sub-form'
            });
            // 先判断是否是主表
            this.subList.forEach(e => {
                if(e.config.title == val){
                    this.formConfig.formColumns.push(e);
                    this.subdata = e.config.tableData;
                    this.getFormData();
                    this._onload();
                }
            });
        },
        getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURI(r[2]); //return unescape(r[2]);
            }
            return null;
        },
        webapp(args){
            console.log(this.grf,this.data)
            webapp.webapp_ws_run(args,this.grf,JSON.stringify(this.data));
        }
    }
}
</script>
<style>
._grdg {
    width: 100%;
}
</style>

