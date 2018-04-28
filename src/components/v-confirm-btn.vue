<style scoped lang="scss" type="text/scss">
  @import "~variables";

</style>
<template>
    <div>
      <el-popover v-model="isConfirm" ref="confirmBtn" :placement="placement" :width="width">
        <slot name="beforeText"></slot>
        <p>{{ value }}</p>
        <slot name="afterText"></slot>
        <div class="align-right">
          <el-button type="primary" size="mini" @click="sure">确定</el-button>
          <el-button size="mini" @click="cancel">取消</el-button>
        </div>
      </el-popover>

      <el-button :type="type" :size="size" :disabled="disabled" @click="clickBtn" v-popover:confirmBtn><slot></slot></el-button>
    </div>
</template>

<script>
  export default {
    name: "v-confirm-btn",
    props: {
      // 控制显示隐藏
      isConfirm: {
        type: Boolean,
        default: false
      },
      // 位置
      placement: {
        type: String,
        default: 'top'
      },
      // 宽度
      width: {
        type: Number,
        default: 300
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
      // 按钮是否为不可点击
      disabled: {
        type: Boolean,
        default: false
      },
      // 确认框的文本
      value: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        isShow: this.isConfirm
      }
    },
    watch: {
      isConfirm (val) {
        this.isShow = val
      }
    },
    methods: {
      // 点击
      clickBtn () {
        this.$emit('clicks')
      },
      // 确定
      sure () {
        this.$emit('sure')
        this.isConfirm = false
      },
      // 取消
      cancel () {
        this.$emit('cancel')
        this.isConfirm = false
      }
    }
  }
</script>


