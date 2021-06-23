<template>
    <div class="proj-box" :style="{paddingTop:createType==1||createType==2?'46px':'36px'}">
        <div class="tabs-box">
            <div class="tabs head_tabs">
                <span @click="changeType(0)" :class="{active:createType==0}">首页</span>
                <span @click="changeType(1)" :class="{active:createType==1}" v-if="sessionUtil.isAllowBtn('sb4_1:view')">检测数据</span>
                <span @click="changeType(2)" :class="{active:createType==2}" v-if="sessionUtil.isAllowBtn('sb4_2:view')">监测点管理</span>
            </div>
        </div>
      <!--//首页-->
        <div  v-if="createType==0" style="height:100%;">
            <div class="type1" style="">
              <div style="position:absolute;top:10px;left:10px;">
                <h4 style="float:left;margin-right: 30px;">监测点</h4>
                <div style="float:left;" class="select-box">
                  <el-select v-model="deviceUid" placeholder="请选择" size="mini" class="select-ele" style="width:250px"  @change="changeTypess">
                    <el-option v-for="item in deviceArr"  :key="item.installationSite" :label="item.installationSite" :value="item.installationSite">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="type1-body">
                <div class="type1-body-left">
                  <div class="box-style" style="height:50%">
                    <div>
                      <h4 >驾驶员信息</h4>
                      <div class="driver-box" style="margin-top:20px;">
                        <div class="driver-buddha">
                          <img src="../../assets/indexImg/pic.png" alt="">
                        </div>
                        <div class="driver-msg">
                          <p style="margin-top:-3px"><span>姓名：</span><span>&nbsp;{{deviceInfo.driver}}</span></p>
                          <p><span>年龄：</span><span>&nbsp;{{deviceInfo.driverAge}}</span></p>
                          <p><span>证件：</span><span>&nbsp;{{deviceInfo.driverCertificate}}</span></p>
                        </div>
                      </div>
                      <div class="driver-box" style="margin-top:20px;">
                        <div class="driver-buddha">
                          <img src="../../assets/indexImg/pic.png" alt="">
                        </div>
                        <div class="driver-msg">
                          <p style="margin-top:-3px"><span>姓名：</span><span>&nbsp;{{deviceInfo.commander}}</span></p>
                          <p><span>年龄：</span><span>&nbsp;{{deviceInfo.commanderAge}}</span></p>
                          <p><span>证件：</span><span>&nbsp;{{deviceInfo.commanderCertificate}}</span></p>
                        </div>
                      </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                  </div>
                  <div class="box-style" style="height:50%">
                    <div>
                      <h4 >设备信息</h4>
                      <div class="equipment-msg">
                        <p style="margin-top:-3px"><span>设备名称：</span><span>&nbsp;{{deviceInfo.deviceName}}</span></p>
                        <p><span>设备编号：</span><span>&nbsp;{{realTimeInfo.deviceCode}}</span></p>
                        <p><span>型号规格：</span><span>&nbsp;{{deviceInfo.modelSpec}}</span></p>
                        <p><span>生产厂家：</span><span>&nbsp;{{deviceInfo.manufacturer}}</span></p>
                        <p><span>安装单位：</span><span>&nbsp;{{deviceInfo.installationUnit}}</span></p>
                      </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                  </div>
                </div>
                <div class="type1-body-center">
                  <div class="box-style ">
                    <div>
                      <div class="crane-bg" ref="boxHeight" :style="{backgroundSize: (706*craneBg)+'px '+(563*craneBg)+'px'}">
                        <!-- <img src="../../assets/indexImg/pic.png" width="100%" alt=""> -->
                      </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                  </div>
                </div>
                <div class="type1-body-right">
                  <div class="box-style ">
                    <div style="position:relative;">
                      <h4 >运行监控
                        <span style="float:right;font-size:14px;line-height:24px">风速(m/s)：{{realTimeInfo.windSpeed}}</span>
                      </h4>
                      <div class="supervise-msg">
                        <p style="margin-top:2px"><span>安全吊重(t)：</span><span>&nbsp;{{realTimeInfo.currAllowLoad}}</span></p>
                        <p><span>前臂长(m)：</span><span>&nbsp;{{realTimeInfo.boomLength}}</span></p>
                        <p><span>塔吊高(m)：</span><span>&nbsp;{{realTimeInfo.towerHatHeig}}</span></p>
                        <p><span>载重(t)：</span><span>&nbsp;{{realTimeInfo.load}}</span></p>
                        <p><span>幅度(m)：</span><span>&nbsp;{{realTimeInfo.range}}</span></p>
                        <p><span>高度(m)：</span><span>&nbsp;{{realTimeInfo.height}}</span></p>
                        <p><span>角度(°)：</span><span>&nbsp;{{realTimeInfo.rotation}}</span></p>
                      </div>
                      <div class="ratio">
                        <div class="circle-left" style="text-align:center;padding-right:20px;color:#FFFDF4">
                            <el-progress type="circle" :width="90" :stroke-width="10" :percentage="realTimeInfo.loadPercentage"></el-progress>
                            <p>载重比</p>
                        </div>
                        <p style="white-space: nowrap;right: 10px;position: absolute;bottom: 0px;">{{realTimeInfo.uploadTime}}</p>
                      </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                  </div>
                </div>
              </div>
            </div>
        </div>
      <!--//监测数据-->
        <div v-show="createType==1" class="box-style" style="height:100%;">
          <div style="height:100%;padding-bottom: 80px;box-sizing: border-box;">
            <div class="mon_head clear">
              <div class="mon_head_t"><h4>监测点</h4></div>
              <div style="margin-right: 30px" class="select-box">
                <el-select v-model="value" placeholder="请选择" size="mini" class="select-ele" style="width:250px"  @change="changeTypess">
                  <el-option v-for="item in deviceArr"  :key="item.installationSite" :label="item.installationSite" :value="item.installationSite">
                  </el-option>
                </el-select>
              </div>
              <div>
                <div style="padding-top: 2px;color:rgba(68,210,255,1);margin-right: 6px;">时间选择</div>
                <div style="width:100px;background-color: rgba(255,255,255,0.2);overflow: hidden;">
                   <el-date-picker
                      v-model="startDate"
                      type="date"
                      style="background:transparent"
                      :editable="false"
                      :clearable="false"
                      prefix-icon="none"
                      clear-icon="none"
                      size="mini"
                      value-format="yyyy-MM-dd"
                      @change="changeType(1)"
                      >
                    </el-date-picker>
                </div>
                <div style="margin:0 10px;padding-top: 5px;">~</div>
                <div style="width:100px;background-color: rgba(255,255,255,0.2);    overflow: hidden;">
                   <el-date-picker
                      v-model="endDate"
                      type="date"
                      style="background:transparent"
                      :editable="false"
                      :clearable="false"
                      prefix-icon="none"
                      clear-icon="none"
                      size="mini"
                      value-format="yyyy-MM-dd"
                      @change="changeType(1)"
                     >
                    </el-date-picker>
                </div>
              </div>
              <button style="float:right;" @click="loadFile()" v-if="sessionUtil.isAllowBtn('sb4_1:export')">导出</button>
            </div>
            <div class="tabls_com" ref="tablebox"  style="height:100%;">
              <el-table :data="tableData" :height="tableHeightNum" border >
                <el-table-column prop="uploadTime" label="时间"  width="141px">
                </el-table-column>
                <el-table-column prop="deviceName" label="设备名称" >
                </el-table-column>
                <el-table-column prop="towerCraneNum" label="设备编号" >
                </el-table-column>
                <el-table-column prop="currAllowLoad" label="安全吊重" width="80">
                </el-table-column>
                <el-table-column prop="boomLength" label="前臂长(m)"  width="85">
                </el-table-column>
                <el-table-column prop="towerHatHeig" label="塔吊高(m)" width="85" >
                </el-table-column>
                <el-table-column prop="load" label="载重(t)" width="80">
                </el-table-column>
                <el-table-column prop="range" label="幅度(m)" width="80" >
                </el-table-column>
                <el-table-column prop="height" label="高度(m)" width="80" >
                </el-table-column>
                <el-table-column prop="rotation" label="角度(°)" width="80">
                </el-table-column>
                <!-- <el-table-column prop="wd" label="力矩比" width="85">
                </el-table-column> -->
                <el-table-column prop="loadPercentage" label="载重比" width="85">
                </el-table-column>
              </el-table>
              <div>
                <div style="text-align: right;">
                  <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
          <i class="box-style-top-left"></i>
          <i class="box-style-top-right"></i>
          <i class="box-style-bottom-left"></i>
          <i class="box-style-bottom-right"></i>
        </div>

        <div v-if="createType==2"  style="height:100%;width:100%;padding:36px 0 0 ;" class="proj-box">
          <button style="position:absolute;right:0px;top:5px;" @click="addEquipment()"  v-if="sessionUtil.isAllowBtn('sb4_2:btn_add')">添加</button>
          <div>
            <div class="equipment-box" v-for="(item, index) in equipmentList" :key="index">
                <div class="box-style" style="height:100%;width:100%;text-align:left;">
                    <div>
                        <h4 style="overflow:hidden">{{item.installationSite}}
                            <div style="float:right;">
                                <button @click="setEquipment(item)"  v-if="sessionUtil.isAllowBtn('sb4_2:btn_edit')" >设置</button>
                                <button @click="deleteShow(item)"   v-if="sessionUtil.isAllowBtn('sb4_2:btn_delete')">删除</button>
                            </div>
                        </h4>
                        <!-- 在线 塔式起重机 QTZ80(JL6011-6)塔式起重机 DFS436SH 朗廷览江大厦南塔1#楼 广州市高新技术产业开发区科学城 彩频路11号广东软件园D栋 -->
                        <div style="float:right;width:90px;height:90px;" >
                            <img v-if="item.files&&item.files.length>0" :src="util.getBaseUrl() + '/api_v1/files/'+item.files[0].id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt="">
                        </div>
                        <div class="equipment-msg ">
                          <p v-if="false" style="margin-top:-3px"><span>设备状态：</span><span>&nbsp;{{item.status=='online'?'在线':(item.status=='offline'?'离线':'')}}</span></p>
                          <p><span>设备类型：</span><span>&nbsp;塔式起重机</span></p>
                          <p><span>设备名称：</span><span>&nbsp;{{item.title}}</span></p>
                          <p><span>设备串号：</span><span>&nbsp;{{item.deviceCode}}</span></p>
                          <p><span>安装位置：</span><span>&nbsp;{{item.installationSite}}</span></p>
                          <p><span>设备地址：</span><span>&nbsp;{{item.address}}</span></p>
                          <p><span>是否启用：</span><el-switch  v-model="item.enable" :disabled="true" active-color="#13ce66"  inactive-color="#ff4949"></el-switch></p>
                        </div>

                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
              </div>
          </div>
        </div>
      <div v-if="addPartObj.isAddPart">
        <div  class="add-part-box" @click.stop.prevent="cancel" ></div>
        <div class="add-part" style="text-align:left;width: 852px;">
            <p>设备信息</p>
              <div style="overflow:hidden;">
                <div class="select-msg-box" >
                  <span style="float:left" class="must">设备名称</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.title" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                <div class="select-msg-box" >
                  <span style="float:left">设备类型</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.types" :disabled="true" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;background:#f5f7fa"></el-input>
                </div>
                <div class="select-msg-box">
                  <span style="float:left" class="must">设备串号</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.deviceCode" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                  <div class="add-flag" v-if="addPartObj.node.isaddFlag">
                    <span >该设备号未在平台授权出厂</span>
                  </div>
                </div>
                <div class="select-msg-box" >
                  <span style="float:left" class="must">安装位置</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.installationSite" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                <div class="select-msg-box" >
                  <span style="float:left">型号规格</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.modelSpec" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                <div class="select-msg-box" >
                  <span style="float:left">是否启用</span>&nbsp;&nbsp;
                  <el-switch  v-model="enables"  active-color="#13ce66"  inactive-color="#ff4949"></el-switch>
                </div>
                <div class="select-msg-box" >
                  <span style="float:left">生产厂家</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.manufacturer" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                <div class="select-msg-box" >
                  <span style="float:left">安装单位</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.installationUnit" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
              </div>
              <div style="overflow:hidden">

                <div class="select-msg-box" >
                  <span style="float:left">驾驶员</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.driver" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                <div class="select-msg-box" >
                  <span style="float:left">年龄</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.driverAge" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                <div class="select-msg-box" >
                  <span style="float:left">驾驶证件</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.driverCertificate" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                <div>
                <div class="select-msg-box" >
                  <span style="float:left">指挥员</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.commander" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                <div class="select-msg-box" >
                  <span style="float:left">年龄</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.commanderAge" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                <div class="select-msg-box" >
                  <span style="float:left">指挥证件</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.commanderCertificate" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                <div class="select-msg-box" style="width:100%;padding-right: 23px;">
                  <span style="float:left">地图选点</span>&nbsp;&nbsp;
                  <el-input v-model="addPartObj.node.address" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
              </div>
              <div style="text-align:center">
                <uploading :config="uploadConfig" ref="seeLoadFile" ></uploading>
              </div>
            <div style="float:right;padding-top:10px">
                <button style="margin-right:20px;" @click.stop.prevent="cancel">关闭</button>
                <button @click.stop.prevent="saveMsg">保存</button>
            </div>
        </div>
      </div>
    </div>


      <el-dialog
        :title="deleteObj.deleteMsg1"
        :visible.sync="deleteObj.dialogVisible"
        width="406px">
        <p>{{deleteObj.deleteMsg2}}<br/><span style="color:#FF4848">{{deleteObj.deleteMsg3}}</span></p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteObj.dialogVisible = false">取 消</el-button>
          <el-button style="background:#FF4848;color:#fff" @click="deleteEquipment">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
import uploading from '../common/uploading.vue'
import ChooseAddress from '../common/ChooseAddress.vue'
export default {
    data(){
        return {
          enables:false,
          addPartObj:{
            isAddPart:false,
            node:{
              isaddFlag:false,
              type:5,
              types:'塔式起重机'
            },
          },
          dialogForm:{
            visible:false,
            title:'设备信息',
            node:{},
          },
          deleteObj:{
            dialogVisible:false,
            deleteMsg1:'',
            deleteMsg2:'',
            deleteMsg3:'',
            node:{}
          },
          uploadConfig: {
            limit: 1,//限制附件上传个数
            limitSize: 52428800,//50mb单个附件上传大小
            readOnly: false,//是否只读
            multiple: false,//是否允许多选
            xtype: 'device_5',//同一个表单区别多个附件上传块
            accept: '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP',//允许上传文件类型
            acceptMsg: '只能传图片',//提示信息
          },
            equipmentList:[],
            startDate:'',
            deviceUid:'',
            endDate:'',
            createType:0,
            value:'',
            boxObj:{
                ws:0,
                temp:0,
                hum:0,
                pm10:0,
                pm25:0,
                wd:0,
                tsp:0,
                bp:0,
            },
          deviceInfo:{},
          realTimeInfo:{},
          tableData: [],
          deviceArr: [],
          pageSize:10,
          pageIndex:1,
          total:0,
          craneBg:0,
          tableHeightNum:0,
          currentPage:1
        }
    },
    components:{
      uploading,ChooseAddress
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'))
      let date=new Date()
      var sd=date.format('yyyy-MM')
      this.startDate=sd+'-01'
      this.endDate=date.format('yyyy-MM-dd')
    },
    mounted(){
        var date=new Date()
        this.loadData()
        this.$nextTick(()=>{
          var num=0,flag=true;
          var b=this.$refs.boxHeight.offsetWidth
          var a=this.$refs.boxHeight.offsetHeight
          while (flag){
            if(b>706*num||a>563*num){
              num=num+0.1
            }else{
              flag=false;
            }
          }
          this.craneBg=num
        })
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
            this.changeType(this.createType)
        }
    },
    computed:{
    },
    methods:{
      loadFile(){
        window.open(this.util.getBaseUrl()+'/api_v1/modules/towerCrane/exportRealTime?projUid='+this.$store.state.selectProjectObj.id+'&installationSite='+this.value+'&startDate='+this.startDate+'&endDate='+this.endDate+'&type=5&access_token='+this.sessionUtil.getAccessToken())
      },
      cancel(){
        this.$refs.seeLoadFile.clearArr();
        this.addPartObj.isAdd=false
        this.addPartObj.isAddPart=false
        this.addPartObj.node={
          isaddFlag:false,
          type:5,
          types:'塔式起重机',
          enables:false,
          enable:0,
        }
      },
      saveMsg(){
        if(!this.validUtil.isNotEmpty(this.addPartObj.node.title)){
              this.util.error('请输入设备名称')
              return;
            }
        if(!this.validUtil.isNotEmpty(this.addPartObj.node.deviceCode)){
              this.util.error('请输入设备串号')
              return;
            }
        if(!this.validUtil.isNotEmpty(this.addPartObj.node.installationSite)){
              this.util.error('请输入安装位置')
              return;
            }
        if(this.addPartObj.isAdd){
          this.addPartObj.node.enable=this.enables?1:0
          this.addPartObj.node.ip='';
          this.addPartObj.node.appVersion='';
          this.addPartObj.node.projUid=this.$store.state.selectProjectObj.id;
          this.addPartObj.node.description='';
          this.addPartObj.node.activationCode='';
          this.addPartObj.node.sort='';
          this.addPartObj.node.addFilesList=this.uploadConfig.filesList
          this.util.restPost('/api_v1/modules/check_devices',this.addPartObj.node,(res)=>{
            if(res.status==200){
                this.util.success('添加成功');
                this.changeType(this.createType)
                this.cancel()
              }else{
                this.util.error(res.errorMsg)
              }
          })
        }else{
          this.addPartObj.node.enable=this.enables?1:0
           var _this = this;
            var params = this.addPartObj.node;
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
                    this.util.restPut('/api_v1/modules/check_devices/'+this.addPartObj.node.id, params, (res) => {
                        if (res.status == 200) {
                        _this.util.success('修改完成')
                        this.changeType(this.createType)
                        this.cancel()
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
      setEquipment(node){
         this.util.restGet('/api_v1/modules/check_devices/'+node.id,null,(res)=>{
          if(res.status==200){
            console.log(res.data)
            this.addPartObj.node=res.data
            this.addPartObj.node.isaddFlag=false
            this.addPartObj.node.type=5
            this.addPartObj.node.types='塔式起重机'
            this.enables=res.data.enable==1?true:false;
            this.$nextTick(() => {
              this.$refs.seeLoadFile.loadData(res.data.id)
            })
            this.addPartObj.isAdd=false
              // this.util.success('添加成功');
              // this.changeType(this.createType)
              // this.cancel()
            }else{
              this.util.error(res.errorMsg)
            }
        })
        this.addPartObj.isAddPart=true
      },
      addEquipment(){
        this.addPartObj.isAddPart=true
        this.addPartObj.isAdd=true
        this.$nextTick(() => {
          this.$refs.seeLoadFile.loadData()
        })
      },
      deleteShow(node){
        this.deleteObj={
            dialogVisible:true,
            deleteMsg1:'删除设备',
            deleteMsg2:'确定删除该设备吗?',
            deleteMsg3:'此操作不可逆!!!',
            node:node
          };
      },
      deleteEquipment(){
         this.util.restDelete('/api_v1/modules/check_devices/'+this.deleteObj.node.id,null,(res)=>{
                if(res.status==200){
                    this.util.success('删除成功');
                    this.changeType(this.createType)
                    this.deleteObj.dialogVisible=false
                }else{
                    this.util.error(res.errorMsg)
                }
            })
      },
      handleCurrentChange(val){
        this.pageIndex=val;
        this.jianceshuju();
      },
      changeTypess(id){
        this.deviceUid=id
        this.value=id
        if(this.createType==1){
          this.jianceshuju()
        }else if(this.createType==0){
           this.homeData()
        }
      },
      changeType(num){
        this.createType=num;
        if(num==1){
          this.$nextTick(()=>{
            this.tableHeightNum=this.$refs.tablebox.offsetHeight
          })
          }
        if(num==0||num==1){
            this.util.restGet('/api_v1/modules/towerCrane/installationSite',{projUid:this.$store.state.selectProjectObj.id,type:5},(res)=>{
                console.log(res)
                if(res.status==200){
                  if(res.data){
                    this.deviceArr=res.data
                    this.deviceUid=res.data[0].installationSite
                    this.value=res.data[0].installationSite
                    this.changeTypess(res.data[0].installationSite)
                  }else{
                    this.deviceArr=[]
                    this.deviceUid=''
                    this.value=''
                  }
                    // this.changeTypess(res.data[0].installationSite)
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        }else if(num==2){
        let params = {
          type: '5',
          pageNum: 1,
          pageSize: 100000,
        }
        params.projUid = this.$store.state.selectProjectObj.id;
        var _this = this
        this.util.restGet('/api_v1/modules/check_devices', params, (res) => {
          console.log(res)
          if (res.status == 200) {
           if(res.data&&res.data.length>0){
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].enable==1?res.data[i].enable=true:res.data[i].enable=false
              }
              this.equipmentList=res.data
           }else{
              this.equipmentList=[]
           }
          } else {
            this.util.error(res.errorMsg)
          }
        })
        }
      },
      homeData(){
            this.util.restGet('/api_v1/modules/towerCrane/homePage',{projUid:this.$store.state.selectProjectObj.id,type:5,installationSite:this.deviceUid},(res)=>{
                console.log(res)
                if(res.status==200){
                  if(res.data){
                    this.deviceInfo=res.data.deviceInfo
                    this.realTimeInfo=res.data.realTimeInfo
                    this.$forceUpdate()
                  }else{
                    this.deviceInfo={}
                    this.realTimeInfo={}
                  }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
      },
      jianceshuju(){
         let params={
                projUid:this.$store.state.selectProjectObj.id,
                type:5,
                installationSite:this.value,
                startDate:this.startDate,
                endDate:this.endDate,
                pageSize:this.pageSize,
                pageIndex:this.pageIndex,
            }
            this.util.restGet('/api_v1/modules/towerCrane/realTime',params,(res)=>{
                console.log(res)
                if(res.status==200){
                  if(res.data){
                    this.tableData=res.data;
                    this.total=res.totalCount;
                  }else{
                    this.tableData=[]
                     this.total=res.totalCount;
                  }

                }else{
                    this.util.error(res.errorMsg)
                }
            })
      },
        loadData(){
            this.changeType(0)
        },
    }
}
</script>

<style scoped>
    .proj-box{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding:  10px ;
        color: #fff;
        font-size: 14px;
        padding-top: 46px;
        position: relative;
        overflow: auto;
    }
    .head_tabs span{
      margin-right: 12px;
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

  /*//检测数据style*/
    .mon_head{
      margin-bottom: 15px;
    }
    .mon_head div{
      float: left;
    }
    .mon_head_t{
      margin-right: 20px;
    }
    .mon_head_t h4{
      margin-bottom: 0;
    }
    .clear::after{
      content:"";
      height:0;
      line-height: 0;
      display: block;
      visibility: hidden;
      clear: both;
    }
  .type1{
    border:1px solid #44D2FF;border-top:0 none;height:100%;widht:100%;box-sizing:border-box;
    padding:45px 10px 0;position:relative;
  }
  .type1-body{
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .type1-body>div,.type1-body>div>div{
    height: 100%;
  }
  .type1-body .type1-body-center{
    /* width: 726px;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%,0); */
    float: left;
    width: 60%;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .type1-body .type1-body-left{
    float: left;
    width: 20%;
    box-sizing: border-box;
  }
  .type1-body .type1-body-right{
    float: right;
    width: 20%;
    box-sizing: border-box;
  }
  .crane-bg{
    height:100%;width:100%;overflow:hidden;
    background:url(../../assets/indexImg/pic.png) no-repeat bottom left;
  }
  .driver-buddha{
    width: 70px;
    height: 60px;
    float: left;
    padding-right: 10px;
    box-sizing: border-box;
  }
  .driver-buddha img{
    border-radius: 50%;width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .driver-msg,.equipment-msg,.supervise-msg{
    overflow: hidden;
    text-align: left;
  }
  .driver-msg p,
  .supervise-msg p,
  .equipment-msg p
  {
    margin: 2px 0;
    position: relative;
    padding-left: 42px;
    box-sizing: border-box;
    line-height: 20px
  }
  .supervise-msg p{
    line-height: 30px;
  }
  .equipment-msg p{
    padding-left: 69px;
  }

  .supervise-msg p{
    padding-left: 90px;
  }
  .driver-msg p span,.equipment-msg p span,.supervise-msg p span{
    display: block;
    word-break: break-all;
    /* word-wrap: break-word; */
    width: 100%;
    text-indent: -4px;
  }
  .driver-msg p span:first-child,
  .supervise-msg p span:first-child,
  .equipment-msg p span:first-child
  {
    position: absolute;
    top: 0;
    left: 0;
    text-indent: 0;
  }
  .ratio{
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
  }
  .ratio>div{
      float: left;
      width: 50%;
      text-align: left;
      box-sizing: border-box;
  }
  .equipment-box{
    width: 33.33333%;
    height: 244px;
    padding-right: 10px;
    box-sizing: border-box;
    float: left;
}
.equipment-box:nth-child(3n){
    padding-right: 0px;
}
.select-msg-box{
  margin: 10px;
  float: left;
  padding-left: 60px;
  position: relative;
  box-sizing: border-box;
}
.select-msg-box>span{
  width: 56px;
  position: absolute;
  left: 0;
  top: 0;
}
.select-msg-ele {
    top: -38px;
    line-height: 38px;
    height: 38px;
    color: #333;
    border: 1px solid #ccc;
    width: 100%;
    border-radius: 1px;
    overflow: hidden;
    float: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.must::after{
  content: '*';
  color: red;
  position: absolute;
  right: -3px;
  top: -5px;
}
</style>

<style>

/* .el-input{
  width:140px;
  height:24px;
}
.el-select .el-input.is-focus .el-input__inner{
  height:24px;
}

.el-select>.el-input{
  background-color: rgba(255,255,255,0.2);
}
.el-input__prefix, .el-input__suffix{
  top:8px;
}
.el-input__inner{
  height:24px;
  color:rgba(68,210,255,1);
}
.bg .el-table th.is-leaf{
  color:rgba(68,210,255,1);
  text-align: center;
}
.bg .el-table td{
  text-align: center;
  color:rgba(255,255,255,1);
}
.el-switch.is-checked .el-switch__core{
  background-color: rgba(68,210,255,1);
} */
</style>
