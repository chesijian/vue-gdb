<template>
    <div>
        <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :pager-count="pagerCount"
        :layout="layout"
        :total="totalCount">
        </el-pagination>
    </div>
</template>

<script>
import { mixin } from './mixin'

export default {
    mixins: [ mixin ]
}
</script>


