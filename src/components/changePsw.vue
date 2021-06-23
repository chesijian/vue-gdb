<template>
    <div class="change-psw-box">
        <el-dialog
            title="修改密码"
            :visible.sync="models.dialogVisible"
            width="30%">
            <div class="select-msg-box" v-if="data.isOldpsw">
                <span style="display:block" class="must">原密码</span>&nbsp;&nbsp;
                <el-input v-model="data.old" type="password" size="mini" class="select-msg-ele" placeholder="请输入原密码" style="padding-left: 10px;overflow: hidden;"></el-input>
            </div>
            <div class="select-msg-box" >
                <span style="display:block" class="must">新密码</span>&nbsp;&nbsp;
                <el-input v-model="data.new" type="password" size="mini" class="select-msg-ele" placeholder="请输入新密码" style="padding-left: 10px;overflow: hidden;"></el-input>
            </div>
            <div class="select-msg-box" >
                <span style="display:block" class="must">再次输入密码</span>&nbsp;&nbsp;
                <el-input v-model="data.repeatNew" type="password" size="mini" class="select-msg-ele" placeholder="请再次输入密码" style="padding-left: 10px;overflow: hidden;"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="models.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="SaveProj">确 定</el-button>
            </span>
    </el-dialog>
      </div>
</template>
<script>
export default {
    props:['models'],
    data() {
        return {
            data:{
                old:'',
                new:'',
                repeatNew:'',
                isOldpsw:true,
            },
        }
    },
    watch: {
        'models.dialogVisible'(newVal,oldVal){
            if(this.models.dialogVisible){
                this.loadData()
            }
        }
    },
    methods: {
        loadData(){
             this.util.restGet('/api_v1/org/users/'+this.sessionUtil.getUserUid()+'/pwd',null,(res)=>{
                console.log(res)
                if(res.status==200){
                    if(res.data.noSet){
                        this.data.isOldpsw=false
                    }else{
                        this.data.isOldpsw=true
                    }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        SaveProj(){
            console.log(2311)
            if(this.data.isOldpsw&&!this.validUtil.isNotEmpty(this.data.old)){
                this.util.error('请输入原密码')
                return;
            }
            if(!this.validUtil.isNotEmpty(this.data.new)){
                this.util.error('请输入新密码')
                return;
            }
            if(!this.validUtil.isNotEmpty(this.data.repeatNew)){
                this.util.error('请再次输入新密码')
                return;
            }
            if(this.data.repeatNew!=this.data.new){
                this.util.error('两次输入不一致')
                return;
            }
           this.util.restPut('/api_v1/org/users/'+this.sessionUtil.getUserUid()+'/pwd',{newPwd:this.data.new,oldPwd:this.data.old},(res)=>{
                if(res.status==200){
                    this.util.success('修改成功，重新登录')
                    this.models.dialogVisible = false
                    this.cookieUtil.clearSession();
                    this.cookieUtil.clearAll();
                    this.$router.push({ path: '/login' });
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
</style>

