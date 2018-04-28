<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .line-height-30 {
    line-height: 30px;
  }
</style>

<template>
  <el-table
    :data="defend"
    :refresh="refresh"
    stripe
    class="margin-top-m"
    v-if="defend.length > 0"
  >
    <el-table-column prop="refundApplyTypeText" label="退换货类型"></el-table-column>
    <el-table-column prop="refundApplyStatusText" label="退换货状态"></el-table-column>
    <el-table-column prop="refundApplyInfo" label="申请原因"></el-table-column>
    <el-table-column prop="gmtCreated" label="申请时间">
      <template slot-scope="scope">
        {{ scope.row.gmtCreated ? $filters.formatTime(scope.row.gmtCreated) : '' }}
      </template>
    </el-table-column>
    <el-table-column prop="endTime" label="处理完成时间">
      <template slot-scope="scope">
        {{ scope.row.endTime ? $filters.formatTime(scope.row.endTime) : '' }}
      </template>
    </el-table-column>
    <el-table-column prop="endTime" label="操作">
      <template slot-scope="scope">
        <el-popover
          ref="defendDetail"
          placement="top"
          width="250"
        >
          <!--仅退款-->
          <div class="font-s" v-if="scope.row.refundApplyType === 'refund'">
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700">退款金额：</el-col>
              <el-col span="14" class="color-red-2 font-bold-700">{{ $filters.formatRMB(scope.row.actualRefundAmount) }}</el-col>
            </el-row>
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700">退款状态：</el-col>
              <el-col span="14">{{ scope.row.refundStatusText }}</el-col>
            </el-row>
          </div>
          <!--仅换货-->
          <div class="font-s" v-if="scope.row.refundApplyType === 'change'">
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700">换货物流方式：</el-col>
              <el-col span="14">{{ scope.row.shippingTypeText }}</el-col>
            </el-row>
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700"> 换货物流公司：</el-col>
              <el-col span="14">{{ scope.row.logisticsCompany }}</el-col>
            </el-row>
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700">换货物流单号：</el-col>
              <el-col span="14">{{ scope.row.invoiceNo }}</el-col>
            </el-row>
          </div>
          <!--仅退货-->
          <div class="font-s" v-if="scope.row.refundApplyType === 'return'">
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700">退货方式：</el-col>
              <el-col span="14">{{ scope.row.returnShippingTypeText }}</el-col>
            </el-row>
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700">退货物流：</el-col>
              <el-col span="14">{{ scope.row.returnLogisticsCompany }}</el-col>
            </el-row>
            <el-row class="line-height-30">
              <el-col span="10" class="align-right font-bold-700">退货单号：</el-col>
              <el-col span="14">{{ scope.row.returnInvoiceNo }}</el-col>
            </el-row>
          </div>
        </el-popover>
        <a class="color-blue-1" href="javascript:;" v-popover:defendDetail>详情</a>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import api from '@/apis/api-order'

  export default {
    name: "v-defend-orders",
    props: {
      isConfirm: Boolean
    },
    data() {
      return {
        entityId: this.$route.params.entityId,
        defend: []
      }
    },
    computed: {
      refresh() {
        if(this.isConfirm) {
          this.defendOrders();
        }
        return this.isConfirm;
      }
    },
    mounted() {
      this.defendOrders();
    },
    methods: {
      defendOrders() {
        let that = this;
        api.defendOrders(that.entityId)
          .then((res) => {
            that.defend = res;
          })
      },
    }
  }
</script>

