<template>
  <div style="height:100%;overflow: hidden;" id="gantt-manager">

    <remote-script src="static/js/dhtmlxgantt/dhtmlxgantt.js"  @load="initGantt" ></remote-script>
    <remote-script v-if="isLoaded" src="static/js/dhtmlxgantt/api.js"   ></remote-script>
    <!--<script src="https://export.dhtmlx.com/gantt/api.js?v=7.0.4"></script>-->
    <div ref="gantt" style="height:100%;width:100%;"></div>
        <el-dialog id="gantt-task" title="任务详情" style="z-index: 998!important;;" :visible.sync="taskDialogVisible"  width="1000px" @close="cancleTask();">
      <div>
        <el-form ref="taskInfo" :model="taskInfo" label-width="80px" size="mini">
          <el-form-item label="主键" style="display:none;">
            <el-input v-model="taskInfo.uid"></el-input>
          </el-form-item>

          <!-- <el-form-item label="任务编码" prop="id" :rules="[{ required: true, message: '请输入任务编码', trigger: 'blur' }]" style="width:100%;">
                    <el-input v-model="taskInfo.id"  ></el-input>
                  </el-form-item>
           -->
          <div style="display:flex;width:100%;">
              <div style="display:flex;width:33%;">
                <el-form-item label="任务名称" prop="text" :rules="[{ required: true, message: '请输入任务名称', trigger: 'blur' }]"  style="width:100%;">
                  <el-input v-model="taskInfo.text" style="width: 100%;"></el-input>
                </el-form-item>
              </div>
              <div style="display:flex;width:33%;">
                  <el-form-item label="负责人" style="width: 100%;" prop="assignee">
                      <el-select v-model="assignee" filterable placeholder="请选择" @change="changePrincipal">
                        <el-option
                          v-for="(item, key) in options"
                          :key="key"
                          :label="item.userName"
                          :value="item.id">
                          <span style="float: left">{{ item.userName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.position }}</span>
                        </el-option>
                      </el-select>
                  </el-form-item>
              </div>
              <div style="display:flex;width:33%;">
                <el-form-item label="审批人" style="width: 100%;" >
                  <el-select v-model="approver" filterable placeholder="请选择" @change="changeApproval">
                      <el-option
                        v-for="(item, key) in options"
                        :key="key"
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
              <div style="display:flex;width:33%;">
                  <el-form-item label="计划开工" style="width: 100%;" prop="startDate" :rules="[{ required: true, message: '请输入计划开始日期', trigger: 'blur' }]">
                    <el-date-picker type="date" @change="dateChange('startDate');" placeholder="开始日期" v-model="taskInfo.startDate"
                     style="width: 100%;"></el-date-picker>
                  </el-form-item>
              </div>
              <div style="display:flex;width:33%;">
                  <el-form-item label="计划工期" style="width: 100%;"  prop="duration" :rules="[{ required: true, message: '请输入计划工期', trigger: 'blur' }]">
                    <el-input class="work-date" v-model="taskInfo.duration" placeholder="工期" :disabled="true" style="width:210px;" type="number" min="1"></el-input>
                  </el-form-item>
              </div>
              <div style="display:flex;width:33%;">
                  <el-form-item label="计划完工" style="width: 100%;" prop="endDate" :rules="[{ required: true, message: '请输入计划完成日期', trigger: 'blur' }]">
                 <el-date-picker type="date" placeholder="完成日期"  @change="dateChange('startDate');" v-model="taskInfo.endDate"
                 style="width:210px;float:left;"></el-date-picker>
                </el-form-item>
              </div>
          </div>
          <div style="display:flex;width:100%;">
              <div style="display:flex;width:33%;">
                  <el-form-item label="实际开工" style="width: 100%;" :rules="[{ message: '请选择开始日期', trigger: 'blur' }]">
                    <el-date-picker type="date" placeholder="开始日期" @change="dateChange('actStartDate');"
                    value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="taskInfo.actStartDate" style="width: 100%;"></el-date-picker>
                  </el-form-item>
              </div>
              <div style="display:flex;width:33%;">
                  <el-form-item label="实际工期" style="width: 100%;" :rules="[{  message: '请选择实际工期', trigger: 'blur' }]">
                    <el-input class="work-date" v-model="taskInfo.actDuration" placeholder="工期"  :disabled="true" style="width:210px;" type="number" min="0"></el-input>
                  </el-form-item>
              </div>
              <div style="display:flex;width:33%;">
                  <el-form-item label="实际完工" style="width: 100%;" :rules="[{  message: '请选择完成日期', trigger: 'blur' }]">
                 <el-date-picker type="date" placeholder="完成日期" @change="dateChange('actStartDate');"
                 value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="taskInfo.actEndDate" style="width:210px;float:left;"></el-date-picker>
                </el-form-item>
              </div>
          </div>
          <div style="display:flex;width:100%;">
              <div style="display:flex;width:33%;">
                  <el-form-item label="里程碑" style="width: 100%;">
                  	<el-switch style="margin-left:18px" v-model="taskInfo.critical"  active-color="#13ce66"  inactive-color="#ff4949"></el-switch>
                </el-form-item>
              </div>
              <div style="display:flex;width:33%;">
                <el-form-item label="节点层级" style="width: 100%;">
                  <el-select v-model="taskInfo.taskType" placeholder="请选择">
                    <el-option
                      v-for="item in specialtyList" :key="item.id"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div style="display:flex;width:33%;">
                <el-form-item label="排序" style="width: 100%;">
                  <el-input v-model="taskInfo.sort" style="width:210px;"></el-input>
                </el-form-item>
              </div>
          </div>
          <div style="display:flex;width:100%;">
          <div style="display:flex;width:33%;">
            <el-form-item label="开工提前" style="width: 100%;" prop="assignee">
              <el-input v-model="taskInfo.beforeStart" type="number" style="width: 70%;"></el-input>
              <span>天提醒</span>
            </el-form-item>
          </div>
          <div style="display:flex;width:33%;">
            <el-form-item label="完工提前" style="width: 100%;" >
              <el-input v-model="taskInfo.afterDelay" type="number" style="width: 70%;"></el-input>
              <span>天提醒</span>
            </el-form-item>
          </div>
          <div style="display:flex;width:33%;">
            <el-form-item label="进度" style="width: 100%;">
              <el-input v-model="taskInfo.progress" style="width:80%;float:left;" type="number"></el-input><span style="float:left;">%</span>
            </el-form-item>
          </div>
        </div>
          <div style="display:flex;width:100%;">
            <div style="display:flex;width:96%;">
              <el-form-item label="通知人" style="width: 100%;" prop="assignee">
                <input type="text" v-model="taskInfo.noticeUserUid"   class="el-input__inner" style="display: none;">
                <el-input
                  :value="taskInfo.noticeUserName"
                  placeholder="请选择通知人"
                  :readonly="true"
                  suffix-icon="el-icon-more"
                  @click.native="selectMember(taskInfo)"
                  style="cursor: pointer;"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="上级任务"  style="display:none;">
            <el-input v-model="taskInfo.parent"></el-input>
          </el-form-item>
          <div id="jr-gannt-table" class="jr-container" style="overflow-x: hidden">
            <el-table
            class="jr-edit-table-panel"
            ref="jr-table"
            :highlight-current-row="true"
            size="mini"
            stripe
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            height="100%"
            :fit="true"
            :data="taskInfo.links"
            style="width: 100%; margin-top: 0px;border-top: 1px solid #ebeef5;display: flex;height: 100%;flex-flow: column;">
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button-group>
                    <i type="danger" class="el-icon-delete"  size="mini" style="margin-left:5px;font-size: 13pt;cursor: pointer;color: red;"
                        @click="handleDelete(scope.$index, scope.row)">
                    </i>
                  </el-button-group>
                </template>
              </el-table-column>
              <el-table-column
                prop="type"
                label="前置关系"
                align="center">
                <template slot-scope="scope">
                  <span>{{getType(scope.row.type)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="sourceName"
                label="关联节点任务"
                align="center">
              </el-table-column>
            </el-table>
          </div>
          <div style="display:flex;width:100%;margin-top: 20px;">
              <div style="display:flex;width:50%;">
                  <el-form-item label="附件" style="width: 100%;">
                  	 <upload
                        name="FILE_"
                        :config="uploadConfig"
                        ref="uploading_"
                        @on-success="file=>handlerFileUploadSuccess(file)"
                        @on-loaded="fileList=>handlerFileLoaded(fileList)"
                      ></upload>
                </el-form-item>
              </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="taskDialogVisible = false; assignee='';approver='';">取消</el-button>
        <el-button type="primary" @click="saveTask();">保存</el-button>
      </span>
    </el-dialog>

    <!-- 选用户 -->
    <selectMember v-if="selectMemberModels.isShow" :selectMemberModels="selectMemberModels"></selectMember>

  </div>

</template>

<script>
import Upload from "@/common/upload/upload.vue";
import selectMember from "@/common/select-user/select-user.vue";
// import {gantt} from 'dhtmlx-gantt'
// import {gantt} from '@/public/js/dhtmlxgantt/dhtmlxgantt.js'
export default {
  name: 'gantt',
  props: {
    scheduleNode:{},
    tasks: {},
    scheduleUid:'',
    projUid:''
  },
  components: {
    Upload,selectMember
  },
  data () {
    return {
      uploadConfig: {
        limit: 10,
        limitSize: 50048576,
        // listType: 'picture-card',
        readOnly: false,
        xtype: 'FILE_',
        id: '',
        accept: '.jpg,.jpeg,.png,.gif,.grf,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.xml'
      },
      selectMemberModels: {// 人员控件
        form: {},
        isShow: false,
        selectList: [],
        callBack: this.selectMemberCallBack,
        radioSelectFlags: false
      },
      dragTaskOldParent:null, // 记录每次拖拽之前task的parent
      taskData:{}, // 进度节点关系
      assignee:'',
      approver:'',
      options:[],
      specialtyList:[],
      isLoaded:false,
      isNew:false,
      taskDialogVisible:false,
      selectTask:null,
      currentTask:null,
      insertTasks:{},
      updateTasks:{},
      deleteTasks:{},
      insertLinks:{},
      deleteLinks:{},
      taskInfo:{
        uid:'',
        id:null,
        type:1,
        text:'',
        startDate: null,
        endDate: null,
        actStartDate: null,
        actEndDate: null,
        actDuration: null,
        beforeStart: null,
        afterDelay: null,
        duration:'',
        progress:'',
        assignee:'',
        assigneeName:'',
        approver:'',
        approverName:'',
        noticeUserUid: '',
        noticeUserName: '',
        status:'',
        sort:0,
        parent:'',
        critical:'',
        taskType: null
      }
    }
  },
  created(){
    //
    // return
    // this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'))
    this.getOptions()

		// if(this.sessionUtil.isAllowBtn('gc5_1:add')){
		//   gantt.config.columns.push({"name":"add","width":44,"min_width":44,"max_width":44})
		// }
		//forces the Gantt chart to automatically change its size to show all tasks without scrolling
		//gantt.config.autosize = true;
	},
  mounted: function () {
    /*gantt.config.columns = [
      {name: "text", tree: true, width: "*", min_width: 120, resize: true},
      {name: "start_date", align: "center", resize: true},
      {name: "duration", align: "center", width: 70, resize: true},
      {name: "add", width: 44}
    ];

    // keeps or not the width of the grid area when column is resized
    gantt.config.keep_grid_width = false;
    gantt.config.grid_resize = true;

    var message = null;
    gantt.attachEvent("onColumnResize", function (index, column, new_width) {
      if (!message) {
        message = gantt.message({
          expire: -1,
          text: "<b>" + gantt.locale.labels["column_" + column.name] + "</b> is now <b id='width_placeholder'></b><b>px</b> width"
        });
      }
      document.getElementById("width_placeholder").innerText = new_width
    });

    // return false to discard the resize
    gantt.attachEvent("onColumnResizeEnd", function (index, column, new_width) {
      gantt.message.hide(message);
      message = null;
      gantt.message("Column <b>" + gantt.locale.labels["column_" + column.name] + "</b> is now " + new_width + "px width");
      return true;
    });

    // GRID resize events

    // return false to discard the resize
    gantt.attachEvent("onGridResizeStart", function (old_width) {
      gantt.message("Start grid resizing");
      return true;
    });

    gantt.attachEvent("onGridResize", function (old_width, new_width) {
      if (!message) {
        message = gantt.message({
          expire: -1,
          text: "Grid is now <b id='width_placeholder'></b><b>px</b> width"
        });
      }
      document.getElementById("width_placeholder").innerText = new_width;
    });

    // return false to discard the resize
    gantt.attachEvent("onGridResizeEnd", function (old_width, new_width) {
      gantt.message.hide(message);
      message = null;
      gantt.message("Grid is now <b>" + new_width + "</b>px width");
      return true;
    });

    gantt.init(this.$refs.gantt);

    gantt.parse({
      data: [
        { id: 1, text: "Project #2", start_date: "01-04-2018", duration: 18, progress: 0.4, open: true },
        { id: 2, text: "Task #1", start_date: "02-04-2018", duration: 8, progress: 0.6, parent: 1 },
        { id: 3, text: "Task #2", start_date: "11-04-2018", duration: 8, progress: 0.6, parent: 1 }
      ],
      links: [
        {id: 1, source: 1, target: 2, type: "1"},
        {id: 2, source: 2, target: 3, type: "0"}
      ]
    });
    return*/

  },
  watch: {
		'scheduleUid': function (val, oldVal) {
			this.loadData(this.scheduleUid)
      this.getOptions()
    },
    taskInfo: {
      deep: true,
      immediate: true,
      handler(taskInfo) {
        this.$set(this.uploadConfig, 'id', taskInfo.uid)
      }
    }
	},
  methods:{
    exportGantt(type){
      type = Number(type)
      if(type === 1){
        let name = (this.sessionUtil.getProjName() || 'gantt') + '.png'
        gantt.exportToPNG({
          name:name,
          raw:false,
          header:"<style>.task-after-current .gantt_task_progress {background: #547dab!important;}  .task-after-current {background-color: #3db9d3!important;border: 1px solid #2898b0!important;}</style>"
        })
      } else if(type === 2){
        let tasks = {
          'Finish':function(task){
            return new Date(task.endDate).toISOString() // '2018-07-01T08:00:00' //task.endDate
          }
          /*,'LateStart':function(task){
            // return '2018-07-01T08:00:00'
            if(task.actStartDate){
              return new Date(task.actStartDate).toISOString()
            }
            return null
          }*/
        }
        let name = (this.sessionUtil.getProjName() || 'gantt') + '.xml'
        gantt.exportToMSProject({skip_circular_links: false,auto_scheduling:false,name:name,tasks:tasks})
      }else if(type === 3){
        let tasks = {
          'Finish':function(task){
            return new Date(task.endDate).toISOString() // '2018-07-01T08:00:00' //task.endDate
          }
          /*,'LateStart':function(task){
            // return '2018-07-01T08:00:00'
            if(task.actStartDate){
              return new Date(task.actStartDate).toISOString()
            }
            return null
          }*/
        }
        let name = (this.sessionUtil.getProjName() || 'gantt') + '.xlsx'
        gantt.exportToExcel({name:name})
      }

    },
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
        // console.log(task.text+'-----task_class-------'+(end.getTime()>=new Date().getTime()),task.priority,start,end,task,task.end_date)
        // return 'task-after-current'
        if(_this.validUtil.isNotNull(task.endDate)){
          let endDate = new Date(task.endDate)
          let actEndDate = new Date()
          if(_this.validUtil.isNotNull(task.actEndDate)){
            actEndDate = new Date(task.actEndDate)
          }
          console.log(endDate.format('yyyy-MM-dd'),endDate.getTime(),'----------'+(endDate.getTime()< actEndDate.getTime())+'--------',actEndDate.format('yyyy-MM-dd'),actEndDate.getTime())
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
      var date_to_str = gantt.date.date_to_str(gantt.config.task_date);
      var today = new Date();
      // gantt.addMarker({
      // 	start_date: today,
      // 	css: "today",
      // 	text: "今天",
      // 	title: "今天: " + date_to_str(today)
      // });
      var _this = this;
      gantt.attachEvent("onBeforeLightbox", function (id) {
        //gantt.deleteTask(id);
        console.log('--------onBeforeLightbox----------'+id,_this.taskInfo)
        //_this.$refs['taskInfo'].resetFields();
        var task = gantt.getTask(id);
        for(var key in _this.taskInfo){
          if(task[key] != undefined){
            _this.taskInfo[key] = task[key];
          }else{
            _this.taskInfo[key] = '';
          }
        }
        let links = gantt.getLinks()
        // 关联关系
        if (links && links.length>0){
          links = links.filter(link => {
            return link.target == _this.taskInfo.id
          }).map(item =>{
            var task = gantt.getTask(item.source);
            if (task && task.text) item.sourceName = task.text
            return item
          })
        }
        // console.log('---------',_this.taskInfo,task)
        _this.taskInfo.sort = task.sort
        _this.taskInfo.links = links
        _this.taskInfo.progress = parseInt(task.progress*100);
        _this.taskInfo.startDate = _this.formater('yyyy-MM-dd',task.start_date)
        _this.taskInfo.endDate = _this.formater('yyyy-MM-dd',task.end_date)
        _this.taskInfo.critical = task.critical == 1 || task.critical == true
        // console.log('--------start----1----', _this.taskInfo.endDate)
        //判断是否新增
        if(!_this.validUtil.isNotEmpty(_this.taskInfo.uid) && _this.insertTasks[_this.taskInfo.id] == undefined){
          var children = gantt.getChildren(task.parent);
          task.progress = 0;
          task.sort = children.length;
        }
        _this.assignee= _this.taskInfo.assignee
        _this.approver= _this.taskInfo.approver
        task.startDate = task.start_date;
        task.endDate = task.end_date;
        // console.log('--------start--------')
        if(_this.validUtil.isNotEmpty(task.endDate) && _this.validUtil.isNotEmpty(task.startDate)){
          let data1=new Date(task.startDate)
          let data2=new Date(task.endDate)
          let iDays= Date.parse(data2)-Date.parse(data1)
          let Daynum=Math.floor(iDays / (24 * 3600 * 1000))
          let params = {
            startDate: _this.formater('yyyy-MM-dd', task.startDate),
            endDate:_this.formater('yyyy-MM-dd', task.endDate)
          }
          _this.util.restPost('/api_v1/gantt/getDays',params,(res)=>{
            // console.log('---getWorkDay---', res)
            if(res && res.data){
              _this.taskInfo.duration = res.data.DURATION_
            }
          })
        }
        _this.$forceUpdate()
        if(_this.sessionUtil.isAllowBtn('gc5_1:btn_edit') || _this.sessionUtil.isAllowAdd('t_gt_project_bz') || _this.sessionUtil.isAllowEdit('t_gt_project_bz')){
          if(_this.scheduleNode.onlyRead == 'false') {
            _this.taskDialogVisible = true;
          }
        }
        //task.my_template = "<span id='title1'>Holders: </span>" + task.users + "<span id='title2'>Progress: </span>" + task.progress * 100 + " %";
        return false;
      });
      gantt.attachEvent("onTaskCreated", function (task) {
        //gantt.deleteTask(task.id);
        //_this.currentTask = task;
        // task.planStartDate = task.start_date;
        // task.planDuration = task.duration;
        // _this.taskDialogVisible = true;
        // _this.taskInfo = task;
        // _this.taskDialogVisible = true;
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
      gantt.ext.zoom.init(zoomConfig);
      gantt.ext.zoom.setLevel('quarter')


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
    /**
     * 递归展开
     * @deprecated
     * */
    deepOpenClose(id,type){
      if(type === 1 || type === '1'){
        // 展开
        gantt.open(id);
      }else if(type === 2|| type === '2'){
        // 收缩

        gantt.close(id);
      }
      let children = gantt.getChildren(id)
      if(children){
        children.forEach(child=>{
          this.deepOpenClose(child,type)
        })
      }
    },
    openClose(type){ // 展开收缩
      console.log('-------openClose------',type)
      this.util.mask('正在'+((type === 1 || type === '1')?'展开':'收缩'))
      // this.deepOpenClose('0',type)
      gantt.eachTask(function(task){
        task.$open = (type === 1 || type === '1')?true:false;
      });
      gantt.render();
      this.util.unmask()
      /*if(type === 1 || type === '1'){
        // 展开

        //
      }else if(type === 2|| type === '2'){
        // 收缩

        // gantt.close("1");
      }*/
    },
    handlerFileUploadSuccess (file) { // 文件上传成功回调
      this.taskInfo.FILE_ = file.data.id
    },
    handlerFileLoaded (column, fileList) { // 文件加载完成
      // console.log('----------',column,fileList)/
      if (fileList && fileList.length > 0) {
        this.taskInfo.FILE_ = fileList[fileList.length - 1].id
      }
    },
    getLevel (){
      return gantt.ext.zoom.getCurrentLevel();
    },
    zoom (level){
      // console.log('-------zoom------'+level)
      let levelArr = ['day','week','month','quarter','year']
      gantt.ext.zoom.setLevel(levelArr[level])
    },
    getType(type){
      let data = {
        '0': "完工到开工",
        '1': "开工到开工",
        '2': "完工到完工",
        '3': "开工到完工",
      }
      return data[type]
    },
    handleDelete (index, link) {
      let _this = this
      _this.util.confirm('您确认删除吗?','提示',function(){
        _this.taskInfo.links.splice(index, 1)
        gantt.deleteLink(link.id)
      })
    },
    ondo(){
      gantt.undo()
    },
    redo(){
      // console.log('======================redo')
      gantt.redo()
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
    changePrincipal(){
      for (let i = 0; i < this.options.length; i++) {
        if(this.options[i].id==this.assignee){
          this.taskInfo.assignee=this.options[i].id
          this.taskInfo.assigneeName=this.options[i].userName
        }
      }
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
          // projUid:this.$store.state.selectProjectObj.id,
          projUid: this.projUid,
      }
      // 获取节点类型数据字典参数
      this.util.restGet('/api_v1/dic/SYS_PROJECT_TASKTYPE_/items',null, (res)=> {//项目类型
        if(res.status==200 && res.data){
          // 解决数据下拉无法显示问题
          res.data.forEach(item => {
            item.value = parseInt(item.value)
          });
          this.specialtyList=res.data;
        }else{
          this.specialtyList = [];
        }
  		})
      this.util.restGet('/api_v1/business/project/getMembersByProjUid',param,(res)=>{
          if(res.status==200){
              if(res.data){
                res.data.projUid=res.data.id
                res.data.id=res.data.userId
                var arr=[]
                arr.push({
                  id: res.data.userId,
                  userName: res.data.userName,
                  position: res.data.position
                })
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
    getUserOptions(){
      return this.options
    },
    selectMember(taskInfo){
      // console.log("===selectMember===",taskInfo)
      this.selectMemberModels.isShow = true

      let noticeUserUid = this.taskInfo['noticeUserUid']
      let noticeUserName = this.taskInfo['noticeUserName']
      let userList = []
      if(noticeUserUid && noticeUserName){
        let nameArray = noticeUserName.split(',')
        noticeUserUid.split(',').forEach((id,index)=>{
          userList.push({
            id:id,
            ID_:id,
            userName: nameArray[index]||''
          })
        })
      }
      this.selectMemberModels.selectList = userList
      this.selectMemberModels.radioSelectFlags =false
    },
    // 选人回调函数
    selectMemberCallBack () {
      this.selectMemberModels.isShow = false
      var labels = ''
      var ids = ''
      this.selectMemberModels.selectList.forEach(element => {
        labels += element.userName + ','
        ids += element.id + ','
      })
      labels = labels.substring(0, labels.length - 1)
      ids = ids.substring(0, ids.length - 1)

      this.$set(this.taskInfo, 'noticeUserUid', ids)
      this.$set(this.taskInfo, 'noticeUserName', labels)
    },
    changeALL(data, key){
      let _this = this
      this.taskData.data = this.taskData.data.map(item=>{
        item[key] = data.id
        item[key+ 'Name'] = data.userName
        item.critical = item.critical ? 1 : 0
        //判断是否后台已经有数据
				if(_this.validUtil.isNotEmpty(item.uid)){
          //加入修改队列
					_this.updateTasks[item.id] = item;
				}else{
					_this.insertTasks[item.id] = item;
				}


        // console.log(key+'-----changeAll----',item)
        let taskId = item.id
        //说明是修改
        var old = gantt.getTask(taskId);
        // console.log('----------',old)
        if(old) {
          for (var k in item) {
            old[k] = item[k]

          }
          gantt.updateTask(taskId)
        }
        return item
      })
    },
    changeAssignee(data){
      this.changeALL(data,'assignee')
    },
    changeApprover(data){
      this.changeALL(data,'approver')
    },
    loadData(scheduleUid){
      var _this = this;
      gantt.clearAll();
      _this.util.mask('正在加载...');
      this.util.restGet('/api_v1/business/progress/{id}/data',{id:scheduleUid},(res)=>{
          if(res.status==200){
              if(res.data == undefined){
                _this.util.unmask();
                return;
              }
              var tasks = res.data.tasks;
              tasks.forEach(function (task,index) {
                task.uid = task.id;
                task.id = task.code;
                task.progress = task.progress;
                task.critical = (task.critical == '是') ? true : false;

                // task.progress = task.progress/100;
                task.duration = _this.validUtil.isNotEmpty(task.duration)?Number(task.duration):1;
                task.start_date = new Date(task.startDate);
                task.end_date = new Date(task.endDate);
                if(_this.validUtil.isNotEmpty(task.actStartDate)){
                  task.actStartDate = new Date(task.actStartDate).format('yyyy-MM-dd');
                }
                if(_this.validUtil.isNotEmpty(task.actEndDate)){
                  task.actEndDate = new Date(task.actEndDate).format('yyyy-MM-dd');
                }
                /*if (task.progress >= 1){ // 已完成 绿色
                  task.color = "green"
                } else if (task.progress < 1 && (new Date() > task.end_date) ){ // 未逾期未完成，黄色
                  task.color = "blue"
                } else { // 逾期未完成，红色
                   task.color= "red"
                }*/
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
              var data = {
                data:tasks,
                links:links
              };
              this.taskData = data;
              try{
                gantt.parse(data);
              }catch(e){
                console.log(e)
              }
          }else{
              _this.util.error(res.errorMsg)
          }
          _this.util.unmask();
       });
      //gantt.parse(this.$props.tasks);
    },
    getGantt(){
      return gantt;
    },
    cancleTask(){
      // console.log("==========cancleTask========="+this.taskInfo.id);
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
            let params = {
                startDate: this.formater('yyyy-MM-dd', this.taskInfo.startDate),
                endDate:this.formater('yyyy-MM-dd', this.taskInfo.endDate)
            }
            this.util.restPost('/api_v1/gantt/getDays',params,(res)=>{
              console.log('---getWorkDay---', res)
              if(res && res.data){
                this.taskInfo.duration = res.data.DURATION_
              }
            })
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
            let params = {
                startDate: this.formater('yyyy-MM-dd', this.taskInfo.actStartDate),
                endDate:this.formater('yyyy-MM-dd', this.taskInfo.actEndDate)
            }
            this.util.restPost('/api_v1/gantt/getDays',params,(res)=>{
              console.log('---getWorkDay---', res)
              if(res && res.data){
                this.taskInfo.actDuration = res.data.DURATION_
              }
            })
          // var actEndDate = calendar.calculateEndDate({start_date:this.taskInfo.actStartDate, duration:this.taskInfo.actDuration});
          // this.taskInfo.actEndDate = actEndDate.format('yyyy-MM-dd');
        }
      }
    },
    timestampToTime(timestamp) {
      var date = new Date(Number(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
      var result = Y+'-'+M+'-'+D;
      return result;
    },
    addTask(type){
        var parentId = 0
        if (type == 1){
          parentId = (this.selectTask&&this.selectTask.$rendered_parent) ? this.selectTask.$rendered_parent : 0
        } else {
          parentId=(this.selectTask&&this.selectTask.id)?this.selectTask.id:0
        }
        let parentTask = gantt.getTask(parentId)
        // console.log(parentId+'--------parentTask--------',parentTask)
        var children = gantt.getChildren(parentId)
      let startDate = new Date()
      if(parentTask){
        startDate = new Date(parentTask.start_date)
      }else{
        startDate = new Date(Number(this.scheduleNode.startDate))
      }
        var str = this.formater('yyyy-MM-dd',this.scheduleNode.startDate)
      // var str2 = new Date(Number(this.scheduleNode.startDate)).format('yyyy-MM-dd')
      // console.log(str+'------addTask------'+str2,this.scheduleNode)
        var obj= {
            text:"新建任务",
           start_date:startDate.format('dd-MM-yyyy'), //"02-09-2020",
          end_date:startDate.format('dd-MM-yyyy'), //"02-09-2020",
          startDate: startDate.format('yyyy-MM-dd'),
            sort: children.length+1,
            duration:1
        }
        this.taskDialogVisible = true;
        gantt.createTask(obj, parentId, children.length)
      },
    saveTask(){
      // if(!this.taskInfo.assignee) {
      //   this.util.error('请选择负责人')
      //   return false;
      // }
//        if(!this.taskInfo.actStartDate) {
//          this.util.error('请选择实际开始日期')
//          return false;
//        }
//        if(!this.taskInfo.actEndDate) {
//          this.util.error('请选择实际完成日期')
//          return false;
//        }

      this.assignee='';
      this.approver='';
        this.$refs['taskInfo'].validate((valid) => {
          if (valid) {
              this.taskDialogVisible = false;
              var task = this.util.jsonClone(this.taskInfo);

              console.log(this.taskInfo,'-------------',task)

              var taskId = task.id;
              //task.end_date = gantt.calculateEndDate(task);
              task.progress = task.progress/100;
              // 新增附件列表数组
              var filesList = []
              // 删除附件id逗号隔开字符串
              var deleteFilesList = []
              // 附件上传
              let uploading = this.$refs['uploading_']
              // console.info(uploading === undefined || uploading.length === 0?'--空--':'--有值---')
              if (uploading) {
                if (uploading.length > 0) {
                  uploading = uploading[0]
                }
                // console.info(uploading.filesList)
                let fileList = uploading.getFilesList()
                // console.info('-----fileList-----'+fileList)
                if (fileList) {
                  filesList = filesList.concat(fileList)
                }
                if (uploading.deleteFilesList) {
                  deleteFilesList = deleteFilesList.concat(uploading.deleteFilesList)
                }
              }
              task.filesList = filesList
              task.deleteFilesList = deleteFilesList
              task.critical = task.critical ? 1 : 0
              // task.progress = task.progress/100;
              //判断是否新增
              //if(this.validUtil.isNotEmpty(task.uid)){
              // 解决修改保存数据为新增bug
              if(this.validUtil.isNotEmpty(task.uid)){
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
                  gantt.addTask(task,task.parent);
              }
              gantt.setSizes()
          } else {

            return false;
          }
        });
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
    updateTaskSort(task,parentId){ // 拖拽之后修改排序
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
    deleteTask(){
      if(this.selectTask == null){
        this.util.warn('请先选择任务！');
        return;
      }
      var task = gantt.getTask(this.selectTask.id);
      var children = gantt.getChildren(task.id);
      if(!this.selectTask.leaf && this.selectTask.uid && children && children.length > 0){
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
        _this.selectTask = null
      })
    },
    getData(){
      var insertTasksArr = [];
      for(var key in this.insertTasks){
        const item = this.insertTasks[key]
        item.startDate = item.start_date.format('yyyy-MM-dd');
        item.endDate = item.end_date.format('yyyy-MM-dd');
        item.actStartDate = item.actStartDate ? item.actStartDate : null
        item.actEndDate = item.actEndDate ? item.actEndDate : null
        var task = this.util.jsonClone(item);
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
        // task.progress = parseInt(task.progress*100);
        // task.progress = task.progress*100;
        task.scheduleUid = this.scheduleUid;
        task.projUid = this.projUid;
        insertTasksArr.push(task);
      }
      var updateTasksArr = [];
      for(var key in this.updateTasks){
        const item = this.updateTasks[key]
        item.startDate = item.start_date.format('yyyy-MM-dd');
        item.endDate = item.end_date.format('yyyy-MM-dd');
        item.actStartDate = item.actStartDate ? item.actStartDate : null
        item.actEndDate = item.actEndDate ? item.actEndDate : null
        item.critical = (item.critical || item.critical == 1)  ? 1 : 0
        var task = this.util.jsonClone(item);
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
        // task.progress = parseInt(task.progress*100);
        task.code = task.id;
        task.id = task.uid;
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
      console.log(data)
      return data;
    },saveData(){
        var data = this.getData();
        if(data.insertTasks.length == 0 && data.updateTasks.length== 0 && data.deleteTasks.length== 0 && data.insertLinks.length== 0 && data.deleteLinks.length== 0){
          this.util.warn('没有任何修改！');
          return;
        }
        this.util.mask('正在保存...');
        var _this = this;
        this.util.restPost('/api_v1/business/progress/save',data,(res)=>{
            if(res.status==200){
                this.util.success('保存成功');
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
                // this.$router.push({
                //   path: '/form/query/t_gt_project_bz'
                // })
            }else{
                _this.util.error(res.errorMsg)
            }
            _this.util.unmask();
        });
    },calculateEndDate(startDate,duration){
      var globalSettings = gantt.getCalendar("global");
    }
  }
}
</script>

<style scoped>

</style>

<style>
    @import "../../../public/css/dhtmlxgantt.css";
    /*@import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";*/
    .dhtmlx-error{
      display: none!important;
    }
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
#gantt-task .el-input__inner{
  color:black;
  border: none;
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
.work-date .el-input__inner {
  padding: 0!important;
  text-align: center;
}
.v-modal {
	z-index: 88!important;
}
#jr-gannt-table .el-table .cell{
  display: block;
}
/* 修复子表数据位置设置无法生效 */
#jr-gannt-table .el-table .cell.el-tooltip{
  display: inline-block;
}
    /*.task-after-current{
      background: #2ea2f4;
    }*/
    .task-normal .gantt_task_progress {
      background: #547dab!important;
    }
    .task-normal {
      background-color: #3db9d3!important;
      border: 1px solid #2898b0!important;
    }

    .task-over-date .gantt_task_progress {
      background-color: #363636!important;
      opacity: .2;
    }
    .task-over-date {
      background-color: red!important;
      border: 1px solid #2898b0!important;
    }

    #gantt-manager .querter-box{
      z-index: 3000!important;
    }
</style>
<style>

</style>
