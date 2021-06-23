<template>
  <div class="ProcessStatistics">
    
    <div class="content-box" style="padding-top: 46px;">
      <div style="position: absolute;top: 9px;left: 15px;">
        <h4>
          <span >施工启用任务数(个)：{{StatisticsNumObj.totalNum}}</span>
        </h4>
        <div class="num_status" style="color: #fff;display: flex;">
          <div>
            <span>未施工</span>
            <p>{{StatisticsNumObj.notConstructionCount}}</p>
          </div>
          <div>
            <span>施工中</span>
            <p>{{StatisticsNumObj.constructionCount}}</p>
          </div>
          <div>
            <span>待验收</span>
            <p>{{StatisticsNumObj.awaitCheckNum}}</p>
          </div>
          <div>
            <span>需返工</span>
            <p>{{StatisticsNumObj.needReworkNum}}</p>
          </div>
          <div>
            <span>已完成</span>
            <p>{{StatisticsNumObj.finishNum}}</p>
          </div>
          
        </div>
      </div>
      <div class="header_tong">
        <h4>
          <span style="float:left">施工进度(按区域)统计</span>
        </h4>
        <div class="header_status">
          <div><i style="background: rgb(204, 204, 204)"></i><span>无任务</span></div>
          <div><i style="background: rgba(240, 139, 0,1)"></i><span>未施工</span></div>
          <div><i style="background: rgba(242, 109, 95,1)"></i><span>进行中</span></div>
          <div><i style="background: rgba(91, 198, 201,1)"></i><span>已完成</span></div>
          <!-- <div><i style="background: rgba(92, 154, 212,1)"></i><span>待验收</span></div> -->
          
        </div>
      </div>
      

      <div class="Statistics" style="padding-top: 119px;">
        <div style="color: #fff;padding-left: 20px;padding-bottom: 10px;"  @click="returnBack">
          {{pathNameList.join('>')}}
          <img v-show="pathNameList.length>1" :src="backIcon" width="20px"/>
        </div>
        <div class="Statistics_textall">
          <div style="width:100%;display: flex"  v-for="item in Statis">
            <div>
              <span style="text-align: center;width:50px;display: inline-block;font-size: 11px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" @click="btnchild(item)">{{item.name}}</span>
            </div>

            <!-- <div class="Statistics_con" :style="{borderBottom:item.border}"> -->
            <div class="Statistics_con" style="border-bottom:1px solid rgba(68,210,255,0.5)">
              <span v-for="child in item.children" :style="{background:initBackground(child)}">{{child.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        createTp:false,
        StatisticsNumObj:{},
        backIcon:require("@/assets/back.png"),
        areaObjId:"root",
        pathList:["root"],
        pathNameList:["主页"],
        Statis:[],

      }
    },
    mounted(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.loadgetTrackData();
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.loadgetTrackData();
      }
    },
    methods:{
      btnchild(item){
        this.areaObjId=item.id;
        this.pathList.push(item.id);
        this.pathNameList.push(item.name);
        this.loadgetTrackData();
      },
      returnBack(){//返回上一级
        if(this.pathList.length<=1){
          return;
        }
        this.pathList.pop();
        this.pathNameList.pop();
        this.areaObjId=this.pathList[this.pathList.length-1];
        this.loadgetTrackData();
      },
      initBackground(child){
        if(!child.numObj||child.numObj.totalNum==0){
          return "rgb(204, 204, 204)";//无任务
        }else if(child.numObj.totalNum==child.numObj.notConstructionCount){//未施工
          return "rgba(240, 139, 0,1)";
        }else if(child.numObj.totalNum==child.numObj.finishNum){//已完成
          return "rgba(91, 198, 201,1)";
        }else{//施工中
          return "rgba(242, 109, 95,1)";
        }
        // else if(child.numObj.totalNum==child.numObj.awaitCheckNum){//验收
        //   return "rgba(92, 154, 212,1)";
        // }
      },
      loadgetTrackData(){
        this.Statis=[]
        let params={
          projUid:this.$store.state.selectProjectObj.id,
          parentUid:this.areaObjId
        };
        this.util.mask();
        this.util.restGet('/api_v1/business/processWeChat/searchProcessStatistics',params,res=>{
          this.util.unmask();
          if(res.status==200&&res.data){
            this.createTp=false;
            this.StatisticsNumObj = res.data.numMap;
            this.Statis = res.data.data;
            // for(let i in res.data.data){
            //   let obj={};
            //   let arr=i.split(',');
            //   obj.id=arr[0];
            //   obj.partName=arr[1];
            //   obj.parentUid=arr[2];

            //   res.data.data[i].forEach(item=>{
            //     if(item.status==0){
            //       item.backColor='rgba(240, 139, 0,1)'
            //     }else if(item.status==1){
            //       item.backColor='rgba(242, 109, 95,1)'
            //     }else if(item.status==3){
            //       item.backColor='rgba(91, 198, 201,1)'
            //     }else if(item.status==2){
            //       item.backColor='rgba(92, 154, 212,1)'
            //     }else{
            //       item.backColor='#ccc'
            //     }
            //   })
            //   obj.children=res.data.data[i];
            //   this.Statis.push(obj);
            // }
            // this.Statis.map((item,index,salf)=>{
            //   salf[salf.length-1].border='1px solid rgba(68,210,255,0.5)'
            // })
          }
        },null,false)
      },
    }
  }
</script>
<style>
  .ProcessStatistics{
    width:100%;
    height:100%;
    overflow: auto;
    box-sizing: border-box;
  }
  .content-box{
    position: relative;
    box-shadow: inset 0 0 15px 0 #44d2ff;
    height:100%;
    width:100%;
    padding-top: 50px;
    box-sizing: border-box;
  }
  .num_status div{
    margin-right: 89px;
    text-align: center;
  }
  .header_tong{
    position: absolute;
    top: 115px;
    left: 15px;;
  }
  .header_tong h4{
    float: left;
  }
  .header_status{
    float:left;
    display: flex;
    margin-left: 10px;
    height:24px;
    line-height: 24px;
  }
  .header_status div{
    margin:0 5px;
    color:#fff;
  }
  .header_status span{
    color:#fff;
  }
  .header_status i{
    display: inline-block;
    width:14px;
    height:14px;
    background: red;
    margin-right: 5px;
    position: relative;
    top:2px;
  }
  .ChartHead{
    display: flex;
    padding-left: 14px;
  }
  .ChartHead div{
    margin-right: 20px;
  }
  .ChartHead i{
    display: inline-block;
    width:14px;
    height:14px;
    position: relative;
    top:2px;
    margin-right: 10px;
  }
  .content-box{
    padding-left:0;
  }
  .Statistics{
    width:100%;
    height:100%;
    box-sizing: border-box;
    text-align: left;
    overflow: auto;
  }
  .Statistics_textall{
    width:100%;
    box-sizing: border-box;
    overflow: auto;
    height:100%;
    white-space: nowrap;
    color:#fff;
  }
  .Statistics_con{
    padding-left: 30px;
    padding-bottom: 5px;
    box-sizing: border-box;
    border-left:1px solid rgba(68,210,255,0.5);
    width:100%;
    /*overflow: auto;*/
    /*white-space: nowrap;*/
  }
  .Statistics_con span{
    width:50px;
    height:20px;
    display: inline-block;
    background-color: rgba(91,198,201,1);
    margin-right: 15px;
    margin-bottom: 5px;
    line-height: 20px;
    font-size: 11px;
    color:#fff;
    text-align: center;
  }
  .statis_Title{
    width:37px;
    text-align: center;
    color:rgba(196,196,196,1);
    font-size: 17px;
    position: relative;
    height:fit-content;
  }
  .statis_Title p{
    line-height: 25px;
  }
  .statis_foot{
    text-align: left;
    padding-left: 67px;
    box-sizing: border-box;
  }
  .statis_foot span{
    width:50px;
    display: inline-block;
    margin-right: 50px;
    text-align: center;
    color:rgba(196,196,196,1);
  }
</style>
