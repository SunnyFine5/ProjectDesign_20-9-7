/**
 * applyManagement - 应用管理
 * @date: 2019-07-03
 * @author: WY <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import request from 'utils/request';
import { SRM_AMKT } from '_utils/config.js';

/**
 * 获取列表
 * @async
 * @function getdate
 * @param {object}  params - 分页和查询参数
 * @returns {object} fetch Promise
 */
export async function queryList(params) {
  const param = parseParameters(params);
  return request(`${SRM_AMKT}/v1/application`, {
    method: 'GET',
    query: {...param},
  });
}

/**
 * 更新
 * @async
 * @function update
 * @param {object}  body - 头数据和行数据
 * @returns {object} fetch Promise
 */
export async function update(data) {
  return request(`${SRM_AMKT}/v1/application`, {
      method: 'POST',
      body: data,
    }
  );
}

/**
 * 应用明细
 * @async
 * @function getdate
 * @param {object}  params - 应用ID
 * @returns {object} fetch Promise
 */
export async function queryDetail(params) {
  const { applicationId } = params;
  return request(`${SRM_AMKT}/v1/application/${applicationId}`, {
    method: 'GET',
  });
}

/**
 * 应用下服务列表
 * @async
 * @function getdate
 * @param {object}  params - 应用ID
 * @returns {object} fetch Promise
 */
export async function serveList(params) {
  return request(`${SRM_AMKT}/v1/services`, {
    method: 'GET',
    query: parseParameters(params),
  });
}

/**
 * 应用下接口列表
 * @async
 * @param {object}  params - 应用ID
 * @returns {object} fetch Promise
 */
export async function interfaceList(params) {
  return request(`${SRM_AMKT}/v1/interfaces`, {
    method: 'GET',
    query: parseParameters(params),
  });
}

export async function fetchAllServicesMRList(params) {
  return request(`${SRM_AMKT}/v1/serviceMr/measure-rule/no-page`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 服务下计量规则列表
 */
export async function servicesMRList(params) {
  return request(`${SRM_AMKT}/v1/serviceMr/measure-rule`, {
    method: 'GET',
    query: parseParameters(params),
  });
}

/**
 * 服务计量规则下接口计量方式列表
 */
export async function interfaceMRList(params) {
  return request(`${SRM_AMKT}/v1/interface-mms`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 保存服务下计量规则
 * @param {*} params
 */
export async function saveServicesMRList(params) {
  return request(`${SRM_AMKT}/v1/serviceMr/measure-rule`, {
    method: 'POST',
    body: params.serviceMrList,
  });
}

/**
 * 删除服务下新建状态计量规则
 * @param {*} params
 */
export async function delServicesMRList(params) {
  return request(`${SRM_AMKT}/v1/serviceMr/measure-rule`, {
    method: 'DELETE',
    body: params.delList,
  });
}

/**
 * 启用/禁用服务下计量规则
 * @param {*} params
 */
export async function updateServicesMRList(params) {
  return request(`${SRM_AMKT}/v1/serviceMr/measure-rule`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 批量发布服务计量规则
 * @param {*} params
 */
export async function publishServicesMRList(params){
  return request(`${SRM_AMKT}/v1/serviceMr/measure-rule/pub`, {
    method: 'PUT',
    body: params.serviceMrList,
  });
}

/**
 * 添加接口计量方式
 * @param {*} params
 */
export async function saveInterfaceMrList(params){
  return request(`${SRM_AMKT}/v1/interface-mms`, {
    method: 'POST',
    body: params.interfaceMrList,
  });
}

/**
 * 删除接口计量方式
 * @param {*} params
 */
export async function delInterfaceMRList(params){
  return request(`${SRM_AMKT}/v1/interface-mms`, {
    method: 'DELETE',
    body: params.selectedIMRowKeys,
  });
}

/**
 * 查询模块下已分配接口列表
 */
export async function fetchExistentService(params) {
  return request(`${SRM_AMKT}/v1/interfaces/interface-service`, {
    method: 'GET',
    query: parseParameters(params),
  });
}

/**
 * 查询模块下未分配接口列表
 */
export async function fetchNoExistentService(params) {
  return request(`${SRM_AMKT}/v1/interfaces/interface-service`, {
    method: 'GET',
    query: parseParameters(params),
  });
}

/**
 * 添加接口
 */
export async function addService(params) {
  return request(`${SRM_AMKT}/v1/interfaces/interface-service/add-cancel`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 删除接口
 */
export async function removeService(params) {
  return request(`${SRM_AMKT}/v1/interfaces/interface-service/add-cancel`, {
    method: 'POST',
    body: params,
  });
}
