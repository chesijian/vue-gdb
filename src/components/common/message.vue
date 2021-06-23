<template>
    <div v-if="models.show">
        <div class="mask" @click.stop.prevent="cancel"></div>
        <div class="box">
            <h4 style="margin:20px 0;color:#333;">{{models.title}}</h4>
            <div>
                {{models.content}}
            </div>
            <div class="footer">
                <el-button @click="cancel" size="small">关闭</el-button>
                <el-button type="warning" size="small" @click="success">确定</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['models'],
    data(){
        return {

        }
    },
    methods:{
        cancel(){
            this.models.show=false
        },
        success(){
            this.models.callback()
            this.cancel();
        }
    }
}
</script>
<style scoped>
.mask{
    width: 100%;height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 98;
}
.box{
    width: 420px;
    transform: translate(-50%,-50%);
    position: fixed;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 5px ;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    height: 170px;
    z-index: 99;
    overflow: hidden;
    padding: 0 20px ;
    box-sizing: border-box;
}
.footer{
    position: absolute;
    bottom: 10px;
    right: 20px;
}
</style>
