<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .inline-block{
    vertical-align: initial;
  }
</style>
<template>
  <div class="inline-block">
    <v-confirm-btn class="inline-block"
                   :type="type"
                   :size="size"
                   :isConfirm="isShowDel"
                   :placement="placement"
                   @sure="sureDel"
                   value="确定删除该商品？"
                   width="300">删除</v-confirm-btn>
  </div>
</template>

<script>
  export default {
    name: "v-delete",
    props: {
      // 控制显示隐藏
      isShow: {
        type: Boolean,
        default: false
      },
      // 显示位置
      placement: {
        type: String,
        default: 'top'
      },
      // 商品id
      entityId: {
        type: String,
        required: true
      },
      // 按钮类型，如primary,success,text等
      type: {
        type: String,
        default: 'primary'
      },
      // 按钮大小，如small,mini等
      size: {
        type: String,
        default: 'mini'
      }
    },
    computed: {
      isShowDel () {
        return this.isShow
      }
    },
    data () {
      return {
        id: this.entityId
      }
    },
    watch: {
      entityId (val) {
        this.id = val
      }
    },
    methods: {
      // 确定上架
      sureDel() {
        this.$productApi.del(this.id)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '商品已成功删除',
              })
              this.$router.push('/product')
              this.$emit('onOk')
            }
          })
      }
    }
  }
</script>

