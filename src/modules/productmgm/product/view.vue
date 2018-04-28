<style scoped lang="scss" type="text/sisShowOncss">
  @import "~variables";
</style>
<template>
  <v-app>
    <div slot="header-actions">
      <el-button size="mini" @click="fetchData">刷新</el-button>
      <v-timing-listing :is-show="isShowTimingOn"
                        :entity-id="entityId"
                        placement="bottom"
                        :is-close="isOnClose"
                        @onOk="fetchData"></v-timing-listing>
      <v-timing-delisting :is-show="isShowTimingUp"
                          :entity-id="entityId"
                          placement="bottom"
                          :is-close="isUpClose"
                          @onOk="fetchData"></v-timing-delisting>
      <v-listing :is-show="isShowOn"
                 :entity-id="entityId"
                 placement="bottom"
                 v-if="!productDetail.onSale"
                 @onOk="fetchData"></v-listing>
      <v-delisting :is-show="isShowUp"
                   :entity-id="entityId"
                   placement="bottom"
                   v-else
                   @onOk="fetchData"></v-delisting>
      <v-delete :is-show="isShowDel"
                :entity-id="entityId"
                placement="bottom"
                @onOk="fetchData"></v-delete>
    </div>

    <!--基本信息-->
    <div class="product-main padding-top-m" v-loading.fullscreen="detailLoading" element-loading-text="努力加载中...">
      <v-basic :data="productDetail"></v-basic>

      <el-tabs v-model="productTabVal" class="margin-top-m" @tab-click="selectTabs(productTabVal)">
        <el-tab-pane v-for="item in productTabData" :key="item.value" :label="item.label" :name="item.value"></el-tab-pane>
      </el-tabs>

      <!--销售属性-->
      <div class="market-attr" ref="sx">
        <v-sale-attr :data="productDetail"></v-sale-attr>
      </div>

      <!--商品参数-->
      <div class="product-params margin-top" ref="cs">
        <v-product-params :data="productDetail"></v-product-params>
      </div>

      <!--商品规格-->
      <div class="product-spec margin-top" ref="gg">
        <v-product-spec :data="productDetail"></v-product-spec>
      </div>

      <!--商品配件-->
      <div class="product-parts margin-top" ref="pj">
        <v-product-parts :data="productDetail"></v-product-parts>
      </div>

      <!--商品详情-->
      <div class="product-description margin-top" ref="xq">
        <v-product-description :data="productDetail"></v-product-description>
      </div>

      <!--包装售后-->
      <div class="after-sale margin-top" ref="bz">
        <v-after-sale :data="productDetail"></v-after-sale>
      </div>
    </div>

  </v-app>
</template>

<script>
  // 模块
  import VBasic from './view-components/v-basic'
  import VSaleAttr from './view-components/v-sale-attr'
  import VProductParams from './view-components/v-product-params'
  import VProductSpec from './view-components/v-product-spec'
  import VProductParts from './view-components/v-product-parts'
  import VProductDescription from './view-components/v-product-description'
  import VAfterSale from './view-components/v-after-sale'
  // 操作
  import VTimingListing from './public-components/v-timing-listing'
  import VTimingDelisting from './public-components/v-timing-delisting'
  import VListing from './public-components/v-listing'
  import VDelisting from './public-components/v-delisting'
  import VDelete from './public-components/v-delete'

  export default {
    name: "view",
    data () {
      return {
        productDetail: {},
        productTabVal: 'sx',
        productTabData: [
          {
            label: '销售属性',
            value: 'sx'
          },
          {
            label: '商品参数',
            value: 'cs'
          },
          {
            label: '商品规格',
            value: 'gg'
          },
          {
            label: '商品配件',
            value: 'pj'
          },
          {
            label: '商品详情',
            value: 'xq'
          },
          {
            label: '包装售后',
            value: 'bz'
          }
        ],
        isShowTimingOn: false,
        isShowTimingUp: false,
        isShowOn: false,
        isShowUp: false,
        isShowDel: false,
        isOnClose: false,
        isUpClose: false,
        i: 0,
        timer: null,
        detailLoading: false
      }
    },
    created () {
      this.fetchData()
      //   // this.$nextTick(() => {
      //     let userAgent = navigator.userAgent
      //     // if (userAgent.indexOf('Chrome') > -1){
      //     //   scrollTop = document.documentElement.scrollTop
      //     // }else if(userAgent.indexOf('Firefox') > -1){
      //     //   scrollTop = document.body.scrollTop
      //     // }
      //     window.addEventListener('scroll',function(){
      //       let scrollTop = document.documentElement.scrollTop
      //       console.log(scrollTop)
      //       if (scrollTop >= 0 && scrollTop <= 450) {
      //         this.productTabVal = 'sx'
      //       } else if (scrollTop >= 800 && scrollTop <= 950) {
      //         this.productTabVal = 'cs'
      //       } else if (scrollTop >= 1200 && scrollTop <= 1350) {
      //         this.productTabVal = 'gg'
      //       } else if (scrollTop >= 1650 && scrollTop <= 1800) {
      //         this.productTabVal = 'pj'
      //       } else if (scrollTop >= 2000 && scrollTop <= 2250) {
      //         this.productTabVal = 'xq'
      //       }
      //       console.log(this.productTabVal)
      //     })
      //   // })
    },
    computed: {
      entityId () {
        return this.$route.params.id
      }
    },
    methods: {
      // 初始化数据
      fetchData () {
        this.detailLoading = true
        this.$productApi.detail(this.entityId)
          .then((res) => {
            if(res){
              this.productDetail = res
              setTimeout(() => {
                this.detailLoading = false
              },600)
            }
          })
          .catch((err) => {
            if(err){
              this.detailLoading = false
            }
          })
      },
      // 获取数据
      getVal (data) {
        this.productDetail = data
      },
      // 滚动页面
      count (step) {
        this.i = this.i + 15
        if(this.i >= step){
          this.i = 0
          clearTimeout(this.timer)
          return false
        }
        document.body.scrollTop = this.i
        document.documentElement.scrollTop = this.i
        this.timer = setTimeout(() => {
          this.count(step)
        },1)
      },
      // 选择tabs
      selectTabs (val) {
        let titleHeight = document.getElementsByClassName('smart-title')[0].offsetHeight
        let offsetTop = this.$refs[val].offsetTop - titleHeight
        this.count(offsetTop)
      },
    },
    components: {
      VBasic,
      VSaleAttr,
      VProductParams,
      VProductSpec,
      VProductParts,
      VProductDescription,
      VAfterSale,
      VTimingListing,
      VTimingDelisting,
      VListing,
      VDelisting,
      VDelete
    }
  }
</script>
