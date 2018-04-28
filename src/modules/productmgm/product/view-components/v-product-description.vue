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
        商品详情
        <i class="iconfont float-right icon-iot-tijiaodingdan font-light margin-right cursor-pointer" @click="edit"></i>
      </div>
      <div class="border padding-l">
        <div class="align-center font-m font-light" v-if="productDetail.productDesc ? productDetail.productDesc === null : '' || productDetail.productDesc ? productDetail.productDesc.replace(/<[^p>]+>/g,'') === '' : ''">
          <div class="width-100">
            <i class="iconfont icon-iot-zanwushuju" style="font-size: 40px;"></i>
          </div>
          <div>暂时没有详情哦~</div>
        </div>
        <div v-else v-html="productDetail.productDesc"></div>
      </div>

      <!--修改详情-->
      <el-dialog :visible.sync="descriptionShow" title="修改商品详情" :modal-append-to-body="false">
        <v-editor v-model="description" :multiple="multiple" placeholder="请输入商品详情" maxHeight="400"></v-editor>
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
        descriptionShow: false,
        description: '',
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
        this.description = this.productDetail.productDesc
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
        this.descriptionShow = true
      },
      // 确定修改
      sureDdit () {
        if(this.description === ''){
          this.sureBtn = '请输入产品详情'
          return false
        }
        this.$productApi.editDescription(this.$route.params.id,{
          description: this.description
        })
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.fetchData()
              this.descriptionShow = false
            }
          })
      },
      // 取消修改
      cancelEdit () {
        this.descriptionShow = false
      }
    },
    components: { VEditor }
  }
</script>


