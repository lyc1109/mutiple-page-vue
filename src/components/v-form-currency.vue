<style scoped lang="scss" type="text/scss">
  @import "~variables";
</style>

<template>
  <div class="el-input" :class="{'el-input-group el-input-group--append': !$filters.isNullStr(suffix),'el-input--mini': isMini }">
    <money class="el-input__inner" v-model="currency" v-bind="moneyOptions"></money>
    <div class="el-input-group__append" v-if="!$filters.isNullStr(suffix)">{{suffix}}</div>
  </div>
</template>

<script>
  import {Money} from 'v-money';

  export default {
    name: "demo-v-form-currency",
    components: {Money},

    props: {
      // 金额值(分)，通过v-model绑定
      value: {
        type: Number,
        default: 0
      },
      // 保留小数位数
      precision: {
        type: Number,
        default: 2
      },
      // 每千位分隔符,
      thousands: {
        type: String,
        default: ","
      },
      // 前缀
      prefix: {
        type: String,
        default: "￥"
      },
      // 后缀
      suffix: {
        type: String,
        default: "元"
      },
      // 大小是否为mini型
      isMini: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        currency: this.value / 100.0,
        moneyOptions: {
          decimal: '.',
          thousands: this.thousands,
          prefix: this.prefix,
          suffix: "",
          precision: this.precision,
          masked: false /* doesn't work with directive */
        }
      }
    },
    watch: {
      value: function (newVal) {
        this.currency = newVal / 100.0
      },
      currency: function (newVal) {
        this.$emit("input", Math.round(newVal * 100));
      }
    }
  }
</script>
