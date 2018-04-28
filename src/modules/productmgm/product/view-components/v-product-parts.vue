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
  .data{
    /deep/ .el-table__body-wrapper{
      max-height: 244px;
      overflow-y: scroll;
      overflow-x: hidden;
    }
  }
</style>
<template>
  <div>
    <h2 class="smart-title padding-right">
      商品配件
      <div class="float-right">
        <el-button icon="el-icon-refresh" size="small" type="text" @click="fetchData">刷新</el-button>
        <el-button type="text" size="small" @click="add">新增配件</el-button>
        <el-button type="text" size="small" @click="relevance">关联配件</el-button>
      </div>
    </h2>
    <div class="border padding-l">
      <v-datagrid :data="partData"
                  :params="params"
                  :selectable="selectable"
                  :isShowLoading="partLoading"
                  :isShowFilter="isShowFilter"
                  :url="pageUrl"
                  :isList="isList"
                  :isPage="isPage"
                  class="data"
                  @getData="getPartData">
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">正常</span>
            <span v-if="scope.row.status === 9">已删除</span>
          </template>
        </el-table-column>
        <el-table-column prop="itemCode" label="配件货号" min-width="100"></el-table-column>
        <el-table-column prop="name" label="配件名称" min-width="150"></el-table-column>
        <el-table-column prop="operate" label="操作">
          <template slot-scope="scope">
            <v-confirm-btn :isConfirm="disassociateBtn"
                           type="text"
                           value="确定解除此配件的关联？"
                           @clicks="openDisassociate(scope.row.id)"
                           @sure="disassociate"
                           v-if="scope.row.status === 0">解除关联</v-confirm-btn>
          </template>
        </el-table-column>
      </v-datagrid>

      <!--关联配件-->
      <v-table-dialog :isShowDialog="addDialog"
                      :title="addTitle"
                      :data="addData"
                      pageUrl="/pms/product"
                      :pageDatas="partPage"
                      :params="addParams"
                      :searchs="addSearch"
                      :errMsg="errMsg"
                      :isList="isList"
                      @sure="sureSelectPart"
                      @cancel="cancelSelectPart"
                      class="form-dialog"
                      :isPage="isPage"
                      @selectPro="selectParts"
                      @getData="getProData">
        <el-table-column prop="name" label="配件名称"></el-table-column>
      </v-table-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: "v-product-parts",
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        productDetail: this.data,
        params: {},
        partData: [],
        selectable: false,
        isShowFilter: false,
        // pageDatas: {
        //   curPage: 1,
        //   pageSize: 10,
        //   total: 0,
        //   first: 1,
        //   last: 10
        // },
        partPage: {
          curPage: 1,
          pageSize: 5,
          total: 0,
          first: 1,
          last: 5
        },
        partLoading: false,
        addDialog: false,
        addSearch: '',
        errMsg: '',
        addKey: 'add',
        addTitle: '新增配件',
        disassociateBtn: false,
        partId: '',
        isPage: false,
        addData: [],
        partsId: '',
        addDataBak: [],
        partDataBak: [],
        isList: false,
        exclueId: ''
      }
    },
    watch: {
      addDataBak (val) {
        if (val.length > 0) {
          this.addData = val
        }
      }
      //   partData (val) {
      //     console.log(val)
      //   }
    },
    computed: {
      pageUrl () {
        return `/web/productpart/${this.$route.params.id}`
      },
      addParams () {
        return {
          page_no: this.partPage.curPage,
          page_size: this.partPage.pageSize,
          product_type: 'PJ',
          page_sort: 'gmtCreated_desc',
          q: this.addSearch,
          exclude_id: this.exclueId
        }
      }
    },
    methods: {
      // 重新加载数据
      fetchData(){
        this.partLoading = true
        this.$proPartApi.page(this.$route.params.id)
          .then((res) => {
            if(res){
              setTimeout(() => {
                this.partData = res
                this.partDataBak = res
                this.partLoading = false
              },600)
            }
          })
      },
      // 获取配件数据
      getPartData (data) {
        this.partDataBak = data
      },
      // 获取配件产品的数据
      getProData (data) {
        this.addDataBak = data
      },
      // 打开解除关联确认框
      openDisassociate (data) {
        this.partId = data
      },
      // 解除关联
      disassociate(){
        this.$proPartApi.del(this.$route.params.id,this.partId)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '解除成功'
              })
              this.disassociateBtn = false
              this.fetchData()
            }
          })
      },
      // 新增配件
      add () {
        this.$router.push({
          path: '/product/create',
          query: {
            productType: 'PJ'
          }
        })
      },
      // 关联配件
      relevance () {
        this.partData = this.partDataBak
        setTimeout(() => {
          let arr = []
          for (let i of this.partData) {
            for (let o of this.addData) {
              if (i.id === o.id) {
                arr.push(o.id)
                this.addParams.exclude_id = arr.join(';')
              }
            }
          }
          this.$productApi.page(this.addParams)
            .then((res) => {
              this.addData = res.fileList
              this.addDataBak = res.fileList
            })
        },400)
        // this.addData = this.addDataBak
        this.addKey = 'relevance'
        this.addTitle = '关联配件'
        this.addDialog = true
      },
      // 确定关联配件
      sureSelectPart (val) {
        if(val.length === 0){
          this.addData = this.addDataBak
          this.errMsg = '最少必须选择一个配件'
          return false
        }
        this.$proPartApi.create(this.$route.params.id,{
          partIds: this.partsId
        })
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '关联成功'
              })
              this.fetchData()
              this.addDialog = false
            }
          })
      },
      // 取消新增/关联配件
      cancelSelectPart () {
        this.addDialog = false
      },
      // 选择配件
      selectParts (val) {
        let arr = []
        val.forEach((value) => {
          arr.push(value.id)
        })
        this.partsId = arr.join(';')
      }
    }
  }
</script>


