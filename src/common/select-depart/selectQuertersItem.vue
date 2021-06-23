<template>
    <ul>
        <li  @click.stop.prevent="checked">
            <div style="padding:10px 20px 10px 0;overflow:hidden;position:relative"  :style="{paddingLeft:level*20+5+'px'}">
                <i v-for="(item, index) in iArr" :key="index" class="line" :style="{left:index*20+5+'px',top:index==level?'30px':'0'}" v-if="type!=2&&open||index!=level"></i>
                <i class="line-heng" v-if="type==2" :style="{left:level*20+8+'px'}"></i>
                <img src="../../assets/asideIcon/show.png" width="16" height="16" @click.stop.prevent='toggle' v-if="type==0" alt="">
                <img src="../../assets/asideIcon/hide.png" width="16" height="16" @click.stop.prevent='toggle' alt="" v-if="type==1">
                <img src="../../assets/asideIcon/bule.png" width="12" height="12" alt="" v-if="type==2" style="top: 15px">
                <span style="margin-left:20px;">{{models.label ? models.label : models.departName}}</span>
                <div style="float:right;margin-right:10px;" v-if="!radioSelectFlags">
                    <img src="../../assets/administrationIcon/active1.png" class="checked-icon" v-if="models.checked" alt="">
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

    watch:{
        'models.children'(){
            if(this.models.children && this.models.children.length){
                this.type=0
            }else{
                this.type=2
            }
        },
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
    top: 14px;
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


