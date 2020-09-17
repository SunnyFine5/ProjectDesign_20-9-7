/**
 * 服务账号配置 -
 * @date: 2019-7-15
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import request from 'utils/request';
import { SRM_AMKT } from '_utils/config.js';

export async function fetchList(params) {
  const param = parseParameters(params);
  return request(`${SRM_AMKT}/v1/accounts/list-accounts`, {
    method: 'GET',
    query: { ...param },
  });
}

export async function fetchSaveModalData(params) {
  return request(`${SRM_AMKT}/v1/accounts/create-or-update`, {
    method: 'POST',
    body: { ...params },
  });
}

