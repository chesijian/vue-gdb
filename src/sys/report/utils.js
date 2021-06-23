// eslint-disable-next-line no-unused-vars
import grhtml5 from './grhtml5-6.6-min.js'
// eslint-disable-next-line no-unused-vars
import webapp from './grwebapp.js'

export default {
  // 启动报表工具
  webapp_ws_ajax_run (params) {
    webapp.webapp_ws_ajax_run(params)
  },
  // 生成报表预览
  reportViewer (report, data) {
    if (report) {
      var reportViewer = window.rubylong.grhtml5.insertReportViewer('report_holder')
      reportViewer.reportPrepared = false // 指定报表生成需要加载报表模板
      reportViewer.dataPrepared = false // 指定报表生成需要加载报表数据
      reportViewer.loadReport(report)
      reportViewer.loadData(data)
      reportViewer.start()
      webapp.webapp_urlprotocol_startup()
    }
  },
  // 格式化报表数据
  getReport (formConfig, type, subConfig) {
    if (type == 1) {
      return this.getQueryReport(formConfig, 1)
    }
    if (type == 2) {
      return this.getEditReport(formConfig, subConfig)
    }
  },
  // 获取表单模板
  getEditReport (formConfig, subConfig) {
    let grf = {
      'Version': '6.6.6.2',
      'Title': formConfig.title,
      'Font': {
        'Name': '宋体',
        'Size': 90000,
        'Weight': 400,
        'Charset': 134
      },
      'Printer': {
        'LeftMargin': 1.5,
        'TopMargin': 1.5,
        'RightMargin': 1.5,
        'BottomMargin': 1.5
      },
      'Parameter': [],
      'ReportHeader': []
    }
    let Report = {
      'Name': 'ReportHeader2',
      'Height': 10,
      'Control': [
        {
          'Type': 'MemoBox',
          'Name': 'MemoBox1',
          'Center': 'Horizontal',
          'Left': 7,
          'Top': 0.2,
          'Width': 7,
          'Height': 0.8,
          'Font': {
            'Name': '宋体',
            'Size': 180000,
            'Charset': 134
          },
          'TextAlign': 'MiddleJustiy',
          'Text': formConfig.title
        }
      ]
    }
    let before = 1
    let row = 1
    let col = 1
    let wid = 18 / formConfig.colNum
    formConfig.formColumns.forEach(e => {
      if (e && e.widgetType != 'sub-form') {
        if (e.row > before && e.hidden != 1) {
          col = 1
          row++
          before = e.row
        }
        if (e.widgetType == 'divider') {
          let left = 0
          let top = 1.8 + (row - 1) * 1
          col++
          let lable = {
            'Type': 'MemoBox',
            'Name': 'MemoBox1',
            'Left': left,
            'Top': top,
            'Width': 10,
            'WordWrap': true,
            'CanGrow': true,
            'Height': 1,
            'Font': {
              Name: '宋体',
              Size: 120000,
              Charset: 134
            },
            'Text': e.title
          }
          Report.Control.push(lable)
        } else if (e.widgetType != 'divider' && e.hidden != 1) {
          let left = (col - 1) * wid
          let top = 1.8 + (row - 1) * 1
          col += e.col
          let lable1 = {
            'Type': 'MemoBox',
            'Name': 'MemoBox1',
            'Font': {
              Name: '宋体',
              Size: 90000,
              Weight: 400,
              Charset: 134
            },
            'Left': left,
            'Top': top,
            'Width': 2,
            'Height': 1,
            'WordWrap': true,
            'CanGrow': true,
            'TextAlign': 'TopRight',
            'Text': e.title + '：'
          }
          let lable2 = {
            'Type': 'MemoBox',
            'Name': 'MemoBox1',
            'Font': {
              Name: '宋体',
              Size: 90000,
              Weight: 400,
              Charset: 134
            },
            'Left': left + 2,
            'Top': top,
            'WordWrap': true,
            'CanGrow': true,
            'Width': wid * e.col - 2,
            'TextAlign': 'TopLeft',
            'Height': 1,
            'Text': '[#{' + e.columnName + '}#]'
          }
          grf.Parameter.push({ 'Name': e.columnName })
          Report.Control.push(lable1)
          Report.Control.push(lable2)
        }
      }
      Report.Height = 1.8 + row * 1
    })
    if (subConfig) {
      let rep = this.getQueryReport(subConfig.config, 2)
      grf.DetailGrid = rep.DetailGrid
    }
    grf.ReportHeader.push(Report)
    console.log(JSON.stringify(grf))
    return grf
  },
  // 处理生成多表头格式
  handMoreColumns (fields) {
    // 处理多表头
    let fieldsmap = []
    // 遍历所有字段组织多表头的数据位
    for (let i = 0; i < fields.length; i++) {
      let title = fields[i].title
      // System.out.println("1===" + title + "==");
      if (title.indexOf('-') > -1) {
        let titles = title.split('-')
        let length = titles.length
        let j = length
        if (fieldsmap.find(event => { return event.title === titles[0] })) {
          let temp = fieldsmap.find(event => { return event.title === titles[0] })
          let k = 1
          for (k = 1; k < length - 1; k++) {
            if (temp.children.find(event => { return event.title === titles[k] })) {
              temp = temp.children.find(event => { return event.title === titles[k] })
            } else {
              for (let m = k; m < length - 1; m++) {
                if (!temp.children) {
                  temp.children = []
                }
                temp.children.push({title: titles[m], children: [] })
                temp = temp.find(event => { return event.title === titles[m] })
              }
              break
            }
          }
          if (!temp.children) {
            temp.children = []
          }
          fields[i].title = titles[length - 1]
          temp.children.push(fields[i])
        } else {
          fieldsmap.push({title: titles[0], children: [] })
          let temp = fieldsmap.find(event => { return event.title === titles[0] })
          for (let k = 1; k < length - 1; k++) {
            if (!temp.children) {
              temp.children = []
            }
            temp.children.push({title: titles[k], children: [] })
            temp = temp.children.find(event => { return event.title === titles[k] })
          }
          if (!temp.children) {
            temp.children = []
          }
          fields[i].title = titles[length - 1]
          temp.children.push(fields[i])
        }
      } else {
        fieldsmap.push(fields[i])
      }
    }
    return fieldsmap
  },
  // 获取查询模板(简单表头)
  getQueryReport (params, type) {
    var grf = {
      'Version': '6.6.6.2',
      'Title': params.title,
      'Font': {
        'Name': '宋体',
        'Size': 90000,
        'Weight': 400,
        'Charset': 134
      },
      'Printer': {
        'LeftMargin': 1.5,
        'TopMargin': 1.5,
        'RightMargin': 1.5,
        'BottomMargin': 1.5
      },
      'DetailGrid': {
        'Recordset': {
          'Field': []
        },
        'Column': [],
        'ColumnContent': {
          'Height': 0.8,
          'Font': {
            'Name': '宋体',
            'Size': 90000,
            'Weight': 400,
            'Charset': 134
          },
          'ColumnContentCell': []
        },
        'ColumnTitle': {
          'Height': 0.8,
          'Font': {
            'Name': '宋体',
            'Size': 90000,
            'Weight': 400,
            'Charset': 134
          },
          'RepeatStyle': 'OnPage',
          'ColumnTitleCell': []
        }
      },
      'ReportHeader': [
        {
          'Height': 1,
          'Control': [
            {
              'Type': 'StaticBox',
              'Name': 'StaticBox1',
              'Center': 'Horizontal',
              'Left': 7,
              'Top': 0.18,
              'Width': 7,
              'Height': 0.6,
              'Font': {
                'Name': '宋体',
                'Size': 150000,
                'Bold': true,
                'Charset': 134
              },
              'Text': params.title,
              'TextAlign': 'MiddleCenter'
            }
          ]
        }
      ]
    }
    let maxWidth = 0
    params.queryColumns.forEach(e => {
      if (e.javaType !== 'TopButton' && e.hidden !== 1) {
        if (e.width) {
          maxWidth += parseInt(e.width)
        } else {
          maxWidth += 100
        }
      }
    })
    let summaryList = []
    let left = 0
    let queryColumns = this.handMoreColumns(JSON.parse(JSON.stringify(params.queryColumns)))
    let moreColumns = 1
    // 如果有流程
    if (params.ifHasProcess && params.ifHasProcess === 1) {
      grf.DetailGrid.Recordset.Field.push({'Name': 'PROC_STATUS_'})
      let column = {'Name': 'PROC_STATUS_'}
      if (type === 1) {
        grf.Printer.Oriention = 'Landscape'
        column.Width = 100 / maxWidth * 28
      } else {
        column.Width = 100 / maxWidth * 21
      }
      let ColumnContent = {'Column': 'PROC_STATUS_', 'DataField': 'PROC_STATUS_', 'WordWrap': true, 'CanGrow': true}
      ColumnContent.TextAlign = 'MiddleCenter'
      grf.DetailGrid.Column.push(column)
      grf.DetailGrid.ColumnContent.ColumnContentCell.push(ColumnContent)
      let columnTitleCell = {'GroupTitle': false, 'Column': 'PROC_STATUS_', 'WordWrap': true, 'CanGrow': true, 'BackColor': 'FFFFFF', 'Text': '审批状态'}
      columnTitleCell.TextAlign = 'MiddleCenter'
      grf.DetailGrid.ColumnTitle.ColumnTitleCell.push(columnTitleCell)
      left += 100
    }
    queryColumns.forEach(e => {
      if (e.javaType !== 'TopButton' && e.hidden !== 1) {
        if (e.columnName) {
          grf.DetailGrid.Recordset.Field.push({'Name': e.columnName})
          let dataAlign = 'MiddleCenter'
          if (e.dataAlign === 'left') {
            dataAlign = 'MiddleLeft'
          } else if (e.dataAlign === 'right') {
            dataAlign = 'MiddleRight'
          }
          let column = {'Name': e.columnName}
          let ColumnContent = {'Column': e.columnName, 'DataField': e.columnName, 'WordWrap': true, 'CanGrow': true}
          if (type === 1) {
            grf.Printer.Oriention = 'Landscape'
            column.Width = (e.width || 100) / maxWidth * 28
          } else {
            column.Width = (e.width || 100) / maxWidth * 21
          }
          if (dataAlign) {
            ColumnContent.TextAlign = dataAlign
          }
          if (e.summary === 1) {
            e.TextAlign = ColumnContent.TextAlign
            e.Left = left
            e.Width = column.Width
            summaryList.push(e)
          }
          left += column.Width
          grf.DetailGrid.Column.push(column)
          grf.DetailGrid.ColumnContent.ColumnContentCell.push(ColumnContent)
          let columnTitleCell = {'GroupTitle': false, 'Column': e.columnName, 'WordWrap': true, 'CanGrow': true, 'BackColor': 'FFFFFF', 'Text': e.title}
          let titleAlign = 'MiddleCenter'
          // 标题居中
          // if (e.titleAlign === 'left') {
          //   titleAlign = 'MiddleLeft'
          // } else if (e.titleAlign === 'right') {
          //   titleAlign = 'MiddleRight'
          // }
          if (titleAlign) {
            columnTitleCell.TextAlign = titleAlign
          }
          grf.DetailGrid.ColumnTitle.ColumnTitleCell.push(columnTitleCell)
        } else {
          if (e.children && e.children.length > 0) {
            moreColumns = 2
            let columnTitleCell = {'GroupTitle': true, 'ColumnTitleCell': [], 'Name': e.title, 'BackColor': 'FFFFFF', 'Text': e.title, 'TextAlign': 'MiddleCenter'}
            e.children.forEach(e1 => {
              if (e1.columnName) {
                grf.DetailGrid.Recordset.Field.push({'Name': e1.columnName})
                let dataAlign = 'MiddleCenter'
                if (e1.dataAlign === 'left') {
                  dataAlign = 'MiddleLeft'
                } else if (e1.dataAlign === 'right') {
                  dataAlign = 'MiddleRight'
                }
                let column = {'Name': e1.columnName}
                let ColumnContent = {'Column': e1.columnName, 'DataField': e1.columnName, 'WordWrap': true, 'CanGrow': true}
                if (type === 1) {
                  grf.Printer.Oriention = 'Landscape'
                  column.Width = (e1.width || 100) / maxWidth * 28
                } else {
                  column.Width = (e1.width || 100) / maxWidth * 21
                }
                if (dataAlign) {
                  ColumnContent.TextAlign = dataAlign
                }
                if (e1.summary === 1) {
                  e1.TextAlign = ColumnContent.TextAlign
                  e1.Left = left
                  e1.Width = column.Width
                  summaryList.push(e1)
                }
                left += column.Width
                grf.DetailGrid.Column.push(column)
                grf.DetailGrid.ColumnContent.ColumnContentCell.push(ColumnContent)
                let columnTitleCell1 = {'GroupTitle': false, 'Column': e1.columnName, 'WordWrap': true, 'CanGrow': true, 'BackColor': 'FFFFFF', 'Text': e1.title}
                let titleAlign = 'MiddleCenter'
                if (titleAlign) {
                  columnTitleCell1.TextAlign = titleAlign
                }
                columnTitleCell.ColumnTitleCell.push(columnTitleCell1)
              } else {
                if (e1.children && e1.children.length > 0) {
                  moreColumns = 3
                  let columnTitleCell1 = {'GroupTitle': true, 'ColumnTitleCell': [], 'Name': e1.title, 'BackColor': 'FFFFFF', 'Text': e1.title, 'TextAlign': 'MiddleCenter'}
                  e1.children.forEach(e2 => {
                    if (e2.columnName) {
                      grf.DetailGrid.Recordset.Field.push({'Name': e2.columnName})
                      let dataAlign = 'MiddleCenter'
                      if (e2.dataAlign === 'left') {
                        dataAlign = 'MiddleLeft'
                      } else if (e2.dataAlign === 'right') {
                        dataAlign = 'MiddleRight'
                      }
                      let column = {'Name': e2.columnName}
                      let ColumnContent = {'Column': e2.columnName, 'DataField': e2.columnName, 'WordWrap': true, 'CanGrow': true}
                      if (type === 1) {
                        grf.Printer.Oriention = 'Landscape'
                        column.Width = (e2.width || 100) / maxWidth * 28
                      } else {
                        column.Width = (e2.width || 100) / maxWidth * 21
                      }
                      if (dataAlign) {
                        ColumnContent.TextAlign = dataAlign
                      }
                      if (e2.summary === 1) {
                        e2.TextAlign = ColumnContent.TextAlign
                        e2.Left = left
                        e2.Width = column.Width
                        summaryList.push(e2)
                      }
                      left += column.Width
                      grf.DetailGrid.Column.push(column)
                      grf.DetailGrid.ColumnContent.ColumnContentCell.push(ColumnContent)
                      let columnTitleCell2 = {'GroupTitle': false, 'Column': e2.columnName, 'WordWrap': true, 'CanGrow': true, 'BackColor': 'FFFFFF', 'Text': e2.title}
                      let titleAlign = 'MiddleCenter'
                      if (titleAlign) {
                        columnTitleCell2.TextAlign = titleAlign
                      }
                      columnTitleCell1.ColumnTitleCell.push(columnTitleCell2)
                    }
                  })
                  columnTitleCell.ColumnTitleCell.push(columnTitleCell1)
                }
              }
            })
            grf.DetailGrid.ColumnTitle.ColumnTitleCell.push(columnTitleCell)
          }
        }
      }
    })
    grf.DetailGrid.ColumnTitle.Height = (moreColumns > 1) ? 0.6 * moreColumns : 0.8 * moreColumns
    if (summaryList.length > 0) {
      let Group = [
        {
          'Name': 'Group1',
          'GroupHeader': {
            'Height': 0
          },
          'GroupFooter': {
            'Height': 0.8,
            'Control': [
              {
                'Type': 'MemoBox',
                'Name': 'MemoBox10',
                'AlignColumn': grf.DetailGrid.Column[0].Name,
                'Height': 0.8,
                'Border': {
                  'Styles': '[DrawRight]'
                },
                'Font': {
                  'Name': '宋体',
                  'Size': 90000,
                  'Bold': true,
                  'Charset': 134
                },
                'TextAlign': 'MiddleCenter',
                'Text': '合计'
              }
            ]
          }
        }
      ]
      for (let index = 0; index < summaryList.length; index++) {
        const e = summaryList[index]
        let Item = {
          Type: 'MemoBox',
          Name: 'MemoBox' + (11 + index),
          AlignColumn: e.columnName,
          Left: e.Left,
          Width: e.Width,
          Height: 0.8,
          Border: {
            Styles: '[DrawLeft|DrawRight]'
          },
          Font: {
            Name: '宋体',
            Size: 90000,
            Bold: 'T',
            Charset: 134
          },
          TextAlign: e.TextAlign,
          Text: '[#Sum(' + e.columnName + '):#,##0.###]'
        }
        Group[0].GroupFooter.Control.push(Item)
      }
      grf.DetailGrid.Group = Group
    }
    return grf
  },
  getSubData (params) {
    let subData = []
    params.formColumns.forEach(e => {
      if (e.widgetType === 'sub-form') {
        if (e.config.tableData) {
          e.config.tableData.forEach(ele => {
            subData.push(ele)
          })
        }
      }
    })
    return subData
  },
  // 获取总行数
  getRowCount (formColumns) {
    let col = 0
    formColumns.forEach(e => {
      if (e && e.widgetType != 'sub-form' && e.row > col) {
        col = e.row
      }
    })
    return col
  }
}
