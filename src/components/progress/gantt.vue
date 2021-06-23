<template>
  <div style="height:100%">
    <!-- <remote-script src="static/js/dhtmlxgantt/dhtmlxgantt.js"  @load="initGantt" ></remote-script>
    <remote-script v-if="isLoaded" src="static/js/dhtmlxgantt/api.js"   ></remote-script> -->
    <div ref="gantt" height="100%" style="height:100%;width:100%;overflow-x:auto;overflow-y:hidden"></div>
    <el-dialog id="gantt-task" title="任务详情" :visible.sync="taskDialogVisible"  width="630px" @close="cancleTask();">
        <div>
          <el-form ref="taskInfo" :model="taskInfo" label-width="80px" size="mini">
            <el-form-item label="主键" style="display:none;">
              <el-input v-model="taskInfo.uid"></el-input>
            </el-form-item>
            <el-form-item label="任务名称" prop="text" :rules="[{ required: true, message: '请输入任务名称', trigger: 'blur' }]"  style="width:100%;">
              <el-input v-model="taskInfo.text" :disabled="!ifModification"  style="width: 100%;"></el-input>
            </el-form-item>
            <!-- <el-form-item label="任务编码" prop="id" :rules="[{ required: true, message: '请输入任务编码', trigger: 'blur' }]" style="width:100%;">
              <el-input v-model="taskInfo.coding"  ></el-input>
            </el-form-item> -->
            <div style="display:flex;width:100%;">
                <div style="display:flex;width:50%;">
                    <el-form-item label="任务编码" prop="coding" :rules="[{ required: true, message: '请输入任务编码', trigger: 'blur' }]" style="width: 100%;">
                      <el-input v-model="taskInfo.coding" :disabled="!ifModification" ></el-input>
                    </el-form-item>
                </div>
                <div style="display:flex;width:50%;">
                    <el-form-item label="职能" style="width: 100%;">
                      <el-input v-model="taskInfo.function" disabled></el-input>
                    </el-form-item>
                </div>
            </div>
            <el-form-item label="完成标准" prop="id"  style="width:100%;">
              <el-input v-model="taskInfo.taskStandard"  :disabled="!ifModification"></el-input>
            </el-form-item>
            <div style="display:flex;width:100%;">
                <div style="display:flex;width:50%;">
                    <el-form-item label="节点层级" style="width: 100%;">
                      <el-select v-model="taskInfo.taskType" :disabled="!ifModification" filterable placeholder="请选择" @change="changeApproval">
                        <el-option
                          v-for="item in specialtyList" :key="item.id"
                          :label="item.name"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                </div>
                <div style="display:flex;width:50%;">
                    <el-form-item label="权重比例" style="width: 100%;">
                      <el-input v-model="taskInfo.taskWeight" :disabled="!ifModification"></el-input>
                    </el-form-item>
                </div>
            </div>
            <div style="display:flex;width:100%;">
                <div style="display:flex;width:50%;">
                    <el-form-item label="负责人" style="width: 100%;" prop="assignee" :rules="[{ required: true, message: '请输入负责人', trigger: 'blur' }]">
                        <el-select v-model="taskInfo.assignee" :disabled="!ifModification" filterable placeholder="请选择" @change="changePrincipal">
                          <el-option
                            v-for="(item,key) in options"
                            :key="key"
                            :label="item.userName"
                            :value="item.id">
                            <span style="float: left">{{ item.userName }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.position }}</span>
                          </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div style="display:flex;width:50%;">
                  <el-form-item label="审批人" style="width: 100%;" >
                    <el-select v-model="approver" :disabled="!ifModification" filterable placeholder="请选择" @change="changeApproval">
                        <el-option
                          v-for="item in options"
                          :key="item.id"
                          :label="item.userName"
                          :value="item.id">
                          <span style="float: left">{{ item.userName }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.position }}</span>
                        </el-option>
                      </el-select>
                  </el-form-item>
                </div>
            </div>
            <div style="display:flex;width:100%;">
                <div style="display:flex;width:37%;">
                    <el-form-item label="计划开始" style="width: 100%;" prop="startDate" :rules="[{ required: true, message: '请输入计划开始日期', trigger: 'blur' }]">
                      <el-date-picker type="date" :disabled="!ifModification" @change="dateChange('startDate');" placeholder="开始日期" v-model="taskInfo.startDate"
                      value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                      style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </div>
                <div style="display:flex;width:37%;">
                    <el-form-item label="计划完成" :disabled="!ifModification" style="width: 100%;" prop="endDate" :rules="[{ required: true, message: '请输入计划完成日期', trigger: 'blur' }]">
                  <el-date-picker type="date" placeholder="计划完成"  @change="dateChange('startDate');" v-model="taskInfo.endDate"
                  value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 100%;float:left;"></el-date-picker>
                  </el-form-item>
                </div>
                <div style="display:flex;width:26%;">
                    <el-form-item label="计划工期" width="90px"  prop="duration" :rules="[{ required: true, message: '请输入计划工期', trigger: 'blur' }]">
                      <el-input v-model="taskInfo.duration" placeholder="计划工期" :disabled="true" style="width:50px;" type="number" min="1"></el-input>
                    </el-form-item>
                </div>
            </div>
            <div style="display:flex;width:100%;">
                <div style="display:flex;width:37%;">
                    <el-form-item label="实际开始" style="width: 100%;" :rules="[{ message: '请选择开始日期', trigger: 'blur' }]">
                      <el-date-picker type="date" :disabled="!ifModification" placeholder="实际开始日期" @change="dateChange('actStartDate');"
                      value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="taskInfo.actStartDate" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </div>
                <div style="display:flex;width:37%;">
                    <el-form-item label="实际完成" style="width: 100%;" :rules="[{  message: '请选择完成日期', trigger: 'blur' }]">
                  <el-date-picker type="date" :disabled="!ifModification" placeholder="实际完成" @change="dateChange('actStartDate');"
                  value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="taskInfo.actEndDate" style="width: 100%;float:left;"></el-date-picker>
                  </el-form-item>
                </div>
                <div style="display:flex;width:26%;">
                    <el-form-item label="实际工期" style="width: 100%;" :rules="[{  message: '请选择实际工期', trigger: 'blur' }]">
                      <el-input v-model="taskInfo.actDuration" placeholder="工期"  :disabled="true" style="width:50px;" type="number" min="0"></el-input>
                    </el-form-item>
                </div>
            </div>
            <div style="display:flex;width:100%;">
                <div style="display:flex;width:50%;">
                    <el-form-item label="进度" style="width: 100%;">
                      <el-input :disabled="!ifModification" v-model="taskInfo.progress" style="width:60%;float:left;" type="number"></el-input><span style="float:left;">%</span>
                    </el-form-item>
                </div>
                <div style="display:flex;width:50%;">
                    <el-form-item label="排序" style="width: 100%;">
                    <el-input :disabled="!ifModification" v-model="taskInfo.sort" style="width: 100%;"></el-input>
                  </el-form-item>
                </div>
            </div>

            <el-form-item label="上级任务"  style="display:none;">
              <el-input v-model="taskInfo.parent" :disabled="!ifModification"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-popover placement="top" width="400" trigger="click">
            <el-timeline :reverse="reverse">
              <el-timeline-item  v-for="(activity, index) in recordList"  :key="index"
                :timestamp="activity.createTime">
                <span>{{activity.createUser+':上报进度'+activity.progress}}</span>
                <p>{{activity.content}}</p>
              </el-timeline-item>
            </el-timeline>
            <el-button size="mini" v-show="recordList.length>0" style="float: left;" slot="reference">上报记录</el-button>
          </el-popover>
          <el-button size="mini" @click="taskDialogVisible = false; assignee='';approver='';">取消</el-button>
          <el-button size="mini" type="primary" v-show="$parent.scheduleNode.version==$parent.maxVersion" @click="saveTask();">保存</el-button>
        </span>
      </el-dialog>

    <el-dialog title="批量设置任务" :visible.sync="batchSetVisable" width="850px" style="height: 90%;" class="batch-set">

        <div style="height:100%;overflow: auto;display: flex;">
            <div style="width:500px;height:380px;border: 1px solid #44d2ff;padding: 5px;margin-right: 5px;overflow: auto;">
              <div style="text-align: left;font-size: 18px;color:#000;">
                  <span style="margin-right: 10px;">选择节点</span>
              </div>

              <div  style="margin-top: 10px;">
                  <el-tree show-checkbox node-key="id" :load="loadChildTasks" lazy :props="defaultProps" ref="tree"></el-tree>
              </div>

            </div>
            <div style="width:350px;height:380px;text-align: left;border: 1px solid #44d2ff;padding: 5px;">
            <div style="font-size: 18px;color:#000;">下达任务</div>
            <el-form>
                <el-form-item label="负责人" label-position="left" label-width="90px">
                <el-select v-model="assignee"  class="item_date" style="width: 95%;" placeholder="请选择">
                    <el-option v-for="(item,index) in options" :key="index" :label="item.userName" :value="item.id">
                    <span style="float: left">{{ item.userName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.position }}</span>
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="审批人" label-position="left" label-width="90px">
                <el-select v-model="approver" class="item_date" style="width: 95%;" placeholder="请选择">
                    <el-option v-for="(item,index) in options" :key="index" :label="item.userName" :value="item.id">
                      <!-- <span style="float: left">{{ item.userName }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.position }}</span> -->
                    </el-option>
                </el-select>
                </el-form-item>

                <el-form-item label="计划开始" label-width="90px">
                <el-date-picker class="item_date addbernum" v-model="taskInfo.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                </el-date-picker>
                </el-form-item>
                <el-form-item label="计划完成" label-width="90px">
                <el-date-picker class="item_date" v-model="taskInfo.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                </el-date-picker>
                </el-form-item>
            </el-form>

            </div>
        </div>
        <div style="text-align: right;padding: 10px 0px;">
                <el-button @click="batchSetVisable=false">关闭</el-button>
                <el-button @click="batchUpdateTask()" type="primary">保存</el-button>

            </div>
    </el-dialog>

    <el-dialog title="导入模板" :visible.sync="importTempVisable" width="850px" style="height: 90%;" class="batch-set">

        <div style="height:100%;overflow: auto;">
            <div style="height:380px;border: 1px solid #44d2ff;padding: 5px;overflow: auto;">

              <div  style="margin-top: 10px;">
                  <el-tree show-checkbox node-key="id" :load="loadTemplateData" lazy :props="defaultProps" ref="tempTree"></el-tree>
              </div>

            </div>

        </div>
        <div style="text-align: right;padding: 10px 0px;">
                <el-button @click="importTempVisable=false">关闭</el-button>
                <el-button @click="insertTemplate()" type="primary">保存</el-button>

            </div>
    </el-dialog>

  </div>

</template>

<script>
import { getDataByApi } from '@/api/api'
import 'dhtmlx-gantt'
export default {
  name: 'gantt',
  props: {
    scheduleNode:{},
    tasks: {

    },scheduleUid:''
    ,projUid:''
  },
  data () {
    return {
      isLoaded:false,
      reverse: true,
      batchSetVisable:false,
      importTempVisable:false,//导入模板
      form:{},
      cities:[],
      defaultProps: {
        children: 'children',
        label: 'text',
        isLeaf: 'leaf'
      },
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
      assignee:'',
      approver:'',
      options:[],
      taskLists:[],//任务数据
      specialtyList:[],
      isNew:false,
      taskDialogVisible:false,
      selectTask:null,
      currentTask:null,
      insertTasks:{},
      updateTasks:{},
      deleteTasks:{},
      insertLinks:{},
      deleteLinks:{},
      recordList:[],
      taskInfo:{
        uid:'',
        id:null,
        type:1,
        text:'',
        coding:'',
        function:"",
        taskStandard:'',
        taskType:'',
        taskWeight:'',
        startDate:'',
        endDate:'',
        actStartDate:'',
        actEndDate:'',
        actDuration:'',
        duration:'',
        progress:'',
        assignee:'',
        assigneeName:'',
        approver:'',
        approverName:'',
        status:'',
        sort:0,
        parent:''
      },
      ifModification:true, //是否可编辑
    }
  },
  created(){
    this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'))
    this.getOptions()
    this.getDict()//获取数字字典
    
  },
  mounted: function () {
    // gantt.config.scale_unit = "month";
    this.initGantt();
    //gantt.parse(this.$props.tasks);
    // this.loadData(this.scheduleUid);
    
  },
   watch: {
      '$store.state.selectProjectObj.id': function (val, oldVal) {
        this.loadData()
      }
    },
  methods:{
    initGantt(){
      var locale = {"date":{
      "month_full":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
      "month_short":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
      "day_full":["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],"day_short":["周日","周一","周二","周三","周四","周五","周六"],
      "month_short_hash":{"1月":0,"2月":1,"3月":2,"4月":3,"5月":4,"6月":5,"7月":6,"8月":7,"10月":8,"11月":9,"11月":10,"12月":11},
      "month_full_hash":{"1月":0,"2月":1,"3月":2,"4月":3,"5月":4,"6月":5,"7月":6,"8月":7,"10月":8,"11月":9,"11月":10,"12月":11}},
      "labels":{"new_task":"新建任务","icon_save":"保存","icon_cancel":"取消","icon_details":"Details","icon_edit":"Edit","icon_delete":"删除","confirm_closing":"","confirm_deleting":"您确定要删除该任务?","section_description":"描述","section_time":"计划时间周期","section_type":"Type","column_wbs":"WBS","column_text":"任务名称","column_start_date":"开始日期","column_duration":"工期","column_add":"","link":"Link","confirm_link_deleting":"will be deleted","link_start":" (start)","link_end":" (end)","type_task":"Task","type_project":"Project","type_milestone":"Milestone","minutes":"Minutes","hours":"Hours","days":"Days","weeks":"Week","months":"Months","years":"Years","message_ok":"OK","message_cancel":"Cancel","gantt_save_btn":"Save","gantt_cancel_btn":"Cancel","gantt_delete_btn":"Delete"}};
      gantt.locale = locale;
      // gantt.config.grid_width = 380;


      // gantt.config.add_column = false;
      /*
          gantt.templates.grid_row_class = function (start_date, end_date, item) {
              if (item.progress == 0) return "red";
              if (item.progress >= 1) return "green";
          };
          gantt.templates.task_row_class = function (start_date, end_date, item) {
              if (item.progress == 0) return "red";
              if (item.progress >= 1) return "green";
          };
        */
      //设置连接线的颜色
      gantt.templates.link_class = function (link) {
        var types = gantt.config.links;
        switch (link.type) {
          case types.finish_to_start:
            return "finish_to_start";
            break;
          case types.start_to_start:
            return "start_to_start";
            break;
          case types.finish_to_finish:
            return "finish_to_finish";
            break;
        }
      };

      //高亮节假日
      gantt.templates.scale_cell_class = function (date) {
        if (date.getDay() == 0 || date.getDay() == 6) {
          return "weekend";
        }
      };
      gantt.templates.timeline_cell_class = function (item, date) {
        if (date.getDay() == 0 || date.getDay() == 6) {
          return "weekend"
        }
      };
      gantt.templates.task_class  = function(start, end, task){
        console.log('---------task_class---------',start, end,task.endDate,task.actEndDate, task)
        // return 'task-after-current'
        if(_this.validUtil.isNotNull(task.endDate)){
          let endDate = new Date(task.endDate)
          let actEndDate = new Date()
          if(_this.validUtil.isNotNull(task.actEndDate)){
            actEndDate = new Date(task.actEndDate)
          }
          if(endDate.format('yyyy-MM-dd') !== actEndDate.format('yyyy-MM-dd')){
            if(endDate.getTime()< actEndDate.getTime()){
              return 'task-over-date'
            }
          }
        }
        return 'task-normal'
        /*task.priority = '3'
        switch (task.priority){
          case "1":
            return "high";
            break;
          case "2":
            return "medium";
            break;
          case "3":
            return "low";
            break;
        }*/
      };
      //在grid显示进度值
      gantt.templates.progress_text = function (start, end, task) {
        return "<p style='text-align:left;'>" + Math.round(task.progress * 100) + "% </p>";
      };
      gantt.config.columns = [
        {"name":"text", label: "任务名称","tree":true,"width":200,"resize":true,"align":"left"},
        {"name":"coding", label: "任务编码","resize":true,"width":70},
        {"name":"start_date", label: "计划开始日期","align":"center","resize":true,"width":100,	template: function (item) {	if (item.start_date != undefined){  return item.start_date;  }else{ return ''; }}},
        {"name":"end_date", label: "计划完成日期","align":"center","resize":true,"width":100,	template: function (item) {	if (item.end_date != undefined){  return item.end_date;  }else{ return ''; }}},
        {"name":"duration", label: "计划工期(天)","align":"center","resize":true,"width":70,	template: function (item) {	if (item.duration != undefined){  return item.duration;  }else{ return ''; }}},
        {"name":"actStartDate", label: "实际开始日期","align":"center","resize":true,"width":90,	template: function (item) {	if (item.actStartDate != undefined){  return item.actStartDate;  }else{ return ''; }}},
        {"name":"actEndDate", label: "实际完成日期","align":"center","resize":true,"width":90,	template: function (item) {	if (item.actEndDate != undefined){  return item.actEndDate;  }else{ return ''; }}},
        {"name":"actDuration", label: "工期(天)","align":"center","width":70,	template: function (item) {	if (item.actDuration != undefined){  return item.actDuration;  }else{ return ''; }}},
        {"name":"critical", label: "里程碑","align":"center","width":70,	template: function (item) {	if (item.critical != undefined){  return item.critical ? '是':'否';  }else{ return ''; }}},
        {"name":"progress", label: "进度","align":"center","width":70,
          template: function (item) {
            if (item.progress >= 1)
              return "完成";
            if (item.progress == undefined || item.progress == 0)
              return "0%";
            return Math.round(item.progress * 100) + "%";
          }},
        {"name":"assigneeName", label: "责任人","align":"center","width":90,	template: function (item) {	if (item.assigneeName != undefined){  return item.assigneeName;  }else{ return ''; }}},
      ];
      gantt.config.keep_grid_width = false
      gantt.config.grid_resize = true
      // 配置可以拖拽
      gantt.config.order_branch = true;
      gantt.config.order_branch_free = true;
      /*gantt.config.scale_unit = "month";
      gantt.config.work_time = true;
      gantt.config.date_scale = "%Y, %F";
      gantt.config.duration_unit = "day";
      gantt.config.autoscroll = true;
      gantt.config.scale_height = 20 * 3;
      gantt.config.row_height = 28;
      gantt.config.scale_height = 50;
      gantt.config.subscales = [
        {unit: "day", step: 1, date: "%j, %D"}
      ];*/
      gantt.config.layout = {
              css: "gantt_container",
              cols: [
                  {
                      width:400,
                      min_width: 300,

                      // adding horizontal scrollbar to the grid via the scrollX attribute
                      rows:[
                          {view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer"},
                          {view: "scrollbar", id: "gridScroll"}
                      ]
                  },
                  {resizer: true, width: 1},
                  {
                      rows:[
                          {view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer"},
                          {view: "scrollbar", id: "scrollHor"}
                      ]
                  },
                  {view: "scrollbar", id: "scrollVer"}
              ]
          };
      
      var _this = this;
      gantt.attachEvent("onBeforeLightbox", function (id) {
          console.log("=========onBeforeLightbox=========");
          //gantt.deleteTask(id);
          //_this.$refs['taskInfo'].resetFields();
          var task = gantt.getTask(id);
          console.log("=========新增====task=====",task);
          
          let userName =_this.sessionUtil.getUserName();
          let isCompanyAdmin =_this.sessionUtil.isCompanyAdmin();
          _this.ifModification =(task.createUser==userName||isCompanyAdmin);
          for(var key in _this.taskInfo){
            if(task[key] != undefined){
              _this.taskInfo[key] = task[key];
            }else{
              _this.taskInfo[key] = '';
            }
          }
          _this.taskInfo.progress = parseInt(task.progress*100);
          //  _this.taskInfo.startDate = task.start_date.format('yyyy-MM-dd');
          _this.taskInfo.startDate = task.startDate;
          _this.taskInfo.endDate = task.endDate;
          if(task.limitNums){
            _this.taskInfo.duration = task.limitNums;
          }
          _this.taskInfo.taskStandard = task.taskStandard;
          _this.taskInfo.taskType = task.taskType;
          _this.taskInfo.taskWeight = task.taskWeight;
          _this.recordList = [];
          //判断是否新增
          if(!_this.validUtil.isNotEmpty(_this.taskInfo.uid) && _this.insertTasks[_this.taskInfo.id] == undefined){//新增
            _this.ifModification=true;
            var children = gantt.getChildren(task.parent);
            task.progress = 0;
            task.sort = children.length;
          }else{
            _this.getTaskDetails(_this.taskInfo.uid);//获取填报记录
            _this.taskDialogVisible = true;

          }
          _this.assignee=_this.taskInfo.assignee
          _this.approver=_this.taskInfo.approver
          _this.$forceUpdate()

          //task.my_template = "<span id='title1'>Holders: </span>" + task.users + "<span id='title2'>Progress: </span>" + task.progress * 100 + " %";
          return false;
        });
      gantt.attachEvent("onTaskCreated", function (task) {
        //gantt.deleteTask(task.id);
        //_this.currentTask = task;
        // task.planStartDate = task.start_date;
        // task.planDuration = task.duration;
        // _this.taskInfo = task;
        //task.my_template = "<span id='title1'>Holders: </span>" + task.users + "<span id='title2'>Progress: </span>" + task.progress * 100 + " %";
        return true;
      });

      gantt.attachEvent("onLightboxButton", function (css, node, e){
        //any custom logic here
      });
      gantt.attachEvent("onTaskClick", function(id,e){
        _this.selectTask = gantt.getTask(id);
        console.log("=========onTaskClick=========",_this.selectTask);
        return true;
      });
      gantt.attachEvent("onAfterLinkAdd", function(id,e){
        console.log("=========onAfterLinkAdd=========");
        var link = gantt.getLink(id);
        _this.insertLinks[link.id] = link;
        return true;
      });
      gantt.attachEvent("onAfterLinkUpdate", function(id,e){
        console.log("=========onAfterLinkUpdate=========");
        var link = gantt.getLink(id);
        return true;
      });
      gantt.attachEvent("onAfterLinkDelete", function(id,item){
        console.log("=========onAfterLinkDelete=========");
        var link = gantt.getLink(id);
        //判断是否后台已经有数据
        if(_this.validUtil.isNotEmpty(item.uid)){
          _this.deleteLinks[item.id] = item;
        }else{
          delete _this.insertLinks[item.id];
        }
        return true;
      });
      gantt.attachEvent("onAfterTaskDrag", function(id,e){
        var task = gantt.getTask(id);
        return true;
      });
      gantt.attachEvent("onAfterTaskMove", function(id,e){
        var task = gantt.getTask(id);
        return true;
      });
      gantt.attachEvent("onAfterTaskAdd", function(id,e){
        console.log("=========onAfterTaskAdd=========");
        var task = gantt.getTask(id);
        console.log(task);
        //加入修改队列
        _this.insertTasks[task.id] = task;
        _this.changeParent(task)
        return true;
      });
      gantt.attachEvent("onAfterTaskUpdate", function(id,e){
        console.log("=========onAfterTaskUpdate========="+id);
        var task = gantt.getTask(id);
        //判断是否后台已经有数据
        if(_this.validUtil.isNotEmpty(task.uid)){
          //加入修改队列
          _this.updateTasks[task.id] = task;
        }else{
          _this.insertTasks[task.id] = task;
        }
        _this.changeParent(task)
        return true;
      });
      gantt.attachEvent("onAfterTaskDelete", function (id,task) {
        console.log("=========onAfterTaskDelete========="+id);
        return true;
      });
      gantt.attachEvent("onBeforeTaskAdd", function (id) {
        console.log("=========onBeforeTaskAdd========="+id);
        //var task = gantt.getTask(id);
        //task.my_template = "<span id='title1'>Holders: </span>" + task.users + "<span id='title2'>Progress: </span>" + task.progress * 100 + " %";
        return true;
      });
      gantt.attachEvent("onAfterTaskDrag", function(id, mode, e){
        //any custom logic here
        console.log("=========onAfterTaskDrag========="+id, mode, e)
      });
      gantt.attachEvent("onRowDragStart", function(id, target, e) {
        //any custom logic here
        var task = gantt.getTask(id);
        _this.dragTaskOldParent = task.parent
        console.log("=========onRowDragStart========="+id,task,task.parent, e)
        return true;
      });
      gantt.attachEvent("onRowDragEnd", function(id, target) {
        var task = gantt.getTask(id);
        console.log("=========onRowDragEnd========="+id,task,task.parent,_this.dragTaskOldParent, target)
        //判断是否后台已经有数据
        if(_this.validUtil.isNotEmpty(task.uid)){
          //加入修改队列
          _this.updateTasks[task.id] = task;
        }
        // _this.changeParent(task)
        //  重新计算排序号
        _this.updateTaskSort(task,task.parent)
        // 重新计算旧的父节点排序号
        _this.updateTaskSort(task,_this.dragTaskOldParent)
        // 重新计算旧的父节点的日期
        let children = gantt.getChildren(_this.dragTaskOldParent)
        if(children && children.length>0){
          let t = gantt.getTask(children[0])
          _this.changeParent(t)
        }else{
          // 说明移走后原父节点变成了叶子
          let t = gantt.getTask(_this.dragTaskOldParent)
          if(t)
            _this.changeParent(t)
        }
        return true;
        //any custom logic here
      });
      gantt.attachEvent("onAfterTaskMove", function(id, parent, tindex){
        console.log("=========onAfterTaskMove========="+id, parent, tindex)
      });
      var zoomConfig = {
        minColumnWidth: 80,
        maxColumnWidth: 150,
        levels: [
          {
            name:"day",
            scale_height: 27,
            min_column_width:80,
            scales:[
              {unit: "day", step: 1, format: "%M%d日"}
            ]
          },
          {
            name:"week",
            scale_height: 50,
            min_column_width:50,
            scales:[
              {unit: "week", step: 1, format: function (date) {
                  var dateToStr = gantt.date.date_to_str("%M%d日");
                  var endDate = gantt.date.add(date, -6, "day");
                  var weekNum = gantt.date.date_to_str("%W")(date);
                  return "#" + weekNum + ", " + dateToStr(date) + " - " + dateToStr(endDate);
                }},
              {unit: "day", step: 1, format: "%j %D"}
            ]
          },
          {
            name:"month",
            scale_height: 50,
            min_column_width:120,
            scales:[
              {unit: "month", format: "%Y,%F "},
              {unit: "week", format: "第%W周"}
            ]
          },
          {
            name:"quarter",
            height: 50,
            min_column_width:90,
            scales:[
              {unit: "month", step: 1, format: "%M"},
              {
                unit: "quarter", step: 1, format: function (date) {
                  var dateToStr = gantt.date.date_to_str("%M");
                  var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                  return dateToStr(date) + " - " + dateToStr(endDate);
                }
              }
            ]
          },
          {
            name:"year",
            scale_height: 50,
            min_column_width: 30,
            scales:[
              {unit: "year", step: 1, format: "%Y"}
            ]
          }
        ],
        startDate: new Date(2018, 2, 27),
        endDate: new Date(2021, 3, 20),
        useKey: "ctrlKey",
        trigger: "wheel",
        element: function(){
          return gantt.$root.querySelector(".gantt_task");
        }
      };
      // gantt.ext.zoom.init(zoomConfig);
      // gantt.ext.zoom.setLevel('quarter')


      gantt.config.undo = true;
      gantt.config.redo = true;
      gantt.init(this.$refs.gantt);
      //gantt.parse(this.$props.tasks);
      this.loadData(this.scheduleUid);
      gantt.message({
        text: "任务加载完成",
        expire: 3
      });
      this.isLoaded =true
    },
    formater (format, value) {
      if (typeof value === 'number') {
        let date = new Date(value)
        return date.format(format)
      } else if (typeof value === 'string') {
        if (value.indexOf('T') > -1) {
          return value.substring(0, 10)
        } else {
          try {
            if (value.indexOf(':') > -1 || value.indexOf('-')) {
              return value
            } else {
              let num = Number(value)
              let date = new Date(num)
              return date.format(format)
            }
          } catch (e) {
            return value
          }
        }
      } else if (typeof value === 'object') {
        return value.format(format)
      }
    },
    // 拖拽之后修改排序
    updateTaskSort(task,parentId){ 
     let children =  gantt.getChildren(parentId)
      let index = 0
      children.forEach(child => {
        let c = gantt.getTask(child)
        if(c){
          c.sort = ++index
          gantt.updateTask(child);
        }
      })
    },
    changeParent(task){
      if (task.parent && task.parent != 0 && gantt.getTask(task.parent)){
        let parent = gantt.getTask(task.parent)
        if (parent.start_date > task.start_date){
          parent.start_date = task.start_date
        }
        if( parent.end_date < task.end_date){
          parent.end_date = task.end_date
        }
        let children = gantt.getChildren(parent.id)
        // 父节点开始日期为所有儿子的最小日期
        let minStart = task.start_date
        for (let index = 0; index < children.length; index++) {
          const item = gantt.getTask(children[index]);
          if (item.start_date < minStart){
            minStart = item.start_date
          }
        }
        // 如果父节点日期小于所有儿子节点最小日期则修改
        if (parent.start_date < minStart){
          parent.start_date = minStart
        }
         // 父节点结束日期为所有儿子的最大日期
         let maxEnd = task.end_date
        for (let index = 0; index < children.length; index++) {
          const item = gantt.getTask(children[index]);
          if (item.end_date > maxEnd){
            maxEnd = item.end_date
          }
        }
        // 如果父节点日期大于所有儿子节点最大日期则修改
        if (parent.end_date > maxEnd){
          parent.end_date = maxEnd
        }
        gantt.updateTask(parent.id);
      }
    },
    deepUpdateTask(id){ // 当有节点增删改查时 递归计算并更新上级节点，id是增删改查节点的父节点
      if(this.validUtil.isNull(id) || id ===0 || id ==='0' || id ==='root'){
        return
      }
      var task = gantt.getTask(id)
      if(task){
        var children = gantt.getChildren(id)
        let totalWeight = 0
        let totalProgress = 0
        children.forEach(childId => {
          let child = gantt.getTask(childId)
          if(child){
            let taskWeight = child.taskWeight
            let taskProgress = child.progress
            // 默认权重是100
            let weight = this.validUtil.isNull(taskWeight) ? 100 : Number(taskWeight)
            totalWeight += weight
            // 默认进度是0
            let progress = this.validUtil.isNull(taskProgress) ? 0 : Number(taskProgress)
            totalProgress += progress*weight
            // console.log(child.text+'-------deepUpdateTask----1----'+progress,weight,child)

          }
        })
        let progress = (totalWeight === 0 ? totalProgress/100 : totalProgress/totalWeight).toFixed(2)
        // console.log((progress === 0.00)+'---'+(typeof progress)+'--progress----'+progress)
        task.progress = progress === '0.00' ? 0.01: progress
        // task.progress = 0.01
        // console.log(task.text+'-------deepUpdateTask--------'+task.progress,totalProgress,totalWeight,task)
        // 更新甘特图
        gantt.updateTask(id)
        // this.updateTasks[task.id] = task;
        // this.deepUpdateTask(task.parent)
      }

    },
    getTaskDetails(id){
      this.util.mask();
      console.log("开始获取填报记录了=============");
      this.util.restGet('/api_v1/business/progress/getTaskDetailsById', {id:id}, (res)=> {
          this.util.unmask();
          if(res.status==200&&res.data!=undefined){

            this.recordList =res.data.record? res.data.record:[];
            // this.taskInfo = res.data;
            // this.mainData.PROGRESS_ = res.data.progress;
            // this.mainData.delayNum = this.datedifference(res.data.actEndDate,res.data.endDate);
          }
      });
    },
    getDict(typeVal){
      this.util.restGet('/api_v1/dic/SYS_PROJECT_TASKTYPE_/items',null, (res)=> {//项目类型
        if(res.status==200&&res.data){
          this.specialtyList=res.data;
        }else{
          this.specialtyList=[];
        }
  		})

    },
    loadTemplateData(node,resolve){//加载进度模板数据
        var params ={
          scheduleUid:this.scheduleUid,
          parentUid:node.data==undefined? "root":node.data.id
        };
        this.util.restGet('/api_v1/business/progress/templates', params, (res)=> {
            if(res.status==200&&res.data){
              resolve(res.data);
            }else{
              resolve([]);
            }
        });
    },
    insertTemplate(){//导入模板
      // let recieve = this.$refs.tempTree.getHalfCheckedNodes();//半选中
      // let dataRecieve = this.$refs.tempTree.getCheckedNodes();//全选

      // let importData = recieve.concat(dataRecieve);
      let importData=[];
      var parentId = 0;
      this.util.mask("正在导入");
      this.util.restPost(`/api_v1/business/progress/importTemp/${parentId}/${this.scheduleUid}`, {_list: importData}, (res)=> {
          if (res.status == 200) {
              this.util.successToast("导入成功！");
              this.$parent.back();
          }else {
              this.util.failueToast(res.errorMsg);
          }
          this.util.unmask();
      });
    },
    loadChildTasks(node,resolve){//加载子任务
        var params ={
          scheduleUid:this.scheduleUid,
          parentUid:node.data==undefined? "0":node.data.code
        };
        this.loadIteming=true;
        this.util.restGet('/api_v1/business/progress/childTasks', params, (res)=> {
            this.loadIteming=false;
            if(res.status==200&&res.data){
              resolve(res.data);
            }else{
              resolve([]);
            }
        });
    },
    clearTreeSelect(){
      if(this.$refs.tree){
        this.$refs.tree.setCheckedKeys([]);
      }

    },
    batchUpdateTask(){//批量更新任务
      let dataRecieve = this.$refs.tree.getCheckedNodes();//任务
      if(dataRecieve.length==0){
        this.util.error('请选择需要设置的任务!');
        return;
      }
      var assigneeObj = this.options.find(item=>item.id==this.assignee);
      var approverObj = this.options.find(item=>item.id==this.approver);
      var idList = dataRecieve.map(item=>item.id);
      var params ={
          ids:idList.join(","),
          assignee:assigneeObj? assigneeObj.id:"",
          approver:approverObj? approverObj.id:"",
          assigneeName:assigneeObj? assigneeObj.userName:"",
          approverName:approverObj? approverObj.userName:"",
          startDate:this.taskInfo.startDate,
          endDate:this.taskInfo.endDate
        };
        this.util.mask("正在保存..");
        this.util.restGet('/api_v1/business/progress/batchUpdateTask', params, (res)=> {
            this.util.unmask();
            if(res.status==200){
              this.util.success('保存成功');
              this.loadData(this.scheduleUid);
              this.batchSetVisable=false;
            }else{
              this.util.error('保存失败')
            }
        });
    },
    ondo(){
      console.log('======================ondo')
      gantt.undo()
    },
    redo(){
      console.log('======================redo')
      gantt.redo()
    },
    changePrincipal(value){
      let obj = this.options.find(item=>item.id==value);
      this.taskInfo.assigneeName=obj.userName;
      let params={
        pageIndex:1,
        pageSize:1,
        userUid:value
      }
      getDataByApi("api-getUserFunction",params).then(res=>{
        let user=res.data[0];
        if(user){
          this.$set(this.taskInfo,"function",user.REMARK_);
        }else{
          this.$set(this.taskInfo,"function","");
        }
      });
    },
    changeApproval(){
       for (let i = 0; i < this.options.length; i++) {
        if(this.options[i].id==this.approver){
          this.taskInfo.approver=this.options[i].id
          this.taskInfo.approverName=this.options[i].userName
        }
      }
    },
    getOptions(){
            var param={
                // Authorization:this.sessionUtil.getAccessToken(),
                projUid:this.$store.state.selectProjectObj.id,
            }
            this.util.restGet('/api_v1/business/project/getMemberByProjUid',param,(res)=>{
                if(res.status==200){
                    if(res.data){
                      res.data.projUid=res.data.id
                      res.data.id=res.data.userId
                      var arr=[res.data]
                      if(res.data.member&&res.data.member.length>0){
                            for (let i = 0; i < res.data.member.length; i++) {
                            if(res.data.member[i].id!=res.data.id){
                              arr.push(res.data.member[i])
                            }
                          }
                      }
                      this.options=arr
                    }else{
                        this.options=[]
                    }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
    },
    loadData(scheduleUid){
      this.scheduleUid = scheduleUid;
      var _this = this;
      gantt.clearAll();
      _this.util.mask('正在加载...');
      this.util.restGet('/api_v1/business/progress/{id}/data',{id:scheduleUid},(res)=>{
          console.log("进度任务======",res);
                if(res.status==200){
                    if(res.data == undefined){
                      _this.util.unmask();
                      return;
                    }
                    var tasks = res.data.tasks;

                    tasks.forEach(function (task,index) {
                      task.uid = task.id;
                      task.id = task.code;
                      task.limitNums = task.duration;
                      task.progress = task.progress/100;
                      // task.progress = task.progress/100;
                      // task.duration = _this.validUtil.isNotEmpty(task.duration)? task.duration:1;
                      task.start_date = new Date(task.startDate);
                      task.end_date = new Date(task.endDate);
                      if(_this.validUtil.isNotEmpty(task.actStartDate)){
                        task.actStartDate = new Date(task.actStartDate).format('yyyy-MM-dd');
                      }
                      if(_this.validUtil.isNotEmpty(task.actEndDate)){
                        task.actEndDate = new Date(task.actEndDate).format('yyyy-MM-dd');
                      }
                    });
                    var links = res.data.links;
                    if(links&&links.length>0){
                      links.forEach(function (link,index) {
                        link.uid = link.id;
                        link.id = link.code;
                      });
                    }else{
                      links=[];
                    }
                    this.taskLists = tasks;
                    var data = {
                      data:tasks,
                      links:links
                    };
                    gantt.parse(data);
                }else{
                    _this.util.error(res.errorMsg)
                }
                _this.util.unmask();
       });
      //gantt.parse(this.$props.tasks);
    },
    getGantt(){
      return gantt;
    },cancleTask(){
      console.log("==========cancleTask========="+this.taskInfo.id);
      //if(!this.validUtil.isNotEmpty(this.taskInfo.uid)){
      if(!this.validUtil.isNotEmpty(this.taskInfo.uid) && this.insertTasks[this.taskInfo.id] == undefined){
        var task = gantt.getTask(this.taskInfo.id);
        if(task != undefined){
          gantt.deleteTask(this.taskInfo.id);
        }
      }
      this.taskDialogVisible = false;
    },
    dateChange(field){
      var task = gantt.getTask(this.taskInfo.id);
      var calendar = gantt.getTaskCalendar(task);
      if(field == 'startDate'){
        if(this.validUtil.isNotEmpty(this.taskInfo.endDate) && this.validUtil.isNotEmpty(this.taskInfo.startDate)){
            let data1=new Date(this.taskInfo.startDate)
            let data2=new Date(this.taskInfo.endDate)

            let iDays= Date.parse(data2)-Date.parse(data1)
            let Daynum=Math.floor(iDays / (24 * 3600 * 1000))
            this.$forceUpdate()
            if(Daynum<0){
                this.util.error('请选择正确的计划开工时间与计划完工时间')
                return
            }
            this.taskInfo.duration=Daynum+1;
          // var endDate = calendar.calculateEndDate({start_date:this.taskInfo.startDate, duration:this.taskInfo.duration});
          // var duration = calendar.calculateEndDate({start_date:this.taskInfo.startDate, end_date:this.taskInfo.endDate});
          // this.taskInfo.endDate = endDate.format('yyyy-MM-dd');
        }
      }else if(field == 'actStartDate'){
        if(this.validUtil.isNotEmpty(this.taskInfo.actEndDate) && this.validUtil.isNotEmpty(this.taskInfo.actStartDate)){
           let data1=new Date(this.taskInfo.actStartDate)
            let data2=new Date(this.taskInfo.actEndDate)
            let iDays= Date.parse(data2)-Date.parse(data1)
            let Daynum=Math.floor(iDays / (24 * 3600 * 1000))
            this.$forceUpdate()
            if(Daynum<0){
                this.util.error('请选择正确的计划开工时间与计划完工时间')
                return
            }
            this.taskInfo.actDuration=Daynum+1;
          // var actEndDate = calendar.calculateEndDate({start_date:this.taskInfo.actStartDate, duration:this.taskInfo.actDuration});
          // this.taskInfo.actEndDate = actEndDate.format('yyyy-MM-dd');
        }
      }
    },
    addTask(){
        var parentId=this.selectTask&&this.selectTask.id?this.selectTask.id:0;
        var parentTask = null;
        if(parentId!=0){
          parentTask = gantt.getTask(parentId);
        }
        var children = gantt.getChildren(parentId)
        var codingVal = (parentTask? parentTask.coding:"")+(children.length<9? "0"+(children.length+1):children.length+1);

        var startDate = this.scheduleNode.startDate? this.scheduleNode.startDate:new Date().format("yyyy-MM-dd");
        var arr=startDate.split('-')
        var str=arr[2]+'-'+arr[1]+'-'+arr[0]
        var obj={
            text:"新建任务",
            start_date:str,
            startDate:startDate,
            endDate:this.scheduleNode.endDate,
            duration:this.scheduleNode.duration,
            coding:codingVal,
            taskStandard:"",
            taskType:"",
            taskWeight:""
        }
        this.taskDialogVisible = true;
        gantt.createTask(obj, parentId, children.length)
    },
    saveTask(){
        if(!this.taskInfo.assignee) {
          this.util.error('请选择负责人')
          return false;
        }

          // this.approver='';
          this.$refs['taskInfo'].validate((valid) => {
              if (valid) {
                  this.taskDialogVisible = false;
                  this.taskInfo.limitNums = this.taskInfo.duration;
                  var task = this.util.jsonClone(this.taskInfo);
                  // var task =this.taskInfo;

                  var taskId = task.id;
                  //task.end_date = gantt.calculateEndDate(task);
                  task.progress = task.progress/100;
                  //判断是否新增
                  if(this.validUtil.isNotEmpty(task.uid)){
                  // if(this.insertTasks[task.id] != undefined){
                  // if(taskId in this.insertTasks){
                      //说明是修改
                      var old = gantt.getTask(taskId);

                      for(var key in task){
                          old[key] = task[key];
                      }
                      old.start_date = new Date(task.startDate);
                      old.end_date = new Date(task.endDate);
                      gantt.updateTask(taskId);
                  }else{
                      //说明是新增
                      task.start_date = new Date(task.startDate);
                      task.end_date = new Date(task.endDate);
                      // task.start_date = task.startDate;
                      // task.end_date = task.endDate;
                      console.log('说明是新增======',task)

                      gantt.addTask(task,task.parent);
                  }
                  gantt.setSizes()
              } else {

                return false;
              }
            });

        },
        deleteTask(){
          if(this.selectTask == null){
            this.util.warn('请先选择任务！');
            return;
          }
          var children = gantt.getChildren(this.selectTask.id)
          if(children&&children.length>0){
            this.util.warn('该任务下面包含子任务不能删除!');
            return;
          }
          var _this = this;
          this.util.confirm('您确认删除任务('+this.selectTask.text+')吗?','提示',function(){
            //判断是否后台已经有数据
            if(_this.validUtil.isNotEmpty(_this.selectTask.uid)){
              _this.deleteTasks[_this.selectTask.id] = _this.selectTask;
            }else{
              delete _this.insertTasks[_this.selectTask.id];
            }
            var task = gantt.getTask(_this.selectTask.id);
            //删除线
            if(task.$source.length>0){
              for(var m = 0;m<task.$source.length;m++){
                  //var links = gantt.getLinks();
                  var source = task.$source[m];
                  gantt.deleteLink(source);
              }
            }
            if(task.$target.length>0){
              for(var m = 0;m<task.$target.length;m++){
                  var target = task.$target[m];
                  gantt.deleteLink(target);
              }
            }
            //在页面中删除
            gantt.deleteTask(_this.selectTask.id);
            _this.selectTask=null;
          })
        },
        getData(){
          var insertTasksArr = [];
          for(var key in this.insertTasks){
            this.insertTasks[key].startDate =  this.insertTasks[key].start_date.format('yyyy-MM-dd');
            this.insertTasks[key].endDate =  this.insertTasks[key].end_date.format('yyyy-MM-dd');
            var task = this.util.jsonClone(this.insertTasks[key]);
            task.code = task.id;

            delete task.createTime;
            delete task.start_date;
            delete task.end_date;
            delete task.$index;
            delete task.$level;
            delete task.$no_end;
            delete task.$rendered_type;
            delete task.$no_start;
            delete task.$source;
            delete task.$target;
            task.progress = parseInt(task.progress*100);
            // task.progress = task.progress*100;
            task.scheduleUid = this.scheduleUid;
            task.duration = task.limitNums;
            task.projUid = this.projUid;
            insertTasksArr.push(task);
          }
          var updateTasksArr = [];
          for(var key in this.updateTasks){

            this.updateTasks[key].startDate =  this.updateTasks[key].start_date.format('yyyy-MM-dd');
            this.updateTasks[key].endDate =  this.updateTasks[key].end_date.format('yyyy-MM-dd');
            var task = this.util.jsonClone(this.updateTasks[key]);
            //delete task.uid;
            delete task.createTime;
            delete task.start_date;
            delete task.end_date;
            delete task.$index;
            delete task.$level;
            delete task.$no_end;
            delete task.$rendered_type;
            delete task.$no_start;
            delete task.$source;
            delete task.$target;
            // task.progress = task.progress*100;
            task.progress = parseInt(task.progress*100);
            task.code = task.id;
            task.id = task.uid;
            task.duration = task.limitNums;
            task.scheduleUid = this.scheduleUid;
            task.projUid = this.projUid;
            updateTasksArr.push(task);
          }
          var deleteTasksArr = [];
          for(var key in this.deleteTasks){
            var task = this.util.jsonClone(this.deleteTasks[key]);
            delete task.createTime;
            delete task.start_date;
            delete task.end_date;
            delete task.$index;
            delete task.$level;
            delete task.$no_end;
            delete task.$rendered_type;
            delete task.$no_start;
            delete task.$source;
            delete task.$target;
            task.id = task.uid;
            deleteTasksArr.push(task);
          }
          var insertLinksArr = [];
          for(var key in this.insertLinks){
            var link = this.util.jsonClone(this.insertLinks[key]);
            link.code = link.id;
            link.id = link.uid;
            link.scheduleUid = this.scheduleUid;
            link.projUid = this.projUid;
            insertLinksArr.push(link);
          }
          var deleteLinksArr = [];
          for(var key in this.deleteLinks){
            var link = this.util.jsonClone(this.deleteLinks[key]);
            link.id = link.uid;
            delete link.createTime;
            deleteLinksArr.push(link);
          }
          var data = {
            insertTasks : insertTasksArr,
            updateTasks : updateTasksArr,
            deleteTasks : deleteTasksArr,
            insertLinks : insertLinksArr,
            deleteLinks : deleteLinksArr
          };
          return data;
        },
        callBack(){
          var data = this.getData();
          if(data.insertTasks.length == 0 && data.updateTasks.length== 0 && data.deleteTasks.length== 0 && data.insertLinks.length== 0 && data.deleteLinks.length== 0){
            return true;
          }else{
            return false;
          }
        },
        saveData(){
            var data = this.getData();
            if(data.insertTasks.length == 0 && data.updateTasks.length== 0 && data.deleteTasks.length== 0 && data.insertLinks.length== 0 && data.deleteLinks.length== 0){
              this.util.warn('没有任何修改！');
              return;
            }
            this.util.mask('正在保存...');
            var _this = this;
            this.util.restPost('/api_v1/business/progress/save',data,(res)=>{
                if(res.status==200){
                    this.util.success('保存成功！');
                    // this.updateParentTask(this.taskInfo.id);
                    this.$parent.loadData();
                    this.$parent.back(true);
                    // this.loadData(this.scheduleUid);
                    if(res.data != undefined){
                      var insertTasks = res.data.insertTasks;
                      if(insertTasks != undefined){
                        insertTasks.forEach(function (task,index) {
                        var old = gantt.getTask(task.code);
                        for(var key in task){
                            old[key] = task[key];
                        }
                        old.start_date = new Date(task.startDate);
                        old.end_date = new Date(task.endDate);
                        old.uid = task.id;
                        old.id = task.code;
                        gantt.updateTask(task.code);
                      });
                      }
                      if(insertLinks != undefined){
                        var insertLinks = res.data.insertLinks;
                        insertLinks.forEach(function (item,index) {
                          var old = gantt.getLink(item.code);
                          for(var key in item){
                              old[key] = item[key];
                          }
                          old.uid = item.id;
                          old.id = item.code;
                          gantt.updateLink(task.code);
                        });
                      }
                    }
                    _this.insertTasks = [];
                    _this.updateTasks = [];
                    _this.deleteTasks = [];
                    _this.insertLinks = [];
                    _this.deleteLinks = [];
                }else{
                    _this.util.error(res.errorMsg)
                }
                _this.util.unmask();
            });
        },
        updateParentTask(taskCode){
          this.util.mask('正在更新...');
          console.log("更新父节点数据======="+taskCode);
          this.util.restPut('/api_v1/business/progress/parentTask/'+taskCode,{scheduleUid:this.scheduleUid},(res)=>{
              console.log("更新结果====",res);
              this.util.unmask();
              if(res.status==200){
                  this.util.success('更新父节点完毕');
              }else{
                this.util.error(res.errorMsg)
              }
          });
        },
        calculateEndDate(startDate,duration){
          var globalSettings = gantt.getCalendar("global");

        }

  }
}
</script>

<style>
    @import "../../public/css/dhtmlxgantt.css";
    .red .gantt_cell, .odd.red .gantt_cell,
		.red .gantt_task_cell, .odd.red .gantt_task_cell {
			background-color: #FDE0E0;
		}

		.green .gantt_cell, .odd.green .gantt_cell,
		.green .gantt_task_cell, .odd.green .gantt_task_cell {
			background-color: #BEE4BE;
		}

    .gantt_task_link.start_to_start .gantt_line_wrapper div {
			background-color: #dd5640;
		}

		.gantt_task_link.start_to_start:hover .gantt_line_wrapper div {
			box-shadow: 0 0 5px 0px #dd5640;
		}

		.gantt_task_link.start_to_start .gantt_link_arrow_right {
			border-left-color: #dd5640;
		}

		.gantt_task_link.finish_to_start .gantt_line_wrapper div {
			background-color: #7576ba;
		}

		.gantt_task_link.finish_to_start:hover .gantt_line_wrapper div {
			box-shadow: 0 0 5px 0px #7576ba;
		}

		.gantt_task_link.finish_to_start .gantt_link_arrow_right {
			border-left-color: #7576ba;
		}

		.gantt_task_link.finish_to_finish .gantt_line_wrapper div {
			background-color: #55d822;
		}

		.gantt_task_link.finish_to_finish:hover .gantt_line_wrapper div {
			box-shadow: 0 0 5px 0px #55d822;
		}

		.gantt_task_link.finish_to_finish .gantt_link_arrow_left {
			border-right-color: #55d822;
		}
    /**高亮节假日**/
    .weekend {
			background: #f4f7f4;
		}

		.gantt_selected .weekend {
			background: #f7eb91;
		}

#gantt-task .el-dialog.el-dialog__body{
  background: #f7eb91;
}
#gantt-task .bg .el-input__inner{
  color:black;
}

#gantt-task input{
  color:black;
}
#gantt-task .el-input{
  border: 1px solid #dddddd;
}
#gantt-task .el-form-item {
    margin-bottom: 22px;
    height: 28px;
}
#gantt-task .el-input--prefix.el-input--mini .el-input__inner {
    padding-left: 30px;
    height: 24px;
    line-height: 24px;
    border: 0 none;
    background-color: transparent;
}

</style>
