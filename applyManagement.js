/**
 * model - 应用管理
 * @date: 2019-07-03
 * @author: WY <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */
import uuid from 'uuid/v4';
import { queryMapIdpValue } from 'services/api';
import { createPagination, getResponse } from 'utils/utils';
import {
  update,
  queryList,
  serveList,
  queryDetail,
  interfaceList,
  fetchExistentService, // 查询模块下已分配服务
  fetchNoExistentService, // 查询模块下未分配服务
  addService,
  removeService,
  servicesMRList,
  interfaceMRList,
  delServicesMRList,
  saveServicesMRList,
  delInterfaceMRList,
  saveInterfaceMrList,
  updateServicesMRList,
  publishServicesMRList,
  fetchAllServicesMRList,
} from '../services/applyManagementService';

export default {
  namespace: 'applyManagement',
  state: {
    enumMap: {}, // 列表值集
    detailEnumMap: {}, // 详情值集
    measureRuleMap: [], // 服务计量规则值集
    measureObjectMap: [], // 计量对象值集
    measureMethodMap: [], // 接口计量方式值集
    measureObjectPeriodUnitMap: [], // 计量对象有效期值集
    dataSource: [],
    pagination: {},
    defaultActiveKey: '', // tab默认选中
    editBasicInfo: {}, // 应用明细基本信息
    servicesMRBasicInfo: {}, // 服务计量规则头部信息
    editServeDataSource: [], // 明细服务管理列表信息
    editInterfaceDataSource: [], // 明细接口管理列表信息
    editServePagination: {}, // 明细接口管理列表分页
    editInterfacePagination: {}, // 明细服务管理列表分页
    editListRowInfo: {}, // 明细列表行信息
    exitServiceList: [], // 模块下已分配服务
    noExitServiceList: [], // 模块下未分配服务
    exitPagination: {}, // 模块下已分配服务分页
    noExitPagination: {}, // 模块下未分配服务分页
    allServicesMRList: [], // 服务下所有的（不分页）计量规则
    servicesMRList: [], // 服务下计量规则列表
    servicesMRPagination: {}, // 服务下计量规则列表分页
    interfaceMRList: [], // 接口计量方式列表
    newPagination: {}, // 应用管理跳转至明细页分页信息明细】
    detailedJump: false,
  },

  effects: {
    // -查询列表
    *queryList({ payload }, { call, put }) {
      const response = getResponse(yield call(queryList, payload));
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: response.content,
            pagination: createPagination(response),
          },
        });
      }
    },

    // -查询应用明细
    *queryDetail({ payload }, { call, put }) {
      const response = getResponse(yield call(queryDetail, payload));
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            editBasicInfo: response,
          },
        });
      }
      return response;
    },

    // -查询应用下服务列表
    *serveList({ payload }, { call, put }) {
      const response = getResponse(yield call(serveList, payload));
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            editServeDataSource: response.content.map(n => ({
              ...n,
              _status: 'update',
            })),
            editServePagination: createPagination(response),
          },
        });
      }
      return response;
    },

    // -查询应用下接口列表
    *interfaceList({ payload }, { call, put }) {
      const response = getResponse(yield call(interfaceList, payload));
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            editInterfaceDataSource: response.content.map(n => ({
              ...n,
              _status: 'update',
            })),
            editInterfacePagination: createPagination(response),
          },
        });
      }
      return response;
    },

    // -查询服务下所有的（不分页）计量规则列表
    *fetchAllServicesMRList({ payload }, { call, put }) {
      const response = getResponse(yield call(fetchAllServicesMRList, payload));
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            allServicesMRList: response,
          },
        });
      }
      return response;
    },

    // -查询服务下计量规则定义列表
    *servicesMRList({ payload }, { call, put }) {
      const response = getResponse(yield call(servicesMRList, payload));
      if (response) {
        const { content } = response;
        const { applicationName, serviceCode, serviceName } = content.length >= 1 ? content[0] : {};
        yield put({
          type: 'updateState',
          payload: {
            servicesMRList: response.content.map(n => {
              return {
                _status: 'update',
                ...n,
              };
            }),
            servicesMRPagination: createPagination(response),
            servicesMRBasicInfo: { applicationName, serviceCode, serviceName },
          },
        });
      }
      return response;
    },

    // -查询接口下计量方式列表
    *interfaceMRList({ payload }, { call, put }) {
      const response = getResponse(yield call(interfaceMRList, payload) || []);
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            interfaceMRList: response.map(item => {
              const { interfaceMmId } = item;
              return {
                ...item,
                interfaceMmId: interfaceMmId ? item.interfaceMmId : uuid(),
                _status: interfaceMmId ? 'update' : 'create',
              };
            }),
          },
        });
      }
      return response;
    },

    // 添加/保存服务下计量规则
    *saveServicesMRList({ payload }, { call }) {
      const response = getResponse(yield call(saveServicesMRList, payload));
      return response;
    },

    // 删除服务下新建状态计量规则
    *delServicesMRList({ payload }, { call }) {
      const response = getResponse(yield call(delServicesMRList, payload));
      return response;
    },

    // 启用/禁用服务下计量规则
    *updateServicesMRList({ payload }, { call }) {
      const response = getResponse(yield call(updateServicesMRList, payload));
      return response;
    },

    // 批量发布服务计量规则
    *publishServicesMRList({ payload }, { call }) {
      const response = getResponse(yield call(publishServicesMRList, payload));
      return response;
    },

    // 添加接口计量方式
    *saveInterfaceMrList({ payload }, { call }) {
      const response = getResponse(yield call(saveInterfaceMrList, payload));
      return response;
    },

    /**
     * 删除接口计量方式
     * @param {*} param0
     * @param {*} param1
     */
    *delInterfaceMRList({ payload }, { call }) {
      const response = getResponse(yield call(delInterfaceMRList, payload));
      return response;
    },

    // 更新应用管理列表
    *update({ payload }, { call }) {
      const response = getResponse(yield call(update, payload));
      return response;
    },

    // -查询值集
    *init(params, { call, put }) {
      const enumMap = getResponse(
        yield call(queryMapIdpValue, {
          flag: 'HPFM.FLAG',
        })
      );
      const measureRuleMap = getResponse(
        yield call(queryMapIdpValue, {
          flag: 'AMKT.MEASURE_RULE',
        })
      ).flag|| [];
      const measureObjectMap = getResponse(
        yield call(queryMapIdpValue, {
          flag: 'AMKT.MEASURE_OBJECT',
        })
      ).flag|| [];
      const measureMethodMap = getResponse(
        yield call(queryMapIdpValue, {
          flag: 'AMKT.MEASURE_METHOD',
        })
      ).flag|| [];
      const measureObjectPeriodUnitMap = getResponse(
        yield call(queryMapIdpValue, {
          flag: 'AMKT.DATE_UNIT',
        })
      ).flag|| [];
      yield put({
        type: 'updateState',
        payload: {
          enumMap: enumMap || {},
          measureRuleMap,
          measureObjectMap,
          measureMethodMap,
          measureObjectPeriodUnitMap,
        },
      });
    },
    // 查询模块下已分配服务
    *fetchExitServiceList({ payload }, { call, put }) {
      const exitRes = getResponse(yield call(fetchExistentService, payload));
      if (exitRes) {
        yield put({
          type: 'updateState',
          payload: {
            exitServiceList: exitRes.content || [],
            exitPagination: createPagination(exitRes),
          },
        });
      }
    },
    // 查询模块下未分配服务
    *fetchNoExitServiceList({ payload }, { call, put }) {
      const exitNoRes = getResponse(yield call(fetchNoExistentService, payload));
      if (exitNoRes) {
        yield put({
          type: 'updateState',
          payload: {
            noExitServiceList: exitNoRes.content || [],
            noExitPagination: createPagination(exitNoRes),
          },
        });
      }
    },
    // 添加接口
    *addService({ payload }, { call }) {
      const res = yield call(addService, payload);
      return getResponse(res);
    },
    // 删除接口
    *removeService({ payload }, { call }) {
      const res = yield call(removeService, payload);
      return getResponse(res);
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
