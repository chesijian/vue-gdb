<template>
    <div class="box" v-if="selectMemberModels.isShow">
        <div class="mask-box" @click.stop.prevent="cancel"></div>
        <div class="querter-box">
            <h4 class="search" style="margin:20px 0;width:100%;padding:0"><input @click="activeName='部门'"  type="text" @keydown.enter="loadData" v-model="searchText" style="float:left;height:28px;border:1px solid #e7e7e7;padding-left:10px;font-size:12px" placeholder="请选择人员"></h4>
            <div class="tab">
                <div @click="changetab('部门')"
                    :style="{color:(activeName=='部门'?'#3B8CFF':'#333'),borderBottomColor:(activeName=='部门'?'#3B8CFF':'transparent')}">
                    <span  :class="{active:activeName=='部门'}">部门</span>
                </div>
                <div @click="changetab('常用联系人')"
                    :style="{color:(activeName=='常用联系人'?'#3B8CFF':'#333'),borderBottomColor:(activeName=='常用联系人'?'#3B8CFF':'transparent')}">
                    <span  :class="{active:activeName=='常用联系人'}">常用联系人</span>
                </div>
                <!-- <div @click="changetab('项目')"
                    :style="{color:(activeName=='项目'?bgColor:'#999'),borderBottomColor:(activeName=='项目'?bgColor:'transparent')}">
                    <span  :class="{active:activeName=='项目'}">项目</span>
                </div> -->
                   </div>
            <div v-if="activeName=='部门'" style="height:100%">
                <div class="querter-list-box">
                    <div class="item-box">
                        <selectProjectItem :btnFlag="false" v-for="(item, index) in models" :key="index" :models="item" :level="level" :radioSelectFlags="true" :selectProjectNode="selectProjectNode"></selectProjectItem>
                    </div>
                </div>
                <div class="select-list">
                    <div class="item-box" style="border:0 none;">
                        <el-table ref="multipleTable" :data="QuertPeopleList"
                        size="mini"
                        border @row-click="actives"
                        :cell-style="{textAlign:'center',}"
                        height="100%"
                        id="el-table"
                        :header-cell-style="headerCell"
                        highlight-current-row
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="40" v-if="!selectMemberModels.radioSelectFlags"></el-table-column>
                        <el-table-column   label="姓名" min-width="130">
                            <template slot-scope="scope">
                                <div>
                                    <img :src="scope.row.url" alt="">
                                    <span style="white-space: nowrap;text-align:left">{{ scope.row.userName }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column   label="常用联系人" min-width="85" >
                            <template slot-scope="scope">
                                <button type="button" style="width:46px;height:22px;line-height:22px;background: #3B8CFF;border-radius: 4px;color:#fff" @click="addSelect(scope.row)"><img src="../../assets/administrationIcon/Add-l.png" alt=""></button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                </div>
            </div>

            <div v-show="activeName=='常用联系人'" style="height:100%">
                <div class="select-list select-list2">
                    <div class="item-box" style="border:0 none;">
                        <el-table ref="multipleTable" :data="linkPeopleList"
                            :fit="true" size="mini"
                            border @row-click="actives"
                            :cell-style="{textAlign:'center'}" height="362"
                            :header-cell-style="headerCell"
                            highlight-current-row
                            @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="40" v-if="!selectMemberModels.radioSelectFlags"></el-table-column>
                        <el-table-column label="姓名" >
                            <template slot-scope="scope">
                                <div>
                                    <img :src="scope.row.url" alt="">
                                    <span style="white-space: nowrap;text-align:left">{{ scope.row.userName }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column  label="岗位" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#fff">{{ scope.row.departName}}</button>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="删除常用联系人" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#fff" @click="deleteSelect(scope.row)">一</button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                </div>
            </div>
            <div v-show="activeName=='项目'" style="height:100%">
                <div class="select-list select-list2">
                    <div class="item-box" style="border:0 none;">
                        <el-table ref="multipleTable" :data="projPeopleList"
                        size="mini"
                        border
                        :cell-style="{textAlign:'center'}"
                        height="460"
                        :header-cell-style="headerCell"
                        highlight-current-row
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column label="姓名" >
                            <template slot-scope="scope">
                                <div>
                                    <img :src="scope.row.url" alt="">
                                    <span style="white-space: nowrap;text-align:left">{{ scope.row.label }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="岗位" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#fff" >{{ scope.row.departName}}</button>
                            </template>
                        </el-table-column>
                        <el-table-column label="项目负责人" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#fff" >{{ scope.row.departName}}</button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                </div>
            </div>
             <div class="select-list select-list1">
                    <h4 style="margin:20px 0;width:100%;"><i></i>已选人员</h4>
                    <div class="item-box" style="border:0 none;">
                        <el-table :data="selectList"
                        size="mini"
                        border
                        :cell-style="{textAlign:'center',}"
                        height="100%"
                        id="el-table"
                        :header-cell-style="headerCell"
                        highlight-current-row
                        @selection-change="handleSelectionChange">
                        <el-table-column label="人员"  width="160">
                            <template slot-scope="scope">
                                <div>
                                    <img :src="scope.row.url" alt="">
                                    <span style="white-space: nowrap;text-align:left">{{ scope.row.userName }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="部门" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #FF6363;border-radius: 4px;color:#fff">{{scope.row.departName}}</button>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <button style="width:46px;height:22px;background: #3B8CFF;border-radius: 4px;color:#fff" @click="cancelSelect(scope.row)">一</button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                </div>

            <div class="footer">
                <el-button @click="cancel" size="small">关闭</el-button>
                <el-button type="warning" size="small" @click="success">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import selectProjectItem from '../base/asideItemTree/asideItem'
import {tableMixin} from '../../public/js/mixins.js'
import { mapMutations, mapGetters } from 'vuex'
export default {
    props:['selectMemberModels'],
    mixins:[tableMixin],
    data(){
        return{
            dialogVisible: false,
            searchText: '',
            activeName: '部门',
            level:0,
            selectNode:{},
            QuertPeopleList:[],
            linkPeopleList:[],
            projPeopleList:[],
            selectList:[],
            models:[],
            user:{},
            selectProjectNode: {
				id: ''
            },
            checkedArrData: []
        }
    },
    components:{selectProjectItem},
    computed: {
        ...mapGetters([
        'orgDatas'
        ])
    },
    created () {
      this.bgColor = this.$store.state.themeColor
      this.fontColor = this.$store.state.themeBG
      this.$bus.on('handelDepart', this.addOrEditDepart);
      this.user=this.sessionUtil.getUser();
      this.loadAsideData()
      this.selectNode.id='';
      this.loadData()
      // console.log(this)
    },
  mounted () {
    this.$nextTick(() => {
      this.selectList= this.selectMemberModels.selectList;
      let arr = []
      this.QuertPeopleList.forEach((item, index) => {
        this.selectList.forEach((prod) => {
          if(item.id == prod.id) {
            arr.push(item)
          }
        })
      })
      this.snyc(arr)
    })
  },
    beforeDestroy () {
      this.$bus.off('handelDepart', this.addOrEditDepart)
    },
    watch:{
        'selectMemberModels.isShow'(newVal,oldVal){
            if(newVal){
                // if(this.selectMemberModels.radioSelectFlags) {
                //    this.selectList= this.selectMemberModels.selectList
                // }
                this.$nextTick(() => {
                    this.selectList= this.selectMemberModels.selectList;
                    let arr = []
                    this.QuertPeopleList.forEach((item, index) => {
                        this.selectList.forEach((prod) => {
                            if(item.id == prod.id) {
                                arr.push(item)
                            }
                        })
                    })
                    this.snyc(arr)
                })

            }
        }
    },
    methods: {
        ...mapMutations([
            'setOrgDatas'
        ]),
        actives(node){
            if(this.selectMemberModels.radioSelectFlags){
                var arr=[];
                arr.push(node)
                this.selectList=arr
                this.success()
            }
        },
        addSelect(data){
            var o={
                linkUid :data.id,
                userUid :this.user.id,
            }
            // console.log(o)
            var arr=[o]
            var param={
                    Authorization:this.sessionUtil.getAccessToken(),
                    id:this.user.id,
                    _list:arr
            }
            this.util.restPost('/api_v1/org/users/{id}/links',param,(res)=>{
                if(res.status==200){
                    this.util.success('添加成功')
                    // this.linkPeopleList=res.data;
                    // this.$forceUpdate()
                }else{
                    this.util.error(res.msg)
                }
            })

        },
        deleteSelect(data){
            var param={
                Authorization:this.sessionUtil.getAccessToken(),
                id:this.user.id,
                linkUid:data.id
            }
            this.util.restDelete('/api_v1/org/users/{id}/links/{linkUid}',param,(res)=>{
                if(res.status==200){
                    this.util.success('删除成功')
                    this.loadOftendata()
                    // this.linkPeopleList=res.data;
                    // this.$forceUpdate()
                }else{
                    this.util.error(res.msg)
                }
            })
        },
        changetab (str) {
            this.activeName = str
            if(str=='常用联系人'){
                this.loadOftendata()
            }else if(str=='项目'){

            }else{
                this.loadAsideData()
            }
        },
        loadAsideData(){
            var param={
                Authorization:this.sessionUtil.getAccessToken(),
                companyUid:this.$store.state.companyUid,
                type:'depart',
                projType:this.searchText,
            };
          // 设置缓存
          if(this.orgDatas && this.orgDatas.id){
            this.models[0] = (this.orgDatas);
            this.$forceUpdate();
            return ;
          }
            this.util.restGet('/api_v1/org',param,(res)=>{
                // console.log(res)
                if(res.status==200){
                    this.models[0]=res.data;
                    this.$forceUpdate();
                  this.setOrgDatas(res.data);
                }else{
                    this.util.error(res.msg)
                }
            })
        },
        loadOftendata(){
            var param={
                Authorization:this.sessionUtil.getAccessToken(),
                id:this.user.id,
            }
            this.util.restGet('/api_v1/org/users/{id}/links',param,(res)=>{
                if(res.status==200){
                    this.linkPeopleList=res.data;
                    this.$forceUpdate()
                }else{
                    this.util.error(res.msg)
                }
            })
        },
        addOrEditDepart(data){
            this.selectNode=data;
            this.loadData()
        },
        loadData(){
          console.log('------loadData-------',this.selectNode)
            var param={
                Authorization:this.sessionUtil.getAccessToken(),
                companyUid:this.$store.state.companyUid,
                departUid:this.selectNode.id,
                ifContainChild:true,//默认递归查找下级用户
                // positionUid:'',
                // roleUid:false,
                // ifContainChild:false,
                // ifQueryPosition:true,
                start:0,
                pageSize:1000,
                search:this.searchText,
            }
             this.util.restGet('/api_v1/org/users',param,(res)=>{
                if(res.status==200){
                    this.QuertPeopleList=res.data;
                    this.snyc(this.selectList)
                }else{
                    this.util.error(res.msg)
                }
            })
        },
        delete(arr,node){
            for (var i = 0; i < arr.length; i++) {
                if(arr[i].id==node.id){
                    arr.splice(i,1)
                }
            }
        },
        cancel(){
            this.$store.state.selectProjectNode={}
            this.selectMemberModels.isShow=false;
        },
        cancelSelect(data){
            this.delete(this.selectList,data);
            this.snyc([data])
            this.$forceUpdate()
        },
        snyc(rows){
            // 解决this.$refs.multipleTable未undefined报错
            if (this.$refs.multipleTable){
                if (rows) {
                    // console.debug("选人数据==33=====",this.selectList);
                    rows.forEach(row => {
                        this.$nextTick(() => {
                            this.$refs.multipleTable.toggleRowSelection(row);
                        })
                    });
                } else {
                    // console.debug("数据==33=====",this.selectList);
                    this.$nextTick(() => {
                        this.$refs.multipleTable.clearSelection();
                    })
                }
            }
        },
        success(){
            this.selectMemberModels.selectList=this.selectList
            this.selectMemberModels.callBack()
            this.cancel()
        },
        handleSelectionChange (val) {
            this.selectList= val
        }
    }
}
</script>
<style scoped>
.active::after {
    background: #3B8CFF!important;
}
.mask-box{
    width: 100%;height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 998;
}
.querter-box{
    width: 775px;
    transform: translate(-50%,-50%);
    position: fixed;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 5px ;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    height: 500px;
    z-index: 999;
    overflow: hidden;
}
.querter-list-box{
    width: 220px;
    height: 100%;
    box-sizing: border-box;
    padding:68px 10px 70px;
  padding-right: 0px;
    overflow: hidden;
    float: left;
}
.querter-list-box h4{
    position: absolute;
    left: 10px;
    top:0px;
}
.footer{
    position: absolute;
    bottom: 20px;
    right: 20px;
}
.item-box{
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    overflow: auto;
    border: 1px solid #E7E7E7;
}
.select-list{
    width: 295px;
    height: 100%;
    float: left;
    padding: 68px 10px 70px;
    box-sizing: border-box;
    position: relative;
}
.select-list1{
    position: absolute;
    width: 272px;
    right: 0;
    top: 0;
}
.select-list2{
    width: 515px;
}
.select-list h4{
    position: absolute;
    left: 20px;
    top: 0;
}
.tab{
    position: absolute;top: 0;
    left: 10px;
    z-index: 99;
}
.tab>div{
    float: left;
    padding: 20px 10px;
}
.active{
    position: relative;
}
.active::after{
    content: '';
    position: absolute;
    width: 100%;
    bottom: -6px;
    left: 0;
    height: 2px;
    background: #F08B00;
}
.search{
    position: absolute;
    z-index: 99;
    width: auto;
    left: 340px;
    border: 0;
    top: -5px;
}
img {
    vertical-align: middle;
}
</style>
