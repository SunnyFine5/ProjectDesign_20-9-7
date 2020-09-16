/**
 * Application - 头部表单
 * @since 2019-7-10
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Col, Form, Input, Row, Checkbox, Select, Badge, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import {
  EDIT_FORM_ROW_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT,
  FORM_COL_3_LAYOUT,
} from 'utils/constants';
import { yesOrNoRender } from 'utils/renderer';
import styles from '@/routes/Components/style/index.less';
import ListTransfer from '@/routes/Components/ListTransfer';

/**
 * Form.Item 组件label、wrapper长度比例划分
 */
const commonPrompt = 'hzero.common';
const viewMessagePrompt = 'amkt.partnerPackage.view.message';
// const CODE_UPPER = /^[A-Z0-9_]*$/;
const POSITIVEINTEGER = /^[0-9]*[1-9][0-9]*$/;

/**
 * Application头部表单
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
export default class HeaderForm extends PureComponent {
  componentDidMount() {
    const { bindForm, form } = this.props;
    bindForm(form);
  }

  /**
   * formChange函数
   * @param {event} event
   * @param {string} flag
   */
  @Bind()
  handleFormChange(event, flag){
    const { dispatch, headerData } = this.props;
    const { permissionFlag } = headerData;
    if(flag){
      dispatch({type: "customerPackage/formChange", payload: {[flag]: !permissionFlag}});
    }
  }

  /**
   * formChange函数
   * @param {string | number} val
   * @param {string} flag
   */
  @Bind()
  handleFormChangeTwo(val, flag){
    const { dispatch } = this.props;
    if(flag){
      dispatch({type: "customerPackage/formChange", payload: {[flag]: val}});
    }
  }

  /**
   * 标识headerData被编辑
   */
  @Bind()
  handleChangeFlag(){
    const { handleSetState } = this.props;
    handleSetState({headerDataEditFlag: true});
  }

  render() {
    const { form, headerData={}, packageHeaderId, paymentMethodJson, paymentObjectJson, dateUnitJson, packageUsedScopeJson, handleCustomerListClick,
    transferVisible, fetchExitListLoadding, fetchNoExitListLoadding, handleFetchExitList, handleFetchNoExitList, handleCloseModal,
    handleAddService, handleRemoveService, exitContent, noExitContent, exitPagination, noExitPagination} = this.props;
    const { getFieldDecorator } = form;
    const { packageNumber='', packageName='', packageStatus='', paymentMethod='PAYMENT_BEFORE', paymentObject, billingCycleUnit="DAY",
    stepChargingFlag = 0, enabledFlag=1, packageUsedScope="CUSTOMER", billingCycle, billingCycleUnitMeaning, packageTerm, packageTermUnitMeaning,
    repeatPurchaseFlag=0, permissionFlag=0, paymentMethodMeaning, paymentObjectMeaning, packageUsedScopeMeaning, packageTermUnit="DAY" } = headerData;
    const customerListTransferProps = {
      modalTitle: "分配客户",
      rowKey: 'customerTenantId',
      columns: [
        {
          title: '客户编码',
          dataIndex: 'tenantNum',
          width: 150,
        },
        {
          title: '客户名称',
          dataIndex: 'tenantName',
        },
      ],
      searchForm: [
        { label: '客户编码', id: 'tenantNum' },
        { label: '客户名称', id: 'tenantName' },
      ],
      // disabledFlg,
      serviceVisible: transferVisible,
      // serviceLoading,
      fetchExitSerLoading: fetchExitListLoadding,
      fetchNoExitSerLoading: fetchNoExitListLoadding,
      // moduleId,
      onFetchExitServiceList: handleFetchExitList,
      onFetchNoExitServiceList: handleFetchNoExitList,
      onHandleCloseModal: handleCloseModal,
      onHandleAddService: handleAddService,
      onHandleRemoveService: handleRemoveService,
      exitServiceList: exitContent, // 模块下已分配服务
      noExitServiceList: noExitContent, // 模块下未分配服务
      exitPagination, // 模块下已分配服务分页
      noExitPagination, // 模块下未分配服务分页
    };
    return (
      <Form>
        <Row {...EDIT_FORM_ROW_LAYOUT} className="inclusion-row">
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.packageNumber`).d('套餐编码')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageNumber}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.packageName`).d('套餐名称')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageStatus==="RELEASE" ? packageName : getFieldDecorator('packageName', {
                rules: [
                  {
                    required: true,
                    message: `${intl
                      .get(`${viewMessagePrompt}.packageName`)
                      .d('套餐名称')}不能为空`,
                  },
                  {
                    max: 13,
                    message: intl.get(`hzero.common.validation.max`, {
                      max: 13,
                    }),
                  },
                ],
                initialValue: packageName,
              })(<Input onChange={this.handleChangeFlag} className={styles.ellipsis} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.packageStatus`).d('状态')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageHeaderId === 'create' ? "新建" : (packageStatus === "NEW" ? "新建" : packageStatus === "RELEASE" ? "已发布" : "新建")}
            </Form.Item>
          </Col>
        </Row>
        <Row {...EDIT_FORM_ROW_LAYOUT} className="inclusion-row">
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.paymentObject`).d('付款对象')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageStatus==="RELEASE" ? paymentObjectMeaning : getFieldDecorator('paymentObject', {
                rules: [
                  {
                    required: true,
                    message: `${intl
                      .get(`${viewMessagePrompt}.paymentObject`)
                      .d('付款对象')}不能为空`,
                  },
                ],
                initialValue: paymentObject,
              })(
                <Select onChange={this.handleChangeFlag}>
                  {paymentObjectJson.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.packageUsedScope`).d('套餐使用范围')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageStatus==="RELEASE" ? packageUsedScopeMeaning : getFieldDecorator('packageUsedScope', {
                initialValue: packageUsedScope,
              })(
                <Select onChange={this.handleChangeFlag}>
                  {packageUsedScopeJson.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.paymentMethod`).d('付款方式')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageStatus==="RELEASE" ? paymentMethodMeaning : getFieldDecorator('paymentMethod', {
                initialValue: paymentMethod,
              })(
                <Select
                  onChange={(val)=>{
                    if(val==="PAYMENT_BEFORE"){
                      this.handleFormChangeTwo(0, 'stepChargingFlag');
                    }if(val==="PAYMENT_AFTER"){
                      this.handleFormChangeTwo(1, 'stepChargingFlag');
                    }
                    this.handleChangeFlag();
                  }}
                >
                  {paymentMethodJson.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...EDIT_FORM_ROW_LAYOUT} className="inclusion-row">
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.billingCycle`).d('账单周期')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageStatus==="RELEASE" ? billingCycle : getFieldDecorator('billingCycle', {
                rules: [
                  {
                    required: true,
                    message: `${intl
                      .get(`${viewMessagePrompt}.billingCycle`)
                      .d('账单周期')}不能为空`,
                  },
                  {
                    pattern: POSITIVEINTEGER,
                    message: `${intl
                      .get(`${viewMessagePrompt}.billingCycle`)
                      .d('账单周期')}必须为数字正整数`,
                  },
                ],
                initialValue: billingCycle,
              })(
                <InputNumber min={0} max={2000000000} onChange={this.handleChangeFlag} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.billingCycleUnit`).d('账单周期单位')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageStatus==="RELEASE" ? billingCycleUnitMeaning : getFieldDecorator('billingCycleUnit', {
                initialValue: billingCycleUnit,
              })(
                <Select onChange={this.handleChangeFlag}>
                  {dateUnitJson.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.packageTerm`).d('套餐期限')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageStatus==="RELEASE" ? packageTerm : getFieldDecorator('packageTerm', {
                rules: [
                  {
                    required: true,
                    message: `${intl
                      .get(`${viewMessagePrompt}.packageTerm`)
                      .d('套餐期限')}不能为空`,
                  },
                  {
                    pattern: POSITIVEINTEGER,
                    message: `${intl
                      .get(`${viewMessagePrompt}.packageTerm`)
                      .d('套餐期限')}必须为数字正整数`,
                  },
                ],
                initialValue: packageTerm,
              })(
                <InputNumber min={0} max={2000000000} onChange={this.handleChangeFlag} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...EDIT_FORM_ROW_LAYOUT} className="inclusion-row">
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.packageTermUnit`).d('套餐期限单位')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageStatus==="RELEASE" ? packageTermUnitMeaning : getFieldDecorator('packageTermUnit', {
                initialValue: packageTermUnit,
              })(
                <Select onChange={this.handleChangeFlag}>
                  {dateUnitJson.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonPrompt}.status.enable`).d('启用')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('enabledFlag', {
                initialValue: enabledFlag,
              })(<Checkbox onChange={this.handleChangeFlag} checkedValue={1} unCheckedValue={0} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonPrompt}.status.repeatPurchaseFlag`).d('重复购买')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageStatus==="RELEASE" ? repeatPurchaseFlag ? <Badge status="success" text={intl.get(`${commonPrompt}.status.yes`).d('是')} /> : <Badge status="error" text={intl.get(`${commonPrompt}.status.no`).d('否')} /> : getFieldDecorator('repeatPurchaseFlag', {
                initialValue: repeatPurchaseFlag,
              })(<Checkbox onChange={this.handleChangeFlag} checkedValue={1} unCheckedValue={0} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...EDIT_FORM_ROW_LAYOUT} className="inclusion-row">
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.stepChargingFlag`).d('阶梯累计计费')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {stepChargingFlag!=='' ? yesOrNoRender(stepChargingFlag):null}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonPrompt}.status.permissionFlag`).d('权限管控')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {packageStatus==="RELEASE" ? permissionFlag ? <Badge status="success" text={intl.get(`${commonPrompt}.status.yes`).d('是')} /> : <Badge status="error" text={intl.get(`${commonPrompt}.status.no`).d('否')} /> : getFieldDecorator('permissionFlag', {
                initialValue: permissionFlag,
              })(<Checkbox
                onChange={(event)=>{
                  this.handleFormChange(event, 'permissionFlag');
                  this.handleChangeFlag();
                }}
                checkedValue={1}
                unCheckedValue={0}
              />)}
            </Form.Item>
          </Col>
          {permissionFlag && packageStatus!=="RELEASE" && packageHeaderId !== "create" && (
            <Col {...FORM_COL_3_LAYOUT}>
              <a onClick={handleCustomerListClick}>进入分配客户列表</a>
              {transferVisible && <ListTransfer {...customerListTransferProps} />}
            </Col>
          )}
        </Row>
      </Form>
    );
  }
}
