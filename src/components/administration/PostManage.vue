<template>
    <div class="Post-manage-box box-style">
        <div v-if="isDelete" class="delete-show-box">
            <div class="delete-show">
                <h5 style="font-size:18px;margin:30px 0;font-weight:400" >删除岗位</h5>
                <p>是否确定删除此岗位？</p>
                <div class="delete-show-footer">
                    <button :style="{color:'#fff',backgroundColor:bgColor,borderColor:bgColor}" @click="deleteSave()">提交</button>
                    <button @click="cancelDelete()">取消</button>
                </div>
            </div>
        </div>
        <div v-if="isAdds" class="delete-show-box">
            <div class="add-box">
                <h5 style="font-size:18px;margin:30px 0;font-weight:400">添加岗位</h5>
                <ul>
                    <li>
                        <div >岗位名称 <span class="Required">*</span></div>
                        <input type="text" class="add-input" v-model="postObj.positionName" placeholder="请输入岗位名称">
                    </li>
                    <li>
                         <div >上级岗位</div>
                        <span class="add-input add-input1" @click="checkedPost"  :style="{color:postObj.parentName==undefined? '#C4C4C4':''}" >{{postObj.parentName==undefined? '请选择上级岗位':postObj.parentName}}</span>
                    </li>
                    <li>
                         <div >是否负责岗位</div>
                        <select v-model="postObj.isRespPosition" :style="{color:postObj.isRespPosition==''?'#757575':'#000'}">
                            <option value=''  disabled selected style='display:none;'>请选择</option>
                            <option value="1">是</option>
                            <option value="0">否</option>
                        </select>
                    </li>
                    <li>
                         <div >请设置排序号</div>
                        <input type="text" class="add-input" v-model="postObj.sort" placeholder="用于显示先后顺序，数值小的排前面">
                    </li>
                </ul>
                 <div class="delete-show-footer">
                    <button :style="{color:'#fff',backgroundColor:bgColor,borderColor:bgColor}" @click="SaveData()">提交</button>
                    <button @click="cancel()">取消</button>
                </div>
            </div>
        </div>
        <div  v-if="memberOrPost">
            <selectmore  :models="selectmoreObj" @selectQuarterOut="selectPostionCallback"></selectmore>
        </div>
        <div style="padding-top:44px">
            <div style="position:relative;width:100%;">
                <h4 style="position:absolute;top:-34px;left:0;width:100%;box-sizing:border-box;">岗位管理
                    <div class="button-list">
                        <div class="search" style="overflow:hidden">
                            <input type="text" v-model="search" @keyup.enter="refreshPositionList()" placeholder="请输入关键字搜索">
                            <button @click="refreshPositionList()"></button>
                        </div>
                        <button v-if="sessionUtil.isAllowDelete('org_PositionManage')" style="margin-right: 20px;" @click="deleteSome()">删除</button>
                        <button v-if="sessionUtil.isAllowAdd('org_PositionManage')" :style="{background:bgColor,borderColor:bgColor,color:'#fff'}" @click="add()">添加岗位</button>
                    </div>
                </h4>
            </div>
            <div style="width:100%;height:100%;" ref="tableHeight">
                <el-table ref="multipleTable" :data="positionList" style="width: 100%"
                    :header-row-style="{overflow:'hidden'}"
                    :row-style="{overflow:'hidden',}" border
                    :cell-style="{textAlign:'center',boxShadow:' 0 0 0 0 #D9D9D9, inset 0 0 0 0 #D9D9D9'}"
                    :height="tableHeightNum" :header-cell-style="{height:'34px',padding:0,textAlign:'center'}"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="操作" fixed width="70" v-if="sessionUtil.isAllowEdit('org_PositionManage')||sessionUtil.isAllowDelete('org_PositionManage')">
                        <template slot-scope="scope">
                            <p class="operation">
                            <span v-if="sessionUtil.isAllowEdit('org_PositionManage')" @click="editPost(scope.row)" class="editIcon editIcon1"></span>
                            <span v-if="sessionUtil.isAllowDelete('org_PositionManage')" class="delete  editIcon" @click="deletePost(scope.row)"></span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="岗位名称" width="400">
                        <template slot-scope="scope">
                            <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.positionName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="上级岗位">
                        <template slot-scope="scope">
                            <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.parentName}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import  selectmore  from './selectmore.vue'
export default {
    // props:['positionList'],
    data(){
        return {
            isDelete:false,
            search:"",
            memberOrPost:false,
            isAdds:false,
            postObj:{
                isResp:'请选择',
                isRespPosition:0,//是否负责人岗位
                parentId:null//上级岗位
            },
            selectList:[],
            gangweiList:[],
            bgColor:'',
            tableHeightNum:0,
            selectmoreObj:{},
            fontColor:'',
        }
    },
    components:{
        selectmore,
    },
    computed: {
        ...mapState({
            positionList: state => state.positionList,
            companyUid: state => state.companyUid
        }),
        
    },
    created(){
        this.fontColor=this.$store.state.themeBG
        this.bgColor=this.$store.state.themeColor;
        // this.getPositionList();
    },
    mounted() {
        this.$nextTick(()=>{
            this.tableHeightNum=this.$refs.tableHeight.offsetHeight
        })
    },
    methods:{
        refreshPositionList(){
            this.$store.dispatch('getPositionList',{ companyUid: this.companyUid,search:this.search });
        },
        checkedPost(){
            this.memberOrPost=true;
            this.selectmoreObj={
                title:'选择岗位',
                type:"post",
                centerList:this.positionList,
                selectDatas:[]
            }
        },
        selectPostionCallback(data){
            this.postObj.parentName =data[0].positionName;
            this.postObj.parentId =data[0].id;
        },
        add(){//添加岗位
            this.postObj={
                positionName:"",
                isRespPosition:"",
                //departUid:this.companyUid,
                sort:this.positionList==undefined? 0:this.positionList.length+1,
            };
            this.isAdds=true;
        },
        editPost(data){//编辑岗位
            this.util.clone(data,this.postObj);
            this.isAdds=true;
        },
        SaveData(){
            if (!this.validUtil.isNotEmpty(this.postObj.positionName)) {
                this.util.error('请输入岗位名称!')
                return
            }
            console.log(this.postObj);
            this.util.mask("正在保存...");
            //this.util.post(this.postObj.id == undefined ? '/org/position/create' : '/org/position/update', this.postObj, (res)=> {
              this.util.request(this.postObj.id == undefined ? 'POST' : 'PUT',this.postObj.id == undefined ? '/api_v1/org/positions' : '/api_v1/org/positions/{id}', this.postObj, (res) => {
         
              // console.info(res);
                if (res['status'] == 200) {
                    this.$store.dispatch('getPositionList',{ companyUid: this.companyUid });
                    this.util.success("保存成功！");
                }else{
                    this.util.error(res.errorMsg);
                } 
                this.util.unmask();
            });
            this.cancel()
        },
        deletePost(obj){
            this.util.confirm('确定要删除此岗位吗?','删除岗位',(result)=>{
                this.util.mask("正在删除..");
                //this.util.post('/org/position/delete', { id:obj.id}, (res)=> {
                    this.util.restDelete('/api_v1/org/positions/{id}', { id:obj.id}, (res)=> {
                    if(res.status==200){
                        this.util.success("删除成功！");
                        this.$store.dispatch('getPositionList',{ companyUid: this.companyUid });

                        // const index = this.roleList.findIndex(item => item.id === obj.id);
                        // this.roleList.splice(index,1);
                    }else {
                        this.util.error(res.errorMsg);
                    }
                    this.util.unmask();
                });
                
            });
        },
        handleSelectionChange(data){
            this.selectList=data
        },
        deleteSome(data){  
            this.util.confirm('确定要删除选中的岗位吗?','批量删除岗位',(result)=>{
                this.util.mask("正在删除..");
                Promise.all([this.selectList.forEach(item => {
                    this.util.restDelete('/api_v1/org/positions/{id}', { id:item.id}, (res)=> {
                        console.log(res)
                    });
                })]).then((result) => {
                    this.util.unmask();
                    this.util.success("删除成功！");
                    setTimeout(() => {
                        this.$store.dispatch('getPositionList',{ companyUid: this.companyUid });
                    }, 500);
                    
                }).catch((error) => {
                    this.util.unmask()
                    this.util.error(error);
                })
            });

            // var deleteArr=[]
            // if(data){
            //     deleteArr[0]=data;
            // }else{
            //     deleteArr=this.selectList;
            // }
            // console.log(deleteArr)
            // this.isDelete=true;
        },
        cancel(){
            this.isAdds=false;
            this.postObj={isCharge:'请选择'}
        },
        deleteSave(){   
            this.cancelDelete();
        },
        cancelDelete(){   
            this.isDelete=false;
        }
    }
}
</script>
<style scoped>
.Post-manage-box{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
}

.button-list{
    overflow: hidden;
    float: right;
    margin-top: -2px;
    color: #fff;
}
.button-list>div{
    float: left;
    width: 220px;
    height: 28px;
    padding:0 28px 0 10px;
    box-sizing: border-box;
    position: relative;
    border: 1px solid #44d2ff;
    margin-right: 20px;
}
.button-list>div button{
    width: 26px;
    min-width: 26px;
    border: 0 none;
    height: 26px;
    position: absolute;
    top: 0px;
    right:0px;
    background: url(../../assets/administrationIcon/search.png) no-repeat center center;
    background-size: 50% 50%;
    margin: 0;
}
.button-list>div input{
    width: 100%;
    height: 20px;
    color: #fff;
    background: transparent
}
.button-list button{
    float: left;
    height: 28px;
    min-width: 60px;
    line-height: 27px;
    box-sizing: border-box;
    padding: 0 10px;
}
.editIcon{
    margin-left: 20px;
    position: relative;
}
.editIcon::before{
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    left: -13px;
    top: 4px;
}
.Post-manage-box button{
  padding: 0;
}
input{
    border:  0 none;
    outline: 0 none;
  }
.delete{
    color:#FF4848;
}
.delete::before{
    background: url(../../assets/administrationIcon/delete.png) no-repeat ;
    height: 16px;
    margin-top: -1px;
    background-size: 100%
}
.editIcon1::before{
    background: url(../../assets/administrationIcon/edit.png) no-repeat ;
    background-size: 100%
}
.delete-show-box{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.6);
    z-index: 998;
}
.delete-show,.add-box{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10);
    padding:0 30px ;
    box-sizing: border-box;
    transform: translate(-50%,-50%)
}
.delete-show>p{
    margin: 50px 0 60px;
    text-align: center;
    font-size: 18px;
    color: #333;
}
 .delete-show-footer{
    overflow: hidden;
    margin-bottom: 30px;
}
.delete-show-footer button{
    float: right;
    margin-right: 20px;
    width: 60px;
    height: 28px;
    color: #666;
    border: 1px solid #666;
    background: #fff;
    line-height: 27px;
}
.add-box{
    width:  590px ;
    height: auto;
}
.add-box ul{
    overflow: hidden;
    
}
.add-box ul li{
    height: 55px;
    float: left;
    width: 50%;
    padding-right: 15px;
    box-sizing: border-box;
    margin-bottom: 20px;
}
.add-box ul li:nth-child(2n){
    padding-right: 0px;
    padding-left: 15px;
}
.add-box ul li .add-input{
    padding: 10px 0;
    height: 15px;
    width: 100%;
    border-bottom: 1px solid #e7e7e7;
    display: inline-block;
}
 select{
     width: 100%;
    margin: 0;
    padding:10px 0 8px;
    height: auto;
    border: 0 none;
    outline: 0 none;
    border-bottom: 1px solid #e7e7e7;
}
.add-input1{
    position: relative;
}
.add-input1::after{
    width: 6px;
    height: 12px;
    background: #fff;
    box-sizing: border-box;
    content: '';
    position: absolute;
    right: 0px;
    top: 50%;
    border-top: 6px solid #000;
    border-right: 3px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 3px solid transparent;
    margin-top: -3px;
}
.Required{
    color: #FF4848;
}
</style>
<style>
.Post-manage-box .el-checkbox__input.is-checked .el-checkbox__inner,.Post-manage-box .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background: #F08B00;
    border-color: #F08B00;
}

</style>
