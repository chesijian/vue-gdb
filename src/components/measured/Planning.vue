<template>
  <div class="ProcessTask">
    <div class="ProcessTask_head ">
      <div class="parcess_head">
        <!-- <div class="item_head"><h4 style="margin-bottom: 0;">查询</h4></div> -->
        <div class="item_head">
          <el-tag @click="issueStatus='1';loadData()" :effect="issueStatus=='1'? 'dark':'plain'">已发布</el-tag>
          <el-tag @click="issueStatus='0';loadData()" :effect="issueStatus=='0'? 'dark':'plain'">未发布</el-tag>
          <el-tag @click="issueStatus='';loadData()" :effect="issueStatus==''? 'dark':'plain'">全部</el-tag>
          <!-- <span>检查状况</span>
          <span>
            <el-select v-model="examineStatus"  placeholder="请选择" size="mini" class="select-ele">
              <el-option label="检查未开始" value="0"></el-option>
              <el-option label="检查中" value="1"></el-option>
              <el-option label="检查完成" value="2"></el-option>
            </el-select>
          </span> -->
        </div>
        <div class="item_head">
          <span>计划状态</span>
          <span>
            <el-select v-model="planStatus" @change="loadData" placeholder="请选择" size="mini" class="select-ele">
              <el-option label="全部" value=""></el-option>
              <el-option label="已执行" value="1"></el-option>
              <el-option label="未执行" value="0"></el-option>
            </el-select>
          </span>
        </div>
        
        <div class="item_head">
          <span>计划类型</span>
          <span>
            <el-select v-model="planType" @change="loadData" placeholder="请选择" size="mini" class="select-ele">
                <el-option label="全部" value=""></el-option>
                <el-option label="周计划" value="weekly"></el-option>
                <el-option label="月计划" value="monthly"></el-option>
            </el-select>
          </span>
          
        </div>
        <div style="float:left"  class="search-box">
            <input type="text" v-model="searchValue" @keyup.enter="loadData()">
            <i></i>
            <button @click="loadData">搜索</button>
        </div>
        
        <div style="margin-left: auto;">
          <button @click="addPlan('weekly')"  v-if="sessionUtil.isAllowBtn('gc3_3:btn_create')">新增周计划</button>
          <button @click="addPlan('monthly')"  v-if="sessionUtil.isAllowBtn('gc3_3:btn_assign')">新增月计划</button>
          <button @click="batchDelete()"  v-if="sessionUtil.isAllowBtn('gc3_3:btn_delete')">删除</button>
          <button @click="adjust">调整</button>
        </div>
      </div>
      <div  style="height:100%;" ref="tablebox">
        <el-table :data="tableData" :height="tableHeightNum" @selection-change="handleSelectionChange" border style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column style="color:#000" label="操作" width="80">
            <template slot-scope="scope" class="operation" >
              <span @click="editPlan(scope.row.id)" ><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>
              <span @click="deletePlan(scope.row.id)" ><img width="17px" height="17px" src="../../assets/indexImg/del.png" alt=""></span>
            </template>
          </el-table-column>
          <el-table-column style="color:#000" prop="sn" label="编号" > </el-table-column>
          <el-table-column prop="subject" label="计划名称" >
          </el-table-column>
          <el-table-column prop="status" label="计划状态">
            <template slot-scope="scope">
              <div>{{scope.row.status=='1'? '执行':'未执行'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="计划开始时间">
          </el-table-column>
          <el-table-column prop="endDate" label="计划结束时间">
          </el-table-column>
          <el-table-column label="计划类型">
            <template slot-scope="scope">
              <div>{{scope.row.type=='weekly'? '周计划':(scope.row.type=='monthly'? '月计划':'')}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="compileUser" label="计划编制人"></el-table-column>
          <el-table-column prop="compileDate" label="编制日期">
            <!-- <template slot-scope="scope">
              <div>{{scope.row.inspect}}</div>
            </template> -->
          </el-table-column>
          <el-table-column label="说明">
            <template slot-scope="scope">
              <div>{{scope.row.content}}</div>
            </template>
          </el-table-column>
          
        </el-table>
        <div style="text-align: right;">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout=" prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>
      </div>

      <div class="add-part-box" v-show="importVisable" >
        <div class="add-part" style="height: 90%;width:990px;overflow: hidden;box-sizing:border-box;">
          <div style="margin-bottom: 10px;">
            <p style="margin-bottom: 10px;">实测实量计划编制</p>
            <p style="font-size: 12px;text-align: right;">
              <el-button type="primary" icon="el-icon-edit" @click="saveData(1)">提交发布</el-button>
              <el-button type="primary" icon="el-icon-share" @click="saveData(0)">保存草稿</el-button>
              <el-button type="primary" icon="el-icon-delete" @click="importVisable=false">关闭</el-button>
            </p>
          </div>

          <div style="height:100%;overflow: auto;">
            <div style="box-sizing: border-box">
              <el-form >
                <el-form-item>
                  <el-row>
                    <el-col :span="12" style="text-align: left;">
                      <span>单据编号</span>
                      <el-input disabled v-model="mainData.SN_" size="mini" placeholder="请选择"></el-input>
                    </el-col>
                    <el-col :span="12" style="text-align: left;">
                      <span>编制人</span>
                      <el-input v-model="mainData.COMPILE_USER_" size="mini" placeholder="请选择"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-row>
                    <el-col :span="12" style="text-align: left;">
                      <span>计划名称</span>
                      <el-input v-model="mainData.SUBJECT_" size="mini" class="select-msg-ele" placeholder="请输入"></el-input>
                    </el-col>
                    <el-col :span="12" style="text-align: left;">
                      <span>计划类型</span>
                      <el-select v-model="mainData.TYPE_" size="mini" class="select-msg-ele" placeholder="请选择">
                        <el-option label="周计划" value="weekly"></el-option>
                        <el-option label="月计划" value="monthly"></el-option>
                    </el-select>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-row>
                    <el-col :span="12" style="text-align: left;">
                      <span>计划日期</span>
                      <el-date-picker v-model="mainData.START_DATE_" type="date" placeholder="选择日期"></el-date-picker>至
                      <el-date-picker v-model="mainData.END_DATE_" type="date" placeholder="选择日期"> </el-date-picker>
                          <!-- <el-date-picker style="width: 266px;" v-model="mainData.START_DATE_"  type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker> -->
                      
                    </el-col>
                    <el-col :span="12" style="text-align: left;">
                      <span>编制日期</span>
                      <el-date-picker v-model="mainData.COMPILE_DATE_" type="datetime" placeholder="选择日期时间">
                      </el-date-picker>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="说明">
                  <el-input type="textarea" v-model="mainData.CONTENT_"></el-input>
                </el-form-item>
              </el-form>
          </div>

            <div style="box-sizing: border-box;">
              <div style="text-align: left;color:#000;">
                <el-button type="primary" @click="addChild">添加</el-button>
                <el-button type="primary" @click="batchEidtDate">批量修改日期</el-button>
                <el-button type="primary" >删除</el-button>
              </div>

              <div>
                <el-table :data="childrenData" :height="tableHeightNum" @selection-change="handleChildSelection" border style="width: 100%;color:#000">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column  label="操作" width="80">
                  <template slot-scope="scope" class="operation">
                    <span @click="edit(scope.$index,tableData)" ><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>
                    <span @click="deletes(scope.$index,tableData)"><img width="17px" height="17px" src="../../assets/indexImg/del.png" alt=""></span>
                  </template>
                </el-table-column>
                
                <el-table-column  label="编码" width="55">
                  <template  slot-scope="scope">
                    <div><el-input v-model="scope.row.AREA_CODE_"></el-input></div>
                  </template>
                </el-table-column>
                <el-table-column label="区域">
                  <template  slot-scope="scope" >
                    <div @click="inspectVisible=true" style="color:red;text-decoration:underline;cursor:pointer;">{{scope.row.AREA_NAME_? scope.row.AREA_NAME_:"请选择"}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="实测实量项">
                  <template  slot-scope="scope">
                    <div><el-input v-model="scope.row.INSPECT_ITEM_"></el-input></div>
                  </template>
                </el-table-column>
                <el-table-column label="测量标准">
                  <template  slot-scope="scope">
                    <div><el-input v-model="scope.row.INSPECT_STANDARD_"></el-input></div>
                  </template>
                </el-table-column>
                <el-table-column label="预计开始时间" width="130">
                  <template  slot-scope="scope">
                    <el-date-picker  v-model="scope.row.START_DATE_" format='yyyy-MM-dd' value-format='yyyy-MM-dd' type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="预计完成时间" width="130">
                  <template  slot-scope="scope">
                    <el-date-picker  v-model="scope.row.END_DATE_" format='yyyy-MM-dd' value-format='yyyy-MM-dd' type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="检查负责人">
                  <template slot-scope="scope">
                    <div>{{scope.row.principal}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="spot" label="备注">
                  <template slot-scope="scope">
                    <div>{{scope.row.spot}}</div>
                  </template>
                </el-table-column>
                
              </el-table>
            </div>
              
            </div>
          </div>
        </div>
      </div>
      <!-- <selectProjMember :selectProjMemberModels='selectProjMemberModels'></selectProjMember> -->

        <div class="add-part-box add-partss" v-if="dialogFormVisible1" >
        <div class="add-part" style="width:600px">
          <el-form :model="form1">
            
            <el-form-item label="预计开始时间" :label-width="formLabelWidth1">
              <el-date-picker class="item_date" @blur="changetime(form1.START_DATE_)" v-model="form1.START_DATE_" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="预计完成时间" :label-width="formLabelWidth1">
              <el-date-picker class="item_date" @blur="changetime1(form1.END_DATE_)" v-model="form1.END_DATE_" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="启动" id="ssss" :label-width="formLabelWidth1">
              <el-switch v-model="form1.ENABLE_" active-color="#13ce66"  inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-form>
          <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">
            <button style="margin-right:20px;" @click="dialogFormVisible1=false">关闭</button>
            <button >保存</button>
          </div>
        </div>
      </div>

      <!-- 选择检查项弹窗 -->
      <div class="add-part-box add-partss" v-show="inspectVisible" >
        <div class="add-part" style="width:800px">
          <div class="item_head" style="width: 100%;height: 40px;">
            <span>区域</span>
            <span @click="createIsShow=!createIsShow" style="text-align: left;line-height: 26px;display: inline-block;width:120px;height:26px;background-color: rgba(255,255,255,.1);color:#ccc;">
              {{tempAreaName}}  <i style="position: relative;left:60px;" v-if="createIsShow" class="el-icon-arrow-up"></i>
              <i style="position: relative;left:60px;" v-if="!createIsShow" class="el-icon-arrow-down"></i>
            </span>
            <div :class="{selcetData:createIsShow==false}" style="color:#000;z-index: 999;overflow: auto;position: absolute;text-align: left;top:26px;left:27px;width:250px;height:250px;background-color: #fff;">
              <asideItems v-for="(item, index) in models"  :key="index" :models="item" :level="0" ></asideItems>
            </div>
          </div>
          <div style="width:500px;height:500px;overflow: hidden;background: #fff;">
              <remote-script src="../../../static/js/leaflet/lib/leaflet.js"  @load="leafletLoaded = true" ></remote-script>
              <remote-script v-if="leafletLoaded" src="../../../static/js/leaflet/lib/leaflet.draw.js" @load="loaded();"></remote-script>
              <div id="map" style="width: 100%; height: 100%; border: 1px solid #ccc"></div>
          </div>
          <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">
            <button style="margin-right:20px;" @click="inspectVisible=false">关闭</button>
            <button >保存</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import asideItems from '@/components/common/asideItem.vue'
  import selectTree from '@/components/common/selectRegion.vue'
  import selectTrees from '@/components/common/selectRegion.vue'
  import { lmap } from '../../../static/js/leaflet/lib/map.js';
  import $ from 'jquery';
  // import selectProjMember from '@/components/common/selectProjMember.vue'
  export default {
    data(){
      return{
        leafletLoaded: false,
        tempAreaName:"",//搜索
        searchValue:"",//搜索
        issueStatus:"",
        imageUrl:"",
        mainData:{},
        selectProjMemberModels:{
          isShow:false,
          selectList:[],
          callBack:this.callBack3,
          radioSelectFlags:false,
        },
        planStatus:'',//计划状态
        planType:'',//计划类型
        importVisable:false,
        inspectVisible:false,  //选择检查项
        form1:{},
        tableData:[],
        childrenData:[],
        selectData:[], //选中的数据
        selectChildData:[], //选中的明细
        models:[],  //区域数据
        createIsShow:false,//
        formLabelWidth:'90px',
        formLabelWidth1:'90px',
        currentPage:1,
        tableHeightNum:0,
        dialogFormVisible:false,
        dialogFormVisible1:false,
        pageIndex:1,
        pageSize:10,
        totalCount:0,
        nowDayOfWeek: 0,
        nowDay: 0,
        nowMonth: 0,
        nowYear: 0,
      }
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      var now = new Date(); //当前日期
      this.nowDayOfWeek = now.getDay(); //今天本周的第几天
      this.nowDay = now.getDate(); //当前日
      this.nowMonth = now.getMonth(); //当前月
      this.nowYear = now.getFullYear(); //当前年 
      this.loadData();
      this.getAearData();
    },
    mounted(){
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
      })
    },
    methods:{
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
      getAearData(){
        this.util.restGet('/api_v1/construction/inspect/partTree',{projUid:this.$store.state.selectProjectObj.id},(res)=>{
          if(res.status==200&&res.data!=undefined){
            this.models=res.data;
          }else{
            this.models=[];
          }

        });
      },
      handleCurrentChange(val){
        this.pageIndex=val;
        this.getProcessTaskData();
      },
      loadData(){
        var param={
          projUid:this.$store.state.selectProjectObj.id,
          pageIndex:this.pageIndex,
          pageSize:this.pageSize,
          search : this.searchValue,
          type : this.planType,
          status : this.planStatus,
          issueStatus : this.issueStatus,
        }
        this.util.mask();
        this.util.restGet('/api_v1/construction/measured/plans',param,(res)=>{
          this.util.unmask();
          if(res.status==200&&res.data!=undefined){
            this.tableData = res.data;
            this.totalCount = res.totalCount;
          }else{
            this.tableData=[]
            this.totalCount = 0;
          }
        })
      },
      handleSelectionChange(val){//选中
        this.selectData = val;
      },
      handleChildSelection(val){//选中明细
          this.selectChildData = val;
      },
      batchEidtDate(){//批量修改日期
          if(this.selectChildData.length==0){
            this.util.error("请选择需要修改的数据!");
            return;
          }
          this.dialogFormVisible1=true;
      },
      callBack3(){
        console.log(this.selectProjMemberModels.selectList);
      },
      batchDelete(){
        if(this.selectData.length==0){
          this.util.error("请选择需要删除的数据!");
          return;
        }
        var idArr = this.selectData.map(item=>item.id);
        this.deletePlan(idArr.join(","));
      },
      deletePlan(ids){
        this.util.confirm("确定要删除选中的数据吗?","提示",(res)=>{
            this.util.mask("正在删除...");
            this.util.restDelete("/api_v1/construction/measured/plans/"+ids,{ids:ids},(res)=>{
              this.util.unmask();
                if(res.status==200){
                    this.util.success("删除成功!");
                    this.loadData();
                }
            
            });
        });
      },
      adjust(){//调整
        if(this.selectData.length==0){
          this.util.error("请选择需要调整的数据!");
          return;
        }
        this.editPlan(this.selectData[0].id);
      },
      editPlan(id){
        this.util.mask();
        this.util.restGet('/api_v1/construction/measured/plans/'+id,null,(res)=>{
          this.util.unmask();
          if(res.status==200&&res.data!=undefined){
            this.mainData = res.data;
            this.childrenData = res.data.children==undefined? []:res.data.children;
          }else{
            this.mainData={};
            this.childrenData  = [];
          }
          this.importVisable=true;
        })
      },
      addPlan(value){//新增计划
        var dateObj = this.getMonthWeek();
        if(value=='weekly'){
            this.mainData={
              TYPE_ : value,
              SUBJECT_ : dateObj.getYear + "年"+ dateObj.getMonth + "月第 " + dateObj.getWeek + "周实测实量计划",
              COMPILE_USER_:this.sessionUtil.getUserName(),
              START_DATE_:this.getWeekStartDate(),
              END_DATE_:this.getWeekEndDate(),
              COMPILE_DATE_:new Date().format("yyyy-MM-dd hh:mm")
            }
        }else{
          this.mainData={
              TYPE_ : value,
              SUBJECT_ : dateObj.getYear + "年"+ dateObj.getMonth + "月实测实量计划",
              COMPILE_USER_:this.sessionUtil.getUserName(),
              START_DATE_:this.getMonthStartDate(),
              END_DATE_:this.getMonthEndDate(),
              COMPILE_DATE_:new Date().format("yyyy-MM-dd hh:mm")
            }
        }
        this.childrenData = [];
        this.importVisable=true
      },
      addChild(){
        this.childrenData.push({
          AREA_CODE_:""
        });
      },
      saveData(issueStatus){//保存数据
        if(!this.validUtil.isNotEmpty(this.mainData.id)){//新增
            this.mainData.STATUS_ = 0;
        }
        this.mainData.START_DATE_ = new Date(this.mainData.START_DATE_).format("yyyy-MM-dd");
        this.mainData.END_DATE_ = new Date(this.mainData.END_DATE_).format("yyyy-MM-dd");
        this.mainData.ISSUE_STATUS_ = issueStatus;
        this.mainData.PROJ_UID_ = this.$store.state.selectProjectObj.id;
        var subFormList=[];
        var subFormObj={subFormForeignKey:"PARENT_UID_",subFormTable:"t_inspection_plan_det",data:JSON.stringify(this.childrenData)};
        subFormList.push(subFormObj)
        var params = {formKey:"measured_plan",mainFormData:JSON.stringify(this.mainData),sqlTableName:"t_inspection_plan",subFormData:JSON.stringify(subFormList),ifSaveWorkflow:false};

        if(this.validUtil.isNotEmpty(this.mainData.id)){
            params['id']=this.mainData.id;
            params['businessKey']=this.mainData.id;
        }
        this.util.restPost("/api_v1/form/business",params,(res)=>{
          if(res.status==200){
            this.util.success('保存成功');
            this.loadData();
            this.importVisable=false;
          }else{
            this.util.error(res.errorMsg);
          }
        });
      },
      getMonthWeek() {//获取当前周数
          // var date = new Date(year, parseInt(month) - 1, day),
          var date = new Date(),
              w = date.getDay(),
              d = date.getDate();
          if(w==0){
            w=7;
          }
          var config={
            getMonth:date.getMonth()+1,
            getYear:date.getFullYear(),
            getWeek:Math.ceil((d + 6 - w) / 7)
          }
          return config;
      },
      //获得本周的开始日期
      getWeekStartDate() {
        
        var weekStartDate = new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek+1);
        return weekStartDate.format("yyyy-MM-dd");
      },
      getWeekEndDate(){//获得本周的结束日期
        var weekEndDate = new Date(this.nowYear, this.nowMonth, this.nowDay + (6 - this.nowDayOfWeek+1));
        return weekEndDate.format("yyyy-MM-dd");
      },
      //获得本月的开始日期
      getMonthStartDate(){
        var monthStartDate = new Date(this.nowYear, this.nowMonth, 1);
        return monthStartDate.format("yyyy-MM-dd");
      },
      //获得本月的结束日期
      getMonthEndDate(){
        var monthEndDate = new Date(this.nowYear, this.nowMonth, this.getMonthDays(this.nowMonth));
        return monthEndDate.format("yyyy-MM-dd");
      },
      //获得某月的天数
      getMonthDays(myMonth){
          var monthStartDate = new Date(this.nowYear, myMonth, 1);
          var monthEndDate = new Date(this.nowYear, myMonth + 1, 1);
          var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
          return days;
      },
    },
    components:{
      asideItems,selectTree,selectTrees,//selectProjMember
    }
  }
</script>

<style scoped>

.add-part-box span {
    width: auto;
    display: inline-block;
    float: left;
}
  .selcetData{
    display: none;
    transition: all 0.5s;
  }
  .ProcessTask{
    width:100%;
    height:100%;
    box-sizing: border-box;
    color:#fff;
    font-size: 12px;
  }
  .ProcessTask_head{
    width:100%;
    height:100%;
    padding-bottom: 100px;
    box-sizing: border-box;
  }
  .parcess_head{
    width:100%;
    padding:13px 14px;
    border:1px solid rgba(68,210,255,1);
    box-sizing: border-box;
    display: flex;
    margin-bottom: 10px;
  }
  .parcess_head .item_head{
    margin-right: 20px;
  }

</style>

<style>
  .parcess_head .el-select{
    background-color: rgba(255,255,255,0.2);
    width:100px;
  }
  .parcess_head .el-input--mini .el-input__inner{
    height:26px;
  }
  .parcess_model .el-dialog{
    width:375px;
  }
  
  .add-partss span{
    width:25px !important;
  }
  .addbernum span{
    width:auto !important;
  }
  #ssss span{
    width:40px !important;
  }
  #ssss .el-form-item__content{
    text-align: left;
  }
  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: auto;
}
.add-part .el-table, .add-part .el-table thead {

    color: #000;

}
  /*.add-partss .el-switch__core:after{*/
    /*!*color:*!*/
  /*}*/
</style>
