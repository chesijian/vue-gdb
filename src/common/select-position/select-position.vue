<template>
    <div class="box" v-if="selectPositionModels.isShow">
        <div class="mask-box" @click.stop.prevent="cancel"></div>
        <div class="querter-box">
            <div class="querter-list-box">
                <h4 style="margin:20px 0;width:270px"><i></i>选择岗位
                    <input type="text" style="float:right;height:28px;border:1px solid #e7e7e7;padding-left:10px;font-size:12px;margin-top:-5px;" v-model="search" @keyup.enter="searchPosition" placeholder="搜索">
                </h4>
                <div class="item-box">
                    <ul>
                        <li v-for="(item, index) in positionList" :key="index" @click.stop.prevent="radioSelect(item)">
                            <img src="../../assets/asideIcon/bule.png" width="12" alt="">
                            <span>{{item.positionName}}</span>
                            <div style="float:right;margin-top:3px;" v-if="!selectPositionModels.radioSelectFlags">
                                <img src="../../assets/administrationIcon/active1.png" class="checked-icon" v-if="item.active" @click.stop.prevent="checked(item)" alt="">
                                <img src="../../assets/administrationIcon/defult.png" class="checked-icon" v-if="!item.active" @click.stop.prevent="checked(item)" alt="">
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="select-list">
                <h4 style="margin:20px 0;width:100%"><i></i>已选岗位</h4>
                <div class="item-box" style="border:0 none;">
                    <el-table ref="multipleTable" :data="selectList" style="width: 100%"
                    border
                    :cell-style="{textAlign:'center',}" 
                    height="460"
                    :header-cell-style="headerCell"
                    highlight-current-row>
                    <el-table-column label="岗位名称" >
                        <template slot-scope="scope">
                            <p>{{scope.row.positionName}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" >
                         <template slot-scope="scope">
                            <button :style="`width:46px;height:22px;background: ${bgColor};border-radius: 4px;color:#fff`" @click="cancelSelect(scope.row)">一</button>
                        </template>
                    </el-table-column>
                    </el-table>

                </div>
            </div>
            <div class="footer">
                <el-button @click="cancel" size="small">关闭</el-button>
                <el-button type="warning" size="small" @click="success">确定</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import {tableMixin} from '../../public/js/mixins.js'

export default {
    props:['selectPositionModels'],
    mixins:[tableMixin],
    data(){
        return{
            active:false,
            dialogVisible: false,
            level:0,
            selectList:[],
            search: ''
        }
    },
    created () {
        this.bgColor = this.$store.state.themeColor
        this.fontColor = this.$store.state.themeBG
        this.loadData()
    },
    computed: {
        ...mapState({
            positionList: state => state.positionList,
            companyUid: state => state.companyUid
        }),

    },
    watch:{
        'selectPositionModels.isShow'(newVal,oldVal){
            if(newVal){
                this.selectList=this.selectPositionModels.selectList
            }
        }
    },

    methods: {
        searchPosition() {
            this.$store.dispatch('getPositionList', {companyUid: this.companyUid, search: this.search})
        },
        radioSelect(data){
            if(!this.selectPositionModels.radioSelectFlags){
                this.checked()
                return
            }
            if(this.selectPositionModels.editObj&&this.selectPositionModels.editObj.id==data.id){
                return
            }
            var arr=[];
            arr.push(data)
            this.selectList=arr
            this.success()
        },
        loadData(){
            // this.$store.dispatch('getPositionList',{ companyUid: this.companyUid });

            //    var param={
            //     Authorization:this.sessionUtil.getAccessToken(),
            //     companyUid:this.$store.state.companyUid,
            //     type:'depart',
            //     projType:this.searchText,
            //     start:0,
            //     pageSize:1000,
            // }
            // this.util.restGet('/api_v1/org/positions',param,(res)=>{
            //     console.log(res)
            //     if(res.status==200){
            //         this.positionList=res.data
            //     }else{
            //         this.util.error(res.msg)
            //     }
            // })
        },
        checked(node){
            node.active=!node.active
            if(node.active){
                this.selectList.push(node)
            }else{
                this.deleteRepeat(this.selectList,node)
            }
        },
        deleteRepeat(arr,node){
            for (var i = 0; i < arr.length; i++) {
                if(arr[i].id==node.id){
                    arr.splice(i,1)
                }
            }
        },
        cancel(){
            this.$store.state.selectProjectNode={}
            this.selectPositionModels.isShow=false;
            this.search = '';
            this.$store.dispatch('getPositionList', {companyUid: this.companyUid, search: this.search})
        },
        cancelSelect(data){
            data.active=false;
            this.deleteRepeat(this.selectList,data);
            this.$forceUpdate()
        },
        success(){
            if(this.selectList.length == 0) {
                this.util.warn('请选择岗位！')
                return false;
            }
            this.selectPositionModels.selectList=this.selectList
            this.selectPositionModels.callBack()
            this.cancel()
        },
    }
}
</script>
<style scoped>

.mask-box{
    width: 100%;height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 998;
}
.querter-box{
    transform: translate(-50%,-50%);
    position: fixed;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 5px ;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    height: 600px;
    z-index: 999;
    overflow: hidden;
}
.querter-list-box{
    width: 320px;
    height: 100%;
    box-sizing: border-box;
    padding:68px 20px 70px;
    overflow: hidden;
    float: left;
}
.querter-list-box h4{
    position: absolute;
    left: 20px;
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
    width: 252px;
    height: 100%;
    float: left;
    padding: 68px 20px 70px;
    box-sizing: border-box;
    position: relative;
}
.select-list h4{
    position: absolute;
    left: 20px;
    top: 0;
}
img{
    vertical-align: middle;
}
.item-box li{
    padding:10px 20px;
}
.item-box li .checked-icon{
    width: 16px;
    float: right;
}
</style>
