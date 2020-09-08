/**
 * model - 认证类型定义
 * @date: 2019-07-05
 * @author: WY <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryList, update } from '../services/approveTypeService';

export default {
  namespace: 'approveType',
  state: {
    dataSource: [],
    pagination: {},
    selectedRows: [],
  },

  effects: {
    // -查询列表
    *queryList({ payload }, { call, put }) {
      if(payload.page && payload.page.pageSize % 10 !== 0){
        payload.page.pageSize = 10;
      }
      const response = getResponse(yield call(queryList, payload));
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: response.content.map(n => ({
              ...n,
              _status: 'update',
            })),
            pagination: createPagination(response),
          },
        });
      }
    },
    // 更新列表
    *update({ payload }, { call }) {
      const response = getResponse(yield call(update, payload));
      return response;
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
