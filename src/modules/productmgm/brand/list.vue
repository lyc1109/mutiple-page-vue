<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .inline-block{
    vertical-align: initial;
  }
</style>
<template>
  <v-app>
    <div slot="header-title">品牌管理</div>
    <div slot="header-actions">
      <el-button type="primary" size="mini" @click="add">新增品牌</el-button>
    </div>

    <v-datagrid :data="bandData"
                :params="bandParams"
                :pageDatas="bandPage"
                :selectable="selectable"
                :searchs="bandSearch"
                :isShowLoading="bandLoading"
                url="/web/product/brand"
                @getData="getBandData">
      <el-table-column prop="status" label="品牌状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">正常</span>
          <span v-if="scope.row.status === 1">已禁用</span>
          <span v-if="scope.row.status === 9">已删除</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="品牌名称"></el-table-column>
      <el-table-column prop="description" label="品牌描述"></el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-on:click="edit(scope.row.id)">修改</el-button>
          <v-confirm-btn :isConfirm="isDisable" type="text" value="确定禁用此品牌?" @sure="disable(scope.row.id)" class="inline-block" v-if="scope.row.status === 0">禁用</v-confirm-btn>
          <v-confirm-btn :isConfirm="isEnable" type="text" value="确定启用此品牌?" @sure="enable(scope.row.id)" class="inline-block" v-else>启用</v-confirm-btn>
          <v-confirm-btn :isConfirm="isDel" type="text" value="确定删除此品牌?" @sure="del(scope.row.id)" class="inline-block">删除</v-confirm-btn>
        </template>
      </el-table-column>
    </v-datagrid>

    <band-form :isShow="isShowForm" :title="titleText" :entityId="entityId" :type="formType" @toggle="toggleForm" @save="saveBand"></band-form>
  </v-app>
</template>

<script>
  import BandForm from './form'

  export default {
    name: "list",
    data () {
      return {
        bandData: [],
        bandParams: {},
        bandPage: {
          curPage: 1,
          pageSize: 10,
          total: 10,
          first: 1,
          last: 10
        },
        selectable: false,
        bandSearch: '',
        isDisable: false,
        isEnable: false,
        isDel: false,
        bandLoading: false,
        isShowForm: false,
        titleText: '新增品牌',
        entityId: '-1',
        formType: 'create'
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        this.bandParams = {
          page_no: this.bandPage.curPage,
          page_size: this.bandPage.pageSize,
          page_sort: 'orderNo_desc',
          q: this.bandSearch
        }
      },
      // 初始化数据
      listDataFetch () {
        this.$proBrandApi.page(this.bandParams)
          .then((res) => {
            this.bandLoading = true
            if(res){
              setTimeout(() => {
                this.bandData = res.fileList
                this.bandPage.total = res.totalElements
                this.getBandData(this.bandData)
                this.$filters.showPage(this.bandData,this.bandPage)
                this.bandLoading = false
              },600)
            }
          })
      },
      // 初始化部分需要修改的数据
      getBandData (data) {
        this.bandData = data
        this.bandData.forEach((value) => {
          if(value.status === 0){
            value.ableText = '禁用'
          }else{
            value.ableText = '启用'
          }
        })
      },
      // 禁用
      disable (id) {
        this.$proBrandApi.disable(id)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '禁用成功'
              })
              this.listDataFetch()
            }
          })
      },
      // 启用
      enable (id) {
        this.$proBrandApi.enable(id)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '启用成功'
              })
              this.listDataFetch()
            }
          })
      },
      // 删除
      del (id) {
        this.$proBrandApi.del(id)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.listDataFetch()
            }
          })
      },
      // 新增品牌
      add () {
        this.titleText = '新增品牌'
        this.entityId = '-1'
        this.formType = 'create'
        this.isShowForm = true
      },
      // 修改品牌
      edit (id) {
        this.titleText = '修改品牌'
        this.entityId = id
        this.formType = 'edit'
        this.isShowForm = true
      },
      // 切换编辑框的显示隐藏
      toggleForm (val) {
        return val ? this.isShowForm = true : this.isShowForm = false
      },
      // 保存品牌
      saveBand () {
        this.listDataFetch()
      }
    },
    components: { BandForm }
  }
</script>

