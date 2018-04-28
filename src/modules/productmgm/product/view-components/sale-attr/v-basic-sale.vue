<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .basic-attr{
    &>div {
      line-height: 30px;

      span, b {
        font-size: $font-size-s;
      }
      span {
        margin-right: $xs;
        color: $font-light;
        float: left;
      }
      b {
        font-weight: 400;
        display: inline-block;
        width: 70%;
        position: relative;
        top: -1px;
      }
    }
    .num{
      font-style: initial;
    }
  }
</style>
<template>
  <div class="font-s basic-attr">
    <div class="position-relative" @mouseover="showAreaIcon" @mouseout="hideAreaIcon">
      <span>销售区域</span>
      <b v-if="!closeArea">{{ productDetail.salesArea }}</b>

      <div v-else class="inline-block">
        <el-form :model="areaForm" ref="areaForm" :rules="areaRule">
          <el-form-item prop="area" class="margin-bottom-0">
            <el-input v-model="areaForm.area" placeholder="请输入销售区域" size="mini"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m">
        <div v-if="closeArea">
          <el-button type="text" size="mini" @click="editArea('areaForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelArea">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showArea" @click="closeArea = !closeArea"></i>
      </div>

    </div>
    <div class="position-relative" @mouseover="showFreightIcon" @mouseout="hideFreightIcon">
      <span>商品运费</span>
      <b v-if="!closeFreight && productDetail.freight !== 0">{{ $filters.formatCurrency((productDetail.freight / 100)) }}</b>
      <b v-if="!closeFreight && productDetail.freight === 0">免运费</b>

      <div v-if="closeFreight" class="inline-block">
        <el-form :model="freightForm" ref="freightForm" :rules="freightRule">
          <el-form-item prop="freight" class="margin-bottom-0">
            <!--<el-input type="number" v-model.trim.number="freightForm.freight" placeholder="请输入商品运费" size="mini">-->
              <!--<template slot="append">元</template>-->
            <!--</el-input>-->
            <v-form-currency prefix=" " v-model="freightForm.freight" :isMini="true"></v-form-currency>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m">
        <div v-if="closeFreight">
          <el-button type="text" size="mini" @click="editFreight('freightForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelFreight">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showFreight" @click="closeFreight = !closeFreight"></i>
      </div>

    </div>
    <div class="position-relative" @mouseover="showLogisticsIcon" @mouseout="hideLogisticsIcon">
      <span>物流说明</span>
      <b v-if="!closeLogistics">{{ productDetail.logisticsDescription }}</b>

      <div v-else class="inline-block">
        <el-form :model="logisticsForm" ref="logisticsForm" :rules="logisticsRule">
          <el-form-item prop="logistics" class="margin-bottom-0">
            <el-input type="area" rows="4" v-model="logisticsForm.logistics" placeholder="请输入物流说明" size="mini"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m">
        <div v-if="closeLogistics">
          <el-button type="text" size="mini" @click="editLogistics('logisticsForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelLogistics">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showLogistics" @click="closeLogistics = !closeLogistics"></i>
      </div>

    </div>
    <div class="position-relative" @mouseover="showStockQtyIcon" @mouseout="hideStockQtyIcon">
      <span>库存数量</span>
      <b v-if="!closeStockQty">{{ productDetail.stockNum }}台</b>

      <div v-else class="inline-block">
        <el-form :model="stockQtyForm" ref="stockQtyForm" :rules="stockQtyRule">
          <el-form-item prop="stockQty" class="margin-bottom-0">
            <el-input type="number" v-model.trim.number="stockQtyForm.stockQty" placeholder="请输入库存数量" size="mini">
              <template slot="append">台</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m">
        <div v-if="closeStockQty">
          <el-button type="text" size="mini" @click="editStockQty('stockQtyForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelStockQty">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showStockQty" @click="closeStockQty = !closeStockQty"></i>
      </div>

    </div>
    <div class="position-relative" @mouseover="showMaxNumsIcon" @mouseout="hideMaxNumsIcon">
      <span>最大购买数量</span>
      <b v-if="!closeMaxNums">{{ productDetail.maxPurchase }}台</b>

      <div v-else class="inline-block">
        <el-form :model="maxNumsForm" ref="maxNumsForm" :rules="maxNumsRule">
          <el-form-item prop="maxNums" class="margin-bottom-0">
            <el-input type="number" v-model.trim.number="maxNumsForm.maxNums" placeholder="请输入最大购买数量" size="mini">
              <template slot="append">台</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m">
        <div v-if="closeMaxNums">
          <el-button type="text" size="mini" @click="editMaxNums('maxNumsForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelMaxNums">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showMaxNums" @click="closeMaxNums = !closeMaxNums"></i>
      </div>

    </div>
    <div class="position-relative" @mouseover="showPresentExpIcon" @mouseout="hidePresentExpIcon">
      <span>赠送积分</span>
      <b v-if="!closePresentExp">{{ productDetail.giftIntegral }}</b>

      <div v-else class="inline-block">
        <el-form :model="presentExpForm" ref="presentExpForm" :rules="presentExpRule">
          <el-form-item prop="presentExp" class="margin-bottom-0">
            <el-input type="number" v-model.trim.number="presentExpForm.presentExp" placeholder="请输入赠送积分" size="mini"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m">
        <div v-if="closePresentExp">
          <el-button type="text" size="mini" @click="editPresentExp('presentExpForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelPresentExp">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showPresentExp" @click="closePresentExp = !closePresentExp"></i>
      </div>

    </div>
    <div class="position-relative" @mouseover="showIsNewIcon" @mouseout="hideIsNewIcon">
      <span>是否新品</span>
      <b v-if="productDetail.aNew && !closeIsNew">是</b>
      <b v-if="!productDetail.aNew && !closeIsNew">否</b>

      <div v-if="closeIsNew" class="inline-block">
        <el-form :model="isNewForm" ref="isNewForm" :rules="isNewRule">
          <el-form-item prop="isNew" class="margin-bottom-0">
            <el-radio-group v-model="isNewForm.isNew">
              <el-radio v-for="item in isNewList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m position-absolute" style="right: 0;top: 0;">
        <div v-if="closeIsNew">
          <el-button type="text" size="mini" @click="editIsNew('isNewForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelIsNew">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showIsNew" @click="closeIsNew = !closeIsNew"></i>
      </div>

    </div>
    <div class="position-relative" @mouseover="showIsFeaturedIcon" @mouseout="hideIsFeaturedIcon">
      <span>是否精选</span>
      <b v-if="productDetail.selection && !closeIsFeatured">是</b>
      <b v-if="!productDetail.selection && !closeIsFeatured">否</b>

      <div v-if="closeIsFeatured" class="inline-block">
        <el-form :model="isFeaturedForm" ref="isFeaturedForm" :rules="isFeaturedRule">
          <el-form-item prop="isFeatured" class="margin-bottom-0">
            <el-radio-group v-model="isFeaturedForm.isFeatured">
              <el-radio v-for="item in isFeaturedList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m position-absolute" style="right: 0;top: 0;">
        <div v-if="closeIsFeatured">
          <el-button type="text" size="mini" @click="editIsFeatured('isFeaturedForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelIsFeatured">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showIsFeatured" @click="closeIsFeatured = !closeIsFeatured"></i>
      </div>

    </div>
    <div class="position-relative" @mouseover="showIsHotIcon" @mouseout="hideIsHotIcon">
      <span>是否热销</span>
      <b v-if="productDetail.hot && !closeIsHot">是</b>
      <b v-if="!productDetail.hot && !closeIsHot">否</b>

      <div v-if="closeIsHot" class="inline-block">
        <el-form :model="isHotForm" ref="isHotForm" :rules="isHotRule">
          <el-form-item prop="isHot" class="margin-bottom-0">
            <el-radio-group v-model="isHotForm.isHot">
              <el-radio v-for="item in isHotList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m position-absolute" style="right: 0;top: 0;">
        <div v-if="closeIsHot">
          <el-button type="text" size="mini" @click="editIsHot('isHotForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelIsHot">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showIsHot" @click="closeIsHot = !closeIsHot"></i>
      </div>

    </div>
    <div class="position-relative" @mouseover="showIsPromotionIcon" @mouseout="hideIsPromotionIcon">
      <span>是否特价促销</span>
      <b v-if="productDetail.promotion && !closeIsPromotion">是</b>
      <b v-if="!productDetail.promotion && !closeIsPromotion">否</b>

      <div v-if="closeIsPromotion" class="inline-block">
        <el-form :model="isPromotionForm" ref="isPromotionForm" :rules="isPromotionRule">
          <el-form-item prop="isPromotion" class="margin-bottom-0">
            <el-radio-group v-model="isPromotionForm.isPromotion">
              <el-radio v-for="item in isPromotionList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m position-absolute" style="right: 0;top: 0;">
        <div v-if="closeIsPromotion">
          <el-button type="text" size="mini" @click="editIsPromotion('isPromotionForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelIsPromotion">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showIsPromotion" @click="closeIsPromotion = !closeIsPromotion"></i>
      </div>

    </div>
  </div>
</template>

<script>
  import VFormCurrency from "@/components/v-form-currency"

  export default {
    name: "v-basic-sale",
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    data () {
      let validInteger = (rule,value,callback) => {
        const reg = /^\d+$/
        if(!reg.test(value)){
          callback(new Error('只能输入大于或等于0的正整数'))
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
        productDetail: this.data,
        showArea: false,
        closeArea: false,
        showFreight: false,
        closeFreight: false,
        showLogistics: false,
        closeLogistics: false,
        showStockQty: false,
        closeStockQty: false,
        showMaxNums: false,
        closeMaxNums: false,
        showPresentExp: false,
        closePresentExp: false,
        showIsNew: false,
        closeIsNew: false,
        showIsFeatured: false,
        closeIsFeatured: false,
        showIsHot: false,
        closeIsHot: false,
        showIsPromotion: false,
        closeIsPromotion: false,
        isNewList: [
          { label: '是',value: true },
          { label: '否',value: false }
        ],
        isFeaturedList: [
          { label: '是',value: true },
          { label: '否',value: false }
        ],
        isHotList: [
          { label: '是',value: true },
          { label: '否',value: false }
        ],
        isPromotionList: [
          { label: '是',value: true },
          { label: '否',value: false }
        ],
        areaForm: {
          area: ''
        },
        areaRule: {
          area: [{ required: true,message: '请输入销售区域',trigger: 'change' }]
        },
        freightForm: {
          freight: ''
        },
        freightRule: {
          freight: [{ required: true,validator: validFright,trigger: 'change' }]
        },
        logisticsForm: {
          logistics: ''
        },
        logisticstRule: {
          logistics: [{ required: true,message: '请输入物流说明',trigger: 'change' }]
        },
        stockQtyForm: {
          stockQty: ''
        },
        stockQtyRule: {
          stockQty: [{ required: true,validator: validInteger,trigger: 'change' }]
        },
        maxNumsForm: {
          maxNums: ''
        },
        maxNumsRule: {
          maxNums: [{ required: true,validator: validInteger,trigger: 'change' }]
        },
        presentExpForm: {
          presentExp: ''
        },
        presentExpRule: {
          presentExp: [{ required: true,validator: validInteger,trigger: 'change' }]
        },
        isNewForm: {
          isNew: ''
        },
        isNewRule: {
          isNew: [{ required: true,message: '请决定是否新品',trigger: 'change' }]
        },
        isFeaturedForm: {
          isFeatured: ''
        },
        isFeaturedRule: {
          isFeatured: [{ required: true,message: '请决定是否精选',trigger: 'change' }]
        },
        isHotForm: {
          isHot: ''
        },
        isHotRule: {
          isHot: [{ required: true,message: '请决定是否热销',trigger: 'change' }]
        },
        isPromotionForm: {
          isPromotion: ''
        },
        isPromotionRule: {
          isPromotion: [{ required: true,message: '请决定是否特价促销',trigger: 'change' }]
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
        },300)
      })
    },
    methods: {
      listFetch () {
        this.$productApi.detail(this.$route.params.id)
          .then((res) => {
            if(res){
              this.productDetail = res
              this.fetchData()
            }
          })
      },
      // 初始化数据
      fetchData () {
        this.areaForm.area = this.productDetail.salesArea
        this.freightForm.freight = this.productDetail.freight
        this.logisticsForm.logistics = this.productDetail.logisticsDescription
        this.stockQtyForm.stockQty = this.productDetail.stockNum
        this.maxNumsForm.maxNums = this.productDetail.maxPurchase
        this.presentExpForm.presentExp = this.productDetail.giftIntegral
        this.isNewForm.isNew = this.productDetail.aNew
        this.isFeaturedForm.isFeatured = this.productDetail.selection
        this.isHotForm.isHot = this.productDetail.hot
        this.isPromotionForm.isPromotion = this.productDetail.promotion
      },
      // 重新加载数据
      fetch () {
        this.$emit('reload')
        this.listFetch()
      },
      // 确定修改销售区域
      editArea (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$propertyApi.editSale(this.$route.params.id,{
              salesArea: this.areaForm.area
            })
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功修改销售区域'
                  })
                  this.cancelArea()
                }
              })
          }
        })
      },
      // 取消修改销售区域
      cancelArea () {
        this.listFetch()
        this.closeArea = !this.closeArea
      },
      // 确定修改商品运费
      editFreight (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$propertyApi.editSale(this.$route.params.id,{
              freight: this.freightForm.freight
            })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '成功修改商品运费'
                  })
                  this.cancelFreight()
                }
              })
          }
        })
      },
      // 取消修改商品运费
      cancelFreight () {
        this.listFetch()
        this.closeFreight = !this.closeFreight
      },
      // 确定修改物流说明
      editLogistics (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$propertyApi.editSale(this.$route.params.id,{
              logisticsDescription: this.logisticsForm.logistics
            })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '成功修改物流说明'
                  })
                  this.cancelLogistics()
                }
              })
          }
        })
      },
      // 取消修改物流说明
      cancelLogistics () {
        this.listFetch()
        this.closeLogistics = !this.closeLogistics
      },
      // 确定修改库存数量
      editStockQty (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$propertyApi.editSale(this.$route.params.id, {
              stockNum: this.stockQtyForm.stockQty
            })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '成功修改库存数量'
                  })
                  this.cancelStockQty()
                }
              })
          }
        })
      },
      // 取消修改库存数量
      cancelStockQty () {
        this.listFetch()
        this.closeStockQty = !this.closeStockQty
      },
      // 确定修改最大购买数量
      editMaxNums (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$propertyApi.editSale(this.$route.params.id, {
              maxPurchase: this.maxNumsForm.maxNums
            })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '成功修改最大购买数量'
                  })
                  this.cancelMaxNums()
                }
              })
          }
        })
      },
      // 取消修改最大购买数量
      cancelMaxNums () {
        this.listFetch()
        this.closeMaxNums = !this.closeMaxNums
      },
      // 确定修改赠送积分
      editPresentExp (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$propertyApi.editSale(this.$route.params.id, {
              giftIntegral: this.presentExpForm.presentExp
            })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '成功修改赠送积分'
                  })
                  this.cancelPresentExp()
                }
              })
          }
        })
      },
      // 取消修改赠送积分
      cancelPresentExp () {
        this.listFetch()
        this.closePresentExp = !this.closePresentExp
      },
      // 确定设置新品
      editIsNew (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$propertyApi.editSale(this.$route.params.id, {
              aNew: this.isNewForm.isNew
            })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '成功设置新品'
                  })
                  this.cancelIsNew()
                }
              })
          }
        })
      },
      // 取消设置新品
      cancelIsNew () {
        this.listFetch()
        this.closeIsNew = !this.closeIsNew
      },
      // 确定设置精选
      editIsFeatured (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$propertyApi.editSale(this.$route.params.id, {
              selection: this.isFeaturedForm.isFeatured
            })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '成功设置精选'
                  })
                  this.cancelIsFeatured()
                }
              })
          }
        })
      },
      // 取消设置精选
      cancelIsFeatured () {
        this.listFetch()
        this.closeIsFeatured = !this.closeIsFeatured
      },
      // 确定设置热销
      editIsHot (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$propertyApi.editSale(this.$route.params.id, {
              hot: this.isHotForm.isHot
            })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '成功设置热销'
                  })
                  this.cancelIsHot()
                }
              })
          }
        })
      },
      // 取消设置精选
      cancelIsHot () {
        this.listFetch()
        this.closeIsHot = !this.closeIsHot
      },
      // 确定设置特价促销
      editIsPromotion (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$propertyApi.editSale(this.$route.params.id, {
              promotion: this.isPromotionForm.isPromotion
            })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '成功设置特价促销'
                  })
                  this.cancelIsPromotion()
                }
              })
          }
        })
      },
      // 取消设置精选
      cancelIsPromotion () {
        this.listFetch()
        this.closeIsPromotion = !this.closeIsPromotion
      },
      showAreaIcon () {
        if(this.closeArea){
          this.hideAreaIcon()
          return false
        }
        this.showArea = true
      },
      hideAreaIcon () {
        this.showArea = false
      },
      showFreightIcon () {
        if(this.closeFreight){
          this.hideFeightIcon()
          return false
        }
        this.showFreight = true
      },
      hideFreightIcon () {
        this.showFreight = false
      },
      showLogisticsIcon () {
        if(this.closeLogistics){
          this.hideLogisticsIcon()
          return false
        }
        this.showLogistics = true
      },
      hideLogisticsIcon () {
        this.showLogistics = false
      },
      showStockQtyIcon () {
        if(this.closeStockQty){
          this.hideStockQtyIcon()
          return false
        }
        this.showStockQty = true
      },
      hideStockQtyIcon () {
        this.showStockQty = false
      },
      showMaxNumsIcon () {
        if(this.closeMaxNums){
          this.hideMaxNumsIcon()
          return false
        }
        this.showMaxNums = true
      },
      hideMaxNumsIcon () {
        this.showMaxNums = false
      },
      showPresentExpIcon () {
        if(this.closePresentExp){
          this.hidePresentExpIcon()
          return false
        }
        this.showPresentExp = true
      },
      hideFeightIcon () {
        this.showPresentExp = false
      },
      showFeightIcon () {
        if(this.closePresentExp){
          this.hidePresentExpIcon()
          return false
        }
        this.showPresentExp = true
      },
      hidePresentExpIcon () {
        this.showPresentExp = false
      },
      showIsNewIcon () {
        if(this.closeIsNew){
          this.hideIsNewIcon()
          return false
        }
        this.showIsNew = true
      },
      hideIsNewIcon () {
        this.showIsNew = false
      },
      showIsFeaturedIcon () {
        if(this.closeIsFeatured){
          this.hideIsFeaturedIcon()
          return false
        }
        this.showIsFeatured = true
      },
      hideIsFeaturedIcon () {
        this.showIsFeatured = false
      },
      showIsHotIcon () {
        if(this.closeIsHot){
          this.hideIsHotIcon()
          return false
        }
        this.showIsHot = true
      },
      hideIsHotIcon () {
        this.showIsHot = false
      },
      showIsPromotionIcon () {
        if(this.closeIsPromotion){
          this.hideIsPromotionIcon()
          return false
        }
        this.showIsPromotion = true
      },
      hideIsPromotionIcon () {
        this.showIsPromotion = false
      }
    },
    components: { VFormCurrency }
  }
</script>

