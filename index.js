/**
 * AppStore - 应用商城
 * @date: 2019-07-09
 * @author: zjx <jingxi.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { Row, Col, Carousel, Icon, Popover, Spin } from 'hzero-ui';
import classnames from 'classnames';

import { connect } from 'dva';
import { Link } from 'dva/router';
// import Icons from 'components/Icons';
import { Bind } from 'lodash-decorators';
import { closeTab } from 'utils/menuTab';
import { getSession, setSession, filterNullValueObject } from 'utils/utils';

import Icons from '../Components/Icons';
import ServiceTabPane from './ServiceTabPane';

import style from './index.less';
import bannerFst from '@/assets/banner_fst.png';
import bannerSnd from '@/assets/banner_snd.png';
import bannerBg from '@/assets/banner_bg.png';
import erweima from '@/assets/erweima.png';

@connect(({ loading, appStore }) => ({
  fetchPackageListLoading: loading.effects['appStore/fetchPackageList'],
  fetchApplicationListLoading: loading.effects['appStore/fetchApplicationList'],
  appStore,
}))
export default class AppStore extends Component {
  form;

  componentDidMount() {
    const { pagination = {}, activeKey = 'all' } = this.props.appStore;
    const { current, pageSize } = pagination;
    const applicationId = activeKey === 'all' ? null : Number(activeKey);
    this.fetchApplicationList();
    this.fetchPackageList(current, pageSize, { applicationId });
    if (window.addEventListener) {
      window.addEventListener('message', this.onMessage, false);
    } else if (window.attachEvent) {
      // IE
      window.attachEvent('onmessage', this.onMessage);
    }
    closeTab('/pub/amkt/amkt-appstore/order-management/list');
  }

  // 绑定表单
  @Bind()
  bindForm(form) {
    this.form = form;
  }

  /**
   * message 回调
   * @param {*} e 回调参数
   */
  @Bind()
  onMessage(e) {
    const { data = {} } = e;
    setSession('MESSAGE', data);
  }

  /**
   * 查询应用列表
   */
  @Bind()
  fetchApplicationList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'appStore/fetchApplicationList',
      payload: {},
    });
  }

  /**
   * 查询套餐列表
   */
  @Bind()
  fetchPackageList(page = 1, size = 12, params = {}) {
    const { dispatch } = this.props;
    const { crmTenant, tenantId } = getSession('MESSAGE');
    const partnerName = this.form.getFieldValue('partnerName');
    dispatch({
      type: 'appStore/fetchPackageList',
      payload: filterNullValueObject({
        packageType: 'customer',
        packageStatus: 'RELEASE',
        partnerName,
        crmTenant,
        tenantId,
        enabledFlag: 1, // 有效的套餐
        page: page - 1,
        size,
        ...params,
      }),
    });
  }

  /**
   * 切换tab
   */
  @Bind()
  changeTab(activeKey) {
    const applicationId = activeKey === 'all' ? null : Number(activeKey);
    this.form.resetFields();
    this.props.dispatch({
      type: 'appStore/updateState',
      payload: { activeKey },
    });
    this.fetchPackageList(1, 12, { applicationId });
  }

  render() {
    const { token } = getSession('MESSAGE');
    const {
      fetchPackageListLoading,
      appStore: { activeKey = 'all', packageList = [], pagination = {}, applicationList = [],appSelectedList=[] },
    } = this.props;
    const {dispatch} = this.props;
    const paneProps = {
      activeKey,
      bindForm: this.bindForm,
      loading: fetchPackageListLoading,
      packageList,
      applicationList,
      appSelectedList,
      pagination,
      dispatch,
      onChangeTab: this.changeTab,
      onChangePage: this.fetchPackageList,
      onHandleFetch: this.fetchPackageList,
    };
    
    const imagList = [
      {
        url: bannerFst,
      },
      {
        url: bannerSnd,
      },
    ];
    return (
      <Spin spinning={false} wrapperClassName={classnames('ued-detail-wrapper')}>
        <div className={style['body-content']}>
          <Row className={style['app-store-top']}>
            <Col span={20} className={style['store-banner-container']}>
              <div>
                <Carousel>
                  {imagList.map(item => {
                    return (
                      <React.Fragment>
                        <div
                          style={{
                            height: '272px',
                            background: `url(${item.url}) no-repeat -120px center`,
                            backgroundSize: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      </React.Fragment>
                    );
                  })}
                </Carousel>
                <div className={style['store-banner-bg']}>
                  <img src={bannerBg} alt="" />
                  <div className={style['contact-us']}>
                    <p>
                      <Popover
                        trigger="hover"
                        placement="left"
                        content={
                          <span className={style['contact-popover-tel']}>Tel：400-900-9298</span>
                        }
                      >
                        <Icons type="dianhua" />
                      </Popover>
                    </p>
                    <p>
                      <Popover
                        trigger="hover"
                        placement="left"
                        content={
                          <img
                            style={{ width: '100px', height: '100px' }}
                            src={erweima}
                            alt="二维码"
                          />
                        }
                      >
                        <Icons type="erweima" />
                      </Popover>
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={4} className={style['store-top-right']}>
              <Row>
                <Col>
                  <Link to={`/pub/amkt/amkt-appstore/order-management/list#${token}`}>
                    <div className={style['open-service']}>
                      <Icon className={style['top-icon']} type="file-text" />
                      <span>我的订单</span>
                    </div>
                  </Link>
                </Col>
                <Col>
                  <div className={style['auth-info']}>
                    <Icon className={style['top-icon']} type="book" />
                    <span>认证信息</span>
                  </div>
                </Col>
                <Col>
                  <Link to="/public/amkt/amkt-appstore/shopping-cart">
                    <div className={style['buy-cart']}>
                      <Icon className={style['top-icon']} type="shopping-cart" />
                      <span>购物车</span>
                    </div>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className={style['service-tab']} animated={false}>
            <ServiceTabPane {...paneProps} />
          </div>
        </div>
      </Spin>
    );
  }
}
