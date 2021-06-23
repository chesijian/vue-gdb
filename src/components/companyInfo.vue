<template>
    <div class="change-psw-box box_index">
      <el-dialog class="jrjy" title="企业信息" :visible.sync="models.dialogVisible" width="1300px">
        <el-form style="width: 100%;">
        
        <el-form-item>
          <!--左侧-->
          <el-row>
            <el-col :span="8" style="text-align: center;">
              <img :src="mainData.squareLogo" width="200" height="160"/>
            </el-col>
            <!--中部-->
            <el-col :span="16">
              <el-row>
                <el-col :span="3" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  企业名称 <span class="required">*</span>
                </el-col>
                <el-col :span="20" style="text-align:left;display: flex;" prop="corpName">
                  <el-input autocomplete="off" size="mini" style="margin-right: auto;" maxlength="200"  v-model="mainData.corpName"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  信用代码<span class="required">*</span>
                </el-col>
                <el-col :span="20">
                  <el-input autocomplete="off"  size="mini" v-model="mainData.creditCode" maxlength="50"></el-input>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="3" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  营业地址<span class="required">*</span>
                </el-col>
                <el-col :span="20">
                  <el-input autocomplete="off"  size="mini" v-model="mainData.address" maxlength="50"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  企业网址<span class="required">*</span>
                </el-col>
                <el-col :span="20">
                  <el-input autocomplete="off"  size="mini" v-model="mainData.website" maxlength="50"></el-input>
                </el-col>
              </el-row>
            </el-col>
           
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  单位性质
                </el-col>
                <el-col :span="16">
                  <el-select v-model="mainData.corpType" placeholder="请选择">
                      <el-option v-for="(item,index) in unitList" :key="index" :label="item.value" :value="''+item.orders"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  地区编码
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="mainData.areaCode" maxlength="20" size="mini"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  注册资本(万元)
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="mainData.regCapital" maxlength="20" size="mini"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  实收资本(万元)
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="mainData.factRegCapital" maxlength="20" size="mini"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <!---->
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  营业执照
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="mainData.licenseNum" maxlength="20" size="mini"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  邮政编码
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="mainData.zipCode" maxlength="20" size="mini"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  注册日期
                </el-col>
                <el-col :span="16">
                  <el-col :span="16">
                    <el-date-picker type="date" v-model="mainData.registerDate" value-format="yyyy-MM-dd" size="small" placeholder="选择日期"></el-date-picker>
                  </el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  成立日期
                </el-col>
                <el-col :span="16">
                  <el-col :span="16">
                    <el-date-picker type="date" v-model="mainData.establishDate" value-format="yyyy-MM-dd" size="small" placeholder="选择日期"></el-date-picker>
                  </el-col>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  法定代表人
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini"  maxlength="50" v-model="mainData.legalMan"></el-input>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  代表人职务
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini"  maxlength="50" v-model="mainData.legalManDuty"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  代表人职称
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" v-model="mainData.legalManProtitle" maxlength="20" size="mini"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  代表人证件类型<span class="required">*</span>
                </el-col>
                <el-col :span="16">
                  <!-- <el-input autocomplete="off" v-model="mainData.legalManIDCardType" maxlength="20" size="mini"></el-input> -->
                  <el-select v-model="mainData.legalManIdcardType" placeholder="请选择">
                      <el-option v-for="(item,index) in certificateList" :key="index" :label="item.value" :value="''+item.orders"></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  办公电话
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" maxlength="50" v-model="mainData.officePhone"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  传真号码
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" maxlength="50" v-model="mainData.faxNumber"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <!---->
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  联系人姓名
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" v-model="mainData.linkman"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  联系人办公电话
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" v-model="mainData.linkTel"></el-input>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  代表人证件号码<span class="required">*</span>
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" v-model="mainData.legalManIdcardNumber"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  企业联系邮箱
                </el-col>
                <el-col :span="16">
                  <el-input autocomplete="off" size="mini" v-model="mainData.email"></el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

           <el-row>
            
            <el-col :span="2" style="text-align: left;white-space:nowrap;font-size: 14px;color:black;">
                  备注
                </el-col>
                <el-col :span="20" style="text-align:left;display: flex;">
                  <el-input autocomplete="off" size="mini" style="margin-right: auto;" maxlength="200"  v-model="mainData.remark"></el-input>
                </el-col>
          </el-row>
        </el-form-item>
        
      </el-form>
        <div style="display: flex;padding-bottom:20px">
          <button style="background-color: rgba(92,154,212,1);color:white;margin-left: auto;margin-right: 10px;width: 60px;height: 28px;"
                  @click="models.dialogVisible=false">取 消
          </button>
          <button style="background-color: rgba(92,154,212,1);color:white;margin-left:10px;width: 60px;height: 28px;"
                  @click="saveCorpInfo()">确 定
          </button>
        </div>
     </el-dialog>
    </div>
</template>
<script>
export default {
    props:['models'],
    data() {
        return {
            IdCardImg:require('@/assets/dataImg/direct.gif'),
            mainData:{
                old:'',
                new:'',
                repeatNew:'',
                isOldpsw:true,
            },
            corpName: [{required: true, message: '必填:电话号码', trigger: 'blur'}],
            address: [{required: true, message: '必填:联系地址', trigger: 'blur'}],
            departmentId: [{required: true, message: '必填:部门', trigger: 'change'}],
            jobLevelId: [{required: true, message: '必填:职称', trigger: 'change'}],
            posId: [{required: true, message: '必填:职位', trigger: 'change'}],
            engageForm: [{required: true, message: '必填:聘用形式', trigger: 'blur'}],
            tiptopDegree: [{required: true, message: '必填:最高学历', trigger: 'change'}],
            specialty: [{required: true, message: '必填:专业', trigger: 'blur'}],
            workID: [{required: true, message: '必填:工号', trigger: 'blur'}],
            school: [{required: true, message: '必填:毕业院校', trigger: 'blur'}],
            beginDate: [{required: true, message: '必填:入职日期', trigger: 'blur'}],
            conversionTime: [{required: true, message: '必填:转正日期', trigger: 'blur'}],
            beginContract: [{required: true, message: '必填:合同起始日期', trigger: 'blur'}],
            endContract: [{required: true, message: '必填:合同终止日期', trigger: 'blur'}],
            workAge: [{required: true, message: '必填:工龄', trigger: 'blur'}],
            unitList:[{orders:14,value:"内资企业"},{orders:15,value:"国有企业"},{orders:16,value:"集体企业"},{orders:17,value:"股份合作企业"},{"orders":18,"value":"联营企业"},{"orders":19,"value":"国有联营企业"},{"orders":20,"value":"集体联营企业"},{"orders":21,"value":"国有与集体联营企业"},{"orders":22,"value":"其他联营企业"},{"orders":23,"value":"有限责任公司"},{"orders":24,"value":"国有独资公司"},{"orders":25,"value":"其他有限责任公司"},{"orders":26,"value":"股份有限公司"},{"orders":27,"value":"私营企业"},{"orders":28,"value":"私营独资企业"},{"orders":29,"value":"私营合伙企业"},{"orders":30,"value":"私营有限责任公司"},{"orders":31,"value":"私营股份有限公司"},{"orders":32,"value":"其他企业"},{"orders":33,"value":"港、澳、台商投资企业"},{"orders":34,"value":"合资经营企业（港或澳、台资）"},{"orders":35,"value":"合作经营企业（港或澳、台资）"},{"orders":36,"value":"港、澳、台商独资经营企业"},{"orders":37,"value":"港、澳、台商投资股份有限公司"},{"orders":38,"value":"其他港、澳、台商投资企业"},{"orders":39,"value":"外商投资企业"},{"orders":40,"value":"中外合资经营企业"},{"orders":41,"value":"中外合作经营企业"},{"orders":42,"value":"外资企业"},{"orders":43,"value":"外商投资股份有限公司"},{"orders":44,"value":"其他外商投资企业"},{"orders":45,"value":"军队单位"}],
            certificateList:[{"orders":46,"value":"居民身份证"},{"orders":47,"value":"军官证"},{"orders":48,"value":"武警警官证"},{"orders":49,"value":"士兵证"},{"orders":50,"value":"军队离退休干部证"},{"orders":51,"value":"残疾人证"},{"orders":52,"value":"残疾军人证（1-8 级）"},{"orders":53,"value":"护照"},{"orders":54,"value":"港澳同胞回乡证"},{"orders":55,"value":"港澳居民来往内地通行证"},{"orders":56,"value":"中华人民共和国往来港澳通行证"},{"orders":57,"value":"台湾居民来往大陆通行证"},{"orders":58,"value":"大陆居民往来台湾通行证"},{"orders":59,"value":"外交官证"},{"orders":60,"value":"领事馆证"},{"orders":61,"value":"海员证"},{"orders":62,"value":"香港身份证"},{"orders":63,"value":"台湾身份证"},{"orders":64,"value":"澳门身份证"},{"orders":65,"value":"外国人身份证件"},{"orders":66,"value":"高校毕业生自主创业证"},{"orders":67,"value":"就业失业登记证"},{"orders":68,"value":"台胞证"},{"orders":69,"value":"退休证"},{"orders":70,"value":"离休证"},{"orders":71,"value":"其它证件"}]
        }
    },
    // watch: {
    //     'models.dialogVisible'(newVal,oldVal){
    //         if(this.models.dialogVisible){
    //             this.loadData()
    //         }
    //     }
    // },
    mounted(){
        console.log("获取==corpInfo===")
        this.loadData();
    },
    methods: {
        loadData(){
             this.util.restGet('/api_v1/construction/realNameSystem/corpInfo',null,(res)=>{
                console.log("corpInfo===",res)
                console.log("legalManIDCardNumber==="+res.data.legalManIdcardNumber)
                if(res.status==200&&res.data){
                	console.log('res.data',res.data)
                    this.mainData=res.data
                    this.cookieUtil.set("corpInfo", res.data, 7200);
                }else{
                    this.mainData={};
                    this.util.error(res.errorMsg)
                }
            })
        },
        saveCorpInfo(){
            
            if(!this.validUtil.isNotEmpty(this.mainData.creditCode)){
                this.util.error('请输入信用代码')
                return;
            }
            if(!this.validUtil.isNotEmpty(this.mainData.address)){
                this.util.error('请输入营业地址')
                return;
            }
            if(!this.validUtil.isNotEmpty(this.mainData.website)){
                this.util.error('请输入企业网址')
                return;
            }
            if(!this.validUtil.isNotEmpty(this.mainData.legalManIdcardType)){
                this.util.error('请选择证件类型')
                return;
            }
            if(!this.validUtil.isNotEmpty(this.mainData.legalManIdcardNumber)){
                this.util.error('请输入证件号码')
                return;
            }
           
            console.debug(this.mainData);
           this.util.restPut('/api_v1/modules/corpInfo/'+this.mainData.id,this.mainData,(res)=>{
                if(res.status==200){
                    this.util.success('保存成功!')
                    this.models.dialogVisible=false
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        }
    },
}
</script>
<style scoped>
.select-msg-box{
    color: #333;
    line-height: 1;
    height: auto;
    margin: 20px 0;
    position: relative;
    text-align: left;
}
.select-msg-ele{
    width: 100%;
    line-height: 38px;
    height: 38px;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 1px ;
    box-sizing: border-box;
}

</style>
<style>
.change-psw-box .el-dialog__body{
    padding: 0 20px;
}
.jrjy .el-input--mini .el-input__inner {
    padding-left: 10px;
    border: 1px solid #dcdfe6;
    /*color: rgba(51,51,51,1);*/
  }
  .jrjy .el-input__inner {
    color: rgba(51,51,51,1);
  }
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
</style>

