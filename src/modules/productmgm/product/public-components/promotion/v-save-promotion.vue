<style scoped lang="scss" type="text/scss">
  @import '~variables';
</style>
<template>
  <v-form-popover v-model="editPromotion"
                  size="mini"
                  :title="`${title}商品促销`"
                  class="inline-block"
                  type="text"
                  :isClose="isEditPromotion"
                  @onOk="sureEditPromotion('promotionForm')"
                  @onCancel="cancelPromotion">
    <div slot="form">
      <el-form :model="promotionForm" ref="promotionForm" :rules="promotionRule" label-width="100px">
        <el-form-item prop="price" label="促销价格">
          <!--<el-input v-model.trim.number="promotionForm.price" size="mini" placeholder="请输入促销价格" type="number">-->
          <!--<template slot="append">元</template>-->
          <!--</el-input>-->
          <v-form-currency prefix=" " v-model="promotionForm.price"></v-form-currency>
        </el-form-item>
        <el-form-item prop="start" label="开始时间">
          <el-date-picker v-model="promotionForm.start" class="popover-datetime" :picker-options="disabledDate" type="datetime" placeholder="请选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item prop="end" label="结束时间">
          <el-date-picker v-model="promotionForm.end" class="popover-datetime" :picker-options="disabledDate" type="datetime" placeholder="请选择结束时间"></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    {{ value }}
  </v-form-popover>
</template>

<script>
  import VFormCurrency from "@/components/v-form-currency"

  export default {
    name: "v-save-promotion",
    props: {
      // 商品数据
      data: {
        type: Object,
        default: {}
      },
      // 标题
      title: {
        type: String,
        default: '编辑'
      },
      // 按钮标题
      value: {
        type: String,
        default: '编辑'
      }
    },
    data () {
      let priceValid = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入促销价格'))
        }else if(Number(value) <= 0){
          callback(new Error('请输入大于0的价格'))
        }else{
          callback()
        }
      }
      let validEnd = (rule,value,callback) => {
        if(value <= this.promotionForm.start){
          callback(new Error('结束时间要大于开始时间'))
        }
      }
      return {
        productDetail: this.data,
        editPromotion: false,
        isEditPromotion: false,
        promotionForm: {
          price: 0,
          start: 0,
          end: 0
        },
        promotionRule: {
          price: [{ required: true,validator: priceValid,trigger: 'change' }],
          start: [{ type: 'date',required: true,message: '请选择开始时间',trigger: 'change' }],
          end: [{ type: 'date',validator: validEnd,trigger: 'change' }]
        },
        disabledDate: {
          disabledDate (time) {
            return time.getTime() < Date.now()
          }
        }
      }
    },
    watch: {
      data (val) {
        this.productDetail = val
      }
    },
    mounted () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.fetchData()
        },400)
      })
    },
    methods: {
      fetchData () {
        if(this.productDetail.productPromotionDto){
          this.promotionForm.price = this.productDetail.productPromotionDto.promotionPrice

          if(this.productDetail.productPromotionDto.promotionStart === 0){
            this.promotionForm.start = new Date()
          }else {
            this.promotionForm.start = new Date(this.productDetail.productPromotionDto.promotionStart)
          }

          if(this.productDetail.productPromotionDto.promotionEnd === 0){
            this.promotionForm.end = new Date()
          }else{
            this.promotionForm.end = new Date(this.productDetail.productPromotionDto.promotionEnd)
          }
        }else{
          this.promotionForm.price = 0
          this.promotionForm.start = ''
          this.promotionForm.end = ''
        }
      },
      // 确定保存商品促销
      sureEditPromotion (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            let id = ''
            if(this.productDetail.productPromotionDto){
              id = this.productDetail.productPromotionDto.id
            }else{
              id = '-1'
            }
            this.$promotionApi.save(this.$route.params.id,id,this.promotionForm)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '修改成功'
                  })
                  this.cancelPromotion()
                  this.isEditPromotion = true
                }
              })
          }
        })
      },
      // 取消保存商品促销
      cancelPromotion () {
        this.fetchData()
        this.$emit('cancel')
      }
    },
    components: { VFormCurrency }
  }
</script>

