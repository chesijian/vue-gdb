<template>
  <div class="ShiftManagement">
      <div style="text-align: right"><button @click="addShifts" v-if="sessionUtil.isAllowBtn('gc7_5:btn_add')">添加</button></div>
      <div class="Shift_context">
        <div v-for="(item,index) in manages" :key="index" class="manageList">
          <div class="manageList_box">
            <div class="Shift_head">
              <div class="Shift_left">
                <h4>{{item.shiftsName}}</h4>
              </div>
              <div class="Shift_right">
                <button @click="edit(item.id)" v-if="sessionUtil.isAllowBtn('gc7_5:btn_edit')">设置</button>
                <button @click="remove(item.id)" v-if="sessionUtil.isAllowBtn('gc7_5:btn_delete')">删除</button>
              </div>
            </div>
            <div class="manageList_text">
              <p>班次底色: <span class="iconfont" :style="item.shiftsColour"></span></p>
              <p>班次规则：<span>{{item.firstAttendanceTimeUp}}~{{item.firstAttendanceTimeDown}};{{item.secondAttendanceTimeUp}}~{{item.secondAttendanceTimeDown}};{{item.thirdAttendanceTimeUp}}~{{item.thirdAttendanceTimeDown}}</span></p>
              <p>允许加班：<span><el-switch disabled="disabled" v-model="item.isOvertime" active-color="#13ce66" inactive-color="#ff4949"></el-switch></span></p>
              <p>允许迟到：<span>{{item.signInAllowLate}}分钟</span></p>
              <p>允许早退：<span>{{item.signBackAllowLeaveEarly}}分钟</span></p>
              <p>旷工规则：<span>{{item.absenteeism}}分钟</span></p>
            </div>
          </div>
        </div>
      </div>

    <el-dialog title="班次" class="shift" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-row :gutter="20">
          <el-col :span="24">

            <el-form-item label="班次名称" :label-width="formLabelWidth">
              <el-input v-model="form.shiftsName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="班次底色" :label-width="formLabelWidth">
              <div class="bgcolor">
                <span @click="changeColor('rgba(255,153,2,1)')" :class="{opcolor:createType=='rgba(255,153,2,1)'}" style="background-color: rgba(255,153,2,1)"></span>
                <span @click="changeColor('rgba(68,210,255,1)')" :class="{opcolor:createType=='rgba(68,210,255,1)'}" style="background-color: rgba(68,210,255,1)"></span>
                <span @click="changeColor('rgba(237,117,141,1)')" :class="{opcolor:createType=='rgba(237,117,141,1)'}" style="background-color: rgba(237,117,141,1)"></span>
                <span @click="changeColor('rgba(102,255,255,1)')" :class="{opcolor:createType=='rgba(102,255,255,1)'}" style="background-color: rgba(102,255,255,1)"></span>
                <span @click="changeColor('rgba(204,204,102,1)')" :class="{opcolor:createType=='rgba(204,204,102,1)'}" style="background-color: rgba(204,204,102,1)"></span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="班次规则"  :label-width="formLabelWidth">
              <div class="rule" style="overflow: hidden">
                  <div v-for="(item,index) in  list" style="overflow: hidden;margin-bottom: 5px;">
                        <span>第{{index+1}}次</span>
                        <span><span>上班</span> <el-time-select v-model="item.AttendanceTimeUp" :picker-options="{start: '00:00',step: '00:15',end: '23:59'}" placeholder="选择时间"></el-time-select></span>
                        <span><span>下班</span> <el-time-select v-model="item.AttendanceTimeDown" :picker-options="{start: '00:00',step: '00:15',end: '23:59'}" placeholder="选择时间"></el-time-select></span>
                        <span @click="dellist(item)"><img src="../../assets/administrationIcon/close.png" height="14px" width="14px" alt=""></span>
                        <span @click="addlist"><img src="../../assets/administrationIcon/addlist.png" height="14px" width="14px" alt=""></span>
                  </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="允许加班" style="text-align: left;" :label-width="formLabelWidth">
              <el-switch @change="changeSwitch" v-model="form.isOvertime" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="允许迟到(分钟)" :label-width="formLabelWidth">
              <el-input v-model="form.signInAllowLate" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="允许早退(分钟)" :label-width="formLabelWidth">
              <el-input v-model="form.signBackAllowLeaveEarly" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="超过算旷工(分钟)" :label-width="formLabelWidth">
              <el-input v-model="form.absenteeism" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnsub">确 定</el-button>
      </div>
    </el-dialog>

    <selectMember :selectMemberModels='selectMemberModels'></selectMember>
  </div>
</template>
<script>
  import selectMember from '@/components/common/selectMember.vue'
  export default {
    data(){
      return{
        manages:[],
        value:'',
        form:{},
        list:[{AttendanceTimeUp:'',AttendanceTimeDown:''},],
        images:[{},{}],
        dialogFormVisible:false,
        formLabelWidth:'120px',
        createType:'',
        selectMemberModels:{
          isShow:false,
          selectList:[],
          callBack:this.callBack3,
          radioSelectFlags:false,
        },
        isCreate:''
      }
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.getShiftData();
    },
    methods:{
      changeSwitch(val){
        this.form.isOvertime=val;
        this.$forceUpdate();
      },
      remove(id){
        this.util.restDelete('/api_v1/modules/shift_setup/'+id,null,res=>{
          if(res.status==200){
            this.util.successToast('删除成功')
            this.getShiftData();
          }else{
            this.util.successToast('删除失败')
          }
        })
      },
      btnsub(){
        console.log(this.list)
        if(this.isCreate!='edit'){
          if(this.form.shiftsName==undefined||this.form.shiftsName==''){
            this.util.failueToast('请填写班次名称')
            return false;
          }
          if(this.form.shiftsColour==undefined||this.form.shiftsColour==''){
            this.util.failueToast('请选择班次底色')
            return false;
          }
          if(this.list[0].AttendanceTimeUp==''||this.list[0].AttendanceTimeUp==undefined){
            this.util.failueToast('请填写上班时间')
            return false;
          }
          if(this.list[0].AttendanceTimeDown==''||this.list[0].AttendanceTimeDown==undefined){
            this.util.failueToast('请填写下班时间')
            return false;
          }
          if(this.form.signInAllowLate==undefined||this.form.signInAllowLate==''){
            this.util.failueToast('请选填写迟到规则')
            return false;
          }
          if(this.form.signBackAllowLeaveEarly==undefined||this.form.signBackAllowLeaveEarly==''){
            this.util.failueToast('请选填写早退规则')
            return false;
          }
          if(this.form.absenteeism==undefined||this.form.absenteeism==''){
            this.util.failueToast('请选填写旷工规则')
            return false;
          }
          let reg = /^\+?[1-9][0-9]*$/;

          if(!reg.test(this.form.signInAllowLate)){
            if(this.form.signInAllowLate!=0){
              this.util.failueToast('请选填写正确的迟到分钟')
              return false;
            }
          }
          if(!reg.test(this.form.signBackAllowLeaveEarly)){
            if(this.form.signBackAllowLeaveEarly!=0){
              this.util.failueToast('请选填写正确的早退分钟')
              return false;
            }
          }
          if(!reg.test(this.form.signInAllowLate)){
            if(this.form.signInAllowLate!=0){
              this.util.failueToast('请选填写正确的早退分钟')
              return false;
            }
          }
          for(let i=0;i<this.list.length;i++){
            if(i==0){
              this.form.firstAttendanceTimeUp=this.list[i].AttendanceTimeUp;
              this.form.firstAttendanceTimeDown=this.list[i].AttendanceTimeDown;
            }else if(i==1){
              this.form.secondAttendanceTimeUp=this.list[i].AttendanceTimeUp;
              this.form.secondAttendanceTimeDown=this.list[i].AttendanceTimeDown;
            }else{
              this.form.thirdAttendanceTimeUp=this.list[i].AttendanceTimeUp;
              this.form.thirdAttendanceTimeDown=this.list[i].AttendanceTimeDown;
            }
          }
          this.form.projUid=this.$store.state.selectProjectObj.id;
          if(this.form.isOvertime==true){
            this.form.isOvertime='Y'
          }else{
            this.form.isOvertime='N'
          }
          this.util.restPost('/api_v1/modules/shift_setup',this.form,(res)=>{
            if(res.status===200){
              this.util.successToast('添加成功')
              this.dialogFormVisible=false;
              this.getShiftData();
            }else{
              this.util.failueToast('添加失败')
            }
          })
        }else{
          if(this.form.isOvertime==true){
            this.form.isOvertime='Y'
          }else{
            this.form.isOvertime='N'
          }
          for(let i=0;i<this.list.length;i++){
            if(i==0){
              this.form.firstAttendanceTimeUp=this.list[i].AttendanceTimeUp;
              this.form.firstAttendanceTimeDown=this.list[i].AttendanceTimeDown;
            }else if(i==1){
              this.form.secondAttendanceTimeUp=this.list[i].AttendanceTimeUp;
              this.form.secondAttendanceTimeDown=this.list[i].AttendanceTimeDown;
            }else{
              this.form.thirdAttendanceTimeUp=this.list[i].AttendanceTimeUp;
              this.form.thirdAttendanceTimeDown=this.list[i].AttendanceTimeDown;
            }
          }
          this.form.projUid=this.$store.state.selectProjectObj.id;
          let params=this.form

          this.util.restPut('/api_v1/modules/shift_setup/'+this.form.id,params,res=>{
            if(res.status===200){
              this.util.successToast('设置成功')
              this.dialogFormVisible=false;
              this.getShiftData();
            }else{
              this.util.failueToast('设置失败')
            }
          })
        }

      },
      getShiftData(){
        this.util.restGet('/api_v1/modules/shift_setup?projUid='+this.$store.state.selectProjectObj.id,null,res=>{
          if(res.status==200){
            if(res.data!=undefined){
              for(let i=0;i<res.data.length;i++){
                res.data[i].shiftsColour='background:'+res.data[i].shiftsColour;
                if(res.data[i].isOvertime=='Y'){
                  res.data[i].isOvertime=true;
                }else{
                  res.data[i].isOvertime=false;
                }
              }
              this.manages=res.data;
            }else{
              this.manages=[];
            }
          }
        })
      },
      changeColor(color){
        if(color){
          this.createType=color;
          this.form.shiftsColour=color;
        }
      },
      addShifts(){
        this.isCreate='';
        this.form={};
        this.createType='';
        this.dialogFormVisible=true;
      },
      openNumber(){
        this.dialogFormVisible=false;
        this.selectMemberModels.isShow=true
      },
      edit(id){
        this.form={};
        this.list=[{AttendanceTimeUp:'',AttendanceTimeDown:''},]
        this.isCreate='edit'
        this.dialogFormVisible=true;
        this.util.restGet('/api_v1/modules/shift_setup/'+id,null,res=>{
          if(res.status==200){
            if(res.data.isOvertime=='Y'){
              res.data.isOvertime=true
            }else{
              res.data.isOvertime=false
            }
            this.form.projUid=res.data.projUid;
            this.form.shiftsName=res.data.shiftsName;
            this.createType=res.data.shiftsColour;
            this.form.shiftsColour=res.data.shiftsColour;
            this.list=res.data.attendanceTime;
            this.form.secondAttendanceTimeUp=res.data.secondAttendanceTimeUp;
            this.form.secondAttendanceTimeDown=res.data.secondAttendanceTimeDown;
            this.form.isOvertime=res.data.isOvertime;
            this.form.signInAllowLate=res.data.signInAllowLate;
            this.form.signBackAllowLeaveEarly=res.data.signBackAllowLeaveEarly;
            this.form.absenteeism=res.data.absenteeism;
            this.form.id=res.data.id;
            this.$forceUpdate();
          }
        })
      },
      callBack3(){
        this.dialogFormVisible=true
        console.log(this.selectMemberModels.selectList)
        this.images=this.selectMemberModels.selectList
      },
      addlist(){
        if(this.list.length==3){
          this.util.failueToast('不能添加')
          return false;
        }
        this.list.push({
          AttendanceTimeUp:'',
          AttendanceTimeDown:''
        });
        console.log(this.list)
      },
      dellist(data){
        if(this.list.length==1){
          this.util.failueToast('不能删除')
          return false;
        }
        this.list=this.list.filter(item=>{
          return item!=data;
        })
      }
    },
    components:{
      selectMember
    }
  }
</script>

<style scoped>
  .ShiftManagement{
    padding-top:15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
.Shift_head{
  overflow: hidden;
}
.manageList{
  width:33.3%;
  float: left;
  padding-right: 5px;
  box-sizing: border-box;
  margin-bottom: 5px;
}
  .Shift_left{
    float: left;
  }
  .Shift_right{
    float: right;
  }
  .manageList_box{
    width:100%;
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    padding:10px 14px;
    box-sizing: border-box;
  }
  .manageList_text{
    width:100%;
    text-align: left;
    color:#fff;
    font-size: 14px;
  }
  .manageList_text p{
    line-height: 30px;
  }
  .iconfont{
    display: inline-block;
    width:16px;
    height:16px;
    position: relative;
    top:3px;
    left:7px;
  }
  .Shift_context{
    overflow: hidden;
  }
  .rule span{
    display: inline-block;
    text-align: left;
    float: left;
    margin-right: 10px;
  }
  .bgcolor{
    text-align: left;
  }
.bgcolor span{
  display: inline-block;
  width:16px;
  height:16px;
  margin-right: 10px;
  opacity: 0.2;
}
  .opcolor{
    opacity: 1 !important;
  }

</style>
<style>
  .shift  .el-input{
    border:1px solid rgba(212,212,212,1);
  }
  .shift .el-dialog{
    width:600px !important;
  }
  .shift .el-input{
    width:373px !important;
    float: left;
    height:38px;
  }
  .shift .el-form-item__content{
   line-height: 38px !important;
  }
  .shift .el-form-item__label{
    text-align: left;
  }
  .rule .el-date-editor.el-input,.rule .el-date-editor.el-input__inner{
    width:120px !important;
  }
  .rule .el-input--prefix .el-input__inner{
    color:#000 !important;
    height:38px;
  }
  .shift  .el-input__inner{
    color:#000 !important;
  }
  .shift .el-dialog__body{
    padding:0 10px;
  }
  .shift .el-form-item{
    margin-bottom: 5px;
  }
  .shift .el-dialog__header{
    padding:4px 10px 4px
  }
  .shift .el-dialog__footer{
    padding:4px 10px 4px
  }
</style>
