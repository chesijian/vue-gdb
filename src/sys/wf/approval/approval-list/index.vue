<template>
  <div class="jr-container" >
    <div style="background-color: white;display: flex;flex-flow: column;height: 100%">
      <div class="jr-query-form">
        <query-form resetVisible :title="config.title" hasQuery hasTitle :topButtons="[]" :search-visible="true" :single-select="false" :multiple-select="false" @handlerTopButtonClick="handlerTopButtonClick" @queryData="queryData" :searchFormRows="searchFormRows"></query-form>
      </div>
      <div style="display: flex;flex-flow: column;height: 100%">
        <common-grid-table :config="config" ref="jr-table" ></common-grid-table>

      </div>
    </div>
  </div>
</template>

<script>
  import {mixin} from './mixin.js'
    export default {
        name: "approval-list",
        mixins: [mixin]
    }
</script>

<style scoped>

</style>
