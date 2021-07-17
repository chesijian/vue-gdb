<template>
  <ul>
    <li @click.stop='toggle' :class="{treeLi:models.open}" :style="{backgroundPosition: `${level*20+26}px 30px`}">
      <div class="tree-box" :style="{paddingLeft:level*20+20+'px'}">
        <i class="line-heng" v-if="level!=0" :style="{left:level*20+8+'px'}"></i>
        <img src="../../assets/asideIcon/show.png" width="16" height="16" @click.stop="switchNode" :style="{left:level*20+20+'px'}" v-if="!models.leaf&&!models.open" alt="">
        <img src="../../assets/asideIcon/hide.png" width="16" height="16" @click.stop="closeNode"  :style="{left:level*20+20+'px'}" alt="" v-if="!models.leaf&&models.open">
        <img src="../../assets/asideIcon/bule.png" width="12" height="12" :style="{left:level*20+20+'px'}" style="top:15px" alt="" v-if="models.leaf">
        
        <span :class="{checked: models.id == selectNode.id}">
					{{models.label || models.text}}
				</span>
      </div>
      <div v-show="models.open">
        <selectProjectItem :models="item" :level="level+1" :btnFlag="btnFlag" v-for="(item, index) in models.children" :key="index" :parents="models" :selectNode="selectNode"></selectProjectItem>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'selectProjectItem',
    props: {
      models: {},
      level: {},
      parents: {},
      selectNode: {
        type: Object,
        default: {}
      },
      btnFlag: {
        type: Boolean,
        default: true
      },
      rootId:{
        type: String,
        default: "root"
      }
    },
    data(){
      return {
        open:false,
        type:0,
        iArr:[],
      }
    },
    created(){
      for (var i = 0; i < this.level; i++) {
        this.iArr.push('')
      }
    },
    methods:{
      deleteNode(){
        var node={handleFlag:'deleteNode',data:this.models}
        this.$bus.emit('handelDepart',node)
      },
      edit(){
        var node={handleFlag:'edit',data:this.models}
        this.$bus.emit('handelDepart',node)
      },
      add(){
        var node={handleFlag:'add',data:this.models}
        this.$bus.emit('handelDepart',node)
      },
      toggle: function() {
        console.log("树项选中=======？",this.parents);
        this.selectNode.data = this.models;
        this.selectNode.parents = this.parents;
        this.$set(this.selectNode,"id",this.models.id);
        // this.$bus.emit('handelDepart',this.models)
      },
      closeNode(){
        console.log("关闭节点====");
        this.$set(this.models,'open',false)
      },
      switchNode(){
        // this.models.open = true;
        this.$set(this.models,'open',true)
        // if(!this.models.children){
        //   this.loadChildrenData();
        // }
        
      },
      //加载子项
      loadChildrenData(){
          let params={
              parentUid:this.models.id,
              pageIndex:1,
              search:''
          }
          this.rootDatas=[];
          this.util.mask();
          this.util.restGet('/api_v1/business/fileManage/searchDirectoryList', params, (res)=> {
              this.util.unmask();
              if(res.status==200&&res.data){
                  // this.rootDatas=res.data;
                  this.$set(this.models,"children",res.data);
                  
              }
          });
      },
    }
  }
</script>
<style scoped lang="scss">
.treeLi{
  background: url(../../assets/common/point.png) repeat-y;
}
.tree-box{
  overflow:hidden;
  position:relative;
  color:#fff;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  top: -8px;
  span{
    width: 100%;
    padding: 6px 5px;
    position: relative;
  }
}
  

 
  .line-heng{
    width: 12px;
    height: 42px;
    background: url(../../assets/common/point.png) repeat-x center;
    float: left;
    position: absolute;
    left: 20px;
  }
  .checked-icon{
    float: right;
    width: 16px;
  }
  .checked{
    /* background: rgb(253, 238, 217); */
    background: rgba(59,140,255,0.2);
    
  }
  .checked::after{
    position: absolute;
    content: '';
    height: 100%;width: 3px;
    background: #3B8CFF;
    right: 0;
    top: 0;
  }
  .button-handle{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0px;
    width: 60px;
    height: 12px;
    z-index: 9;
  }
  .button-handle span{
    width: 12px;
    margin-right: 7px;
    height: 12px;
    float: left;
  }
  .button-handle s{
    width: 10px;
    height: 10px;
    background: #fff;
    border: 1px solid #e7e7e7;
    border-radius: 50%;
    display: block;
  }
  .edit{
    background: url('../../assets/administrationIcon/edit1.png') no-repeat center center;
    background-size: cover;
  }
  .deleteNode{
    background: url('../../assets/administrationIcon/remove1.png') no-repeat center center;
    background-size: cover;
  }
  .addClass{
    background: url('../../assets/administrationIcon/add1.png') no-repeat center center;
    background-size: cover;
  }
</style>


