<template>
<div>
    <div v-if="defaultConfig.hasButton" class="jrsoft-upload">
        <!-- <el-upload ref="upload" class="upload-demo" list-type="picture" :before-upload="beforeUpload" :file-list="fileArr" :limit="config!= undefined && config.limit!= undefined?config.limit:defaultConfig.limit" :on-exceed="onExceed" :before-remove="onBeforeRemove" :on-change="onChange"  :on-preview="onPreview"  :on-remove="onRemove"  :on-success="onSuccess"  :on-error="onError"  :on-progress="onProgress"  :action="uploadActionUrl"  :data="params" :multiple="config!= undefined && config.multiple != undefined?config.multiple:defaultConfig.multiple"> -->
    <el-upload ref="upload" class="upload-demo" style="" :accept="defaultConfig.accept"  :list-type="defaultConfig.listType" :before-upload="beforeUpload" :file-list="fileArr" :limit="defaultConfig.limit"  :on-exceed="onExceed" :before-remove="onBeforeRemove" :on-change="onChange"  :on-preview="onPreview"  :on-remove="onRemove"  :on-success="onSuccess"  :on-error="onError"  :on-progress="onProgress"  :action="uploadActionUrl"  :data="params" :multiple="defaultConfig.multiple">
        <el-button v-if="!readOnly && defaultConfig.listType == 'picture'" size="mini" icon="el-icon-upload" type="primary" style="margin-right:10px;    float: left;">选择文件</el-button>
        <i v-if="!readOnly  && defaultConfig.listType == 'picture-card'" class="el-icon-plus"></i>
    <!-- <div slot="tip" class="el-upload__tip" style="width: 400px;">只能上传jpg/png文件，且不超过{{ parseInt((config!= undefined && config.limitSize!= undefined?config.limitSize:defaultConfig.limitSize)/1024)}}kb</div> -->
        <div v-if="!readOnly" slot="tip" class="el-upload__tip" style="width: 400px;line-height:28px;">{{defaultConfig.tips == ''?'':defaultConfig.tips+'，'}}{{defaultConfig.acceptMsg == ''?'':defaultConfig.acceptMsg+'，'}}{{ defaultConfig.limitSize>1048576?('文件不超过'+parseInt(defaultConfig.limitSize/1048576)+'Mb'):('文件不超过'+parseInt(defaultConfig.limitSize/1024)+'kb')}}</div>
    </el-upload>
    
    </div>
    <div v-else class="jrsoft-upload ncy-upload">
        <el-upload ref="upload" style="display: block" :accept="defaultConfig.accept"  :list-type="defaultConfig.listType" :before-upload="beforeUpload" :file-list="fileArr" :limit="defaultConfig.limit"  :on-exceed="onExceed" :before-remove="onBeforeRemove" :on-change="onChange"  :on-preview="onPreview"  :on-remove="onRemove"  :on-success="onSuccess"  :on-error="onError"  :on-progress="onProgress"  :action="uploadActionUrl"  :data="params" :multiple="defaultConfig.multiple"></el-upload>
    </div>
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
  name:'Upload',
  props: {
    config: {
      type: Object,
      default: function () {
        return {}
      }
    },
    readOnly: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    filesList: {
      type: Array,
      default: function () {
        return []
      }
    },
    deleteFilesList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
    data() {
        return {
            defaultConfig: {
                listType:'picture',//还可以可以设置picture
                xtype: null,//同一个表单区别多个附件上传块
                limit: 100,//限制附件上传个数
                limitSize: 209715200,//200mb单个附件上传大小
                tips:'',
                multiple: true,//是否允许多选
                accept:".jpg,.jpeg,.png,.gif,.grf,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.pdf,.PDF,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.xlsx,.zip,.rar,.txt",
                acceptMsg: '',//提示信息，默认是限制大小
                autoLoad: true,//是否表单打开自动执行loadData加载附件
                readOnly: true,//设置是否只读
                hasButton: true
            },
            params: {},
            officePng: {
                excelUrl: require('../../assets/office/excel.png'),
                wordUrl: require('../../assets/office/word.png'),
                pptUrl: require('../../assets/office/ppt.png'),
                pdfUrl: require('../../assets/office/pdf.png'),
                txtUrl: require('../..//assets/office/txt.png'),
                fileUrl: require('../../assets/office/file.png'),
                zipUrl: require('../../assets/office/zip.png'),
                dwgUrl: require('../../assets/office/dwg.png')
            },
            deleteFilesArr: [],
            uploadActionUrl: "",
            fileArr: []
        };
    },
    created() {
        this.util.init(this);
    },
    mounted() {

        if (this.config.hasButton != undefined && !this.config.hasButton) {
            this.defaultConfig.hasButton = false;
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
      if (this.config.tips != undefined && this.config.tips) {
        this.defaultConfig.tips = this.config.tips;
      }
        this.config.deleteFilesList = []
        this.config.filesList = []
      // console.log('----------uploading-----------', this.config, this.filesList, this.deleteFilesList)
      if(this.deleteFilesList){
          this.deleteFilesArr = this.deleteFilesList
      }

        this.uploadActionUrl = this.util.getBaseUrl() +"/api_v1/files/temp?&access_token=" +this.sessionUtil.getAccessToken();
        this.loadData();
    },
    methods: {
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
            // console.info("=======onChange========");
        },
        beforeUpload(file, fileList) {
            var type =  file.name.substring(file.name.lastIndexOf(".")+1);
            var acceptTypeArr = this.defaultConfig.accept.split(',');
            var ifAccept = false;
            for(var i = 0;i<acceptTypeArr.length;i++){
                var acceptType =acceptTypeArr[i];
                acceptType = acceptType.substring(acceptType.indexOf('.')+1)
                acceptType = acceptType.toLowerCase();
                if(type.indexOf(acceptType)>-1){
                    ifAccept =  true;
                    break;
                }
            }
            if(!ifAccept){
                 this.util.warn("您上传的文件类型不符！");
                return false;
            }
            if (file.size > this.defaultConfig.limitSize) {
                this.util.warn("您的文件超过指定大小：" + this.defaultConfig.limitSize);
                return false;
            }
            this.uploadActionUrl =
            this.util.getBaseUrl() +
            "/api_v1/files/temp?&access_token=" +
            this.sessionUtil.getAccessToken();
            this.$emit('on-before-upload', file)
            return true;
            // }
            // return false;
        },
        onBeforeRemove(file, fileList) {
            var _this = this;
            if (this.readOnly) {
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
                        console.info("=====delete=====");
                        _this.util.restDelete(url, { id: file.data.id, suffix: file.data.suffix }, function (result) {
                            if (result.status == true || result.status == 200) {
                                _this.fileArr = _this.fileArr.filter(item => {
                                    return item.uid != file.uid;
                                });
                                _this.getFilesList();

                              _this.$emit('on-remove', file)// 回调父页面监听事件
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
                        _this.deleteFilesArr.push(file.data.id);
                        _this.config.deleteFilesList = _this.deleteFilesArr;

                      _this.$emit('on-remove', file)// 回调父页面监听事件
                    }

                });
            }
            return false;
        },
        onSuccess(response, file, fileList) {
            file.data = file.response.data;
            if(file.data!=undefined){
                file.data.xtype = this.defaultConfig.xtype;
            }
            var type = file.raw.type == '' ? file.data.suffix : file.raw.type;
            type = type.toLowerCase();
            // console.info("=======onSuccess========" + response.status);
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
            this.fileArr = fileList;
            this.getFilesList();
            this.$emit('on-success', file)// 回调父页面监听事件
        },
        onError(err, file, fileList) {
            console.info("=======onError========");
        },
        onProgress(event, file, fileList) {
            // console.info("=======onProgress========");
        },
        onExceed(file, fileList) {
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
            return data
        },
      getDeleteFilesList() {
        return this.deleteFilesArr
      },
      getFilesArr() {// 获取附件列表，包含已经保存的未保存的

        return this.fileArr
      },
        loadData(id) {
            this.fileArr = [];

          if(this.filesList){
            let fileArr = []
            this.filesList.forEach(item => {
              let file = {...item}
              file.data = {...file}
              file.isNewFlag = true
              file.name = file.fileName
              file.url = this.util.getBaseUrl() + "/api_v1/files/temp/" + file.data.id + "/look?&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + file.data.id + "&suffix=" + file.data.suffix + "&fileName=" + encodeURIComponent(file.data.fileName);
              fileArr.push(file)
            })
            this.fileArr = fileArr
          }
            //如果自动加载
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
                this.util.restGet('/api_v1/files', { parentId: id, xtype: this.defaultConfig.xtype }, function (res) {
                    if (res.status == 200) {
                        if (res.data != undefined && res.data.length > 0) {
                             console.log(res.data);
                             let fileArr = []
                            for (var i in res.data) {

                                var item = res.data[i];
                                // 判断是否已经删除，一般这种情况用于明细表上传
                              let find = _this.deleteFilesArr.find( delId => {
                                return delId === item.id
                              })
                              if(find){
                                continue
                              }
                                item.isNewFlag = false;
                                item.name = item.fileName;
                                item.url = _this.getUrl(item, item.suffix, false);
                                item.data = item;
                              fileArr.push(item);
                            }
                          _this.fileArr = fileArr.concat(_this.fileArr)
                            //console.info(_this.fileArr);
                            _this.updaeStyle()

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
                        //$(item).html('<div style="width:100%;"><span style="width:60% ;display: inline-block;">' + file.data.fileName + '</span><span style="width:10% ;display: inline-block;color: #b5b5b5;">' + file.data.size + '</span><span style="margin-left:10px;display: inline-block;color: #b5b5b5;">' + createTime + '</span><span style="margin-left:10px;display: inline-block;color: #b5b5b5;">' + createUserName + '</span></div>')
                        //console.info($(item).html());
                        $(item).html('<div style="width:100%;"><span style="width:60% ;display: inline-block;">' + file.data.fileName + '</span><span style="margin-left:10px;display: inline-block;color: #b5b5b5;width:50px;"><button onclick="event.stopPropagation();openDownload('+index+',\''+file.data.id+'\',\''+file.data.fileName+'\','+file.isNewFlag+')" circle type="button" class="el-button el-button--mini is-round" icon="el-icon-download"><i class="el-icon-download icon-download"></i></button></span><span style="width:10% ;display: inline-block;color: #b5b5b5;">' + file.data.size + '</span><span style="margin-left:10px;display: inline-block;color: #b5b5b5;">' + createTime + '</span><span style="margin-left:10px;display: inline-block;color: #b5b5b5;">' + createUserName + '</span></div>') //<i class="el-icon-download"></i>
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

<style>
    .ncy-upload .el-upload{
        display: block;
    }
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
