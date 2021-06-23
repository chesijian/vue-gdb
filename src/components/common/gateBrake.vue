<template>
    <div class="proj-box" style="padding:40px 0 10px;position:relative; ">
        <button style="position:absolute;right:0px;top:5px;" @click="addEquipment()"  v-if="sessionUtil.isAllowBtn((deviceType==1?'sb3_2':(deviceType==2?'sb2_1':(deviceType==3?'sb1_1':'')))+':btn_add')">添加</button>
       <div>
            <div class="equipment-box" v-for="(item, index) in equipmentList" :key="index">
                <div class="box-style" style="height:100%;width:100%;">
                    <div>
                        <h4 style="overflow:hidden">{{item.title}}
                            <div style="float:right;">
                                <button @click="setEquipment(item)"  v-if="sessionUtil.isAllowBtn((deviceType==1?'sb3_2':(deviceType==2?'sb2_1':(deviceType==3?'sb1_1':'')))+':btn_edit')">设置</button>
                                <button @click="deleteShow(item)"  v-if="sessionUtil.isAllowBtn((deviceType==1?'sb3_2':(deviceType==2?'sb2_1':(deviceType==3?'sb1_1':'')))+':btn_delete')">删除</button>
                            </div>
                        </h4>
                        <!-- 设备状态 设备类型 设备串号 激活日期 是否启用 设备地址 -->
                        <div style="float:right;width:90px;height:90px;" >
                            <img v-if="item.files&&item.files.length>0" :src="util.getBaseUrl() + '/api_v1/files/'+item.files[0].id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt="">
                        </div>
                        <div class="equipment">
                            <p v-if="false"><span style="float:left;margin-right:5px;">设备状态：</span><span>{{item.status=='online'?'在线':(item.status=='offline'?'离线':'')}}</span></p>
                            <p><span style="float:left;margin-right:5px;">设备类型：</span><span>{{initTypeName(item.type)}}</span></p>
                            <p><span style="float:left;margin-right:5px;">{{item.type=='6'? 'appKey：':'设备串号：'}}</span><span>{{item.deviceCode}}</span></p>
                            <p><span style="float:left;margin-right:5px;">激活日期：</span><span>{{item.activateDate}}</span></p>
                            <p><span style="float:left;margin-right:5px;">是否启用：</span><el-switch  v-model="item.enable" :disabled="true" active-color="#13ce66"  inactive-color="#ff4949"></el-switch></p>
                            <p><span style="float:left;margin-right:5px;">设备地址：</span><span>{{item.address}}</span></p>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
            </div>
       </div>
    <el-dialog :visible.sync="dialogForm.visible" :title="dialogForm.title" center
         width="417px" @close="canceldialogForm" class="c3"
         top="5vh">
        <div class="select-msg-box">
          <span style="float:left">设备类型</span>&nbsp;&nbsp;
          <el-input v-if="deviceType!=2&&deviceType!=4" v-model="dialogForm.gateBrake.typeName" size="mini" class="select-msg-ele" :disabled="true" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
          <el-select v-if="deviceType==2||deviceType==4"  class="select-msg-ele" v-model="dialogForm.gateBrake.type">
            <el-option label="闸机" value="2"></el-option>
            <el-option label="展示屏" value="4"></el-option>
            <el-option label="平台对接" value="6"></el-option>
          </el-select>
        </div>
        <div class="select-msg-box" v-if="dialogForm.gateBrake.type==6">
          <span style="float:left">平台名称</span>&nbsp;&nbsp;
          <el-input v-model="dialogForm.gateBrake.title" size="mini" class="select-msg-ele" placeholder="请输入" style="padding-left: 10px;overflow: hidden;"></el-input>
        </div>
        <div class="select-msg-box" v-else>
          <span style="float:left">设备名称</span>&nbsp;&nbsp;
          <el-input v-model="dialogForm.gateBrake.title"  size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
        </div>
        
        <div class="select-msg-box"  v-if="deviceType==2">
          <span style="float:left">{{dialogForm.gateBrake.type==6?'平台地址':'激活码'}}</span>&nbsp;&nbsp;
          <!--type="number"-->
          <el-input v-model="dialogForm.gateBrake.activationCode" size="mini"  class="select-msg-ele"  placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
        </div>
        <div class="select-msg-box">
          <span style="float:left">{{dialogForm.gateBrake.type==6?'appKey':'设备串号'}}</span>&nbsp;&nbsp;
          <el-input v-model="dialogForm.gateBrake.deviceCode" :disabled="dialogForm.editType=='edit'" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
        </div>
        <div class="select-msg-box" v-if="dialogForm.gateBrake.type==6">
          <span style="float:left">端口号</span>&nbsp;&nbsp;
          <el-input v-model="dialogForm.gateBrake.port" size="mini" class="select-msg-ele" placeholder="请输入端口号" style="padding-left: 10px;overflow: hidden;"></el-input>
        </div>
        <div class="select-msg-box" style="display: flex;">
          <span style="float:left">地图选点</span>&nbsp;&nbsp;
            <div @click="addressObj.addressVisible=true" class="select-msg-ele" style="padding-left: 10px;overflow: hidden;">
                {{dialogForm.gateBrake.address}}
              </div>
        </div>

  
        <div class="select-msg-box">
          <span style="float:left">是否启用</span>&nbsp;&nbsp;
           <el-switch  v-model="dialogForm.gateBrake.enable"  active-color="#13ce66"  inactive-color="#ff4949"></el-switch>
        </div>
        <div class="select-msg-box" style="height:auto;">
          <span style="float:left">上传图片</span>&nbsp;&nbsp;
          <div>
            <uploading ref="seeLoadFile"  :config="uploadConfig"></uploading>
          </div>
        </div>
        <div style="display: flex;">
          <button style="margin-left: auto;color: white;width: 60px;height: 28px;background-color: rgba(92,154,212,1);border: none;" @click="canceldialogForm">取 消</button>
          <button style="margin-left:10px;color: white;width: 60px;height: 28px;background-color: rgba(92,154,212,1);border: none;" @click="confirmDialogForm">确 定</button>
        </div>
    </el-dialog>
    <el-dialog
        :title="deleteObj.deleteMsg1"
        :visible.sync="deleteObj.dialogVisible"
        width="30%">
        <p>{{deleteObj.deleteMsg2}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteObj.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteEquipment">确 定</el-button>
        </span>
      </el-dialog>

	    <ChooseAddress style="z-index:9808" v-show="addressObj.addressVisible" ref="chooseAddress" :address="addressObj" @chooseAddress="chooseAddress($event)"></ChooseAddress>
    </div>
</template>
<script>
import uploading from './uploading.vue'
import ChooseAddress from '@/components/common/ChooseAddress.vue'
export default {
    props:['equipmentList','deviceType'],
    data() {
        return {
            deleteNode:{},
            addressObj:{addressVisible: false},
            deleteObj:{
                dialogVisible:false,
                deleteMsg1:'',
                deleteMsg2:'',
            },
            uploadConfig: {
            limit: 1,//限制附件上传个数
            limitSize: 52428800,//50mb单个附件上传大小
            readOnly: false,//是否只读
            multiple: false,//是否允许多选
            xtype: 'device_'+this.deviceType,//同一个表单区别多个附件上传块
            accept: '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP',//允许上传文件类型
            acceptMsg: '只能传图片',//提示信息
            },
            dialogForm: {//编辑浮窗
                visible: false,//是否显示浮窗
                title: '',
                editType: '',//add、edit、
                editId: '',
                gateBrake: {
                    deviceCode: '',//设备串口
                    title: '',//设备名称
                    activateDate: '',
                    enable: false,//是否启用，1表示启用，0表示未启用
                    typeName:this.deviceType==1? '扬尘监测仪':(this.deviceType==3?'视频监测仪':''),
                    type: this.deviceType,//设备类型，目前：1表示扬尘监测仪，2表示闸机
                    lng: '',
                    lat: '',
                    address: '',
                    ip: '',
                    appVersion: '',
                    projUid: '',
                    description: '',
                    sort: '',
                    filesList: '',
                    deleteFilesList: '',
                },
            },
        }
    },
    created(){
        this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'))
    },
    watch: {
      '$store.state.selectProjectObj.id': function (val, oldVal) {
        this.loadData()
      }
    },
    components:{
        uploading,ChooseAddress
    },
    methods:{
        initTypeName(value){//初始化设备类型名称
            if(value=="1"){
              return "扬尘监测仪";
            }else if(value=="2"){
              return "闸机";
            }else if(value=="3"){
              return "视频设备";
            }else if(value=="4"){
              return "展示屏";
            }else if(value=="6"){
                return "平台对接";
            }
        },
        initPlatformName(value){
            if(value==1){
                this.dialogForm.gateBrake.title="佛山住建管理平台";
            }else if(value==2){
                this.dialogForm.gateBrake.title="深圳住建管理平台";
            }
        },
        chooseAddress(data){//选择项目地址回调
            var location =  data.addressLocation;
            this.dialogForm.location = location;
            this.dialogForm.gateBrake.address = data.address;
            // this.form.ADDR_PROVINCE_ = data.province;
            // this.form.ADDR_CITY_ = data.city;
            // this.form.ADDR_COUNTY_ = data.county;

        },
        addEquipment(){
             this.dialogForm={//编辑浮窗
                visible: true,//是否显示浮窗
                title: '添加设备',
                editType: 'add',//add、edit、
                editId: '',
                gateBrake: {
                    deviceCode: '',//设备串口
                    title: '',//设备名称
                    activateDate: '',
                    enable: false,//是否启用，1表示启用，0表示未启用
                    typeName:this.deviceType==1? '扬尘监测仪':(this.deviceType==3?'视频监测仪':''),
                    type: this.deviceType,//设备类型，目前：1表示扬尘监测仪，2表示闸机
                    lng: '',
                    lat: '',
                    address: '',
                    ip: '',
                    appVersion: '',
                    projUid: '',
                    description: '',
                    sort: '',
                    filesList: '',
                    deleteFilesList: '',
                },
            };
            this.$nextTick(() => {
              this.$refs.seeLoadFile.loadData()
            })
        },
        setEquipment(node){
             this.util.restGet('/api_v1/modules/check_devices/'+node.id, null, (res) => {
                if (res.status == 200) {
                  this.dialogForm.visible=true;
                  this.dialogForm.title='编辑设备';
                  this.dialogForm.editType='edit';
                  this.dialogForm.editId=res.data.id;
                  this.dialogForm.gateBrake=res.data;
                       res.data.type==1?this.dialogForm.gateBrake.typeName='扬尘监测仪':this.dialogForm.gateBrake.typeName='视频监测仪';
                  res.data.enable==1?this.dialogForm.gateBrake.enable=true:this.dialogForm.gateBrake.enable=false;
                  this.$nextTick(() => {
                    this.$refs.seeLoadFile.loadData(res.data.id)
                  })
                } else {
                  this.util.error(res.errorMsg)
                }
            })
        },
        deleteShow(node){
            this.deleteNode=node
            this.deleteObj.dialogVisible=true
            this.deleteObj.deleteMsg1='确定删除？'
            this.deleteObj.deleteMsg2='此操作不可逆，请谨慎操作'
        },
        deleteEquipment(){
            this.util.restDelete('/api_v1/modules/check_devices/'+this.deleteNode.id, null, (res) => {
                if (res.status == 200) {
                    this.$emit('msgOut')
                    this.util.success('删除成功')
                    this.deleteObj.dialogVisible=false
                } else {
                    this.util.error(res.errorMsg)
                }
            })
        },
        canceldialogForm(){
          this.$refs.seeLoadFile.clearArr();
          this.dialogForm.visible=false;
        },
        confirmDialogForm () {
            if (this.dialogForm.editType == 'add') {
                var _this = this;
                this.dialogForm.gateBrake.enable?this.dialogForm.gateBrake.enable=1:this.dialogForm.gateBrake.enable=0
                var params = this.dialogForm.gateBrake;
                params.projUid = this.$store.state.selectProjectObj.id
                //处理附件
                var filesList = this.uploadConfig.filesList
                if (filesList.length != 0) {
                    params.addFilesList = filesList
                }
                 var delFilesList =this.uploadConfig.deleteFilesList//删除的附件
                params.delFilesList = delFilesList
                params.deviceInfo = JSON.stringify(params)
                this.util.restPost('/api_v1/modules/check_devices', params, (res) => {
                    if (res.status == 200) {
                    this.util.success('新增成功')
                    this.$emit('msgOut')
                    _this.canceldialogForm()
                    } else {
                    _this.util.error(res.errorMsg)
                    }
                })
            } else if (this.dialogForm.editType == 'edit') {
                var _this = this;
                this.dialogForm.gateBrake.enable?this.dialogForm.gateBrake.enable=1:this.dialogForm.gateBrake.enable=0
                // this.dialogForm.gateBrake.type=this.deviceType
                var params = this.dialogForm.gateBrake;
                params.projUid = this.$store.state.selectProjectObj.id;
                // params.projUid = 'cfa27678e0164beea37027f1173ba99d'//测试用
                //处理附件
                var filesList
                this.$nextTick(() => {
                    this.$refs.seeLoadFile.getFilesList()
                    filesList = this.uploadConfig.filesList
                    if (filesList.length != 0) {
                        params.addFilesList = filesList
                    }
                    var delFilesList =this.uploadConfig.deleteFilesList//删除的附件
                    params.delFilesList = delFilesList
                    params.deviceInfo = JSON.stringify(params);
                    console.log(params)
                    this.util.restPut('/api_v1/modules/check_devices/'+this.dialogForm.gateBrake.id, params, (res) => {
                        if (res.status == 200) {
                        _this.util.success('修改完成')
                        this.$emit('msgOut')
                        _this.canceldialogForm()
                        this.uploadConfig.deleteFilesList=[]
                        this.uploadConfig.filesList=[]
                        // this.loadTeamData();
                        //TODO 适配缓存的选择班组，并刷新右侧班组人员
                        } else {
                        _this.util.error(res.errorMsg)
                        }
                    })
                  })


            }
        },
    }
}
</script>
<style scoped>
.equipment-box{
    width: 33.33333%;
    height: 233px;
    padding-right: 10px;
    box-sizing: border-box;
    float: left;
}
.equipment-box:nth-child(3n){
    padding-right: 0px;
}
.equipment{
    overflow: hidden;
    padding-left: 0;
    box-sizing: border-box;
}
.equipment>p{
    text-align: left;
    overflow: hidden;
    box-sizing: border-box;
    padding: 3px 0px;
}
.select-msg-box>span{
  width: 56px;
}
.select-msg-ele {
    line-height: 38px;
    height: 38px;
    color: #333;
    width: 296px;
    border: 1px solid #ccc;
    border-radius: 1px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
</style>
