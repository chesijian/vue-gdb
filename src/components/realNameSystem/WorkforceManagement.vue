<template>
  <div class="proj-box workforce">
    <div class="context">
      <div class="context_left">
        <div style="position:relative;width: 100%;height: 100%;box-sizing: border-box;padding: 50px 10px 42px">
          <div style="width: 100%;position: relative;">
            <div class="context_left_head" style="width: 100%;position: absolute;top:-40px;left: 0;">
            <div class="context_left_head_left">
              <h4>排班</h4>
            </div>
            <div class="context_left_head_right">
              <button @click="open3" v-if="sessionUtil.isAllowBtn('gc7_6:btn_add_classes')">添加</button>
            </div>
          </div>
          </div>
          <div class="context_left_table" style="width: 100%;height: 100%;box-sizing: border-box;" ref="tablebox">
            <el-table :data="tableData" :height="tableHeightNum" @cell-click="handleCurrentclick" highlight-current-row class="highlight-current-row" border style="width: 100%">
              <el-table-column  label="操作" width="80" v-if="sessionUtil.isAllowBtn('gc7_6:btn_edit_classes')||sessionUtil.isAllowBtn('gc7_6:btn_delete_classes')">
                <template slot-scope="scope" class="operation">
                  <span @click.stop="open2(scope.$index, tableData)" v-if="sessionUtil.isAllowBtn('gc7_6:btn_edit_classes')"><img src="../../assets/administrationIcon/edit1.png" width="20px" height="20px" alt=""></span>
                  <span @click.stop="remove(scope.$index,tableData)" v-if="sessionUtil.isAllowBtn('gc7_6:btn_delete_classes')"><img src="../../assets/indexImg/del.png" width="20px" height="20px" alt=""></span>
                </template>
              </el-table-column>
              <el-table-column prop="schedulingName" label="排班名称">
              </el-table-column>
              <el-table-column prop="schedulingDate" label="日期">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="context_right">
        <div class="context_text" style="height:100%;width:100%;box-sizing: border-box;padding: 62px 10px 20px;">
          <div style="width: 100%;position: relative;">
            <div class="context_text_head" style="width: 100%;position: absolute;top:-40px;left: 0;">
              <div class="context_text_head_left">
                <span class="con_date" style="margin-right: 10px;display: inline-block;width:120px;">
                    <el-date-picker
                      v-model="search"
                      type="month"
                      @change="changeDate"
                      placeholder="选择月">
                    </el-date-picker>
                </span>
                <button :style="item.shiftsColour" @click="selectShift(item)" v-for="item in Shifts">{{item.shiftsName}}</button>
              </div>
              <div class="context_text_head_right">
                <button @click="addNumber" v-if="sessionUtil.isAllowBtn('gc7_6:btn_add_member')">添加人员</button>
                <button @click="openSet" v-if="sessionUtil.isAllowBtn('gc7_6:btn_set')">排班设置</button>
                <button @click="open" v-if="sessionUtil.isAllowBtn('gc7_6:btn_delete_member')">删除</button>
              </div>
            </div>
            <div>
              <div class="worktable" ref="tablebox1" style="width: 100%;height: 100%;box-sizing: border-box;">
                <el-table :data="workList" :height="tableHeightNum" @selection-change="handleSelectionChange" class="highlight-current-row" border style="width: 100%">
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="name" width="70" label="姓名">
                  </el-table-column>
                  <el-table-column prop="schedulingDetailDate" width="80" label="时间">
                  </el-table-column>
                  <el-table-column prop="day1" width="55" label="1" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day1Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day1}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day2" width="55" label="2" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day2Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day2}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day3" width="55" label="3" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day3Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day3}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day4" width="55" label="4" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day4Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day4}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day5" width="55" label="5" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day5Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day5}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day6" width="55" label="6" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day6Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day6}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day7" width="55" label="7" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day7Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day7}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day8" width="55" label="8" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day8Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day8}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day9" width="55" label="9" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day9Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day9}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day10" width="55" label="10" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day10Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day10}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day11" width="55" label="11" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day11Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day11}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day12" width="55" label="12" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day12Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day12}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day13" width="55" label="13" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day13Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day13}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day14" width="55" label="14" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day14Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day14}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day15" width="55" label="15" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day15Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day15}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day16" width="55" label="16" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day16Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day16}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day17" width="55" label="17" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day17Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day17}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day18" width="55" label="18" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day18Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day18}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day19" width="55" label="19" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day19Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day19}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day20" width="55" label="20" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day20Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day20}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day21" width="55" label="21" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day21Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day21}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day22" width="55" label="22" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day22Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day22}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day23" width="55" label="23" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day23Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day23}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day24" width="55" label="24" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day24Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day24}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day25" width="55" label="25" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day25Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day25}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day26" width="55" label="26" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day26Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day26}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day27" width="55" label="27" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day27Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day27}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day28" width="55" label="28" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day28Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day28}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day29" width="55" label="29" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day29Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day29}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day30" width="55" label="30" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day30Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day30}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="day31" width="55" label="31" >
                    <template slot-scope="scope">
                      <div :style="'background:'+scope.row.day31Colour" @click="getMore(scope.row,scope.column.label)">{{scope.row.day31}}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="block" style="position:absolute;bottom: -32px;right: 0;">
                <el-pagination
                  @size-change="handleSizeChange"
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
      </div>
    </div>

    <el-dialog title="排班" class="setl" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="排班日期" :label-width="formLabelWidth">
              <el-date-picker v-model="form.startTime" :disabled="disabled" type="date" placeholder="选择日期"></el-date-picker>
              <span>~</span>
              <el-date-picker v-model="form.endTime" :disabled="disabled" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="Shifts">
            <el-form-item label="选择班次" :label-width="formLabelWidth">
              <span style="margin-right: 5px;" class="strueflow" :class="{strueflow1:item.id==color}" :style="item.shiftsColour" @click="changeShife(item)" v-for="item in Shifts">{{item.shiftsName}}</span>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" @click="btnsub">保存</el-button>
      </div>
    </el-dialog>
    <selectMember :selectMemberModels='selectMemberModels'></selectMember>
    <div>
      <div @click="closemask" v-show="isShowType" style="position: fixed;width:100%;height:100%;background-color: #000;opacity: 0.5;top:0;left:0;"></div>
      <memberManageselcet @close="closes" @closemask="closemask" v-show="isShowType"></memberManageselcet>
    </div>
  </div>
</template>
<script>
  import selectMember from '@/components/common/selectMember.vue'
  import memberManageselcet from './memberManageselcet.vue'
  export default {
    data () {
      return {
        selectTime:'',
        tableData:[],
        workList:[],
        currentPage:1,
        search:'',
        isShowType:false,
        dialogFormVisible:false,
        formLabelWidth:'120px;',
        form:{},
        tableHeightNum:0,
        tableHeightNum1:0,
        Shifts:[],
        shiftUid:'',
        shiftUid1:'',
        pageIndex:1,
        pageSize:10,
        total:0,
        selectMemberModels:{
          isShow:false,
          selectList:[],
          callBack:this.callBack3,
          radioSelectFlags:false,
        },
        schedulingId:'',
        schedulingDetailIds:'',
        color:'',
        disabled:false
      }
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.getSchedulingData();
      this.getShiftData();
    },
    mounted () {
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
        this.tableHeightNum1=this.$refs.tablebox1.offsetHeight
      })
      this.search=new Date().format('yyyy-MM');
    },
    methods: {
      getMore(val,data){
        console.log(val)
        this.dialogFormVisible=true;
        this.disabled=true;
        this.schedulingDetailIds=val.id;
        if(data.length==1){
          this.form.startTime=new Date(val.schedulingDetailDate).format('yyyy-MM')+'-0'+data;
          this.form.endTime=new Date(val.schedulingDetailDate).format('yyyy-MM')+'-0'+data;
        }else{
          this.form.startTime=new Date(val.schedulingDetailDate).format('yyyy-MM')+'-'+data;
          this.form.endTime=new Date(val.schedulingDetailDate).format('yyyy-MM')+'-'+data;
        }
        this.$forceUpdate();
      },
      getSchedulingData(){
        let params={
          projUid:this.$store.state.selectProjectObj.id
        };
        this.util.restGet('/api_v1/modules/real/scheduling',params,res=>{
          if(res.status==200){
            if(res.data!=undefined){
              this.tableData=res.data
            }else{
              this.tableData=[];
            }

          }else{
            this.util.failueToast('数据加载失败')
          }
        })
      },
      addSchedulingData(name){
        let params={
          projUid:this.$store.state.selectProjectObj.id,
          schedulingName:name
        };
        this.util.restPost('/api_v1/modules/real/scheduling',params,res=>{
          if(res.status==200){
            this.util.successToast('新增成功');
            this.getSchedulingData();
          }
        })
      },
      editScheduling(name,item){
        let params={
          projUid:item.projUid,
          schedulingName:name,
        };
        this.util.restPut('/api_v1/modules/real/scheduling/'+item.schedulingId,params,res=>{
          if(res.status==200){
            this.getSchedulingData();
            this.util.successToast('编辑成功');
          }else{
            this.util.error(res.errorMsg);
          }
        })
      },
      delScheduling(id){
        this.util.restDelete('/api_v1/modules/real/scheduling/'+id,null,res=>{
          if(res.status==200){
            this.getSchedulingData();
            this.util.successToast('删除成功');
          }else{
            this.util.error(res.errorMsg);
          }
        })
      },
      getShiftData(){
        this.util.restGet('/api_v1/modules/shift_setup?projUid='+this.$store.state.selectProjectObj.id,null,res=>{
          if(res.status==200){
            if(res.data!=undefined){
              for(let i=0;i<res.data.length;i++){
                res.data[i].shiftsColour='background:'+res.data[i].shiftsColour;
              }
              res.data.map(item=>{
                item.bgcolors=''
              })
              this.Shifts=res.data;
            }else{
              this.util.failueToast('请在班次设置里面添加班次')
              this.Shifts=[];
            }
          }
        })
      },
      dellist(){
        this.util.restDelete('/api_v1/modules/real/scheduling_detail?ids='+this.schedulingDetailIds,null,res=>{
          if(res.status==200){
            this.getScheduling_detail();
            this.util.successToast('删除成功');
          }
        })
      },
      closemask(){
        this.isShowType=false;
      },
      closes(data){
        console.log(data)
        this.isShowType=false;
        let params={};
        let arr=[];

        for(let i=0;i<data.length;i++){
          let obj={};
          obj.workerUid=data[i].workderId;
          obj.schedulingUid=this.schedulingId;
          obj.projUid=this.$store.state.selectProjectObj.id;
          arr.push(obj)
        }
        params.schedulingWorker=arr;
        params.date=new Date(this.search).format('yyyy-MM');

        this.util.restPost('/api_v1/modules/real/scheduling_detail',params,res=>{
          if(res.status==200){
            this.getScheduling_detail();
            this.util.successToast('添加成功');
          }else{
            this.util.error(res.errorMsg)
          }
        })
      },
      addNumber(){
        if(this.schedulingId==''||this.schedulingId==undefined){
            this.util.failueToast('请选择排班');
            return false;
        }
        this.isShowType=true;
      },
      changeDate(val){
        this.search=val;
        this.getScheduling_detail();
      },
      getScheduling_detail(data){
        let params={
          projUid:this.$store.state.selectProjectObj.id,
          schedulingUid:this.schedulingId,
          shiftUid:this.shiftUid,
          schedulingDetailDate:new Date(this.search).format('yyyy-MM'),
          pageIndex:this.pageIndex,
          pageSize:this.pageSize
        }
        this.util.restGet('/api_v1/modules/real/scheduling_detail',params,res=>{
          if(res.status==200){
            if(res.data!=undefined){
              this.workList=res.data;
              this.total=res.totalCount;
            }else{
              this.workList=[];
            }

          }else{
            this.util.error(res.errorMsg);
          }
        })
      },
      changeShife(item){
        this.shiftUid1=item.id;
        this.color=item.id
      },
      handleSelectionChange(val){
        console.log(val)
        this.schedulingDetailIds=''
        for(let i=0;i<val.length;i++){
          this.schedulingDetailIds+=val[i].id+','
        }
        this.schedulingDetailIds=this.schedulingDetailIds.slice(0,this.schedulingDetailIds.length-1);
      },
      handleCurrentclick(data){
        this.workList=[]
        this.schedulingId=data.schedulingId;
        this.getScheduling_detail(data);
      },
      callBack3(){
        console.log(this.selectMemberModels.selectList)
        this.selectMemberModels.isShow=false;

      },
      selectShift(item){
        this.shiftUid=item.id;
        this.getScheduling_detail();
      },
      btnsub(){
        if(this.form.startTime==''||this.form.startTime==undefined){
          this.util.failueToast('请选择开始时间')
          return false
        }
        if(this.form.endTime==''||this.form.endTime==undefined){
          this.util.failueToast('请选择结束时间')
          return false
        }
        if(this.shiftUid1==''||this.shiftUid1==undefined){
          this.util.failueToast('请选择班次')
          return false
        }

        let params={
          startTime:new Date(this.form.startTime).format('yyyy-MM-dd'),
          endTime:new Date(this.form.endTime).format('yyyy-MM-dd'),
          shiftUid:this.shiftUid1,
          schedulingDetailIds:this.schedulingDetailIds
        };
        this.util.restPut('/api_v1/modules/real/scheduling_detail',params,res=>{
          if(res.status==200){
            this.getScheduling_detail();
            this.util.successToast('设置成功')
          }else{
            this.util.error(res.errorMsg)
          }
        })
        this.dialogFormVisible=false;
      },
      close(){
        this.dialogFormVisible=false;
      },
      openSet(){
        if(this.schedulingDetailIds==''||this.schedulingDetailIds==undefined){
          this.util.failueToast('请选择操作的项')
          return false;
        }
        this.disabled=false;
        this.form={};
        this.dialogFormVisible=true;
      },
      handleSizeChange(value){
        console.log(value)
      },
      handleCurrentChange(value){
        console.log(value)
        this.pageIndex=value;
        this.getScheduling_detail()
      },
      remove(index,arr){
        this.open1(arr[index].schedulingId)
      },
      open3(){
        this.$prompt('排班名称', '排班', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.addSchedulingData(value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      open2(index,item){
        this.$prompt('排班名称', '排班', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.editScheduling(value,item[index])
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      open1(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.delScheduling(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      open() {
        if(this.schedulingDetailIds==''||this.schedulingDetailIds==undefined){
          this.util.failueToast('请选择要删除的项');
          return false;
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dellist();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    components:{
      selectMember,memberManageselcet
    }
  }
</script>

<style scoped>
  .proj-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0px;
    color: #44D2FF;
    font-size: 14px;
    padding-top: 10px;
    position: relative;
    overflow: auto;
  }
.strueflow{
  opacity: 0.2;
}
.strueflow1{
  opacity: 1;
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
  .context{
    width:100%;
    height:100%;
  }
  .context_left{
    float: left;
    width:320px;
    height:100%;
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    padding:13px 14px 13px 14px;
    box-sizing: border-box;
    overflow: auto;
  }
  .context_text_head{
    margin-bottom: 10px;
    overflow: hidden;
  }
  .context_text_head_left button{
    margin-right: 10px;
  }
  .context_text_head_right button{
    margin-left: 5px;
  }
  .context_right{
    overflow: hidden;
    height:100%;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .context_text{
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    padding:13px 20px;
    height:100%;
    width:100%;
    box-sizing: border-box;
    overflow: auto;
  }
  .context_left_head{
    overflow: hidden;
  }
  .context_left_head_left{
    float: left;
  }
  .context_left_head_right{
    float: right;
    overflow: hidden;
  }
  .Shifts span{
    display: inline-block;
    width:48px;
    height:26px;
    text-align: center;
    line-height: 26px;
    color:#fff;
  }
  .context_text_head_left{
    float: left;
  }
  .active{
    background: url(../../assets/indexImg/select.png) no-repeat  top center;
  }
  .context_text_head_right{
    float: right;
  }
</style>

<style>
  .context_text_head_left .el-select{
    background: rgba(255,255,255,0.2);
    width:100px;
    height:24px;
  }
  .context_text_head_left .el-input--suffix .el-input__inner{
    height:26px;
  }
  .context_text_head_left .el-input__icon{
    line-height: 0px;
  }
  .setl .el-date-editor.el-input{
    border:1px solid rgba(212,212,212,1);
  }
  .setl .el-input--prefix .el-input__inner{
    color:rgba(51,51,51,1);
    height:40px;
  }
  .setl .el-form-item__content{
    text-align: left;
  }
  .setl .el-dialog{
    width:600px !important;
  }
 .workforce .el-table--border td:first-child .cell,.workforce .el-table--border th:first-child .cell,.workforce .el-table .cell,.workforce .el-table th div{
    text-align: center !important;
  }
  .con_date .el-date-editor.el-input{
    width:120px;
    background-color: rgba(68,210,255,.2);
  }
  .workforce .worktable .el-table .cell div{
    width:32px;
    height:23px;
  }
</style>
