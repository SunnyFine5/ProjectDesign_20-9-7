/**
 * partnerManagement -合作伙伴管理 Model
 * @date: 2019-7-4
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
// import notification from 'utils/notification';
import {
  fetchList,
  fetchModalData,
  fetchSaveModalData,
} from '@/services/accountConfigurationService';

export default {
  namespace: 'accountConfiguration',
  state: {
    list: {},
    pagination: {},
    modalData: {},
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      let partnerList = yield call(fetchList, payload);
      if (!partnerList) {
        partnerList = {};
      }
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
    *fetchModalData({ payload }, { call, put }) {
      const { serviceTypeName, ...otherParams } = payload;
      const { serviceTypeId, partnerId } = otherParams;
      const modalData = yield call(fetchModalData, otherParams);
      const result = getResponse(modalData);
      const { data = {} } = result;
      yield put({
        type: 'updateState',
        payload: {
          modalData: { ...data, serviceTypeId, partnerId },
        },
      });
    },
    *fetchSaveModalData({ payload }, { call }) {
      const res = yield call(fetchSaveModalData, payload);
      return res || {};
    },
  },
  reducers: {
    cancelHandle(state) {
      return { ...state, modalData: {} };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
