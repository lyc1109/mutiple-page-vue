<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .spec-form{
    /*margin: 0 15%;*/
    width: 100%;
    max-width: none;

    .el-input,.el-textarea{
      width: 45%;
    }
  }
  .el-date-editor{
    width: 45%;
  }
  /*.el-input-group--prepend{*/
  /*width: auto;*/
  /*}*/
</style>
<template>
  <div>
    <el-form :model="attrForm" ref="attrForm" :rules="attrRule" label-width="100px" class="margin-top-xl spec-form">
      <el-form-item prop="openSale" label="是否开放销售">
        <el-radio-group v-model="attrForm.openSale" size="small" @change="changeOpen">
          <el-radio v-for="item in isOpenList" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="border-bottom" v-if="!isOpenDisabled">
        <el-form-item prop="listPrice" label="市场售价">
          <!--<el-input type="number" size="small" v-model="attrForm.listPrice" placeholder="请输入市场售价">-->
            <!--<template slot="append">元</template>-->
          <!--</el-input>-->
          <v-form-currency prefix=" " v-model="attrForm.listPrice"></v-form-currency>
        </el-form-item>
        <el-form-item prop="price" label="店铺售价">
          <!--<el-input type="number" size="small" v-model.trim.number="attrForm.price" placeholder="请输入店铺售价">-->
            <!--<template slot="append">元</template>-->
          <!--</el-input>-->
          <v-form-currency prefix=" " v-model="attrForm.price"></v-form-currency>
        </el-form-item>
        <el-form-item prop="freight" label="商品运费">
          <!--<el-input type="number" size="small" v-model.trim.number="attrForm.freight" placeholder="请输入商品运费">-->
            <!--<template slot="append">元</template>-->
          <!--</el-input>-->
          <v-form-currency prefix=" " v-model="attrForm.freight"></v-form-currency>
          <span class="font-s font-light">PS：商品运费为0则免运费</span>
        </el-form-item>
        <el-form-item prop="logisticsDescription" label="物流说明">
          <el-input type="textarea" rows="4" size="small" v-model="attrForm.logisticsDescription" placeholder="请输入物流说明"></el-input>
        </el-form-item>
        <el-form-item prop="salesArea" label="销售区域">
          <el-input v-model.trim="attrForm.salesArea" size="small" placeholder="请输入销售区域"></el-input>
        </el-form-item>
        <el-form-item prop="stockNum" label="库存数量">
          <el-input type="number" size="small" v-model.trim.number="attrForm.stockNum" placeholder="请输入库存数量"></el-input>
        </el-form-item>
        <el-form-item prop="maxPurchase" label="最大购买数量">
          <el-input type="number" size="small" v-model.trim.number="attrForm.maxPurchase" placeholder="请输入最大购买数量"></el-input>
          <span class="font-s font-light">PS:最大购买数量为0即表示不限购</span>
        </el-form-item>
        <el-form-item prop="giftIntegral" label="赠送积分">
          <el-input type="number" size="small" v-model.trim.number="attrForm.giftIntegral" placeholder="请输入最大购买数量"></el-input>
        </el-form-item>
        <el-form-item prop="onSale" label="商品上架">
          <el-radio-group v-model="attrForm.onSale" size="small" @change="changePutaways">
            <el-radio v-for="item in saleWays" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
          <div v-if="!putawaysDisabled">
            <el-date-picker type="datetime" v-model="onTime" placeholder="请输入商品上架时间" size="small" class="margin-top-s" @change="changeListing"></el-date-picker>
            <el-date-picker type="datetime" v-model="upTime" placeholder="请输入商品下架时间,若不选则表示不下架" size="small" class="margin-top" @change="changeDelisting"></el-date-picker>
          </div>
        </el-form-item>
      </div>
      <!--<div class="border-bottom">-->
      <!--<el-form-item prop="supportTrial" label="商品试用">-->
      <!--<el-radio-group v-model="attrForm.supportTrial" size="mini" @change="changeTrial">-->
      <!--<el-radio v-for="item in trialList" :label="item.value" :key="item.value">{{ item.label }}</el-radio>-->
      <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <!--<div v-if="!trialDisabled">-->
      <!--<el-form-item prop="trialDays" label="试用天数">-->
      <!--<el-input type="number" v-model.trim.number="attrForm.trialDays" placeholder="请输入试用天数" size="mini">-->
      <!--<template slot="append">天</template>-->
      <!--</el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item prop="prepaidAmount" label="试用预付款">-->
      <!--<el-input type="number" v-model.trim.number="attrForm.prepaidAmount" placeholder="请输入试用预付款" size="mini">-->
      <!--<template slot="append">元</template>-->
      <!--</el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item prop="overdueStrategy" label="逾期策略">-->
      <!--<el-select v-model="attrForm.overdueStrategy" placeholder="请选择逾期策略" size="mini">-->
      <!--<el-option v-for="item in overdueStrategyList" :label="item.label" :value="item.value" :key="item.value"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--</div>-->
      <!--</div>-->
      <el-form-item prop="elses" v-if="!isOpenDisabled">
        <el-checkbox v-model="attrForm.aNew">是否新品</el-checkbox>
        <el-checkbox v-model="attrForm.selection">是否精选</el-checkbox>
        <el-checkbox v-model="attrForm.hot">是否热销</el-checkbox>
        <!--<el-checkbox v-model="attrForm.aNew">是否特价促销</el-checkbox>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import VFormCurrency from "@/components/v-form-currency"

  export default {
    name: "v-sale-attr",
    data () {
      let validInteger = (rule,value,callback) => {
        const reg = /^\d+$/
        if(!reg.test(value)){
          callback(new Error('只能输入大于或等于0的正整数'))
        }else{
          callback()
        }
      }
      let validDecimal = (rule,value,callback) => {
        const reg = /^\d+(\.\d{1,2})?$/
        if(!reg.test(value) || value === 0){
          callback(new Error('不能输入负数和0,且只能输入两位小数以内'))
        }else{
          callback()
        }
      }
      let validFright = (rule,value,callback) => {
        const reg = /^\d+(\.\d{1,2})?$/
        if(!reg.test(value)){
          callback(new Error('只能输入两位小数以内的正数'))
        }else{
          callback()
        }
      }
      return {
        attrForm: {
          openSale: true,
          listPrice: 0,
          price: 0,
          freight: 0,
          logisticsDescription: '',
          salesArea: '',
          stockNum: 0,
          maxPurchase: 0,
          giftIntegral: 0,
          onSale: true,
          productListingForm: {
            listingTime: '',
            delistingTime: ''
          },
          supportTrial: true,
          trialDays: 15,
          prepaidAmount: 0,
          overdueStrategy: '',
          aNew: false,
          selection: false,
          hot: false,
        },
        onTime: '',
        upTime: '',
        overdueStrategyList: [
          {
            label: '直接锁机',
            value: '直接锁机'
          },
          {
            label: '温馨提示',
            value: '直接锁机'
          }
        ],
        isOpenList: [
          {
            label: '是',
            value: true
          },
          {
            label: '否',
            value: false
          }
        ],
        trialList: [
          {
            label: '支持',
            value: true
          },
          {
            label: '不支持',
            value: false
          }
        ],
        saleWays: [
          { label: '立即上架',value: true },
          { label: '定时上架',value: false }
        ],
        trialDisabled: false,
        isOpenDisabled: false,
        putawaysDisabled: true,
        attrRule: {
          // openSale: [{ required: true,message: '请决定是否开放销售',trigger: 'change' }],
          listPrice: [{ validator: validDecimal,trigger: 'change' }],
          price: [{ validator: validDecimal,trigger: 'change' }],
          freight: [{ validator: validFright,trigger: 'change' }],
          stockNum: [{ validator: validInteger,trigger: 'change' }],
          maxPurchase: [{ validator: validInteger,trigger: 'change' }],
          giftIntegral: [{ validator: validInteger,trigger: 'change' }],
          trialDays: [{ validator: validInteger,trigger: 'change' }]
        }
      }
    },
    watch: {
      attrForm: {
        handler (val){
          this.$emit('getData',val)
        },
        deep: true
      }
    },
    mounted () {
      this.$emit('getRef',this.$refs.attrForm)
      this.$emit('getData',this.attrForm)
    },
    methods: {
      // 是否开放销售
      changeOpen(val){
        if(val){
          this.isOpenDisabled = false
          return this.attrForm.onSale ? this.putawaysDisabled = true : this.putawaysDisabled = false
        }else{
          this.isOpenDisabled = true
          this.putawaysDisabled = true
        }
      },
      // 是否定时上架
      changePutaways(val){
        this.attrForm.onSale = val
        return val ? this.putawaysDisabled = true : this.putawaysDisabled = false
      },
      // 是否试用
      changeTrial(val){
        this.attrForm.supportTrial = val
        return val ? this.trialDisabled = false : this.trialDisabled = true
      },
      // 选择上架时间
      changeListing (val) {
        this.attrForm.productListingForm.listingTime = this.$filters.formatTime(val)
      },
      // 选择下架时间
      changeDelisting (val) {
        this.attrForm.productListingForm.delistingTime = this.$filters.formatTime(val)
      }
    },
    components: { VFormCurrency }
  }
</script>
