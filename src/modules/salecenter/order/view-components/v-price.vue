<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .order-money > span {
    text-align: right;
    display: inline-block;
  }
  .order-money > span:first-child {
    width: 80px;
  }
  .order-money > span:last-child {
    min-width: 80px;
  }
</style>

<template>
  <div class="padding font-default font-bold-700">
    <div class="order-money align-right padding-top-s">
      <span>商品合计：</span>
      <span>{{ $filters.formatRMB(priceMsg.payment) }}</span>
    </div>
    <div class="order-money align-right padding-top-s">
      <span>运费：</span>
      <span>{{ $filters.formatRMB(priceMsg.postFee) }}</span>
    </div>
    <div class="order-money align-right padding-top-s">
      <span>优惠：</span>
      <span>{{ $filters.formatRMB(priceMsg.discountFee) }}</span>
    </div>
    <div class="order-money align-right padding-top-s">
      <span>应收款：</span>
      <span class="font-bold-700 color-red-2 font-l">{{ $filters.formatRMB(priceMsg.totalAmount) }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "v-price",
    props: {
      data: {}
    },
    computed: {
      priceMsg() {
        return this.data
      }
    }
  }
</script>

