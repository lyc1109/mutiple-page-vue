<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .el-table {
    border: 1px solid #f3f3f3;
    border-bottom: 0;
  }
  .el-table /deep/ {
    thead {
      color: #444444;
    }
    td {
      font-size: 12px;
      color: #7b7b7b;
      font-weight: 400;
    }
  }
  .bg-blue {
    background-color: #32a8ee;
  }
  .order-conten {
    font-size: 12px;
    font-weight: 400;
    color: #606266;
  }
  .order-msg-conten-left,
  .order-msg-conten-right {
    height: 300px;
    overflow: hidden;
  }
  .order-msg-conten-left {
    border: 1px solid #32a8ee
  }
  .order-msg-conten-left > div {
    height: 36px;
    box-sizing: border-box;
  }
  .order-msg-conten-right {
    border: 1px solid #FF6633;
  }

</style>

<template>
  <v-app v-cloak="true" v-loading="loading" element-loading-text="刷新中..">
    <div slot="header-title">销售订单详情</div>
    <div slot="header-actions">
      <el-button
        type="danger"
        v-if="status.isShowCancelConfirmBtn"
        v-on:click="isShowCancelConfirm = true; isDisabled = false"
      >处理取消订单</el-button>
      <!--<el-button-->
        <!--type="danger"-->
        <!--v-if="status.isShowRefund-->
        <!--v-on:click="isShowRefund = true; isDisabled = false"-->
      <!--&gt;退款申请处理</el-button>-->
      <el-button
        type="danger"
        v-if="status.isShowProcessBtn"
        v-on:click="isShowProcess = true; isDisabled = false"
      >处理退换货申请</el-button>
      <el-button
        type="danger"
        v-if="status.isShowConfirmBtn"
        v-on:click="isShowConfirm = true; isDisabled = false"
      >退换货收货确认</el-button>
    </div>
    <div class="order-conten margin-bottom-xxl" >
      <v-progress :data="orderDetails"></v-progress>
      <div class="order-msg margin-top-m">
        <div class="flex">
          <div class="order-msg-conten-left margin-right-s flex-item">
            <div class="padding font-white bg-blue">订单概况</div>
            <v-message
              class="margin-top"
              :data="orderDetails"
              :logistics="logisticsCompanyArr"
              :orderstatus="status"
              @refresh="refresh"
            ></v-message>
          </div>
          <div class="order-msg-conten-right margin-left-s flex-item">
            <v-activation
              :data="orderDetails.devices"
              :orderstatus="status"
              :activationCode="activationCode"
              :num="productsNum"
              @refresh="refresh"
            ></v-activation>
            <v-logs-remarks
              :data="orderDetails.logs"
              :orderstatus="status"
              @refresh="refresh"></v-logs-remarks>
          </div>
        </div>
      </div>
      <div>
        <v-defend-orders :isConfirm="isConfirm"></v-defend-orders>
      </div>
      <div class="margin-top-m">
        <v-products :data="orderDetails.products"></v-products>
        <v-price :data="priceMsg"></v-price>
      </div>
    </div>

    <!--确认处理取消订单弹出框-->
    <el-dialog
      title="处理取消订单"
      width="450px"
      :visible.sync="isShowCancelConfirm">
      <div class="padding">
        <el-form label-width="100px" size="small">
          <el-form-item label="是否同意" required>
            <el-radio v-model="cancelConfirmParam.is_agree" :label="true">同意</el-radio>
            <el-radio v-model="cancelConfirmParam.is_agree" :label="false">不同意</el-radio>
          </el-form-item>
          <el-form-item label="原因" v-if="!cancelConfirmParam.is_agree" required>
            <el-input type="textarea" :rows="2" v-model="cancelConfirmParam.reason"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="cancelConfirm" :loading="isDisabled">确定</el-button>
        <el-button size="mini" @click="isShowCancelConfirm = false">取消</el-button>
      </div>
    </el-dialog>

    <!--开始处理退换货申请弹出框-->
    <el-dialog
      title="处理退换货申请"
      width="450px"
      :visible.sync="isShowProcess">
      <div class="padding">
        <el-form label-width="100px" size="small">
          <el-form-item label="退换货类型">
            <span class="color-red-1" v-if="orderDetails.defendType === 'refund'">仅退款</span>
            <span class="color-red-1" v-else-if="orderDetails.defendType === 'change'">仅换货</span>
            <span class="color-red-1" v-else-if="orderDetails.defendType === 'return'">仅退货</span>
          </el-form-item>
          <el-form-item label="寄回地址" v-if="orderDetails.defendType !== 'refund'" required >
            <el-input v-model="confirmProcessParam.receiveMemo"></el-input>
            <span class="font-s">提示：寄回地址信息用于发送手机短信</span>
          </el-form-item>
          <el-form-item label="是否同意" required>
            <el-radio v-model="confirmProcessParam.isAgree" :label="true">同意</el-radio>
            <el-radio v-model="confirmProcessParam.isAgree" :label="false">不同意</el-radio>
          </el-form-item>
          <el-form-item label="原因" v-if="!confirmProcessParam.isAgree" required>
            <el-input type="textarea" :rows="2" v-model="confirmProcessParam.memo"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="confirmProcess" :loading="isDisabled">确定</el-button>
        <el-button size="mini" @click="isShowProcess = false">取消</el-button>
      </div>
    </el-dialog>

    <!--退款申请确认处理弹出框-->
    <el-dialog
      title="退款申请确认处理"
      width="450px"
      :visible.sync="isShowRefund">
      <div class="padding">
        <el-form label-width="100px" size="small">
          <el-form-item label="退款方式" required>
            <el-radio v-model="refundParam.refund_type" label="original">原路退款</el-radio>
            <el-radio v-model="refundParam.refund_type" label="bank">银行转账</el-radio>
            <el-radio v-model="refundParam.refund_type" label="cash">现金</el-radio>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="2" v-model="refundParam.memo"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="confirmRefund" :loading="isDisabled">确定</el-button>
        <el-button size="mini" @click="isShowRefund = false">取消</el-button>
      </div>
    </el-dialog>

    <!--退换货收货确认弹出框-->
    <el-dialog
      title="退换货收货确认"
      width="450px"
      :visible.sync="isShowConfirm">
      <div class="padding">
        <el-form label-width="100px" size="small">
          <el-form-item label="退换货类型">
            <span class="color-red-1" v-if="orderDetails.defendType === 'refund'">仅退款</span>
            <span class="color-red-1" v-else-if="orderDetails.defendType === 'change'">仅换货</span>
            <span class="color-red-1" v-else-if="orderDetails.defendType === 'return'">仅退货</span>
          </el-form-item>
          <div v-if="orderDetails.defendType === 'change'">
            <el-form-item label="物流类型" required>
              <el-radio v-model="confirmParam.shipping_type" label="express">快递</el-radio>
              <el-radio v-model="confirmParam.shipping_type" label="logistics">物流</el-radio>
              <el-radio v-model="confirmParam.shipping_type" label="delivery">送货上门</el-radio>
            </el-form-item>
            <el-form-item label="物流公司" required>
              <el-select v-model="confirmParam.logistics_company" filterable>
                <el-option
                  v-for="item in logisticsCompanyArr"
                  :label="item.name"
                  :value="item.name"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流单号" required>
              <el-input v-model="confirmParam.invoice_no"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="confirm" :loading="isDisabled">确定</el-button>
        <el-button size="mini" @click="isShowConfirm = false">取消</el-button>
      </div>
    </el-dialog>

  </v-app>
</template>

<script>
  import api from '@/apis/api-order'
  import VProgress from './view-components/v-progress'
  import VMessage from './view-components/v-message'
  import VLogsRemarks from './view-components/v-logs-remarks'
  import VDefendOrders from './view-components/v-defend-orders'
  import VProducts from './view-components/v-products'
  import VPrice from './view-components/v-price'
  import VActivation from './view-components/v-activation'
  import messagebox from '@/assets/scripts/iotp-message-box'

  export default {
    name: "order-view",
    data: function () {
      return {
        entityId: this.$route.params.entityId,
        isShowCancelConfirm: false,//是否显示确认处理取消订单弹出框
        isShowProcess: false,//是否显示开始处理退换货申请弹出框
        isShowRefund: false,//是否显示退款申请确认处理
        isShowConfirm: false,//退换货收货确认
        isConfirm: false,//用于判断是否需要刷新维权信息
        loading: true,
        isDisabled: false,
        productsNum: 0,
        status: {//存储对应需要执行的功能
          isShowBtns: false,//所有按钮
          isShowCancelConfirmBtn: false,//取消订单按钮
          isShowRefund: false,//退款申请处理按钮
          isShowProcessBtn: false,//退换货申请按钮
          isShowConfirmBtn: false,//退换货收货确认按钮
          isShowEditPriceBtn: false,//修改价格
          isShowEditAddressBtn: false,//修改收货地址
          isShowDeliverBtn: false,//订单发货
          isShowSearchQueryBtn: false,//物流查询
        },
        orderDetails: {
          payments: [],
          devices: [],
          logs: [],
          products: [],
        },//订单详情
        priceMsg: {//价格统计信息
          payment: 0.00,
          postFee: 0.00,
          discountFee: 0.00,
          totalAmount: 0.00
        },
        cancelConfirmParam: {//确认处理取消订单
          is_agree: true,
          reason: ''
        },
        confirmProcessParam: {//开始处理退换货申请
          isAgree: true,
          receiveMemo: '',
          memo: ''
        },
        refundParam: {//退款申请确认处理
          refund_type: 'original',
          memo: ''
        },
        confirmParam: {
          shipping_type: 'express',
          logistics_company: '',
          invoice_no: ''
        },
        logisticsCompanyArr: []
      }
    },
    created() {
      this.logistics();
      this.detail();
    },
    methods: {
      //获取公司物流信息
      logistics() {
        let that = this;
        api.logistics()
          .then((res) => {
            that.logisticsCompanyArr = res.fileList;
            that.confirmParam.logistics_company = res.fileList[0].name;
          })
      },
      //获取订单详情
      detail() {
        let that = this;
        that.loading = true;
        api.detail(that.entityId)
          .then((res) => {
            that.loading = false;
            if(res){
              //订单小计
              that.priceMsg.payment = res.payment.toFixed(2);
              that.priceMsg.postFee = res.postFee.toFixed(2);
              that.priceMsg.discountFee = res.discountFee.toFixed(2);
              that.priceMsg.totalAmount = res.totalAmount.toFixed(2);
              that.orderDetails = res;
              that.statusAnalysis();//状态分析
              let payments = that.orderDetails.payments;
              if(payments === null || payments === '') {
                that.orderDetails.payments = [];
              }
              let devices = that.orderDetails.devices;
              if(devices === null || devices === '') {
                that.orderDetails.devices = [];
              }
              let logs = that.orderDetails.logs;
              if(logs === null || logs === '') {
                that.orderDetails.logs = [];
              }
              //统计商品数量，用于控制添加设备按钮
              let products = that.orderDetails.products;
              if(products === null || products ==='') {
                that.orderDetails.products = [];
              } else {
                let productsNum = 0;
                for(let i = 0; i < products.length; i++) {
                  productsNum += products[i].productNum;
                  products[i].adjustFee = products[i].adjustFee / 100;
                }
                that.productsNum = productsNum;
              }
            }
          })
      },
      //订单各个状态分析
      statusAnalysis() {
        let that = this;
        let orderDetails = that.orderDetails;
        let cancelStatus = orderDetails.cancelStatus;//取消状态
        let defendStatus = orderDetails.defendStatus;//退换货状态（维权状态）
        let orderStatus = orderDetails.orderStatus;//订单状态
        let payStatus = orderDetails.payStatus;//付款状态
        let refundStatus = orderDetails.refundStatus;//退款状态
        let shippingStatus = orderDetails.shippingStatus;//发货状态
        //订单取消或关闭时，所有操作功能禁用
        if(/^(85|90|95)$/.test(orderStatus) || cancelStatus || defendStatus || refundStatus) {
          that.status.isShowBtns = false;
        } else {
          that.status.isShowBtns = true;
        }
        //控制处理取消订单按钮
        if(cancelStatus === 0) {
          that.status.isShowCancelConfirmBtn = true;
        } else {
          that.status.isShowCancelConfirmBtn = false;
        }
        //控制退款申请处理按钮
        if(refundStatus === 15) {
          that.status.isShowRefund = true;
        } else {
          that.status.isShowRefund = false;
        }
        //控制处理退换货申请按钮
        if(defendStatus === 0) {
          that.status.isShowProcessBtn = true;
        } else {
          that.status.isShowProcessBtn = false;
        }
        //控制退换货收货确认按钮
        if(defendStatus === 10) {
          that.status.isShowConfirmBtn = true;
        } else {
          that.status.isShowConfirmBtn = false;
        }

        if(that.status.isShowBtns) {
          //控制是否可以修改价格
          if(/^(0|5)$/.test(orderStatus)) {
            that.status.isShowEditPriceBtn = true;
          } else {
            that.status.isShowEditPriceBtn = false;
          }
          //控制是否可以修改收货地址
          if(/^(0|5|10)$/.test(orderStatus)) {
            that.status.isShowEditAddressBtn = true;
          } else {
            that.status.isShowEditAddressBtn = false;
          }
          //控制订单发货按钮
          if(orderStatus === 10) {
            that.status.isShowDeliverBtn = true;
          } else {
            that.status.isShowDeliverBtn = false;
          }
        }
        //控制是否跳转物流查询页面
        if(!(/^(0|5|10)$/.test(orderStatus))) {
          that.status.isShowSearchQueryBtn = true;
        } else {
          that.status.isShowSearchQueryBtn = false;
        }
      },
      //刷新
      refresh() {
        this.detail();
      },
      //确认处理取消订单
      cancelConfirm() {
        let that = this;
        if(!that.cancelConfirmParam.reason.trim() && !that.cancelConfirmParam.is_agree) {
          that.$message.error('请填写拒绝原因！');
          return;
        }
        that.isDisabled = true;
        api.cancelConfirm(that.entityId, that.cancelConfirmParam)
          .then((res) => {
            if(res){
              if(that.cancelConfirmParam.is_agree) {
                that.$message({
                  type: 'success',
                  message: '确认取消订单成功！'
                });
              } else {
                that.$message({
                  type: 'success',
                  message: '拒绝取消订单成功！'
                });
              }
              that.isShowCancelConfirm = false;
              that.detail();
            } else {
              that.isDisabled = false;
            }
          })
      },
      //确认开始处理退换货申请弹出框
      confirmProcess() {
        let that = this;
        if(!that.confirmProcessParam.receiveMemo.trim() && that.orderDetails.defendType !== 'refund') {
          that.$message.error('请填写寄回地址！');
          return;
        }
        if(!that.confirmProcessParam.memo.trim() && !that.confirmProcessParam.isAgree) {
          that.$message.error('请填写不同意原因！');
          return;
        }
        that.isDisabled = true;
        api.process(that.entityId, that.confirmProcessParam)
          .then((res) => {
            if(res){
              that.$message({
                type: 'success',
                message: '处理退换货申请成功！'
              });
              that.isShowProcess = false;
              that.detail();
            } else {
              that.isDisabled = false;
            }
          })
      },
      //退款申请处理
      confirmRefund() {
        let that = this;
        that.isDisabled = true;
        api.refund(that.entityId, that.refundParam)
          .then((res) => {
            if(res){
              that.$message({
                type: 'success',
                message: '退款申请处理成功！'
              });
              that.isShowRefund = false;
              that.detail();
            } else {
              that.isDisabled = false;
            }
          })
      },
      //退换货收货确认
      confirm() {
        let that = this;
        if(!that.confirmParam.invoice_no.trim()) {
          that.$message.error('请填写物流单号！');
          return;
        }
        that.isDisabled = true;
        api.confirm(that.entityId, that.confirmParam)
          .then((res) => {
            if(res){
              that.$message({
                type: 'success',
                message: '退换货收货确认成功！'
              });
              that.isShowConfirm = false;
              that.detail();
              that.isConfirm = true;
            } else {
              that.isDisabled = false;
            }
          })
      }
    },
    components: {
      VProgress,
      VMessage,
      VLogsRemarks,
      VDefendOrders,
      VProducts,
      VPrice,
      VActivation
    }
  }
</script>

<!--
  物流方式
  logistics：物流
  express：快递
  delivery：送货上门

  订单状态
  0：新增/待支付
  5：支付待确认
  10：待发货/已付款
  20：已发货
  30：试用中/等待支付余款
  35：余款支付待确认
  80：交易完成
  85：已换货
  90：交易关闭
  95：已取消

  备注类型
  memo_user：用户留言
  memo_shop：店铺备注

  取消订单状态
  0：申请取消订单
  10：退款处理中
  80：取消成功
  90：交易关闭

  维权订单状态【退换货】
  0：申请维权订单
  10：退货中
  15：收货确认
  20：等待退款
  30：退款中
  80：退款完成
  90：交易关闭

  退款订单状态
  0：申请退款订单
  10：退款处理中
  15：线上退款失败
  80：退款完成

  订单其他状态
  0：待处理
  80：已完成
-->
