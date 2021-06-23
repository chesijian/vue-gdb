<template>
    <div class="jrsoft-upload">
    <!-- <el-upload ref="upload" class="upload-demo" list-type="picture" :before-upload="beforeUpload" :file-list="fileArr" :limit="config!= undefined && config.limit!= undefined?config.limit:defaultConfig.limit" :on-exceed="onExceed" :before-remove="onBeforeRemove" :on-change="onChange"  :on-preview="onPreview"  :on-remove="onRemove"  :on-success="onSuccess"  :on-error="onError"  :on-progress="onProgress"  :action="uploadActionUrl"  :data="params" :multiple="config!= undefined && config.multiple != undefined?config.multiple:defaultConfig.multiple"> -->
  <el-upload ref="upload" class="upload-demo" style="position:relative;"  :list-type="defaultConfig.listType" :before-upload="beforeUpload" :file-list="fileArr" :limit="defaultConfig.limit" :on-exceed="onExceed" :before-remove="onBeforeRemove" :on-change="onChange"  :on-preview="onPreview"  :on-remove="onRemove"  :on-success="onSuccess"  :on-error="onError"  :on-progress="onProgress"  :action="uploadActionUrl"  :data="params" :multiple="defaultConfig.multiple">
 

    <button v-if="!addbtn && !defaultConfig.readOnly && defaultConfig.listType == 'picture'" style="background:#5c9ad4">点击上传</button>
    <img src="../../assets/indexImg/addfile.png" width="18" alt="" style="position:absolute;right:0;top:-15px;"  v-if="addbtn && !defaultConfig.readOnly && defaultConfig.listType == 'picture'">
    <el-button size="small" type="primary" style="position:absolute;right:0;top:-15px;" v-if="addbtn && !defaultConfig.readOnly && defaultConfig.listType == 'picture'">点击上传</el-button>
    <!-- <img src="../../assets/indexImg/addfile.png" width="18" alt="" style="position:absolute;right:0;top:-15px;"  v-if="addbtn && !defaultConfig.readOnly && defaultConfig.listType == 'picture'"> -->
  
  <i v-if="!defaultConfig.readOnly  && defaultConfig.listType == 'picture-card'" class="el-icon-plus"></i>
  <!-- <div slot="tip" class="el-upload__tip" style="width: 400px;">只能上传jpg/png文件，且不超过{{ parseInt((config!= undefined && config.limitSize!= undefined?config.limitSize:defaultConfig.limitSize)/1024)}}kb</div> -->
  <div v-if="!addbtn && !defaultConfig.readOnly" slot="tip" class="el-upload__tip" style="width: 400px;margin: 0 auto;">{{defaultConfig.acceptMsg == ''?'':defaultConfig.acceptMsg+'，'}}{{ defaultConfig.limitSize>1048576?('文件不超过'+parseInt(defaultConfig.limitSize/1048576)+'Mb'):('文件不超过'+parseInt(defaultConfig.limitSize/1024)+'kb')}}</div>
 
</el-upload>
<!-- <el-button class="button-blue" type="primary" @click="updaeStyle()">修改样式</el-button> -->
    </div>
</template>
<script>
window.openDownload = function(index,id,fileName,isNewFlag){
    let accessToken = window.vm_app.sessionUtil.getAccessToken()
    let suffix = fileName.substring(fileName.lastIndexOf('.')+1)
    let url = window.vm_app.util.getBaseUrl()
    if (isNewFlag) {
      url = url + '/api_v1/files/temp/' + id + '/download?&access_token=' + accessToken + '&suffix=' + suffix + '&fileName=' + encodeURIComponent(fileName)
    } else {
      url = url + '/api_v1/files/' + id + '/download?&access_token=' + accessToken + '&suffix=' + suffix + '&fileName=' + encodeURIComponent(fileName)

    }
    window.open(url)
}
import $ from 'jquery';
export default {
    props: ['config','addbtn'],
    data() {
        return {
            defaultConfig: {
                listType:'picture',//还可以可以设置picture
                xtype: null,//同一个表单区别多个附件上传块
                limit: 1,//限制附件上传个数
                limitSize: 52428800,//50mb单个附件上传大小
                multiple: true,//是否允许多选
                accept:".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.pdf,.PDF,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.xlsx,.zip,.rar,.txt",
                acceptMsg: '',//提示信息，默认是限制大小
                autoLoad: true,//是否表单打开自动执行loadData加载附件
                readOnly: true//设置是否只读
            },
            params: {},
            officePng: {
                excelUrl: require('../../assets/office/excel.png'),
                wordUrl: require('../../assets/office/word.png'),
                pptUrl: require('../../assets/office/ppt.png'),
                pdfUrl: require('../../assets/office/pdf.png'),
                txtUrl: require('../../assets/office/txt.png'),
                fileUrl: require('../../assets/office/file.png'),
                zipUrl: require('../../assets/office/zip.png'),
                dwgUrl: require('../../assets/office/dwg.png')
            },
            deleteFilesList: [],
            uploadActionUrl: "",
            cadToImage: false,
            pdfToImage: false,
            fileArr: []
        };
    },
    created() {
        this.util.init(this);

    },
    mounted() {
        if (this.config.readOnly != undefined && !this.config.readOnly) {
            this.defaultConfig.readOnly = false;
        }
        if (this.config.limit != undefined && this.config.limit) {
            this.defaultConfig.limit = this.config.limit;
        }
        if (this.config.limitSize != undefined && this.config.limitSize) {
            this.defaultConfig.limitSize = this.config.limitSize;
        }
        if (this.config.autoLoad != undefined && this.config.autoLoad) {
            this.defaultConfig.autoLoad = this.config.autoLoad;
        }
        if (this.config.xtype != undefined && this.config.xtype) {
            this.defaultConfig.xtype = this.config.xtype;
        }
        if (this.config.accept != undefined && this.config.accept) {
            this.defaultConfig.accept = this.config.accept;
        }
        if (this.config.acceptMsg != undefined && this.config.acceptMsg) {
            this.defaultConfig.acceptMsg = this.config.acceptMsg;
        } 
        if (this.config.listType != undefined && this.config.listType) {
            this.defaultConfig.listType = this.config.listType;
        }
        if (this.config.cadToImage) {
            this.defaultConfig.cadToImage = true
        }else{
            this.defaultConfig.cadToImage = false
        }
        if (this.config.pdfToImage) {
            this.defaultConfig.pdfToImage = true
        }else{
            this.defaultConfig.pdfToImage = false
        }
        this.config.deleteFilesList = [],
        this.config.filesList = [],
        this.uploadActionUrl = this.util.getBaseUrl() +"/api_v1/files/temp?&access_token=" +this.sessionUtil.getAccessToken()+"&formKey="+this.config.formKey;
        this.loadData();
    },
    methods: {
        clearArr(){
            this.fileArr=[] 
            this.deleteFilesList=[] 
        },
        onPreview (file) {
            var url = null
            let baseUrl = this.util.getBaseUrl()
            if (file.isNewFlag) {
                url = baseUrl + '/api_v1/files/temp/' + file.data.id + '/look?&access_token=' + this.sessionUtil.getAccessToken() + '&id=' + file.data.id + '&suffix=' + file.data.suffix + '&fileName=' + encodeURIComponent(file.data.fileName)
                
            } else {
                url = baseUrl + '/api_v1/files/' + file.data.id + '/look?&access_token=' + this.sessionUtil.getAccessToken() + '&id=' + file.data.id + '&suffix=' + file.data.suffix + '&fileName=' + encodeURIComponent(file.data.fileName)
                
            }
            window.open(url)
        },
        onRemove(file, fileList) {
            console.info("=======onRemove========");
        },
        onChange(file, fileList) {
            console.info("=======onChange========");
        },
        beforeUpload(file, fileList) {
            var type =  file.name.substring(file.name.lastIndexOf(".")+1);
            // var acceptTypeArr = this.defaultConfig.accept.split(',');
            // var ifAccept = false;
            // for(var i = 0;i<acceptTypeArr.length;i++){
            //     var acceptType =acceptTypeArr[i];
            //     acceptType = acceptType.substring(acceptType.indexOf('.')+1)
            //     acceptType = acceptType.toLowerCase();
            //     console.info("acceptType====="+acceptType);
            //     if(type.indexOf(acceptType)>-1){
            //         ifAccept =  true;
            //         break;
            //     }
            // }
            // if(!ifAccept){
            //      this.util.warn("您上传的文件类型不符！");
            //     return false;
            // }
            if (file.size > this.defaultConfig.limitSize) {
                this.util.warn("您的文件超过指定大小：" + this.defaultConfig.limitSize);
                return false;
            }
            this.uploadActionUrl =
                this.util.getBaseUrl() +
                "/api_v1/files/temp?&access_token=" +
                this.sessionUtil.getAccessToken()+"&formKey="+this.config.formKey;
            if(this.defaultConfig.cadToImage){
                this.params.cadToImage = true
            }else{
                this.params.cadToImage = false
            }
            if(this.defaultConfig.pdfToImage){
                this.params.pdfToImage = true
            }else{
                this.params.pdfToImage = false
            }
            return true;
            
        },
        onBeforeRemove(file, fileList) {
            var _this = this;
            if (this.defaultConfig.readOnly) {
                return false;
            }
            if (file.status == 'ready') {
                //表示不符合规范
                _this.fileArr = _this.fileArr.filter(item => {
                    return item.uid != file.uid;
                });
                this.getFilesList();
            } else {
                var url = "/api_v1/files/temp/{id}";
 
                _this.util.confirm("您确认要删除吗？", "温馨提示", function () {
                    // console.info("=====delete=11===="+(_this.validUtil.isNotEmpty(file.isNew) && file.isNew));
                    if (_this.validUtil.isNotEmpty(file.isNew) && file.isNew) {
                        _this.util.restDelete(url, { id: file.data.id, suffix: file.data.suffix }, function (result) {
                            if (result.status == true || result.status == 200) {
                                _this.fileArr = _this.fileArr.filter(item => {
                                    return item.uid != file.uid;
                                });
                                _this.getFilesList();
                                _this.util.success("文件删除成功!");
                            } else {
                                _this.util.error("文件删除失败!" + result.msg);
                            }
                        }
                        );
                    } else {
                        _this.fileArr = _this.fileArr.filter(item => {
                            return item.uid != file.uid;
                        });
                        _this.getFilesList();
                        _this.deleteFilesList.push(file.data.id);
                        _this.config.deleteFilesList = _this.deleteFilesList;
                    }
 
                });
            }
            return false;
        },
        onSuccess(response, file, fileList) {
            this.util.unmask();
            file.data = file.response.data;
            file.data.xtype = this.defaultConfig.xtype;
            
            var type = file.raw.type == '' ? file.data.suffix : file.raw.type;
            type = type.toLowerCase();
            if (response.status == 200) {
                file.isNewFlag = true;
                file.url = this.getUrl(file.data, type, true)
                file.name = file.name + " " + file.response.data.size;
                this.updaeStyle();
                this.util.success("文件上传成功!");
            } else {
                this.util.error("文件上传失败!");
                this.fileArr = this.fileArr.filter(item => {
                    return item.uid != file.uid;
                });
            }
            let fileArr =[];
            fileList.forEach(item=>{
                let data = item.data;
                if(data&&data.image){
                    let imageObj ={
                        data:data.image,
                        name:data.image.fileName,
                        isNewFlag:true
                    }
                    fileArr.push(imageObj);
                    delete data.image;
                }
                fileArr.push(item);
            });
            this.fileArr = fileArr;
            // this.fileArr = fileList;
            this.getFilesList();
        },
        onError(err, file, fileList) {
            console.info("=======onError========");
        },
        onProgress(event, file, fileList) {
            console.info("=======onProgress========");
            this.util.mask("正在上传..");
        },
        onExceed(file, fileList) {
            console.info("=======onExceed========");
            this.util.warn("只能上传" + this.config.limit + "个文件!");
        },
        getFilesList() {//保存业务数据获取附件列表
            var data = new Array();
            for (var i = 0; i < this.fileArr.length; i++) {
                var file = this.fileArr[i];
                if (this.validUtil.isNotEmpty(file.isNewFlag) && file.isNewFlag) {
                    data.push(file.data);
                }
            }
            this.config.filesList = data;
        },
        loadData(id) {
            //如果自动加载
            // this.fileArr=[] 
            if (this.defaultConfig.autoLoad) {
                var _this = this;
                if (!this.validUtil.isNotEmpty(id)) {
                    //先看config中有没有设置
                    if (!this.validUtil.isNotEmpty(this.config.id)) {
                        //先看config中有没有设置
                        id = this.util.getUrlParam("id");
                    } else {
                        id = this.config.id;
                    }
                }

                if (!this.validUtil.isNotEmpty(id)) {
                    return;
                }
                this.util.restGet('/api_v1/files', { parentId: id, xtype: this.defaultConfig.xtype }, (res)=> {
                    if (res.status == 200) {
                        if (res.data != undefined && res.data.length > 0) {
                            for (var i in res.data) {
                                var item = res.data[i];
                                item.isNewFlag = false;
                                item.name = item.fileName;
                                item.url = this.getUrl(item, item.suffix, false);
                                item.data = item;
                                console.info("url====" + item.src);
                                this.fileArr.push(item);
                            }
 
                            this.updaeStyle()
                            
                        }
                    }
                });
            }
        },
        updaeStyle() {
            if(this.defaultConfig.listType == 'picture-card'){
                return;
            }
            var _this = this;
            if (_this.fileArr.length > 0) {
                var dom = $(".el-upload-list__item")
                if ( dom.length!= _this.fileArr.length) {
                   setTimeout(function(){_this.updaeStyle()}, 500);
                } else {
                    dom = $(".el-upload-list__item-name");
                    dom.each(function (index, item) {
                        var file = _this.fileArr[index];
                        var createTime = file.data.createTime == undefined ?new Date().format('yyyy-MM-dd'):file.data.createTime.substring(0, 11);
                        var createUserName = file.data.createUserName;
                        // $(item).html('<div style="width:100%;"><span style="width:60% ;display: inline-block;">' + file.data.fileName + '</span><span style="width:10% ;display: inline-block;color: #b5b5b5;">' + file.data.size + '</span><span style="width:10% ;display: inline-block;color: #b5b5b5;">' + createTime + '</span><span style="width:20% ;display: inline-block;color: #b5b5b5;">' + createUserName + '</span></div>')
                        $(item).html('<div style="width:100%;"><span style="width:60% ;display: inline-block;">' + file.data.fileName + '</span><span style="margin-left:10px;display: inline-block;color: #b5b5b5;width:50px;"><button onclick="event.stopPropagation();openDownload('+index+',\''+file.data.id+'\',\''+file.data.fileName+'\','+file.isNewFlag+')" circle type="button" class="el-button el-button--mini is-round" icon="el-icon-download"><i class="el-icon-download icon-download"></i></button></span></div>') 
                    });
                }
            }
        },
        getUrl(data, type, isNewFlag) {
            var url = null;
            type = type.toLowerCase();
            //console.info("unloading=======getUrl========" + type);
            if (type.indexOf("image") > -1 || type.indexOf("jpg") > -1 || type.indexOf("jpeg") > -1 || type.indexOf("png") > -1 || type.indexOf("gif") > -1 || type.indexOf("bpm") > -1) {
                if (isNewFlag) {
                    url = this.util.getBaseUrl() + "/api_v1/files/temp/" + data.id + "/look?ifThumb=true&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + data.id + "&suffix=" + data.suffix + "&fileName=" + encodeURIComponent(data.fileName);
                } else {
                    url = this.util.getBaseUrl() + "/api_v1/files/" + data.id + "/look?ifThumb=true&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + data.id + "&suffix=" + data.suffix + "&fileName=" + encodeURIComponent(data.fileName);
                }
                if (data.raw == undefined) {
                    data.raw = {};
                    data.raw.type = 'image/jpeg';
                }
 
            } else if (type.indexOf("word") > -1 || type.indexOf("doc") > -1 || type.indexOf("docx") > -1) {
                url = this.officePng.wordUrl;
            } else if (type.indexOf("excel") > -1 || type.indexOf("sheet") > -1 || type.indexOf("xls") > -1 || type.indexOf("xlsx") > -1) {
                url = this.officePng.excelUrl;
            } else if (type.indexOf("powerpoint") > -1 || type.indexOf("ppt") > -1 || type.indexOf("pptx") > -1) {
                url = this.officePng.pptUrl;
            } else if (type.indexOf("pdf") > -1) {
                url = this.officePng.pdfUrl;
            } else if (type.indexOf("text") > -1 || type.indexOf("txt") > -1) {
                url = this.officePng.txtUrl;
            } else if (type.indexOf("dwg") > -1) {
                url = this.officePng.dwgUrl;
            } else if (type.indexOf("rar") > -1 || type.indexOf("zip") > -1) {
                url = this.officePng.zipUrl;
            } else {
                url = this.officePng.fileUrl;
            }
            return url;
        },
        update() {
            for (var i = 0; i < this.fileArr.length; i++) {
                var file = this.fileArr[i];
                file.isNewFlag = false;
            }
        },
        uploaderCallback(e) { },
        downloadTemplate() { },
        cancel() {
            this.$parent.isUploading = false;
        }
    }
};
</script>
 
<style scoped>
.icon-download{
  margin-right: 0px!important;
  color: #333333!important;
  left:0!important;
  top:0!important;
  position: inherit!important;
  font-family: element-icons!important;
  font-size: 13px!important;
  speak: none!important;
  font-style: normal!important;
  font-weight: 400!important;
  font-variant: normal!important;
  text-transform: none!important;
  line-height: 1!important;
  vertical-align: baseline!important;
  display: inline-block!important;
  -webkit-font-smoothing: antialiased!important;
}
</style>