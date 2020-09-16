/**
 * customerPackage - 套餐管理详情页
 * @since 2019-9-9
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Button, Form, Spin, Card, Tabs } from 'hzero-ui';
import { connect } from 'dva';
import { Bind, debounce } from 'lodash-decorators';
import classnames from 'classnames';

import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { getEditTableData } from 'utils/utils';
import { DETAIL_CARD_TABLE_CLASSNAME, DETAIL_CARD_CLASSNAME } from 'utils/constants';
import TinymceEditor from 'components/TinymceEditor';
import formatterCollections from 'utils/intl/formatterCollections';
import Icons from 'components/Icons';

import HeaderForm from './HeaderForm';
import PackageLineList from './PackageLineList';
import styles from '@/routes/Components/style/index.less';

/**
 * Form.Item 组件label、wrapper长度比例划分
 */
const commonPrompt = 'hzero.common';
const viewMessagePrompt = 'amkt.customerPackage.view.message';
const { TabPane } = Tabs;
/**
 * 通用模板行页面
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ customerPackage, loading }) => ({
  customerPackage,
  paymentMethodJson: customerPackage.paymentMethodJson,
  paymentObjectJson: customerPackage.paymentObjectJson,
  chargingMethodJson: customerPackage.chargingMethodJson,
  dateUnitJson: customerPackage.dateUnitJson,
  packageUsedScopeJson: customerPackage.packageUsedScopeJson,
  headerData: customerPackage.headerData,
  packageLineList: customerPackage.packageLineList,
  customerExitList: customerPackage.customerExitList,
  customerNoExitList: customerPackage.customerNoExitList,
  fetchListLoading: loading.effects['customerPackage/fetchList'],
  fetchPackageLineListLoading: loading.effects['customerPackage/fetchPackageLineList'],
  fetchHeaderLoading: loading.effects['customerPackage/fetchHeader'],
  saveLoading: loading.effects['customerPackage/fetchSave'],
  releaseLoading: loading.effects['customerPackage/fetchRelease'],
  fetchPricingList: loading.effects['customerPackage/fetchPricingList'],
  fetchPartnerListLoading: loading.effects['customerPackage/fetchPartnerList'],
  fetchSubListLoading: loading.effects['customerPackage/fetchSubList'],
  fetchExitListLoadding: loading.effects['customerPackage/fetchCustomerExitList'],
  fetchNoExitListLoadding: loading.effects['customerPackage/fetchCustomerNoExitList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: ['amkt.customerPackage'] })
export default class Detail extends PureComponent {
  state = {
    transferVisible: false,
    headerDataEditFlag: false,
    packageLineEditFlag: false,
    checked: false,
    selectedRowKeys: [],
  };

  packageLineIds = new Set([]);

  componentDidMount() {
    const { match, dispatch } = this.props;
    const { params: { packageHeaderId } = { packageHeaderId: {} } } = match;
    dispatch({ type: 'customerPackage/initValuesJson' }).then(() => {
      if (packageHeaderId !== 'create') {
        this.fetchCustomerPackageDetail();
      }
    });
  }

  // HeaderForm绑定到这里
  @Bind()
  bindForm(form) {
    this.form = form;
  }

  /**
   * fetch应用列表数据
   */
  @Bind()
  fetchList(query = {}) {
    const { dispatch, match } = this.props;
    const { params = {} } = match;
    const { params: { packageHeaderId } = { packageHeaderId: {} } } = match;
    if (packageHeaderId && packageHeaderId !== 'create') {
      dispatch({
        type: 'customerPackage/fetchPackageLineList',
        payload: { ...params, ...query },
      });
    }
    // this.setpackageLineListEditFlag(false);
  }

  /**
   * fetch头部数据
   * @param {object}
   */
  @Bind()
  fetchHeader(query = {}) {
    const { dispatch, match } = this.props;
    const { params = {} } = match;
    return dispatch({
      type: 'customerPackage/fetchHeader',
      payload: { ...params, ...query },
    });
  }

  /**
   * fetch内页信息 -请求接口数据
   */
  @Bind()
  fetchCustomerPackageDetail() {
    const { match } = this.props;
    const { params = {} } = match;
    const { packageHeaderId } = params;
    if (packageHeaderId && packageHeaderId !== 'create') {
      this.fetchHeader().then(() => {
        this.fetchList();
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerPackage/updateState',
      payload: {
        headerData: {},
        packageLineList: {},
        detailedList: true,
      },
    });
  }

  /**
   * 发布
   */
  @Bind()
  @debounce()
  handleRelease() {
    const { dispatch, headerData } = this.props;
    dispatch({ type: 'customerPackage/fetchRelease', payload: { ...headerData } }).then(res => {
      if (res) {
        notification.success();
        this.setState({ headerDataEditFlag: false, packageLineEditFlag: false });
        this.packageLineIds.clear();
        this.fetchCustomerPackageDetail();
      }
    });
  }

  /**
   * 校验
   */
  @Bind()
  @debounce()
  handleCheck() {
    const { dispatch, headerData } = this.props;
    const { packageHeaderId } = headerData;
    dispatch({ type: 'customerPackage/fetchCheck', payload: { packageHeaderId } }).then(res => {
      if (res) {
        notification.success();
        // this.setState({ headerDataEditFlag: false, packageLineEditFlag: false });
        // this.packageLineIds.clear();
        // this.fetchCustomerPackageDetail();
        this.setState({ checked: true });
      }
    });
  }

  /**
   * 保存，验证头数据和sheet行数据
   */
  @Bind()
  @debounce()
  handleSave() {
    const { dispatch, match, form, headerData, packageLineList, history } = this.props;
    const { params = {} } = match;
    const { packageHeaderId } = params;
    const { list = {} } = packageLineList;
    const { content = [] } = list;
    let newParams = params;
    let packageLineDTOListWrap = [];
    if (packageHeaderId === 'create') {
      newParams = {
        stepChargingFlag: 0,
      };
    }
    // 先校验头部form
    form.validateFields((err, values) => {
      if (err) return;
      // 获取行
      const filterPackageLineList = content.filter(
        item => item._status === 'create' || this.packageLineIds.has(item.packageLineId)
      );
      const allTableData = getEditTableData(filterPackageLineList);
      if (allTableData.length === 0) {
        if (filterPackageLineList.length >= 1) return;
        packageLineDTOListWrap = {};
      } else {
        const packageLineDTOList = filterPackageLineList.map((item, index) => {
          return { ...item, ...allTableData[index] };
        });
        packageLineDTOListWrap = { packageLineDTOList };
      }
      dispatch({
        type: 'customerPackage/fetchSave',
        payload: {
          ...newParams,
          ...headerData,
          ...values,
          ...packageLineDTOListWrap,
          packageType: 'customer',
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.setState({
            headerDataEditFlag: false,
            packageLineEditFlag: false,
            selectedRowKeys: [],
            checked: false,
          });
          this.packageLineIds.clear();
          if (packageHeaderId === 'create') {
            history.push(`/amkt/customer-package/detail/${res}`);
            this.fetchCustomerPackageDetail();
          } else {
            this.fetchCustomerPackageDetail();
          }
        }
      });
    });
  }

  /**
   * app列表中可编辑的change处理函数
   */
  @Bind()
  handlePackageLineInputChange(record, flag, val) {
    const { dispatch } = this.props;
    if (flag) {
      dispatch({ type: 'customerPackage/cycleFlagChange', payload: { record, [flag]: val } });
    }
  }

  @Bind()
  handleSetState(json) {
    this.setState(json);
  }

  /**
   * 关闭transfer
   */
  @Bind()
  handleCloseModal() {
    this.setState({ transferVisible: false });
  }

  /**
   * 套餐行change记录下packageLineId
   * @param {object} record
   */
  @Bind()
  handleChange(record) {
    const { packageLineId } = record;
    this.packageLineIds.add(packageLineId);
    this.setState({ packageLineEditFlag: true });
  }

  /**
   * 复制
   */
  @Bind()
  @debounce()
  handleCopy() {
    const { dispatch, headerData, history } = this.props;
    const { packageHeaderId } = headerData;
    dispatch({ type: 'customerPackage/fetchCopy', payload: packageHeaderId }).then(res => {
      if (typeof res === 'number') {
        notification.success();
        this.setState({
          headerDataEditFlag: false,
          packageLineEditFlag: false,
          selectedRowKeys: [],
          checked: false,
        });
        this.packageLineIds.clear();
        history.push(`/amkt/customer-package/detail/${res}`);
        this.fetchCustomerPackageDetail();
      }
    });
  }

  /**
   * fetch已添加的列表
   * @param {object} params
   */
  @Bind()
  handleFetchExitList(params) {
    const { dispatch, headerData } = this.props;
    const { packageHeaderId } = headerData;
    dispatch({
      type: 'customerPackage/fetchCustomerExitList',
      payload: { ...params, packageHeaderId },
    });
  }

  /**
   * fetch未添加
   * @param {object} params
   */
  @Bind()
  handleFetchNoExitList(params) {
    const { dispatch, headerData } = this.props;
    const { packageHeaderId } = headerData;
    dispatch({
      type: 'customerPackage/fetchCustomerNoExitList',
      payload: { ...params, packageHeaderId },
    });
  }

  /**
   * 穿梭框添加
   * @param {array} selectedRows
   */
  @Bind()
  handleAddService(selectedRows) {
    const { dispatch, headerData } = this.props;
    const { packageHeaderId } = headerData;
    const customerTenantIds = selectedRows.map(item => item.customerTenantId);
    dispatch({
      type: 'customerPackage/fetchCustomerAdd',
      payload: { packageHeaderId, customerTenantIds },
    }).then(() => {
      this.handleFetchNoExitList();
      this.handleFetchExitList();
    });
  }

  /**
   * 穿梭框删除
   * @param {array} selectedRows
   */
  @Bind()
  handleRemoveService(selectedRows) {
    const { dispatch } = this.props;
    dispatch({ type: 'customerPackage/fetchCustomerDelete', payload: selectedRows }).then(() => {
      this.handleFetchNoExitList();
      this.handleFetchExitList();
    });
  }

  /**
   * 点击出穿梭框
   */
  @Bind()
  handleCustomerListClick() {
    this.setState({ transferVisible: true }, () => {
      this.handleFetchExitList();
      this.handleFetchNoExitList();
    });
  }

  render() {
    const {
      dispatch,
      form,
      match,
      headerData = {},
      packageLineList = {},
      fetchListLoading = false,
      fetchHeaderLoading = false,
      fetchPackageLineListLoading = false,
      saveLoading = false,
      releaseLoading = false,
      fetchPricingList = false,
      paymentObjectJson,
      paymentMethodJson,
      chargingMethodJson,
      dateUnitJson,
      packageUsedScopeJson,
      customerExitList,
      customerNoExitList,
      fetchExitListLoadding,
      fetchNoExitListLoadding,
      fetchPartnerListLoading,
      fetchSubListLoading,
    } = this.props;

    const {
      params: { packageHeaderId },
    } = match;
    const {
      headerDataEditFlag,
      packageLineEditFlag,
      transferVisible,
      checked,
      selectedRowKeys,
    } = this.state;
    const { getFieldDecorator } = form;
    const { packageStatus = '', packageDesc } = headerData;
    const {
      list: { content: exitContent },
      pagination: exitPagination,
    } = customerExitList;
    const {
      list: { content: noExitContent },
      pagination: noExitPagination,
    } = customerNoExitList;
    const headerFormProps = {
      form,
      headerData,
      bindForm: this.bindForm,
      packageHeaderId,
      packageStatus,
      paymentObjectJson,
      paymentMethodJson,
      dateUnitJson,
      packageUsedScopeJson,
      dispatch,
      handleSetState: this.handleSetState,
      handleCustomerListClick: this.handleCustomerListClick,
      transferVisible,
      fetchExitListLoadding,
      fetchNoExitListLoadding,
      handleFetchExitList: this.handleFetchExitList,
      handleFetchNoExitList: this.handleFetchNoExitList,
      handleCloseModal: this.handleCloseModal,
      handleAddService: this.handleAddService,
      handleRemoveService: this.handleRemoveService,
      exitContent, // 模块下已分配服务
      noExitContent, // 模块下未分配服务
      exitPagination, // 模块下已分配服务分页
      noExitPagination, // 模块下未分配服务分页
    };
    const packageLineListProps = {
      packageLineList,
      fetchList: this.fetchList,
      fetchDetail: this.fetchCustomerPackageDetail,
      dispatch,
      packageStatus,
      chargingMethodJson,
      dateUnitJson,
      headerData,
      handleChange: this.handleChange,
      handleInputChange: this.handlePackageLineInputChange,
      setEditFlagTrue: this.setEditFlagTrue,
      fetchPricingList,
      handleSetState: this.handleSetState,
      fetchPartnerListLoading,
      fetchSubListLoading,
      packageLineEditFlag,
      selectedRowKeys,
    };
    const { list: { content: packageLineListContent } = { content: [] } } = packageLineList;
    return (
      <React.Fragment>
        <Header
          title={intl.get(`${viewMessagePrompt}.customerPackageManagement`).d('客户套餐管理')}
          backPath="/amkt/customer-package/list"
          isChange={packageLineEditFlag || headerDataEditFlag}
        >
          <Button
            onClick={this.handleSave}
            type="primary"
            icon="save"
            disabled={!(packageLineEditFlag || headerDataEditFlag)}
            loading={saveLoading}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          {packageStatus !== 'RELEASE' && (
            <>
              <Button
                onClick={this.handleRelease}
                disabled={!checked || packageStatus === 'RELEASE' || packageHeaderId === 'create'}
                loading={releaseLoading}
                type={!checked || packageStatus === 'RELEASE' || packageHeaderId === 'create'?"primary":null}
              >
                <Icons type="main-release" style={{marginRight: '8px'}} />
                {intl.get(`${viewMessagePrompt}.release`).d('发布')}
              </Button>
              <Button
                onClick={this.handleCheck}
                disabled={packageStatus === 'RELEASE' || packageHeaderId === 'create'}
                type={packageStatus === 'RELEASE' || packageHeaderId === 'create'?"primary":null}
              >
                <Icons type="main-adopt" style={{marginRight: '8px'}} />
                {intl.get(`${viewMessagePrompt}.check`).d('校验')}
              </Button>
            </>
          )}
          <Button
            onClick={this.handleCopy}
            icon="copy"
            disabled={packageHeaderId === 'create'}
            type={packageHeaderId === 'create'?"primary":null}
          >
            {intl.get(`${viewMessagePrompt}.copy`).d('复制')}
          </Button>
        </Header>
        <Content backgroundColor="#fff">
          <Spin
            spinning={
              fetchListLoading || saveLoading || fetchHeaderLoading || fetchPackageLineListLoading
            }
          >
            <Card
              bordered={false}
              title={intl.get(`${commonPrompt}.packageBaseInfo`).d('套餐信息')}
              className={classnames(styles.mT, DETAIL_CARD_CLASSNAME)}
            >
              <HeaderForm {...headerFormProps} />
            </Card>
            <Tabs defaultActiveKey="1" animated={false}>
              <TabPane tab={intl.get(`${viewMessagePrompt}.packageInfo`).d('套餐明细')} key="1">
                <PackageLineList {...packageLineListProps} />
              </TabPane>
              <TabPane tab={intl.get(`${viewMessagePrompt}.packageDesc`).d('套餐描述')} key="2">
                {/* <ServiceList style={{ backgroundColor: '#fff' }} {...serviceProps} /> */}
                {packageStatus === 'RELEASE' ? (
                  <div dangerouslySetInnerHTML={{ __html: packageDesc }} />
                ) : (
                  <Form>
                    <Form.Item>
                      {getFieldDecorator('packageDesc', {
                        initialValue: packageDesc,
                      })(
                        <TinymceEditor
                          content={packageDesc}
                          onChange={() => this.setState({ headerDataEditFlag: true })}
                        />
                      )}
                    </Form.Item>
                  </Form>
                )}
              </TabPane>
            </Tabs>
          </Spin>
        </Content>
      </React.Fragment>
    );
  }
}
