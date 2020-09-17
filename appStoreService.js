/*
 * appStoreService - 应用商城
 * @date: 2019/07/09
 * @author: zjx <jingxi.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import request from 'utils/request';
import { SRM_AMKT } from '_utils/config';

// const { crmTenant, tenantId } = window._MESSAGE;

/**
 * 查询应用商店首页展示应用列表
 */
export async function fetchApplicationList(params) {
  return request(`${SRM_AMKT}/v1/application-public`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询应用商店首页展示套餐列表
 */
export async function fetchPackageList(params) {
  return request(`${SRM_AMKT}/v1/partner-application/page/list`, {
    method: 'GET',
    query: params,
  });
}

/**
 * submit提交
 */
export async function submitFormData(params) {
  return request(`${SRM_AMKT}/v1/customer-req-headers/submit`, {
    method: 'PUT',
    body: params,
  });
}
