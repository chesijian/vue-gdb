<template>
    <div class="proj-box" style="padding:46px 0 0 0">
         <div class="tabs-box">
            <div class="tabs" style="overflow:hidden;border-top:0 none;">
                <span :class="{active:activeChildStr=='全部'}" @click="changeChild('全部')">全部</span>
                <span :class="{active:activeChildStr=='质量'}" @click="changeChild('质量')">质量</span>
                <span :class="{active:activeChildStr=='安全'}" @click="changeChild('安全')">安全</span>
                <div class="tabs-button-box" style="float: right;">
                    <div class="tabs-img-button">
                        <button :class="{buttonActive:buttonActive}" @click="buttonActive=true" class="tabs-img"></button>
                        <button :class="{buttonActive:!buttonActive}" @click="buttonActive=false" class="tabs-button"></button>
                    </div>
                    <button>导出Excel</button>
                    <button>导出PDF</button>
                </div>
            </div>
        </div>
        <div v-if="!buttonActive" class="body-box">
            <div style="height:285px;float:left" class="box-style" v-for="(item, index) in problemList" :key="index">
                <div class="problem-tab-item" >
                    <p class="title">{{item.title}}</p>
                    <p class="belongs"><span>{{item.userName}} </span><span>{{item.date}}</span></p>
                    <img :src="item.src" alt="">
                    <span class="reading-content">{{item.content}}</span>
                    <span class="reading-num">{{item.seeingNum}}人已读</span>
                </div>
            </div>
        </div>
        <div v-if="buttonActive" class="table-box">
                <el-table
            :data="memberData"
            border
            :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
            style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);">
                <el-table-column
                type="selection"
                label="选择"
                width="55">
                </el-table-column>
                <el-table-column
                prop=""
                label="操作"
                width="60">
                <template slot-scope="scope">
                    <span>
                    <i style="color: rgba(68,210,255,1);width: 15px;" class="el-icon-edit"
                        @click="editMember(scope.row)"></i>
                    <i style="color: rgba(68,210,255,1);" class="el-icon-delete" @click="delMember(scope.row)"></i>
                    </span>
                </template>
                </el-table-column>
                <el-table-column
                prop="has_entered"
                label="编号">
                </el-table-column>
                <el-table-column
                prop="peopleNumber"
                width="370"
                label="区域">
                </el-table-column>
                <el-table-column
                prop="card_num"
                width="400"
                label="检查项">
                </el-table-column>
                <el-table-column
                prop="work_type"
                width="150"
                label="描述">
                </el-table-column>
                <el-table-column
                prop="sign_in_card_num"
                width="110"
                label="检查日期">
                </el-table-column>
                <el-table-column
                label="图片">
                    <template slot-scope="scope">
                        <div style="width:30px;height:30px">
                            <img :src="scope.row.url?scope.row.url:require('../../assets/indexImg/2.png')" width="100%" height="100%" alt="">
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            activeStr:'全部',
            activeChildStr:'全部',
            buttonActive:true,
            problemList:[
                {
                    title:'AntV 是蚂蚁金服全新一代数据可视化解决方案sfasddssssssssssssssssssssssssss',
                    content:'AntV 是蚂蚁金服全新一代数据可视化解决方案sfasddssssssssssssssssssssssssss',
                    seeingNum:0,
                    userName:'哇放大',
                    date:'2012-01-22',
                    src:require('../../assets/indexImg/test.jpg')
                },
            ],
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
        }
    },
    methods:{
        changeIndex(str){
            this.activeStr=str
        },
        changeChild(str){
            this.activeChildStr=str
        },
    }
}
</script>
<style scoped>
.tabs-button-box>button,.tabs-img-button{
    float: left;
    margin-left: 10px;
    margin-top: 5px;
}
.tabs-img-button button{
    width: 25px;
    height: 25px;
    float: left;
    border-radius: 0px;
}
.tabs-img-button .buttonActive{
    box-shadow: inset 0 0 15px 0 #44D2FF;
}
.tabs-button{
    background: url('../../assets/indexImg/2.png') no-repeat center;
}
.tabs-img{
    background: url('../../assets/indexImg/home1.png') no-repeat center;
}
.body-box{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}
.body-box>div{
    width: 25%;
    float: left;
    padding-right: 10px;
    box-sizing: border-box;
}
.body-box>div:nth-child(4n){
    padding-right: 0;
}
.problem-tab-item .title,.reading-content{
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 5px;
        text-align: center;
}
.reading-content{
    display: block;
    text-align: left;
    font-size: 12px;
    color: #FFFFFF;
}
.problem-tab-item .belongs{
    font-size: 12px;
    color: #C4C4C4;
    text-align: left;
    margin-bottom: 5px;
}
.problem-tab-item>img{
    width: 100%;
    height: 160px;
}
.reading-num{
    display: block;
    text-align: left;
    font-size: 12px;
    color: #FFFFFF;
    padding-left: 16px;
    position: relative;
}
.reading-num::after{
    width: 16px;
    height: 16px;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    background: url('../../assets/indexImg/yuedu.png') no-repeat center;
}
</style>
