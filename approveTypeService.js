/**
 * approveType - 认证类型定义
 * @date: 2019-07-05
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
  return request(`${SRM_AMKT}/v1/grant-types`, {
    method: 'GET',
    query: parseParameters(params),
  });
}

/**
 * 更新列表
 * @async
 * @function update
 * @param {object}  body - 头数据
 * @returns {object} fetch Promise
 */
export async function update(data) {
  return request(`${SRM_AMKT}/v1/grant-types`, {
      method: 'POST',
      body: data,
    }
  );
}

