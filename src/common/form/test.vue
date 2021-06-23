<template>
  <div>
    <el-button @click="open('material-store','物资库维护1')">打开物资库维护</el-button>
    <el-button @click="open('material-catalog','打开物资库目录')">打开物资库目录</el-button>
    <el-button type="primary" @click="open('project-info','项目立项')">项目立项</el-button>
    <el-button type="primary" @click="open('mat_purchase_order','采购订单')">采购订单</el-button>
    <el-button type="success" @click="openPage('form-list','表单管理')">表单管理</el-button>
    <el-button type="success" @click="open('form-list','表单管理（配置')">表单管理（配置）</el-button>
    <el-button type="success" @click="openPage('form-config','material-store','物资表单配置')">物资表单配置</el-button>
    <el-button type="success" @click="openPage('form-config','mat_purchase_order','采购订单表单配置')">采购订单表单配置</el-button>
    <el-button type="success" @click="openPage('form-config','form-list','表单管理表单配')">表单管理表单配置</el-button>
    <el-button type="info">信息按钮</el-button>
    <el-button type="warning">警告按钮</el-button>
    <el-button type="danger">危险按钮</el-button>
  </div>
</template>

<script>
    export default {
      name: "form-test",
      methods:{
          open(formKey,title){
            this.$router.push({
              name: 'form-query',
              params: {
                formKey,
                title
              }
            })
          },
        openPage(name,formKey,title){
          this.$router.push({
            name: name,
            params: {
              formKey,
              title
            }
          })
        }
      }
    }
</script>

<style scoped>

</style>
