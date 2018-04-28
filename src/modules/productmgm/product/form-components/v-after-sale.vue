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
  <el-form :model="saleForm" ref="saleForm" :rules="saleRule" class="spec-form">
    <el-form-item prop="afterSale">
      <v-editor v-model="saleForm.afterSale" :multiple="multiple" placeholder="请输入包装售后" class="detail-editor"></v-editor>
    </el-form-item>
  </el-form>
</template>

<script>
  import VEditor from '@/components/v-editor'

  export default {
    name: "v-after-sale",
    props: {
      productType: {
        type: String,
        default: 'ICP'
      }
    },
    data () {
      return {
        saleForm: {
          afterSale: ''
        },
        saleRule: {},
        multiple: true,
        type: this.productType
      }
    },
    watch: {
      saleForm: {
        handler (val){
          this.$emit('getData',val)
        },
        deep: true
      },
      productType (val) {
        this.type = val
      }
    },
    mounted () {
      this.fetchData()
      this.$emit('getRef',this.$refs.saleForm)
      this.$emit('getData',this.saleForm)
    },
    methods: {
      fetchData () {
        this.$productApi.getAfterSale({
          product_type: this.type
        })
          .then((res) => {
            if(res){
              this.saleForm.afterSale = res.description
            }
          })
      }
    },
    components: { VEditor }
  }
</script>


