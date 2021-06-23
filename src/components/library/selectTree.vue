<template>
	<div>
			<div style="width: 400px; ">
			  <ul>
			    <li @click.stop.prevent='toggle'>
			      <p style="overflow:hidden;position:relative"  :style="{paddingLeft:level*20+6+'px'}">
			        <i v-for="(item, index) in iArr" :key="index" class="line" :style="{left:index*20+2+'px',top:index==level?'26px':'0'}" v-if="type!=2&&open||index!=level"></i>
			        <i class="line-heng" v-if="type==2" :style="{left:level*20-6+'px'}"></i>
			        <img src="../../assets/indexImg/close.png" @click.stop.prevent="switchNode(0)" :style="{left:level*20+6+'px'}" v-if="!models.leaf&&!open" alt="">
			        <img src="../../assets/indexImg/open.png"  @click.stop.prevent="switchNode"  :style="{left:level*20+6+'px'}" alt="" v-if="open">
			        <img src="../../assets/indexImg/last.png"  :style="{left:level*20+6+'px'}" style="top:15px" alt="" v-if="models.leaf">
			        <img :src="models.selected? selected:unselected"  @click.stop.prevent="selectNode"  :style="{left:level*22+20+'px'}" style="top:15px" alt="">
			        <span style="padding:10px 0 10px 45px;display:block;width: 100%;" :class="{checked:models.id==$store.state.selectProjectNode.id}">{{models.itemName}}</span>
			      </p>
			      <div v-if="open">
			        <selectProjectItem :models="item"  :level="level+1"  v-for="(item, index) in models.children" :parents="models" :key="index"></selectProjectItem>
			      </div>
			    </li>
			  </ul>
			</div>
  		
 			
  
  </div>
</template>

<script>
  // import {mapState, mapGetters, mapActions} from 'vuex'
  export default {
    name: 'selectProjectItem',
    props:['models','level','parents'],
    data(){
      return {
        unselected:require('../../assets/indexImg/unselected.png'),
        selected:require('../../assets/indexImg/selected.png'),
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
        // this.$store.state.selectProjectNode=this.models

        // if(this.models.children && this.models.children.length) {

        // }

      },
      selectNode(){
        console.log("选中====");
        // if(this.models.selected==undefined){
        //   this.$set(this.models,"selected",true);
        // }else{

        // }
//      for(var i in this.models){
//      	for( var j in	this.models[i].children){
//      		console.log(this.models[i].children[j].type)
//      			if( this.models[i].children[j].type == 'quality'){
//      				 this.type=0
//      			}
//      	}
//      }
        console.log(this.models)
        this.$set(this.models,"selected",!this.models.selected);
        this.$bus.$emit('selectNoded',this.models)
        // this.models.selected=true;
      },
      switchNode (type) {
        if(this.type!=2){
          if(this.open){
            this.type=0
          }else{
            this.type=1
          }
        }
        if(type==0){
          this.$bus.emit('loadChildren',this.models)
        }
        // this.$store.state.selectProjectNode=this.models

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
    width: 12px;
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


