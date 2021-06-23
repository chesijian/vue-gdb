export const materialConfig = {
  formKey: 'material-store',
  title: '物资库维护',
  appTitle: '物资库维护',
  width: 500,
  height: 400,
  enable: 1,
  ifHasProcess: 1,
  type: 'query-form',
  forms: [
    {
      title: '物资目录',
      entity: 'IMS_MAT_CATALOG',
      tableName: 'IMS_MAT_CATALOG',
      type: 'tree-grid',
      rootId: 'root',
      rootText: '物资目录',
      treeColumn: 'NAME_',
      parentColumn: 'PARENT_ID_',
      showRoot: true,
      showTitle: true,
      expandAll: true,
      formWidth: '400px', // 表单宽度
      formHeight: '420px', // 表单高度
      cloNum: 1,
      queryColumns: [
        {
          columnName: 'NAME_',
          javaType: 'String',
          width: 150,
          title: '目录名称'
        }, {
          columnName: 'CODE_',
          javaType: 'String',
          sortable: true,
          hidden: true,
          title: '编码',
          width: 100
        }
      ],
      formColumns: [
        {
          columnName: 'CODE_',
          javaType: 'String',
          require: true,
          row: 1,
          col: 1,
          widgetType: 'input',
          validType: 'num-letter',
          title: '编码'
        }, {
          columnName: 'NAME_',
          javaType: 'String',
          require: true,
          row: 2,
          col: 1,
          widgetType: 'input',
          title: '目录名称'
        }, {
          columnName: 'PARENT_ID_',
          javaType: 'String',
          require: true,
          row: 3,
          col: 1,
          widgetType: 'select-form',
          attr: 'material-catalog',
          title: '上级目录'
        }, {
          columnName: 'SORT_',
          javaType: 'Double',
          require: true,
          row: 4,
          col: 1,
          widgetType: 'number',
          title: '排序'
        }
      ]
    },
    {
      title: '材料明细',
      entity: 'IMS_MAT_INFO',
      tableName: 'IMS_MAT_INFO',
      type: 'grid',
      pageSize: 30,
      showTitle: true,
      cloNum: 2,
      formWidth: '600px', // 表单宽度
      formHeight: '460px', // 表单高度
      queryColumns: [
        {
          columnName: 'CODE_',
          javaType: 'String',
          title: '物资编码',
          widgetType: 'input',
          sortable: true,
          width: 120,
          matchType: 'like', // 匹配类型
          ifSearchForm: true,
          row: 1,
          col: 1 / 2
        }, {
          columnName: 'NAME_',
          javaType: 'String',
          title: '物资名称',
          // sortable: true,
          widgetType: 'input',
          width: 120,
          ifSearchForm: true,
          row: 1,
          col: 1 / 2,
          matchType: 'like' // 匹配类型
        }, {
          columnName: 'MODEL_',
          javaType: 'String',
          title: '型号',
          widgetType: 'input',
          width: 100
        }, {
          columnName: 'SPECS_',
          javaType: 'String',
          title: '规格',
          widgetType: 'input',
          width: 100
        }, {
          columnName: 'UNIT_',
          javaType: 'String',
          title: '单位',
          widgetType: 'select',
          attr: 'BUS_UNIT',
          width: 50
        }, {
          columnName: 'BRAND_',
          javaType: 'String',
          title: '品牌',
          width: 100
        }
      ],
      formColumns: [
        {
          columnName: 'CODE_',
          javaType: 'String',
          title: '物资编码',
          widgetType: 'input',
          require: true,
          width: 100,
          row: 1,
          col: 1 / 2
        }, {
          columnName: 'NAME_',
          javaType: 'String',
          title: '物资名称',
          require: true,
          widgetType: 'input',
          width: 120,
          row: 1,
          col: 1 / 2,
          matchType: 'like' // 匹配类型
        }, {
          columnName: 'MODEL_',
          javaType: 'String',
          title: '型号',
          require: true,
          widgetType: 'input',
          row: 2,
          col: 1 / 2,
          width: 100
        }, {
          columnName: 'SPECS_',
          javaType: 'String',
          title: '规格',
          widgetType: 'input',
          row: 2,
          col: 1 / 2,
          width: 100
        }, {
          columnName: 'UNIT_',
          javaType: 'String',
          title: '单位',
          require: true,
          widgetType: 'select',
          attr: 'BUS_IMS_UNIT',
          row: 3,
          col: 1 / 2,
          // options:[],
          width: 80
        }, {
          columnName: 'BRAND_',
          javaType: 'String',
          title: '品牌',
          row: 3,
          col: 1 / 2,
          width: 200
        }, {
          columnName: 'SORT_',
          javaType: 'Integer',
          row: 3,
          col: 1 / 2,
          widgetType: 'number',
          title: '排序'
        }, {
          columnName: 'PARENT_ID_',
          javaType: 'String',
          require: true,
          row: 4,
          col: 1 / 2,
          widgetType: 'select-form',
          attr: 'material-catalog',
          title: '物资目录'
        }, {
          columnName: 'BRAND_',
          javaType: 'String',
          row: 4,
          col: 1 / 2,
          widgetType: 'input',
          title: '品牌'
        }, {
          columnName: 'CONTENT_',
          javaType: 'String',
          row: 5,
          col: 2 / 2,
          widgetType: 'textarea',
          title: '描述'
        }
      ]
    }
  ]

}

export const materialCatalogConfig = {
  formKey: 'material-catalog',
  title: '物资库目录',
  appTitle: '物资库目录',
  width: 500,
  height: 400,
  enable: 1,
  ifHasProcess: 1,
  type: 'query',
  forms: [
    {
      title: '物资目录',
      entity: 'IMS_MAT_CATALOG',
      tableName: 'IMS_MAT_CATALOG',
      type: 'tree-grid',
      rootId: 'root',
      rootText: '物资目录',
      treeColumn: 'NAME_',
      parentColumn: 'PARENT_ID_',
      showRoot: true,
      showTitle: true,
      expandAll: true,
      formWidth: '400px', // 表单宽度
      formHeight: '420px', // 表单高度
      cloNum: 1,
      queryColumns: [
        {
          columnName: 'NAME_',
          javaType: 'String',
          width: 150,
          title: '目录名称'
        }, {
          columnName: 'CODE_',
          javaType: 'String',
          title: '编码',
          width: 100
        }
      ]
    }
  ],
  backfillRule: {
    PARENT_ID_: 'ID_',
    PARENT_ID_LABEL_: 'NAME_',
    PARENT_NAME_: 'NAME_'
  }
}
