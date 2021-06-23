<template>
    <ul>
        <li  @click.stop.prevent="checked">
            <div style="padding:10px 20px 10px 0;overflow:hidden;position:relative"  :style="{paddingLeft:level*20+20+'px'}">
                <i v-for="(item, index) in iArr" :key="index" class="line" :style="{left:index*20+20+'px',top:index==level?'30px':'0'}" v-if="type!=2&&open||index!=level"></i>
                <i class="line-heng" v-if="type==2" :style="{left:level*20+8+'px'}"></i>
                <img src="../../assets/indexImg/close.png" @click.stop.prevent='toggle' v-if="type==0" alt="">
                <img src="../../assets/indexImg/open.png" @click.stop.prevent='toggle' alt="" v-if="type==1">
                <img src="../../assets/indexImg/last.png" alt="" v-if="type==2">
                <span style="margin-left:20px;">{{models.label}}</span>
                <div style="float:right;margin-right:10px;" v-if="!radioSelectFlags">
                    <img src="../../assets/administrationIcon/active.png" class="checked-icon" v-if="models.checked" alt="">
                    <img src="../../assets/administrationIcon/defult.png" class="checked-icon" v-if="!models.checked" alt="">
                </div>
            </div>
            <div v-if="open">
                <selectQuertersItem :models="item" :radioSelectFlags="radioSelectFlags" :level="level+1"  v-for="(item, index) in models.children" :key="index"></selectQuertersItem>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'selectQuertersItem',
    props:['models','radioSelectFlags','level'],
    data(){
        return {
            open:false,
            type:0,
            iArr:[]
        }
    },
    created(){
        for (var i = 0; i < this.level+1; i++) {
            this.iArr.push('')
        }
        if(this.models.children && this.models.children.length){
                this.type=0
        }else{
            this.type=2
        }
    },
    
  
    methods:{
        checkQuerter(){
            var o={
                active:this.models.checked,
                models:this.models,
            }
            this.$bus.emit('handelDepartItem',o)
        },
        checked(){
            // if(this.radioSelectFlags){
            //     var o={
            //         models:this.models,
            //     }
            //     this.$bus.emit('handelDepartItem',o)
                
            //     return
            // }
            this.models.checked=!this.models.checked
            this.checkQuerter()

        },
       
        toggle: function() {
        // if(this.radioSelectFlags&&this.models.type=='user'){
        //     this.checked();
        //     return;
        // }
        if(this.models.children && this.models.children.length) {
            if(this.open){
                this.type=0
            }else{
                this.type=1
            }
            this.open = !this.open;
        }
        // if(this.open){
            //     this.svgStyle.color='skyblue';
            //     this.svgStyle.fill='skyblue';
            // }else{
            //     this.svgStyle.color='#000';
            //     this.svgStyle.fill='#000';
                
            // }
        
    },
    }
}
</script>
<style scoped>
.checked-icon{
    float: right;
    width: 16px;
}
img {
    vertical-align: middle;
    position: absolute;
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
    width: 12px;
    background: url(../../assets/common/point.png) repeat-x center;
}
</style>


