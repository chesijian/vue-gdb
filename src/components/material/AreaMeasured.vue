<template>
    <div class="proj-box" style="padding:46px 0 0 0">
         <div class="tabs-box">
            <div class="tabs" style="border-top:0 none;">
                <div style="float: left;height:100%;line-height:36px;color:#FFFDF4 ">
                    <span style="float: left;margin-right:10px;">选择图纸</span>
                    <div style="padding-top: 5px;float: left;margin-right:10px;" @click="selectPart=!selectPart">
                        <div  class="search-box search-div" >
                            <span>{{partObj.label}}</span>
                            <i></i>
                            <div :style="{opcity:selectPart?'1':'0',height:selectPart?'300px':'0'}"
                             style="position:absolute;width:100%;top:26px;left:0;background:#333;z-index:408;overflow:auto;transition:all 0.5s">
                                <asideItem :models="item" style="text-align:left;" :level="0" v-for="(item, index) in partList" :key="index"></asideItem>
                            </div>
                        </div>
                    </div>
                    <span style="float: left;">测量点:{{drawingObj.totalNum}} 已测点:{{drawingObj.measuredNum}} 测量率:{{drawingObj.measuredRate}}% 合格点:{{drawingObj.passNum}} 合格率:{{drawingObj.passRate}}%</span>
                </div>
                <div class="tabs-button-box" style="float: right;">
                    <button @click="saveDrawingData"  v-if="sessionUtil.isAllowBtn('gc4_2:save')">保存</button>
                </div>
            </div>

        </div>
        <div class="body-box">
            <remote-script src="../../../static/js/leaflet/lib/leaflet.js"  @load="leafletLoaded = true" ></remote-script>
            <remote-script v-if="leafletLoaded" src="../../../static/js/leaflet/lib/leaflet.draw.js" @load="loaded();"></remote-script>
            <div id="map" style="width: 100%; height: 100%; border: 1px solid #ccc"></div>
            <div  v-if="measureActive" class="building-drawing">
                <div style="padding: 10px 14px;text-align: left;">
                    <span style="font-size: 18px;">{{measureObj.title}}测量点</span>
                    <button @click="selectCheckItem" style="float:right;border-radius: 1px;background: rgba(255,255,255,0.20);">添加</button>
                </div>
              
                <div style="max-height: 495px;overflow: auto;margin-bottom: 10px;">
                    <div v-for="(item,index) in measureList" :key="index" style="padding: 10px;text-align: left;background:#fff;margin: 10px 14px;">
                        <div style="font-size: 14px;">
                            <span style="color:#5C9AD4">{{item.inspectItemName}}</span>
                            <span style="color:#FF1A56;float:right;" @click="removeItem(item)">删除</span>
                        </div>
                        <div style="display: flex;padding: 10px 0px;line-height: 26px;" class="box-value">
                            <span style="color:#5C9AD4">{{item.itemName}}</span>
                            <div >{{item.designValue}}</div>
                        </div>
                        <div class="box-value">
                            <div v-for="(item,index) in item.valueList" :key="index">{{item}}</div>
                        </div>
                        <p style="color:#5C9AD4;font-size: 12px;">{{item.createTime}} 记录人:{{item.createUser}}</p>
                    </div>
                </div>
            </div>
            
        </div>
        <selectCheckItem ref="selectMemberFun" :checkItemModels='checkItemModels'></selectCheckItem>
    </div>
</template>
<script>
import { lmap } from '../../../static/js/leaflet/lib/map.js';
import $ from 'jquery';
import {mapState} from 'vuex'
import asideItem from '../common/asideItem.vue'
import selectCheckItem from './selectCheckItem.vue'
export default {
    data(){
        return {
            leafletLoaded: false,
            partList:[],
            checkItemModels:{
                isShow:false,
                measureMarker:{},
                partObj:{},
                callBack:this.selectCheckItemCallBack
            },
            partNameArr:[],
            partObj:{},
            searchValue:'',
            selectPart:false,
            measureActive:false,//编辑测点页面
            imageUrl:"",
            measureList:[],
            deleteRecordList:[], //要删除的集合
            drawingObj:{},//图纸对象
            measureObj:{ //测点对象
            }
        }
    },
    components:{asideItem,selectCheckItem},
    computed: {
        ...mapState({
            userUid: state => state.userUid,
            userName: state => state.userName,
            selectProjectObj: state => state.selectProjectObj
        }),
      },
    created(){
      this.$bus.on("handelDeparts",this.refreshPicture);

    },
    beforeDestroy() {
          this.$bus.off('handelDeparts', this.refreshPicture);
    },
    mounted(){
        var projObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.$store.state.selectProjectObj =projObj;
        this.getParData();
        this.measureList=[];
        this.deleteRecordList=[];
    },
    methods:{
        selectCheckItem(){
            this.checkItemModels.isShow=true;
        },
        selectCheckItemCallBack(data){//选择检查项回调
            this.measureList =data.concat(this.measureList);
            this.measureActive=true;
            this.saveData();
        },
        removeItem(obj){//删除
            this.util.confirm("确定要删除该数据吗?","提示",(res)=>{
                if(obj.isNewFlag==undefined){
                    this.deleteRecordList.push(obj.id);
                }
                this.measureList = this.measureList.filter(item=>{
                    return item.id!=obj.id;
                });
                this.saveData();
            });
            
        },
        getMeasurePoitData(uuid) {
            this.util.mask();
            this.util.restGet('/api_v1/construction/inspect/measurePoitData/'+uuid, {id:this.id}, (res)=> {
                this.util.unmask();
                if(res.status==200&&res.data!=undefined){
                    res.data.forEach(item=>{
                        item.valueList = item.measureValue==undefined? []:item.measureValue.split(",");
                    });
                    this.measureList = res.data;
                }else{
                    this.measureList=[];
                }
            });
        },
        saveData(){
            var dataResult =[];
            var snStr  =new Date().format("yyyyMMddhhmm");
            // console.log(this.partObj.name);
            this.measureList.forEach((item,index) => {
                if(item.isNewFlag){
                    var obj = {
                        projUid: this.selectProjectObj.id,
                        inspectItemUid: item.id,
                        inspectItemName: item.inspectItemName,
                        minSample: item.minSample,
                        projType: item.projType,
                        status:1,
                        dataType: "record",
                        formType: "measured",
                        measureMarker: item.measureMarker,
                        measureUid: item.measureUid,
			            inspectDrawingUid:this.partObj.drawingId,
			            inspectPartUid:this.partObj.id,
			            inspectPartName:this.partObj.name,
                        sn:"SC"+snStr,
                        sort: index,
                    }
                    dataResult.push(obj);
                }
                
            });
            this.util.mask("正在保存..");
            if(this.deleteRecordList.length>0){
                this.deleteRecordList.forEach(item=>{
                    this.deleteData(item);
                });
            }
            if(dataResult.length>0){
                this.util.restPost("/api_v1/construction/inspect",dataResult,(res)=>{
                    if(res.status==200){
                        this.util.successToast('保存成功');
                        this.saveDrawingData();
                        this.getMeasurePoitData(this.measureObj.uuid);
                    }
                    this.util.unmask();
                });
            }else{
                this.saveDrawingData();
            }
            

        },
        saveDrawingData(){//保存图纸
            var mapData =lmap.getData();
            var mainData={MARKER_DATA_:JSON.stringify(mapData)};
            var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"T_DRAWING",ifSaveWorkflow:false};
            if(this.partObj.drawingId!=undefined){
                params['id']=this.partObj.drawingId;
                params['businessKey']=this.partObj.drawingId;
            }
            this.util.mask("正在保存..");
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                this.util.unmask();
                // console.log(res);
                if(res.status==200){
                    this.util.successToast('保存成功');
                    this.getParData();
                
                }
                
            });
        },
        loaded(mapData) {
            if (this.leafletLoaded) {
                var data = mapData==undefined||mapData==""? []:JSON.parse(mapData);
                
                var config = {
                tools: {
                    polygon:false,//是否允许绘制多边形，不配置默认是允许
                    rectangle:false,//是否允许绘制多边形，不配置默认是允许
                    marker:false,//是否允许绘制多边形，不配置默认是允许
                    save: false,//是否允许保存,不配置默认是允许
                    edit: false//是否允许编辑，不配置默认是允许
                },
                listeners: {
                    'layer:click' : this.onLmapLayerClick,
                    'layer:created' : this.onLmapLayerCreated,
                    'layer:delete' : this.onLmapLayerDelete,
                    'save' : this.onLmapSave
                },
                data: data,
                center: [512, 384],
                bounds: [1024, 768], //坐标范围
                imageUrl: this.imageUrl
                };
                 if(this.sessionUtil.isAllowBtn('gc4_2:save')){
                     config.tools.marker=true
                     config.tools.edit=true
                 }
                lmap.$ = $;
                // lmap.getData();
                lmap.init(this,config);
            }
        },
        onLmapLayerClick(layer){
            this.measureObj = layer.entity;
            this.checkItemModels.measureMarker=layer.entity;
            this.getMeasurePoitData(layer.entity.uuid);
            this.measureActive=true;
        },onLmapLayerCreated(layer){
            // console.info(layer);
            this.measureList=[];
            // layer.entity.title=layer.entity.uuid;
            // layer.entity.uuid=this.partObj.drawingId+"_"+layer.entity.uuid;
            this.checkItemModels.measureMarker=layer.entity;
            this.measureObj = layer.entity;

            this.checkItemModels.isShow=true;
        },onLmapSave(data){
            this.cookieUtil.set('data',JSON.stringify(data));

        },
        onLmapLayerDelete(layers){//删除测点
            var ids = [];
            layers.eachLayer(function(layer) {
                if (layer.entity != undefined && layer.entity != null) {
                    ids.push(layer.entity.uuid);
                }
            });
            this.util.restDelete("/api_v1/construction/inspect/measurePoint/"+ids.join(","),null,(res)=>{
                if(res.status==200){
                    this.saveDrawingData();
                    this.getDrawingMeasureData(this.partObj);
                }
            
            });
        },
        getParData(){
            this.util.mask();
            this.util.restGet("/api_v1/construction/inspect/partTree",{projUid:this.selectProjectObj.id},(res)=>{
                this.util.unmask();
                if(res.status==200){
                    
                    this.partList=res.data;
                }else{
                    this.partList=[];
                }

            });
        },
        packagePartName(data){//获取部位完整名称
            this.partNameArr.push(data.label);
            if(data.parents!=undefined){
                this.packagePartName(data.parents);
            }
        },
        refreshPicture(data) {//刷新图纸
            this.measureActive=false;
            if(data.fileId==undefined){
                this.util.error("该部位尚未上传图纸!");
                return;
            }
            this.partNameArr=[];
            this.packagePartName(data);
            data.name=this.partNameArr.reverse().join("-");
            this.partObj=data;
            this.selectPart=false;
            this.imageUrl = this.util.getBaseUrl() + '/api_v1/files/'+data.fileId+'/look?ifThumb=false&access_token='+this.sessionUtil.getAccessToken();
            lmap.remove();
            this.loaded(data.markerData);
            this.getDrawingMeasureData(this.partObj)
        },
        getDrawingMeasureData(itemObj){//获取图纸数据
            this.util.mask();
            this.util.restGet("/api_v1/construction/inspect/drawingMeasureData",{id:itemObj.drawingId,projUid:this.selectProjectObj.id},(res)=>{
                this.util.unmask();
                if(res.status==200&&res.data!=undefined){
                    res.data.measuredRate =res.data.totalNum==0? 0:((res.data.measuredNum/res.data.totalNum)*100).toFixed(2);
                    res.data.passRate =res.data.measuredNum==0? 0:((res.data.passNum/res.data.measuredNum)*100).toFixed(2);
                    this.drawingObj=res.data;
                }else{
                    this.drawingObj={};
                }

            });
        },
        deleteData(item){//删除数据
            this.util.restDelete("/api_v1/construction/inspect/"+item,null,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.util.successToast('保存成功');
                }
            
            });
        },
        
    }
}
</script>
<style scoped>
.tabs-button-box>button,.tabs-button-box>div{
    float: left;
    margin-left: 10px;
    margin-top: 5px;
}

.body-box{
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
}

.box-value{
    padding: 8px 0px;
    display: flex;
}
.box-value input{
    width: 45px;
    height: 20px;
    text-align: center;
    font-size: 12px;
    color: #333333;
    margin-right: 10px;
}
.box-value div{
    width: 55px;
    height: 26px;
    line-height: 26px;
    border: 1px solid #CCCCCC;
    text-align: center;
    font-size: 12px;
    color: #333333;
    margin-right: 10px;
}
.select-box{
    margin-right: 20px;
}
.select-box span{
    padding-right: 10px;
    font-size: 12px;
}
.search-box i {
    position: absolute;
    right: 0;
    top: 0;
    width: 26px;
    height: 26px;
    background: url('../../assets/indexImg/more.png') no-repeat center;
}
.building-drawing{
    width: 298px;
    z-index: 888;
    background: #089DCC;
    position: absolute;
    border-radius: 2px;
    top: 65px;
    right: 20px;
}
.search-div {
    float: left;
    width: 300px;
    height: 26px;
    background: transparent;
    color: #fff;
    border: 1px solid #44d2ff;
    padding-left: 26px;
    box-sizing: border-box;
    text-align: left;
    line-height: 26px;
    color:#FFFDF4;
}
</style>

<style >
@import "../../../static/js/leaflet/lib/leaflet.css";
@import "../../../static/js/leaflet/lib/leaflet.draw.css";

</style>
