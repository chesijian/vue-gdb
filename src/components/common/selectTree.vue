<template>
	<div>
	
  <ul>
    <li @click.stop.prevent='toggle'>
      <!-- <p style="overflow:hidden;position:relative" :style="{paddingLeft:level*20+6+'px'}">
        <template v-if="selectFlag">
          <i v-for="(item, index) in iArr" :key="index" class="line" :style="{left:index*20+2+'px',top:index==level?'29px':'0'}" v-if="type!=2&&open||index!=level"></i>
          <i class="line-heng" v-if="type==2" :style="{left:level*20-6+'px'}"></i>
          <img src="../../assets/indexImg/close.png" @click.stop.prevent="switchNode(0)" :style="{left:level*20+6+'px'}" v-if="!models.leaf&&!open" alt="">
          <img src="../../assets/indexImg/open.png"  @click.stop.prevent="switchNode"  :style="{left:level*20+6+'px'}" alt="" v-if="open">
          <img src="../../assets/indexImg/last.png"  :style="{left:level*20+6+'px'}" style="top:18px" alt="" v-if="models.leaf">
          <img :src="models.selected? selected:unselected"  @click.stop.prevent="selectNode"  :style="{left:level*22+20+'px'}" style="top:15px" alt="">
          <span style="padding:10px 0 10px 45px;display:block;width: 100%;" :class="{checked:models.id==$store.state.selectProjectNode.id}" v-if="models.itemName == '' || models.itemName == undefined ||models.itemName == null">{{models.label}}</span>
          <span style="padding:10px 0 10px 45px;display:block;width: 100%;" :class="{checked:models.id==$store.state.selectProjectNode.id}" v-else>{{models.itemName}}</span>
        </template>
        <template v-else>
          <i v-for="(item, index) in iArr" :key="index" class="line" :style="{left:index*20+2+'px',top:index==level?'26px':'0'}" v-if="type!=2&&open||index!=level"></i>

          <i class="line-heng" v-if="type==2" :style="{left:level*20-6+'px'}" style="top:0px;"></i>

          <img src="../../assets/indexImg/close.png" @click.stop.prevent="switchNode(0)" style="top:16px;" :style="{left:level*20+6+'px'}" v-if="models.leaf == false&&!open" alt="">
          <img src="../../assets/indexImg/folderClose.png" @click.stop.prevent="switchNode(0)" width="20px" style="top:10px" :style="{left:level*20+22+'px'}" v-if="models.leaf == false&&!open" alt="">
          <img src="../../assets/indexImg/close.png" @click.stop.prevent="switchNode(0)" style="top:16px;" :style="{left:level*20+6+'px'}" v-if="models.left == false &&!open" alt="">
          <img src="../../assets/indexImg/folderClose.png" @click.stop.prevent="switchNode(0)" width="20px" style="top:10px" :style="{left:level*20+22+'px'}" v-if="models.left == false&&!open" alt="">

          
          <img src="../../assets/indexImg/open.png" @click.stop.prevent="switchNode(0)" style="top:16px;" :style="{left:level*20+6+'px'}" alt="" v-if="open">
          <img src="../../assets/indexImg/folderOpen.png" @click.stop.prevent="switchNode(0)"  width="20px" style="top:10px" :style="{left:level*20+22+'px'}" alt="" v-if="open">


          <img src="../../assets/indexImg/files.png" width="20px" style="top:10px"  :style="{left:level*20+6+'px'}"  alt="" v-if="models.leaf">

          <template v-if="models.leaf != undefined || models.leaf != null">
            <span style="padding:10px 0 10px 40px;display:block" :style="{paddingLeft:models.leaf == false?'40px':'25px'}" v-if="models.itemName == '' || models.itemName == undefined ||models.itemName == null" :class="{checked:models.id==$store.state.selectProjectNode.id}">{{models.label}}</span>
            <span style="padding:10px 0 10px 40px;display:block" :style="{paddingLeft:models.leaf == false?'40px':'25px'}" v-else :class="{checked:models.id==$store.state.selectProjectNode.id}">{{models.itemName}}</span>
          </template>

          <img src="../../assets/indexImg/files.png" width="20px" style="top:10px"  :style="{left:level*20+6+'px'}"  alt="" v-if="models.left">
          <template v-if="models.left != undefined || models.left != null">
            <span style="padding:10px 0 10px 40px;display:block" :style="{paddingLeft:models.left == false?'40px':'25px'}" v-if="models.itemName == '' || models.itemName == undefined ||models.itemName == null" :class="{checked:models.id==$store.state.selectProjectNode.id}">{{models.label}}</span>
            <span style="padding:10px 0 10px 40px;display:block" :style="{paddingLeft:models.left == false?'40px':'25px'}" v-else :class="{checked:models.id==$store.state.selectProjectNode.id}">{{models.itemName}}</span>
          </template>
          

        </template>
      </p> -->
      <p style="overflow:hidden;position:relative"  :style="{paddingLeft:level*20+6+'px'}">
        <i v-for="(item, index) in iArr" :key="index" class="line" :style="{left:index*20+2+'px',top:index==level?'26px':'0'}" v-if="type!=2&&open||index!=level"></i>
        <i class="line-heng" v-if="type==2" :style="{left:level*20-10+'px'}"></i>
        <img src="../../assets/indexImg/files.png"    width="20px" style="top:10px"  :style="{left:level*20+6+'px'}"  alt="" v-if="models.childNum==0">
        <span v-else>
          <img src="../../assets/indexImg/close.png" @click.stop.prevent="switchNode" :style="{left:level*20+6+'px'}" v-show="!open" alt="">
          <img src="../../assets/indexImg/folderClose.png" @click.stop.prevent="switchNode" width="20px" style="top:10px" :style="{left:level*20+22+'px'}" v-if="!open" alt="">
          <img src="../../assets/indexImg/open.png"  @click.stop.prevent="switchNode"  :style="{left:level*20+6+'px'}" alt="" v-if="open">
          <img src="../../assets/indexImg/folderOpen.png"  @click.stop.prevent="switchNode"  width="20px" style="top:10px" :style="{left:level*20+22+'px'}" alt="" v-if="open">
        </span>
        
       <span style="padding:10px 0 10px 40px;display:block" :style="{paddingLeft:models.childNum==0?'25px':'40px'}" :class="{checked:models.id==$store.state.selectProjectNode.id}">{{models.label}}</span>
        
      </p>
      <div v-if="open">
        <selectProjectItem :models="item"  :level="level+1"  v-for="(item, index) in models.children" :selectFlag="selectFlag" :parents="models" :key="index"></selectProjectItem>
      </div>
    </li>
  </ul>
  </div>
</template>

<script>
  // import {mapState, mapGetters, mapActions} from 'vuex'

  export default {
    name: 'selectProjectItem',
    props: {  
      models: {},
      level: {},
      parents: {},
      selectFlag: {
        type: Boolean,
        default: true
      }
    },
    data(){
      return {
        unselected:require('@/assets/indexImg/unselected.png'),
        selected:require('@/assets/indexImg/selected.png'),
        open:false,
        type:0,
        iArr:[]
      }
    },
    created(){
      this.models.parents=this.parents==undefined? '':this.parents;
      for (var i = 0; i < this.level+1; i++) {
        this.iArr.push('')
      }
      if(this.models.children && this.models.children.length){
        this.type=0
      }else{
        this.type=2
      }

    },
//    computed: {
//       ...mapState({
//         selectProjectNode: state => state.selectProjectNode
//       })
//     },
    methods:{
      toggle: function() {
        
          this.$store.state.selectProjectNode=this.models
          this.$bus.emit('handelDeparts',this.models)
      },
      selectNode(){
        
        this.$set(this.models,"selected",!this.models.selected);
        this.$bus.$emit('selectNoded',this.models)
        // this.models.selected=true;
      },
      switchNode (type) {
        // if(this.type!=2){
        //   if(this.open){
        //     this.type=0
        //   }else{
        //     this.type=1
        //   }
        // }
        this.open = !this.open;
        if(this.open){
          this.$bus.emit('loadChildren',this.models,this.selectFlag)
        }
        // this.$store.state.selectProjectNode=this.models


      }
    }
  }
</script>
<style scoped>
  .checked-icon{
    float: right;
    width: 16px;
  }
  img {
    vertical-align: middle;position: absolute;
    top: 15px;
    z-index: 2;
  }
  span{
    cursor: default;
  }
  .line,.line-heng{
    width: 16px;
    height: 42px;
    background: url(../../assets/indexImg/point.png) repeat-y center;
    float: left;
    position: absolute;
    left: 20px;
    top: 0;
  }
  .line-heng{
    width: 12px;
    background: url(../../assets/indexImg/point.png) repeat-x center;
    top: 3px;
  }
  .checked{
    background: rgba(68,210,255,0.2);
    position: relative;
  }
  .checked::after{
    position: absolute;
    content: '';
    height: 100%;width: 3px;
    background: rgba(68,210,255,1);
    right: 0;
    top: 0;
  }
</style>


