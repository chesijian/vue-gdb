import {util} from '@/utils/utils'
import {getGridData} from './form-render'
/**
 * 加载我的审批记录
 * @param params
 */
export const getMyCommentData = () => {
  let params = {formKey: 'sys-wf-comment', id: 'sys-wf-comment-1', pageIndex: 1, pageSize: 20}
  return getGridData(params)
}

