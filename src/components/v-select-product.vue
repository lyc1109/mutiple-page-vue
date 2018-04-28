<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .show-page{
    top: 7.5px;
  }

</style>
<template>
  <v-app>
    <div>
      <el-dialog title="选择产品" class="product-dialog table-dialog" :visible.sync="productChange" @close="hide">
        <div class="el-form">
          <div class="el-form-item">
            <el-input v-model="productSearch" placeholder="请输入产品信息" size="mini" @keyup.native.enter="searchProduct(productSearch)" @change="cancelSearch">
              <i class="el-icon-search el-input-icon" slot="suffix" @click="searchProduct(productSearch)"></i>
            </el-input>
          </div>
        </div>
        <el-table :data="productData" stripe="true" @row-click="selectProduct" @selection-change="selectionProduct" ref="product">
          <el-table-column v-for="item in productList"
                           :prop="item.prop"
                           :label="item.label"
                           :min-width="item.minWidth"
                           :type="item.type"
                           :width="item.width"
                           :key="item.prop"></el-table-column>
        </el-table>
        <div class="page float-right">
          <div class="show-page float-left">
            <span>显示第 {{ productPage.first }} 到 {{ productPage.last }} 条数据,</span>
          </div>
          <el-pagination :current-page="productPage.curPage"
                         :page-size="productPage.pageSize"
                         :total="productPage.total"
                         layout="total,prev,pager,next,jumper"
                         @current-change="productCurrent"
                         @size-change="productSize" small></el-pagination>
        </div>
        <div slot="footer">
          <el-button type="primary" size="small" @click.native="sureProduct">确定</el-button>
          <el-button size="small" @click="cancelProduct">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </v-app>
</template>

<script>
  export default {
    name: "v-select-product",
    props: {
      productDialog: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      productDialog (newVal){
        return newVal ? this.productChange = true : this.productChange = false
      }
    },
    data () {
      return {
        productChange: this.productDialog,
        productSearch: '',
        productData: [],
        productList: [
          {
            type: 'selection',
            prop: 'selection',
            width: 50
          },
          {
            prop: 'deviceType',
            label: '产品类型'
          },
          {
            prop: 'name',
            label: '产品名称',
            minWidth: 120
          },
          {
            prop: 'itemCode',
            label: '产品货号'
          }
        ],
        productPage: {
          curPage: 1,
          pageSize: 5,
          total: 5,
          first: 1,
          last: 5
        },
        selectData: [],
      }
    },
    mounted(){
      this.fetchData()
    },
    methods: {
      // 初始化数据
      fetchData(){
        this.$productApi.page({
          page_no: this.productPage.curPage,
          page_size: this.productPage.pageSize,
          q: this.productSearch
        })
          .then((res) => {
            this.productData = res.fileList
            this.productPage.total = res.totalElements
            this.$filters.showPage(this.productData,this.productPage)
          })
      },
      // 跳转到某一页
      productCurrent (val) {
        this.productPage.curPage = val
        this.fetchData()
      },
      // 每页显示多少条数据
      productSize(val){
        this.productPage.pageSize = val
        this.fetchData()
      },
      hide(){
        this.$emit('changeProduct',false)
      },
      sure(){
        this.$emit('sureProduct',this.selectData)
      },
      // 确定选择产品
      sureProduct(){
        this.sure()
        this.hide()
      },
      // 取消选择产品
      cancelProduct(){
        this.hide()
      },
      // 搜索产品
      searchProduct(val){
        this.productSearch = val
        this.fetchData()
      },
      // 取消搜索
      cancelSearch(val){
        if(val === ''){
          this.searchProduct(val)
        }
      },
      selectProduct(row){
        this.$refs.product.toggleRowSelection(row)
      },
      selectionProduct(data){
        this.selectData = data
      }
    }
  }
</script>


