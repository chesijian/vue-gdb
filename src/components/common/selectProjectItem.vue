<template>
    <ul>
        <li @click.stop.prevent='toggle'>
            <p style="overflow:hidden;position:relative"  :style="{paddingLeft:level*20+20+'px'}">
                <i v-for="(item, index) in iArr" :key="index" class="line" :style="{left:index*20+17+'px',top:index==level?'26px':'0'}" v-if="type!=2&&open||index!=level"></i>
                <i class="line-heng" v-if="type==2" :style="{left:level*20+8+'px'}"></i>
                <img src="../../assets/indexImg/close.png" @click.stop.prevent="switchNode" :style="{left:level*20+20+'px'}" v-if="type==0" alt="">
                <img src="../../assets/indexImg/open.png"  @click.stop.prevent="switchNode"  :style="{left:level*20+20+'px'}" alt="" v-if="type==1">
                <img src="../../assets/indexImg/last.png"  @click.stop.prevent="switchNode"  :style="{left:level*20+20+'px'}" style="top:15px" alt="" v-if="type==2">
                <span style="padding:10px 0 10px 20px;display:block" :class="{checked:models.id==$store.state.selectProjectNode.id}">{{models.label}}</span>
            </p>
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
//    computed: {
//       ...mapState({
//         selectProjectNode: state => state.selectProjectNode
//       })
//     },
    methods:{
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
    background: rgba(68,210,255,.2);
    position: relative;
}
.checked::after{
    position: absolute;
    content: '';
    height: 100%;width: 3px;
    background: #F08B00;
    right: 0;
    top: 0;
}
</style>


