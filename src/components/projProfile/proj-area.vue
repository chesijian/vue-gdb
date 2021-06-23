<template>
    <div class="proj-box lj_box">
       
        <div class="page-building-index">
            <div class="building-fl">
                <div class="box-style" style="color:#fff;">
                    <div style="padding-top:45px;">
                        <div style="width:100%;position:relative;">
                            <h4 style="position:absolute;width:100%;top:-35px;left:0px;box-sizing:border-box;">区域
                                <div style="float:right">
                                    <button @click="editPart" v-if="sessionUtil.isAllowEdit('t_work_part')">编辑</button>
                                    <button @click="addPart" v-if="sessionUtil.isAllowAdd('t_work_part')">添加</button>
                                    <button @click="deletePart" v-if="sessionUtil.isAllowDelete('t_work_part')">删除</button>
                                </div>
                            </h4>
                        </div>
                        <div style="width:100%;height:100%;overflow:auto">
                            <aside-item :models="item" style="text-align:left;" :level="0" v-for="(item, index) in models"  :key="index"></aside-item>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
            </div>
            <div class="building-fr" >
                <div class="box-style">
                    <div class="building-box">
                        <div class="building-title">
                            <h4>图纸
                                <div style="float:right">
                                    <button @click="loadDrawing"  v-if="sessionUtil.isAllowEdit('t_work_part')">加载图纸</button>
                                    <button @click="saveDrawingData(1)" v-if="sessionUtil.isAllowBtn('gc1_4:drawing_save')">保存图纸</button>
                                    <button @click="deleteDrawing()" v-if="sessionUtil.isAllowDelete('t_work_part')">删除图纸</button>
                                </div>
                            </h4>
                        </div>
                        <div  ref="tops" class="building-drawing">
                            <remote-script src="static/js/leaflet/lib/leaflet.js"  @load="leafletLoaded = true" ></remote-script>
                            <remote-script v-if="leafletLoaded" src="static/js/leaflet/lib/leaflet.draw.js" @load="loaded();"></remote-script>
                            <!-- <remote-script src="./js/leaflet/lib/leaflet.js"  @load="leafletLoaded = true" ></remote-script>
                            <remote-script v-if="leafletLoaded" src="./js/leaflet/lib/leaflet.draw.js" @load="loaded();"></remote-script> -->
                            <div id="map" style="width: 100%; height: 100%; border: 1px solid #ccc"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="add-part-box" v-if="isAddPart" style="z-index:888">
                <div class="add-part" style="min-height: 339px;">
                    <p>部位</p>
                    <div class="select-msg-box" v-show="addPartType==0">
                        <span style="float: left;">楼栋名称</span>
                        <el-input v-model="partAreaObj.NAME_" size="mini" class="select-msg-ele" placeholder="请输入"></el-input>
                        <span style="float: left;">编码</span>
                        <el-input v-model="partAreaObj.CODE_" size="mini" class="select-msg-ele" placeholder="请输入"></el-input>
                        <span style="float: left;">排序</span>
          	            <el-input v-model="partAreaObj.SORT_" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>
                        <span style="float: left;">业态</span>
                        <div style="float: left;margin:0;border: 1px solid #ccc;border-radius: 3px;padding: 0 10px;width: 276px;">
                            <el-select v-model="partAreaObj.YE_TAI_" size="mini" class="select-ele" placeholder="请选择" style="width: 100%;">
                                <el-option v-for="(item, index) in listsm " :label="item.name" :value="item.value" :key="index"></el-option>
                            </el-select>
                        </div>
                        <span style="float: left;margin-top:10px;">层级</span>
                        <div style="float: left;margin-top:10px;border: 1px solid #ccc;border-radius: 3px;padding: 0 10px;width: 276px;">
                            <el-select v-model="partAreaObj.LEVEL_" size="mini" class="select-ele" placeholder="请选择" style="width: 100%;">
                                <el-option v-for="(item, index) in levelList " :label="item.name" :value="item.value" :key="index"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="select-part-box" v-show="addPartType==1">
						 <span style="float: left;">楼栋名称</span>
						 <div style="height: 38px;float: left;margin:0;border: 1px solid #ccc;border-radius: 3px;padding: 0 10px;width: 276px;margin-bottom: 10px;">
						 	    <el-select v-model="partName" size="mini" class="select-ele" placeholder="请选择" style="width: 100%;">
		                            <el-option v-for="(item, index) in partChildren " :label="item.label" :value="item" :key="index"></el-option>
		                        </el-select>
						 </div>
                        <span style="float: left;">业态</span>
                        <el-input v-model="partName.yeTai" disabled size="mini" class="select-msg-ele" placeholder="请输入"></el-input>
                        <span style="float: left;">编码</span>
                        <el-input v-model="partName.code" size="mini" class="select-msg-ele" placeholder="请输入"></el-input>
                    </div>

                    <div style="float:right;padding-top:20px">
                        <button style="margin-right:20px;" @click="isAddPart=false">关闭</button>
                        <button @click="savePartData(addPartType)">保存</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isUpLoadingShow">
          <div  class="add-part-box" style="z-index:988" @click.stop.prevent="cancelLoading" ></div>
          <div class="add-part" style="z-index:990;min-height:234px;padding-bottom:50px;">
            <p style="margin-bottom:10px;">添加附件</p>
            <div style="max-height:500px;overflow-y:auto;overflow-x:hidden">
                <uploading v-model="uploadingName"   :config="uploadConfig" ref="uploading" ></uploading>
            </div>
            <div style="padding-top:10px;position:absolute;bottom:20px;right: 20px;">
                <button style="margin-right:20px;" @click.stop.prevent="cancelLoading">关闭</button>
                <button @click.stop.prevent="saveFill">保存</button>
            </div>
          </div>
        </div>

     


    </div>
</template>
<script>
// import { lmap } from '../../../static/js/leaflet/lib/map.js';
import { lmap } from './js/leaflet/lib/map.js';
import $ from 'jquery';
import asideItem from '../common/asideItem.vue'
import uploading from '../common/uploading.vue'
export default {
    data(){
        return{
            partFormKey:"t_work_part",
            drawingFormKey:"t_file_draw",
        	addlist:[],
            partAreaObj:{
                SORT_:0
            },
        	listsm:[],
            levelList:[],//层级
        	partName:"",
            uploadingName:'',
            uploadConfig:{
                limit: 10,
                limitSize: 50048576,
                readOnly: false,
                cadToImage:true,
                pdfToImage:true,
                xtype: "test",
                formKey:"t_file_draw",
                accept: ".jpg,.jpeg,.png,.JPG,.JPEG,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.xlsx,.dwg,.pdf",
            },
            isUpLoadingShow:false,
            isAddPart:false,
            models:[],
            model:[],
            type:'',
            leafletLoaded: false,
            isEditFlag: false,
            addPartType:0, //添加部位类型
            imageUrl:"",
            tempPartObj:{},//当前选择部位
            childPartObj:{},//子部位对象
            currentEntity:{},//当前图层对象
            rectangleData:[],//当前图层数据
            partChildren:[],
        }
    },
    watch:{
       '$store.state.selectProjectObj.id':function(val,oldVal){
           this.changeIndex("楼栋管理");
            
        }
    },
    created(){
        this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.$bus.$on('handelDeparts',this.refreshPicture)
        this.changeIndex("楼栋管理");

    },
    beforeDestroy(){
        this.$bus.$off('handelDeparts',this.refreshPicture)
    },
    mounted() {
        this.loadPurposeData();
        this.$store.state.selectProjectNode={};
    },
    components:{uploading,asideItem},
    methods:{
        //获取业态
    	loadPurposeData(){
            this.util.restGet('/api_v1/dic/T_PROJ_PURPOSE/items',null, (res)=> {//成员职位
                this.listsm=res.data
            });
        },
    	handleDelete(index, row) {
            this.addlist.splice(index,1)
        },
        addList(){
            this.util.restGet('/api_v1/construction/inspect/partTree',{projUid:this.$store.state.selectProjectObj.id},(res)=>{
            if(res.status==200&&res.data!=undefined){
                this.model=res.data;
            }else{
                this.model=[];
            }

            });
        },
        downLoadFile(node){//下载附件
            window.open(this.util.getBaseUrl()+"/api_v1/files/"+node.id+"/download?access_token="+this.sessionUtil.getAccessToken());

        },
        saveFill(){
            this.isUpLoadingShow=false
            if(this.uploadConfig.cadToImage){
                this.uploadConfig.filesList = this.uploadConfig.filesList.filter(item=>{
                    return item.suffix !='dwg'
                });
            }
            for (let i = 0; i < this.uploadConfig.filesList.length; i++) {
                 this.uploadConfig.filesList[i].isNewFlag=true;
            }
            this.saveDrawingData();
            
        },
        cancelLoading(){
            this.isUpLoadingShow=false
        },
        changeIndex(str){
            this.getPartList();
            //获取层级数据字典
            this.util.restGet('/api_v1/dic/buildingLevel/items',null, (res)=> {
                if(res.status==200){
                    this.levelList=res.data
                    // this.levelList =[
                    //     {name:"目录",value:"level1"},
                    //     {name:"区域",value:"level2"},
                    //     {name:"层部位",value:"level3"},
                    // ]
                }
                
            });
        },
        getPartList(){
            this.util.mask();
             this.util.restGet('/api_v1/construction/inspect/partTree',{projUid:this.$store.state.selectProjectObj.id},(res)=>{
                this.util.unmask();
                if(res.status==200&&res.data!=undefined){
                    this.models =[{id:"root",label:"根目录",children:res.data}];
                    // this.models.push(res.data);
                    // this.models = res.data;
                }else{
                    this.models =[{id:"root",label:"根目录",children:[]}];
                }

            });

        },
        getPartFullName(itemObj){
            this.tempList.push(itemObj.label);
            if(itemObj.parents!=undefined){
                this.getPartFullName(itemObj.parents);
            }
        },
        refreshPicture(data) {//刷新图纸
            this.yeTai='';
           this.tempList=[];
           this.getPartFullName(data);
           this.tempList.pop();
           data.partFullName=this.tempList.reverse().join(">");
           this.tempPartObj=data;
           this.yeTai=data.yeTai;
           this.tempPartSort= this.tempPartObj.childCount;
           this.imageUrl = data.fileId==undefined? "":this.util.getBaseUrl() + '/api_v1/files/'+data.fileId+'/look?ifThumb=false&access_token='+this.sessionUtil.getAccessToken();
           lmap.remove();
           this.loaded(data.mapData);
        },
        editPart(){//编辑部位
        	//this.$bus.$on('handelDeparts',this.refreshPicture)
             if(this.tempPartObj.id==undefined){
                this.util.error("请先选择部位");
                return;
            }
            this.partAreaObj.NAME_=this.tempPartObj.label;
            this.partAreaObj.YE_TAI_=this.tempPartObj.yeTai;
            this.partAreaObj.CODE_ = this.tempPartObj.code;
            this.partAreaObj.SORT_=this.tempPartObj.sort;
            // this.partAreaObj.LEVEL_=this.tempPartObj.level||"";
            this.$set(this.partAreaObj,"LEVEL_",this.tempPartObj.level||"");
            this.addPartType=0;
            this.isEditFlag=true;
            this.isAddPart=true;

        },
        getChildrenById(dataList,id){
            for(var i=0;i<dataList.length;i++){
                let item=dataList[i];
                if(item.id==id){
                    this.tempPartObj =item;
                    return;
                }else if(item.children&&item.children.length>0){
                    this.getChildrenById(item.children,id);
                }
            }
        },
        addPart(type){//添加部位
            if(type=="root"){
                this.tempPartObj={};
            }
            var snString = "";
            if(this.models[0].children.length==0){
                    snString="01";
            }else if(this.tempPartObj.id&&this.tempPartObj.id!="root"){
                this.getChildrenById(this.models[0].children,this.tempPartObj.id);
                let lastChild = this.tempPartObj.children? this.tempPartObj.children[this.tempPartObj.children.length-1]:this.tempPartObj;//最后一个子节点
                
                var parentCode = this.tempPartObj.code? this.tempPartObj.code:"";
                var snNum =this.tempPartObj.children&&lastChild.code? parseInt(lastChild.code.slice(parentCode.length))+1:1;
                snString = snNum>9? parentCode+snNum:parentCode+"0"+snNum;
            }else{
                let lastChild = this.models[0].children[this.models[0].children.length-1];//最后一个子节点
                var snStr = lastChild.code;
                var snNum = parseInt(snStr? snStr:0)+1;
                snString = snNum>9? snNum:"0"+snNum;
            }
            this.partAreaObj={
                NAME_:"",
                CODE_:snString,
                SORT_: this.tempPartSort==undefined||type=="root"? this.models[0].children.length+1:this.tempPartObj.childCount+1,
                YE_TAI_:this.tempPartObj? this.tempPartObj.yeTai:''
            }
            this.isAddPart=true;
            this.isEditFlag=false;
            this.addPartType=0;
        },
        loadDrawing(){
            if(this.tempPartObj.id==undefined||this.tempPartObj.id=="root"){
                this.util.error("请先选择部位");
                return;
            }
            this.isUpLoadingShow=true
        },
        savePartData(type){//保存部位
            if(type==1){
                if(!this.validUtil.isNotEmpty(this.partName.id)){
                    this.util.error("请选择部位!");
                    return;
                }
                this.childPartObj = this.partChildren.find(item=>item.id===this.partName.id);
                this.currentEntity.entity.partUid=this.childPartObj.id;
                this.currentEntity.entity.title=this.childPartObj.label;
                this.currentEntity.entity.uuid=this.childPartObj.id+"_measure";
                this.rectangleData.push(this.currentEntity.entity);
                lmap.updateText(this.currentEntity);
                this.isAddPart=false;
                return;
            }
            if(!this.validUtil.isNotEmpty(this.partAreaObj.NAME_)){
                this.util.error("请输入部位名称!");
                return;
            }
            if(!this.validUtil.isNotEmpty(this.partAreaObj.CODE_)){
                this.util.error("请输入编码!");
                return;
            }
            if(!this.validUtil.isNotEmpty(this.partAreaObj.YE_TAI_)){
                this.util.error("请选择业态!");
                return;
            }
            
            if(!this.isEditFlag){//新增
                this.partAreaObj.PROJ_UID_ = this.$store.state.selectProjectObj.id;
                this.partAreaObj.PARENT_UID_ = this.tempPartObj.id==undefined? "root":this.tempPartObj.id;
                this.partAreaObj.SN_ = this.partAreaObj.CODE_;
            }
            var params = {formKey:this.partFormKey,mainFormData:JSON.stringify(this.partAreaObj),sqlTableName:"T_WORK_PART",ifSaveWorkflow:false};
            if(this.isEditFlag){//编辑
                params['id']=this.tempPartObj.id;
                params['businessKey']=this.tempPartObj.id;
            }
            this.util.mask("正在保存..");
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                if(res.status==200){
                this.util.successToast('保存成功');
                this.isAddPart=false;
                

                this.getPartList();

                }
                this.util.unmask();
            });
        },
        saveDrawingData(type){//保存图纸
            var mainData={
                NAME_:this.tempPartObj.label+"图纸",
                PROJ_UID_:this.$store.state.selectProjectObj.id,
                AREA_UID_:this.tempPartObj.id,
                PART_NAME_:this.tempPartObj.partFullName,
                SORT_:this.tempPartObj.childCount +1
            }
            if(type==1){
                var mapData =lmap.getData();
                mainData={MAP_DATA_:JSON.stringify(mapData)};
            }
            var params = {formKey:this.drawingFormKey,mainFormData:JSON.stringify(mainData),sqlTableName:"T_DRAWING",ifSaveWorkflow:false};
            let filesData = null;
            if(type==undefined){
                let filesList = this.uploadConfig.filesList;
                console.log("uploadConfig=======>",this.uploadConfig);
                filesData = filesList[0];
                params['filesData']=JSON.stringify([filesData]);
                // params['filesData']=JSON.stringify(this.uploadConfig.filesList);
            }
            if(this.tempPartObj.drawingId!=undefined){
                params['id']=this.tempPartObj.drawingId;
                params['businessKey']=this.tempPartObj.drawingId;
            }
            if(type==undefined&&this.tempPartObj.fileId!=undefined){
                params['deleteFilesData']=JSON.stringify([this.tempPartObj.fileId]);
            }
            this.util.mask("正在保存..");
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.util.successToast('保存成功');
                    this.isAddPart=false;
                    if(type==undefined){
                        this.tempPartObj.fileId=filesData.id;
                        this.tempPartObj.drawingId=res.data.id;
                        this.refreshPicture(this.tempPartObj);
                    }

                    this.getPartList();

                }

            });
        },
        deletePart(){//删除部位
            console.log("tempPartObj========>",this.tempPartObj);
            if(this.tempPartObj.id==undefined){
                this.util.error("请选择要删除的部位!");
                return;
            }
            let deleteStr = "确定要删除该部位吗?";
            if(this.tempPartObj.children){
                deleteStr="该部位包含下级，确定连同下级一起删除吗?";
            }
            this.util.confirm(deleteStr,null,()=>{
                this.util.mask("正在删除..");
                this.util.restDelete("/api_v1/business/project/delete/"+this.tempPartObj.id,{formKey:this.partFormKey},(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.tempPartObj={};
                    this.tempPartSort=undefined;
                    this.util.successToast('删除成功!');
                    this.getPartList();
                }else{
                    this.util.failueToast('删除失败!');
                }
                });
            });
        },
        deleteDrawing(){
            if(this.tempPartObj.drawingId==undefined){
                this.util.error("该部位尚未上传图纸!");
                return;
            }
            this.util.confirm("确定要删除该图纸吗?",null,()=>{
                this.util.mask("正在删除..");
                this.util.restDelete("/api_v1/business/project/"+this.tempPartObj.drawingId,{formKey:this.drawingFormKey},(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.util.successToast('删除成功!');
                    this.tempPartObj.fileId="";
                    this.tempPartObj.mapData="[]";
                    this.refreshPicture(this.tempPartObj);
                }else{
                    this.util.failueToast('删除失败!');
                }


                });
            });
        },
        loaded(mapData) {
        var data = mapData==undefined? []:JSON.parse(mapData);
        this.rectangleData = data;
        if (this.leafletLoaded) {
            // var data =  JSON.parse(data);
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
                'save' : this.onLmapSave
            },
            data: data,
            center: [512, 384],
            bounds: [1024, 768], //坐标范围
            imageUrl: this.imageUrl
            };
            if(this.sessionUtil.isAllowBtn('gc1_4:drawing_edit')){
                config.tools.edit=true
                config.tools.rectangle=true
            }
            lmap.$ = $;
            // lmap.getData();
            lmap.init(this,config);
        }
        },
        onLmapLayerClick(layer){
        },
        onLmapLayerCreated(layer){
            // this.currentEntity=layer.entity;
            this.currentEntity=layer;
            this.isAddPart=true;
            this.partName="";
            this.addPartType=1;
            if(this.tempPartObj.children){
                this.partChildren=this.tempPartObj.children.filter(item=>{
                    return this.rectangleData.findIndex(obj=>obj.partUid===item.id)<0;
                });
            }else{
                this.partChildren=[];
            }
            
        },onLmapSave(data){
            console.info("======onLmapSave=====");
            this.cookieUtil.set('data',JSON.stringify(data));

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
        position: relative;
    }
    .tabs-box{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 10px;
        box-sizing: border-box;
    }

    .news-tabs,
    .tabs{
        width: 100%;
        height: 36px;
        border: 1px solid #44D2FF ;
        box-sizing: border-box;
        padding: 0 10px;
        text-align: center;
    }

    .news-tabs>span,
    .tabs>span{
        width: 78px;
        float: left;
        height: 26px;
        line-height: 26px;
        margin-top: 4px;
        cursor: pointer;
        color: #fff;
        margin-bottom: 10px;
    }
    .tabs>.active,.news-tabs>.active{
        background: url(../../assets/indexImg/select.png) no-repeat  top center;
    }
    .page-proj-index{
        width: 100%;
        height: 100%;
        padding-top: 10px;
        overflow: hidden;
        box-sizing: border-box;
    }
    .page-proj-index>div{
        box-sizing: border-box;
        height: 75%;
        float: left;
    }
    .proj-left{
        padding-right: 10px;
    }
    .proj-right{
        padding-left: 10px;
    }
    .proj-synopsis{
        position: relative;
        padding-top: 198px
    }
    .proj-synopsis,.environment{
        color: #fff;
    }
    .proj-synopsis li{
        text-align: left;
        margin-top: 5px;
    }
    .proj-synopsis-left-box{
        overflow: hidden;
        height: 154px;
    }
    .proj-synopsis-right-box{
        width: 80px;
        float: right;
        box-sizing: border-box;
        padding: 33px 0 0 10px;
    }
    .environment h4 span{
        float: right;
        font-size: 14px;
        font-weight: normal;
        margin-top: 6px;
    }
    .environment li{
        width: 33.3333333333333333%;
        float: left;
        overflow: hidden;
        height: 45px;
    }
    .environment li p{
        text-align: center;
        font-size: 14px;
        color: #44D2FF;
        height: 45px;
        line-height: 22px;
    }
    .environment li p span{
        color: #fff;
        font-size: 18px;
        display: block;
    }
    .locale {
        padding-top: 44px;
        position: relative;
    }
    .locale  h4{
        position: absolute;top: 10px;
    }
    .locale-img-box{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .locale-img-box>img{
        position: absolute;
        top: 50%;
        z-index: 2;
    }
    .locale-msg-box{
        width:100%;overflow:hidden;height:100%
    }
    .no-msg{
        width:100%;color:#fff;font-size:26px;text-align:center;height:100%
    }
    .msg-more{
        background:#ECECEC;
        height:100%;padding:10px;float:left;width:40px;box-sizing:border-box;text-align:center;color:#999;
    }
    .msg-list-box{
        height: 100%;
        transition:all 0.5s;
    }
    .msg-list {
        height: 100%;
        width: 200px;
        margin-right: 14px;
        float: left;
        position: relative;
    }
    .msg-list p{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background:rgba(68,210,255,0.5);
        font-size: 14px;
        height: 24px;
        line-height: 24px;
        color: #FFFFFF;
        position: absolute;
        width: 100%;
        bottom: 0;
    }
    .msg-list i{
        width: 100%;
        height: 100%;
        background: #e7e7e7 ;
        display: inline-block;
        position: relative;
    }
    .msg-list i::after{
        background: url(../../assets/indexImg/nonePic.png) no-repeat center ;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .progress{
        text-align: left;
    }
    .progress p{
        margin: 5px 0;
    }
    .progress p span{
        font-size: 18px;
        color: #FFFFFF;
        float: right;
    }
    .statistics>div{
        float: left;
        width: 50%;
        text-align: left;
        box-sizing: border-box;
    }
    .circle-right p span{
        font-size: 18px;
        color: #FFFFFF;
        display: block;
        margin-top: 5px;
    }
    .page-news-index,.page-diary-index{
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
        padding: 10px 0;
    }
    .page-news-index{
        padding-top: 99px;
    }
    .page-news-index .news-tabs{
        width: 100%;
        position: absolute;
        top: 10px;
        height: 80px;
    }
    .news-content{
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .news-content>div>div{
        width: 25%;
        float: left;
        padding-right: 10px;
        box-sizing: border-box;
    }
    .news-content>div>div:nth-child(4n){
        padding-right: 0;
    }
    .news-tab-item .title,.reading-content{
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 5px;
        text-align: center;
    }
    .reading-content{
        display: block;
        text-align: left;
        font-size: 12px;
    color: #FFFFFF;
    }
    .news-tab-item .belongs{
       font-size: 12px;
        color: #C4C4C4;
        text-align: left;
        margin-bottom: 5px;
    }
    .news-tab-item>img,
    .news-tab-item>i
    {
        width: 100%;
        height: 160px;
    }
    .news-tab-item>i{
        display: inline-block;
        margin-bottom: 5px;
        background: url(../../assets/indexImg/nonePic.png) no-repeat center ;
    }
    .reading-num{
        display: block;
        text-align: left;
        font-size: 12px;
        color: #FFFFFF;
        padding-left: 16px;
        float: left;
        position: relative;
    }
    .reading-num::after{
        width: 16px;
        height: 16px;
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        background: url('../../assets/indexImg/yuedu.png') no-repeat center;
    }
    .page-report-index{
        width: 100%;
        height: 100%;
        padding: 62px 0 10px;
        box-sizing: border-box;
        position: relative;
    }

    .report-header{
        position: absolute;
        top: 10px;
        width: 100%;
        overflow: hidden;
        height: 80px;
        padding-left: 260px;
        box-sizing: border-box;
    }
    .report-header .report-tabs{
        height: 42px;
        margin-bottom: 10px;
        width: 260px;
        float: left;
        position: absolute;
        top: 0;
        left: 0;
    }
    .report-header .report-tabs>span{
        margin : 8px 0;
    }
    .report-header-statistics{
        height: 100%;
        border: 1px solid #44D2FF;
        border-left: 0 none;
        box-sizing: border-box;
        padding: 10px 0 0 10px
    }
    .report-header-statistics p{
        float: left;
        width: 89px;
        font-size: 14px;
        color: #44D2FF;
        text-align: left;
        margin-top: 5px;
    }
    .report-header-statistics p span{
        color: #FFFFFF;
        display: block;
    }
    .report-header-button button,.diary-button button{
        float: right;
        margin-left: 10px;
        margin-top: 5px;
    }
    .report-body{
        width: 100%;
        height: 100%;
        overflow: auto;
        border: 1px solid #44D2FF;
        box-sizing: border-box;
        padding: 44px 10px 10px 10px
    }
    .report-body-item>div{
        float: left;
    }
    .report-item-img{
        width: 50px;
        height: 50px;
        padding: 0 10px;
    }
    .report-item-img img{
        width: 100%;
        height: 100%;
        border-radius: 50%
    }
    .report-item-title p span{
        float: left;
        margin: 2px 0;
        font-size: 14px;
    }
    .report-item-title{
        text-align: left;
    }
    .report-body-item>.item-operate{
        text-align: right;
        float: right;
    }
    .item-operate>div{
        margin: 2px 0;
        font-size: 14px;
        padding-right: 10px;
    }
    .item-operate>p{
        margin: 2px 0;
    }
    .item-operate>p span{
        float: right;
        padding: 0 10px 0 18px;
        position: relative;
    }
    .item-operate>p span::before{
        position: absolute;
        content: '';
        width: 16px;
        height: 16px;
        top: 2px;
        left: 0px;
    }
    .item-operate>p .operate-comment::before{
        /* background: #000; */
        background: url('../../assets/indexImg/comment.png') no-repeat center;
    }
    .item-operate>p .operate-read::before{
        /* background: #000; */
        background: url('../../assets/indexImg/read.png') no-repeat center;
    }
    .item-operate>p .operate-file::before{
        /* background: #000; */
        background: url('../../assets/indexImg/file.png') no-repeat center;
    }
    .page-building-index{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-top: 10px;
    }

    .building-fl{
        width: 300px;
        float: left;
        height: 100%;
    }
    .building-fr{
        overflow:hidden;
        height:100%;
        padding-left: 10px;
        box-sizing: border-box;
    }
    .page-building-index>div>div{
        height: 100%;
    }
    .building-box{
        width: 100%;
        height: 100%;
        padding-top: 55px;
        box-sizing: border-box;
        position: relative;
    }
    .building-box .building-title{
        width: 100%;
        position: absolute;
        width:100%;
        top:10px;
        left:0px;
        box-sizing: border-box;
        padding: 0 10px;
    }
    .building-drawing{
        width: 100%;
        height: 100%;
        background: #fff;
    }
    .add-part-box{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 80;
    }
    .add-part-box .add-part{
        width: 406px;
        position: absolute;
        top: 50%;
        left: 50%;
        background: #fff;
        height: 156px;
        transform: translate(-50%,-50%);
        padding: 10px 20px;
    }
    .add-part p{
        font-size: 18px;
        color: #333;
        text-align: left
    }
    .select-msg-box{
        color: #333;
        line-height: 38px;
        height: 38px;
        margin: 20px 0;
    }
    .select-part-box{
        color: #333;
        margin-top: 20px;
        margin-bottom: 5px;
    }
    .select-msg-ele{
        width: 296px;
        line-height: 38px;
        height: 38px;
        color: #333;
        width: 296px;
        border: 1px solid #ccc;
        border-radius: 1px ;
        box-sizing: border-box;
    }
    .add-part-box button{
        font-size: 14px;
        background: #5C9AD4;min-width: 60px;
        padding: 5px;
        height: 28px;

    }
    .add-page{
        position: relative;
        padding:20px;
        padding-top:66px;
        text-align: left;
        /* color: #fff; */
        background: #fff;
        color: #333;
    }
    .add-page button{
        background: #F08B00;
        color: #fff;
        border:1px solid #F08B00;
    }
    .add-page-button{
        position: absolute;
        top: 20px;
        left: 20px;
        /* display: flex; */
        justify-content: space-between;
        align-items: center;
        width: 1050px;
    }
    .add-page-button>div:nth-of-type(2) button{
        background-color: red;
        border-color: red;
    }
    .add-page-form{
        width:100%;height:100%;overflow:auto
    }
    .add-page-form-title{
        font-size: 18px;
        color: #333;
        text-align: left;
        padding-bottom: 10px;
    }
    .member-box li{
        float: left;
        position: relative;
    }
    .member-box li img{
        width: 42px;
        height: 42px;
    }

    .member-item i{
        position: absolute;
        right: 10px;
        top: -5px;
        background: url(../../assets/indexImg/delete.png) no-repeat center;
        width: 12px;
        height: 12px;
        background-size: cover;
    }
    .clear::after{
        content:"";
        height:0;
        line-height: 0;
        display: block;
        visibility: hidden;
        clear: both;
  }
  .title_text{
    font-size: 18px;
    color:#000;
    margin-bottom: 20px;
  }
    .li_span{
  	padding: 5px 18px;
  	background: #F08B00;
  	border-radius: 3px;
  	color: #fff;
  	margin: 0 10px 0 0 ;

  }
</style>

<style>
	
	
.bg .add-page .el-table, .bg .add-page .el-table thead{
    color: #606266;
    border-color:#ccc;
}
.bg .add-page .el-table--border, .bg .add-page .el-table--group, .bg .add-page .el-table td, .bg .add-page .el-table th.is-leaf{
    border-color:#ccc;
}
.bg .add-page .el-table--border:after, .bg .add-page .el-table--group:after, .bg .add-page .el-table:before{
    background:#ccc;
}
.select-msg-ele.el-select .el-input .el-select__caret.el-input__icon{
    color: #44D2FF;
}

.progress .el-progress-bar .el-progress-bar__inner{
    border-radius: 0 ;
    background-image: linear-gradient(left, #06FCFF 0%, #20A5FF 100%);
}

.el-textarea__inner{
    /*border: 0 none;*/
    min-height:100%!important;
}
.lj_box .el-table .cell, .el-table th div{
	/*text-overflow:clip;*/
}
.lj_box  .el-table .cell{
	/*overflow: auto;*/
}


</style>
<style >
@import "../../../static/js/leaflet/lib/leaflet.css";
@import "../../../static/js/leaflet/lib/leaflet.draw.css";
.tabs a{
	color: #FFF ;
	text-decoration : none;

}
</style>
