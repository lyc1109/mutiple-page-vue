<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .el-table /deep/ {
    thead {
      color: #444444;
    }
    td {
      font-size: 12px;
      color: #7b7b7b;
      font-weight: 400;
    }
    tbody tr td:first-child .cell {
      white-space: nowrap;
    }
  }
  .order-msg-tips {
    position: absolute;
    top: 50%;
    right: 30%;
    opacity: 0.3;
  }
  .order-msg-tips > div {
    float: left;
    padding: 3px 15px;
    color: #ff5722;
    background-color: #ffffff;
    transform: rotate(-25deg);
    border: 1px solid #ff5722;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 3px;
  }
  .line-height-30 {
    line-height: 30px;
  }
  .btn-delivery {
    padding: 2px 13px;
    color: #ff5722;
    border: 1px solid #ff5722;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
  .popper-class {
    border: 1px solid #f3f3f3;
    width: 250px;
  }
</style>

<template>
  <div style="position: relative;">
    <div class="order-msg-tips font-m">
      <div v-if="orderMsg.cancelStatus === 85">已换货</div>
      <div v-if="orderMsg.defendStatus === 80">已退款</div>
    </div>
    <el-row class="line-height-30">
      <el-col span="3" class="align-right font-bold-700">订单编号：</el-col>
      <el-col span="16">{{ orderMsg.orderId }}</el-col>
      <el-col span="4" class="align-right">
        <el-popover
          ref="popover5"
          placement="top"
          width="250"
        >
          <div class="font-s">
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700">下单时间：</el-col>
              <el-col span="14">{{ orderMsg.created !== 0 ? $filters.formatTime(orderMsg.created) : '未下单' }}</el-col>
            </el-row>
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700">付款时间：</el-col>
              <el-col span="14">{{ orderMsg.payTime !== 0 ? $filters.formatTime(orderMsg.payTime) : '未付款' }}</el-col>
            </el-row>
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700">发货时间：</el-col>
              <el-col span="14">{{ orderMsg.consignTime !== 0 ? $filters.formatTime(orderMsg.consignTime) : '未发货' }}</el-col>
            </el-row>
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700">交易完成时间：</el-col>
              <el-col span="14">{{ orderMsg.endTime !== 0 ? $filters.formatTime(orderMsg.endTime) : '未完成' }}</el-col>
            </el-row>
          </div>
        </el-popover>
        <a class="color-blue-1" href="javascript:;" v-popover:popover5>查看更多</a>
      </el-col>
    </el-row>
    <el-row class="line-height-30">
      <el-col span="3" class="align-right font-bold-700">订单状态：</el-col>
      <el-col span="16" v-if="orderMsg.cancelStatus">{{ orderMsg.cancelStatusText }}</el-col>
      <el-col span="16" v-else-if="orderMsg.defendStatusText">{{ orderMsg.defendStatusText }}</el-col>
      <el-col span="16" v-else>{{ orderMsg.orderStatusText }}</el-col>
    </el-row>
    <el-row class="line-height-30">
      <el-col span="3" class="align-right font-bold-700">订单总计：</el-col>
      <el-col span="16">
        <span class="color-red-2 font-bold-700 font-m">{{ $filters.formatRMB(orderMsg.totalAmount) }}</span>
        <span style="color: #999999;">（含运费{{ $filters.formatRMB(orderMsg.postFee) }}元）</span>
      </el-col>
      <el-col span="4" class="align-right">
        <a
          class="color-blue-1"
          href="javascript:;"
          @click="editPrice"
          v-if="status.isShowEditPriceBtn"
        >修改价格</a>
      </el-col>
    </el-row>
    <el-row class="line-height-30">
      <el-col span="3" class="align-right font-bold-700">买家信息：</el-col>
      <el-col span="16">{{ orderMsg.buyerNick }}</el-col>
    </el-row>
    <el-row class="line-height-30">
      <el-col span="3" class="align-right font-bold-700">收货信息：</el-col>
      <el-col span="16">{{ orderMsg.receiverFullAddress }}</el-col>
      <el-col span="4" class="align-right">
        <v-form-popover
          type="text"
          title="修改收货信息"
          :isClose="isCloseAddress"
          v-if="status.isShowEditAddressBtn"
          @onOk="onOkAddress('editAddressData')"
        >
          <div slot="form" class="margin-top-m">
            <el-form
              :model="editAddressData"
              ref="editAddressData"
              :rules="rules"
              label-width="100px"
              size="mini"
            >
              <el-form-item label="收货地址" required>
                <v-select-city
                  :data="defaultAddress"
                  @getAddress="getAddress"
                ></v-select-city>
              </el-form-item>
              <el-form-item prop="address">
                <el-input placeholder="请输入具体地址" v-model="editAddressData.address"></el-input>
              </el-form-item>
              <el-form-item label="收货人" prop="receiverName">
                <el-input placeholder="请输入收货人" v-model="editAddressData.receiverName"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="receiverMobile">
                <el-input placeholder="请输入手机号码" v-model="editAddressData.receiverMobile"></el-input>
              </el-form-item>
              <el-form-item label="座机号码">
                <el-input placeholder="请输入座机号码" v-model="editAddressData.receiverTelephone"></el-input>
              </el-form-item>
              <el-form-item label="邮政编码">
                <el-input placeholder="请输入邮政编码" v-model="editAddressData.zipCode"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span class="color-blue-1">修改收货信息</span>
        </v-form-popover>
      </el-col>
    </el-row>
    <el-row class="line-height-30">
      <el-col span="3" class="align-right font-bold-700">支付信息：</el-col>
      <el-col span="16">
        <div v-if="orderMsg.payments.length > 0">
          <span class="margin-right">{{ $filters.formatTime(orderMsg.payTime) }}</span>
          <span>{{ orderMsg.payTypeText }}</span>
        </div>
        <div v-else>暂无支付信息</div>
      </el-col>
      <el-col span="4" class="align-right">
        <a v-if="orderMsg.payments.length > 0" class="color-blue-1 margin-left" href="javascript:;" @click="showPayMsg">查看更多</a>
      </el-col>
    </el-row>
    <el-row class="line-height-30">
      <el-col span="3" class="align-right font-bold-700">配送信息：</el-col>
      <el-col span="12">
        <div v-if="orderMsg.invoiceNo === null || orderMsg.invoiceNo === ''">暂无配送信息</div>
        <div v-else>{{ orderMsg.logisticsCompany + ' (' + orderMsg.invoiceNo + ') ' }}</div>
      </el-col>
      <el-col span="8" class="align-right">
        <div>
          <v-form-popover
            type="text"
            title="订单发货"
            :isClose="isCloseOrder"
            v-if="status.isShowDeliverBtn"
            @onOk="onOkOrder('editOrderDelivery')"
          >
            <div slot="form" class="margin-top-m">
              <el-form
                :model="editOrderDelivery"
                ref="editOrderDelivery"
                :rules="rules"
                label-width="100px"
                size="mini"
              >
                <el-form-item label="物流类型" required>
                  <el-radio v-model="editOrderDelivery.shipping_type" label="express">快递</el-radio>
                  <el-radio v-model="editOrderDelivery.shipping_type" label="logistics">物流</el-radio>
                  <el-radio v-model="editOrderDelivery.shipping_type" label="delivery">送货上门</el-radio>
                </el-form-item>
                <el-form-item label="物流公司" required>
                  <el-select v-model="editOrderDelivery.logistics_company" filterable>
                    <el-option
                      v-for="item in logisticsCompanyArr"
                      :label="item.name"
                      :value="item.name"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="物流单号" prop="invoice_no">
                  <el-input v-model.trim="editOrderDelivery.invoice_no" placeholder="请输入物流单号"></el-input>
                </el-form-item>
                <el-form-item label="设备编码">
                  <el-input v-model="editOrderDelivery.device_ids" placeholder="请输入相应设备编码"></el-input>
                  <span class="font-s">提示：发货商品的二维码，多个之间使用分号隔开(;)</span>
                </el-form-item>
                <el-form-item label="发货备注">
                  <el-input type="textarea" :rows="2" v-model="editOrderDelivery.memo"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <span class="btn-delivery">订单发货</span>
          </v-form-popover>
          <a
            class="color-blue-1"
            v-if="status.isShowSearchQueryBtn"
            href="http://www.kuaidi100.com/"
            target="_blank"
          >物流明细查询</a>
        </div>
      </el-col>
    </el-row>

    <!--修改价格弹出框-->
    <el-dialog
      width="70%"
      title="修改价格"
      :visible.sync="isShowEditPrice">
      <div class="font-s">
        <div class="padding">
          <span>订单原价：</span>
          <span class="font-bold-700 color-red-2 font-m">{{ $filters.formatRMB(orderMsg.payment) }}</span>
          <span>（不含运费）</span>
        </div>
        <el-table :data="orderMsg.products">
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="price" label="单件（元）" width="120px">
            <template slot-scope="scope">
              {{ $filters.formatRMB(scope.row.price) }}
            </template>
          </el-table-column>
          <el-table-column prop="productNum" label="数量" width="80px"></el-table-column>
          <el-table-column label="价格调整" width="220px">
            <template slot-scope="scope">
              <el-input
                type="number"
                class="margin-right-s"
                v-model="scope.row.adjustDiscount"
                size="mini"
                style="width: 60px;"
                @change="priceChange('adjustDiscount', scope.$index)"
              ></el-input>折
              <span>=</span>
              <el-input
                type="number"
                class="margin-right-s"
                v-model="scope.row.adjustFee"
                size="mini"
                style="width: 100px;"
                @change="priceChange('adjustFee', scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div class="color-red-1 margin-top-s align-right">注：对于折扣，大于10表示涨价，小于10表示降价！&nbsp;&nbsp;</div>
        <div class="padding">
          <div class="flex">
            <span>订单运费：</span>
            <el-input
              type="number"
              class="margin-right-s"
              v-model="postFee"
              size="mini"
              style="width: 80px;"
            ></el-input>元
            <a class="margin-left color-blue-1" href="javascript:;" @click="noPostFee">免运费</a>
          </div>
          <div class="margin-top flex">
            <span>买家实付：</span>
            <div>
              <span>{{ $filters.formatRMB(orderMsg.payment) }}</span>
              <span> + ¥{{ postFee }}</span>
              <span v-for="item in orderMsg.products">
              <span v-if="item.adjustFee < 0"> - ¥{{ -item.adjustFee }}</span>
              <span v-else-if="item.adjustFee > 0"> + ¥{{ item.adjustFee }}</span>
            </span>
              <span>=</span>
              <span class="color-red-2 font-bold-700 font-m">{{ $filters.formatRMB(totalDiscountFee) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="onOkEditPrice">确定</el-button>
        <el-button size="mini" @click="isShowEditPrice = fasle">取消</el-button>
      </div>
    </el-dialog>

    <!--更多支付信息弹出框-->
    <el-dialog
      title="支付信息"
      :visible.sync="isShowMostMsg"
    >
      <el-table
        :data="orderMsg.payments"
      >
        <el-table-column prop="transactionId" label="支付交易号" width="200px"></el-table-column>
        <el-table-column prop="paymentBatchNo" label="支付批次号"></el-table-column>
        <el-table-column prop="payType" label="支付方式">
          <template slot-scope="scope">
            {{ orderMsg.payments[0].payType === 'wepay' ? '微信支付' :  orderMsg.payments[0].payType}}
          </template>
        </el-table-column>
        <el-table-column prop="payTime" label="支付时间">
          <template slot-scope="scope">
            {{ $filters.formatTime(scope.row.payTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="payment" label="支付金额">
          <template slot-scope="scope">
            {{ $filters.formatRMB(scope.row.payment) }}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button size="mini" @click="isShowMostMsg = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/apis/api-order'

  export default {
    name: "v-message",
    props: {
      data: {},
      orderstatus: {},
      logistics: {}
    },
    data: function() {
      return {
        entityId: this.$route.params.entityId,
        isShowEditPrice: false,
        isShowMostMsg: false,
        isCloseAddress: false,
        isCloseLogistics: false,
        isCloseOrder: false,
        //处理必填
        rules: {
          invoice_no: [
            { required: true, message: '请填写物流单号', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请填写具体地址', trigger: 'blur' }
          ],
          receiverName: [
            { required: true, message: '请填写收货人', trigger: 'blur' }
          ],
          receiverMobile: [
            { required: true, message: '请填写手机号码', trigger: 'blur' }
          ]
        },
        //修改价格
        editPriceParams: {
          adjustFee: 0,
          orderId: '',
          postFee: 0,//邮费
          productItems: []
        },
        //修改收货信息
        postFee: 0,//邮费
        totalDiscountFee: 0,//折扣后的金额
        defaultAddress: {
          province: '',
          city: '',
          area: '',
        },
        editAddressData: {
          province: '',
          city: '',
          area: '',
          address: '',
          latitude: 0,
          longitude: 0,
          receiverName: '',//收货人姓名
          receiverMobile: '',//收货人手机号码
          receiverTelephone: '',//收货人座机号码
          zipCode: ''//邮政编码
        },
        //订单发货
        editOrderDelivery: {
          shipping_type: 'express',
          logistics_company: '',
          invoice_no: '',
          device_ids: '',
          memo: ''
        }
      }
    },
    computed: {
      orderMsg() {
        this.postFee = this.data.postFee / 100;//邮费
        this.totalDiscountFee = this.data.totalAmount;
        this.editAddressData.province = this.data.receiverProvince || '';
        this.editAddressData.city = this.data.receiverCity || '';
        this.editAddressData.area = this.data.receiverArea || '';
        this.defaultAddress.province = this.data.receiverProvince || '';
        this.defaultAddress.city = this.data.receiverCity || '';
        this.defaultAddress.area = this.data.receiverArea || '';
        this.editAddressData.address = this.data.receiverAddress || '';
        this.editAddressData.receiverName = this.data.receiverName || '';
        this.editAddressData.receiverMobile = this.data.receiverMobile || '';
        this.editAddressData.receiverTelephone = this.data.receiverTelephone || '';
        this.editAddressData.zipCode = this.data.receiverZip || '';
        return this.data;
      },
      status() {
        return this.orderstatus
      },
      logisticsCompanyArr() {
        this.editOrderDelivery.logistics_company = this.logistics[0].name;
        return this.logistics;
      }
    },
    mounted() {
      this.$watch('postFee', (val) => {
        if(val < 0) {
          this.postFee = 0;
          this.$message.error('订单运费不能为负数!');
        } else {
          if(val) {
            this.discountFeeCount();
          }
        }
      })
    },
    methods: {
      //显示修改价格弹出框
      editPrice() {
        this.isShowEditPrice = true;
      },
      //监听折扣和价格变化
      priceChange(name, num) {
        let products = this.orderMsg.products[num];
        let count = products.price * products.productNum;
        if(name === 'adjustDiscount') {
          products.adjustFee = ((((products.adjustDiscount / 10) - 1) * count) / 100).toFixed(2);
        } else if(name === 'adjustFee') {//输入价格时不需要算打折
          products.adjustDiscount = 0;
          if(!products.adjustFee.trim()) {
            products.adjustFee = 0;
          }
        }
        this.discountFeeCount();
      },
      //免运费
      noPostFee() {
        this.postFee = 0;
        this.discountFeeCount();
      },
      //计算折扣后买家实付
      discountFeeCount() {
        let that = this;
        let totalDiscountFee = 0;
        let postFee = parseFloat(that.postFee) || 0;
        for(let i = 0; i < that.orderMsg.products.length; i++) {
          totalDiscountFee += (parseFloat(that.orderMsg.products[i].adjustFee) * 100);
        }
        that.editPriceParams.adjustFee = totalDiscountFee;
        that.totalDiscountFee = ((parseFloat(that.postFee) * 100) + that.orderMsg.payment + totalDiscountFee).toFixed(2);
      },
      //确定修改价格
      onOkEditPrice() {
        let that = this;
        that.editPriceParams.orderId = that.orderMsg.id;
        that.editPriceParams.postFee = parseFloat(that.postFee) * 100;
        let products = that.orderMsg.products;
        that.editPriceParams.productItems = [];
        for(let i = 0; i < products.length; i++) {
          that.editPriceParams.productItems.push({
              adjustDiscount: parseFloat(products[i].adjustDiscount),
              adjustFee: (parseFloat(products[i].adjustFee) * 100),
              productItemId: products[i].id
          })
        }
        api.adjustFee(that.entityId, that.editPriceParams)
          .then((res) => {
            if(res){
              that.isShowEditPrice = false;
              that.$message({
                type: 'success',
                message: '修改价格成功！'
              });
              that.$emit('refresh');
            }
          });
      },

      //显示支付信息弹出框
      showPayMsg() {
        this.isShowMostMsg = true;
      },

      //获取子组件地址信息
      getAddress(res) {
        this.editAddressData.province = res.province;
        this.editAddressData.city = res.city;
        this.editAddressData.area = res.area;
      },
      //确认修改收货信息
      onOkAddress(formName) {
        let that = this;
        let editData = that.editAddressData;
        that.$refs[formName].validate((valid) => {
          if(valid){
            that.isCloseAddress = false;
            api.updateAddress(that.entityId, that.editAddressData)
              .then((res) => {
                if(res){
                  that.isCloseAddress = true;
                  that.$message({
                    type: 'success',
                    message: '修改收货信息成功！'
                  });
                  that.$emit('refresh');
                }
              })
          }
        });
      },
      //确认订单发货
      onOkOrder(formName) {
        let that = this;
        let editOrderDelivery = that.editOrderDelivery;
        let device_ids_arr = editOrderDelivery.device_ids.replace('；', ';').split(';');
        let flag = true;
        if(device_ids_arr.length > 0 && device_ids_arr[0] !== '') {
          for(let i = 0; i < device_ids_arr.length; i++) {
            if([...device_ids_arr[i]].length !== 12) {
              flag = false;
              that.$message.error('请输入正确的设备编码！');
              break;
            }
            if(flag) {
              for(let j = i + 1; j < device_ids_arr.length; j++) {
                if(device_ids_arr[i] === device_ids_arr[j]) {
                  flag = false;
                  that.$message.error('设备编码重复！');
                  break;
                }
              }
            }
            if(flag) {
              for(let k = 0; k < that.orderMsg.devices.length; k++) {
                if(device_ids_arr[i] === that.orderMsg.devices[k].deviceId) {
                  flag = false;
                  that.$message.error('对应设备已关联！');
                  break;
                }
              }
              let num = 0;
              for(let l = 0; l < that.orderMsg.products.length; l++) {
                num += that.orderMsg.products[l].productNum;
              }
              if(num < that.orderMsg.devices.length + device_ids_arr.length) {
                that.$message.error('添加设备已超出购买商品数量！');
              }
            }
          }
        }
        if(flag) {
          that.$refs[formName].validate((valid) => {
            if(valid){
              api.deliver(that.entityId, editOrderDelivery)
                .then((res) => {
                  if(res){
                    that.isCloseOrder = true;
                    that.$message({
                      type: 'success',
                      message: '订单发货成功！'
                    });
                    that.$emit('refresh');
                  }
                });
            }
          })
        }
      },
    }
  }
</script>

