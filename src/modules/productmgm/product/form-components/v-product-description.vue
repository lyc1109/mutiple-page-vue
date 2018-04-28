<style scoped lang="scss" type="text/scss">
  .spec-form{
    max-width: none;

    .el-checkbox-group{
      width: 90%;
      float: left;
    }
    .spec-image{
      width: 60px;
      height: 60px;
      padding: 0;
      overflow: hidden;
    }
  }
  .detail-editor {
    /deep/ .v-editor {
      /deep/ .ql-toolbar {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
  }
</style>
<template>
  <el-form :model="descriptionForm" ref="descriptionForm" :rules="descriptionRule" class="spec-form">
    <el-form-item prop="productDesc">
      <v-editor v-model="descriptionForm.productDesc" :multiple="multiple" placeholder="请输入商品详情" class="detail-editor"></v-editor>
    </el-form-item>
  </el-form>
</template>

<script>
  import VEditor from '@/components/v-editor'

  export default {
    name: "v-product-description",
    data () {
      return {
        descriptionForm: {
          productDesc: ''
        },
        descriptionRule: {},
        multiple: true
      }
    },
    watch: {
      descriptionForm: {
        handler (val){
          this.$emit('getData',val)
        },
        deep: true
      }
    },
    mounted () {
      this.$emit('getRef',this.$refs.descriptionForm)
      this.$emit('getData',this.descriptionForm)
    },
    components: { VEditor }
  }
</script>


