export const mixin = {
    props: {
        pageSize: {
            type: Number,
            default: 10
        },
        totalCount: {
            type: Number,
            default: 1
        },
        pagerCount: {
            type: Number,
            default: 5
        },
        layout: {
            type: String,
            default: 'prev, pager, next, jumper'
        },
    },
    data () {
        return {
            currentPage: 1,
        }
    },
    methods: {
        // 选择页数
        handleCurrentChange(val) {
            this.$emit('getCurPage', val)
        }
    },
}