/**
 * orderManagement -订单管理
 * @date: 2019-9-10
 * @author wxm <xiaomin.wang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import request from 'utils/request';
import { SRM_AMKT } from '_utils/config.js';
import { parseParameters } from 'utils/utils';

// const { crmTenant, tenantId } = window._MESSAGE;

// 订单管理list页面数据
export async function fetchList(params) {
  const { crmTenant, tenantId } = params;
  const param = parseParameters(params);
  return request(`${SRM_AMKT}/v1/${tenantId}/order-headers/order-list`, {
    method: 'GET',
    query: { ...param, tenantId, crmTenant },
  });
}

// 明细页面表头数据
export async function fetchDetailHeader(params) {
  const { crmTenant, tenantId } = params;
  return request(`${SRM_AMKT}/v1/${tenantId}/order-headers/order-detail`, {
    method: 'GET',
    query: { ...params, tenantId, crmTenant },
  });
}

// 明细页面数据
export async function fetchDetailList(params) {
  const { crmTenant, tenantId } = params;
  const param = parseParameters(params);
  return request(`${SRM_AMKT}/v1/${tenantId}/order-service/service-list`, {
    method: 'GET',
    query: { ...param, tenantId, crmTenant },
  });
}

// 付款记录
export async function fetchPayRecord(params) {
  const param = parseParameters(params);
  const { tenantId } = params;
  return request(`${SRM_AMKT}/v1/${tenantId}/payment-records`, {
    method: 'GET',
    query: { ...param },
  });
}

// 明细页面表头数据
export async function fetchOrder(params) {
  const { orderHeaderId } = params;
  const param = Number(orderHeaderId);
  return request(`${SRM_AMKT}/v1/order-headers/${orderHeaderId}`, {
    method: 'GET',
    query: param,
  });
}

// 子订单提交
export async function fetchOrderSubmit(params) {
  const { crmTenant, tenantId } = params;
  return request(`${SRM_AMKT}/v1/${tenantId}/order-headers/submit`, {
    method: 'PUT',
    body: { ...params, tenantId, crmTenant },
  });
}
