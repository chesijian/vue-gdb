<template>
    <div style="position:relative;padding-left:320px">
        <message :models="deleteMsg"></message>
        <el-dialog title="添加" :visible.sync="isCell" width="50%">
            <el-form :model="selectNode">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="类型 :">
                        <el-select v-model="selectNode.type" @change="changeType">
                            <el-option label="主表" value= "主表"></el-option>
                            <el-option label="子表" value= "子表"></el-option>
                            <el-option label="标题" value= "标题"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="isParent" label="主表字段 :">
                        <el-select  v-model="selectNode.parent">
                            <el-option v-for="(edit, index) in selectNode.formColumnList"  :key="index" :label="edit.filedName" :value="edit.filedName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="isChild" label="子表字段 :">
                        <el-select  v-model="selectNode.child" @change="changeChild">
                            <el-option v-for="(edit, index) in selectNode.childFormList"  :key="index" :label="edit.formName" :value="edit.formName"></el-option>
                        </el-select>
                        <el-select v-model="selectNode.childColumn" multiple>
                            <el-option v-for="(edit, index) in childColumnList"  :key="index" :label="edit.filedName" :value="edit.filedName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="isTittle" label="标题 :">
                        <el-input v-model="selectNode.tittle"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveCell()">确定</el-button>
                        <el-button @click="esc()">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-form>
            </el-form>
        </el-dialog>
        <div v-if="isAddFormShow">
            <div class="mask" @click.stop.prevent="cancel"></div>
            <div class="boxs">
                <h4 style="margin:20px 0;"><i></i>添加报表</h4>
                <div>
                   <div class="add-from">
                    <div class="add-from-left">
                        <div class="add-from-label">报表名称</div>
                        <div class="add-from-input" >
                            <input type="text" v-model="addObject.reportName">
                        </div>
                    </div>
                    <div class="add-from-right">
                        <div class="add-from-label">纸张</div>
                        <div class="add-from-input add-from-disable">
                            <input type="text"  style="background: #F4F4F4;" v-model="addObject.paper">
                        </div>
                    </div>
                   </div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">方向</div>
                            <div class="add-from-input" >
                                <input type="text" v-model="addObject.direction">
                            </div>
                        </div>
                        <div class="add-from-right">
                            <div class="add-from-label">修改人</div>
                            <div class="add-from-input add-from-disable">
                                <input type="text" disabled style="background: #F4F4F4;" v-model="addObject.updateUserName">
                            </div>
                        </div>
                   </div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">发布日期</div>
                            <div class="add-from-input add-from-disable" >
                                <input type="text"  disabled style="background: #F4F4F4;" v-model="addObject.updateTime">
                            </div>
                        </div>
                        <div class="add-from-right">
                            <div class="add-from-label">添加人</div>
                            <div class="add-from-input add-from-disable" >
                                <input type="text" disabled style="background: #F4F4F4;" v-model="addObject.myself">
                            </div>
                        </div>
                   </div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">说明</div>
                            <div class="add-from-input" >
                                <input type="text" v-model="addObject.remark">
                            </div>
                        </div>
                   </div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">是否启用</div>
                            <div style="box-sizing: border-box;padding-top: 9px;">
                                <el-switch
                                    v-model="addObject.enable":active-color="bgColor">
                                </el-switch>
                            </div>
                        </div>
                   </div>
                </div>
                <div class="footer">
                    <el-button @click="cancel" size="small">关闭</el-button>
                    <el-button type="warning" size="small" @click="success">确定</el-button>
                </div>
            </div>
        </div>
        <div class="aside">
            <el-container  style="height: 100%;overflow: hidden;">
                <el-header height='40px' style="padding: 0;" class="aside"><p>表单名称</p></el-header>
                <el-main style="margin-top: 40px;padding: 0;">
                    <div style="height: 100%;overflow-y: auto;">
                        <asideItem  v-for="(item, index) in models"  :key="index" :models="item" :level="0"></asideItem>
                    </div>
                </el-main>
            </el-container>
            
            
        </div>
        <div class="content">
            <div class="top">
                <h4 style="margin: 20px 0;"><i></i>报表名称
                    <div class="content-button">
                        <div class="input"><input type="text" @keydown.enter="loadData()" placeholder="搜索"><button @click="loadData()"></button></div>
                        <div>
                            <button><img src="@/assets/common/add.png" @click="addWorkflow" alt=""></button>
                            
                            <button><img src="@/assets/common/edit.png" @click="editWorkflow" alt=""></button>
                            <!-- <button v-if="isEdit"><img src="../../../assets/common/save2.png" @click="saveWorkflow" alt=""></button> -->
                            <button><img src="@/assets/common/delete.png" @click="deleteWorkflow" alt=""></button>
                        </div>
                    </div>
                </h4>
                <div class="manu-table manu-table1">
                     <el-table ref="multipleTable" :data="manuList"  style="width: 100%"
                        :header-row-style="{background:fontColor,overflow:'hidden',}"  border height="150" @row-click="reportSelected"
                        :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}"   highlight-current-row
                        :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center',color:'#333',fontWeight:'400'}">
                        <!-- @selection-change="handleSelectionChange"> -->
                            <!-- <el-table-column type="selection" fixed width="50" ></el-table-column> -->
                            <el-table-column  fixed label="报表名称" >
                                <template slot-scope="scope">
                                    <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;" >
                                        <span >{{scope.row.reportName}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column  fixed label="纸张" >
                                <template slot-scope="scope">
                                     <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;" >
                                        <span >{{scope.row.paper}}</span>
                                    </div>
                                    <!-- <div>
                                        <input style="white-space: nowrap;text-align:left;" disabled="disabled"  v-model="selectNode.formName">
                                    </div> -->
                                </template>
                            </el-table-column>
                            <el-table-column  fixed label="方向" >
                                <template slot-scope="scope">
                                     <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;" >
                                        <span >{{scope.row.direction}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column  fixed label="是否启用" width="80">
                                <template slot-scope="scope">
                                        <el-switch v-if="scope.row.enable == '0' " :active-value="true" active-color="#13ce66" inactive-color="#ff4949" :disabled="true"> </el-switch>
                                        <el-switch v-if="scope.row.enable== '1' " :active-value="false" active-color="#13ce66" inactive-color="#ff4949" :disabled="true"> </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column  fixed label="日期" width="100">
                                <template slot-scope="scope">
                                     <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;" >
                                        <span >{{scope.row.updateTime}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column  fixed label="修改人" >
                                <template slot-scope="scope">
                                    <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;" >
                                        <span >{{scope.row.updateUserName}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column  fixed label="说明" >
                                <template slot-scope="scope">
                                    <div style="white-space: nowrap;text-align:left;text-overflow: ellipsis;overflow: hidden;" >
                                        <span >{{scope.row.remark}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                </div>
            </div>
            <div class="">
                 <div style="margin: 20px 0;height:31px" class="title clearfix ">
                    <div class="tab">
                        <div @click="changetab('报表设计')" style="padding-left:0"
                            :style="{color:(activeName=='报表设计'?bgColor:'#999'),borderBottomColor:(activeName=='报表设计'?bgColor:'transparent')}">
                            <span  :class="{active:activeName=='报表设计'}">报表设计</span>
                        </div>
                    </div>
                    <div class="content-button" v-if="activeName=='报表设计'">
                        <div>
                            <button><img src="@/assets/common/add.png" @click="addNode" alt=""></button>
                            <button><img src="@/assets/asideIcon/apply-default.png" @click="view" alt=""></button>
                            <button v-if="!isStartEdit"><img src="@/assets/common/save.png" alt=""></button>
                            <button v-if="isStartEdit"><img src="@/assets/common/save2.png"  @click="saveNode('保存')" alt=""></button>
                            <button><img src="@/assets/common/delete.png" @click="deleteNode" alt=""></button>
                        </div>
                    </div>
                </div>
                <div class="manu-table" v-if="activeName=='报表设计'">
                    <el-table style="width: 100%" @cell-click="cell_click"
                        :header-row-style="{background:fontColor,overflow:'hidden',}"  border height="100%"
                        :row-style="{overflow:'hidden',}" :cell-style="{textAlign:'center',}"   highlight-current-row
                        :header-cell-style="{background:fontColor,height:'34px',padding:0,textAlign:'center',color:'#333',fontWeight:'400'}"
                    :data="tables"
                      ref="multipleTable">
                      <el-table-column label="行" width="62px" type="index">
                      </el-table-column>
                      <template v-for='col in cols'>
                        <el-table-column
                          :label="''+col"
                          :prop="''+col"
                          :key="col"
                          width="124px">
                        </el-table-column>
                      </template>
                    </el-table>
                </div>
                <!-- <div class="manu-table" v-if="activeName=='报表预览'" v-html="perviewHTML">
                </div> -->
            </div>
        </div>
        <el-dialog :visible.sync="isView">
            <div id="report_holder"></div>
        </el-dialog>
        
    </div>
</template>
<script>

import asideItem from '@/common/business/selectProjectItem.vue'
import message from '@/common/business/message.vue'
import grhtml5 from './grhtml5-6.6-min.js'
import utils from './utils.js';
export default {
    data(){
        return {
            tables: [],
            tablePreview:[],
            saveTables:[],
            params:[],
            rows:10,
            cols:10,
            rowNUM:'',
            colsNum:'',
            formList:{},
            perviewHTML:'',
            isCell:false,
            isParent:true,
            isTittle:false,
            childColumnList:[],
            selectQuertersModels:{
                isShow:false,
                selectList:[],
                callBack:this.QuertersCallBack,
                radioSelectFlags:false,
            },
            isChild:false,
            selectMemberModels:{
                isShow:false,
                selectList:[],
                callBack:this.memberCallBack,
                radioSelectFlags:false,
            },
            activeName:'报表设计',
            selectNode:{},
            addObject:{},
            manuSelectNode:{},
            isEdit:false,
            isStartEdit:false,
            isAddFormShow:false,
            deleteFlag:false,
            searchText:'',
            deleteMsg:{
                show:false,
                title:'',
                content:'',
                callback:this.callback,
            },
            manuList:[],
            nodeList:[],
            selectList:[],
            // selectList1:[],
            models:[],
            nodeData:{},
            user:{},
            operationNode:{},
            operationNum:0,
            clickCell:{},
            isView:false
        }
    },
    components:{
        asideItem,message
    },
    created(){
      this.bgColor = this.$store.state.themeColor
      this.fontColor = this.$store.state.themeBG
      this.$bus.on('handelDepart', this.addOrEditDepart)
      //this.user=this.cookieUtil.getSession().data.user
      this.user = this.sessionUtil.getUser();
      this.refreshTables()
      this.loadData()
    },
    beforeDestroy () {
      this.$bus.off('handelDepart', this.addOrEditDepart)
    },
    methods:{
        cell_click(row, column, cell, event){
          var vm = this
          if(this.clickCell.style!=undefined){
              this.clickCell.style.backgroundColor = ''
          }
          cell.style.backgroundColor = "#fdeed9"
          this.clickCell = cell
          for (let index = 0; index < this.tables.length; index++) {
            const element = this.tables[index];
            if(row.index == element.index){
                if(column.property!=undefined){
                    this.rowNUM = index
                    this.colsNum = column.property
                }else{
                    this.util.error('请点击正确单元格')
                }
            }
          }
        },
        tabClick(){
            //alert("ssss")
        },
        refreshTables(){
            this.tables = []
            this.tablePreview = []
            this.saveTables = []
            for(let i=0;i<this.rows;i++){
                this.tables.push(
                    {
                        index:i+''
                    }
                )
                this.tablePreview.push({})
                this.saveTables.push({})
            }
        },
        getHTML(){
            var vm = this
            var htmlStr = ''
            this.perviewHTML = ''//添加标题
            for (let index = 0; index < vm.tablePreview.length; index++) {
                const element = vm.tablePreview[index];
                if(element.cellType == '标题'){
                    for(var item in element){
                        if(item != 'cellType'){
                            htmlStr += '<h4 align="center">'+element[item]+'</h4>'
                        }
                    }
                }
            }
            var flag=0;
            for (let index = 0; index < vm.tablePreview.length; index++) {
                const element = vm.tablePreview[index];
                if(element.cellType == '主表'){
                    flag++
                    var tdClass="";
                    if(flag==1){
                      htmlStr += '<table width = "100%" style="height:35px;BORDER-COLLAPSE:collapse;border:0px;border-top:1px solid #004566;"><tr>'
                      tdClass="border-bottom:1px solid #004566;"
                    }else{
                      htmlStr += '<table width = "100%" style="height:35px;BORDER-COLLAPSE:collapse;border:0px;border-bottom:1px solid #004566;"><tr>'

                    }

                    for(var item in element){
                        if(item != 'cellType'){
                            for(var items in element[item]){
                                if(items == 'cellValue'){
                                    var itemss = element[item][items].split(":")
                                    htmlStr += '<td style="height:35px;padding-right:2px;text-align:left;width:120px;border-left:1px solid #004566;'+tdClass+'border-right:1px solid #004566;">'+itemss[0]+':</td>'
                                }else if(items == 'cellLength'){
                                    htmlStr += '<td colspan='+element[item][items]+' style="height:35px;padding-right:2px;text-align:left;width:120px;'+tdClass+'border-left:1px solid #004566;border-right:1px solid #004566;"></td>'
                                }
                            }

                        }
                    }
                    htmlStr += '</tr></table>'
                }else if(element.cellType == '子表'){
                    htmlStr += '<table style=" BORDER-COLLAPSE:collapse;width:100%; border:0px solid #004566;"  cellpadding="0" cellspacing="0">'
                    var trhtml = ''
                    var trhtmls = ''
                    var num = 0
                    for(var item in element){
                        if( item == 'childColumn'){
                            var items = element[item].split(",")
                            for (let i = 0; i < items.length; i++) {
                                const e = items[i];
                                var itemss = e.split(":")
                                trhtml += '<td style="height:35px;padding-right:2px;text-align:center;width:120px;border:1px solid #004566;">'+itemss[0]+'</td>'
                                trhtmls += '<td style="height:35px;padding-right:2px;text-align:center;width:120px;border:1px solid #004566;">'+"&nbsp;"+'</td>'
                                num++
                            }
                        }
                    }
                    for(var item in element){
                        if(item != 'cellType'&& item != 'childColumn'){
                            htmlStr += '<tr><td colspan='+num+' style="height:35px;padding-right:2px;text-align:center;width:120px;border:1px solid #004566;border-top:0px">'+element[item]+'</td></tr>'
                        }
                    }
                    htmlStr += '<tr>' + trhtml + '</tr>'
                    htmlStr += '<tr>' + trhtmls + '</tr>'
                    htmlStr += '<tr>' + trhtmls + '</tr>'
                    htmlStr += '<tr>' + trhtmls + '</tr>'
                    htmlStr += '</table>'
                }
            }
            vm.$set(this,'perviewHTML',htmlStr)
        },
        view(){
            if(JSON.stringify(this.addObject)=="{}"){
                this.util.error('请先选择报表')
                return
            }
            this.isView = true
            setTimeout(() => {
                utils.reportViewer(this.getReport(),null)
            }, 500);
        },
        getReport(){
            var flag = false 
            var ColumnCount = 0
            var RowCount = 0  
            this.params.forEach(element => {
                if(element.cellType === '标题'){
                    flag = true 
                }
                if(parseInt(element.cellRow) > ColumnCount){
                    ColumnCount = parseInt(element.cellRow)
                }
                if(parseInt(element.cellCol)>RowCount){
                    RowCount = parseInt(element.cellCol)
                }
            })
            if(flag){
                RowCount = RowCount -1
            }
            var params = {
                ColumnCount:ColumnCount+1,//总列数
                RowCount:RowCount,//总行数
                cells:[]
            }
            this.params.forEach(element => {
                if(flag){
                    element.cellRow = parseInt(element.cellRow)-1
                }
                var obj1 = {}
                if(element.cellType === '标题'){
                    obj1.type = 0
                    obj1.Text = element.cellValue
                }else {
                    obj1 = {
                        'TextAlign':"MiddleCenter",
                        "row": element.cellRow,
                        "col": element.cellCol,
                    }
                    obj1.type = 1
                    obj1.Text = element.cellValue.split(':')[0]
                    var obj2 = {
                        'TextAlign':"MiddleCenter",
                        "row": element.cellRow,
                        "col": parseInt(element.cellCol)+1,
                        "type": 2,
                        "Text": '[#{'+element.cellColumn+'}#]',
                    }
                    params.cells.push(obj2)
                }
                params.cells.push(obj1)
            });
            return JSON.stringify(utils.getGrf(params))
        },
        reportSelected(row, event, column){
            var vm = this
            this.addObject = row
            this.manuSelectNode.enable = row.enable
            this.refreshTables()
            this.util.getSync('/api_v1/form/printTemplet/printList/'+this.addObject.id,null,(res)=>{
                this.params = res.data
                if(res.data != null){
                    for (let index = 0; index < res.data.length; index++) {
                        const element = res.data[index]
                        //console.log(element)
                        vm.deleteColumn(element)
                        vm.$set(vm.saveTables[parseInt(element.cellRow)-1],element.cellCol,{})
                        vm.$set(vm.tables[parseInt(element.cellRow)-1],element.cellCol,element.cellValue)
                        vm.$set(vm.saveTables[parseInt(element.cellRow)-1][element.cellCol],'cellValue',element.cellValue)
                        if(element.cellType == '主表'){
                            vm.tablePreview[parseInt(element.cellRow)-1][element.cellCol] = {}
                            vm.$set(vm.tablePreview[parseInt(element.cellRow)-1],'cellType','主表')
                            vm.$set(vm.tablePreview[parseInt(element.cellRow)-1][element.cellCol],'cellValue',element.cellValue)
                            vm.$set(vm.tablePreview[parseInt(element.cellRow)-1][element.cellCol],'cellLength',element.cellLength)
                            vm.saveTables[parseInt(element.cellRow)-1][element.cellCol].parent = {}
                            vm.$set(vm.saveTables[parseInt(element.cellRow)-1][element.cellCol].parent,'tableName',element.cellTable)
                            vm.$set(vm.saveTables[parseInt(element.cellRow)-1][element.cellCol].parent,'dbFieldName',element.cellColumn)
                            vm.$set(vm.saveTables[parseInt(element.cellRow)-1][element.cellCol].parent,'colNum',element.cellLength)
                        }else if(element.cellType == '子表'){
                            vm.$set(vm.tablePreview[parseInt(element.cellRow)-1],element.cellCol,element.cellValue)
                            vm.$set(vm.tablePreview[parseInt(element.cellRow)-1],'childColumn',element.childFromColumnList)
                            vm.$set(vm.tablePreview[parseInt(element.cellRow)-1],'cellType','子表')
                            vm.saveTables[parseInt(element.cellRow)-1][element.cellCol].child = {}
                            vm.$set(vm.saveTables[parseInt(element.cellRow)-1][element.cellCol].child,'tableName',element.cellTable)
                            vm.$set(vm.saveTables[parseInt(element.cellRow)-1][element.cellCol],'childColumn',element.childFromColumnList +',')
                            if(element.childFromColumnList!=undefined && element.childFromColumnList!=''){
                                var columnList = element.childFromColumnList.split(',')
                                for (let i = 0; i < columnList.length; i++) {
                                    //var k = Math.floor(element.cellCol-columnList.length/2)+i+1
                                    const edit = columnList[i];
                                    var edits = edit.split(':')
                                    vm.$set(vm.tables[parseInt(element.cellRow)],i+1,edits[0])
                                    vm.$set(vm.tables[parseInt(element.cellRow)+1],i+1,'{'+edits[1]+ '}')
                                }
                            }
                        }else{
                            vm.$set(vm.tablePreview[parseInt(element.cellRow)-1],element.cellCol,element.cellValue)
                            vm.$set(vm.tablePreview[parseInt(element.cellRow)-1],'cellType','标题')
                        }
                    }
                    this.getHTML()
                }
            })
            //console.log(this.tables)
            //console.log(row, event, column)
        },
        deleteColumn(edit){
            if(edit.cellType == '主表'){
                for (let index = 0; index < this.selectNode.formColumnList.length; index++) {
                    const element = this.selectNode.formColumnList[index];
                    var edits = edit.cellValue.split(':')
                    if(element.filedName == edits[0]){
                        this.selectNode.formColumnList.splice(index,1)
                    }
                }
            }else if(edit.cellType == '子表'){
                for (let index = 0; index < this.selectNode.childFormList.length; index++) {
                    const element = this.selectNode.childFormList[index];
                    if(element.formName == edit.cellValue){
                        this.selectNode.childFormList.splice(index,1)
                    }
                }
            }
        },
        addColumn(edit){
            var vm = this
            //console.log(this.nodeData,edit)
            if(edit.parent != undefined){
                for (let index = 0; index < vm.nodeData.formColumnList.length; index++) {
                    const element = vm.nodeData.formColumnList[index];
                    var eidts = edit.cellValue.split(':')
                    if(element.filedName == eidts[0]){
                        vm.selectNode.formColumnList.push(element)
                    }
                }
            }else if(edit.child != undefined){
                for (let index = 0; index < vm.nodeData.childFormList.length; index++) {
                    const element = vm.nodeData.childFormList[index];
                    if(element.formName == edit.cellValue){
                        vm.selectNode.childFormList.push(element)
                    }
                }
            }
            //console.log(this.selectNode)
        },
        changeType(value){
            this.isChild = false
            this.isTittle = false
            this.isParent = false
            if(value == '子表'){
                this.isChild = true
            }else if(value == '标题'){
                this.isTittle = true
            }else{
                this.isParent = true
            }
        },

        saveCell(){
            var vm = this
            vm.$set(vm.saveTables[this.rowNUM],this.colsNum,{})
            if(this.selectNode.type == '主表'){
                for (let index = 0; index < vm.selectNode.formColumnList.length; index++) {
                    const element = vm.selectNode.formColumnList[index];
                    if(element.filedName == vm.selectNode.parent){
                        vm.$set(vm.tables[this.rowNUM],this.colsNum,element.filedName +':{'+element.dbFieldName + '}')
                        vm.$set(vm.saveTables[this.rowNUM][this.colsNum],'parent',element)
                        vm.$set(vm.saveTables[this.rowNUM][this.colsNum],'cellValue',element.filedName +':{'+element.dbFieldName + '}')
                        vm.$set(vm.saveTables[this.rowNUM][this.colsNum],'cellType','主表')
                        vm.tablePreview[this.rowNUM][this.colsNum] = {}
                        vm.$set(vm.tablePreview[this.rowNUM],'cellType','主表')
                        vm.$set(vm.tablePreview[this.rowNUM][this.colsNum],'cellValue',element.filedName +':{'+element.dbFieldName + '}')
                        vm.$set(vm.tablePreview[this.rowNUM][this.colsNum],'cellLength',1)
                    }
                }
            }else if(this.selectNode.type == '子表'){
                vm.saveTables[this.rowNUM][this.colsNum].childColumn = ''
                for (let index = 0; index < vm.selectNode.childFormList.length; index++) {
                    const element = vm.selectNode.childFormList[index];
                    if(element.formName == vm.selectNode.child){
                        for (let i = 0; i < element.childFormColumnInfo.length; i++) {
                            const edit = element.childFormColumnInfo[i];
                            vm.$set(vm.tables[this.rowNUM],this.colsNum,element.formName)
                            vm.$set(vm.saveTables[this.rowNUM][this.colsNum],'cellValue',element.formName)
                            vm.$set(vm.saveTables[this.rowNUM][this.colsNum],'child',element)
                            vm.$set(vm.saveTables[this.rowNUM][this.colsNum],'cellType','子表')
                            vm.$set(vm.tablePreview[this.rowNUM],'cellType','子表')
                            vm.$set(vm.tablePreview[this.rowNUM],this.colsNum,element.formName)
                            for (let j = 0; j < vm.selectNode.childColumn.length; j++) {
                                const ele = vm.selectNode.childColumn[j];
                                //var k = Math.floor(this.colsNum-vm.selectNode.childColumn.length/2)+j+1
                                if(ele == edit.filedName){
                                    vm.$set(vm.tables[this.rowNUM+1],j+1,edit.filedName)
                                    vm.$set(vm.tablePreview[this.rowNUM+1],j+1,edit.filedName)
                                    vm.saveTables[this.rowNUM][this.colsNum].childColumn += edit.filedName + ':'+edit.dbFieldName +','
                                    vm.$set(vm.tables[this.rowNUM+2],j+1,'{'+edit.dbFieldName + '}')
                                    vm.$set(vm.tablePreview[this.rowNUM+2],j+1,'###')
                                }
                            }
                        }
                    }
                }
            }else{
                vm.$set(vm.tables[this.rowNUM],this.colsNum,this.selectNode.tittle)
                vm.$set(vm.tablePreview[this.rowNUM],this.colsNum,this.selectNode.tittle)
                vm.$set(vm.saveTables[this.rowNUM][this.colsNum],'cellValue',this.selectNode.tittle)
            }
            this.isCell = false
            this.deleteColumn(vm.saveTables[this.rowNUM][this.colsNum])
            this.getHTML()
        },
        esc(){
            this.isCell = false
        },
        changeChild(edit){
            for (let index = 0; index < this.selectNode.childFormList.length; index++) {
                const element = this.selectNode.childFormList[index];
                if(element.formName == edit){
                    this.childColumnList = element.childFormColumnInfo
                }
            }
        },
        QuertersCallBack(){
            this.addObject.selectQuertersModelsselectList=this.selectQuertersModels.selectList
        },
        memberCallBack(){
            if(this.operationNum==0){
                this.addObject.selectMemberModelsselectList=this.selectMemberModels.selectList;
            }else if(this.operationNum==1){
                var arr1=[]
                for (var index = 0; index < this.selectMemberModels.selectList.length; index++) {
                    var o={}
                    o.category=1
                    o.relationType=0
                    o.name= this.selectMemberModels.selectList[index].userName;
                    o.value= this.selectMemberModels.selectList[index].id;
                    arr1.push(o)
                }
                this.operationNode.UserNameList=arr1
            }else if(this.operationNum==3){
                var arr3=[]
                for (var index = 0; index < this.selectMemberModels.selectList.length; index++) {
                    var o={}
                    o.category=1
                    o.relationType=0
                    o.name= this.selectMemberModels.selectList[index].userName;
                    o.value= this.selectMemberModels.selectList[index].id;
                    arr3.push(o)
                }
                this.operationNode.UserNameList=arr3
            }else if(this.operationNum==4){
                var arr4=[]
                for (var index = 0; index < this.selectMemberModels.selectList.length; index++) {
                    var o={}
                    o.category=2
                    o.relationType=0
                    o.name= this.selectMemberModels.selectList[index].userName;
                    o.value= this.selectMemberModels.selectList[index].id;
                    arr4.push(o)
                }
                this.operationNode.CopyUserNameList=arr4
            }
            this.operationNum=0;
        },
        cancel(){
            this.addObject={'enable':true};
            this.isAddFormShow=false
        },
        success(){
            var param={
                formKey:this.selectNode.id,
                reportName:this.addObject.reportName,
                direction:this.addObject.direction,
                paper:this.addObject.paper,
                enable:this.addObject.enable?1:0,
                remark:this.addObject.remark,
            }
            this.util.restPost('/api_v1/form/report/insert',param,(res)=>{
                //console.log(res)
                if(res.status==200){
                    if(this.isEdit){
                        this.util.success('修改成功')
                    }else{
                        this.util.success('保存成功')
                    }
                    this.addObject={}
                    this.loadData()
                    this.cancel()
                }else{
                    this.util.error(res.msg)
                }
            })

        },
        nodeLIstShow(node){
            this.manuSelectNode=node
            this.changetab(this.activeName)
        },
        handleSelectionChange (val) {
            this.selectList=val
        },
        changetab (str) {
            //console.log(str)
            this.activeName = str
            if(str=='报表设计'){

            }else{
                //this.tablePreview = this.tables
                //console.log(this.tablePreview)
            }
        },
        addOrEditDepart(data){
            var vm = this
            this.manuList = []
            var CircularJSON = require('circular-json')
            this.nodeData = JSON.parse(CircularJSON.stringify(data))
            this.selectNode = data
            if(this.clickCell.style!=undefined){
                this.clickCell.style.backgroundColor = ''
            }
            this.perviewHTML = ''
            this.clickCell = {}
            this.refreshTables()
            this.refreshReport()
        },
        refreshReport(){
            this.nodeList=[]
            this.manuSelectNode={}
            if(this.selectNode.id != undefined){
                var param={
                    formKey:this.selectNode.id,
                }
                //console.log(param)
                this.util.restPost('/api_v1/form/report/reportList',param,(res)=>{
                    //console.log(res)
                    if(res.status==200){
                        if(res.data&&res.data.length>0){
                            for (var i = 0; i < res.data.length; i++) {
                                res.data[i].type==0?res.data[i].type=false:res.data[i].type=true;
                            }
                        this.manuList=res.data
                    }
                    }else{
                        this.util.error(res.msg)
                    }
                })
                this.util.get('/api_v1/form/management/listFormAndChild/'+this.selectNode.id,null,(res)=>{
                    if(res.status==200){
                        if(res.data){
                            this.selectNode = res.data
                        }
                    }else{
                        this.util.error(res.msg)
                    }
                })

            }
        },
        callback(){
            var vm = this
            if(this.deleteFlag){
                this.util.restPost('/api_v1/form/report/delete',this.addObject,(res)=>{
                    this.util.success('删除成功')
                })
            }else{
                //console.log(this.saveTables[this.rowNUM][this.colsNum])
                if(this.saveTables[this.rowNUM][this.colsNum] != undefined){
                    this.addColumn(vm.saveTables[this.rowNUM][this.colsNum])
                    vm.$set(vm.tables[this.rowNUM],this.colsNum,'')
                    vm.$set(vm.tablePreview[this.rowNUM],this.colsNum,undefined)
                    if(this.saveTables[this.rowNUM][this.colsNum].child != undefined){
                        var childColumns = this.saveTables[this.rowNUM][this.colsNum].childColumn.split(',')
                        for (let index = 0; index < childColumns.length; index++) {
                            const element = childColumns[index];
                            vm.$set(vm.tables[this.rowNUM+1],index+1,'')
                            vm.$set(vm.tablePreview[this.rowNUM+1],index+1,'')
                            vm.$set(vm.tables[this.rowNUM+2],index+1,'')
                            vm.$set(vm.tablePreview[this.rowNUM+2],index+1,'')
                        }
                    }else if(this.saveTables[this.rowNUM][this.colsNum].parent != undefined){
                        vm.$set(vm.tablePreview[this.rowNUM],parseInt(this.colsNum)+1,undefined)
                    }
                    vm.$set(vm.saveTables[this.rowNUM],this.colsNum,{})
                }
            }
            this.getHTML()
        },
        loadData(){
            this.nodeList=[]
            this.manuSelectNode={}
            this.util.restPost('/api_v1/form/management/listFormAndColumn',null,(res)=>{
                if(res.data!=null){
                    var models = []
                    var num = 0
                    for (let i = 0; i < res.data.length; i++) {
                        const formVo = res.data[i];
                        var flag = true
                        formVo.nodeId = formVo.id
                        formVo.label = formVo.formName
                        formVo.text = formVo.formName
                        formVo.isResp = 0
                        formVo.gender = 0
                        formVo.leaf = false
                        formVo.checked = 0
                        for (let j = 0; j < models.length; j++) {
                            const model = models[j];
                            formVo.parentId = model.id
                            if(model.label == formVo.module){
                                flag = false
                                model.children.push(formVo)
                            }
                        }
                        if(flag){
                            num+=1
                            var obj = {
                                "id": num,
                                "nodeId": num,
                                "label": formVo.module,
                                "text": formVo.module,
                                "isResp": 0,
                                "gender": 0,
                                "leaf": false,
                                "parentId": num,
                                "checked": 0,
                                "children":[]
                            }
                            obj.children.push(formVo)
                            models.push(obj)
                        }
                    }
                    this.models = models
                }
            })
        },
        addWorkflow(){
            if(!this.selectNode.id){
                this.util.error('请选择表单')
                return
            }
            this.addObject = {}
            this.isEdit=false
            var str=(new Date()).format("yyyy-MM-dd")
            this.addObject.updateTime=str
            this.addObject.selectQuertersModelsselectList=this.selectQuertersModels.selectList
            this.addObject.selectMemberModelsselectList=this.selectMemberModels.selectList
            //this.addObject.myself=this.cookieUtil.getSession().data.user.userName
            this.addObject.myself = this.sessionUtil.getUserName();
            this.isAddFormShow=true
        },
        editWorkflow(){
            if(JSON.stringify(this.addObject)=='{}'){
                this.util.error('请选择要修改的报表')
                return
            }
            
            if(this.manuSelectNode.authlist&&this.manuSelectNode.authlist.length>0){
                for (var index = 0; index < this.manuSelectNode.authlist.length; index++) {
                    if(this.manuSelectNode.authlist[index].type==1){
                        var o={}
                        o.label=this.manuSelectNode.authlist[index].name
                        this.addObject.selectQuertersModelsselectList.push(o)
                    }else if(this.manuSelectNode.authlist[index].type==3){
                        var obj={}
                        obj.userName=this.manuSelectNode.authlist[index].name
                        this.addObject.selectMemberModelsselectList.push(obj)
                    }
                }
            }
            this.addObject.description=this.manuSelectNode.description
            this.addObject.myself =this.manuSelectNode.updateUserName
            this.addObject.name =this.manuSelectNode.name
            this.addObject.updateTime =this.manuSelectNode.updateTime
            //this.addObject.updateUserName =this.cookieUtil.getSession().data.user.userName
            this.addObject.updateUserName = this.sessionUtil.getUserName();
            this.manuSelectNode.enable==1?this.addObject.enable=true:this.addObject.enable=false;
            this.isEdit=true
            this.isAddFormShow=true
        },
        deleteWorkflow(){
            if(JSON.stringify(this.addObject)=='{}'){
                this.util.error('请选择要删除的报表')
                return
            }
            this.deleteFlag=true
            if(!this.manuSelectNode.value){
                 this.deleteMsg.show=true;
                 this.deleteMsg.title='删除报表';
                 this.deleteMsg.content='此操作为不可恢复操作，请确认是否删除本报表；是，请点击【确定】，否，请点击【取消】';
            }else{
                 this.deleteMsg.show=true;
                 this.deleteMsg.title='删除报表';
                 this.deleteMsg.content='当前已有审批单据启用本报表，请【取消】对本报表的删除操作。如需不再启用本报表，请在“启用”栏停止本报表的启用';
            }
        },
        addNode(){
            if(!this.selectNode.id){
                this.util.error('请选择表单')
                return
            }
            if(JSON.stringify(this.addObject)=="{}"){
                this.util.error('请先选择报表')
                return
            }
            if(JSON.stringify(this.clickCell)=="{}"){
                this.util.error('请选择单元格')
                return
            }
            this.$set(this.selectNode, "type", '主表')
            this.$set(this.selectNode, "parent", '')
            this.$set(this.selectNode, "child", '')
            this.$set(this.selectNode, "tittle", '')
            this.$set(this.selectNode, "childColumn", [])
            this.isStartEdit=true
            this.isCell=true
        },
        saveNode(strss){
            this.params = []
            if(JSON.stringify(this.addObject)=="{}"){
                this.util.error('请先选择报表')
                return
            }
            var print = {formId:this.addObject.id}
            this.util.restPost('/api_v1/form/printTemplet/delete',print,(res)=>{})
            for (let index = 0; index < this.saveTables.length; index++) {
                const element = this.saveTables[index];
                if(JSON.stringify(element)=="{}" || element =={}){
                    continue
                }
                for(var edit in element){
                    if(element[edit].cellValue != undefined && element[edit].cellValue != ''){
                        var param={}
                        param.cellRow = index+1
                        param.formId = this.addObject.id
                        param.cellCol = edit
                        param.cellValue = element[edit].cellValue
                        if(element[edit].parent != undefined){
                            param.cellType = '主表'
                            param.cellLength = element[edit].parent.colNum
                            param.cellColumn = element[edit].parent.dbFieldName
                            param.cellTable = element[edit].parent.tableName
                        }else if(element[edit].child != undefined){
                            param.cellType = '子表'
                            param.cellTable = element[edit].child.tableName
                            var list = element[edit].childColumn
                            param.childFromColumnList = list.substr(0,list.length-1)
                        }else{
                            param.cellType = '标题'
                        }
                        this.params.push(param)
                    }
                }
            }
            this.util.restPost('/api_v1/form/printTemplet/insert',this.params,(res)=>{
                this.util.success('保存成功')
            })
        },
        deleteNode(){
            if(!this.selectNode.id){
                this.util.error('请选择表单')
                return
            }
            if(JSON.stringify(this.addObject)=="{}"){
                this.util.error('请先选择报表')
                return
            }
            if(JSON.stringify(this.clickCell)=="{}"){
                this.util.error('请选择单元格')
                return
            }
            this.isStartEdit=true
            this.deleteFlag=false
            this.deleteMsg.show=true;
            this.deleteMsg.title='删除单元格';
            this.deleteMsg.content='此操作为不可恢复操作，请确认是否删除本单元格；是，请点击【确定】，否，请点击【取消】';
        },
    }
}
</script>
<style scoped>
.aside{
    width: 300px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10);
    overflow: hidden;
    float: left;
    position: absolute;
    left: 0;
    height: 100%;
}
.aside>p{
    background: #FDEED9;
    box-shadow: 0 0 0 0 #D9D9D9, inset 0 0 0 0 #D9D9D9;
    width: 100%;
    height: 44px;
    line-height: 44px;
    box-sizing: border-box;
    padding-left: 20px;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #d7d7d7;
}
.content{
    overflow: hidden;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10);
    min-height: 780px;
    padding: 0 20px ;
}
.content-button{
    float: right;
    margin-top: -5px;
}
.content-button>.input{
    padding:8px 5px 10px;
    margin-right: 20px;
    border: 1px solid #e7e7e7;
    border-radius: 1px;
    font-size: 12px;
    width: 190px;
    position: relative;
    height: 36px;
    box-sizing: border-box;
}
.content-button>.input>button{
    position: absolute;
    width:36px ;
    height:36px ;
    background: url(../../assets/administrationIcon/search.png) no-repeat center;
    right: 0;
    top: 0;
    border: 0 none;
    border-left: 1px solid
}
.content-button>div button{
    border: 1px solid #c4c4c4;
    box-sizing: border-box;
}
.content-button>div button img{
    width: 34px;
}
.content-button>input,
.content-button>div,
.content-button>div button{
    float: left;
}
.content-button>div button:nth-child(2){
    border-left: 0 none;
    border-right: 0 none;
}
.title{
    position: relative;
}
.tab{
    position: absolute;top: 0;
    left: 10px;
    z-index: 2;
}
.tab>div{
    float: left;
    padding: 0 10px;
}
.active{
    position: relative;
}
.active::after{
    content: '';
    position: absolute;
    width: 100%;
    bottom: -6px;
    left: 0;
    height: 2px;
    background: #F08B00;
}
.operation span{
    cursor: pointer;
}
.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 98;
    background: rgba(0, 0, 0, 0.6);
}
.boxs{
    width: 812px;
    transform: translate(-50%,-50%);
    position: fixed;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 5px ;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    height: 391px;
    z-index: 99;
    overflow: hidden;
    padding: 0 20px ;
    box-sizing: border-box;
}
.footer{
    position: absolute;
    bottom: 10px;
    right: 20px;
}
.add-from{
    overflow: hidden;
    margin-bottom: 20px;
}
.add-from .add-from-left{
    float: left;
}
.add-from .add-from-right{
    float: right;
}
.add-from>div>div{
    float: left;
}
.add-from-input{
    width: 296px;
    height: 38px;
    border: 1px solid #d4d4d4;
    border-radius: 1px;
    box-sizing: border-box;
    padding: 6px 0 10px 5px;
    font-size: 14px;
    color: #333333;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.add-from-input input{
    width: 100%;
}
.add-from-input.add-from-disable{
    background: #F4F4F4;
}
.add-from-label{
    height: 38px;
    line-height: 38px;
    width: 70px;
    text-align: left;
}
</style>
<style>
.manu-table .el-table__body tr.hover-row>td{
    background: #fff;
}
.manu-table1.manu-table .el-table__body tr.hover-row>td,.manu-table1.manu-table .el-table__body tr.current-row>td{
    background: #f6f6f6;
}

</style>
