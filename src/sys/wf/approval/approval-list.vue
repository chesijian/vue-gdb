<template>
    <div>

    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data(){
        return {
            tableData:[],
            searchValue:'',
            currentYear:new Date().getFullYear(),
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0,
            statusValue: 1,
            yearValue: new Date().getFullYear(),
        }
    }
}
</script>
<style scoped>

</style>
