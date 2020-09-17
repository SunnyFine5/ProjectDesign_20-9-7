/*
 * buyPackageService - 套餐选买
 * @date: 2019/09/23
 * @author: zjx <jingxi.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import request from 'utils/request';
import { SRM_AMKT } from '_utils/config';

/**
 * 查询套餐信息
 */
export async function fetchPackageDetail(params) {
  const { tenantId, ...other } = params;
  return request(`${SRM_AMKT}/v1/${tenantId}/shopping-carts/package`, {
    method: 'GET',
    query: { ...other, size: 2 },
  });
}

/**
 * 查询购物车套餐详情
 */
export async function fetchCartPackageDetail(params) {
  const { tenantId, cartId, ...other } = params;
  return request(`${SRM_AMKT}/v1/${tenantId}/shopping-carts/${cartId}`, {
    method: 'GET',
    query: { ...other, size: 2 },
  });
}

/**
 * 添加购物车
 */
export async function addCart(params) {
  const { tenantId, ...other } = params;
  return request(`${SRM_AMKT}/v1/${tenantId}/shopping-carts`, {
    method: 'POST',
    body: other,
  });
}

/**
 * 立即购买
 */
export async function buyPackage(params) {
  const { tenantId, ...other } = params;
  return request(`${SRM_AMKT}/v1/${tenantId}/shopping-carts/order-preview`, {
    method: 'POST',
    body: other,
  });
}
