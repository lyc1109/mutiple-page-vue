<style scoped lang="scss" type="text/scss">
  @import '~variables';
</style>
<template>
  <v-form-popover v-model="editTrial"
                  size="mini"
                  title="开启商品试用"
                  class="inline-block"
                  type="text"
                  :isClose="isEditTrial"
                  @onOk="sureEditTrial('trialForm')"
                  @onCancel="cancel">
    <div slot="form">
      <el-form :model="trialForm" ref="trialForm" :rules="trialRule" label-width="100px">
        <el-form-item prop="trialDays" label="试用天数">
          <el-input type="number" min="0" v-model.trim.number="trialForm.trialDays" size="mini" placeholder="请输入试用天数">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="prepaidAmount" label="试用预付款">
          <v-form-currency v-model="trialForm.prepaidAmount" prefix=""></v-form-currency>
          <!--<el-input type="number" min="0" v-model.trim.number="trialForm.prepaidAmount" size="mini" class="popover-datetime" placeholder="请输入试用预付款">-->
            <!--<template slot="append">元</template>-->
          <!--</el-input>-->
        </el-form-item>
        <el-form-item prop="overdueStrategy" label="逾期策略">
          <el-select v-model="trialForm.overdueStrategy" size="mini" class="popover-datetime" placeholder="请选择逾期策略">
            <el-option v-for="item in overdueList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    点击这里开启
  </v-form-popover>
</template>

<script>
  import VFormCurrency from "@/components/v-form-currency"

  export default {
    name: "v-open-trial",
    props: {
      type: Object,
      default: {}
    },
    data () {
      return {
        productDetail: this.data,
        editTrial: false,
        isEditTrial: false,
        trialForm: {
          trialDays: 15,
          prepaidAmount: 0,
          overdueStrategy: ''
        },
        trialRule: {
          trialDays: [{ required: true,message: '请输入试用天数',trigger: 'blur' }],
          prepaidAmount: [{ required: true,message: '请输入试用预付款',trigger: 'change' }],
          overdueStrategy: [{ required: true,message: '请输入逾期策略',trigger: 'change' }]
        },
        overdueList: ['直接锁机', '温馨提示'],
      }
    },
    watch: {
      data (val) {
        this.productDetail = val
      }
    },
    methods: {
      // 确定开启商品试用
      sureEditTrial (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.trialForm.prepaidAmount = Number(this.trialForm.prepaidAmount)
            this.$productApi.openTrial(this.$route.params.id,this.trialForm)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功开启商品试用'
                  })
                  this.cancel()
                  this.isEditTrial = true
                }
              })
          }
        })
      },
      // 取消
      cancel () {
        this.$emit('cancel')
      }
    },
    components: { VFormCurrency }
  }
</script>

