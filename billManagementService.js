/**
 * billManagement -订单的账单
 * @date: 2019-9-18
 * @author hl <li.huang04@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';

import request from 'utils/request';
import { SRM_AMKT } from '_utils/config.js';

/**
 * 请求账单基本信息
 * @param {*} params
 */
export async function fetchBasicInfo(params) {
  const { organizationId, isClient, orderLineId, crmTenant } = params;
  const url = isClient ? `${organizationId}/order-headers/order-detail` : `order-bill-header`;
  return request(`${SRM_AMKT}/v1/${url}`, {
    method: 'GET',
    query: { orderLineId, crmTenant },
  });
}
/**
 * 请求账单列表
 * @param {*} params
 */
export async function fetchBillList(params) {
  const param = parseParameters(params);
  const { organizationId, isClient, listParams = {} } = param;
  const url = isClient ? `/${organizationId}` : '';
  return request(`${SRM_AMKT}/v1${url}/order-bills`, {
    method: 'GET',
    query: parseParameters(listParams),
  });
}

/**
 * 付款
 * @param {*} params
 */
export async function payFor(params) {
  return request(`${SRM_AMKT}/v1/payment-records`, {
    method: 'POST',
    body: parseParameters(params),
  });
}

/**
 * 请求账单明细基本信息（部分）
 * @param {*} params
 */
export async function fetchDetailBasicInfo(params) {
  const { organizationId, isClient, ...otherParams } = params;
  const url = isClient ? `/${organizationId}` : '';
  return request(`${SRM_AMKT}/v1${url}/order-bill-details-header`, {
    method: 'GET',
    query: { ...otherParams },
  });
}
/**
 * 请求账单明细列表
 * @param {*} params
 */
export async function fetchBillDetailList(params) {
  const { organizationId, isClient, ...otherParams } = params;
  const url = isClient ? `/${organizationId}` : ``;
  return request(`${SRM_AMKT}/v1${url}/order-bill-details`, {
    method: 'GET',
    query: parseParameters(otherParams),
  });
}
/**
 * 请求账单周期内服务使用详情列表
 * @param {*} params
 */
export async function fetchUsedDetailList(params) {
  const param = parseParameters(params);
  return request(`${SRM_AMKT}/v1/partner-application`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 请求账单周期内周期明细列表
 * @param {*} params
 */
export async function fetchCycleDetailList(params) {
  const { organizationId, isClient, billLineId, ...otherParams } = params;
  const url = isClient ? `/${organizationId}` : '';
  return request(`${SRM_AMKT}/v1${url}/bill-cycle-detail/${billLineId}`, {
    method: 'GET',
    query: parseParameters(otherParams),
  });
}
