<template>
    <div class="change-psw-box">
        <el-dialog title="修改头像" :visible.sync="models.dialogVisible"  width="30%">
            
            <div style="text-align: center;" @mouseover="overShow=true"  @mouseleave="overShow=false">
                <el-upload class="avatar-uploader" :action="uploadActionUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 160px;height: 160px;">
                <img v-else :src="replayUpload" class="avatar" style="background:rgba(0,0,0,0.5)">
                <img style="height: 160px;width: 160px;position: absolute;left: 151px;top: 52px;background:rgba(0,0,0,0.5)" v-show="overShow" src="../assets/indexImg/reupdata.png" alt="">
                <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                </el-upload>
            </div>
            <!-- <div style="height:154px;width:100%;position:absolute;left:0;top:0;background:rgba(0,0,0,0.5)" v-show="overShow" >
                <img style="height:100px;margin-top:27px" src="../assets/indexImg/reupdata.png" alt="">
            </div> -->
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
            overShow:false,
            defaultLogo:require('@/assets/sflogo.jpg'),
            replayUpload:require('@/assets/indexImg/reupdata.png'),
            imageUrl:"",
            // uploadActionUrl : this.util.getBaseUrl() +"/api_v1/files/temp?&access_token=" +this.sessionUtil.getAccessToken(),
            uploadActionUrl:"",
            fileList:[]
        }
    }, 
    mounted(){
        this.imageUrl=this.sessionUtil.getUser().picture;
    },
    methods: {
        beforeAvatarUpload(file, fileList) {
            const isJPG = file.type.substring(0,5) === 'image';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('请上传图片格式头像!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            this.uploadActionUrl = this.util.getBaseUrl() +"/api_v1/files/temp?&access_token=" +this.sessionUtil.getAccessToken();
            return isJPG && isLt2M;
        },
        handleAvatarSuccess(response, file, fileList) {
            file.data = file.response.data;
            if (response.status == 200) {
                this.imageUrl = this.util.getBaseUrl() + "/share/temp/" + file.data.id + "/look?ifThumb=true";
                this.util.success("上传成功!");
            } else {
                this.util.error("上传失败!");
            }
            this.fileList = fileList;
        },
        SaveProj(){
            if(this.fileList.length==0){
                this.util.error('请上传新的头像')
                return;
            }
            var mainData={
                PICTURE_:this.util.getBaseUrl() + "/share/" + this.fileList[0].data.id + "/look?ifThumb=true"
            }
            var filesData = [this.fileList[0].data];
           var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"ORG_USER",filesData: JSON.stringify(filesData),ifSaveWorkflow:false};
            params['id']=this.sessionUtil.getUserUid();
            params['businessKey']=this.sessionUtil.getUserUid();
            this.util.mask("正在保存..");
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.util.success('修改成功，下次登录时生效')
                    this.models.dialogVisible = false
                }
        
            });
           
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

