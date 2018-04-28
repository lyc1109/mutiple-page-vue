<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .smart-title{
    border-left: 3px solid $primary;
    height: 50px;
    line-height: 50px;
    background: $gray-light-2;
    padding-left: $m;
    font-size: $font-size-m;
    font-weight: 400;
    margin: 0;
  }
</style>
<template>
  <div>
    <div class="smart-title padding-right">
      包装售后
      <i class="iconfont float-right icon-iot-tijiaodingdan font-light margin-right cursor-pointer" @click="edit"></i>
    </div>
    <div class="border padding-l">
      <div class="align-center font-m font-light" v-if="productDetail.afterSale ? productDetail.afterSale === null : '' || productDetail.afterSale ? productDetail.afterSale.replace(/<[^p>]+>/g,'') === '' : ''">
        <div class="width-100">
          <i class="iconfont icon-iot-zanwushuju" style="font-size: 40px;"></i>
        </div>
        <div>暂时没有数据哦~</div>
      </div>
      <div v-else v-html="productDetail.afterSale"></div>
    </div>

    <!--修改包装售后-->
    <el-dialog :visible.sync="afterSaleShow" title="修改包装售后" :modal-append-to-body="false">
      <v-editor v-model="afterSale" :multiple="multiple" placeholder="请输入包装售后" maxHeight="400"></v-editor>
      <div slot="footer">
        <v-button-ok v-model="sureBtn" size="mini" :disabled="disabled" @click.native="sureDdit">确定</v-button-ok>
        <el-button size="mini" @click="cancelEdit">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import VEditor from '@/components/v-editor'

  export default {
    name: "v-product-description",
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        productDetail: this.data,
        afterSaleShow: false,
        afterSale: '',
        sureBtn: '',
        disabled: false,
        multiple: true
      }
    },
    watch: {
      data (val) {
        this.productDetail = val
      }
    },
    mounted () {
      setTimeout(() => {
        this.afterSale = this.productDetail.afterSale
      },300)
    },
    methods: {
      // 重新加载数据
      fetchData () {
        this.$productApi.detail(this.$route.params.id)
          .then((res) => {
            if(res){
              this.productDetail = res
            }
          })
      },
      // 修改商品详情
      edit () {
        this.afterSaleShow = true
      },
      // 确定修改
      sureDdit () {
        if(this.afterSale === ''){
          this.sureBtn = '请输入产品详情'
          return false
        }
        this.$productApi.updateAfterSale(this.$route.params.id,{
          description: this.afterSale
        })
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.fetchData()
              this.afterSaleShow = false
            }
          })
      },
      // 取消修改
      cancelEdit () {
        this.afterSaleShow = false
      }
    },
    components: { VEditor }
  }
</script>


