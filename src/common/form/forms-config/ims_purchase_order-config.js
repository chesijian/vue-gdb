export const purchaseOrderConfig = {
  formKey: 'mat_purchase_order',
  title: '采购订单',
  appTitle: '采购订单',
  width: 500,
  height: 400,
  enable: 1,
  type: 'query-form',
  ifHasProcess: 1,
  forms: [
    {
      title: '采购订单',
      entity: 't_ims_purchase_order',
      tableName: 't_ims_purchase_order',
      type: 'grid', // 区分是否为树表或子表
      expandAll: true,
      formWidth: '1000px', // 表单宽度
      formHeight: '768px', // 表单高度
      cloNum: 3,
      queryColumns: [
        {
          columnName: 'CODE_',
          javaType: 'String',
          width: 100,
          matchType: 'like', // 匹配类型
          title: '单据编码'
        }, {
          columnName: 'SUBJECT_',
          javaType: 'String',
          matchType: 'like', // 匹配类型
          title: '标题',
          width: 120
        }, {
          columnName: 'PROJ_CODE_',
          javaType: 'String',
          silence: true, // 表示静默字段
          onpenURL: 'form-edit',
          onpenParams: {formKey: 'project-info', title: '物资库维护'},
          width: 100,
          title: '项目编码'
        }, {
          columnName: 'PROJ_ID_',
          javaType: 'String',
          widgetType: 'select-form',
          attr: 'project-info',
          title: '项目',
          hidden: true,
          silence: true, // 表示静默字段
          width: 100
        }, {
          columnName: 'PROJ_NAME_',
          javaType: 'String',
          silence: true, // 表示静默字段
          width: 120,
          title: '项目名称'
        }, {
          columnName: 'APPLY_DEPART_ID_',
          javaType: 'String',
          widgetType: 'select-depart',
          onpenURL: 'form-view',
          onpenParams: {formKey: 'project-info', title: '物资库维护'},
          title: '申请部门',
          width: 80
        }, {
          columnName: 'APPLY_USER_ID_',
          javaType: 'String',
          widgetType: 'select-user',
          title: '申请人',
          width: 80
        }, {
          columnName: 'APPLY_DATE_',
          widgetType: 'select-date',
          javaType: 'String',
          title: '申请日期',
          width: 80
        }, {
          columnName: 'TYPE_',
          javaType: 'String',
          widgetType: 'select',
          attr: 'BUS_IMS_PURCHASE_TYPE',
          title: '采购类型',
          width: 80
        }
      ],
      formColumns: [
        {
          columnName: 'CODE_',
          javaType: 'String',
          widgetType: 'input',
          readOnly: true,
          row: 1,
          col: 1 / 3,
          title: '单据编码'
        }, {
          columnName: 'SUBJECT_',
          javaType: 'String',
          widgetType: 'input',
          require: true,
          row: 1,
          col: 1 / 3,
          title: '标题'
        }, {
          columnName: 'TYPE_',
          javaType: 'String',
          widgetType: 'select',
          attr: 'BUS_IMS_PURCHASE_TYPE',
          require: true,
          row: 1,
          col: 1 / 3,
          title: '采购类型'
        }, {
          columnName: 'PROJ_CODE_',
          javaType: 'String',
          widgetType: 'input',
          silence: true, // 表示静默字段
          require: true,
          readOnly: true,
          title: '项目编码',
          row: 2,
          col: 1 / 3
        }, {
          columnName: 'PROJ_ID_',
          javaType: 'String',
          widgetType: 'select-form',
          attr: 'project-info',
          require: true,
          row: 2,
          col: 2 / 3,
          title: '项目'
        }, {
          columnName: 'APPLY_DEPART_ID_',
          javaType: 'String',
          widgetType: 'select-depart',
          row: 3,
          col: 1 / 3,
          title: '申请部门'
        }, {
          columnName: 'APPLY_USER_ID_',
          javaType: 'String',
          widgetType: 'select-user',
          row: 3,
          col: 1 / 3,
          title: '申请人'
        }, {
          columnName: 'APPLY_DATE_',
          javaType: 'String',
          widgetType: 'select-date',
          row: 3,
          col: 1 / 3,
          title: '申请日期'
        }, {
          columnName: 'MONEY_',
          javaType: 'Double',
          widgetType: 'input',
          readOnly: true,
          sourceType: 'sub-form-summary',
          sourceAttr: '采购明细.金额.合计',
          require: true,
          row: 4,
          col: 1 / 3,
          title: '采购金额'
        }, {
          columnName: 'MONEY_CN_',
          javaType: 'String',
          widgetType: 'number-cn',
          sourceType: 'main-form-data',
          sourceAttr: 'MONEY_',
          readOnly: true,
          row: 4,
          col: 2 / 3,
          title: '采购金额大写'
        }, {
          columnName: 'CONTENT_',
          javaType: 'String',
          widgetType: 'textarea',
          row: 5,
          col: 3 / 3,
          title: '备注'
        }, {
          columnName: 'FILE_',
          javaType: 'File',
          silence: true, // 表示静默字段
          widgetType: 'file',
          row: 6,
          col: 3 / 3,
          title: '附件'
        }, {
          columnName: 'SUB_FORM_',
          silence: true, // 表示静默字段
          widgetType: 'sub-form',
          attr: 't_ims_purchase_order_det',
          row: 7,
          col: 3 / 3,
          title: '采购明细',
          config: {
            entity: 't_ims_purchase_order_det',
            tableName: 't_ims_purchase_order_det',
            subFormForeignKey: 'PARENT_UID_',
            columns: [{
              javaType: 'TopButton',
              width: 100,
              widgetType: 'select-form',
              attr: 'material-store',
              icon: 'el-icon-search',
              title: '选择物资库'
            }, {
              javaType: 'TopButton',
              width: 100,
              widgetType: 'import',
              attr: 'material-store',
              icon: 'el-icon-download',
              title: '导入'
            }, {
              columnName: 'CODE_',
              javaType: 'String',
              width: 100,
              widgetType: 'select-form',
              attr: 'material-store',
              title: '物资编码'
            }, {
              columnName: 'NAME_',
              javaType: 'String',
              width: 100,
              widgetType: 'input',
              readOnly: true,
              title: '物资名称'
            }, {
              columnName: 'MODEL_',
              javaType: 'String',
              width: 80,
              widgetType: 'input',
              readOnly: true,
              title: '型号'
            }, {
              columnName: 'SPECS_',
              javaType: 'String',
              width: 80,
              widgetType: 'input',
              readOnly: true,
              title: '规格'
            }, {
              columnName: 'UNIT_',
              javaType: 'String',
              width: 70,
              widgetType: 'select',
              attr: 'BUS_IMS_UNIT',
              title: '单位'
            }, {
              columnName: 'PRICE_',
              javaType: 'Double',
              width: 80,
              widgetType: 'number',
              title: '单价'
            }, {
              columnName: 'QUANTITY_',
              javaType: 'Double',
              width: 80,
              widgetType: 'number',
              require: true,
              title: '数量'
            }, {
              columnName: 'MONEY_',
              javaType: 'Double',
              width: 80,
              summary: true,
              expression: 'PRICE_*QUANTITY_',
              widgetType: 'number',
              readOnly: true,
              title: '金额'
            }]
          }
        }
      ]
    }
  ],
  backfillRule: {
    PROJ_ID_: 'ID_',
    PROJ_ID_LABEL_: 'NAME_',
    PROJ_NAME_: 'NAME_'
  }
}
