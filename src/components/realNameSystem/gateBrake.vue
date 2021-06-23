<template>
  <div class="proj-box" style="padding: 0">
    <gateBrake :equipmentList='tableData' @msgOut='loadData' :deviceType="'2'"></gateBrake>
  </div>
</template>
<script>
  import uploading from '../common/uploading.vue'
  import gateBrake from '../common/gateBrake.vue'

  export default {
    components: {
      uploading,gateBrake
    },
    data () {
      return {
        tableData: [],
        tableRows: 0,
        tableEndRowCells: 0,
        showTableData: null,

        delDialog: {
          visible: false,
          type: '',//team、member
          delId: '',
        },

        uploadConfig: {
          limit: 2,//限制附件上传个数
          limitSize: 52428800,//50mb单个附件上传大小
          readOnly: false,//是否只读
          multiple: false,//是否允许多选
          xtype: 'device_2',//同一个表单区别多个附件上传块
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
            enable: '',//是否启用，1表示启用，0表示未启用
            type: 2,//设备类型，目前：1表示扬尘监测仪，2表示闸机
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
    mounted () {
      this.loadData()
    },
    watch: {
      '$store.state.selectProjectObj.id': function (val, oldVal) {
        this.loadData()
      }
    },
    methods: {
      loadData () {
        var params = {
          type:"2",
          platformType: "6",
          pageNum: 1,
          pageSize: 1000,
        }
        params.projUid = this.$store.state.selectProjectObj.id;
        console.debug("params====",params);
        this.util.restGet('/api_v1/modules/check_devices', params, (res) => {
          if (res.status == 200) {
            if(res.data&&res.data.length>0){
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].enable==1?res.data[i].enable=true:res.data[i].enable=false
              }
              this.tableData = res.data
            }else{
              this.tableData=[]
            }
          } else {
            this.util.error(res.errorMsg)
          }
        })
      },
    }
  }
</script>

<style scoped>
  .proj-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    color: #44D2FF;
    font-size: 14px;
    padding-top: 36px;
    position: relative;
    overflow: auto;
  }

  .tabs-box {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .tabs {
    width: 100%;
    height: 36px;
    border: 1px solid #44D2FF;
    box-sizing: border-box;
    padding: 0 10px;
    text-align: center;
  }

  .tabs > span {
    width: 78px;
    float: left;
    height: 26px;
    line-height: 26px;
    margin-top: 4px;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .tabs > .active {
    background: url(../../assets/indexImg/select.png) no-repeat top center;
  }

  .box-style1 {
    height: 100%;
    width: 100%;
    float: left;
  }

  .box-style1:nth-child(4n) {
    padding-right: 0;
  }

  .box-style1 .box-style-top-right, .box-style1 .box-style-bottom-right {
    right: 10px;
  }

  .box-style1:nth-child(4n) .box-style-top-right, .box-style1:nth-child(4n) .box-style-bottom-right {
    right: 0;
  }

  .box-style1 .numerical {
    height: 72px;
    line-height: 72px;
  }

  .box-style1 .numerical > div {
    width: 50%;
    float: left;
    text-align: right;
    box-sizing: border-box;
    padding-right: 10px;
  }

  .box-style1 .numerical span {
    font-size: 40px;
    color: #FFFFFF;
    vertical-align: middle;
    float: left;
    margin-left: 10px
  }

  .num-box {
    overflow: hidden;
    position: absolute;
    top: 46px;
    width: 100%;
    left: 0;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .chart-box {
    width: 100%;
    height: 100%;
  }

  .tabs1 span {
    margin-top: 0;
  }

  .select-mouth {
    width: 90px;
    height: 24px;
    overflow: hidden;
    padding: 4px 6px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.20);
    position: relative;
  }

  .select-mouth::after {
    content: '';
    position: absolute;
    background: url(../../assets/indexImg/more.png) no-repeat top center;
    width: 7px;
    height: 4px;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
  }
</style>

<style>
  .select-mouth .el-input__inner {
    background: transparent;
    border: 0 none;
    height: 32px;
    color: #44D2FF;
    font-size: 14px;
    width: 100%;
    height: 100%;
    padding: 0;
  }

  .select-mouth .el-select .el-input .el-select__caret {
    color: #44D2FF;
    line-height: 20px;
  }

  .el-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid rgba(68, 210, 255, 1);
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: rgba(68, 210, 255, 0.2);
    z-index: 1;
    -webkit-transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
    transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
  }

  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: rgba(68, 210, 255, 0.2);
    border-color: rgba(68, 210, 255, 1);
  }

  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: rgba(68, 210, 255, 0.2);
    border-color: rgba(68, 210, 255, 1);
    cursor: not-allowed;
  }

  .jrjy .el-form-item {
    margin-bottom: 0px;
  }

  .jrjy .el-input {
    /*border: 3px solid;*/
    /*color: black;*/
  }

  .jrjy el-input__inner {
  }

  .jrjy .el-input--mini .el-input__inner {
    padding-left: 10px;
    border: 1px solid #dcdfe6;
    /*color: rgba(51,51,51,1);*/
  }

  .jrjy .bg .el-input__inner {
    height: 32px;
    font-size: 14px;
    width: 100%;
    height: 100%;
    padding: 0;
  }

  .jrjy .el-select .el-input .el-select__caret.el-input__icon {
    line-height: -1px;
  }

  .bg .jrjy .el-input__inner {
    color: rgba(51, 51, 51, 1);
  }
</style>
