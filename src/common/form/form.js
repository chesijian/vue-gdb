import {materialConfig, materialCatalogConfig} from './forms-config/material-store-config'
import {projectInfoConfig} from './forms-config/project-info-config'
import {purchaseOrderConfig} from './forms-config/ims_purchase_order-config'
export const FormUtil = function () {
  this._vue = null
  this.getFormConfig = (formKey) => {
    if (formKey === 'material-store') {
      return materialConfig
    } else if (formKey === 'material-catalog') {
      return materialCatalogConfig
    } else if (formKey === 'project-info') {
      return projectInfoConfig
    } else if (formKey === 'ims-purchase-order'|| formKey === 'mat_purchase_order') {
      return purchaseOrderConfig
    }
    return {}
  }
  this.getEntity = (entity) => {
    if (entity === 'IMS_MAT_CATALOG') {
      return {
        tableName: 'IMS_MAT_CATALOG',
        children: [{
          tableName: 'IMS_MAT_INFO',
          foreignKey: 'PARENT_ID_'
        }]
      }
    } else if (entity === 'IMS_MAT_INFO') {
      return {
        tableName: 'IMS_MAT_INFO'
      }
    } else if (entity === 't_ims_purchase_order') {
      return {
        tableName: 't_ims_purchase_order',
        children: [{
          tableName: 't_ims_purchase_order_DET',
          foreignKey: 'PARENT_UID_'
        }]
      }
    }
  }
}
export const formUtil = new FormUtil()
