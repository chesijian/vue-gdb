<template>
  <div class="select-box">
    <div class="select">
      <div class="title">
        <h5 style="margin:30px 30px 0;font-size:18px;font-weight:400" >{{models.title}}</h5>
        <!--<div>
          <div class="img-box">
            <img src="../../assets/administrationIcon/search.png" alt="">
          </div>
          <input type="text" placeholder="请输入关键字搜索">
        </div>-->
      </div>
      <div class="select-center">
        <ul>
          <li v-for="(item,key) in models.centerList" :key="key">
            <img v-if="models.type=='post'" src="../../assets/administrationIcon/gangwei.png" width="24px" alt="">
            <img v-if="models.type=='member'" :src="item.picture" style="border-radius:50%" width="24px" alt="">
            <p v-if="models.type=='post'">{{item.positionName}}</p>
            <p v-if="models.type=='role'">{{item.roleName}}</p>
            <p v-if="models.type=='member'">{{item.userName}}</p>
            <img class="select-img" src="../../assets/administrationIcon/active.png" width="20px"
                 @click="cancelSelect(item)" v-show="ifSelected(item)" alt="">
            <img class="select-img" src="../../assets/administrationIcon/defult.png" width="20px"
                 @click="selected(item)" v-show="!ifSelected(item)" alt="">
            <!-- <span v-if="models.type=='member'" style="float:right;font-size: 12px;color: #999999;margin-right:10px;">部门经理</span> -->
          </li>
        </ul>
      </div>
      <div class="footer">
        <button @click="saveData()" :style="{background:bgColor,color:'#fff',borderColor:bgColor,}">确定</button>
        <button @click="cancel()" style="color:#333">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['models', 'selectType'],
    data () {
      return {
        bgColor: '',
        selectDatas: [],
      }
    },
    methods: {
      cancel () {
        this.$parent.memberOrPost = false
      },
      ifSelected (obj) {//角色权限是否被选中
        const index = this.models.selectDatas.findIndex(item => item.id === obj.id)
        if (index > -1) {
          return true
        } else {
          return false
        }
      },
      cancelSelect (obj) {
        const index = this.models.selectDatas.findIndex(item => item.id === obj.id)
        this.models.selectDatas.splice(index, 1)
      },
      selected (item) {
        if (this.selectType !== 'single') {
          this.models.selectDatas.push(item)
        } else {
          this.models.selectDatas = [item]
        }
      },
      saveData () {
        this.$emit('selectQuarterOut', this.models.selectDatas)
        // this.cancel()
        this.$parent.memberOrPost = false
      }
    },
    created () {
      this.bgColor = this.$store.state.themeColor
    },
  }
</script>

<style scoped>
  .select-box {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 998;
  }

  .select {
    position: absolute;
    z-index: 999;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    width: 360px;
    height: 550px;
    overflow: hidden;
    padding: 84px 20px 58px;
    box-sizing: border-box;
  }

  .select-center {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  h4 {
    color: #333;
    font-size: 18px;
    font-family: SourceHanSansCN-Medium;
    padding-left: 12px;
    position: relative;
    margin: 30px 0;
  }

  h4 i {
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    height: 20px;
    width: 2px;
  }

  .select .title {
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
  }

  .select .title > div {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
  }

  .select .title > div input {
    width: 100%;
    border: 1px solid #E7E7E7;
    border-radius: 1px;
    height: 30px;
    line-height: 28px;
    padding-left: 28px;
    box-sizing: border-box;
  }

  .select .title > div .img-box {
    width: 28px;
    height: 28px;
    content: '';
    position: absolute;
    left: 21px;
    top: 21px;
    box-sizing: border-box;
    padding: 5px;
    padding-top: 1px;
  }

  .img-box img {
    width: 100%;
    margin-top: 4px;
  }

  .footer {
    position: absolute;
    bottom: 20px;
    width: 100%;
    left: 0;
  }

  .footer button {
    float: right;
    width: 60px;
    height: 28px;
    background: #fff;
    border: 1px solid #666666;
    margin-right: 20px;
  }

  .select-center li {
    height: 37px;
    box-sizing: border-box;
    padding: 6.5px 0;
  }

  .select-center li p {
    float: left;
  }

  .select-center li img {
    float: left;
    margin-right: 8px;
  }

  .select-center li .select-img {
    float: right;
  }
</style>
