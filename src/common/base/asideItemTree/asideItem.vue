<template>
  <ul>
    <li @click.stop.prevent='toggle'>
      <div style="overflow:hidden;position:relative"  :style="{paddingLeft:level*20+20+'px'}">
        <i v-for="(item, index) in iArr" :key="index" class="line" :style="{left:index*20+20+'px',top:index==level?'30px':'0'}" v-if="type!=2&&open||index!=level"></i>
        <i class="line-heng" v-if="type==2" :style="{left:level*20+8+'px'}"></i>
        <img src="../../../assets/asideIcon/show.png" width="16" height="16" @click.stop.prevent="switchNode" :style="{left:level*20+20+'px'}" v-if="models.children && models.children.length" alt="">
        <img src="../../../assets/asideIcon/hide.png" width="16" height="16" @click.stop.prevent="switchNode"  :style="{left:level*20+20+'px'}" alt="" v-if="models.children && models.children.length&&open">
        <img src="../../../assets/asideIcon/bule.png" width="12" height="12" :style="{left:level*20+20+'px'}" style="top:15px" alt="" v-if="type==2">
        <div class="button-handle" v-if="btnFlag">
          <span  v-if="util.isAllowBtn('depart:btn_delete')" @click.stop.prevent="deleteNode()" class="deleteNode" ></span>
          <span  v-if="util.isAllowBtn('depart:btn_edit')" @click.stop.prevent="edit()" class="edit" ></span>
          <span  v-if="util.isAllowBtn('depart:btn_add')" @click.stop.prevent="add()" class="addClass" ></span>
        </div>
        <span 
					style="padding:10px 0 10px 20px;display:block"
					:class="{checked:  models.id == selectProjectNode.id}"
				>
					{{models.label ? models.label: models.text ? models.text : models.departName}}
				</span>
      </div>
      <div v-if="open">
        <selectProjectItem :models="item"  :level="level+1" :btnFlag="btnFlag" v-for="(item, index) in models.children" :parents="models" :key="index" :selectProjectNode="selectProjectNode" :silder="silder"></selectProjectItem>
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
      selectProjectNode: {},
      silder: {},
      btnFlag: {
        type: Boolean,
        default: true
      },
    },
    data(){
      return {
        open:false,
        type:0,
        iArr:[],
      }
    },
    created(){
      if(this.parents) {
        this.models.parents=this.parents
      }
      for (var i = 0; i < this.level+1; i++) {
        this.iArr.push('')
      }
      if(this.models.children && this.models.children.length){
        this.type=0
      }else{
        this.type=2
      }
    },
    watch:{
      'models.children'(){
        if(this.models.children && this.models.children.length){
          this.type=0
        }else{
          this.type=2
        }
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
        this.selectProjectNode.id = this.models.id;
        this.$bus.emit('handelDepart',this.models, this.silder)
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

  img {
    vertical-align: middle;position: absolute;
    top: 14px;
    z-index: 1;
  }
  span{
    cursor: default;
  }
  .line,.line-heng{
    width: 16px;
    height: 42px;
    background: url(../../../assets/common/point.png) repeat-y center;
    float: left;
    position: absolute;
    left: 20px;
    top: 0;
  }
  .line-heng{
    width: 12px;
    background: url(../../../assets/common/point.png) repeat-x center;
  }
  .checked-icon{
    float: right;
    width: 16px;
  }
  .checked{
    /* background: rgb(253, 238, 217); */
    background: rgba(59,140,255,0.2);
    position: relative;
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
    background: url('../../../assets/administrationIcon/edit1.png') no-repeat center center;
    background-size: cover;
  }
  .deleteNode{
    background: url('../../../assets/administrationIcon/remove1.png') no-repeat center center;
    background-size: cover;
  }
  .addClass{
    background: url('../../../assets/administrationIcon/add1.png') no-repeat center center;
    background-size: cover;
  }
</style>


