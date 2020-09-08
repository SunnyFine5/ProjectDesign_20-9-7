/**
 * partnerManagement -合作伙伴管理 Model
 * @date: 2019-7-4
 * @author  <shengguangj.deng@hand-china.com> 
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import {
  fetchList,
  fetchSaveModalData,
} from '@/services/amktAccountConfigurationService';

export default {

  namespace: 'accountConfiguration',
  state: {
    list: {},
    pagination: {},
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const partnerList = yield call(fetchList, payload) || {};
      const result = getResponse(partnerList);
      const pagination = createPagination(result);
      yield put({
        type: 'updateState',
        payload: {
          list: result,
          pagination,
        },
      });
    },
    *fetchSaveModalData({ payload }, { call }) {
      const res = getResponse(yield call(fetchSaveModalData, payload));
      return res;
    },

  },
  reducers: {
    cancelHandle(state) {
      return { ...state };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
