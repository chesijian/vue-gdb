<template>
  <div class="proj-box numberselect" style="position: fixed;width: 1000px;top: 8%;height:500px;left: 0;bottom: 0;right: 0;margin: 0 auto;z-index:9999;background-color: #fff">
    <div class="num-box">
      <div class="mun-box_left" style="box-sizing: border-box">
        <!--<div style="width:100%;position: relative">-->
          <!--<div style="position: absolute;width:100%;">-->
            <!--<el-row >-->
              <!--<el-col :span="6">-->
                <!--<h4>班组</h4>-->
              <!--</el-col>-->
              <!--<el-col :span="14">-->
                <!--&nbsp;-->
              <!--</el-col>-->
              <!--<el-col :span="2">-->
                <!--<button style="width: 48px;height: 26px;" @click="addTeam">添加</button>-->
              <!--</el-col>-->
            <!--</el-row>-->
          <!--</div>-->
        <!--</div>-->

        <div  style="height:100%;box-sizing: border-box;">
          <div>
            <el-table
              :data="teamData" height="400" border class="highlight-current-row" highlight-current-row @current-change="teamRowClick">
              <el-table-column prop="" label="操作" width="70">
                <template slot-scope="scope">
                    <span>
                      <i style="color: rgba(68,210,255,1);font-size:16px;" class="el-icon-edit" @click.stop="editTeam(scope.row)"></i>
                      <i style="color: rgba(68,210,255,1);font-size:16px;" class="el-icon-delete" @click.stop="delTeam(scope.row)"></i>
                    </span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="班组名称" @click="teamRowClick">
              </el-table-column>
              <el-table-column prop="responsiblePersonName" width="70" label="负责人">
              </el-table-column>
              <el-table-column prop="teamMemberNum" width="50" label="人数">
              </el-table-column>
            </el-table>
          </div>
          <div>
            <el-pagination
              class="pagein"
              @size-change="changeTeamPageSize($event)"
              @current-change="changeTeamPageNum($event)"
              :current-page="teamPage.pageNum"
              :page-sizes="[10, 25, 50, 100]"
              :page-size="teamPage.pageSize"
              small
              layout=" prev, pager, next, jumper"
              :total="teamPage.totalCount">
            </el-pagination>
          </div>
        </div>


      </div >
      <div class="mun-box_right">
        <div class="mun-box_right-box" style="box-sizing: border-box">
          <div  style="height:100%;box-sizing: border-box;">
            <el-table
              :data="memberData"
              border
              @selection-change="handleSelectionChange"
              height="400"
            >
              <el-table-column
                type="selection"
                label="选择"
                width="40">
              </el-table-column>
              <el-table-column
                prop="entryStatusName"
                label="是否在场">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.entryStatusName=='进场'"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column
                prop="workername"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="workerPhone"
                width="120"
                label="手机号码">
              </el-table-column>
              <el-table-column
                prop="workerCreadNum"
                width="180"
                label="身份证号码">
              </el-table-column>
              <el-table-column
                prop="workerTypeName"
                label="工种">
              </el-table-column>
              <el-table-column
                prop="signCardNum"
                label="考勤卡号">
              </el-table-column>
              <el-table-column
                label="有无合同">
                <template slot-scope="scope">
                  <p>{{scope.row.hasContract?'有':'无'}}</p>
                </template>
              </el-table-column>
              <el-table-column
                label="有无保险">
                <template slot-scope="scope">
                  <p>{{scope.row.hasBuyInsurance?'有':'无'}}</p>
                </template>
              </el-table-column>
              <el-table-column
                label="是否组长">
                  <template slot-scope="scope">
                    <p>{{scope.row.isTeamLeader?'是':'否'}}</p>
                  </template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="pagein"
              @size-change="changememberPageSize($event)"
              @current-change="changememberPageNum($event)"
              :current-page="memberPage.pageNum"
              :page-sizes="[10, 25, 50, 100]"
              :page-size="memberPage.pageSize"
              small
              layout=" prev, pager, next, jumper"
              :total="memberPage.totalCount">
            </el-pagination>
          </div>

        </div>
      </div>
    </div>
    <div style="text-align: right;padding-right: 10px;margin-top: 5px;">
      <button style="background-color: rgba(92,154,212,1)" type="success" @click="strueclose">取消</button>
      <button style="background-color: rgba(92,154,212,1)" @click="strue" type="success">确定</button>
    </div>
    <!--班组-浮窗-->
    <el-dialog :visible.sync="teamDialogForm.visible" :title="teamDialogForm.title" center
               :before-close="handleClose" width="900"
               class="jrjy" top="5vh"
    >
      <el-form >
        <!-- line 1 -->
        <el-form-item>
          <!--左侧-->
          <el-row>
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="8" style="text-align: left;white-space:nowrap;font-size: 14px;color: black;">
                  班组名称<i style="color: red;">*</i>
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="teamDialogForm.team.teamName"
                            maxlength="100"
                            style="background-color: rgba(255,255,255,0.2)" size="mini"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <!--右侧-->
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="8" style="text-align: center;white-space:nowrap;font-size: 14px;color: black;">
                  班组编号
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="teamDialogForm.team.teamSysNo" size="mini"   maxlength="50"></el-input>
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
                <el-col :span="8" style="text-align: left;white-space:nowrap;font-size: 14px;color: black;">
                  企业社会代码
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="teamDialogForm.team.corpCode" size="mini" maxlength="18"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <!--右侧-->
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="8" style="text-align: center;white-space:nowrap;font-size: 14px;color: black;">
                  企业名称
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="teamDialogForm.team.corpName" maxlength="200" size="mini"></el-input>
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
                <el-col :span="8" style="text-align: left;white-space:nowrap;font-size: 14px;color: black;">
                  班组长姓名
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="teamDialogForm.team.teamLeaderName" maxlength="50"  size="mini"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <!--右侧-->
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="8" style="text-align: center;white-space:nowrap;font-size: 14px;color: black;">
                  联系电话
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="teamDialogForm.team.teamLeaderPhone" maxlength="50"  size="mini"></el-input>
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
                <el-col :span="8" style="text-align: left;white-space:nowrap;font-size: 14px;color: black;">
                  班组长证件类型
                </el-col>
                <el-col :span="16" style="text-align: center;white-space:nowrap;display: flex;">
                  <el-select v-model="teamDialogForm.team.teamLeaderIdcardType" size="mini" style="width: 100%;margin-right: auto;">
                    <el-option
                      v-for="item in util.cardTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <!--line 5-->
        <el-form-item>
          <el-row>
            <el-col :span="24" style="text-align: left;">
              <el-row>
                <el-col :span="4" style="text-align: left;white-space:nowrap;font-size: 14px;color: black;">
                  班组长证件号码
                </el-col>
                <el-col :span="20" style="text-align: left;white-space:nowrap">
                  <el-input autocomplete="off" v-model="teamDialogForm.team.teamLeaderIdnumber" maxlength="30"  size="mini"></el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- line 6 -->
        <el-form-item>
          <!--左侧-->
          <el-row>
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="8" style="text-align: left;white-space:nowrap;font-size: 14px;color: black;">
                  责任人姓名
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="teamDialogForm.team.responsiblePersonName"
                            maxlength="50"
                            size="mini"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <!--右侧-->
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="8" style="text-align: center;white-space:nowrap;font-size: 14px;color: black;">
                  联系电话
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="teamDialogForm.team.responsiblePersonPhone"
                            maxlength="50"
                            size="mini"></el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <!--line 7-->
        <el-form-item>
          <!--左侧-->
          <el-row>
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="8" style="text-align: left;white-space:nowrap;font-size: 14px;color: black;">
                  责任人证件类型
                </el-col>
                <el-col :span="16" style="text-align: left;white-space:nowrap;display: flex;">
                  <el-select ref="responsiblepersonIdcardType" v-model="teamDialogForm.team.responsiblepersonIdcardType" size="mini" style="width:100%;margin-right: auto;"
                  >
                    <el-option
                      v-for="item in util.cardTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <!--line 8-->
        <el-form-item>
          <el-row>
            <el-col :span="24" style="text-align: left;">
              <el-row>
                <el-col :span="4" style="text-align: left;white-space:nowrap;font-size: 14px;color: black;">
                  责任人证件号码
                </el-col>
                <el-col :span="20" style="text-align: left;white-space:nowrap">
                  <el-input autocomplete="off" v-model="teamDialogForm.team.responsiblePersonIdnumber"
                            maxlength="30"
                            size="mini"></el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>

        <!--line 9-->
        <el-form-item>
          <el-row>
            <el-col :span="24" style="text-align: left;">
              <el-row>
                <el-col :span="4" style="text-align: left;white-space:nowrap;font-size: 14px;color: black;">
                  备注
                </el-col>
                <el-col :span="20" style="text-align: left;white-space:nowrap">

                  <el-input autocomplete="off" v-model="teamDialogForm.team.remark" size="mini" maxlength="200"></el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <!--line 10-->
        <el-form-item>
          <!--左侧-->
          <el-row>
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="8" style="text-align: left;white-space:nowrap;font-size: 14px;color: black;">
                  进场日期
                </el-col>
                <el-col :span="16">
                  <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    size="small"
                    v-model="teamDialogForm.team.entryTime"
                    placeholder="选择进场日期">
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-col>
            <!--右侧-->
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="8" style="text-align: center;white-space:nowrap;font-size: 14px;color: black;">
                  退场日期
                </el-col>
                <el-col :span="16">
                  <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    size="small"
                    v-model="teamDialogForm.team.exitTime"
                    placeholder="选择进场日期">
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>


        <div style="display: flex;">
          <button type="primary"
                  style="margin-left: auto;color: white;width: 60px;height: 28px;background-color: rgba(92,154,212,1);border: none;"
                  @click="cancelTeamDialogForm">取 消
          </button>
          <button type="primary"
                  style="margin-left:10px;color: white;width: 60px;height: 28px;background-color: rgba(92,154,212,1);border: none;"
                  @click="confirmTeamDialogForm">确 定
          </button>
        </div>
      </el-form>
    </el-dialog>

    <!--人员-浮窗-->
    <el-dialog class="jrjy"  :visible.sync="memberDialogForm.visible" :title="memberDialogForm.title" center :before-close="handleClose" top="5vh" width="70%">
      <el-form style="width: 100%;">
        <el-form-item>
          <el-row>
            <el-col :span="8" style="text-align: left;">
              <div style="display: flex;">
                <button style="background-color: rgba(92,154,212,1);color:white;width: 76px;height: 24px;" @click="uploadByType('IdCard')">上传照片</button>
                <button :disabled="showDriveDownload"
                        :style="{backgroundColor:showDriveDownload? '#909399':'rgba(92,154,212,1)'}" style="background-color: rgba(92,154,212,1);color:white;width: 100px;height: 24px;margin-left: 10px;" @click="getIdCardInfo">读取身份证</button>
              </div>
            </el-col>
            <el-col :span="8" style="text-align: center;font-size: 18px;font-weight:bold;">
              <!--<span>人员信息</span>-->
              <span>{{IDCardNote}}</span> <a v-if="showDriveDownload" href="http://yun.zhuzhu.biz:8081/jpro/static/ZKIDROnline.exe" style="text-decoration:none;">点击下载</a>
            </el-col>
            <el-col :span="8" style="text-align: center;">
              <button style="background-color: rgba(92,154,212,1);color:white;width: 76px;height: 24px;" @click="uploadByType('photo')">上传照片</button>
              <button style="background-color: rgba(92,154,212,1);color:white;width: 76px;height: 24px;margin-left: 10px;">点击拍照</button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <!--左侧-->
          <el-row>
            <el-col :span="8" style="text-align: left;">
              <img :src="IdCardImg" width="200" height="160"/>
            </el-col>
            <!--中部-->
            <el-col :span="8" style="text-align: left;">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  姓名
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" :disabled="true" size="mini" v-model="memberDialogForm.member.memberName" maxlength="50"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  民族
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" :disabled="true"  v-model="memberDialogForm.member.memberNation" maxlength="10"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  证件类型
                </el-col>
                <el-col :span="16">
                  <el-select v-model="memberDialogForm.member.memberCardType" disabled  placeholder="身份证" style="color: black;padding-left: 10px;">
                    <el-option
                      v-for="item in [
                                        {label:'身份证',value:'1'},
                                        {label:'军官证',value:'2'},
                                        {label:'护照',value:'3'},
                                        {label:'台湾居民身份证',value:'4'},
                                        {label:'香港永久性居民身份证',value:'5'},
                                        {label:'警官证',value:'6'},
                                        {label:'其他',value:'9'}
                                      ]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  证件编号
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" :disabled="true"  v-model="memberDialogForm.member.memberCardNum" maxlength="30"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <!--右侧-->
            <el-col :span="8" style="text-align: center;">
              <!--<img v-show="showPhotoType!='photo'" :src="PhotoImg" width="200" height="160"/>-->
              <!--<img v-show="showPhotoType=='IdCardPhoto '" :src="userPhoto" width="200" height="160"/>-->

              <img v-if="showPhotoType!='IdCardPhoto'" :src="PhotoImg" width="200" height="160"/>
              <img v-if="showPhotoType=='IdCardPhoto'" :src="userPhoto" width="200" height="160"/>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  考勤卡号
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="memberDialogForm.member.signCardNum" maxlength="20" size="mini"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  刷卡时间
                </el-col>
                <el-col :span="16">
                  <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    size="small"
                    v-model="memberDialogForm.member.tttt"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-col>
            <!---->
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  出生年月
                </el-col>
                <el-col :span="16">
                  <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    size="small"
                    :disabled="true"
                    v-model="memberDialogForm.member.memberBirthday"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  有效日期
                </el-col>
                <el-col :span="16">
                  <el-col :span="16">
                    <el-date-picker
                      type="date"
                      v-model="memberDialogForm.member.memberCardBeginDate"
                      :disabled="true"
                      value-format="yyyy-MM-dd"
                      size="small"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-col>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  签发机构
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" :disabled="true" maxlength="50" v-model="memberDialogForm.member.memberCardPublish"></el-input>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  至
                </el-col>
                <el-col :span="16">
                  <el-col :span="16">
                    <el-date-picker
                      type="date"
                      v-model="memberDialogForm.member.memberCardEndDate"
                      :disabled="true"
                      value-format="yyyy-MM-dd"
                      size="small"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-col>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 12px;color:black;">
                  工资银行卡号
                </el-col>
                <el-col :span="16" style="display: flex;">
                  <el-input style="margin-left: auto;" autocomplete="off" size="mini" maxlength="30"  v-model="memberDialogForm.member.bankCardNum"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="16">
              <el-row>
                <el-col :span="3" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  地址
                </el-col>
                <el-col :span="20" style="text-align:left;display: flex;">
                  <el-input autocomplete="off" size="mini" style="margin-right: auto;" maxlength="200" :disabled="true" v-model="memberDialogForm.member.memberAdress"></el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  银行名称
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" maxlength="50" v-model="memberDialogForm.member.brathBankCardName"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  总行名称
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" maxlength="50" v-model="memberDialogForm.member.bankCardName"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <!---->
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  手机号码
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" v-model="memberDialogForm.member.memberPhone"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  工人类型
                </el-col>
                <el-col :span="16">
                  <el-select v-model="memberDialogForm.member.memberWorkType" placeholder="全部">
                    <el-option
                      v-for="item in [
                          {label:'管理人员',value:'10'},
                          {label:'建筑工人',value:'20'}
                        ]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  工种
                </el-col>
                <el-col :span="16">
                  <el-select v-model="memberDialogForm.member.memberWorkRRole" placeholder="请选择">
                    <el-option
                      v-for="item in [{label:'砌筑工',value:'10'},{label:'钢筋工',value:'20'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  是否组长
                </el-col>
                <el-col :span="16" style="text-align: left;">
                  <el-radio-group  v-model="memberDialogForm.member.isTeamLeader">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <div style="display: flex;">
          <button style="background-color: rgba(92,154,212,1);color:white;margin-left: auto;margin-right: 10px;width: 60px;height: 28px;"
                  @click="cancelMemberDialogForm">取 消
          </button>
          <button style="background-color: rgba(92,154,212,1);color:white;margin-left:10px;width: 60px;height: 28px;"
                  @click="confirmMemberDialogForm">确 定
          </button>
        </div>
      </el-form>
    </el-dialog>

    <!--删除提醒-->
    <el-dialog
      title="提示"
      :visible.sync="delDialog.visible"
      width="30%">
      <span>确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog.visible = false" >取 消</el-button>
        <el-button type="primary" @click="delConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!--上传附件-->
    <el-dialog
      :title="uploadDialog.title"
      :visible.sync="uploadDialog.visible"
      width="30%">
      <div>
        <uploading ref="uploadFile" :config="uploadIDcardConfig">
          <button>上传</button>
        </uploading>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialog.visible = false" >取 消</el-button>
        <el-button type="primary" @click="uploadConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import uploading from '../common/uploading.vue'

  export default {
    components: {
      uploading,//上传
    },

    data () {
      return {
        workdata:[],
        IdCardImg:require('../../assets/dataImg/direct.gif'),
        PhotoImg:require('../../assets/dataImg/userPhoto.png'),
        userPhoto:'',
        IdCardFilesList:[],
        PhotoFilesList:[],
        IDCardNote:'',//驱动提醒和指引
        showDriveDownload:false,
        showPhotoType:'',//photo、IdCardPhoto

        uploadIDcardConfig:{
          limit:1,//限制附件上传个数
          limitSize:52428800,//50mb单个附件上传大小
          readOnly:false,//是否只读
          multiple: false,//是否允许多选
          xtype:'Idcard',//同一个表单区别多个附件上传块
          accept:'.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP',//允许上传文件类型
          acceptMsg:'只能传图片',//提示信息
        },
        uploadPhotoConfig:{
          limit:1,//限制附件上传个数
          limitSize:52428800,//50mb单个附件上传大小
          readOnly:false,//是否只读
          multiple: false,//是否允许多选
          xtype:'photo',//同一个表单区别多个附件上传块
          accept:'.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP',//允许上传文件类型
          acceptMsg:'只能传图片',//提示信息
        },

        enterStatus:'',//1:进场，2：退场
        selectedTeamId:'',
        fileList2: [
          // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        ],
        delDialog: {
          visible: false,
          type: '',//team、member
          delId: '',
        },
        uploadDialog: {
          visible: false,
          type: '',//IdCard：身份证、photo:头像
          title:'',
          delId: '',
        },
        teamDialogForm: {//编辑浮窗
          visible: false,//是否显示浮窗
          title: '',
          editType: '',//add、edit、
          editId: '',

          team: {
            teamName: '',//班组名称
            teamSysNo: '',//班组编号
            corpCode: '',//班组所在企业统一社会信用代码
            corpName: '',//班组所在企业名称
            teamLeaderName: '',//班组长姓名
            teamLeaderPhone: '',//班组长联系电话
            teamLeaderIdcardType: '1',//班组长证件类型
            teamLeaderIdnumber: '',//班组长证件号码
            responsiblePersonName: '',//责任人姓名
            responsiblePersonPhone: '',//责任人联系电话
            responsiblepersonIdcardType: '1',//责任人证件类型
            responsiblePersonIdnumber: '',//责任人证件号码
            remark: '',//备注
            entryTime: '',//进场日期
            exitTime: '',//退场日期
            sort: '',//排序号
          },
        },
        memberDialogForm: {//编辑浮窗
          visible: false,//是否显示浮窗
          title: '',
          editType: '',//add、edit、
          editId: '',

          member: {
            teamMemberId:'',//关联ID
            signCardNum:'',//考勤卡号
            entryTime:'',//考勤时间
            exitTime:'',//考勤时间
            bankCardNum:'',//工资银行卡卡号
            brathBankCardName:'',//银行名称
            bankCardName:'',//总行名称

            memberName:'',//姓名
            memberCardType:'1',//证件类型
            memberCardNum:'',//证件编号
            memberNation:'',//民族
            memberBirthday:'',//出生年月
            memberCardPublish:'',//签发机构
            memberAdress:'',//地址
            memberPhone:'',//手机号码
            memberWorkType:'',//工人类型

            memberCardEndDate:'',//有效日期
            memberCardBeginDate:'',//有效日期
            memberWorkRRole:'',//工种
            isTeamLeader:'0',//是否组长
          },
        },
        teamData: [],
        teamPage: {
          pageSize: 10,
          totalCount: 0,
          pageNum: 1,
        },
        memberPage: {
          pageSize: 10,
          totalCount: 0,
          pageNum: 1,
        },
        memberData: [],
        multipleSelection: [],//勾选的数据
        multipleSelectedKey: 'workderId',//勾选数据的识别字段，一般为ID
        multipleSelectedKey2: 'teamWorkerId',//勾选数据的识别字段，一般为ID
        multipleSelectedKey3: 'workername',//勾选数据的识别字段，一般为ID
        multipleSelectedIDS: '',//勾选数据的识别字段，以,拼接
        multipleSelectedIDS2: '',//勾选数据的识别字段，以,拼接
        multipleSelectedIDS3: '',//勾选数据的识别字段，以,拼接

        timer:null,
      }

    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      // var _this=this;

      // this.timer = setInterval(function(){
      //   _this.util.getByUrl('http://127.0.0.1:24010/ZKIDROnline/info',null,(res) => {//循环检查是否已经启动服务
      //     if( res.readyState!=undefined){//未启动服务
      //       if (res.readyState=='0'){
      //         _this.IDCardNote='缺少驱动，请先下载：'
      //         _this.showDriveDownload=true;
      //       }
      //     }else if(res.data!=null && res.ret!=null){//已启动服务
      //       _this.IDCardNote='请将身份证放置在身份证读卡器上，然后点击“读取身份证”进行读取。';
      //       _this.showDriveDownload=false;
      //       clearInterval(_this.timer);
      //     }
      //   })
      // },1000);
    },
    mounted () {
      this.loadTeamData();
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.loadTeamData();
      }
    },
    methods: {
      strue(){
        console.log(this.workdata)
        this.$emit('close',this.workdata)
      },
      strueclose(){
        this.$emit('closemask')
      },
      getDic(){
        var dicParams ={
          companyUid:this.sessionUtil.getCompanyUid(),
        }
        var _this= this;
        // _this.util.post('/sys/dic/findAllDic?companyUid='+this.cookieUtil.getSession().data.user.company+'&access_token='+this.cookieUtil.getSession().access_token,null,(res)=>{
        //   console.log(res.data)
        this.util.getAllDic();
        // })
        // console.log(this.util.companyDic)
        // console.log(this.util.getDicByDicId('PROJ_STATUS'));
      },
      getIdCardInfo(){
        var _this=this;
        _this.util.mask()
        _this.util.getByUrl('http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1&READTYPE=1',null,(res) => {//获取信息
          if (res.responseText===undefined){
            _this.util.error('读取失败，请重试')
            _this.util.unmask()
            return;
          }

          var IdCardInfoString = res.responseText.replace(/"CardType": "/g, ',"CardType": "');//格式化 "fp_feature2":"Base64 String"  //第二个登记手指指纹特征
          IdCardInfoString = IdCardInfoString.replace(/\\/g, '/');  //格式化    "PhotoName": "(null)",
          var IdCardInfo = JSON.parse(IdCardInfoString)

          _this.memberDialogForm.member.memberName = IdCardInfo.Certificate.Name;//姓名
          _this.memberDialogForm.member.memberSex = IdCardInfo.Certificate.Sex;//性别
          _this.memberDialogForm.member.memberNation = IdCardInfo.Certificate.Nation;//民族
          _this.memberDialogForm.member.memberBirthday = IdCardInfo.Certificate.Birthday;//出生年月
          _this.memberDialogForm.member.memberCardEndDate = IdCardInfo.Certificate.ValidDate;//签发日期
          _this.memberDialogForm.member.memberCardBeginDate = IdCardInfo.Certificate.IssuedData;//有效截止日期
          _this.memberDialogForm.member.memberAdress = IdCardInfo.Certificate.Address;
          _this.memberDialogForm.member.memberCardPublish = IdCardInfo.Certificate.IDIssued;
          _this.memberDialogForm.member.memberCardNum = IdCardInfo.Certificate.IDNumber;//证件编号
          _this.memberDialogForm.member.PhotoImg= 'data:image/png;base64,'+IdCardInfo.Certificate.Base64Photo;//身份证头像地址(base64)
          _this.memberDialogForm.member.PhotoBase64= IdCardInfo.Certificate.Base64Photo;//身份证头像地址(base64)
          _this.userPhoto= 'data:image/png;base64,'+IdCardInfo.Certificate.Base64Photo;//身份证头像地址(base64)
          _this.memberDialogForm.member.memberCardType = '1';//身份证
          if(IdCardInfo.Certificate.Base64Photo.length>5){
            _this.showPhotoType='IdCardPhoto';
          }
          _this.util.unmask()
        });
      },
      uploadByType(uploadType){
        this.uploadDialog.visible=true;
        this.uploadDialog.type=uploadType;
        if (uploadType=='photo'){
          this.showPhotoType='photo';
        }
        this.upla
        this.uploadDialog.title = this.uploadDialog.type=='IdCard'?'上传身份证':'上传头像';
      },
      uploadConfirm(){
        //新增附件
        var filesList = this.uploadIDcardConfig.filesList;
        if (filesList.length==0){
          return;
        }
        var id =this.uploadIDcardConfig.filesList[0].id;
        var suffix =this.uploadIDcardConfig.filesList[0].suffix;
        var fileName =this.uploadIDcardConfig.filesList[0].fileName;
        var imgUrl = this.util.getBaseUrl() + "/api_v1/files/temp/" + id+ "/look?ifThumb=true&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + id + "&suffix=" + suffix + "&fileName=" + encodeURIComponent(fileName);
        if (this.uploadDialog.type=='IdCard') {
          this.IdCardImg = imgUrl;
          this.IdCardFilesList=filesList;
        }else{
          this.PhotoImg = imgUrl;
          this.PhotoFilesList=filesList;
        }
        this.uploadDialog.visible=false;
        this.uploadIDcardConfig.filesList=[];

        this.$nextTick(()=>{
          this.$refs.uploadFile.clearArr()
        })
      },
      delSelectedMembers(){
        var _this=this;
        var params={
          memberIds:this.multipleSelectedIDS+',',
          teamMemberIds:this.multipleSelectedIDS2+',',
          names:this.multipleSelectedIDS3+',',
          teamId:this.selectedTeamId,
        }
        params.company = this.sessionUtil.getCompanyUid(),
          params.projUid = this.$store.state.selectProjectObj.id;
        params.info = JSON.stringify(params);
        this.util.restDelete('/api_v1/modules/workers/' + this.multipleSelectedIDS, params, (res) => {
          if (res.status == 200) {
            _this.loadMembetData();
          } else {
            _this.util.error(res.errorMsg)
          }
        })
      },
      changeEnterStatus(value){
        this.enterStatus = value;
        this.loadMembetData();
      },
      cancelTeamDialogForm () {
        this.teamDialogForm = {//编辑浮窗
          visible: false,//是否显示浮窗
          title: '',
          editType: '',//add、edit、
          team: {

          },
        }

      },
      cancelMemberDialogForm () {
        this.$nextTick(()=>{
          this.IdCardImg=require('../../assets/dataImg/direct.gif'),
            this.PhotoImg=require('../../assets/dataImg/userPhoto.png')
        })
        this.userPhoto='';
        this.memberDialogForm = {//编辑浮窗
          visible: false,//是否显示浮窗
          title: '',
          editType: '',//add、edit、
          member: {
            teamMemberId:'',//关联ID
            signCardNum:'',//考勤卡号
            entryTime:'',//考勤时间
            exitTime:'',//考勤时间
            bankCardNum:'',//工资银行卡卡号
            brathBankCardName:'',//银行名称
            bankCardName:'',//总行名称

            memberName:'',//姓名
            memberCardType:'1',//证件类型
            memberCardNum:'',//证件编号
            memberNation:'',//民族
            memberBirthday:'',//出生年月
            memberCardPublish:'',//签发机构
            memberAdress:'',//地址
            memberPhone:'',//手机号码
            memberWorkType:'',//工人类型

            memberCardEndDate:'',//有效日期
            memberCardBeginDate:'',//有效日期
            memberWorkRRole:'',//工种
            isTeamLeader:'0',//是否组长
          },
        }
      },
      confirmTeamDialogForm () {//班组浮窗确认
        var params = this.teamDialogForm.team;
        this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
        if (this.teamDialogForm.editType === 'add') {
          params.projectCode = this.$store.state.selectProjectObj.principalId;
          params.projUid = this.$store.state.selectProjectObj.id;
          params.corpUid = this.$store.state.selectProjectObj.id;
          params.company = this.sessionUtil.getCompanyUid();
          params.corpUid = this.sessionUtil.getCompanyUid();
          params.responsiblepersonIdcardType = '1';//身份证
          var _this=this;
          if (this.util.filterNone(params.teamName)=='') {
            this.util.error('班组名称不能为空')
            return;
          }
          this.util.mask();
          this.util.restPost('/api_v1/modules/teams', params, (res) => {
            if (res.status == 200) {
              _this.loadTeamData();
              _this.util.success('新增成功')
              _this.cancelTeamDialogForm()
              // this.loadTeamData();
              _this.util.unmask();
            } else {
              _this.util.error(res.errorMsg)
              _this.util.unmask();
            }
          })
        } else if (this.teamDialogForm.editType === 'edit') {
          var _this=this;
          this.util.mask();
          this.util.restPut('/api_v1/modules/teams/' + this.teamDialogForm.editId, params, (res) => {
            if (res.status == 200) {
              _this.loadTeamData()
              _this.cancelTeamDialogForm()
              _this.util.unmask();
            } else {
              _this.util.error(res.errorMsg)
              _this.util.unmask();
            }
          })
        }

      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      confirmMemberDialogForm () {//人员浮窗确认
        var _this=this;
        var params = this.memberDialogForm.member;
        var filesList = this.uploadIDcardConfig.filesList;
        params.filesList=filesList;
        this.util.mask();

        if (this.memberDialogForm.editType === 'add') {
          params.teamUid = this.selectedTeamId;
          params.IdCardFilesList = this.IdCardFilesList;
          params.PhotoFilesList = this.PhotoFilesList;
          params.projUid = this.$store.state.selectProjectObj.id;
          params.cardType=params.cardType;
          params.cardNum=params.cardNum;
          params.memberSex=params.memberSex=='男'?0:1;//0，男；1，女

          params.company = this.sessionUtil.getCompanyUid(),
          params.info=JSON.stringify(params);

          this.util.restPost('/api_v1/modules/workers', params, (res) => {
            if (res.status == 200) {
              _this.loadMembetData();
              _this.util.success('新增成功');
              _this.cancelMemberDialogForm();
              _this.util.unmask();
            } else {
              _this.util.error(res.errorMsg);
              _this.util.unmask();
            }
          })
        }
        else if (this.memberDialogForm.editType === 'edit') {
          params.IdCardFilesList = this.IdCardFilesList;
          params.PhotoFilesList = this.PhotoFilesList;
          _this.util.mask();
          params.memberSex=params.memberSex=='男'?0:1;//0，男；1，女
          if (params.back_IdCardFilesList==params.IdCardFilesList) {//没有更新身份证
            delete params['IdCardFilesList'];
          }
          if (params.back_PhotoFilesList==params.PhotoFilesList) {//没有更新头像
            delete params['PhotoFilesList'];
          }
          if (params.back_IDCardPhotoList==params.IDCardPhotoList) {//没有更新身份证头像至头像
            delete params['IDCardPhotoList'];
          }
          params.info=JSON.stringify(params);
          this.util.restPut('/api_v1/modules/workers/' + this.memberDialogForm.editId, params, (res) => {
            if (res.status == 200) {
              _this.loadMembetData();
              _this.util.success('修改成功')
              _this.cancelMemberDialogForm();
              _this.util.unmask();
            } else {
              _this.util.error(res.errorMsg)
              _this.util.unmask();
            }
          })
        }
      },
      delConfirm () {
        var delId = this.delDialog.delId;
        var _this=this;
        _this.util.mask();
        if (this.delDialog.type === 'team') {
          this.util.restDelete('/api_v1/modules/teams/' + delId, null, (res) => {
            if (res.status == 200) {
              _this.delDialog.visible = false;
              _this.util.success('删除成功')
              _this.loadTeamData()
              _this.util.unmask();
            } else {
              _this.util.error(res.errorMsg)
              _this.util.unmask();
              _this.delDialog.visible = false
            }
          })
        } else if (this.delDialog.type === 'member') {
          
          var params={
            memberIds:this.multipleSelectedIDS+',',
            teamMemberIds:this.multipleSelectedIDS2+',',
            names:this.multipleSelectedIDS3+',',
            teamId:this.selectedTeamId,
          }
          params.company =  this.sessionUtil.getCompanyUid(),
            params.projUid = this.$store.state.selectProjectObj.id;
          params.info = JSON.stringify(params);
          _this.util.mask();
          this.util.restDelete('/api_v1/modules/workers/' + delId, params, (res) => {
            if (res.status == 200) {
              _this.delDialog.visible = false;
              _this.loadMembetData();
              _this.util.unmask();
            } else {
              _this.util.error(res.errorMsg)
              _this.util.unmask();
            }
          })

        }
      },
      teamRowClick (row) {
        console.log(row)
        this.selectedTeamId = row.id;
        this.loadMembetData()
      },
      changeTeamPageSize (pageSize) {
        this.teamPage.pageSize = pageSize
        this.loadTeamData()
      },
      changeTeamPageNum (pageNum) {
        this.teamPage.pageNum = pageNum
        this.loadTeamData()
      },
      changememberPageSize (pageSize) {
        this.memberPage.pageSize = pageSize
        this.loadMembetData()
      },
      changememberPageNum (pageNum) {
        this.memberPage.pageNum = pageNum
        this.loadMembetData()
      },
      handleClose (done) {//关闭浮窗提醒,防止误操作
        this.$confirm('确认不保存，直接关闭？')
          .then(_ => {
            this.cancelMemberDialogForm();
            this.cancelTeamDialogForm();
            done()
          })
          .catch(_ => {
          })
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
      },
      addTeam () {
        this.teamDialogForm.editType = 'add'
        this.teamDialogForm.editType = 'add'
        this.teamDialogForm.visible = true
        this.teamDialogForm.title = '新建班组'
        // this.teamDialogForm.team=null;
        // this.PhotoFilesList=null;
      },
      editTeam (row) {
        var _this=this;
        this.tes=this.util.cardTypeList;
        this.util.restGet('/api_v1/modules/teams/' + row.id, null, (res) => {//获取班组详情
          if (res.status == 200) {
            // _this.teamDialogForm.team.responsiblepersonIdcardType = _this.exchangeKeyAndValue(res.data.responsiblepersonIdcardType,'value',_this.util.cardTypeList);
            // for (var i in _this.util.cardTypeList){
            //   console.log(res.data.responsiblepersonIdcardType.valueOf().trim()==_this.util.cardTypeList[i].value.valueOf())
            //   if (res.data.responsiblepersonIdcardType==_this.util.cardTypeList[i].value){
            //     console.log(_this.util.cardTypeList[i].key)
            //     _this.teamDialogForm.team.responsiblepersonIdcardType = _this.util.cardTypeList[i].key;
            //   }
            // }
            res.data.entryTime = res.data.entryTime==undefined?'':new Date(res.data.entryTime);
            res.data.exitTime = res.data.exitTime==undefined?'':new Date(res.data.exitTime);
            _this.teamDialogForm.team = res.data;
            // _this.teamDialogForm.team.responsiblepersonIdcardType= _this.teamDialogForm.team.responsiblepersonIdcardType.toString().trim();
            // _this.teamDialogForm.team.teamLeaderIdcardType= _this.teamDialogForm.team.teamLeaderIdcardType.toString().trim();

            _this.teamDialogForm.editType = 'edit'
            _this.teamDialogForm.visible = true
            _this.teamDialogForm.title = '编辑班组'
            _this.teamDialogForm.editId = row.id
          } else {
            _this.util.error(res.errorMsg)
            _this.cancelTeamDialogForm()
          }
        })
      },
      delTeam (row) {
        this.delDialog.visible = true
        this.delDialog.type = 'team'
        this.delDialog.delId = row.id
      },

      addMember () {
        this.memberDialogForm.editType = 'add'
        this.memberDialogForm.visible = true
        this.memberDialogForm.title = '新建人员'
      },
      editMember (row) {
        this.memberDialogForm.editId = row.teamWorkerId;
        var _this=this;
        this.util.restGet('/api_v1/modules/workers/'+this.memberDialogForm.editId , null, (res) => {//获取人员详情
          if (res.status == 200) {
            console.log(res)
            _this.memberDialogForm.member = res.data;
            _this.memberDialogForm.member.memberBirthday = new Date(_this.memberDialogForm.member.memberBirthday);
            _this.memberDialogForm.member.memberCardBeginDate = new Date(_this.memberDialogForm.member.memberCardBeginDate);
            _this.memberDialogForm.member.memberCardEndDate = new Date(_this.memberDialogForm.member.memberCardEndDate);
            _this.memberDialogForm.member.memberCardType =_this.memberDialogForm.member.memberCardType===undefined?'':_this.memberDialogForm.member.memberCardType.toString().trim();

            _this.memberDialogForm.member.memberWorkRRole =_this.memberDialogForm.member.memberWorkRRole===undefined?'':_this.memberDialogForm.member.memberWorkRRole.toString().trim();
            _this.memberDialogForm.member.memberWorkType =_this.memberDialogForm.member.memberWorkType===undefined?'':_this.memberDialogForm.member.memberWorkType.toString().trim();
            _this.memberDialogForm.member.photoList =_this.memberDialogForm.member.photoList===undefined?[]:_this.memberDialogForm.member.photoList;//身份证
            _this.memberDialogForm.member.back_photoList=_this.memberDialogForm.member.photoList;
            var photoDate = null;
            if (_this.memberDialogForm.member.photoList.length>0){//上传的头像
              var item=_this.memberDialogForm.member.photoList[_this.memberDialogForm.member.photoList.length-1];
              photoDate = new Date(item.createTime);
              _this.PhotoImg = this.util.getBaseUrl() + "/api_v1/files/" + item.id+ "/look?ifThumb=true&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + item.id + "&suffix=" + item.suffix + "&fileName=" + encodeURIComponent(item.fileName);
            }

            _this.memberDialogForm.member.IdCardList =_this.memberDialogForm.member.IdCardList===undefined?[]:_this.memberDialogForm.member.IdCardList;//头像
            _this.memberDialogForm.member.back_IdCardList=_this.memberDialogForm.member.IdCardList;
            if (_this.memberDialogForm.member.IdCardList.length>0){//上传的身份证照片
              var item=_this.memberDialogForm.member.IdCardList[_this.memberDialogForm.member.IdCardList.length-1];

              _this.IdCardImg= _this.util.getBaseUrl() + "/api_v1/files/" + item.id+ "/look?ifThumb=true&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + item.id + "&suffix=" + item.suffix + "&fileName=" + encodeURIComponent(item.fileName);
            }


            _this.memberDialogForm.member.IDCardPhotoList =_this.memberDialogForm.member.IDCardPhotoList===undefined?[]:_this.memberDialogForm.member.IDCardPhotoList;//身份证头像
            _this.memberDialogForm.member.back_IDCardPhotoList=_this.memberDialogForm.member.IDCardPhotoList;
            var userPhotoDate = null;
            if (_this.memberDialogForm.member.IDCardPhotoList.length>0){//身份证上的头像
              var item=_this.memberDialogForm.member.IDCardPhotoList[_this.memberDialogForm.member.IDCardPhotoList.length-1];
              userPhotoDate = new Date(item.createTime);
              _this.userPhoto= this.util.getBaseUrl() + "/api_v1/files/" + item.id+ "/look?ifThumb=true&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + item.id + "&suffix=" + item.suffix + "&fileName=" + encodeURIComponent(item.fileName);
            }

            //日期转换时间戳进行对比
            var photoTime = photoDate==null?0:photoDate.getTime();
            var userPhotoTime = userPhotoDate==null?0:userPhotoDate.getTime();
            var differ = photoTime-userPhotoTime;
            if (differ>=0){
              _this.showPhotoType = 'photo';
            } else {
              _this.showPhotoType = 'IdCardPhoto';
            }

            _this.memberDialogForm.editType = 'edit';
            _this.memberDialogForm.visible = true;
            _this.memberDialogForm.title = '修改人员';
          } else {
            this.util.error(res.errorMsg)
          }
        })
      },
      delMember (row) {
        this.delDialog.visible = true
        this.delDialog.type = 'member'
        this.delDialog.delId = row.teamWorkerId;
        this.multipleSelectedIDS=row.workderId;
        this.multipleSelectedIDS2 = row.teamWorkerId;
        this.multipleSelectedIDS3 = row.workername;
      },
      loadMembetData () {
        if(this.selectedTeamId==''){
          this.util.error('请先选择班组')
          return;
        }
        var projectObj =JSON.parse(this.cookieUtil.get('projectNode'));
        var params = {
          projUid:projectObj.id,
          pageSize: this.memberPage.pageSize,
          pageNum: this.memberPage.pageNum,
          team: this.selectedTeamId,
          status: this.enterStatus,
          company:  this.sessionUtil.getCompanyUid(),
        }
        this.util.restGet('/api_v1/modules/workers', params, (res) => {
          if (res.status == 200) {
            this.memberData = res.data
            for (var i in this.memberData) {
              this.memberData[i].entryStatusName = this.memberData[i].entryStatus === '1' ? '进场' : '退场'
              this.memberData[i].hasBuyInsuranceName = this.memberData[i].hasBuyInsurance ? '有' : '无'
              this.memberData[i].workerTypeName = this.memberData[i].workerType;
            }
            this.memberPage.totalCount = res.totalCount===undefined?0:res.totalCount;
          } else {
            this.util.error(res.errorMsg)
          }
        })
      },
      loadTeamData () {
        var params = {
          pageSize: this.teamPage.pageSize,
          pageNum: this.teamPage.pageNum,
          company:  this.sessionUtil.getCompanyUid(),
          projUid: this.$store.state.selectProjectObj.id,
        }

        this.util.restGet('/api_v1/modules/teams', params, (res) => {
          if (res.status == 200) {
            this.teamData = res.data
            this.teamPage.totalCount = res.totalCount===undefined?0:res.totalCount;
            this.memberData = []
          } else {
            // this.util.error(res.errorMsg)
          }
        })
      },
      //勾选记录
      handleSelectionChange (val) {
        this.workdata=val;
        // // console.log(JSON.stringify(val));
        // this.multipleSelection = val;
        //
        // this.multipleSelectedIDS = '';
        // if (this.multipleSelectedKey !== '') {
        //   for (var i in val) {
        //     this.multipleSelectedIDS += val[i][this.multipleSelectedKey] + ','
        //   }
        // }
        // this.multipleSelectedIDS2 = '';
        // if (this.multipleSelectedKey2 !== '') {
        //   for (var i in val) {
        //     this.multipleSelectedIDS2 += val[i][this.multipleSelectedKey2] + ','
        //   }
        // }
        // this.multipleSelectedIDS3 = '';
        // if (this.multipleSelectedKey3 !== '') {
        //   for (var i in val) {
        //     this.multipleSelectedIDS3 += val[i][this.multipleSelectedKey3] + ','
        //   }
        // }
      }
    }
  }
</script>

<style scoped>
  .proj-box {
    width: 100%;
    box-sizing: border-box;
    padding: 0px;
    color: #fff;
    font-size: 14px;
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
    width: 100%;
    /*height:100%;*/
    box-sizing: border-box;
  }
  .mun-box_left{
    float: left;
    width:320px;
    /*height:100%;*/
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    padding:13px 14px 13px 14px;
    box-sizing: border-box;
    overflow: auto;
  }
  .mun-box_right{
    overflow: hidden;
    /*height:100%;*/
    padding-left: 10px;
    box-sizing: border-box;
  }
  .mun-box_right-box{
    width:100%;
    /*height:100%;*/
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    padding:13px 14px;
    box-sizing: border-box;
    overflow: auto;
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
    height: 32px;
    font-size: 14px;
    width: 100%;
    height: 100%;
    padding: 0;
  }

  .select-mouth .el-select .el-input .el-select__caret {
    color: #fff;
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

  .formsssss .el-dialog {
    color:black;
  }

  .formsssss .el-pager li {
    background-color: transparent;
  }

  .formsssss .el-dialog__title {
    line-height: 24px;
    font-size: 18px;
  }

  .formsssss .el-form-item__content {
    line-height: 20px;
    position: relative;
    font-size: 14px;
  }
  .jrjy .el-form-item  {
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
    color: rgba(51,51,51,1);
  }
  .jrjy .el-table td,.jrjy .el-table th {
    padding: 12px 0;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: center;
  }
  .numberselect .bg .el-table--border,.numberselect .bg .el-table--group,.numberselect .bg .el-table td,.numberselect .bg .el-table th.is-leaf{
    border-color:#ccc !important;
  }
  .numberselect  .el-table,.numberselect .el-table thead{
    color:#333 !important;
  }
 .numberselect .el-table--border th{
   color:#333 !important;
 }
 .numberselect .el-table__row td{
   color:#333 !important;
 }
 .numberselect .el-table--border td:first-child .cell,.pagein .el-table--border th:first-child .cell,.pagein .el-table .cell,.pagein .el-table th div{
   padding-left:0 !important;
   padding-right:0 !important;
 }
  .pagein .el-pagination--small .el-pagination__editor,.pagein .el-pagination--small .el-pagination__editor.el-input .el-input__inner{
    color:#000 !important;
  }
  .numberselect .highlight-current-row.el-table--enable-row-hover .el-table__body tr:hover>td{
    background: #ccc;
  }
  .numberselect .el-checkbox__inner:after{
    border-color:#000 !important;
  }
</style>
