<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .cover-img{
    /deep/.el-carousel__container{
      padding-bottom: 100%;
    }
  }
  .list-del-line {
    position: relative;

    &:before {
      content: '';
      height: 1px;
      background: #aaa;
      position: absolute;
      top: 7px;
      width: 100%;
    }
  }
  .price-box{
    line-height: 50px;
  }
  .basic-info,.modified{
    span{
      margin-right: $m;
      font-size: $font-size-s;
    }
    b{
      font-weight: 400;
      font-size: $font-size-s;
    }
  }
  .uploader-btn{
    font-size: 30px;
    width: 70px;
    height: 70px;
    color: $font-light;

    /deep/ .el-button{
      width: 100%;
      height: 100%;

      .el-icon-plus{
        font-size: 24px;
      }
    }
  }
  .cover-img-radio {
    position: relative;

    /deep/.el-radio__label{
      padding-left: 0;
    }
    &+.cover-img-radio{
      margin-left: $s;
    }
    .cover-img {
      width: 70px;
      height: 70px;
      @include border-radius;
    }
    .shadow{
      width: 70px;
      height: 70px;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba($black,.7);
      @include border-radius;
    }
    .normal-set{
      width: 70px;
    }
  }
  .edit-shadow{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba($black,.7);
    z-index: 99;
  }
  .inline-block{
    vertical-align: top;
  }
  .pro-img{
    /deep/ .el-dialog__body {
      min-height: 350px;
    }
  }
</style>

<template>
  <el-row class="basic">
    <el-col span="5" class="cover-img">
      <div class="border padding position-relative" @mouseover="showEdit" @mouseout="hideEdit">
        <el-carousel height="20.83333%" indicator-position="outside">
          <el-carousel-item v-for="item in productDetail.medias" :key="item">
            <img :src="$filters.resizeImg(item,'m_fill,4_100,w_400')" />
          </el-carousel-item>
        </el-carousel>
        <div class="edit-shadow flex justify-center" v-show="isShadow">
          <i class="iconfont icon-iot-tijiaodingdan color-white font-l cursor-pointer" @click="imgShow = true"></i>
        </div>
      </div>

      <!--修改商品图片-->
      <el-dialog :visible.sync="imgShow" title="修改商品图片" class="pro-img">
        <div :data-id="productImagesId" class="padding-m">
          <div v-for="(item,index) in coverImageArr" :key="item.id" class="cover-img-radio inline-block" @mouseover="showDel(item)" @mouseout="hideDel(item)">
            <img :src="item.path" class="cover-img" />
            <div class="shadow flex justify-center" v-show="item.isShadow">
              <i class="iconfont icon-iot-shanchu color-white font-l cursor-pointer" @click="delImg(index)"></i>
            </div>
            <div class="font-s font-lighter normal-set align-center cursor-pointer" :class="{ 'color-primary': item.mainImg }" @click="setMainImg(item)">
              <i class="el-icon-success"></i>
              <span v-if="!item.mainImg">设为主图</span>
              <span v-if="item.mainImg">主图</span>
            </div>
          </div>
          <v-button-ok class="uploader-btn font-bold-700" type=" " v-model="imgInfo" icon="el-icon-plus" @click.native="openImgSelect" :class="{ 'margin-left': coverImageArr.length > 0 }"></v-button-ok>
        </div>
        <div slot="footer">
          <el-button type="primary" size="mini" @click="sureEditImgs">确定</el-button>
          <el-button size="mini" @click="cancelEditImg">取消</el-button>
        </div>
      </el-dialog>
      <v-mediapicker v-model="isShowImg" :multiple="true" @onOk="sureEditImg"></v-mediapicker>
    </el-col>

    <el-col span="18" class="margin-left position-relative">
      <h2 @mouseover="showNameIcon" @mouseout="hideNameIcon">
        <span class="font-bold-400" v-if="!closeName">{{ productDetail.name }}</span>
        <el-tag style="font-weight: 100;" type="success" size="small" v-if="productDetail.openSale">销售中</el-tag>
        <el-tag style="font-weight: 100;" type="success" size="small" v-else>未开放销售</el-tag>
        <el-tag style="font-weight: 100;" type="info" size="small" v-if="productDetail.onSale">已上架</el-tag>
        <el-tag style="font-weight: 100;" type="info" size="small" v-else>已下架</el-tag>

        <div v-if="closeName" class="inline-block">
          <el-form :model="nameForm" ref="nameForm" :rules="nameRule">
            <el-form-item prop="name" class="margin-bottom-0">
              <el-input v-model.trim="nameForm.name" placeholder="请输入商品名称" size="mini"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="float-right margin-right-m">
          <div v-if="closeName">
            <el-button type="text" size="mini" @click="editName('nameForm')">确定</el-button>
            <el-button type="text" size="mini" @click="cancelName">取消</el-button>
          </div>
          <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showName" @click="closeName = !closeName"></i>
        </div>
      </h2>
      <div class="position-relative margin-bottom" @mouseover="showSellPointIcon" @mouseout="hideSellPointIcon">
        <span class="font-s font-light" v-if="!closeSellPoint">{{ productDetail.sellPoint }}</span>

        <div v-if="closeSellPoint" class="inline-block">
          <el-form :model="sellPointForm" ref="sellPointForm" :rules="sellPointRule">
            <el-form-item prop="sellPoint" class="margin-bottom-0">
              <el-input v-model.trim="sellPointForm.sellPoint" placeholder="请输入商品简介" size="mini"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="float-right margin-right-m">
          <div v-if="closeSellPoint">
            <el-button type="text" size="mini" @click="editSellPoint('sellPointForm')">确定</el-button>
            <el-button type="text" size="mini" @click="cancelSellPoint">取消</el-button>
          </div>
          <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showSellPoint" @click="closeSellPoint = !closeSellPoint"></i>
        </div>
      </div>

      <div class="price-box padding-left padding-right bg-gray-1">
        <span>销售价格</span>
        <span class="color-red-1 margin-left font-l font-bold-500">￥{{ productDetail.price / 100 }}</span>
        <em class="font-s font-lighter list-del-line" v-if="productDetail.price < productDetail.listPrice">￥{{ productDetail.listPrice / 100 }}</em>
        <span class="margin-left" v-if="!productDetail.openSale">(未开放销售)</span>
        <v-form-popover :isShow="editPrice"
                        size="mini"
                        class="inline-block margin-left"
                        title="修改价格"
                        width="500"
                        :isClose="isPrice"
                        @onOk="sureEditPrice('priceForm')"
                        @onCancel="cancelEditPrice('priceForm')">
          <div slot="form">
            <el-form :model="priceForm" ref="priceForm" :rules="priceRule" label-width="120px">
              <el-form-item prop="price" label="店铺价格">
                <!--<el-input type="number" size="mini" placeholder="请输入店铺价格" v-model.trim.number="priceForm.price">-->
                  <!--<template slot="append">元</template>-->
                <!--</el-input>-->
                <v-form-currency prefix="" v-model="priceForm.price" @input="getPrice"></v-form-currency>
              </el-form-item>
              <el-form-item prop="listPrice" label="市场价格">
                <!--<el-input type="number" size="mini" placeholder="请输入市场价格" v-model.trim.number="priceForm.listPrice">-->
                  <!--<template slot="append">元</template>-->
                <!--</el-input>-->
                <v-form-currency prefix="" v-model="priceForm.listPrice"></v-form-currency>
              </el-form-item>
            </el-form>
          </div>
          修改价格
        </v-form-popover>
        <span class="float-right">已销售<b class="color-red-1">{{ productDetail.saleNum }}</b>台</span>
      </div>

      <div class="flex basic-info margin-top" style="align-items: start;">
        <div class="flex-item">

          <div class="margin-bottom" @mouseover="showItemCodeIcon" @mouseout="hideItemCodeIcon">
            <span>商品货号</span>
            <b class="font-bold-400" v-if="!closeItemCode">{{ productDetail.itemCode }}</b>

            <div v-if="closeItemCode" class="inline-block">
              <el-form :model="itemCodeForm" ref="itemCodeForm" :rules="itemCodeRule">
                <el-form-item prop="itemCode" class="margin-bottom-0">
                  <el-input v-model.trim="itemCodeForm.itemCode" placeholder="请输入商品简介" size="mini"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="float-right margin-right-m">
              <div v-if="closeItemCode">
                <el-button type="text" size="mini" @click="editItemCode('itemCodeForm')">确定</el-button>
                <el-button type="text" size="mini" @click="cancelItemCode">取消</el-button>
              </div>
              <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showItemCode" @click="closeItemCode = !closeItemCode"></i>
            </div>
          </div>

          <div class="margin-bottom" @mouseover="showBandIcon" @mouseout="hideBandIcon">
            <span>商品品牌</span>
            <b v-if="!closeBand">{{ productDetail.productBandDto ? productDetail.productBandDto.name : '' }}</b>

            <div v-if="closeBand" class="inline-block">
              <el-form :model="bandForm" ref="bandForm" :rules="bandRule">
                <el-form-item prop="band" class="margin-bottom-0">
                  <el-select v-model="bandForm.band" placeholder="请选择商品品牌" size="mini">
                    <el-option v-for="item in bandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="float-right margin-right-m">
              <div v-if="closeBand">
                <el-button type="text" size="mini" @click="editBand('bandForm')">确定</el-button>
                <el-button type="text" size="mini" @click="cancelBand">取消</el-button>
              </div>
              <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showBand" @click="closeBand = !closeBand"></i>
            </div>
          </div>

          <div class="margin-bottom" @mouseover="showCategoryIcon" @mouseout="hideCategoryIcon">
            <span>商品分类</span>
            <el-tag size="mini" v-for="item in categoryList" :key="item" v-if="item !== '' && !closeCategory">{{ item }}</el-tag>

            <div v-if="closeCategory" class="inline-block">
              <el-form :model="categoryForm" ref="categoryForm" :rules="categoryRule">
                <el-form-item prop="category" class="margin-bottom-0">
                  <el-select default-first-option allow-create filterable multiple multiple-limit="3" v-model="categoryForm.category" placeholder="请选择商品分类" size="mini">
                    <el-option v-for="item in categoryData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                  <p class="font-s">PS:最多只能选择三个分类</p>
                </el-form-item>
              </el-form>
            </div>
            <div class="float-right margin-right-m">
              <div v-if="closeCategory">
                <el-button type="text" size="mini" @click="editCategory('categoryForm')">确定</el-button>
                <el-button type="text" size="mini" @click="cancelCategory">取消</el-button>
              </div>
              <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showCategory" @click="closeCategory = !closeCategory"></i>
            </div>
          </div>
        </div>
        <div class="flex-item">
          <div class="margin-bottom" @mouseover="showTimingListingIcon" @mouseout="hideTimingListingIcon">
            <span>上架时间</span>
            <b v-if="productDetail.onSaleTime === 0">暂无上架时间</b>
            <b v-else>{{ $filters.formatDate(productDetail.onSaleTime) }}</b>

            <!--<div v-if="closeTimingListing" class="inline-block">-->
              <!--<el-form :model="timingListingForm" ref="timingListingForm" :rules="timingListingRule">-->
                <!--<el-form-item prop="listingTime" class="margin-bottom-0">-->
                  <!--<el-date-picker v-model="timingListingForm.listingTime" :picker-options="disabledDate" size="mini" type="datetime" placeholder="请选择上架时间"></el-date-picker>-->
                <!--</el-form-item>-->
              <!--</el-form>-->
            <!--</div>-->
            <!--<div class="float-right margin-right-m">-->
              <!--<div v-if="closeTimingListing">-->
                <!--<el-button type="text" size="mini" @click="editTimingListing('timingListingForm')">确定</el-button>-->
                <!--<el-button type="text" size="mini" @click="cancelTimingListing">取消</el-button>-->
              <!--</div>-->
              <!--<i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showTimingListing" @click="closeTimingListing = !closeTimingListing"></i>-->
            <!--</div>-->
          </div>
          <div class="margin-bottom">
            <span>设备类型</span>
            <b v-if="productDetail.deviceType === 'L'">租赁设备</b>
            <b v-if="productDetail.deviceType === 'C'">普通设备</b>
            <b v-if="productDetail.deviceType === 'I'">智能设备</b>
          </div>
          <div class="margin-bottom" @mouseover="showTagsIcon" @mouseout="hideTagsIcon">
            <span>商品标签</span>
            <el-tag size="mini" type="info" v-for="item in productDetail.productTags" :key="item" v-if="!closeTags">{{ item }}</el-tag>

            <div v-if="closeTags" class="inline-block">
              <el-form :model="tagsForm" ref="tagsForm" :rules="tagsRule">
                <el-form-item prop="tags" class="margin-bottom-0">
                  <el-select default-first-option allow-create filterable multiple v-model="tagsForm.tags" placeholder="请选择商品标签" size="mini" @change="changeTags">
                    <el-option v-for="item in tagsData" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="float-right margin-right-m">
              <div v-if="closeTags">
                <el-button type="text" size="mini" @click="editTags('tagsForm')">确定</el-button>
                <el-button type="text" size="mini" @click="cancelTags">取消</el-button>
              </div>
              <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showTags" @click="closeTags = !closeTags"></i>
            </div>
          </div>
          <div class="margin-bottom" @mouseover="showKeywordsIcon" @mouseout="hideKeywordsIcon">
            <span>商品关键字</span>
            <b v-if="productDetail.keywords === null && !closeKeywords">暂无关键字哦~</b>
            <b v-if="productDetail.keywords !== null && !closeKeywords">{{ productDetail.keywords }}</b>

            <div v-if="closeKeywords" class="inline-block">
              <el-form :model="keywordsForm" ref="keywordsForm" :rules="keywordsRule">
                <el-form-item prop="keywords" class="margin-bottom-0">
                  <el-input v-model.trim="keywordsForm.keywords" placeholder="请输入商品关键字(多个使用空格隔开)" size="mini"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="float-right margin-right-m">
              <div v-if="closeKeywords">
                <el-button type="text" size="mini" @click="editKeywords('keywordsForm')">确定</el-button>
                <el-button type="text" size="mini" @click="cancelKeywords">取消</el-button>
              </div>
              <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showKeywords" @click="closeKeywords = !closeKeywords"></i>
            </div>
          </div>
        </div>
      </div>
      <p class="modified position-absolute">
        <span>最后编辑时间</span>
        <b>{{ productDetail.modifier }} {{ $filters.formatTime(productDetail.gmtModified) }}</b>
      </p>
    </el-col>
  </el-row>
</template>

<script>
  import VMediapicker from '@/components/v-mediapicker'
  import VFormCurrency from "@/components/v-form-currency"

  export default {
    name: "v-basic",
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    data () {
      let priceValid = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入价格'))
        }else if(Number(value) <= 0){
          callback(new Error('请输入正整数的价格'))
        }else{
          callback()
        }
      }
      return {
        productDetail: this.data,
        priceForm: {
          price: 0,
          listPrice: 0
        },
        priceRule: {
          price: [{ required: true,validator: priceValid,trigger: 'change' }],
          listPrice: [{ required: true,validator: priceValid,trigger: 'change' }]
        },
        editPrice: false,
        isPrice: false,
        openSaleText: '',
        onSaleText: '',
        categoryList: [],
        bandList: [],
        tagsData: [],
        closeName: false,
        closeSellPoint: false,
        closeItemCode: false,
        closeBand: false,
        closeCategory: false,
        closeTags: false,
        closeKeywords: false,
        closeTimingListing: false,
        showName: false,
        showSellPoint: false,
        showItemCode: false,
        showBand: false,
        showCategory: false,
        showTags: false,
        showKeywords: false,
        showTimingListing: false,
        nameForm: {
          name: ''
        },
        sellPointForm: {
          sellPoint: ''
        },
        itemCodeForm: {
          itemCode: ''
        },
        bandForm: {
          band: ''
        },
        categoryForm: {
          category: []
        },
        tagsForm: {
          tags: [],
          productTags: ''
        },
        keywordsForm: {
          keywords: ''
        },
        timingListingForm: {
          timingListing: ''
        },
        nameRule: {
          name: [{ required: true,message: '请输入商品名称',trigger: 'change' }]
        },
        sellPointRule: {
          sellPoint: [{ required: true,message: '请输入商品简介',trigger: 'change' }]
        },
        itemCodeRule: {
          itemCode: [{ required: true,message: '请输入商品货号',trigger: 'change' }]
        },
        bandRule: {
          band: [{ required: true,message: '请选择商品品牌',trigger: 'change' }]
        },
        categoryRule: {
          category: [{ type: 'array',required: true,message: '请选择商品分类',trigger: 'change' }]
        },
        tagsRule: {
          tags: [{ type: 'array',required: true,message: '请选择商品标签',trigger: 'change' }]
        },
        keywordsRule: {
          keywords: [{ required: true,message: '请选择商品关键字',trigger: 'change' }]
        },
        timingListingRule: {
          timingListing: [{ type: 'datetime',required: true,message: '请选择上架时间',trigger: 'change' }]
        },
        disabledDate: {
          disabledDate (time) {
            return time.getTime() < Date.now()
          }
        },
        isShowImg: false,
        productImagesId: '',
        coverImageArr: [],
        productImagesIdPrimary: '',
        imgInfo: '',
        imgShow: false,
        isShadow: false,
      }
    },
    watch: {
      data (val) {
        this.productDetail = val
      }
    },
    created () {
      this.priceForm.price = 60
    },
    mounted () {
        this.$nextTick(() => {
        setTimeout(() => {
          this.fetchData()
          this.$bus.on('sale-status',this.changeVal)
        },300)
      })
      this.getBandData()
      this.getCategoryData()
      this.getTags()
    },
    methods: {
      changeVal (data) {
        this.productDetail.openSale = data
      },
      listFetch () {
        this.$productApi.detail(this.$route.params.id)
          .then((res) => {
            if(res){
              this.productDetail = res
              this.fetchData()
            }
          })
      },
      fetchData () {
        this.isPrice = true
        this.nameForm.name = this.productDetail.name
        this.priceForm.price = this.productDetail.price
        this.$set(this.priceForm,'price',this.productDetail.price)
        // console.log(this.priceForm)
        this.priceForm.listPrice = this.productDetail.listPrice
        this.$set(this.priceForm,'listPrice',this.productDetail.listPrice)
        this.sellPointForm.sellPoint = this.productDetail.sellPoint
        this.itemCodeForm.itemCode = this.productDetail.itemCode
        if(this.productDetail.productBandDto !== null){
          this.bandForm.band = this.productDetail.productBandDto.id
        }
        if(this.productDetail.productCategoryDto1 !== null){
          this.categoryForm.category = [this.productDetail.productCategoryDto1.id]
        }else if(this.productDetail.productCategoryDto2 !== null || this.productDetail.productCategoryDto2 !== ''){
          this.categoryForm.category = [this.productDetail.productCategoryDto1.id,this.productDetail.productCategoryDto2.id]
        }else if(this.productDetail.productCategoryDto2 !== null || this.productDetail.productCategoryDto2 !== ''){
          this.categoryForm.category = [this.productDetail.productCategoryDto1.id,this.productDetail.productCategoryDto2.id,this.productDetail.productCategoryDto3.id]
        }
        this.tagsForm.tags = this.productDetail.productTags
        this.keywordsForm.keywords = this.productDetail.keywords
        if(this.productDetail.productCategoryDto1 !== null){
          this.categoryList.push(this.productDetail.productCategoryDto1.name)

          if(this.productDetail.productCategoryDto2 !== null) {
            this.categoryList.push(this.productDetail.productCategoryDto2.name)

            if(this.productDetail.productCategoryDto3 !== null) {
              this.categoryList.push(this.productDetail.productCategoryDto3.name)
            }else{
              this.categoryList = []
              this.categoryList.push(this.productDetail.productCategoryDto1.name,this.productDetail.productCategoryDto2.name)
            }
          }else{
            this.categoryList = []
            this.categoryList.push(this.productDetail.productCategoryDto1.name)
          }
        }
        if(this.categoryList.length > 0){
          let arr = new Set(this.categoryList)
          this.categoryList = Array.from(arr)
        }
        if(this.productDetail.medias && this.productDetail.medias.length > 0){
          this.coverImageArr = []
          this.productDetail.medias.forEach((value,index) => {
            this.coverImageArr.push({
              path: value,
              id: this.productDetail.mediaIds[index],
              isShadow: false,
              mainImg: false
            })
          })
          this.coverImageArr.forEach((value) => {
            if(value.id === this.productDetail.primaryMediaId){
              value.mainImg = true
            }
          })
        }
      },
      // 获取品牌列表数据
      getBandData () {
        this.$proBrandApi.page({
          page_no: 1,
          page_size: 100
        })
          .then((res) => {
            if(res){
              this.bandList = res.fileList
            }
          })
      },
      // 获取品牌列表数据
      getCategoryData () {
        this.$proCategoryApi.page({
          page_no: 1,
          page_size: 100
        })
          .then((res) => {
            if(res){
              this.categoryData = res.fileList
            }
          })
      },
      // 获取商品标签列表数据
      getTags () {
        this.$productApi.getTags()
          .then((res) => {
            if(res){
              this.tagsData = res
            }
          })
      },
      // 选择商品标签
      changeTags (val) {
        if (val.length === 0) {
          this.tagsForm.productTags = ''
        }else{
          this.tagsForm.productTags = val.join(';')
        }
      },
      // 修改价格
      sureEditPrice (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$productApi.editPrice(this.$route.params.id,{
              price: Number(this.priceForm.price),
              list_price: Number(this.priceForm.listPrice)
            })
              .then((res) => {
                if(res){
                  this.listFetch()
                  this.isPrice = !this.isPrice
                  this.$message({
                    type: 'success',
                    message: '成功修改价格'
                  })
                }
              })
          }
        })
      },
      // 取消修改价格
      cancelEditPrice () {
        this.fetchData()
      },
      // 成功修改商品名称
      editName (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$propertyApi.editBasic(this.$route.params.id,{
              name: this.nameForm.name
            })
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功修改商品名称'
                  })
                  this.cancelName()
                }
              })
          }
        })
      },
      // 取消修改商品名称
      cancelName () {
        this.listFetch()
        this.closeName = !this.closeName
      },
      // 成功修改商品简介
      editSellPoint (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$propertyApi.editBasic(this.$route.params.id,{
              sellPoint: this.sellPointForm.sellPoint
            })
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功修改商品简介'
                  })
                  this.cancelSellPoint()
                }
              })
          }
        })
      },
      // 取消修改商品简介
      cancelSellPoint () {
        this.listFetch()
        this.closeSellPoint = !this.closeSellPoint
      },
      // 成功修改商品货号
      editItemCode (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$propertyApi.editBasic(this.$route.params.id,{
              itemCode: this.itemCodeForm.itemCode
            })
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功修改商品货号'
                  })
                  this.cancelItemCode()
                }
              })
          }
        })
      },
      // 取消修改商品货号
      cancelItemCode () {
        this.listFetch()
        this.closeItemCode = !this.closeItemCode
      },
      // 成功修改商品品牌
      editBand (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$propertyApi.editBasic(this.$route.params.id,{
              bandId: this.bandForm.band
            })
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功修改商品品牌'
                  })
                  this.cancelBand()
                }
              })
          }
        })
      },
      // 取消修改商品品牌
      cancelBand () {
        this.listFetch()
        this.closeBand = !this.closeBand
      },
      // 确定修改商品分类
      editCategory (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$propertyApi.editBasic(this.$route.params.id,{
              category1: this.categoryForm.category.length > 0 ? this.categoryForm.category[0] : '',
              category2: this.categoryForm.category.length > 1 ? this.categoryForm.category[1] : '',
              category3: this.categoryForm.category.length > 2 ? this.categoryForm.category[2] : ''
            })
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功修改商品分类'
                  })
                  this.cancelCategory()
                }
              })
          }
        })
      },
      // 取消修改商品分类
      cancelCategory () {
        this.listFetch()
        this.closeCategory = !this.closeCategory
      },
      // 确定修改商品标签
      editTags (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$propertyApi.editBasic(this.$route.params.id,{
              productTags: this.tagsForm.productTags
            })
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功修改商品标签'
                  })
                  this.cancelTags()
                }
              })
          }
        })
      },
      // 取消修改商品标签
      cancelTags () {
        this.listFetch()
        this.closeTags = !this.closeTags
      },
      // 确定修改商品关键字
      editKeywords (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$propertyApi.editBasic(this.$route.params.id,{
              keywords: this.keywordsForm.keywords
            })
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功修改商品关键字'
                  })
                  this.cancelKeywords()
                }
              })
          }
        })
      },
      // 取消修改商品关键字
      cancelKeywords () {
        this.listFetch()
        this.closeKeywords = !this.closeKeywords
      },
      // 确定修改上架时间
      editTimingListing (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$propertyApi.editBasic(this.$route.params.id,{
              listingTime: this.timingListingForm.listingTime
            })
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功修改上架时间'
                  })
                  this.cancelTimingListing()
                }
              })
          }
        })
      },
      // 取消修改上架时间
      cancelTimingListing () {
        this.listFetch()
        this.closeTimingListing = !this.closeTimingListing
      },
      showNameIcon () {
        if(this.closeName){
          this.hideNameIcon()
          return false
        }
        this.showName = true
      },
      hideNameIcon () {
        this.showName = false
      },
      showSellPointIcon () {
        if(this.closeSellPoint){
          this.hideSellPointIcon()
          return false
        }
        this.showSellPoint = true
      },
      hideSellPointIcon () {
        this.showSellPoint = false
      },
      showItemCodeIcon () {
        if(this.closeItemCode){
          this.hideItemCodeIcon()
          return false
        }
        this.showItemCode = true
      },
      hideItemCodeIcon () {
        this.showItemCode = false
      },
      showBandIcon () {
        if(this.closeBand){
          this.hideBandIcon()
          return false
        }
        this.showBand = true
      },
      hideBandIcon () {
        this.showBand = false
      },
      showCategoryIcon () {
        if(this.closeCategory){
          this.hideCategoryIcon()
          return false
        }
        this.showCategory = true
      },
      hideCategoryIcon () {
        this.showCategory = false
      },
      showTagsIcon () {
        if(this.closeTags){
          this.hideTagsIcon()
          return false
        }
        this.showTags = true
      },
      hideTagsIcon () {
        this.showTags = false
      },
      showKeywordsIcon () {
        if(this.closeKeywords){
          this.hideKeywordsIcon()
          return false
        }
        this.showKeywords = true
      },
      hideKeywordsIcon () {
        this.showKeywords = false
      },
      showTimingListingIcon () {
        if(this.closeTimingListing){
          this.hideTimingListingIcon()
          return false
        }
        this.showTimingListing = true
      },
      hideTimingListingIcon () {
        this.showTimingListing = false
      },
      // 选择图片
      sureEditImg (data) {
        let arr = []
        data.forEach((value,index) => {
          this.coverImageArr.push({
            id: value.id,
            path: value.path,
            isShadow: false,
            mainImg: false,
          })
          arr.push(value.id)
          this.productImagesId = arr.join(';')
        })
        let i = 0
        this.coverImageArr.forEach((value) => {
          if(value.mainImg) {
            i++
          }
        })
        if(i === 0) {
          this.coverImageArr[0].mainImg = true
          this.productImagesIdPrimary = this.coverImageArr[0].id
        }
      },
      // 展示图片遮罩
      showDel(data){
        data.isShadow = true
      },
      // 隐藏图片遮罩
      hideDel(data){
        data.isShadow = false
      },
      // 删除图片
      delImg(index){
        this.coverImageArr.splice(index,1)
      },
      // 设置主图
      setMainImg(data){
        this.coverImageArr.forEach((value) => {
          value.mainImg = false
        })
        this.productImagesIdPrimary = data.id
        data.mainImg = true
      },
      // 打开图片选择器
      openImgSelect () {
        if(this.coverImageArr.length >= 9) {
          this.imgInfo = '最多只能上传9张图片哦'
          return false
        }
        this.isShowImg = true
      },
      // 显示编辑图片的图标
      showEdit () {
        this.isShadow = true
      },
      // 隐藏编辑图片的图标
      hideEdit () {
        this.isShadow = false
      },
      // 确定修改图片
      sureEditImgs () {
        let arr = []
        let imgs = ''
        let primaryImage = ''
        this.coverImageArr.forEach((value) => {
          arr.push(value.id)
          if(value.mainImg){
            primaryImage = value.id
          }
        })
        imgs = arr.join(';')
        this.$productApi.editProImg(this.$route.params.id,{
          images: imgs,
          primaryImage: primaryImage
        })
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.cancelEditImg()
            }
          })
      },
      // 取消修改图片
      cancelEditImg () {
        this.listFetch()
        this.imgShow = false
      },
      getPrice (data) {
        console.log(data)
      }
    },
    components: { VMediapicker,VFormCurrency }
  }
</script>

