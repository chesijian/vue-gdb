<template>
    <ul>
        <li @click.stop.prevent='toggle'>
            <div style="overflow:hidden;position:relative"  :style="{paddingLeft:level*20+20+'px'}">
                <i v-for="(item, index) in iArr" :key="index" class="line" :style="{left:index*20+16+'px',top:index==level?'26px':'0'}" v-if="type!=2&&open||index!=level"></i>
                <i class="line-heng" v-if="type==2&&models.parentId" :style="{left:level*20+5+'px'}"></i>
                <img src="../../assets/indexImg/close.png" @click.stop.prevent="switchNode" :style="{left:level*20+20+'px'}" v-if="models.children && models.children.length" alt="">
                <img src="../../assets/indexImg/open.png"  @click.stop.prevent="switchNode"  :style="{left:level*20+20+'px'}" alt="" v-if="models.children && models.children.length&&open">
                <img src="../../assets/indexImg/last.png"   :style="{left:level*20+20+'px'}" style="top:15px" alt="" v-if="type==2">
                <span style="padding:10px 0 10px 20px;display:block" :class="{checked:models.id==$store.state.selectProjectNode.id}">{{models.label?models.label:models.text}}</span>
                <!-- <div class="button-handle" v-if="sessionUtil.isCompanyAdmin()">
                    <span  v-if="util.isAllowBtn('depart:btn_delete')"   @click.stop.prevent="deleteNode()" class="deleteNode" ></span>
                    <span  v-if="util.isAllowBtn('depart:btn_edit')" @click.stop.prevent="edit()" class="edit" ></span>
                    <span  v-if="util.isAllowBtn('depart:btn_add')" @click.stop.prevent="add()" class="addClass" ></span>
                </div> -->
            </div>
            <div v-if="open">
                <selectProjectItem :models="item"  :level="level+1"  v-for="(item, index) in models.children" :parents="models" :key="index"></selectProjectItem>
            </div>
        </li>
    </ul>
</template>

<script>
// import {mapState, mapGetters, mapActions} from 'vuex'
export default {
    name: 'selectProjectItem',
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
//    computed: {
//       ...mapState({
//         selectProjectNode: state => state.selectProjectNode
//       })
//     },
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
        // if(this.radioSelectFlags&&this.models.type=='user'){
        //     this.checked();
        //     return;
        // }

        // this.models.checked=true
        // if(JSON.stringify(this.$store.state.selectProjectNode)!="{}"){
        //     this.$store.state.selectProjectNode.checked=false
        // }
        this.$store.state.selectProjectNode=this.models
        this.$bus.emit('handelDepart',this.models)
        if(this.models.children && this.models.children.length) {

            // if(this.open){
            //     this.svgStyle.color='skyblue';
            //     this.svgStyle.fill='skyblue';
            // }else{
            //     this.svgStyle.color='#000';
            //     this.svgStyle.fill='#000';

            // }

        }

    },
    switchNode () {
        if(this.type!=2){
            if(this.open){
                this.type=0
            }else{
                this.type=1
            }
        }
        this.open = !this.open;
    }
    }
}
</script>
<style scoped>

img {
    vertical-align: middle;position: absolute;
    top: 15px;
    z-index: 1;
}
span{
    cursor: default;
}
.line,.line-heng{
    width: 16px;
    height: 42px;
    background: url(../../assets/common/point.png) repeat-y center;
    float: left;
    position: absolute;
    left: 20px;
    top: 0;
}
.line-heng{
    width: 16px;
    background: url(../../assets/common/point.png) repeat-x center;
}
.checked-icon{
    float: right;
    width: 16px;
}
.checked{
    /* background: rgb(253, 238, 217); */
    /* background: rgb(193, 215, 233); */
    background: rgba(68,210,255,.2);
    position: relative;
}
.checked::after{
    position: absolute;
    content: '';
    height: 100%;width: 3px;
    background: #39f;
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
    background: url('../../assets/administrationIcon/edit.png') no-repeat center center;
    background-size: cover;
}
.deleteNode{
    background: url('../../assets/administrationIcon/remove.png') no-repeat center center;
    background-size: cover;
}
.addClass{
    background: url('../../assets/administrationIcon/add.png') no-repeat center center;
    background-size: cover;
}
</style>


