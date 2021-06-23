<template>
  <div class="Documents">
    <div class="tabs-box">
      <div class="tabs">
        <span @click="changeType(0)" :class="{active:creatType==0}" >系统文档</span>
        <span @click="changeType(1)" :class="{active:creatType==1}" >项目文档</span>
      </div>
    </div>
    <div class="conter clear">
      <div class="conter_left">
         <div class="conter_left_title clear">
           <div class="title_left">
             <h4>目录</h4>
           </div>
            <div class="title_right">
              <button>添加</button>
              <button>删除</button>
            </div>
         </div>
         <div class="aside-box">
           <asideItem v-for="(item, index) in models"  :key="index" :models="item" :level="0" ></asideItem>
         </div>
      </div>
      <div class="conter_right">
        <div class="conter_right_title">
          <h4>目录</h4>
        </div>
        <div class="aside-box">
          <asideItems v-for="(item, index) in model"  :key="index" :models="item" :level="0" ></asideItems>
        </div>
      </div>
    </div>
    <!--<FilePopUp></FilePopUp>-->
  </div>
</template>

<script>
  import asideItem from '../common/asideItem.vue'
  import asideItems from '../common/asideItem.vue'
  import FilePopUp from '../common/FilePopUp.vue'
  export default {
    data(){
      return{
        creatType:0,
        models:[],
        model:[
          {
            "id": "01",
            "nodeId": "01",
            "label": "建筑公司",
            "text": "建筑公司",
            "isResp": 0,
            "gender": 0,
            "leaf": false,
            "sort": 1,
            "checked": 0,
            "children": [
              {
                "id": "0101",
                "nodeId": "0101",
                "label": "网公司本部",
                "text": "网公司本部",
                "isResp": 0,
                "gender": 0,
                "leaf": false,
                "parentId": "01",
                "sort": 1,
                "checked": 0,
                "children": [
                  {
                    "id": "010101",
                    "nodeId": "010101",
                    "label": "营销部",
                    "text": "营销部",
                    "isResp": 0,
                    "gender": 0,
                    "leaf": true,
                    "parentId": "0101",
                    "sort": 1,
                    "checked": 0
                  }
                ]
              },
              {
                "id": "0102",
                "nodeId": "0102",
                "label": "广东电网",
                "text": "广东电网",
                "isResp": 0,
                "gender": 0,
                "leaf": false,
                "parentId": "01",
                "sort": 2,
                "checked": 0,
                "children": [
                  {
                    "id": "010201",
                    "nodeId": "010201",
                    "label": "省公司本部",
                    "text": "省公司本部",
                    "isResp": 0,
                    "gender": 0,
                    "leaf": false,
                    "parentId": "0102",
                    "sort": 1,
                    "checked": 0,
                    "children": [
                      {
                        "id": "01020101",
                        "nodeId": "01020101",
                        "label": "营销部",
                        "text": "营销部",
                        "isResp": 0,
                        "gender": 0,
                        "leaf": true,
                        "parentId": "010201",
                        "sort": 1,
                        "checked": 0
                      }
                    ]
                  },
                  {
                    "id": "01020102",
                    "nodeId": "01020102",
                    "label": "东莞市供电局",
                    "text": "东莞市供电局",
                    "isResp": 0,
                    "gender": 0,
                    "leaf": false,
                    "parentId": "0102",
                    "sort": 2,
                    "checked": 0,
                    "children":[],
                  }
                ]
              }
            ]
          },
          {
            "id": "0112",
            "nodeId": "01",
            "label": "电商公司",
            "text": "电商公司",
            "isResp": 0,
            "gender": 0,
            "leaf": false,
            "sort": 1,
            "checked": 0,
            "children": [
              {
                "id": "0101123",
                "nodeId": "0101",
                "label": "网公司本部",
                "text": "网公司本部",
                "isResp": 0,
                "gender": 0,
                "leaf": false,
                "parentId": "01",
                "sort": 1,
                "checked": 0,
                "children": [
                  {
                    "id": "010101123",
                    "nodeId": "010101",
                    "label": "营销部",
                    "text": "营销部",
                    "isResp": 0,
                    "gender": 0,
                    "leaf": true,
                    "parentId": "0101",
                    "sort": 1,
                    "checked": 0
                  }
                ]
              },
              {
                "id": "0102123",
                "nodeId": "0102",
                "label": "广东电网",
                "text": "广东电网",
                "isResp": 0,
                "gender": 0,
                "leaf": false,
                "parentId": "01",
                "sort": 2,
                "checked": 0,
                "children": [
                  {
                    "id": "010201123",
                    "nodeId": "010201",
                    "label": "省公司本部",
                    "text": "省公司本部",
                    "isResp": 0,
                    "gender": 0,
                    "leaf": false,
                    "parentId": "0102",
                    "sort": 1,
                    "checked": 0,
                    "children": [
                      {
                        "id": "01020101123",
                        "nodeId": "01020101",
                        "label": "营销部",
                        "text": "营销部",
                        "isResp": 0,
                        "gender": 0,
                        "leaf": true,
                        "parentId": "010201",
                        "sort": 1,
                        "checked": 0
                      }
                    ]
                  },
                  {
                    "id": "01020102123",
                    "nodeId": "01020102",
                    "label": "东莞市供电局",
                    "text": "东莞市供电局",
                    "isResp": 0,
                    "gender": 0,
                    "leaf": false,
                    "parentId": "0102",
                    "sort": 2,
                    "checked": 0,
                    "children":[],
                  }
                ]
              }
            ]
          },
        ],
      }
    },
    methods:{
      changeType(num){
        this.creatType=num
      }
    },
    components:{
      asideItem,
      asideItems,
      FilePopUp
    }
  }
</script>

<style scoped>
  .Documents{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 10px ;
    color: #44D2FF;
    font-size: 14px;
    padding-top: 46px;
    position: relative;
  }
  .tabs-box{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .tabs{
    width: 100%;
    height: 36px;
    border: 1px solid #44D2FF ;
    box-sizing: border-box;
    padding: 0 10px;
    text-align: center;
  }
  .tabs>span{
    width: 78px;
    float: left;
    height: 26px;
    line-height: 26px;
    margin-top: 4px;
    cursor: pointer;
    margin-bottom: 10px;
    margin-right: 12px;
  }
  .tabs>.active{
    background: url(../../assets/indexImg/select.png) no-repeat  top center;
  }
  .conter{
    height:100%;
    padding:10px 0;
    box-sizing: border-box;
    overflow: auto;
  }
  .conter_left{
    float: left;
    width:32%;
    box-shadow: 0 0 15px 0 rgba(68,210,255,1);
    padding:13px 0 13px 14px;
    box-sizing: border-box;
    position: relative;
    left:2px;
    min-height: 100%;
  }
  .conter_right{
    float: right;
    width:67%;
    box-shadow: 0 0 15px 0 rgba(68,210,255,1);
    box-sizing: border-box;
    padding:10px 0 10px 14px;
    position: relative;
    right:2px;
    min-height: 100%;
  }
  .clear::after{
    content:"";
    height:0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
  }
  .title_left{
    float: left;
  }
  .title_left h4{
    margin-bottom: 0;
  }
  .title_right{
    float: right;
  }
  .title_right button{
    padding:4px 10px;
  }
  .conter_left_title{
    margin-bottom: 14px;
    padding-right: 14px;
  }
  .aside-box {
    text-align: left;
  }
  .conter_right_title{
    margin-bottom: 23px;
  }
  .conter_right_title h4{
    margin-bottom: 0;

  }
</style>
