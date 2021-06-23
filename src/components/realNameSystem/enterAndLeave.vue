<template>
  <div class="proj-box">
    <div class="num-box">
      <el-row style="height: 54px;">
        <el-col :span="6">
          <div class="box-style box-style1">
            <el-row>
              <el-col :span="6">
                <h4>班组</h4>
              </el-col>
              <el-col :span="14">
                &nbsp;
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="mini"
                           style="background-color: rgba(68,210,255,0.2);color: rgba(68,210,255,1);" @click="addTeam">添加
                </el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-table
                :data="teamData"
                border
                :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
                style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);">
                <el-table-column
                  prop=""
                  label="操作"
                  width="60">
                  <template slot-scope="scope">
                    <span>
                      <i style="color: rgba(68,210,255,1);" class="el-icon-edit" @click="editTeam(scope.row)"></i>
                      <i style="color: rgba(68,210,255,1);" class="el-icon-delete" @click="delTeam(scope.row)"></i>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="班组名称"
                >
                </el-table-column>
                <el-table-column
                  prop="leader"
                  label="负责人">
                </el-table-column>
                <el-table-column
                  prop="peopleNumber"
                  label="人数">
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </el-col>

        <el-col :span="18
">
          <div class="box-style box-style1">
            <el-row style="height: 54px;">
              <el-col :span="6">
                <div style="display: flex;"></div>
                <el-button type="primary" size="mini"
                           style="background-color: rgba(255,255,255,0.2);color: rgba(68,210,255,1)"
                >进场
                </el-button>
                <el-button type="primary" size="mini"
                           style="background-color: rgba(68,210,255,0.2);color: rgba(68,210,255,1)">退场
                </el-button>
              </el-col>
              <el-col :span="16">
                &nbsp;
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="mini"
                           style="background-color: rgba(68,210,255,0.2);color: rgba(68,210,255,1)" @click="addMember">
                  批量生成
                </el-button>
              </el-col>
            </el-row>
            <el-row>

              <el-table
                :data="memberData"
                border
                :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
                style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);">
                <el-table-column
                  type="selection"
                  label="选择"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop=""
                  label="操作"
                  width="60">
                  <template slot-scope="scope">
                    <span>
                      <i style="color: rgba(68,210,255,1);width: 15px;" class="el-icon-edit"
                         @click="editMember(scope.row)"></i>
                      <i style="color: rgba(68,210,255,1);" class="el-icon-delete" @click="delMember(scope.row)"></i>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="has_entered"
                  label="是否在场"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="card_name"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="phone"
                  label="手机号码">
                </el-table-column>
                <el-table-column
                  prop="card_num"
                  label="身份证号码">
                </el-table-column>
                <el-table-column
                  prop="work_type"
                  label="工种">
                </el-table-column>
                <el-table-column
                  prop="sign_in_card_num"
                  label="类型">
                </el-table-column>
                <el-table-column
                  prop="has_signed_contract"
                  label="日期">
                </el-table-column>

              </el-table>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 浮窗-->
    <el-dialog :visible.sync="dialogTeamForm.visible" :title="dialogTeamForm.title" center :before-close="handleClose">
      <el-form>
        <!-- line 1 -->
        <el-form-item>
          <!--左侧-->
          <el-row>
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="6" style="text-align: center;white-space:nowrap">
                  班组名称
                </el-col>
                <el-col :span="18">
                  <el-input autocomplete="off" v-model="dialogTeamForm.equipmentType"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <!--右侧-->
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="6" style="text-align: center;white-space:nowrap">
                  班组编号
                </el-col>
                <el-col :span="18">
                  <el-input autocomplete="off" v-model="dialogTeamForm.unit"></el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- line 2 -->
        <el-form-item>
          <!--左侧-->
          <el-row>
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="6" style="text-align: center;white-space:nowrap">
                  企业社会代码
                </el-col>
                <el-col :span="18">
                  <el-input autocomplete="off" v-model="dialogTeamForm.equipmentType"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <!--右侧-->
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="6" style="text-align: center;white-space:nowrap">
                  企业名称
                </el-col>
                <el-col :span="18">
                  <el-input autocomplete="off" v-model="dialogTeamForm.unit"></el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- line 3 -->
        <el-form-item>
          <!--左侧-->
          <el-row>
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="6" style="text-align: center;white-space:nowrap">
                  班组长姓名
                </el-col>
                <el-col :span="18">
                  <el-input autocomplete="off" v-model="dialogTeamForm.equipmentType"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <!--右侧-->
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="6" style="text-align: center;white-space:nowrap">
                  联系电话
                </el-col>
                <el-col :span="18">
                  <el-input autocomplete="off" v-model="dialogTeamForm.unit"></el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <!--line 4-->
        <el-form-item>
          <!--左侧-->
          <el-row>
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap">
                  班组长证件类型
                </el-col>
                <el-col :span="18" style="text-align: left;white-space:nowrap">
                  <el-select v-model="dialogTeamForm.projectType">
                    <el-option
                      v-for="item in info3List"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <!--<el-input autocomplete="off" v-model="dialogTeamForm.projectType"></el-input>-->
                </el-col>
              </el-row>
            </el-col>
            <!--右侧-->
            <el-col :span="12" style="text-align: left;">

            </el-col>
          </el-row>
        </el-form-item>
        <!--line 5-->

        <el-form-item>
          <el-row>
            <el-col :span="8" style="text-align: center;">
              <!--<el-button style="width: 60%;" @click="dialogTeamForm.visible = false">取 消</el-button>-->
              <el-button style="width: 60%;" @click="canceldialogTeamForm">取 消</el-button>
            </el-col>
            <!--右侧-->
            <el-col :span="12" style="text-align: right;">
              <!--<el-button type="primary" style="width: 100%;" @click="dialogTeamForm.visible = false">确 定</el-button>-->
              <el-button type="primary" style="width: 100%;" @click="confirmdialogTeamForm">确 定</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <!--<div slot="footer">-->
      <!--<el-row>-->
      <!--<el-col :span="8" style="text-align: center;">-->
      <!--<el-button style="width: 60%;" @click="dialogTeamForm.visible = false">取 消</el-button>-->
      <!--</el-col>-->
      <!--&lt;!&ndash;右侧&ndash;&gt;-->
      <!--<el-col :span="10" style="text-align: center;">-->
      <!--<el-button type="primary" style="width: 100%;" @click="dialogTeamForm.visible = false">确 定</el-button>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--</div>-->
    </el-dialog>


  </div>
</template>
<script>
  export default {
    data () {
      return {
        dialogTeamForm: {//编辑浮窗
          visible: false,//是否显示浮窗
          title: '',
          editType: '',//add、edit、

          id: '',//编号id
          name: '',
          key: '',
          value: '',
          order: '',//排序
        },
        teamData: [
          {
            id: 1,
            name: '张三施工队',
            leader: '张三',
            peopleNumber: '9',
          },
        ],
        memberData: [
          {
            id: 1,
            has_entered: '无',
            card_name: '张三',
            phone: '13826928999',
            card_num: '44066666666',
            work_type: '电工',
            sign_in_card_num: '进场',
            has_signed_contract: '2018-10-16',
            has_buy_insurance: '无',
            is_teamleader: '否',
          },
        ],
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      addTeam () {
        this.dialogTeamForm.visible = true
        this.dialogTeamForm.title = '新建班组'
      },
      editTeam (row) {

      },
      delTeam (row) {
        for (var i in this.teamData) {
          if (row.id === this.teamData[i].id) {
            this.teamData.splice(i, 1)
            this.util.success('删除成功')
          }
        }
      },

      addMember () {

      },
      editMember (row) {

      },
      delMember (row) {
        for (var i in this.memberData) {
          if (row.id === this.memberData[i].id) {
            this.memberData.splice(i, 1)
            this.util.success('删除成功')
          }
        }
      },

      loadData () {
        this.drawCharts()
      },
      drawCharts () {
        var myChart = this.$echarts.init(document.getElementById('myChart'))
        var _this = this
        var option = {}
        myChart.setOption(option)
      }
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
    padding-top: 336px;
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
    padding-right: 11px;
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
  .el-table__empty-text {
    width: 50%;
    color: rgba(68, 210, 255, 1);
  }
</style>
