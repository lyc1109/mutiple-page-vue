<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .el-icon-loading,
  .el-loading-text {
    color: $white;
  }
  .el-icon-loading {
    font-size: 18px;
  }

  .v-datagrid /deep/ {
    td{
      padding: 8px 0;
      font-size: $font-size-s;
      color: darken($font-light, 5%);
      font-weight: 400;

      a{
        color: darken($font-light, 5%);
        font-weight: 400;
      }
    }
    thead {
      font-size: $font-size-s;
      color: $font-primary;
    }
    thead tr {
      background: #f2f2f2;
    }
  }
  .v-pagination /deep/ {
    .btn-prev, .btn-next, .el-pager {
      margin-top: 4px;
      color: $font-light;
    }

    span:not([class*=suffix]),
    .el-input .el-input__inner {
      font-size: $font-size-s;
      color: $font-light;
    }

    .el-pagination__total {
      margin-top: 2px;
    }
  }
  /*.show-page{*/
  /*position: relative;*/
  /*top: 9.8px;*/
  /*}*/

  .v-datagrid-searchbox{
    padding: 10px 0;
    /*width: 300px;*/

    .btn-refresh {
      border-color: $border;
      color: $font-light;
    }
  }
  .v-datagrid-searchbox /deep/ {
    .el-input__inner,
    .el-input-group__append{
      border-color: $border!important;
      box-shadow: none;
      color: $font-light;
    }
    .el-input__inner{
      font-size: $font-size-s;
    }
  }
  .search{
    width: 260px;
  }
  .el-icon-search{
    font-size: $font-size-m;
    color: $primary;
    position: relative;
    top: 7px;
  }
</style>

<template>
  <div>
    <div class="v-datagrid-searchbox" v-if="isShowFilter" :class="{ 'flex': !isForm,'padding-left': isDialog }">
      <!--<div class="padding-right" v-if="showRefreshBtn">
        <el-button class="btn-refresh" size="small" icon="el-icon-refresh" :loading="isLoading" @click="loadGridData"></el-button>
      </div>-->
      <slot name="filter"></slot>
      <div :class="{ 'el-form': isForm }">
        <div :class="{ 'el-form-item': isForm,'flex-item': !isForm,'margin-left-s': !showRefreshBtn }">
          <el-input placeholder="请输入关键字搜索" size="small" v-model="searchPhrase" class="search" @keyup.native.enter="search(searchPhrase)" v-if="isShowSearch">
            <i slot="suffix" class="el-icon-search el-input-icon font-bold-600" @click="search(searchPhrase)"></i>
          </el-input>
        </div>
      </div>
    </div>

    <div class="border border-radius v-loading"
         v-loading="isLoading"
         element-loading-text="品美好生活..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.1)"
         element-loading-custom-class="v-loading">
      <el-table class="v-datagrid"
                :data="gridData"
                :stripe="stripe"
                @row-click="selectedPro"
                @selection-change="selectPro"
                ref="datagrid">
        <el-table-column type="selection" width="45" v-if="selectable"></el-table-column>
        <slot></slot>
      </el-table>

      <div class="flex padding-m" v-if="isPage">
        <div class="flex-item">
          <slot name="actions"></slot>
        </div>
        <div v-if="isPage && gridData ? gridData.length > 0 : ''" class="page">
          <div class="show-page float-left">
            <span class="font-s font-light">显示第 {{ pageData.first }} 到 {{ pageData.last }} 条数据,</span>
          </div>
          <el-pagination
            class="v-pagination float-left"
            @size-change="handlePageSizeChange"
            @current-change="handleCurPageChange"
            :current-page.sync="pageData.curPage"
            :page-size="pageData.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pageData.total"
            small="true">
          </el-pagination>
          <!--<el-pagination-->
          <!--class="v-pagination float-left"-->
          <!--@size-change="handlePageSizeChange"-->
          <!--@current-change="handleCurPageChange"-->
          <!--:current-page.sync="pageData.curPage"-->
          <!--:page-sizes="pageData.pageSizes"-->
          <!--:page-size="pageData.pageSize"-->
          <!--layout="total, sizes, prev, pager, next, jumper"-->
          <!--:total="pageData.total"-->
          <!--small="true">-->
          <!--</el-pagination>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    name: "v-datagrid",
    desc: "基于el-table、el-pagination整合封装数据表格组件，对分页信息做统一处理",
    props: {
      data: {
        type: Array,
        default: []
      },
      // grid分页数据请求url
      url: {
        type: String,
        required: true
      },
      // 请求参数
      params: {
        type: Object,
        default: {
          page_no: 1,
          page_size: 10,
          page_sort: "",
          q: this.searchPhrase
        }
      },
      // 斑马纹，默认启用
      stripe: {
        type: Boolean,
        default: true
      },
      // 是否可以选择
      selectable: {
        type: Boolean,
        default: true
      },
      // 是否显示搜索框
      isShowSearch: {
        type: Boolean,
        default: true
      },
      // 分页数据
      pageDatas: {
        type: Object,
        default: {
          curPage: 1,
          pageSize: 10,
          pageSizes: [10, 15, 20, 50],
          total: 0,
          first: 1,
          last: 10
        }
      },
      // 是否显示过滤条件
      isShowFilter: {
        type: Boolean,
        default: true
      },
      // 是否显示刷新按钮
      showRefreshBtn: {
        type: Boolean,
        default: true
      },
      // 是否为表单
      isForm: {
        type: Boolean,
        default: false
      },
      // 是否显示加载按钮
      isShowLoading: {
        type: Boolean,
        default: false
      },
      // 表格是否单选
      isRadio: {
        type: Boolean,
        default: false
      },
      // 搜索框的值
      searchs: {
        type: String,
        default: ''
      },
      // 是否需要选择
      isToggle: {
        type: Boolean,
        default: true
      },
      // 是否为弹出框
      isDialog: {
        type: Boolean,
        default: false
      },
      // 是否显示分页
      isPage: {
        type: Boolean,
        default: true
      },
      // 是否为列表页（用于判断是否需要默认添加page参数）
      isList: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        gridData: this.data,
        pageData: this.pageDatas,
        searchPhrase: this.searchs,
        isLoading: this.isShowLoading,
        selectedData: [],
        // pageParams: this.params
      }
    },
    created(){
      if(!this.isDialog){
        // 从浏览器重启之前访问的分页
        let cachePage = this.$utils.getParamsFromUrl("page")
        let search = this.$utils.getParamsFromUrl('search')

        // 页数
        if(cachePage && cachePage !== null){
          this.pageDatas.curPage = parseInt(cachePage)
          this.$utils.replaceParamsFromUrl('page',this.pageDatas.curPage)
        }else{
          if(this.isList) {
            this.$utils.addParamsToUrl({
              page: this.pageDatas.curPage
            })
          }
        }
        this.params.page_no = this.pageDatas.curPage

        // 搜索
        if(search && search !== null){
          this.searchPhrase = search
          this.params.q = this.searchPhrase
          this.$utils.replaceParamsFromUrl('search',this.searchPhrase)
        }
      }

      this.loadGridData();
    },
    watch: {
      searchPhrase: function (val) {
        this.search(val);
      },
      data (val) {
        if(typeof (val) === 'object'){
          this.gridData = val
        }
      },
      isShowLoading(val){
        this.isLoading = val
      },
      pageDatas: {
        handler (val) {
          this.pageData = val
          this.params.page_no = val.curPage
        },
        deep: true
      },
      params: {
        handler (val) {
          this.pageParams = val
        },
        deep: true
      }
    },
    methods: {
      loadGridData: function () {
        this.isLoading = true;

        // 构建请求参数
        // const reqParams = Object.assign({
        //   page_no: this.pageData.curPage,
        //   page_size: this.pageData.pageSize,
        //   page_sort: "",
        //   q: this.searchPhrase
        // }, this.params);
        this.$http.get(this.url, this.params)
          .then((resp) => {
            //console.log(resp);
            if(resp.fileList){
              this.data = resp.fileList
              this.gridData = resp.fileList;
            }else{
              this.data = resp
              this.gridData = resp
            }

            this.$emit('getData',this.gridData)
            if(resp.totalElements){
              this.pageData.total = resp.totalElements;
            }
            this.hideLoading();
            // this.$utils.addParamsToUrl({
            //   page: this.pageData.curPage
            // });
            if(this.isPage){
              this.$filters.showPage(this.gridData,this.pageData)
            }
          })
          .catch((err) => {
            this.hideLoading();
            console.log(err);
            //this.$toast.err("数据请求异常。" + err);
          });
      },

      hideLoading: function () {
        setTimeout(() => {
          this.isLoading = false;
        }, 600);
      },

      /**
       * 切换分页
       * @param curPage
       */
      handleCurPageChange: function (curPage) {
        this.pageData.curPage = curPage;
        this.$utils.replaceParamsFromUrl('page',this.pageData.curPage)
        this.loadGridData();
      },

      /**
       * 改变每页显示数量
       * @param pageSize 每页数量
       */
      handlePageSizeChange: function (pageSize) {
        this.pageData.pageSize = pageSize;
        this.loadGridData();
      },

      /**
       * 模糊查询，
       * _.debounce() 防抖动函数
       */
      search: _.debounce(function (val) {
        this.searchPhrase = val
        this.params.q = this.searchPhrase
        this.params.page_no = 1
        if(!this.isDialog) {
          this.$utils.replaceParamsFromUrl('page', this.params.page_no)
          if (this.$utils.getParamsFromUrl('search') !== null) {
            this.$utils.replaceParamsFromUrl('search', this.searchPhrase)
          } else {
            this.$utils.addParamsToUrl({
              search: this.searchPhrase
            })
          }
        }
        this.loadGridData();
      }, 600),
      // 选择单行
      selectPro(row){
        if(this.selectable){
          if(this.isRadio){
            if(row.length > 1){
              row.splice(0,1)
            }
          }
          this.selectedData = row
          this.$emit('selectPro',this.selectedData)
        }
      },
      // 点击整行选中
      selectedPro(row){
        if(this.isToggle){
          this.$refs.datagrid.toggleRowSelection(row)
        }
      }
    }
  }
</script>
