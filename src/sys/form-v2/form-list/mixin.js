
import CommonGridTable from "../../../common/table/grid-table/grid-table";
export const mixin = {
  data: function () {
    return {
      queryData:{},
      gridConfig:{
        columns:[
          {
            columnName: 'date',
            javaType: 'Date',
            width: 90,
            sortable: true,
            title: '日期'
          }, {
            columnName: 'name',
            javaType: 'String',
            title: '编码',
            sortable: true,
            width: 150
          }, {
            columnName: 'address',
            javaType: 'String',
            title: '地址',
            width: 250
          }
        ]
      }
    }
  },
  props: {

  },
  components: {
    CommonGridTable
  },

  computed:{

  },
  created () {

  },
  mounted () {

  },
  methods: {

  }
}
