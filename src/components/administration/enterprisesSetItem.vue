<template>
    <ul>
        <li @click.stop.prevent="loadData(models)">
            <!-- <p style="padding-left:20px;">
                <i class="no-child" v-if="models.children==undefined||models.children.length==0"></i>
                <i class="have-child" v-if="models.children!=undefined&&models.children.length>0"></i>
            {{models.label==undefined? models.departName:models.label}}</p> -->
            <div style="overflow:hidden;position:relative"   :style="{paddingLeft:level*20+6+'px'}">
                <i v-for="(item, index) in iArr" :key="index" class="line" :style="{left:index*20+2+'px',top:index==level?'26px':'0'}" v-if="type!=2&&models.checked||index!=level"></i>
                <i class="line-heng" v-if="type==2" :style="{left:level*20-10+'px'}"></i>
                <img src="../../assets/indexImg/close.png" @click.stop.prevent="swichItem(models)" :style="{left:level*20+6+'px'}" v-if="models.children!=undefined&&!models.checked" alt="">
                <img src="../../assets/indexImg/folderClose.png" @click.stop.prevent="swichItem(models)" width="20px" style="top:10px" :style="{left:level*20+22+'px'}" v-if="models.children!=undefined&&!models.checked" alt="">
                <img src="../../assets/indexImg/open.png" @click.stop.prevent="swichItem(models)"  :style="{left:level*20+6+'px'}" alt="" v-if="models.children!=undefined&&models.checked">
                <img src="../../assets/indexImg/folderOpen.png"  @click.stop.prevent="swichItem(models)"  width="20px" style="top:10px" :style="{left:level*20+22+'px'}" alt="" v-if="models.children!=undefined&&models.checked">
                <img src="../../assets/indexImg/files.png"    width="20px" style="top:10px"  :style="{left:level*20+6+'px'}"  alt="" v-if="models.children==undefined">
                <span style="padding:10px 61px 10px 40px;display:block" :style="{paddingLeft:models.children==undefined?'25px':'40px'}" :class="{on:models.id==orgSelected.departUid}">{{models.label?models.label:models.departName}}</span>
                <div class="button-handle">
                    <span  @click.stop.prevent="deleteNode(models)"  v-if="sessionUtil.isAllowDelete('org_Structure')" class="deleteNode" ></span>
                    <span  @click.stop.prevent="edit(models)"  v-if="sessionUtil.isAllowEdit('org_Structure')" class="edit" ></span>
                    <span  @click.stop.prevent="add(models)"  v-if="sessionUtil.isAllowAdd('org_Structure')" class="addClass" ></span>
                </div>
            </div>
            <div v-if="models.children!=undefined&&models.children.length>0&&models.checked">
                <enterprisesSetItem  v-for="(item,key) in models.children" :level="level+1" :key="key" :parent='models' :models="item"></enterprisesSetItem>
            </div>
        </li>
    </ul>
</template>
<script>
import {mapState,mapGetters, mapActions} from 'vuex'
export default {
    name: 'enterprisesSetItem',
    props:['models','level','parent'],
    data(){
        return {
            bgColor:'',
            pageSize:10,
            open:false,
            type:0,
            iArr:[]

        }
    },
    computed: {
        ...mapState({
            companyUid: state => state.companyUid,
            orgDatas: state => state.orgDatas,
            orgSelected: state => state.orgSelected,
        }),
        
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
        if(this.parent!=undefined){
            this.models.parentName=this.parent.label;
        }else{
            this.models.parentName="root";
            this.models.parentId="";
        }
        this.bgColor=this.$store.state.themeColor;
        // this.swichItem(this.models)
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
        deleteNode(data){
            if(data.children.length>0){
                this.util.error("改部门下存在子部门，不能删除!");
                return;
            }
            
            
            this.util.confirm(`确定要删除该部门吗?（注意：部门下面的成员会全部删除）`,null,(result)=>{
                this.util.mask("正在删除..");
                //this.util.post('/org/depart/delete', { id:data.id}, (res)=> {
                this.util.restDelete('/api_v1/org/departs/'+data.id, null, (res)=> {
                    if(res.status==200){
                        this.util.success("删除成功！");
                        // this.$store.dispatch('getOrgDatas',{companyUid: this.companyUid,type: 'all'});
                        const index = this.parent.children.findIndex(item => item.id === data.id);
                        this.parent.children.splice(index,1);
                    }else {
                        this.util.error("删除失败!");
                    }
                    this.util.unmask();
                });
                
            });
        },
        add(data){
            var node={
                type:"add",
                data:data
            };
            this.$store.state.editDepart=data;
            this.$bus.emit('handelDepart1',node)
        },
        edit(data){
            this.$store.state.editDepart=data;
            this.$bus.emit('handelDepart1',data)
            
        },
        swichItem(data){
            this.models.checked=!this.models.checked;
        },
        loadData(data,del){
            var node={
                departUid:data.id,
                label:data.label
            }
            this.$store.state.orgSelected=node;
            var params = {type: "total", start:0,pageSize:this.pageSize};
            if(data.id==this.companyUid){
                params['companyUid']=this.companyUid
            }else{
                params['departUid']=data.id
            }
            this.$store.dispatch('getAllUser',params);
        }
    }
}
</script>
<style scoped>
.select-item{
    height: 54px;
    box-shadow: 0 0 0 0 #D9D9D9, inset 0 0 0 0 #D9D9D9;
    margin-top:2px;
    position: relative;
}
.select-item p{
    margin-left: 14px;
    position: relative;
    color: #fff;
}
.select-item p .no-child,
.select-item p .have-child{
    /* width: 10px;
    height: 10px;
    background: url('../../assets/administrationIcon/merge.png') no-repeat center center;
    background-size: cover; */
    position: absolute;
    top: 50%;
    left: 5px;
    transform: translateY(-50%)
}
.select-item p .no-child{
    width: 10px;
    height: 10px;
    background: url('../../assets/administrationIcon/merge.png') no-repeat center center;
    background-size: cover;
}
.select-item p .have-child{
    width: 15px;
    height: 15px;
    background: url('../../assets/administrationIcon/bumen.png') no-repeat center center;
    background-size: cover;
    left: 0px;
}
.select-item p input{
    background: #fff;
    padding: 10px 5px;
}
/* .select-item:hover{
  background:#ff9600;
} */
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
    background: url('../../assets/administrationIcon/remove1.png') no-repeat center center;
    background-size: cover;
}
.addClass{
    background: url('../../assets/administrationIcon/add.png') no-repeat center center;
    background-size: cover;
}
.on{
    border-right: 2px solid #3399ff;
    background:rgba(68,210,255,.2);
}

img {
    vertical-align: middle;position: absolute;
    top: 15px;
    z-index: 2;
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
</style>
