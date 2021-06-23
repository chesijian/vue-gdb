<template>
  <div class="proj-box box_index">
    <div class="num-box">
          <div class="mun-box_left" style="padding-bottom: 67px;box-sizing: border-box">
            <div style="width:100%;position: relative">
              <div style="position: absolute;width:100%;">
                <el-row >
                  <el-col :span="6">
                    <h4>班组</h4>
                  </el-col>
                  <el-col :span="14">
                    &nbsp;
                  </el-col>
                  <el-col :span="2">
                    <button style="width: 48px;height: 26px;" @click="addTeam" v-if="sessionUtil.isAllowBtn('gc7_1:btn_add_team')">添加</button>
                  </el-col>
                </el-row>
              </div>
            </div>

              <div ref="tablebox" style="height:100%;padding-top: 36px;box-sizing: border-box;">
                <div>
                  <el-table
                    :data="teamData" :height="tableHeightNum" border class="highlight-current-row" highlight-current-row @current-change="teamRowClick">
                    <el-table-column prop="" label="操作" width="70" v-if="sessionUtil.isAllowBtn('gc7_1:btn_edit_team')||sessionUtil.isAllowBtn('gc7_1:btn_delete_team')">
                      <template slot-scope="scope">
                    <span>
                      <i style="color: rgba(68,210,255,1);font-size:16px;" class="el-icon-edit" v-if="sessionUtil.isAllowBtn('gc7_1:btn_edit_team')" @click.stop="editTeam(scope.row)"></i>
                      <i style="color: rgba(68,210,255,1);font-size:16px;" class="el-icon-delete" v-if="sessionUtil.isAllowBtn('gc7_1:btn_delete_team')" @click.stop="delTeam(scope.row)"></i>
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
            <div class="mun-box_right-box" style="padding-bottom: 74px;box-sizing: border-box">

              <div style="width:100%;position: relative">
                <div class="" style="float:left;">
                  <div class="tabs" style="border:none;">
                    <span :class="{active:enterStatus===''}" @click="changeEnterStatus('')">全部</span>
                    <span  :class="{active:enterStatus==='1'}" @click="changeEnterStatus('1')">进场</span>
                    <span  :class="{active:enterStatus==='2'}" @click="changeEnterStatus('2')">退场</span>
                  </div>
                </div>
                <div style="float:right;">
                	<button  @click="dialogFormVisible = true">推送平台</button>
                  <button @click="btnPushEquipment" v-if="sessionUtil.isAllowBtn('gc7_1:btn_push')">推送到设备</button>
                  <button @click="uploadDeviceInformation()">上传设备绑定信息</button>
                  <button v-if="sessionUtil.isAllowBtn('gc7_1:btn_add')" @click="addMember()"> 添加</button>
                  <button v-if="sessionUtil.isAllowBtn('gc7_1:btn_delete')"
                    @click="delSelectedMembers()">
                    删除
                  </button>
                  
                </div>
              </div>
              <div ref="tablebox" style="height:100%;padding-top: 40px;box-sizing: border-box;">
                <el-table :data="memberData" border
                  @selection-change="handleSelectionChange" :height="tableHeightNum">
                  <el-table-column type="selection" label="选择" width="40"></el-table-column>
                  <el-table-column prop="" label="操作"
                    width="70" v-if="sessionUtil.isAllowBtn('gc7_1:btn_delete')||sessionUtil.isAllowBtn('gc7_1:btn_edit')">
                    <template slot-scope="scope">
                    <span>
                      <i style="color: rgba(68,210,255,1);font-size:16px;" class="el-icon-edit" v-if="sessionUtil.isAllowBtn('gc7_1:btn_edit')"
                         @click="editMember(scope.row)"></i>
                      <i style="color: rgba(68,210,255,1);font-size:16px;;" class="el-icon-delete" v-if="sessionUtil.isAllowBtn('gc7_1:btn_delete')" @click="delMember(scope.row)"></i>
                    </span>
                    </template>
                  </el-table-column>

                  <el-table-column  prop="entryStatusName"  width="60"
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
                    width="100"
                    label="姓名">
                  </el-table-column>
                  <el-table-column
                    prop="workerPhone"
                    width="110"
                    label="手机号码">
                  </el-table-column>
                  <el-table-column
                    prop="workerCreadNum"
                    width="200"
                    label="身份证号码">
                  </el-table-column>
                  <el-table-column
                    prop="workerTypeName"
                    width="100"
                    label="工种">
                  </el-table-column>
                  <el-table-column
                    prop="signCardNum"
                    label="考勤卡号">
                  </el-table-column>
                  <el-table-column
                    prop="hasContractName"
                    width="50"
                    label="有无合同">
                  </el-table-column>
                  <el-table-column
                    width="50"
                    prop="hasBuyInsuranceName"
                    label="有无保险">
                  </el-table-column>
                  <el-table-column
                    prop="isTeamLeaderName"
                    width="50"
                    label="是否组长">
                  </el-table-column>
                </el-table>
                <el-pagination
                  @size-change="changememberPageSize($event)"
                  @current-change="changememberPageNum($event)"
                  :current-page="memberPage.pageNum"
                  :page-sizes="[10, 25, 50, 100]"
                  :page-size="memberPage.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="memberPage.totalCount">
                </el-pagination>
              </div>

            </div>
          </div>
    </div>

    <!--班组-浮窗-->
    <el-dialog :visible.sync="teamDialogForm.visible" :title="teamDialogForm.title" center
               :before-close="handleClose" width="900px"
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
                  班组编号<i style="color: red;">*</i>
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
                  企业社会代码<i style="color: red;">*</i>
                </el-col>
                <el-col :span="16">
                  <!--<el-input autocomplete="off"  v-model="teamDialogForm.team.creditCode" size="mini" maxlength="18"></el-input>-->
                  <el-input autocomplete="off" disabled  v-model="buildCode" size="mini" maxlength="18"></el-input>
                  
                </el-col>
              </el-row>
            </el-col>
            <!--右侧-->
            <el-col :span="12" style="text-align: left;">
              <el-row>
                <el-col :span="8" style="text-align: center;white-space:nowrap;font-size: 14px;color: black;">
                  企业名称<i style="color: red;">*</i>
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
                  班组长姓名<i style="color: red;">*</i>
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
                  联系电话<i style="color: red;">*</i>
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
                  班组长证件类型<i style="color: red;">*</i>
                </el-col>
              
                  <el-col :span="16" style="text-align: left;white-space:nowrap;display: flex;">
                  <el-select ref="responsiblepersonIdcardType" v-model="teamDialogForm.team.teamLeaderIdcardType" size="mini" style="width:100%;margin-right: auto;"
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
        <!--line 5-->
        <el-form-item>
          <el-row>
            <el-col :span="24" style="text-align: left;">
              <el-row>
                <el-col :span="4" style="text-align: left;white-space:nowrap;font-size: 14px;color: black;">
                  班组长证件号码<i style="color: red;">*</i>
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
                  责任人姓名<i style="color: red;">*</i>
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
                  联系电话<i style="color: red;">*</i>
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
                  责任人证件类型<i style="color: red;">*</i>
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
                  责任人证件号码<i style="color: red;">*</i>
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
                  进场日期<i style="color: red;">*</i>
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
                  退场日期<i style="color: red;">*</i>
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

        <el-form-item>
        
        <el-row>
          <el-col :span="12" style="text-align: left;">
            <el-row>
            <el-col :span="8" style="text-align: left;white-space:nowrap;font-size: 14px;">
            进场附件
            </el-col>
            <el-col :span="16" >
              <uploading :config="uploadEnterArenaConfig" ref="uploading" >上传</uploading>
            </el-col>
            </el-row>
          </el-col>

          <el-col :span="12" style="text-align: left;">
            <el-row>
              <el-col :span="8" style="text-align: center;white-space:nowrap;font-size: 14px;">
              退场附件
              </el-col>
              <el-col :span="16" >
                <uploading :config="uploadwalkOffConfig" ref="uploading" >上传</uploading>
              </el-col>
             
            </el-row>
          </el-col>
        </el-row>
        </el-form-item>

        <!-- <el-form-item> -->
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
    <el-dialog class="jrjy"  :visible.sync="memberDialogForm.visible" :title="memberDialogForm.title" center :before-close="handleClose" top="5vh" width="1300px">
      <el-form style="width: 100%;">
        <el-form-item>
          <el-row>
            <el-col :span="8" style="text-align: left;">
              <div style="display: flex;">
                <button style="background-color: rgba(92,154,212,1);color:white;height: 24px;" @click="uploadByType('IdCardIn')">上传正面</button>
                <button style="background-color: rgba(92,154,212,1);color:white;height: 24px;margin-left:10px;" @click="uploadByType('IdCardOut')">上传反面</button>
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
              <!-- <button style="background-color: rgba(92,154,212,1);color:white;width: 76px;height: 24px;margin-left: 10px;" >点击拍照</button> -->
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <!--左侧-->
          <el-row>
            <el-col :span="8" style="text-align: left;">
              <img :src="IdCardInImg" width="180" height="160"/>
              <img :src="IdCardOutImg" width="180" height="160"/>
            </el-col>
            <!--中部-->
            <el-col :span="8" style="text-align: left;">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  姓名<span style="color: red;">*</span>
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off"  size="mini" v-model="memberDialogForm.member.memberName" maxlength="50"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  民族<span style="color: red;">*</span>
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini"  v-model="memberDialogForm.member.memberNation" maxlength="10"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  证件类型<span style="color: red;">*</span>
                </el-col>
                <el-col :span="16">
                  <el-select v-model="memberDialogForm.member.memberCardType"   placeholder="身份证" style="color: black;">
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
                  证件编号<span style="color: red;">*</span>
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini"   v-model="memberDialogForm.member.memberCardNum" maxlength="30"></el-input>
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
                  政治面貌
                </el-col>
                <el-col :span="16">
                  <el-select v-model="memberDialogForm.member.politics" style="color: black;"  @change="(val) => {selectChange(val, 1)}">
                    <el-option style="color: black;padding-left: 10px;"
                      v-for="item in [
                                        {label:'中共党员',value:'270'},
                                        {label:'中共预备党员',value:'271'},
                                        {label:'共青团员',value:'272'},
                                        {label:'民革党员',value:'273'},
                                        {label:'民盟盟员',value:'274'},
                                        {label:'民建会员',value:'275'},
                                        {label:'民进会员',value:'276'},
                                        {label:'农工党党员',value:'277'},
                                        {label:'致公党党员',value:'278'},
                                        {label:'九三学社社员',value:'279'},
                                        {label:'台盟盟员',value:'280'},
                                        {label:'无党派人士',value:'281'},
                                        {label:'群众',value:'282'}
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
                		  文化程度<span style="color: red;">*</span>
                </el-col>
                <el-col :span="16">
                  <el-select v-model="memberDialogForm.member.culture" placeholder="请选择" style="color: black;" @change="(val) => {selectChange(val, 3)}">
                    <el-option style="color: black;padding-left: 10px;"
                      v-for="item in [
                                        {label:'小学',value:'283'},
                                        {label:'初中',value:'284'},
                                        {label:'高中',value:'285'},
                                        {label:'中专',value:'286'},
                                        {label:'大专',value:'287'},
                                        {label:'本科',value:'288'},
                                        {label:'硕士',value:'289'},
                                        {label:'博士',value:'290'},
                                        {label:'其他',value:'291'}
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
                  考勤卡号
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="memberDialogForm.member.signCardNum" maxlength="20" size="mini"></el-input>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 12px;color:black;">
                  工资银行卡号
                </el-col>
                <el-col :span="16" style="display: flex;">
                  <el-input style="margin-left: auto;" autocomplete="off" size="mini" maxlength="30"  v-model="memberDialogForm.member.bankCardNum"></el-input>
                </el-col>
              </el-row>

              <!-- <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  刷卡时间<span style="color: red;">*</span>
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
              </el-row> -->
            </el-col>
            <!---->
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  婚姻状况
                </el-col>
                <el-col :span="16">
                  <el-select v-model="memberDialogForm.member.marriage"  style="color: black;"  @change="(val) => {selectChange(val, 2)}">
                    <el-option
                      v-for="item in [
                                        {label:'未婚',value:'292'},
                                        {label:'已婚',value:'293'},
                                        {label:'离异',value:'294'},
                                        {label:'丧偶',value:'295'}
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
                  紧急联系人
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="memberDialogForm.member.urgentLinkMan" maxlength="20" size="mini"></el-input>
                </el-col>
              </el-row>
              
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  有效日期
                </el-col>
                <el-col :span="16">
                  <el-col :span="16">
                    <el-date-picker
                      class="date"
                      type="date"
                      v-model="memberDialogForm.member.memberCardBeginDate"
                      value-format="yyyy-MM-dd"
                      size="small"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  出生年月<span style="color: red;">*</span>
                </el-col>
                <el-col :span="16">
                  <el-date-picker
                    class="date"
                    type="date"
                    value-format="yyyy-MM-dd"
                    size="small"
                    v-model="memberDialogForm.member.memberBirthday"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  签发机构<span style="color: red;">*</span>
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini"  maxlength="50" v-model="memberDialogForm.member.memberCardPublish"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  紧急联系人电话
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini"  maxlength="50" v-model="memberDialogForm.member.urgentLinkManPhone"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  至
                </el-col>
                <el-col :span="16">
                  <el-col :span="16">
                    <el-date-picker
                      class="date" 
                      type="date"
                      v-model="memberDialogForm.member.memberCardEndDate"
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
            
            <el-col :span="16">
              <el-row>
                <el-col :span="3" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  地址<span style="color: red;">*</span>
                </el-col>
                <el-col :span="20" style="text-align:left;display: flex;">
                  <el-input autocomplete="off" size="mini" style="margin-right: auto;" maxlength="200"  v-model="memberDialogForm.member.memberAdress"></el-input>
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
                  手机号码<span style="color: red;">*</span>
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" v-model="memberDialogForm.member.memberPhone"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  工人类型<span style="color: red;">*</span>
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
                  工种<span style="color: red;">*</span>
                </el-col>
                <el-col :span="16">
                  <el-select v-model="memberDialogForm.member.memberWorkRRole" @change="changeSelcet(memberDialogForm.member.memberWorkRRole)" placeholder="请选择">
                    <el-option
                      v-for="item in listmap"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  是否组长<span style="color: red;">*</span>
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
       
      </el-form>
      <div style="display: flex;">
        <button style="background-color: rgba(92,154,212,1);color:white;margin-left: auto;margin-right: 10px;width: 60px;height: 28px;"
                @click="cancelMemberDialogForm">取 消
        </button>
        <button style="background-color: rgba(92,154,212,1);color:white;margin-left:10px;width: 60px;height: 28px;"
                @click="confirmMemberDialogForm">确 定
        </button>
      </div>
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
    
    
		 <el-dialog title="推送平台" :visible.sync="dialogFormVisible" center
         width="530px" height='600px' >
          <div class="select-msg-box" style="display: flex;">
          <div style="flex: 0 0 80px;">平台名称<span style="color:red">*</span>：</div>&nbsp;&nbsp;
           <el-select class="select-msg-ele" @change="initPlatformData" v-model="form.title" placeholder="请选择活动区域">
		        <el-option v-for="(item,index) in platformList" :key="index" :label="item.title" :value="item.id"></el-option>
		      </el-select>
        </div>
         <div class="select-msg-box" style="display: flex;">
          <div style="flex: 0 0 80px;">API_KEY：</div>&nbsp;&nbsp;
           <el-input class="select-msg-ele" v-model="form.appKey" :readonly="true" autocomplete="off"></el-input>
        </div>
  		 <div class="select-msg-box" style="display: flex;">
          <div style="flex: 0 0 80px;">系统地址：</div>&nbsp;&nbsp;
           <el-input class="select-msg-ele" v-model="form.activationCode" :readonly="true" autocomplete="off"></el-input>
        </div>
        <div class="select-msg-box" style="display: flex;">
          <div style="flex: 0 0 80px;">端口号：</div>&nbsp;&nbsp;
           <el-input class="select-msg-ele" v-model="form.port" :readonly="true" autocomplete="off"></el-input>
        </div>
          <div class="select-msg-box" style="display: flex;">
          		  	<el-button type="primary" @click="pushPlatform">推送</el-button>
        </div>
		  <div slot="footer" class="dialog-footer">

		  </div>
		  
		  
		    
		</el-dialog>

    <!--<div v-show="">
    	    <el-dialog :visible.sync="dialogForm.visible" :title="dialogForm.title" center
         width="417px" @close="canceldialogForm" class="c3"
         top="5vh">
        <div class="select-msg-box">
          <span style="float:left">设备名称</span>&nbsp;&nbsp;
          <el-input v-model="dialogForm.gateBrake.title" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
        </div>
        <div class="select-msg-box">
          <span style="float:left">设备类型</span>&nbsp;&nbsp;
          <el-input v-if="deviceType!=2&&deviceType!=4" v-model="dialogForm.gateBrake.type" size="mini" class="select-msg-ele" :disabled="true" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
          <el-select v-if="deviceType==2||deviceType==4"  class="select-msg-ele" v-model="dialogForm.gateBrake.type">
            <el-option label="闸机" value="2"></el-option>
            <el-option label="展示屏" value="4"></el-option>
          </el-select>
        </div>
        <div class="select-msg-box"  v-if="deviceType==2">
          <span style="float:left">激活码</span>&nbsp;&nbsp;
          <el-input v-model="dialogForm.gateBrake.activationCode" size="mini"  class="select-msg-ele"  placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
        </div>

        <div class="select-msg-box">
          <span style="float:left">设备串号</span>&nbsp;&nbsp;
          <el-input v-model="dialogForm.gateBrake.deviceCode" :disabled="dialogForm.editType=='edit'" size="mini" class="select-msg-ele" placeholder="请选择" style="padding-left: 10px;overflow: hidden;"></el-input>
        </div>
        <div class="select-msg-box" style="display: flex;">
          <span style="float:left">地图选点</span>&nbsp;&nbsp;
            <div @click="addressObj.addressVisible=true" class="select-msg-ele" style="padding-left: 10px;overflow: hidden;">
                {{dialogForm.gateBrake.address}}
              </div>
        </div>

        <div style="display: flex;">
          <button style="margin-left: auto;color: white;width: 60px;height: 28px;background-color: rgba(92,154,212,1);border: none;" @click="canceldialogForm">取 消</button>
          <button style="margin-left:10px;color: white;width: 60px;height: 28px;background-color: rgba(92,154,212,1);border: none;" @click="confirmDialogForm">确 定</button>
        </div>
    </el-dialog>
    </div>-->
    
  </div>
</template>
<script>

  import uploading from '../common/uploading.vue'
  import {executePlatformPort} from '@/api/Interface-FoShan'
  export default {
    components: {
      uploading,//上传
    },
    data () {
      return {
      	buildCode:'',
        dialogFormVisible: false,
        platformList:[],
      	form: {
          name: '',
          region: '',
          appKey: '',
          address: '',
          delivery: false,
          resource: '',
          desc: ''
        },
        IdCardInImg:require('../../assets/dataImg/direct.gif'),
        IdCardOutImg:require('../../assets/dataImg/direct.gif'),
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
          accept:'.jpg,.JPG',//允许上传文件类型
          acceptMsg:'只能上传jpg图片',//提示信息
        },
        uploadEnterArenaConfig:{//进场附件
          limit:1,//限制附件上传个数
          limitSize:52428800,//50mb单个附件上传大小
          readOnly:false,//是否只读
          multiple: false,//是否允许多选
          xtype:'enterArena',//进场附件
          accept:'.jpg,.jpeg,.JPG,.JPEG',//允许上传文件类型
          acceptMsg:'只能传图片',//提示信息
        },
        uploadwalkOffConfig:{//退场附件
          limit:1,//限制附件上传个数
          limitSize:52428800,//50mb单个附件上传大小
          readOnly:false,//是否只读
          multiple: false,//是否允许多选
          xtype:'walkOff',//退出附件
          accept:'.jpg,.jpeg,.JPG,.JPEG',//允许上传文件类型
          acceptMsg:'只能传图片',//提示信息
        },
        enterStatus:'',//1:进场，2：退场
        selectedTeamId:'',
        fileList2: [
          // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        ],
        listmap:[
          {label:'砌筑工',value:'砌筑工'},
          {label:'钢筋工',value:'钢筋工'},
          {label:'架子工',value:'架子工'},
          {label:'混凝土工',value:'混凝土工'},
          {label:'模板工',value:'模板工'},
          {label:'机械设备安装工',value:'机械设备安装工'},
          {label:'通风工',value:'通风工'},
          {label:'安装起重工',value:'安装起重工'},
          {label:'安装钳工',value:'安装钳工'},
          {label:'电气设备安装调试工',value:'电气设备安装调试工'},
          {label:'管道工',value:'管道工'},
          {label:'变电安装工',value:'变电安装工'},
          {label:'建筑电工',value:'建筑电工'},
          {label:'司泵工',value:'司泵工'},
          {label:'挖掘铲运和桩工机械司机',value:'挖掘铲运和桩工机械司机'},
          {label:'桩机操作工',value:'桩机操作工'},
          {label:'起重信号工',value:'起重信号工'},
          {label:'建筑起重机械安装拆卸工',value:'建筑起重机械安装拆卸工'},
          {label:'装饰装修工',value:'装饰装修工'},
          {label:'室内成套设施安装工',value:'室内成套设施安装工'},
          {label:'建筑门窗幕墙安装工',value:'建筑门窗幕墙安装工'},
          {label:'幕墙制作工',value:'幕墙制作工'},
          {label:'防水工',value:'防水工'},
          {label:'木工',value:'木工'},
          {label:'石工',value:'石工'},
          {label:'电焊工',value:'电焊工'},
          {label:'爆破工',value:'爆破工'},
          {label:'除尘工',value:'除尘工'},
          {label:'测量放线工',value:'测量放线工'},
          {label:'线路架设工',value:'线路架设工'},
          {label:'古建筑传统石工',value:'古建筑传统石工'},
          {label:'古建筑传统瓦工',value:'古建筑传统瓦工'},
          {label:'古建筑传统彩画工',value:'古建筑传统彩画工'},
          {label:'古建筑传统木工',value:'古建筑传统木工'},
          {label:'古建筑传统油工',value:'古建筑传统油工'},
          {label:'金属工',value:'金属工'},
          {label:'管理人员',value:'管理人员'},
          {label:'杂工',value:'杂工'},
          {label:'爬架工',value:'爬架工'},
          {label:'门卫',value:'门卫'},
          {label:'仓管员',value:'仓管员'},
          {label:'塔吊司机',value:'塔吊司机'},
          {label:'监管',value:'监管'},
          {label:'其它',value:'其它'},
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
            politics: '282',
            culture: '',
            marriage: '292',
            urgentLinkMan: '',
            urgentLinkManPhone: ''
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
        memberData: [
          {
            id: 1,
            has_entered: '无',
            card_name: '张三',
            phone: '13826928999',
            card_num: '44066666666',
            work_type: '电工',
            sign_in_card_num: 'jr30089',
            has_signed_contract: '无',
            has_buy_insurance: '无',
            is_teamleader: '否',
          },
        ],
        multipleSelection: [],//勾选的数据
        multipleSelectedKey: 'workderId',//勾选数据的识别字段，一般为ID
        multipleSelectedKey2: 'teamWorkerId',//勾选数据的识别字段，一般为ID
        multipleSelectedKey3: 'workername',//勾选数据的识别字段，一般为ID
        multipleSelectedIDS: '',//勾选数据的识别字段，以,拼接
        multipleSelectedIDS2: '',//勾选数据的识别字段，以,拼接
        multipleSelectedIDS3: '',//勾选数据的识别字段，以,拼接

        timer:null,
        tableHeightNum:0,
        tableHeightNum1:0,
      }

    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      var _this=this;

      this.timer = setInterval(function(){
        _this.util.getByUrl('http://127.0.0.1:24010/ZKIDROnline/info',null,(res) => {//循环检查是否已经启动服务
          if( res.readyState!=undefined){//未启动服务
            if (res.readyState=='0'){
              _this.IDCardNote='缺少驱动，请先下载：'
              _this.showDriveDownload=true;
            }
          }else if(res.data!=null && res.ret!=null){//已启动服务
            _this.IDCardNote='请将身份证放置在身份证读卡器上，然后点击“读取身份证”进行读取。';
            _this.showDriveDownload=false;
            clearInterval(_this.timer);
          }
        })
      },100000000000000);
    },
    mounted () {
      this.loadTeamData();
      this.loadPlatformData();
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
        // this.tableHeightNum1=this.$refs.tablebox1.offsetHeight
      })


    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.loadTeamData();
      }
    },
    methods: {
      selectChange(val, type) {
        if(type ==  1) {
          this.$set(this.memberDialogForm.member, 'politics', val)
        }
        if(type ==  2) {
          this.$set(this.memberDialogForm.member, 'marriage', val)
        }
        if(type ==  3) {
          this.$set(this.memberDialogForm.member, 'culture', val)
        }
        this.$forceUpdate()
      },
      changeSelcet(val){
        this.memberDialogForm.member.memberWorkRRole=val;
        this.$forceUpdate();
      },
      pushPlatform(){//推送到平台
        if(!this.form.region) {
          this.util.error('请选择平台名称')
          return false;
        }
        this.util.mask("正在推送..");
        var platformName = this.form.region;
        var apiKey = this.form.appKey;
        var url = this.form.activationCode;
        var port = this.form.port;
        var projUid = this.$store.state.selectProjectObj.id;
        var teamUid = this.selectedTeamId;
        var teamIds = this.teamData==undefined? []:this.teamData.map(item=>item.id);
        var workerIds = this.memberData.map(item=>item.workderId);
        this.dialogFormVisible = false;
        executePlatformPort(projUid,teamIds,teamUid,workerIds,platformName,apiKey,url,port)
      },
      loadPlatformData() {//获取推送平台数据
        var params = {
          type:"6",
          pageNum: 1,
          pageSize: 100,
          projUid : this.$store.state.selectProjectObj.id
        }
        this.util.restGet('/api_v1/modules/check_devices', params, (res) => {
          if (res.status == 200&&res.data!=undefined) {
            this.platformList = res.data;
          } else {
            this.platformList = [];
          }
        })
      },
      initPlatformData(value){//初始化推送信息
        var obj = this.platformList.find(item=>item.id===value);
        this.form.appKey = obj.deviceCode;
        this.form.activationCode = obj.activationCode;
        this.form.port = obj.port;
        this.form.region = obj.title;

      },
      uploadDeviceInformation(){//上传设备信息
        var param = {
          projectCode:this.$store.state.selectProjectObj.id,
          areaCode:"440000 GD"
        }
        this.util.restGet('/api_v1/construction/realNameSystem/uploadDeviceInformation',param,res=>{
          if(res.status==200){
            this.util.successToast('推送成功');
          }else{
            this.util.error("上传设备信息失败:"+res.errorMsg);
          }
        })
      },
      btnPushEquipment(){
        if(this.memberData && this.memberData.length == 0) {
          this.util.error('没有待推送的人员信息')
          return false;
        }
        this.util.restGet('/api_v1/modules/real/sync_faces?projUid='+this.$store.state.selectProjectObj.id,null,res=>{
          if(res.status==200){
            this.util.successToast('推送成功');
          }else{
            this.util.error("推送成功失败:"+res.errorMsg);
          }
        })
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

          _this.memberDialogForm.member.memberBirthday = new Date(IdCardInfo.Certificate.Birthday).format('yyyy-MM-dd');//出生年月
          _this.memberDialogForm.member.memberCardEndDate = new Date(IdCardInfo.Certificate.ValidDate).format('yyyy-MM-dd');//签发日期
          _this.memberDialogForm.member.memberCardBeginDate = new Date(IdCardInfo.Certificate.IssuedData).format('yyyy-MM-dd');//有效截止日期
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
        this.uploadDialog.title = this.uploadDialog.type=='photo'?'上传头像':this.uploadDialog.type=='IdCardIn' ? '上传身份证正面':'上传身份证反面';
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
        if (this.uploadDialog.type=='IdCardIn') {
          this.IdCardInImg = imgUrl;
          this.IdCardFilesList[0]=filesList[0];
          this.IdCardFilesList[0].xtype = 'IdCardIn'
        } else if (this.uploadDialog.type=='IdCardOut') {
          this.IdCardOutImg = imgUrl;
          this.IdCardFilesList[1]=filesList[0];
          this.IdCardFilesList[1].xtype = 'IdCardOut'
        } else{
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
        // console.debug(this.multipleSelection);
        var workderIds = this.multipleSelection.map(item=>item.workderId);
        console.debug(workderIds);
        var params={
          ids:workderIds.join(",")
        }
        // var params={
        //   memberIds:this.multipleSelectedIDS+',',
        //   teamMemberIds:this.multipleSelectedIDS2+',',
        //   names:this.multipleSelectedIDS3+',',
        //   teamId:this.selectedTeamId,
        // }
        // params.company = this.sessionUtil.getCompanyUid(),
        //   params.projUid = this.$store.state.selectProjectObj.id;
        // params.info = JSON.stringify(params);
        this.util.restDelete('/api_v1/modules/workers/' + workderIds.join(","), params, (res) => {
          console.debug(res);
          if (res.status == 200) {
            this.loadMembetData();
          } else {
            this.util.error("删除成员失败:"+res.errorMsg)
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
//    	debugger
//    	  this.memberDialogForm.visible = false
        this.$nextTick(()=>{
          this.IdCardInImg=require('../../assets/dataImg/direct.gif')
          this.IdCardOutImg=require('../../assets/dataImg/direct.gif')
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
            politics: '282',
            culture: '',
            marriage: '292',
            urgentLinkMan: '',
            urgentLinkManPhone: ''
          },
        }
      },
      confirmTeamDialogForm () {//班组浮窗确认
        var teamObj = this.teamDialogForm.team;
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
        this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
        if (this.teamDialogForm.editType === 'add') {
          if (this.util.filterNone(teamObj.teamName)=='') {
            this.util.error('班组名称不能为空！')
            return false;
          }
          if(this.util.filterNone(teamObj.teamSysNo)=='') {
            this.util.error('班组编号不能为空！')
            return false;
          }
          if(this.util.filterNone(teamObj.corpName)=='') {
            this.util.error('企业名称不能为空！')
            return false;
          }
          if(this.util.filterNone(teamObj.teamLeaderName)=='') {
            this.util.error('班组长姓名不能为空！')
            return false;
          }
          if(this.util.filterNone(teamObj.teamLeaderPhone)=='') {
            this.util.error('班组长联系电话不能为空！')
            return false;
          }
          if(this.util.filterNone(teamObj.teamLeaderIdnumber)=='') {
            this.util.error('班组长证件号码不能为空！')
            return false;
          }
	         if(this.teamDialogForm.team.teamLeaderIdcardType == 1){
	        	 if(reg.test(this.teamDialogForm.team.teamLeaderIdnumber)===false){
			          this.util.failueToast('班组长证件编号格式有误');
		              return false
				        }
		        }
          
          if (this.util.filterNone(teamObj.responsiblePersonName)=='') {
            this.util.error('责任人姓名不能为空！')
             return false;
          }
          if (!this.validUtil.isNotEmpty(teamObj.responsiblePersonPhone)) {
            this.util.error('责任人联系电话不能为空!')
             return false;
          }
          if (!this.validUtil.isMobile(teamObj.responsiblePersonPhone)) {
            this.util.error('请输入正确的责任人联系电话!')
             return false;
          }
          if (teamObj.responsiblePersonIdnumber == '') {
            this.util.error('请输入责任人证件号码！')
            return false;
          } 
            if(this.teamDialogForm.team.responsiblepersonIdcardType == 1){
	        	 if(reg.test(this.teamDialogForm.team.responsiblePersonIdnumber)===false){
			          this.util.failueToast('负责人证件编号格式有误');
			              return false
					        }
			        }
           if (!this.validUtil.isNotEmpty(teamObj.entryTime)) {
            this.util.error('请选择进场时间！')
             return false;
          } 
          if (!this.validUtil.isNotEmpty(teamObj.exitTime)) {
            this.util.error('请选择退场时间！')
            return false;
          } 
          var mainData={
          	BUILD_CORP_CODE_:this.buildCode,
            TEAM_SYS_NO_:teamObj.teamSysNo,
            PROJECT_CODE_:teamObj.projectCode,
            PROJ_UID_:this.$store.state.selectProjectObj.id,
            CORP_UID_:this.sessionUtil.getCompanyUid(),
            CORP_CODE_:teamObj.corpCode,
            CORP_NAME_:teamObj.corpName,
            TEAM_NAME_:teamObj.teamName,
            TEAM_LEADER_NAME_:teamObj.teamLeaderName,
            TEAM_LEADER_PHONE_:teamObj.teamLeaderPhone,
            TEAM_LEADER_IDCARD_TYPE_:teamObj.teamLeaderIdcardType+'',
            TEAM_LEADER_IDNUMBER_:teamObj.teamLeaderIdnumber,
            RESPONSIBLE_PERSON_NAME_:teamObj.responsiblePersonName,
            RESPONSIBLE_PERSON_PHONE_:teamObj.responsiblePersonPhone,
            RESPONSIBLEPERSON_IDCARD_TYPE_:"1",
            RESPONSIBLE_PERSON_IDNUMBER_:teamObj.responsiblePersonIdnumber,
            REMARK_:teamObj.remark,
            ENTRY_TIME_:teamObj.entryTime,
            EXIT_TIME_:teamObj.exitTime,
          }
          var filesList = this.uploadEnterArenaConfig.filesList.concat(this.uploadwalkOffConfig.filesList);
          
          var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"R_TEAM_MASTER",filesData: JSON.stringify(filesList),ifSaveWorkflow:false};
          params['id']=this.form.id;
          params['businessKey']=this.form.id;
          this.util.mask("正在保存..");
          this.util.restPost("/api_v1/form/business",params,(res)=>{
             this.util.unmask();
              if(res.status==200){
                this.loadTeamData();
                this.util.success('新增成功')
                this.cancelTeamDialogForm()
              }else{
                this.util.error("保存失败:"+res.errorMsg)
              }
              
          });
          // this.util.mask();
          // this.util.restPost('/api_v1/modules/teams', params, (res) => {
          //   if (res.status == 200) {
          //     this.loadTeamData();
          //     this.util.success('新增成功')
          //     this.cancelTeamDialogForm()
          //     this.util.unmask();
          //   } else {
          //     _this.util.error(res.errorMsg)
          //     _this.util.unmask();
          //   }
          // })
        } else if (this.teamDialogForm.editType === 'edit') {
          this.util.mask();
          this.util.restPut('/api_v1/modules/teams/' + this.teamDialogForm.editId, teamObj, (res) => {
            if (res.status == 200) {
              this.loadTeamData()
              this.cancelTeamDialogForm()
              this.util.unmask();
            } else {
              this.util.error("保存失败:"+res.errorMsg)
              this.util.unmask();
            }
          })
        }

      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      confirmMemberDialogForm () {//人员浮窗确认
        var _this=this;
				var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
        if(_this.memberDialogForm.member.memberName==''||_this.memberDialogForm.member.memberName==undefined){
          _this.util.failueToast('请填写姓名');
          return false
        }
        if(_this.memberDialogForm.member.memberNation ==''||_this.memberDialogForm.member.memberNation ==undefined){
          _this.util.failueToast('请填写民族');
          return false
        }
        if(_this.memberDialogForm.member.memberCardNum==undefined||_this.memberDialogForm.member.memberCardNum==''){
          _this.util.failueToast('请填写证件编号');
          return false
        } 
        if(_this.memberDialogForm.member.memberCardType == 1){
        	 if(reg.test(_this.memberDialogForm.member.memberCardNum)===false){
		          _this.util.failueToast('证件编号格式有误');
              return false
		        }
        }
       
        if(_this.memberDialogForm.member.memberBirthday==undefined||_this.memberDialogForm.member.memberBirthday==''){
          _this.util.failueToast('请选择出生年月日');
          return false
        }
         if(_this.memberDialogForm.member.culture==undefined||_this.memberDialogForm.member.culture==''){
          _this.util.failueToast('请选择文化程度');
          return false
        }
        
        if(_this.memberDialogForm.member.memberCardPublish==undefined||_this.memberDialogForm.member.memberCardPublish==''){
          _this.util.failueToast('请填写签发机构');
          return false
        }
        // if(this.memberDialogForm.member.tttt==undefined||this.memberDialogForm.member.tttt==''){
        //   _this.util.failueToast('请选择刷卡时间');
        //   return false
        // }
        if(_this.memberDialogForm.member.memberCardBeginDate==undefined||_this.memberDialogForm.member.memberCardBeginDate==''){
          _this.util.failueToast('请选择证件有效期');
          return false
        }
        if(_this.memberDialogForm.member.memberCardEndDate==undefined||_this.memberDialogForm.member.memberCardEndDate==''){
          _this.util.failueToast('请选择证件有效截止期');
          return false
        } 
        if(_this.memberDialogForm.member.memberAdress==undefined||_this.memberDialogForm.member.memberAdress==''){
          _this.util.failueToast('请填写地址');
          return false
        }
        if(_this.memberDialogForm.member.memberPhone==undefined||_this.memberDialogForm.member.memberPhone==''){
          _this.util.failueToast('请填写手机号');
          return false
        }
        if(_this.memberDialogForm.member.memberWorkRRole==undefined||_this.memberDialogForm.member.memberWorkRRole==''){
          _this.util.failueToast('请选择工种');
          return false
        }
        if(_this.memberDialogForm.member.memberWorkType==undefined||_this.memberDialogForm.member.memberWorkType==''){
          _this.util.failueToast('请选择工人类型');
          return false
        }
        var params = _this.memberDialogForm.member;
        var filesList = _this.uploadIDcardConfig.filesList;
        params.filesList=filesList;
        _this.util.mask();

        if (_this.memberDialogForm.editType === 'add') {
          
          params.teamUid = _this.selectedTeamId;
          params.IdCardFilesList = _this.IdCardFilesList;
          params.PhotoFilesList = _this.PhotoFilesList;
          
          params.projUid = _this.$store.state.selectProjectObj.id;
          params.cardType=params.cardType;
          params.cardNum=params.cardNum;
          params.memberSex=params.memberSex=='男'?0:1;//0，男；1，女

          params.company = _this.sessionUtil.getCompanyUid(),
          params.info=JSON.stringify(params);

          _this.util.restPost('/api_v1/modules/workers', params, (res) => {
            if (res.status == 200) {
              _this.loadMembetData();
              _this.util.success('新增成功');
              _this.cancelMemberDialogForm();
              _this.util.unmask();
            } else {

              _this.util.error("保存人员失败:"+res.errorMsg);
              _this.util.unmask();
            }
          })
        }
        else if (_this.memberDialogForm.editType === 'edit') {
          params.IdCardFilesList = _this.IdCardFilesList;
          params.PhotoFilesList = _this.PhotoFilesList;
          if( _this.PhotoFilesList.length == 0) {
            params.PhotoFilesList = params.back_photoList
          }
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
//        debugger
          params.info=JSON.stringify(params);
          
//        console.log(params)
//         console.log('1',params.info)
          _this.util.restPut('/api_v1/modules/workers/' + _this.memberDialogForm.editId, params, (res) => {
            if (res.status == 200) {
              _this.loadMembetData();
              _this.util.success('修改成功')
              _this.cancelMemberDialogForm();
              _this.util.unmask();
            } else {
              _this.util.error("编辑人员失败:"+res.errorMsg)
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
              _this.util.error("删除班组失败:"+res.errorMsg)
              _this.util.unmask();
              _this.delDialog.visible = false
            }
          })
        } else if (this.delDialog.type === 'member') {
          
          var params={
            ids:this.multipleSelectedIDS
          }
          _this.util.mask();
          this.util.restDelete('/api_v1/modules/workers/' + this.multipleSelectedIDS, params, (res) => {
            if (res.status == 200) {
              _this.delDialog.visible = false;
              _this.loadMembetData();
              _this.util.unmask();
            } else {
              _this.util.error("编辑班组失败:"+res.errorMsg)
              _this.util.unmask();
            }
          })

        }
      },
      teamRowClick (row) {
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
        
      },
      handlePreview (file) {
        console.log(file)
      },
      addTeam () {
      	     this.util.restGet('/api_v1/business/project/getSocietyCode',null, (res)=> {
      	   	if(res.status==200){
      	   		console.log("11111111111111111111111",res.data.BUILD_CORP_CODE_);
      	   		this.buildCode = res.data.BUILD_CORP_CODE_;
      	   	}
      });
//    		debugger
      	  this.uploadEnterArenaConfig.filesList = []
      	  this.uploadwalkOffConfig.filesList = []
      	
        this.teamDialogForm.editType = 'add'
        this.teamDialogForm.editType = 'add'
        this.teamDialogForm.visible = true
        this.teamDialogForm.title = '新建班组'
        this.teamDialogForm.team.corpCode = this.sessionUtil.getCorpId();
        // this.teamDialogForm.team=null;
        // this.PhotoFilesList=null;
      },
      editTeam (row) {
        var _this=this;
             _this.util.restGet('/api_v1/business/project/getSocietyCode',null, (res)=> {
			      	   	if(res.status==200){
			      	   		_this.buildCode = res.data.BUILD_CORP_CODE_;
			      	   	}
			      });
        this.tes=this.util.cardTypeList;
        this.util.restGet('/api_v1/modules/teams/' + row.id, null, (res) => {//获取班组详情
          if (res.status == 200) {
           
            res.data.entryTime = res.data.entryTime==undefined?'':new Date(res.data.entryTime);
            res.data.exitTime = res.data.exitTime==undefined?'':new Date(res.data.exitTime);
            _this.teamDialogForm.team = res.data;
           
            _this.teamDialogForm.team.responsiblepersonIdcardType= _this.teamDialogForm.team.responsiblepersonIdcardType.toString().trim();
            _this.teamDialogForm.team.teamLeaderIdcardType= _this.teamDialogForm.team.teamLeaderIdcardType.toString().trim();

            this.teamDialogForm.editType = 'edit'
            this.teamDialogForm.visible = true
            this.teamDialogForm.title = '编辑班组'
            this.teamDialogForm.editId = row.id
          } else {
            this.util.error("编辑班组失败:"+res.errorMsg)
            this.cancelTeamDialogForm()
          }
        })
      },
      delTeam (row) {
        this.delDialog.visible = true
        this.delDialog.type = 'team'
        this.delDialog.delId = row.id
      },
      addMember () {
        if(!this.selectedTeamId) {
          this.util.error('请先选择班组')
          return false;
        }
        this.memberDialogForm.editType = 'add'
        this.memberDialogForm.visible = true
        this.memberDialogForm.title = '新建人员'
      },
      editMember(row) {
      	console.log(row)
        this.PhotoFilesList=[]
        this.IdCardFilesList=[]
        this.memberDialogForm.editId = row.teamWorkerId;
        var _this=this;
        this.util.restGet('/api_v1/modules/workers/'+this.memberDialogForm.editId , null, (res) => {//获取人员详情
          if (res.status == 200) {
            console.debug("workers====",res);
            console.debug("==culture="+res.data.culture);
            res.data.memberCardType =res.data.memberCardType===undefined?'':res.data.memberCardType.toString().trim();
            this.memberDialogForm.member = res.data;
            this.memberDialogForm.member.memberWorkRRole =_this.memberDialogForm.member.memberWorkRRole===undefined?'':_this.memberDialogForm.member.memberWorkRRole.toString().trim();
            this.memberDialogForm.member.memberWorkType =_this.memberDialogForm.member.memberWorkType===undefined?'':_this.memberDialogForm.member.memberWorkType.toString().trim();
            this.memberDialogForm.member.politics =_this.memberDialogForm.member.politics===undefined?'':_this.memberDialogForm.member.politics.toString().trim();
            this.memberDialogForm.member.marriage =_this.memberDialogForm.member.marriage===undefined?'':_this.memberDialogForm.member.marriage.toString().trim();
            this.memberDialogForm.member.culture =_this.memberDialogForm.member.culture===undefined?'':_this.memberDialogForm.member.culture.toString().trim();
            this.memberDialogForm.member.photoList =_this.memberDialogForm.member.photoList===undefined?[]:_this.memberDialogForm.member.photoList;//身份证
            this.memberDialogForm.member.back_photoList=_this.memberDialogForm.member.photoList;
            var photoDate = null;
            if (_this.memberDialogForm.member.photoList.length>0){//上传的头像
              var item=_this.memberDialogForm.member.photoList[_this.memberDialogForm.member.photoList.length-1];
              photoDate = new Date(item.createTime);
              _this.PhotoImg = this.util.getBaseUrl() + "/api_v1/files/" + item.id+ "/look?ifThumb=true&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + item.id + "&suffix=" + item.suffix + "&fileName=" + encodeURIComponent(item.fileName);
            }

            _this.memberDialogForm.member.IdCardList =_this.memberDialogForm.member.IdCardList===undefined?[]:_this.memberDialogForm.member.IdCardList;//头像
            _this.IdCardFilesList = _this.memberDialogForm.member.IdCardList;
            _this.memberDialogForm.member.back_IdCardList=_this.memberDialogForm.member.IdCardList;

            if (_this.memberDialogForm.member.IdCardList.length>0){//上传的身份证照片
            
              var item1=_this.memberDialogForm.member.IdCardList[0];
              _this.IdCardInImg= _this.util.getBaseUrl() + "/api_v1/files/" + item1.id+ "/look?ifThumb=true&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + item1.id + "&suffix=" + item1.suffix + "&fileName=" + encodeURIComponent(item1.fileName);
              if(_this.memberDialogForm.member.IdCardList[1]) {
                var item2=_this.memberDialogForm.member.IdCardList[1];
                _this.IdCardOutImg= _this.util.getBaseUrl() + "/api_v1/files/" + item2.id+ "/look?ifThumb=true&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + item2.id + "&suffix=" + item2.suffix + "&fileName=" + encodeURIComponent(item2.fileName);
              }
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
            this.util.error("获取人员详情失败:"+res.errorMsg)
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
            this.memberData = res.data==undefined? []:res.data;
            for (var i in this.memberData) {
              this.memberData[i].entryStatusName = this.memberData[i].entryStatus === '1' ? '进场' : '退场'
              this.memberData[i].hasBuyInsuranceName = this.memberData[i].hasBuyInsurance ? '有' : '无'
              this.memberData[i].hasContractName = this.memberData[i].hasContract ? '有' : '无'
              this.memberData[i].workerTypeName = this.memberData[i].workerType;
              this.memberData[i].isTeamLeaderName = this.memberData[i].isTeamLeader === '1' ? '是' : '否'
            }
            this.memberPage.totalCount = res.totalCount===undefined?0:res.totalCount;
          } else {
            this.util.error("获取班组成员信息失败:"+res.errorMsg)
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
            this.util.error("获取班组信息失败:"+res.errorMsg)
          }
        })
      },
      //勾选记录
      handleSelectionChange (val) {
        // console.log(JSON.stringify(val));
        this.multipleSelection = val;

        this.multipleSelectedIDS = '';
        if (this.multipleSelectedKey !== '') {
          for (var i in val) {
            this.multipleSelectedIDS += val[i][this.multipleSelectedKey] + ','
          }
        }
        this.multipleSelectedIDS2 = '';
        if (this.multipleSelectedKey2 !== '') {
          for (var i in val) {
            this.multipleSelectedIDS2 += val[i][this.multipleSelectedKey2] + ','
          }
        }
        this.multipleSelectedIDS3 = '';
        if (this.multipleSelectedKey3 !== '') {
          for (var i in val) {
            this.multipleSelectedIDS3 += val[i][this.multipleSelectedKey3] + ','
          }
        }
      }
    }
  }
</script>
<style type="text/css">
	.box_index .el-input--small .el-input__inner{
		border: 1px solid #dcdfe6;
		width: 277px;
		border-radius: 5px;
	}
	 .box_index .el-input--suffix .el-input__inner{
			border: 1px solid #dcdfe6;
			width: 278px;
			border-radius: 5px;
			padding: 5px;
	}
  .box_index .date .el-input__inner {
    padding-left: 30px !important;
  }
</style>
<style scoped>
  .proj-box {
    width: 100%;
    box-sizing: border-box;
    padding: 0px;
    color: #fff;
    font-size: 14px;
    padding-top: 10px;
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
    height:100%;
    box-sizing: border-box;
  }
  .mun-box_left{
    float: left;
    width:320px;
    height:100%;
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    padding:13px 14px 13px 14px;
    box-sizing: border-box;
    overflow: auto;
  }
  .mun-box_right{
    overflow: hidden;
    height:100%;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .mun-box_right-box{
    width:100%;
    height:100%;
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    padding:9px 14px;
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
  .select-msg-box>span{
  width: 56px;
}
.select-msg-ele {
    line-height: 38px;
    height: 38px;
    color: #333;
    width: 390px;
    border: 1px solid #ccc;
    border-radius: 1px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

</style>

<style>
  .select-msg-ele .el-input__inner{
    border: none !important;
  }
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
</style>
