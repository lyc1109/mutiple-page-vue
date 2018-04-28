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
  .basic-attr{
    .el-col{
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
  }
  .inline-block{
    vertical-align: initial;
  }
  .popover-datetime{
    width: 100%;
  }
  .margin-bottom-0{
    margin-bottom: 0;
  }
</style>
<template>
  <div>
    <h3 class="smart-title padding-right">
      销售属性
      <span v-if="!productDetail.openSale" class="font-lighter">(未开放销售)</span>
      <div class="float-right">
        <v-confirm-btn :isConfirm="isCloseSale" type=" " v-if="productDetail.openSale" value="确定关闭销售？" :disabled="disabled" @sure="sureCloseSale">关闭销售</v-confirm-btn>
        <v-confirm-btn :isConfirm="isOpenSale" type=" " value="确定开启销售？" :disabled="disabled" @sure="sureOpenSale" v-else>开启销售</v-confirm-btn>
        <!--<el-button size="small">编辑</el-button>-->
      </div>
    </h3>
    <el-row class="border padding-l basic-attr">
      <div>
        <el-col span="12">
          <v-basic-sale :data="productDetail"></v-basic-sale>
        </el-col>

        <el-col span="12">

          <div class="trial">
            <h4 class="border-bottom">
              商品试用
              <!--<v-confirm-btn :is-confirm="isCloseTrial"-->
              <!--value="确定关闭商品试用？"-->
              <!--class="float-right"-->
              <!--type="text"-->
              <!--size="mini"-->
              <!--@sure="sureCloseTrial"-->
              <!--v-if="productDetail.supportTrial">关闭试用</v-confirm-btn>-->
            </h4>
            <!--<div class="padding" v-if="productDetail.supportTrial">-->
            <!--<div><span>预付款</span><b>{{ $filters.formatCurrency(productDetail.prepaidAmount / 100) }}</b></div>-->
            <!--<div><span>试用天数</span><b>{{ productDetail.trialDays }}天</b></div>-->
            <!--<div><span>逾期策略</span><b>{{ productDetail.overdueStrategy }}</b></div>-->
            <!--</div>-->
            <div class="padding-top padding-bottom">
              <p class="font-s">暂不支持商品试用
                <!--<v-open-trial :data="productDetail" @cancel="listFetch"></v-open-trial>-->
              </p>
            </div>
          </div>

          <div class="promotion">
            <h4 class="border-bottom">
              商品促销
              <div class="float-right">
                <el-button type="text" size="mini" @click="openProHistory">历史促销</el-button>
                <v-save-promotion :data="productDetail" value="编辑" @cancel="listFetch" v-if="productDetail.productPromotionDto"></v-save-promotion>
              </div>
            </h4>
            <div class="padding" v-if="productDetail.productPromotionDto">
              <div><span>促销价格</span><b>{{ productDetail.productPromotionDto ? $filters.formatCurrency(productDetail.productPromotionDto.promotionPrice / 100) : '' }}</b></div>
              <div><span>促销日期</span><b>{{ productDetail.productPromotionDto ? $filters.formatTime(productDetail.productPromotionDto.promotionStart) : '' }} ~ {{ productDetail.productPromotionDto ? $filters.formatTime(productDetail.productPromotionDto.promotionEnd) : '' }}</b></div>
            </div>
            <div class="padding-top padding-bottom" v-else>
              <p class="font-s">暂未设置商品促销信息，
                <v-save-promotion title="开启" :data="productDetail" value="点击这里开启" @cancel="listFetch"></v-save-promotion>
              </p>
            </div>
          </div>

          <div class="present">
            <h4 class="border-bottom">
              促销赠品
              <div class="float-right">
                <el-button type="text" size="mini" @click="addPresent">添加</el-button>
              </div>
            </h4>
            <div class="padding-top padding-bottom">
              <div v-for="(item,index) in giftData" :key="item.name" class="position-relative float-left width-100" v-if="giftData.length > 0">
                <b class="inline-block" style="width: 80%;">{{ index + 1 }}.{{ item.giftName }}</b>
                <div style="right: 0;top: 0;" class="position-absolute">
                  <i class="font-s font-lighter num margin-right">X{{ item.giftAmount }}</i>
                  <v-confirm-btn :isConfirm="item.presentDialogs"
                                 value="确定删除此赠品？"
                                 width="200"
                                 type="text"
                                 size="mini"
                                 class="float-right"
                                 style="margin: 0;"
                                 @sure="sureDelPresent(item.id)">删除</v-confirm-btn>
                </div>
              </div>
              <div v-if="giftData.length === 0">
                <p class="font-s">暂未有任何赠品</p>
              </div>
            </div>
          </div>
        </el-col>
      </div>

      <!--历史促销-->
      <v-table-dialog :isShowDialog="promotionDialog"
                      title="查看历史促销"
                      :data="promotionData"
                      :isRadio="isRadio"
                      :pageUrl="promotionUrl"
                      :selectable="selectable"
                      :params="promotionParams"
                      :pageDatas="promotionPage"
                      :isToggle="isToggle"
                      :isList="isList"
                      :isShowFilter="isShowFilter"
                      :isConfirmDialog="isConfirmDialog"
                      :searchs="promotionSearch"
                      cancelText="关闭"
                      @getData="getProData"
                      @toggle="cancelPro">
        <el-table-column prop="promotionStart" label="促销时间" min-width="150">
          <template slot-scope="scope">
            <span>{{ `${$filters.formatTime(scope.row.promotionStart)} ~ ${$filters.formatTime(scope.row.promotionEnd)}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="promotionPrice" label="促销价格">
          <template slot-scope="scope">
            <span>{{ $filters.formatCurrency(scope.row.promotionPrice) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="saleNum" label="成交量"></el-table-column>
      </v-table-dialog>

      <!--添加赠品-->
      <v-table-dialog :isShowDialog="presentDialog"
                      title="添加赠品"
                      :data="presentData"
                      :isRadio="isRadio"
                      :pageUrl="presentUrl"
                      :params="presentParams"
                      :pageDatas="presentPage"
                      :searchs="presentSearch"
                      :isToggle="isToggle"
                      :errMsg="errMsg"
                      :isList="isList"
                      @sure="sureSelectPre"
                      @cancel="cancelSelectPre"
                      @getData="getPreData"
                      class="form-dialog"
                      @selectPro="selectGift"
                      @toggle="toggleGift" :isPage="false">
        <el-table-column prop="name" label="赠品名称"></el-table-column>
        <el-table-column prop="giftAmount" label="赠品数量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.giftAmount" :value="1" :step="1" :min="1" size="mini" @change="changePresentNums($event,scope.$index,scope.row)"></el-input-number>
          </template>
        </el-table-column>
      </v-table-dialog>
    </el-row>
  </div>
</template>

<script>
  import VBasicSale from './sale-attr/v-basic-sale'
  import VSavePromotion from './../public-components/promotion/v-save-promotion'
  import VOpenTrial from './../public-components/trial/v-open-trial'

  export default {
    components: { VSavePromotion, VOpenTrial, VBasicSale },
    name: "v-sale-attr",
    props: {
      data: {
        type: Object,
        default: {}
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
      return {
        productDetail: this.data,
        presentDialog: false,
        presentData: [],
        isRadio: false,
        isPresentPage: false,
        isToggle: false,
        presentSearch: '',
        promotionDialog: false,
        promotionData: [],
        selectable: false,
        promotionParams: {},
        promotionPage: {
          curPage: 1,
          pageSize: 5,
          total: 0,
          first: 1,
          last: 5
        },
        promotionSearch: '',
        presentPage: {
          curPage: 1,
          pageSize: 5,
          total: 0,
          first: 1,
          last: 5
        },
        giftData: [],
        isShowFilter: false,
        isConfirmDialog: false,
        errMsg: '',
        disabled: false,
        isCloseSale: false,
        isOpenSale: false,
        promotionDataBak: [],
        presentDataBak: [],
        giftList: [],
        selectData: [],
        excludeId: '',
        isList: false
      }
    },
    computed: {
      promotionUrl () {
        return `/web/promotion/${this.$route.params.id}`
      },
      promotionParams () {
        return {
          page_no: this.promotionPage.curPage,
          page_size: this.promotionPage.pageSize,
          q: this.promotionSearch
        }
      },
      presentUrl () {
        return `/pms/product`
      },
      presentParams () {
        return {
          page_no: this.presentPage.curPage,
          page_size: this.presentPage.pageSize,
          q: this.presentSearch,
          product_type: 'ZP',
          exclude_id: this.excludeId
        }
      }
    },
    watch: {
      data (val) {
        this.productDetail = val
      },
      promotionData (val) {
        console.log(val)
      },
      selectData: {
        handler (val,oldVal) {
          for(let i = 0;i < val.length;i++){
            if(oldVal[i] !== val[i]){
              console.log(val[i])
            }
          }
        },
        deep: true
      },
      presentDataBak (val) {
        if (val.length > 0) {
          this.presentData = val
        }
      }
    },
    created () {
      this.getGiftData()
    },
    methods: {
      listFetch () {
        this.$productApi.detail(this.$route.params.id)
          .then((res) => {
            if(res){
              this.productDetail = res
              this.$bus.emit('sale-status',this.productDetail.openSale)
            }
          })
      },
      // 获取赠品数据
      getGiftData () {
        this.$proGiftApi.page(this.$route.params.id)
          .then((res) => {
            if(res){
              this.giftData = res
              this.giftData.forEach((value) => {
                value.presentDialogs = false
              })
            }
          })
      },
      // 获取促销商品数据
      getPreData (data) {
        data.forEach((value) => {
          this.presentDataBak.push({
            giftId: value.id,
            name: value.name,
            giftAmount: 1
          })
        })
      },
      // 打开商品促销弹出框
      addPresent () {
        let arr = []
        setTimeout(() => {
          for (let i of this.presentData) {
            for (let o of this.giftData) {
              console.log(`${i.giftId} + ${o.giftId}`)
              if(o.giftId === i.giftId){
                arr.push(o.giftId)
                this.presentParams.exclude_id = arr.join(';')
              }
            }
          }
          this.presentData = []
          this.$productApi.page(this.presentParams)
            .then((res) => {
              if (res) {
                res.fileList.forEach((value) => {
                  this.presentData.push({
                    giftId: value.id,
                    name: value.name,
                    giftAmount: 1
                  })
                })
              }
            })
        },400)
        this.presentDialog = true
      },
      // 确定删除促销赠品
      sureDelPresent (id) {
        this.$proGiftApi.del(id)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getGiftData()
            }
          })
      },
      // 修改赠品数量
      changePresentNums (val,index,data) {
        if(this.giftList.length > 0){
          this.giftList.forEach((value) => {
            if(value.giftId === data.id && value.giftNum !== ''){
              value.giftNum = val
            }
          })
        }
      },
      // 确定添加赠品
      sureSelectPre (val) {
        if(val.length === 0){
          this.errMsg = '请至少选择一个赠品'
          return false
        }
        this.$proGiftApi.relate(this.$route.params.id,this.giftList)
          .then((res) => {
            if(res){
              this.errMsg = ''
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.getGiftData()
              this.presentDialog = false
            }
          })
      },
      // 取消添加赠品
      cancelSelectPre () {
        this.errMsg = ''
        this.giftList = []
        this.presentDialog = false
      },
      // 关闭促销历史弹出框
      cancelPro (val) {
        return val ? this.promotionDialog = true : this.promotionDialog = false
      },
      // 打开历史促销弹出框
      openProHistory () {
        this.promotionData = this.promotionDataBak
        this.promotionDialog = true
      },
      // 修改促销表格数据类型
      getProData (data) {
        this.promotionDataBak = data
        data.forEach((value) => {
          value.created = this.$filters.formatTime(value.created)
          value.price = this.$filters.formatCurrency(value.price)
        })
      },
      // 确定关闭销售
      sureCloseSale () {
        this.$productApi.closeSale(this.$route.params.id)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '成功关闭销售'
              })
              this.listFetch()
            }
          })
      },
      // 确定开启销售
      sureOpenSale () {
        this.$productApi.openSale(this.$route.params.id)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '成功开启销售'
              })
              this.listFetch()
            }
          })
      },

      // 确定关闭商品试用
      sureCloseTrial () {
        this.$productApi.closeTrial(this.$route.params.id)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '成功关闭商品试用'
              })
              this.listFetch()
            }
          })
      },
      // 选择赠品
      selectGift (data) {
        this.selectData = data
        this.giftList = []
        data.forEach((value) => {
          this.giftList.push({
            giftId: value.giftId,
            giftNum: value.giftAmount
          })
        })
      },
      // 控制添加赠品弹框的显示隐藏
      toggleGift (data) {
        return data ? this.presentDialog = true : this.presentDialog = false
      }
    }
  }
</script>


