<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .el-select{
    width: 17%;
  }
  .show-list{
    /deep/ .show-page{
      top: 6.8px;
    }
  }
</style>
<template>
  <v-app>
    <div slot="header-title">商品管理</div>
    <div slot="header-actions">
      <!--<el-button size="mini">刷新</el-button>-->
      <!--<router-link to="/product/create">-->
      <el-button type="primary" size="mini" @click="add">发布商品</el-button>
      <!--</router-link>-->
    </div>

    <v-datagrid :params="params"
                :data="listData"
                :pageDatas="productPage"
                :selectable="selectable"
                :url="listUrl"
                :searchs="search"
                :showRefreshBtn="showRefreshBtn"
                :is-showLoading="proLoading"
                @getData="fetchData" class="show-list">
      <div slot="filter">
        <div class="product-filter">
          <el-select v-model="productBand" filterable size="small" placeholder="请选择品牌" @change="changeBrand">
            <el-option v-for="item in bandList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="productCategory" filterable size="small" placeholder="请选择分类" @change="changeCategory">
            <el-option v-for="item in categoryList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="productStatus" filterable size="small" placeholder="请选择状态" @change="changeStatus">
            <el-option v-for="item in statusList" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <el-select v-model="productType" filterable size="small" placeholder="请选择商品类型" @change="changeProType">
            <el-option v-for="item in typeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <el-select v-model="deviceType" filterable size="small" placeholder="请选择设备类型" @change="changeProDevice">
            <el-option v-for="item in deviceTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <!--<el-select class="float-right" v-model="proSort">-->
            <!--<el-option v-for="item in sortList" :label="item.label" :value="item.value" :key="item.value"></el-option>-->
          <!--</el-select>-->
        </div>
      </div>
      <el-table-column prop="statusText" label="状态" width="70"></el-table-column>
      <el-table-column prop="productTypeText" label="类型" width="100"></el-table-column>
      <el-table-column prop="name" label="商品名称" min-width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detail(scope.row.id)">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="itemCode" label="商品货号"></el-table-column>
      <el-table-column prop="productBandDto" label="商品品牌">
        <template slot-scope="scope">
          <span>{{ JSON.stringify(scope.row.productBandDto) === '{}' || scope.row.productBandDto === null ? '' : scope.row.productBandDto.name }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detail(scope.row.id)">查看</el-button>
          <v-listing :is-show="isShowOn"
                     :entity-id="entityId"
                     type="text"
                     placement="top"
                     v-if="!scope.row.onSale"
                     @click.native="getId(scope.row.id)"
                     @onOk="listFetch"></v-listing>
          <v-delisting :is-show="isShowUp"
                       :entity-id="entityId"
                       type="text"
                       placement="top"
                       v-else
                       @click.native="getId(scope.row.id)"
                       @onOk="listFetch"></v-delisting>
          <v-delete :is-show="isShowDel"
                    :entity-id="entityId"
                    type="text"
                    placement="top"
                    @click.native="getId(scope.row.id)"
                    @onOk="listFetch"></v-delete>
        </template>
      </el-table-column>
    </v-datagrid>
  </v-app>
</template>

<script>
  import VListing from './public-components/v-listing'
  import VDelisting from './public-components/v-delisting'
  import VDelete from './public-components/v-delete'

  export default {
    name: "product-list",
    data () {
      return {
        selectable: false,
        showRefreshBtn: false,
        listData: [],
        search: '',
        productPage: {
          curPage: 1,
          pageSize: 10,
          total: 0,
          first: 1,
          last: 10
        },
        proLoading: false,
        listUrl: this.$shopproduct,
        productBand: '',
        productCategory: '',
        productStatus: '',
        productType: '',
        deviceType: '',
        bandList: [],
        categoryList: [],
        statusList: [
          { label: '所有状态', value: '' },
          { label: '出售中', value: 0 },
          { label: '已下架', value: 1 },
          { label: '已上架', value: 2 },
          { label: '已删除', value: 9 }
        ],
        typeList: [
          { label: '所有商品类型', value: '' },
          { label: '智能产品', value: 'ICP' },
          { label: '产品', value: 'CP' },
          { label: '配件', value: 'PJ' },
          { label: '赠品', value: 'ZP' }
        ],
        deviceTypeList: [
          { label: '所有设备类型', value: '' },
          { label: '普通设备', value: 'C' },
          { label: '智能设备', value: 'I' },
          { label: '租赁设备 ', value: 'L' }
        ],
        isShowTimingOn: false,
        isShowTimingUp: false,
        isShowOn: false,
        isShowUp: false,
        isShowDel: false,
        isOnClose: false,
        isUpClose: false,
        proSort: '',
        sortList: [
          { label: '上架时间',value: 'listingTime' },
          { label: '销量',value: 'sales' }
        ],
        entityId: '-1',
      }
    },
    computed: {
      params () {
        return {
          page_no: this.productPage.curPage,
          page_size: this.productPage.pageSize,
          page_sort: 'gmtCreated_desc',
          q: this.search,
          bandId: this.productBand,
          categoryId: this.productCategory,
          status: this.productStatus,
          product_type: this.productType,
          device_type: this.deviceType
        }
      }
    },
    created () {
      let brand = this.$utils.getParamsFromUrl('brand')
      let category = this.$utils.getParamsFromUrl('category')
      let status = this.$utils.getParamsFromUrl('status')
      let productType = this.$utils.getParamsFromUrl('productType')
      let deviceType = this.$utils.getParamsFromUrl('deviceType')
      if(brand && brand !== null){
        this.productBand = brand
        this.$utils.replaceParamsFromUrl('brand',this.productBand)
      }

      if(category && category !== null){
        this.productCategory = category
        this.$utils.replaceParamsFromUrl('category',this.productCategory)
      }

      if(status && status !== null){
        this.productStatus = status
        this.$utils.replaceParamsFromUrl('brand',this.productStatus)
      }

      if(productType && productType !== null){
        this.productType = productType
        this.$utils.replaceParamsFromUrl('productType',this.productType)
      }

      if(deviceType && deviceType !== null){
        this.deviceType = deviceType
        this.$utils.replaceParamsFromUrl('deviceType',this.deviceType)
      }
      this.getBrandList()
      this.getCategoryList()
    },
    methods: {
      fetchData (data) {
        this.listData = data
        this.listData.forEach((value) => {
          // 商品状态
          switch (value.status) {
            case 0:
              value.statusText = '正常'
              break
            case 9:
              value.statusText = '已删除'
              break
            // no default
          }

          // 商品类型
          switch (value.productType) {
            case 'ICP':
              value.productTypeText = '智能产品'
              break
            case 'CP':
              value.productTypeText = '产品'
              break
            case 'ZP':
              value.productTypeText = '赠品'
              break
            case 'PJ':
              value.productTypeText = '配件'
              break
            // no default
          }
        })
      },
      // 重新请求数据
      listFetch () {
        this.proLoading = true
        this.$productApi.page(this.params)
          .then((res) => {
            if(res){
              setTimeout(() => {
                this.listData = res.fileList
                this.productPage.total = res.totalElements
                this.$filters.showPage(this.listData, this.productPage)
                this.fetchData(this.listData)
                this.proLoading = false
              },600)
            }
          })
      },
      // 获取品牌列表数据
      getBrandList () {
        this.$proBrandApi.page({
          page_no: 1,
          page_size: 100
        })
          .then((res) => {
            if(res){
              if(res) {
                this.bandList = res.fileList
                this.bandList.unshift({
                  name: '所有品牌',
                  id: ''
                })
              }
            }
          })
      },
      // 获取分类列表数据
      getCategoryList () {
        this.$proCategoryApi.page({
          page_no: 1,
          page_size: 100
        })
          .then((res) => {
            if(res){
              this.categoryList = res.fileList
              this.categoryList.unshift({
                name: '所有分类',
                id: ''
              })
            }
          })
      },
      // 跳转到新增页
      add () {
        this.$router.push('/product/create')
      },
      // 跳转到详情页
      detail (id) {
        this.$router.push(`/product/${id}`)
      },
      // 跳转到编辑页
      edit (id) {
        this.$router.push(`/product/edit/${id}`)
      },
      // 通过品牌筛选
      changeBrand (val) {
        this.productBand = val
        if(this.$utils.getParamsFromUrl('brand') !== null){
          this.$utils.replaceParamsFromUrl('brand',this.page)
        }else{
          this.$utils.addParamsToUrl({
            brand: this.productBand
          })
        }
        this.listFetch()
      },
      // 通过分类筛选
      changeCategory (val) {
        this.productCategory = val
        if(this.$utils.getParamsFromUrl('category') !== null){
          this.$utils.replaceParamsFromUrl('category',this.productCategory)
        }else{
          this.$utils.addParamsToUrl({
            category: this.productCategory
          })
        }
        this.listFetch()
      },
      // 通过状态筛选
      changeStatus (val) {
        this.productStatus = val
        if(this.$utils.getParamsFromUrl('status') !== null){
          this.$utils.replaceParamsFromUrl('status',this.productStatus)
        }else{
          this.$utils.addParamsToUrl({
            status: this.productStatus
          })
        }
        this.listFetch()
      },
      // 通过商品类型筛选
      changeProType (val) {
        this.productType = val
        if(this.$utils.getParamsFromUrl('productType') !== null){
          this.$utils.replaceParamsFromUrl('productType',this.productType)
        }else{
          this.$utils.addParamsToUrl({
            productType: this.productType
          })
        }
        this.listFetch()
      },
      // 通过设备类型筛选
      changeProDevice (val) {
        this.deviceType = val
        if(this.$utils.getParamsFromUrl('deviceType') !== null){
          this.$utils.replaceParamsFromUrl('deviceType',this.deviceType)
        }else{
          this.$utils.addParamsToUrl({
            deviceType: this.deviceType
          })
        }
        this.listFetch()
      },
      // 获取商品id
      getId (id) {
        this.entityId = id
      }
    },
    components: {
      VListing,
      VDelisting,
      VDelete
    }
  }
</script>


