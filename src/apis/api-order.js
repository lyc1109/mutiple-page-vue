/**
 * 销售订单API
 * @author  yangshubo
 * @created 2018-04-11
 */

import http from '@/assets/scripts/iotp-http';

export default {
  /**
   *  删除关联设备
   *  @param   entityId    订单实体ID（混淆后）
   *  @param   deviceId    设备编码
   */
  delDevice(entityId, deviceId) {
    return http.del('/oms/order/' + entityId + '/device', {
      deviceId: deviceId
    });
  },

  /**
   * 删除订单备注
   * @param   entityId    订单实体ID（混淆后）
   * @param   id          备注ID（混淆后）
   */
  delMemo(entityId, id) {
    return http.del('/oms/order/' + entityId + '/memo?memoId=' + id);
  },

  /**
   * 获取订单分页数据
   * @param   params    参数
   {
     page_no: 0,                //页面数, 默认从1开始
     page_size: 20,             //每页条数, 每页返回最多返回100条, 默认值为20
     page_sort: "created_desc", //排序方式, 格式为: 排序字段_排序方向, 默认: created_desc
     q: "",                     //全文检索条件
     type: ""                   //订单类型筛选
   }
   */
  page (params = {}) {
    return http.get("/oms/order", params);
  },

  /**
   * 获取订单详情
   * @param   entityId    订单实体ID（混淆后）
   */
  detail(entityId) {
    return http.get(`/oms/order/${entityId}`);
  },

  /**
   * 获取公司物流信息
   * @param   params    参数
   {
     page_no: 0,                //页面数, 默认从1开始
     page_size: 20,             //每页条数, 每页返回最多返回100条, 默认值为100
     page_sort: "name_asc",     //排序方式, 格式为: 排序字段_排序方向, 默认: name_asc
     q: "",                     //全文检索条件
   }
   */
  logistics(params = {}) {
    return http.get('/oms/order/logistics', params);
  },

  /**
   * 获取订单备注
   * @param   entityId    订单实体ID（混淆后）
   */
  getMemo(entityId) {
    return http.get('/oms/order/' + entityId + '/memo');
  },

  /**
   * 获取订单数量统计
   * @param   entityId    订单实体ID（混淆后）
   */
  counts() {
    return http.get('/oms/order/counts');
  },

  /**
   * 获取维权订单信息列表
   * @param   entityId    订单实体ID（混淆后）
   */
  defendOrders(entityId) {
    return http.get('/oms/order/' + entityId + '/defend-orders');
  },

  /**
   * 强制关闭订单
   * @param   entityId    订单实体ID（混淆后）
   * @param   reason      关闭原因
   */
  close(entityId, reason) {
    return http.post(`/oms/order/${entityId}}/close`,{
      reason: reason
    });
  },

  /**
   * 订单发货
   * @param   entityId    订单实体ID（混淆后）
   * @param   params      参数
   {
      shipping_type: '',      //物流类型
      logistics_company: '',  //物流公司
      invoice_no: ''          //物流单号
      device_ids: ''          //设备编码，多个使用;隔开
      memo: ''                //发货备注
   }
   */
  deliver(entityId, params) {
    return http.post('/oms/order/' + entityId + '/deliver', params);
  },

  /**
   * 退换货申请处理
   * @param   entityId    订单实体ID（混淆后）
   * @param   params      参数
   {
      isAgree: true,        //是否同意
      type: '',             //处理类型：refund(仅退款) | return(退换货)
      unagree_reason: ''    //不同意原因
   }
   */
  process(entityId, params) {
    return http.post('/oms/order/' + entityId + '/return-change/process', params);
  },

  /**
   * 提交销售订单
   * @param   params      参数
   {
      "buyerId": "string",
      "buyerMemo": "string",
      "discountFee": 0,
      "postFee": 0,
      "products": [
        {
          "gift": true,
          "isGift": false,
          "isOnTrial": false,
          "onTrial": true,
          "productId": "string",
          "productItemCode": "string",
          "productName": "string",
          "productNum": 0,
          "productSpecId": "string"
        }
      ],
      "receiverAddress": "string",
      "receiverArea": "string",
      "receiverCity": "string",
      "receiverMobile": "string",
      "receiverName": "string",
      "receiverProvince": "string",
      "receiverTelephone": "string",
      "receiverZip": "string",
      "totalAmount": 0
   }
   */
  submit(params = {}) {
    return http.post("/oms/order/submit", params);
  },

  /**
   * 更新收货地址
   * @param   entityId    订单实体ID（混淆后）
   * @param   params      参数
   */
  updateAddress(entityId, params={}) {
    return http.postJson(`/oms/order/${entityId}/update-address`, params);
  },

  /**
   * 调整订单金额
   * @param   entityId    订单实体ID（混淆后）
   * @param   params      参数
   */
  adjustFee(entityId, params={}) {
    return http.postJson(`/oms/order/${entityId}/adjust-fee`, params);
  },

  /**
   * 确认处理取消订单
   * @param   entityId    订单实体ID（混淆后）
   {
      is_agree: true,   //是否同意
      reason: ''        //不同意原因
   }
   */
  cancelConfirm(entityId, param) {
    return http.post('/oms/order/' + entityId + '/cancel-confirm', param)
  },

  /**
   * 添加订单备注
   * @param   entityId    订单实体ID（混淆后）
   * @param   params      参数
   {
      type: ''        //备注类型
      is_private: '', //是否仅自己可见
      memo: ''        //备注内容
   }
   */
  addMemo(entityId, params) {
    return http.post('/oms/order/' + entityId + '/memo', params)
  },

  /**
   * 退款申请确认处理
   * @param   entityId    订单实体ID（混淆后）
   * @param   params      参数
   {
      type: ''          //备注类型
      refund_type: '',  //退款方式: original(原路退款) | bank(银行转账) | cash(现金)
      memo: ''          //备注内容
   }
   */
  refund(entityId, params) {
    return http.post('/oms/order/' + entityId + '/refund-confirm', params)
  },

  /**
   * 拒绝订单
   * @param   entityId    订单实体ID（混淆后）
   * @param   reason      拒绝原因
   */
  reject(entityId, reason) {
    return http.post(`/oms/order/${entityId}}/reject`, {
      reason: reason
    })
  },

  /**
   * 退换货收货确认
   * @param   entityId    订单实体ID（混淆后）
   * @param   params      参数
   {
      shipping_type: ''           //(换货必须)物流类型：logistics(物流) | express(快递) | delivery(送货上门)
      logistics_company: '',      //(换货必须)物流公司
      invoice_no: ''              //(换货必须)物流单号
   }
   */
  confirm(entityId, params = {}) {
    return http.post('/oms/order/' + entityId + '/return-change/confirm', params)
  },

  /**
   * 添加或激活设备
   * @param   entityId    订单实体ID（混淆后）
   * @param   params    参数
   {
      deviceId: ''      //设备编码
      is_active: true   //是否激活
   }
   */
  device(entityId, params) {
    return http.post('/oms/order/' + entityId + '/device', params)
  }

}
