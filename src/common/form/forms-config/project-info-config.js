export const projectInfoConfig = {
  formKey: 'project-info',
  title: '项目立项',
  appTitle: '项目立项',
  width: 500,
  height: 400,
  enable: 1,
  ifHasProcess: 1,
  type: 'query-form',
  forms: [
    {
      title: '项目信息',
      entity: 'T_PROJECT',
      tableName: 'T_PROJECT',
      type: 'grid',
      expandAll: true,
      formWidth: '400px', // 表单宽度
      formHeight: '420px', // 表单高度
      cloNum: 1,
      queryColumns: [
        {
          columnName: 'CODE_',
          javaType: 'String',
          width: 150,
          title: '项目编码'
        }, {
          columnName: 'NAME_',
          javaType: 'String',
          title: '项目名称',
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
          title: '项目编码'
        }, {
          columnName: 'NAME_',
          javaType: 'String',
          require: true,
          row: 2,
          col: 1,
          widgetType: 'input',
          title: '项目名称'
        }
      ]
    }
  ],
  backfillRule: {
    PROJ_ID_: 'ID_',
    PROJ_ID_LABEL_: 'NAME_',
    PROJ_CODE_: 'CODE_',
    PROJ_NAME_: 'NAME_'
  }
}


[
  {
    "id":'sd24fasdf56a44aer4',
    "cloNum": 1,
    "entity": "T_PROJECT",
    "tableName": "T_PROJECT",
    "expandAll": 0,
    "formHeight": "420px",
    "formWidth": "400px",
    "formKey": "testsave",
    "title": "项目信息",
    "type": "1",
    "formColumns": [
      {
        "columnName": "CODE_",
        "javaType": "string",
        "formKey": "testsave",
        "require": 0,
        "row": 1,
        "col": 1,
        "widgetType": "input",
        "title": "项目编号",
      },
      {
        "columnName": "NAME_",
        "javaType": "string",
        "formKey": "testsave",
        "require": 0,
        "row": 2,
        "col": 1,
        "widgetType": "input",
        "title": "项目名称",
      }
    ]
  }
]