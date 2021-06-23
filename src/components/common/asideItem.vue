<template>
	<div>
		
	
  <ul>
    <li @click.stop.prevent='toggle'>
      <p style="overflow:hidden;position:relative"  :style="{paddingLeft:level*20+6+'px'}">
        <i v-for="(item, index) in iArr" :key="index" class="line" :style="{left:index*20+2+'px',top:index==level?'26px':'0'}" v-if="type!=2&&open||index!=level"></i>
        <i class="line-heng" v-if="type==2" :style="{left:level*20-10+'px'}"></i>
        <img src="../../assets/indexImg/close.png" @click.stop.prevent="switchNode" :style="{left:level*20+6+'px'}" v-if="models.children!=undefined&&!open" alt="">
        <img src="../../assets/indexImg/folderClose.png" @click.stop.prevent="switchNode" width="20px" style="top:10px" :style="{left:level*20+22+'px'}" v-if="models.children!=undefined&&!open" alt="">
        <img src="../../assets/indexImg/open.png"  @click.stop.prevent="switchNode"  :style="{left:level*20+6+'px'}" alt="" v-if="models.children!=undefined&&open">
        <img src="../../assets/indexImg/folderOpen.png"  @click.stop.prevent="switchNode"  width="20px" style="top:10px" :style="{left:level*20+22+'px'}" alt="" v-if="models.children!=undefined&&open">
        <img src="../../assets/indexImg/files.png"    width="20px" style="top:10px"  :style="{left:level*20+6+'px'}"  alt="" v-if="models.children==undefined">
       <span style="padding:10px 0 10px 40px;display:block" :style="{paddingLeft:models.children==undefined?'25px':'40px'}" :class="{checked:models.id&&models.id==$store.state.selectProjectNode.id}" v-if="models.itemName == '' || models.itemName == undefined ||models.itemName == null">{{models.label}}</span>
       <span style="padding:10px 0 10px 40px;display:block" :style="{paddingLeft:models.children==undefined?'25px':'40px'}" :class="{checked:models.id&&models.id==$store.state.selectProjectNode.id}" v-else>{{models.itemName}}</span>
        
      </p>
      <div v-if="open">
        <asideItem :models="item"  :level="level+1"  v-for="(item, index) in models.children" :parents="models" :key="index"></asideItem>
      </div>
    </li>
  </ul>
  </div>
</template>

<script>
  // import {mapState, mapGetters, mapActions} from 'vuex'
  export default {
    name: 'asideItem',
    props:['models','level','parents'],
    data(){
      return {
        open:false,
        type:0,
        iArr:[]
      }
    },
    created(){
      this.models.parents=this.parents
      for (var i = 0; i < this.level+1; i++) {
        this.iArr.push('')
      }
      if(this.models.children && this.models.children.length){
        this.type=0
      }else if(this.models.parents){
        
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
        // this.models.checked=true
        // if(JSON.stringify(this.$store.state.selectProjectNode)!="{}"){
        //     this.$store.state.selectProjectNode.checked=false
        // }
        
          this.$store.state.selectProjectNode=this.models
          this.$bus.emit('handelDeparts',this.models)
        
      
      },
      switchNode () {
        // if(this.type!=2){
        //   if(this.open){
        //     this.type=0
        //   }else{
        //     this.type=1
        //   }
        // }
        this.open = !this.open;

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
    width: 16px;
    background: url(../../assets/indexImg/point.png) repeat-x center;
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


