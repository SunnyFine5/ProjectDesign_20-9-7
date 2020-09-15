/**
 * ProductCard - 套餐卡片
 * @date: 2019-09-09
 * @author: wxm <xiaomin.wang@hand-china.com>
 * @version: v1.3
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Row, Col, Tooltip,Button } from 'hzero-ui';

import { connect } from 'dva';
import { Link } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { setSession } from 'utils/utils';

import electronicSignature from '@/assets/electronicSignature.svg';

import style from './index.less';
import { re } from 'mathjs';

@connect(({ loading, appStore }) => ({
  loading: loading.effects['appStore/fetchClientModule'],
  serviceLoading: loading.effects['appStore/fetchClientService'],
  appStore,
}))
export default class ProductCard extends PureComponent {
  @Bind()
  handlePackage(partnerId) {
    setSession('partnerId', partnerId);
    setSession('buyPackageBackPath', '/public/amkt/amkt-appstore/home');
  }
  
  @Bind()
  handleAddBtn(partnerName, partnerId, applicationId, applicationName){
    const {dispatch} = this.props;
    dispatch({
      type: 'appStore/addApplication',
      payload: {partnerName , partnerId, applicationId, applicationName},
    })
  }
  @Bind()
  handleDeleteBtn=(partnerId)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'appStore/deleteApplication',
      payload:{partnerId},
    })
  }

  render() {
    const { packageList = [],  } = this.props;
    const {isSelectedId=[], } = this.props.appStore;
   
    return (
      <React.Fragment>
        <Row gutter={12}>
          {packageList.map(({ partnerName = '', partnerId, applicationId, applicationName }) => (
            <Col span={6}>
              <div className={style['div-cart']}>
                <Link
                  className={style['product-card']}
                  to="/public/amkt/amkt-appstore/buy-package"
                  onClick={() => this.handlePackage(partnerId)}
                >
                  <p>
                    <img src={electronicSignature} alt="" />
                  </p>
                  <p className={style['product-card-title']}>
                    <Tooltip title={partnerName}>{applicationName}-{partnerName}</Tooltip>
                  </p>
                  <div className={style['product-card-content']}>{applicationName}-{partnerName}</div>
                </Link>
                <div >
                  {
                    isSelectedId.includes(partnerId)
                    ?<Button style={{width:'100px'}} onClick={()=>this.handleDeleteBtn(partnerId)}>取消选择</Button>
                    :<Button style={{width:'100px'}} onClick={()=>this.handleAddBtn(partnerName, partnerId, applicationId,applicationName )}>选择</Button>
                  }
                  </div>
              </div>
              
            </Col>
          ))}
        </Row>
      </React.Fragment>
    );
  }
}
