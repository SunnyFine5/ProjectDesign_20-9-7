/**
 * ClientManagement -客户端管理 查询页
 * @date: 2019-7-2
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import { Button, Form, Switch, Select, Input, Badge, InputNumber } from 'hzero-ui';
import uuid from 'uuid/v4';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import notification from 'utils/notification';

import { handleVerifyIsChange } from '@/utils/verify';
import styles from '@/routes/Components/style/index.less';
import PricingModal from '@/routes/Components/PricingModel';
import MultipleSelectionLov from '@/routes/Components/MultipleSelectionLov';

const viewMessagePrompt = 'amkt.partnerManagement.view.message';
const commonPrompt = 'hzero.common';
const POSITIVEINTEGER = /^[0-9]*[1-9][0-9]*$/;

export default class PackageLineList extends React.Component {
  state = {
    pricingVisible: false,
    MultipleSelectionLovVisible: false,
    lineNumber: -1,
    serviceId: -1,
  };

  /**
   * 新建编辑行
   */
  @Bind()
  handleCreate() {
    const { dispatch, handleSetState } = this.props;
    dispatch({ type: 'customerPackage/addPackageLineListRow' });
    handleSetState({ packageLineEditFlag: true });
  }

  /**
   * qingchu
   */
  @Bind()
  handleClearEdit() {
    const { dispatch, fetchDetail, packageLineEditFlag, packageLineList = {}, selectedRowKeys, handleSetState } = this.props;
    const { list = {} } = packageLineList;
    const { content = [] } = list;
    const selectedRowContents = content.filter(
      item => !item.key && selectedRowKeys.includes(item.packageLineId)
    );
    handleVerifyIsChange({
      isChange: true,
      title: '操作将导致未保存数据丢失，是否删除？',
      callback: () => {
        dispatch({
          type: 'customerPackage/clearPackageLineListRow',
          payload: { selectedRowKeys, selectedRowContents },
        }).then(res => {
          if (res) notification.success();
          handleSetState({ selectedRowKeys: [] });
          fetchDetail();
        });
      },
    });
  }

  /**
   * 左侧选择框
   * @param {array} selectedRowKeys
   * @param {object} record
   */
  @Bind()
  onRowSelectChange(selectedRowKeys, record) {
    const { handleSetState } = this.props;
    handleSetState({ selectedRowKeys });
  }

  /**
   * 服务列表点击带出applicationId
   * @param {object} record
   */
  @Bind()
  handleClick(record, flag) {
    const { packageLineId, lineNumber = -1, serviceId } = record;
    this.setState({ packageLineId });
    if (flag === 'pricing') {
      this.setState({ pricingVisible: true });
      return null;
    } else if (flag === 'sub') {
      this.setState({ subVisible: true, lineNumber, serviceId });
      return null;
    }
  }

  /**
   * modal关闭
   */
  @Bind()
  handleCloseModal(obj) {
    this.setState(obj);
  }

  /**
   * 定价行save
   */
  @Bind()
  handleSaveModal(params) {
    // const { packageLineId, packagePriceLineList } = params;
    const { dispatch } = this.props;
    const { packageLineId } = this.state;
    console.log(params);
    
    return dispatch({
      type: 'customerPackage/fetchPricingSave',
      payload: { ...params, packageLineId },
    }).then(res => {
      if (res) notification.success();
      return res;
    });
  }

  /**
   * modal fetch数据
   * @param {object} params
   */
  @Bind()
  handleFetchPricingList(cb) {
    const { dispatch } = this.props;
    const { packageLineId } = this.state;
    dispatch({
      type: 'customerPackage/fetchPricingList',
      payload: { packageLineId },
    }).then(res => {
      cb(res);
    });
  }

  /**
   * modal里搜索的form绑定
   * @param {form} form
   */
  @Bind()
  bindForm(form) {
    this.modalForm = form;
  }

  /**
   * modal里的搜索
   */
  @Bind()
  handleModalSearch() {
    this.handleFetchPricingList();
  }

  /**
   * 选择合作伙伴套餐函数
   */
  @Bind()
  handleSelectClick() {
    this.setState({ MultipleSelectionLovVisible: true });
  }

  /**
   * 选择合作伙伴保存操作
   * @param {array} selectedContent
   */
  @Bind()
  handleSavePartner(selectedContent) {
    const { dispatch, handleSetState } = this.props;
    if(selectedContent.length>0){
      dispatch({
        type: 'customerPackage/selectedUpdate',
        payload: { packageHeaderIds: selectedContent.toString() },
      });
      handleSetState({ packageLineEditFlag: true });
    }
  }

  /**
   * fetchPartner列表
   * @param {object} params
   * @param {function} cb
   */
  @Bind()
  fetchPartnerList(params, cb) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerPackage/fetchPartnerList',
      payload: { ...params, packageType: 'partner', packageStatus: 'RELEASE', enabledFlag: 1 },
    }).then(res => {
      cb(res);
    });
  }

  /**
   * fetchSublist - 订阅弹出model
   */
  @Bind()
  fetchSubList(params, cb) {
    const { dispatch, headerData } = this.props;
    const { packageHeaderId } = headerData;
    const { serviceId, packageLineId } = this.state;
    dispatch({
      type: 'customerPackage/fetchSubList',
      payload: { ...params, packageType: 'customer', packageHeaderId, serviceId, packageLineId },
    }).then(res => {
      cb(res);
    });
  }

  /**
   * 订阅免费服务保存
   * @param {array} selectedRowKeys
   * @param {array} selectedContent
   */
  @Bind()
  handleSaveSub(selectedRowKeys, selectedContent) {
    const { dispatch, handleSetState } = this.props;
    const { packageLineId, lineNumber } = this.state;
    if(selectedContent.length>0){
      let newSelectedContent = selectedContent.map(item => ({
        ...item,
        key: uuid(),
        subFlag: true,
        chargingMethod: 'SUB',
        chargingMethodMeaning: '订阅内免费',
        cycleFlag: 0,
      }));
      if (packageLineId >= 0) {
        newSelectedContent = selectedContent.map(item => ({
          ...item,
          partnerPackageLineId: packageLineId,
          partnerLineNumber: lineNumber,
          key: uuid(),
          subFlag: true,
          chargingMethod: 'SUB',
          chargingMethodMeaning: '订阅内免费',
          cycleFlag: 0,
        }));
      }
      dispatch({
        type: 'customerPackage/selectedReducer',
        payload: { flag: 'sub', content: newSelectedContent },
      });
      handleSetState({ packageLineEditFlag: true });
    }
  }

  /**
   * lov change事件的处理函数
   * @param {value} a
   * @param {object} dObj
   * @param {object} record
   * @param {string} flag
   */
  @Bind()
  lovChange(val, dObj, record, flag) {
    const { dispatch, packageLineList } = this.props;
    const { list = {} } = packageLineList;
    const { content = [] } = list;
    const { $form } = record;
    let otherParams = {};
    switch (flag) {
      case 'measureRule':
        const {
          measureObjectMeaning,
          measureObject,
          measureUnit,
          serviceMrId,
          measureRule: mR,
          measureRuleMeaning: mRM,
        } = dObj;
        if (mR === 'SUBSCRIBE') {
          otherParams = { measureObjectMeaning, measureObject, measureUnit, serviceMrId };
        } else {
          otherParams = {
            measureObjectMeaning,
            measureObject,
            measureUnit,
            serviceMrId,
            measureRule: mR,
            measureRuleMeaning: mRM,
          };
        }
        break;
      case 'partnerPkName':
        const { partnerName, packageName, partnerId, packageHeaderId } = dObj;
        otherParams = {
          partnerName,
          partnerPkName: packageName,
          partnerId,
          partnerPackageId: packageHeaderId,
        };
        break;
      case 'chargingMethod':
        const { key } = dObj;
        otherParams = { chargingMethod: key };
        break;
      case 'applicationId':
        const { applicationId } = dObj;
        otherParams = {
          applicationId,
          serviceId: null,
          serviceName: null,
          partnerName: null,
          partnerId: null,
          packageHeaderId: null,
          partnerPkName: null,
          partnerServiceId: null,
          measureRule: null,
          measureRuleMeaning: null,
          serviceMrId: null,
          measureObjectMeaning: null,
          measureObject: null,
          measureUnit: null,
        };
        break;
      case 'serviceId':
        const {
          serviceId,
          serviceName,
          partnerServiceId,
          measureRule: e,
          measureRuleMeaning,
          measureObject: a,
          measureObjectMeaning: d,
          measureUnit: b,
          serviceMrId: c,
        } = dObj;
        otherParams = {
          serviceId,
          serviceName,
          partnerServiceId,
          measureObject: a,
          measureUnit: b,
          serviceMrId: c,
          partnerName: null,
          partnerPkName: null,
          measureObjectMeaning: d,
          measureRuleMeaning,
          measureRule: e,
        };
        $form.setFieldsValue({measureRuleMeaning, measureRule: e});
        break;
      case 'cycleFlag':
        otherParams = {cycleFlag: val};
        if(val===0){
          otherParams = {
            cycleFlag: val,
            packageCycle: null,
            packageCycleUnit: null,
            packageCycleUnitMeaning: null,
          };
          $form.setFieldsValue({cycleFlag: val, packageCycle: null, packageCycleUnit: null, packageCycleUnitMeaning: null});
        }
        break;
      case 'selectionFlag':
        if (val === 1) {
          otherParams = {
            selectionFlag: 1,
            partnerPkName: null,
            partnerId: null,
            partnerName: null,
          };
        } else {
          otherParams = { selectionFlag: 0, selectionClass: null };
        }
        break;
      default:
        break;
    }
    const { packageLineId, key } = record;
    const editRowKey = packageLineId || key;
    const newContent = content.map(item => {
      const itemKey = item.packageLineId || item.key;
      if (itemKey === editRowKey) {
        return { ...item, ...otherParams };
      }
      return item;
    });
    dispatch({
      type: 'customerPackage/updateState',
      payload: {
        packageLineList: { ...packageLineList, list: { ...list, content: newContent } },
      },
    });
  }

  /**
   * 删除定级行
   * @param {array} priceList
   */
  @Bind()
  handleDeletePriceList(priceList) {
    const { dispatch } = this.props;
    dispatch({ type: 'customerPackage/deletePriceList', payload: { priceList } }).then(res => {
      if (res) notification.success();
    });
  }

  /**
   * InputNumber max校验函数
   * @param {rule} rule
   * @param {value} value
   * @param {cb} callback
   */
  @Bind()
  validatorFunc(rule, value, callback) {
    if (value > 9999999999) {
      callback(value);
    }
    callback();
  }

  render() {
    const {
      packageLineList = {},
      handleChange,
      fetchLoading,
      fetchSaveing,
      fetchList,
      handleInputChange,
      fetchPricingList,
      packageStatus,
      headerData = {},
      editFlag,
      chargingMethodJson,
      dateUnitJson,
      fetchPartnerListLoading,
      fetchSubListLoading,
      selectedRowKeys,
    } = this.props;
    const { list = {}, pagination = {} } = packageLineList;
    const { content = [] } = list;
    const { paymentMethod = '' } = headerData;
    const { pricingVisible, MultipleSelectionLovVisible, subVisible } = this.state;
    const columns = [
      {
        title: intl.get(`${viewMessagePrompt}.lineNumber`).d('行号'),
        dataIndex: 'lineNumber',
        key: 'lineNumber',
        width: 160,
        render: (text, record) => {
          const returnComponent =
            packageStatus === 'RELEASE' ? (
              text
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator('lineNumber', {
                  rules: [
                    {
                      required: true,
                      message: `${intl.get(`${viewMessagePrompt}.lineNumber`).d('行号')}不能为空`,
                    },
                    {
                      pattern: POSITIVEINTEGER,
                      message: `${intl
                        .get(`${viewMessagePrompt}.lineNumber`)
                        .d('行号')}必须为数字正整数`,
                    },
                    {
                      validator: this.validatorFunc,
                      message: intl.get(`hzero.common.validation.max`, {
                        max: 10,
                      }),
                    },
                  ],
                  initialValue: record.lineNumber,
                })(
                  <InputNumber
                    min={0}
                    onChange={() => handleChange(record)}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            );
          return returnComponent;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.applicationName`).d('应用'),
        dataIndex: 'applicationName',
        key: 'applicationName',
        width: 200,
        render: (text, record) => {
          // const lovFlag = 'lov';
          const returnComponent =
            packageStatus === 'RELEASE' ? (
              text
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator('applicationId', {
                  rules: [
                    {
                      required: true,
                      message: `${intl
                        .get(`${viewMessagePrompt}.applicationName`)
                        .d('应用')}不能为空`,
                    },
                  ],
                  initialValue: record.applicationId,
                })(
                  <Lov
                    textValue={record.applicationName}
                    onChange={(a, b) => {
                      const { $form } = record;
                      this.lovChange(a, b, record, 'applicationId');
                      handleChange(record);
                      $form.setFieldsValue({
                        serviceId: null,
                        serviceName: null,
                        partnerName: null,
                        partnerId: null,
                        packageHeaderId: null,
                        partnerPkName: null,
                        partnerServiceId: null,
                        measureRule: null,
                        measureRuleMeaning: null,
                        serviceMrId: null,
                        measureObjectMeaning: null,
                        measureObject: null,
                        measureUnit: null,
                      });
                    }}
                    code="AMKT.APPLICATION"
                    className={styles.ellipsisInput}
                    lovOptions={{ displayField: 'applicationName', valueField: 'applicationId' }}
                  />
                )}
              </Form.Item>
            );
          return returnComponent;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.serviceName`).d('服务'),
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: 240,
        render: (text, record) => {
          // const lovFlag = 'lov';
          const { applicationId } = record;
          const returnComponent =
            packageStatus === 'RELEASE' ? (
              text
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator('serviceId', {
                  rules: [
                    {
                      required: true,
                      message: `${intl.get(`${viewMessagePrompt}.serviceName`).d('服务')}不能为空`,
                    },
                  ],
                  initialValue: record.serviceId,
                })(
                  <Lov
                    disabled={!applicationId}
                    textValue={record.serviceName}
                    code="AMKT.SERVICE"
                    onChange={(a, b) => {
                      this.lovChange(a, b, record, 'serviceId');
                      handleChange(record);
                    }}
                    queryParams={{ applicationId, enabledFlag: 1 }}
                    className={styles.ellipsisInput}
                    lovOptions={{ displayField: 'serviceName', valueField: 'serviceId' }}
                  />
                )}
              </Form.Item>
            );
          return returnComponent;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.priorityLevel`).d('优先级'),
        dataIndex: 'priorityLevel',
        key: 'priorityLevel',
        width: 160,
        render: (text, record) => {
          const returnComponent =
            packageStatus === 'RELEASE' ? (
              text
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator('priorityLevel', {
                  rules: [
                    {
                      required: true,
                      message: `${intl
                        .get(`${viewMessagePrompt}.priorityLevel`)
                        .d('优先级')}不能为空`,
                    },
                    {
                      pattern: POSITIVEINTEGER,
                      message: `${intl
                        .get(`${viewMessagePrompt}.priorityLevel`)
                        .d('优先级')}必须为数字正整数`,
                    },
                    {
                      validator: this.validatorFunc,
                      message: intl.get(`hzero.common.validation.max`, {
                        max: 10,
                      }),
                    },
                  ],
                  initialValue: record.priorityLevel,
                })(
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    onChange={() => handleChange(record)}
                    className={styles.ellipsisInput}
                  />
                )}
              </Form.Item>
            );
          return returnComponent;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.chargingMethodMeaning`).d('计费方式'),
        dataIndex: 'chargingMethodMeaning',
        key: 'chargingMethodMeaning',
        width: 150,
        render: (text, record) => {
          const { subFlag = false, chargingMethodMeaning, partnerPackageLineId = null } = record;
          const returnComponent =
            packageStatus === 'RELEASE' || subFlag || partnerPackageLineId ? (
              chargingMethodMeaning
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator('chargingMethod', {
                  rules: [
                    {
                      required: true,
                      message: `${intl
                        .get(`${viewMessagePrompt}.chargingMethod`)
                        .d('计费方式')}不能为空`,
                    },
                  ],
                  initialValue: record.chargingMethod,
                })(
                  <Select
                    onChange={(chargingMethod, chargingMethodOpt) => {
                      handleChange(record);
                      this.lovChange(chargingMethod, chargingMethodOpt, record, 'chargingMethod');
                    }}
                    className={styles.ellipsisInput}
                    style={{ width: '100%' }}
                  >
                    {chargingMethodJson.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.meaning}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            );
          return returnComponent;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.pricing`).d('定价行'),
        dataIndex: 'pricing',
        key: 'pricing',
        width: 80,
        render: (text, record) =>
          record._status !== 'update' ||
          record.subFlag ||
          record.chargingMethod === 'FREE' ||
          record.chargingMethod === 'SUB' ? null : (
            <a
              onClick={() => {
                this.handleClick(record, 'pricing');
              }}
            >
              {intl.get(`${viewMessagePrompt}.pricing`).d('定价行')}
            </a>
          ),
      },
      {
        title: intl.get(`${viewMessagePrompt}.measureRuleMeaning`).d('计量规则'),
        dataIndex: 'measureRuleMeaning',
        key: 'measureRuleMeaning',
        width: 120,
        render: (text, record) => {
          const { serviceId, measureRule, measureRuleMeaning } = record;
          const returnComponent =
            packageStatus === 'RELEASE' ? (
              text
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator('measureRule', {
                  rules: [
                    {
                      required: true,
                      message: `${intl
                        .get(`${viewMessagePrompt}.measureRule`)
                        .d('计量规则')}不能为空`,
                    },
                  ],
                  initialValue: measureRule,
                })(
                  <Lov
                    allowClear={false}
                    textValue={measureRuleMeaning}
                    onChange={(a, b) => {
                      this.lovChange(a, b, record, 'measureRule');
                      handleChange(record);
                    }}
                    onClick={() => {
                      if (measureRule === 'SUBSCRIBE') {
                        notification.warning({
                          message: '此操作可能造成该定价行下的免费订阅行被删除！',
                        });
                      }
                    }}
                    code="AMKT.SERVICE_MEASURE"
                    queryParams={{ serviceId }}
                    className={styles.ellipsisInput}
                  />
                )}
              </Form.Item>
            );
          return returnComponent;
        },
        // queryParams={{serviceId, measureRuleStatus: newPackageStatus}}
      },
      {
        title: intl.get(`${viewMessagePrompt}.measureObjectMeaning`).d('计量对象'),
        dataIndex: 'measureObjectMeaning',
        key: 'measureObjectMeaning',
        width: 100,
      },
      {
        title: intl.get(`${viewMessagePrompt}.measureUnit`).d('计量单位'),
        dataIndex: 'measureUnit',
        key: 'measureUnit',
        width: 100,
      },
      {
        title: intl.get(`${viewMessagePrompt}.cycleFlag`).d('是否周期'),
        dataIndex: 'cycleFlag',
        key: 'cycleFlag',
        width: 100,
        render: (text, record) => {
          const returnComponent = (record.subFlag || record.partnerLineNumber) ? null : packageStatus === 'RELEASE' ? (
            text === 1 ? (
              <Badge status="success" text={intl.get(`${commonPrompt}.status.yes`).d('是')} />
            ) : (
              <Badge status="error" text={intl.get(`${commonPrompt}.status.no`).d('否')} />
            )
          ) : (
            <Form.Item>
              {record.$form.getFieldDecorator('cycleFlag', {
                initialValue: record.cycleFlag,
              })(
                <Switch
                  checkedValue={1}
                  unCheckedValue={0}
                  onChange={val => {
                    handleChange(record);
                    // handleInputChange(record, 'cycleFlag', val);
                    this.lovChange(val, null, record, 'cycleFlag');
                  }}
                />
              )}
            </Form.Item>
          );
          return returnComponent;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.packageCycle`).d('周期'),
        dataIndex: 'packageCycle',
        key: 'packageCycle',
        width: 160,
        render: (text, record) => {
          const returnComponent = (record.subFlag || record.partnerLineNumber) ? null : packageStatus === 'RELEASE' ? (
            text
          ) : record.cycleFlag === 0 ? null : (
            <Form.Item>
              {record.$form.getFieldDecorator('packageCycle', {
                rules: [
                  {
                    required: true,
                    message: `${intl.get(`${viewMessagePrompt}.packageCycle`).d('周期')}不能为空`,
                  },
                  {
                    pattern: POSITIVEINTEGER,
                    message: `${intl
                      .get(`${viewMessagePrompt}.packageCycle`)
                      .d('周期')}必须为数字正整数`,
                  },
                  {
                    validator: this.validatorFunc,
                    message: intl.get(`hzero.common.validation.max`, {
                      max: 10,
                    }),
                  },
                ],
                initialValue: record.packageCycle,
              })(
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  onChange={() => handleChange(record)}
                />
              )}
            </Form.Item>
          );
          return returnComponent;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.packageCycleUnitMeaning`).d('周期单位'),
        dataIndex: 'packageCycleUnitMeaning',
        key: 'packageCycleUnitMeaning',
        width: 160,
        render: (text, record) => {
          const returnComponent = (record.subFlag || record.partnerLineNumber) ? null : packageStatus === 'RELEASE' ? (
            text
          ) : record.cycleFlag === 0 ? null : (
            <Form.Item>
              {record.$form.getFieldDecorator('packageCycleUnit', {
                rules: [
                  {
                    required: true,
                    message: `${intl
                      .get(`${viewMessagePrompt}.packageCycleUnit`)
                      .d('周期单位')}不能为空`,
                  },
                ],
                initialValue: record.packageCycleUnit,
              })(
                <Select
                  allowClear={false}
                  onChange={() => handleChange(record)}
                  className={styles.ellipsisInput}
                  style={{ width: '100%' }}
                >
                  {dateUnitJson.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          );
          return returnComponent;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.selectionFlag`).d('是否甄选'),
        dataIndex: 'selectionFlag',
        key: 'selectionFlag',
        width: 100,
        render: (text, record) => {
          const returnComponent =
            packageStatus === 'RELEASE' ? (
              text === 1 ? (
                <Badge status="success" text={intl.get(`${commonPrompt}.status.yes`).d('是')} />
              ) : (
                <Badge status="error" text={intl.get(`${commonPrompt}.status.no`).d('否')} />
              )
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator('selectionFlag', {
                  initialValue: record.selectionFlag,
                })(
                  <Switch
                    checkedValue={1}
                    unCheckedValue={0}
                    onChange={val => {
                      handleChange(record);
                      // handleInputChange(record, 'selectionFlag', val);
                      this.lovChange(val, {}, record, 'selectionFlag');
                    }}
                  />
                )}
              </Form.Item>
            );
          return returnComponent;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.selectionClass`).d('甄选规则类'),
        dataIndex: 'selectionClass',
        key: 'selectionClass',
        width: 240,
        render: (text, record) => {
          // const lovFlag = 'lov';
          const flag = record.selectionFlag === 1 ? true : false;
          const returnComponent = !flag ? null : packageStatus === 'RELEASE' ? (
            text
          ) : (
            <Form.Item>
              {record.$form.getFieldDecorator('selectionClass', {
                rules: [
                  {
                    required: flag,
                    message: `${intl
                      .get(`${viewMessagePrompt}.selectionClass`)
                      .d('甄选规则类')}不能为空`,
                  },
                ],
                initialValue: record.selectionClass,
              })(<Input className={styles.ellipsisInput} onChange={() => handleChange(record)} />)}
            </Form.Item>
          );
          return returnComponent;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.partnerPkName`).d('合作伙伴套餐'),
        dataIndex: 'partnerPkName',
        key: 'partnerPkName',
        width: 240,
        render: (text, record) => {
          const { applicationId, serviceId, serviceMrId } = record;
          const flag = record.selectionFlag === 1 ? true : false;
          const returnComponent = flag ? null : packageStatus === 'RELEASE' ? (
            text
          ) : (
            <Form.Item>
              {record.$form.getFieldDecorator('partnerPkName', {
                rules: [
                  {
                    required: !flag,
                    message: `${intl
                      .get(`${viewMessagePrompt}.partnerPkName`)
                      .d('合作伙伴套餐')}不能为空`,
                  },
                ],
                initialValue: record.partnerPkName,
              })(
                <Lov
                  code="AMKT.QUERY_PARTNER_PK"
                  textValue={record.partnerPkName}
                  queryParams={{ applicationId, serviceId, serviceMrId }}
                  onChange={(a, b) => {
                    handleChange(record);
                    this.lovChange(a, b, record, 'partnerPkName');
                  }}
                />
              )}
            </Form.Item>
          );
          return returnComponent;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.partnerName`).d('合作伙伴'),
        dataIndex: 'partnerName',
        key: 'partnerName',
        width: 150,
      },
      {
        title: intl.get(`${viewMessagePrompt}.sub`).d('订阅免费服务'),
        dataIndex: 'sub',
        key: 'sub',
        width: 120,
        render: (text, record) => {
          const { _status = '', measureRule = '', chargingMethod = '' } = record;
          return _status === 'update' && measureRule === 'SUBSCRIBE' && chargingMethod !== 'SUB' ? (
            <Button
              onClick={() => this.handleClick(record, 'sub')}
              onChange={() => handleChange(record)}
              disabled={packageStatus === 'RELEASE'}
            >
              {intl.get(`${viewMessagePrompt}.add`).d('添加')}
            </Button>
          ) : null;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.partnerLineNumber`).d('订阅行'),
        dataIndex: 'partnerLineNumber',
        key: 'partnerLineNumber',
        width: 80,
      },
    ];
    const tableProps = {
      columns,
      dataSource: content || [],
      bordered: true,
      scroll: { x: 2661 },
      loading: fetchLoading || fetchSaveing,
      rowKey: record => {
        return record.key || record.packageLineId;
      },
      pagination,
      onChange: ({ current, pageSize }) => {
        handleVerifyIsChange({
          isChange: editFlag,
          callback: () => {
            fetchList({ page: { current, pageSize } });
          },
        });
      },
      rowSelection: packageStatus!=="RELEASE" && {
        selectedRowKeys,
        onChange: this.onRowSelectChange,
        getCheckboxProps: record => ({
          disabled: !record._status || packageStatus === 'RELEASE',
        }),
      },
    };
    const pricingProps = {
      visible: pricingVisible,
      fetchListLoading: fetchPricingList,
      fetchList: this.handleFetchPricingList,
      onHandleCloseModal: () => this.handleCloseModal({ pricingVisible: false }),
      onHandleSaveModal: this.handleSaveModal,
      handleDelete: this.handleDeletePriceList,
      packageStatus,
      paymentMethod,
    };
    const MultipleSelectionLovProps = {
      visible: MultipleSelectionLovVisible,
      fetchListLoading: fetchPartnerListLoading,
      fetchList: this.fetchPartnerList,
      onHandleCloseModal: () => this.handleCloseModal({ MultipleSelectionLovVisible: false }),
      onHandleSaveModal: this.handleSavePartner,
    };
    const subProps = {
      visible: subVisible,
      fetchListLoading: fetchSubListLoading,
      fetchList: this.fetchSubList,
      onHandleCloseModal: () => this.handleCloseModal({ subVisible: false }),
      onHandleSaveModal: this.handleSaveSub,
      title: '免费服务添加',
      tableRowKey: 'partnerServiceId',
      searchOpt: [
        {
          dataIndex: 'serviceCode',
          title: '服务编码',
        },
        {
          dataIndex: 'serviceName',
          title: '服务名称',
        },
      ],
      tableHeader: [
        {
          title: '服务编码',
          dataIndex: 'serviceCode',
          key: 'serviceCode',
          width: 200,
        },
        {
          title: '服务名称',
          dataIndex: 'serviceName',
          key: 'serviceName',
          width: 240,
        },
      ],
    };
    return (
      <React.Fragment>
        {packageStatus !== 'RELEASE'&&(
          <div className="table-list-search" style={{ 'text-align': 'right' }}>
            <Button
              onClick={this.handleClearEdit}
              disabled={!selectedRowKeys.length > 0}
              style={{ marginRight: '8px' }}
            >
              {intl.get(`${commonPrompt}.button.delete`).d('删除')}
            </Button>
            <Button
              onClick={this.handleSelectClick}
              style={{ marginRight: '8px' }}
              disabled={packageStatus === 'RELEASE'}
            >
              {intl.get(`${commonPrompt}.button.handleSelectClick`).d('选择合作伙伴套餐')}
            </Button>
            <Button
              onClick={this.handleCreate}
              type="primary"
              disabled={packageStatus === 'RELEASE'}
            >
              {intl.get(`${commonPrompt}.button.create`).d('新建')}
            </Button>
          </div>
          )
        }
        <EditTable {...tableProps} />
        {pricingVisible && <PricingModal {...pricingProps} />}
        {MultipleSelectionLovVisible && <MultipleSelectionLov {...MultipleSelectionLovProps} />}
        {subVisible && <MultipleSelectionLov {...subProps} />}
      </React.Fragment>
    );
  }
}
