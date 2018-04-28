<style lang="scss" type="text/scss">
  @import "~variables";
  .el-popover.btn-err-popover{
    border-color: $danger-light;
    max-width: 200px;

    .popper__arrow {
      bottom: -7px;

      &::after {
        border-top-color: $danger-light;
      }
    }
  }
</style>

<template>
  <div class="inline-block">
    <el-popover ref="okBtnErrMsgPopover"
                popper-class="btn-err-popover"
                trigger="manual"
                v-model="isShowPopover"
                :placement="placement">
      <span class="color-danger-light" @click="close"><i class="el-icon-warning margin-right"></i>{{value}}</span>
    </el-popover>

    <el-button :type="type" :size="size" :disabled="disabled" :icon="icon" v-popover:okBtnErrMsgPopover><slot></slot></el-button>
  </div>
</template>

<script>
  export default {
    name: "v-button-ok",
    desc: "用于表单保存按钮或对话框确定按钮，若有异常直接在按钮上方显示错误popover，使错误信息离用户更接近",
    props: {
      // el-button类型属性，可选：	primary / success / warning / danger / info / text
      type: {
        type: String,
        default: "primary"
      },
      // el-button大小属性，可选：	medium / small / mini
      size: {
        type: String,
        default: ""
      },
      // el-popover位置属性:
      placement: {
        type: String,
        default: "top"
      },
      // 错误消息，通过v-model绑定
      value: {
        type: String,
        default: ""
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 按钮使用icon来代替文字
      icon: {
        type: String,
        default: ''
      }
    },
    computed: {
      isShowPopover: function () {
        return !this.$filters.isNullStr(this.value);
      }
    },
    watch: {
      value: function (newVal) {
        if(!this.$filters.isNullStr(newVal)) {
          setTimeout(() => {
            this.close();
          }, 3000)
        }
      }
    },
    methods: {
      close: function () {
        this.value = "";
        this.$emit("input", "");
      }
    }
  }
</script>
