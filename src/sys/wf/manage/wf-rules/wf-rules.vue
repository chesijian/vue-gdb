<template>
  <div style="margin-top:0px;">
    <el-tabs v-model="tabActiveName" >
      <el-tab-pane label="规则设置" name="first">
        <div id="wf-rules" class="c-setting">
          <div class="c-title">
            同时满足<div class="c-help" title="配置多个条件时，流程启动判断需要多个条件都满足">?</div>
          </div>
          <el-form :model="form" ref="form" label-width="0px" style="width:100%;">
            <div class="c-items">

              <div v-for="(item, index) in form.items" :key="index" class="c-item">
                <div class="c-items-content">
                  <div class="c-items-content-field">
                    <el-form-item
                      :prop="'items.' + index + '.field'"
                      :rules="{
                          required: true, message: '字段不能为空', trigger: 'blur'
                        }"
                    >
                      <el-select v-model="item.field" @change="handlerSelectField" placeholder="请选择字段" size="mini" style="width:120px;">
                        <el-option
                          v-for="field in fieldList"
                          :disabled = "field.disabled && field.disabled"
                          :key="field.field"
                          :value="option.value"
                          :label="option.value">
                          {{option.label}}
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="c-items-content-type c-items-content-value-item">
                    <el-form-item
                      :prop="'items.' + index + '.ruleType'"
                      :rules="{
                          required: true, message: '条件类型不能为空', trigger: 'blur'
                        }"
                    >
                      <el-select v-if="!item.ruleTypeDisabled" v-model="item.ruleType"  @change="handlerSelectRuleType(item)" placeholder="匹配类型" size="mini" style="width:100px;">
                        <el-option
                          v-for="item in ruleTypes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                          <span style="float: left">{{ item.label }}</span>
                        </el-option>
                      </el-select>
                      <div v-if="item.ruleTypeDisabled" >
                        <el-select  v-model="item.ruleType" disabled @change="handlerSelectRuleType(item)" placeholder="匹配类型" size="mini" style="width:100px;">
                          <el-option
                            v-for="item in ruleTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            <span style="float: left">{{ item.label }}</span>
                          </el-option>
                        </el-select>
                      </div>

                    </el-form-item>
                  </div>
                  <div class="c-items-content-value">
                    <div v-if="item.ruleType === 'rule-compare'" class="c-items-content-value-item" >
                      <el-form-item style="float: left;"
                                    :prop="'items.' + index + '.compareType'"
                                    :rules="{
                          required: true, message: '数值条件不能为空', trigger: 'blur'
                        }"
                      >
                        <el-select v-model="item.compareType" placeholder="数值条件" size="mini" style="width:100px;float: left;">
                          <el-option
                            v-for="item in compareTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <div v-if="item.compareType && item.compareType == 'between'" style="margin-left: 10px;float: left;">
                        <el-form-item style="float: left;"
                                      :prop="'items.' + index + '.minVal'"
                                      :rules="{
                          required: true, message: '最小值不能为空', trigger: 'blur'
                        }"
                        >
                          <el-input style="width:100px;" type="number"
                                    size="mini"
                                    placeholder="最小值"
                                    v-model="item.minVal">
                          </el-input>
                        </el-form-item>
                        <span style="float: left;margin: 7px;">-</span>
                        <el-form-item style="float: left;"
                                      :prop="'items.' + index + '.maxVal'"
                                      :rules="{
                          required: true, message: '最大值不能为空', trigger: 'blur'
                        }"
                        >
                          <el-input style="width:100px;" type="number"
                                    size="mini"
                                    placeholder="最大值"
                                    v-model="item.maxVal">
                          </el-input>
                        </el-form-item>
                      </div>
                      <div v-else style="margin-left: 10px;float: left;">
                        <el-form-item style="float: left;"
                                      :prop="'items.' + index + '.value'"
                                      :rules="{
                          required: true, message: '数值不能为空', trigger: 'blur'
                        }"
                        >
                          <el-input
                            size="mini" style="width:100px;" type="number"
                            placeholder="数字"
                            v-model="item.value">
                          </el-input>
                        </el-form-item>
                      </div>



                    </div>
                    <div v-if="item.ruleType === 'rule-user'" class="c-items-content-value-item" style="padding-top: 6px;">
                      <div v-for="obj in item.value" class="c-member" >
                        <span class="c-icon c-member-icon-user"></span>
                        <span class="c-member-text">{{obj.userName}}</span>
                      </div>

                      <a class="c-items-content-rule-type-add" href="javascript:;" @click="handleAddUser(item)">{{item.value && item.value.length>0?'修改':'添加'}}</a>



                    </div>
                    <div v-if="item.ruleType === 'rule-depart'" class="c-items-content-value-item" style="padding-top: 6px;">
                      <div v-for="obj in item.value" class="c-member" >
                        <span class="c-icon c-member-icon-depart"></span>
                        <span class="c-member-text">{{obj.departName}}</span>
                      </div>
                      <a class="c-items-content-rule-type-add" href="javascript:;" @click="handleAddDepart(item)">{{item.value && item.value.length>0?'修改':'添加'}}</a>

                    </div>
                    <div v-if="item.ruleType === 'rule-contain'" class="c-items-content-value-item">
                      <div v-if="item.items" style="padding-top: 8px;margin-top: 0px;">
                        <!--{{value}}{{item.field}}{{item.value}}{{JSON.stringify(item.items)}}-->
                        <el-checkbox-group v-model="item.value">
                          <el-checkbox v-for="option in item.items"
                                       :name="item.field"
                                       :key="option.value"
                                       :label="option.label?option.label:(option.name?option.name:option.value)">
                            {{option.label}}
                          </el-checkbox>

                        </el-checkbox-group>

                      </div>
                      <div v-else>
                        <el-form-item
                          :prop="'items.' + index + '.value'"
                          :rules="{
                          required: true, message: '包含项不能为空', trigger: 'blur'
                        }"
                        >
                          <el-input
                            size="mini" style="width:250px;"
                            placeholder="多个项用逗号隔开"
                            v-model="item.value">
                          </el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <div v-if="item.ruleType === 'rule-equal'" class="c-items-content-value-item">
                      <el-form-item
                        :prop="'items.' + index + '.value'"
                        :rules="{
                          required: true, message: '数值不能为空', trigger: 'blur'
                        }"
                      >
                        <el-input
                          size="mini" style="width:200px;"
                          placeholder="请输入"
                          v-model="item.value">
                        </el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div  class="c-items-remove">
                  <i @click="handleRemoveRule(item)" class="c-items-btn c-items-btn-remove"></i>
                </div>
              </div>

              <div v-if="form.items.length<fieldList.length" class="c-item">
                <div class="approval_add_rule">
                  <a href="javascript:;" @click="handleAddRule()" class="js-add-rule"><i class="c-icon c-icon-add"></i>添加条件</a>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div style="padding-left:90px;padding-top:20px;">
      <el-button type="primary" @click="handleSave" size="mini">保存</el-button>
      <el-button  @click="handleBack" size="mini">返回</el-button>
    </div>
    <select-member :selectMemberModels='selectMemberModel'></select-member>
    <select-depart :selectQuertersModels='selectDepartModel' style="width: 572px;"></select-depart>
  </div>
</template>

<script>

  import {wfUtil} from "./index";
  import SelectMember from "@/common/select-user/select-user.vue";
  import SelectDepart from "@/common/select-depart/select-depart.vue";
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    props: ['model'],
    name: 'wf-rules',
    data() {
      return {
        tabActiveName: 'first',
        form: {
          items: []
        },
        fieldList: [],
        ruleTypes: [{
          label: '指定人员',
          value: 'rule-user'
        }, {
          label: '指定部门',
          value: 'rule-depart'
        }, {
          label: '数值条件',
          value: 'rule-compare'
        }, {
          label: '包含',
          value: 'rule-contain'
        }, {
          label: '指定值',
          value: 'rule-equal'
        }],
        compareTypes: [{
          label: '大于',
          value: '>'
        }, {
          label: '大于等于',
          value: '>='
        }, {
          label: '等于',
          value: '=='
        }, {
          label: '小于',
          value: '<'
        }, {
          label: '小于等于',
          value: '<='
        }, {
          label: '介于',
          value: 'between'
        }],
        selectRule : null,
        selectDepartModel:{
          isShow:false,
          selectList:[],
          callBack:this.selectDepartCallBack,
          radioSelectFlags:false,
        },
        selectMemberModel : {
          isShow:false,
          selectList:[],
          callBack:this.selectMemberCallBack,
          radioSelectFlags:false
        },
        value: []
      }
    },
    components:{
      SelectMember, SelectDepart
    },
    computed:{
      ...mapGetters([
        'getFormConfig'
      ])
    },
    created() {
      wfUtil.init(this)
    },mounted() {
      this.form.items = [];
      // let modelId = this.$route.params.modelId
      // let formKey = this.$route.params.formKey
      // console.info('modelId:'+modelId+', formKey:'+formKey)
      let modelId = this.model.modelId
      let key = this.model.key
      let formKey = this.model.formKey
      // formKey = 'mat_purchase_order-1'
      wfUtil.loadData(formKey, key)
      //console.info(this.form.items )

    },methods:{
      ...mapMutations([
        'setFormConfig'
      ]),
      handleAddRule(){
        wfUtil.addRule()
      },handleRemoveRule(item){
        wfUtil.deleteRule(item)
      },handleAddUser(item){
        wfUtil.addUser(item)
      },handleAddDepart(item){
        wfUtil.addDepart(item)
      },handlerSelectField(field){
        wfUtil.refreshFieldList()
      },handlerSelectRuleType(rule){
        if(rule.ruleType === 'rule-contain'){
          rule.value = []
        }else{
          rule.value = ''
        }

      },handleBack(){
        // this.$router.back(-1)
        // window.history.back()
        this.model.parent.showRuleSetting = false
      },handleSave(){
        let _this = this;
        this.$refs.form.validate((valid) => {
          if (valid && wfUtil.validate()) {
            // alert('submit!');
            // console.info(_this.form.items)
            wfUtil.save(_this.model.formKey, _this.model.key, _this.form.items)
          } else {
            // console.log('error submit!!');
            _this.util.warn('表单检验失败！')
            return false;
          }
        });
      },selectMemberCallBack(){
        this.selectRule.value = this.selectMemberModel.selectList
        var _this = this
        var value = []
        this.selectMemberModel.selectList = this.selectMemberModel.selectList.filter(function(item){
          value.push({id : item.id, userName: item.userName})
        })
        this.form.items = this.form.items.filter(function(item){
          if(item.field == _this.selectRule.field){
            item.value = value
          }
          return item
        })
      },selectDepartCallBack(){
        console.info(this.selectDepartModel.selectList)
        this.selectRule.value = this.selectDepartModel.selectList
        var _this = this
        var value = []
        this.selectDepartModel.selectList = this.selectDepartModel.selectList.filter(function(item){
          value.push({id : item.id, departName: item.text, label : item.text, text : item.text})
        })
        this.form.items = this.form.items.filter(function(item){
          if(item.field == _this.selectRule.field){
            item.value = value
          }
          return item
        })
      }
    }
  }
</script>

<style scoped>
  *{
    font-family: 微软雅黑;
  }
  a {
    color: #0C4C7F;
    text-decoration: none;
    -webkit-tap-highlight-color: #0C4C7F;
  }
  .c-help{
    cursor:pointer;
    width: 12px;
    height: 12px;
    border: 1px solid;
    border-radius: 50%;
    line-height: 12px;
    text-align: center;
    margin-top: 5px;
    margin-left: 4px;
    font-size: 10px;
  }
  .c-setting {
    display: flex;
    width: 100%;
  }

  .c-title {
    display: flex;
    width: 100px;
    color: #787878;
    padding-top: 8px;
  }

  .c-items {
    width: 100%;
  }

  .c-item {
    display: flex;
    width: 100%;
    /*margin-bottom: 20px;*/
  }

  .c-items-content {
    display: flex;
    width: 100%;
    /*background-color: blue;*/
  }

  .c-items-remove {
    display: flex;
    width: 50px;
    /*background-color: red;*/
    padding-top: 3px;
  }

  .c-items-content-type {

  }

  .c-items-content-value-item {
    margin-left: 10px;
  }

  .c-items-content-rule-type-add {
    float: left;
    margin-top: 3px;
    color: #0C4C7F;
    text-decoration: none;
    cursor:pointer;
    -webkit-tap-highlight-color: #0C4C7F;
  }

  .c-items-btn-remove {
    background-image: url(../../../../public/icon/wework.png);
    background-position: 282px 50px;
    width: 16px;
    height: 16px;
    cursor:pointer;
  }

  .c-items-btn {
    display: inline-block;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
  }
  .c-member{
    font-size: 13px;
    height: 22px;
    float: left;
    max-width: 231px;
    line-height: 1.5;
    margin: 0px 10px 3px 0;
    padding: 4px 5px 0px 5px;
    background-color: #fff;
    border: 1px solid #E4E6E9;
    border-radius: 2px;
  }
  .c-icon {
    display: inline-block;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
  }
  .c-member-icon-user{
    background-image: url(../../../../public/icon/wework.png);
    background-position: -330px -676px;
    width: 12px;
    height: 12px;
    float: left;
    margin: 3px 5px 0 0;
  }
  .c-member-icon-depart{
    background-image: url(../../../../public/icon/wework-1.png);
    background-position: -169px -306px;
    width: 14px;
    height: 12px;
    float: left;
    margin: 3px 5px 0 0;
  }

  .c-icon-add {
    background-image: url(../../../../public/icon/wework.png);
    background-position: -176px -676px;
    width: 12px;
    height: 12px;
    margin-right: 5px;
  }

  .c-member-text{
    float: left;
    max-width: 174px;
    padding-right: 11px;
    overflow: hidden;
    line-height: 18px;
    cursor: default;
  }
</style>

<style>
  #wf-rules input{

    font-family: 微软雅黑;
    color: black;
    font-size: 13px;
  }
</style>
