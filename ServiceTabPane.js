/**
 * ServiceTabPane - 应用商店服务pane
 * @date: 2019-07-09
 * @author: zjx <jingxi.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, Spin, Tabs, Pagination, Icon, Tooltip, } from 'hzero-ui';
const { TextArea } = Input;
import {  getCurrentTenant } from 'utils/utils';

import ProductCard from './ProductCard';

import electronicSignature from '@/assets/electronicSignature.svg';
import riskControl from '@/assets/riskControl.svg';
import linkedInvoicing from '@/assets/linkedInvoicing.svg';
import invoiceVerification from '@/assets/invoiceVerification.svg';
import { ArrayNodeDependencies } from 'mathjs';
import { pad } from 'crypto-js';
 import notification from 'utils/notification';
import style from './index.less'

const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

const { TabPane } = Tabs;

@Form.create({ fieldNameProp: null })
export default class AppStore extends PureComponent {
  constructor(props) {
    super(props);
    this.props.bindForm(this.props.form);
  }
   
  handleSubmit=()=>{
    const {form, dispatch, appSelectedList} = this.props;
    const customerReqLineList = appSelectedList;
    const value = {
      ...form.getFieldsValue(),
      customerReqLineList,
      customerName:'test',
      customerCode:'test',
      reqSubimtTime:'2020/4/2',
      
    };
    dispatch({
      type:'appStore/submitFormData',
      payload:value,
    }).then((res)=>{
      if(res){
        notification.success();
      }
    })
  }
  handleDeleteBtn=(partnerId)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'appStore/deleteApplication',
      payload:{partnerId},
    })
  }
  render() {
    const {
      appSelectedList,
      activeKey,
      onChangePage,
      loading,
      onChangeTab,
      packageList = [],
      applicationList = [],
      pagination = {},
      onHandleFetch,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <React.Fragment>
        <Tabs defaultActiveKey={activeKey} onChange={onChangeTab}>
          <TabPane tab="全部应用" key="all">  
            <Form className="more-fields-search-form">
              <Row gutter={48}>
                <Col span={6}>
                  <Form.Item {...formItemLayout} label="套餐名称">
                    {getFieldDecorator('partnerName')(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item>
                    <Button type="primary" onClick={() => onHandleFetch(1, 12)}>
                      查询
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Spin spinning={loading} wrapperClassName="ued-detail-wrapper">
              <ProductCard packageList={packageList} />
            </Spin>
            {!loading && packageList.length >= 1 && (
              <Pagination
                style={{
                  textAlign: 'right',
                  margin: '10px -7px 0 0',
                }}
                {...pagination}
                onChange={onChangePage}
                onShowSizeChange={onChangePage}
              />
            )}
          </TabPane>
          {applicationList.map(({ applicationName = '', applicationId }) => (
            <TabPane tab={applicationName} key={applicationId}>
              <Form  className="more-fields-search-form">
                <Row gutter={48}>
                  <Col span={6}>
                    <Form.Item {...formItemLayout} label="套餐名称">
                      {getFieldDecorator('partnerName')(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item>
                      <Button type="primary" onClick={() => onHandleFetch(1, 12, { applicationId })}>
                        查询
                        </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Spin spinning={loading} wrapperClassName="ued-detail-wrapper">
                <ProductCard packageList={packageList} />
              </Spin>
              {!loading && packageList.length >= 1 && (
                <Pagination
                  style={{
                    textAlign: 'right',
                    margin: '10px -7px 0 0',
                  }}
                  {...pagination}
                  onChange={onChangePage}
                  onShowSizeChange={onChangePage}
                />
              )}
            </TabPane>
          ))}
        </Tabs>
        <div className={style['container']}>
                <div className={style['title']}>已选择应用</div>
          <Row className={style["app-selected"]}>
            {appSelectedList.map((item)=>(
               <Col span={3}>
                 <div className='btns'>
                   <span className='btns-span'>{item.partnerName}</span>
                   <Icon type="close-square" id={item.partnerId} onClick={()=>this.handleDeleteBtn(item.partnerId)} className='btns-icon'/>
                 </div>
               </Col>
            ))}
          </Row>
          <div className={style.title}>联系信息</div>
          <Form name='container_form' className={style['writable-row-custom']}>
            <Row gutter={48}>
              <Col span={8}>
                <Form.Item  {...formItemLayout} label={intl.get('amkt.common.model.companyName').d('企业名称')} >
                <div >上海甄云信息科技有限公司</div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={48}>
              <Col span={8}>
                <Form.Item {...formItemLayout} label={intl.get('amkt.common.model.reqUser').d('联系人')} >
                  {getFieldDecorator('reqUser', {
                     rules: [{ 
                       required: true,
                       message:'请输入联系人' }]
                     })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...formItemLayout} label={intl.get('amkt.common.model.email').d('邮箱')} >
                  {getFieldDecorator('email',{type:'email'})(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={48}>
              <Col span={8} >
                <Form.Item   {...formItemLayout} label={intl.get('amkt.common.model.phone').d('手机号')} >
                  {getFieldDecorator('phone', { 
                    rules: [
                      { 
                        required: true, 
                        message:'请输入手机号'
                      },{ 
                        pattern: '^1([38][0-9]|4[579]|5[^4]|6[6]|7[0135678]|9[89])\\d{8}$' , 
                        message:'请输入正确格式的手机号' 
                      },]})(<Input  type={'tel'}  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={48}>
              <Col span={16}>
                <Form.Item name='test' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}
                 label={intl.get('amkt.common.model.reqDesc').d('备注')} >
                  {getFieldDecorator('reqDesc')(<TextArea rows={4}/>)}
                </Form.Item>
              </Col>
            </Row>
              <div  className={style['btn-submit']} >
                <Button onClick={this.handleSubmit}  type='primary' >提交</Button>
              </div>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}
