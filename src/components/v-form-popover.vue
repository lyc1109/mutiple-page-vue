<style scoped lang="scss" type="text/scss">
  @import "~variables";

  </style>
<template>
  <div>
    <el-popover v-model="isShowPop"
                ref="isShowPops"
                :placement="placement"
                :width="width"
                :title="title">
      <slot name="form"></slot>
      <div class="align-right">
        <el-button type="primary" size="mini" @click="sure">确定</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </el-popover>

    <el-button :type="type"
               :size="size"
               :disabled="disabled"
               @click="clickBtn"
               v-popover:isShowPops>
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
  export default {
    name: "v-form-popover",
    props: {
      // 显示隐藏popover
      isShow: {
        type: Boolean,
        default: false
      },
      // 标题
      title: {
        type: String,
        default: ''
      },
      // 显示位置
      placement: {
        type: String,
        default: 'top'
      },
      // 宽度
      width: {
        type: Number,
        default: 500
      },
      // 按钮类型
      type: {
        type: String,
        default: 'primary'
      },
      // 按钮大小
      size: {
        type: String,
        default: 'small'
      },
      // 按钮是否可点击
      disabled: {
        type: Boolean,
        default: false
      },
      // 是否关闭的key
      isClose: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      // isShow (val) {
      //   return val ? this.isShowPop = true : this.isShowPop = false
      // },
      isClose (val) {
        return val ? this.isShowPop = false : this.isShowPop = true
      }
    },
    data () {
      return {
        isShowPop: this.isShow
      }
    },
    methods: {
      clickBtn () {
        this.$emit('clicks')
      },
      // 确定
      sure () {
        this.$emit('onOk')
      },
      // 取消
      cancel () {
        this.isShowPop = false
        this.$emit('onCancel')
      }
    }
  }
</script>
