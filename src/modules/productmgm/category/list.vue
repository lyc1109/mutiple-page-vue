<style scoped lang="scss" type="text/scss">
  @import '~variables';
</style>
<template>
  <v-app>
    <div slot="header-title">分类管理</div>
    <div slot="header-actions">
      <el-button type="primary" size="mini" @click="add">新增分类</el-button>
    </div>

    <v-datagrid :data="categoryData"
                :pageDatas="categoryPage"
                :params="categoryParams"
                :selectable="selectable"
                :searchs="categorySearch"
                :isShowLoading="categoryLoading"
                url="/web/product/category" @getData="getData">
      <el-table-column prop="fullName" label="分类名称" min-width="250"></el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="text" size="mini" @click="addSub(scope.row.id)">添加子类</el-button>
          <v-confirm-btn :isConfirm="isDel" value="确定删除该分类？" type="text" class="inline-block vertical-inherit" @sure="del(scope.row.id)">删除</v-confirm-btn>
        </template>
      </el-table-column>
    </v-datagrid>

    <category-form :isShow="formShow" :title="formTitle" :entityId="entityId" :parentId="parentId" :type="formType" @toggle="toggleForm" @save="save"></category-form>
  </v-app>
</template>

<script>
  import CategoryForm from './form'

  export default {
    name: "list",
    data () {
      return {
        categoryData: [],
        categoryPage: {
          curPage: 1,
          pageSize: 10,
          total: 10,
          first: 1,
          last: 10
        },
        categoryParams: {},
        selectable: false,
        categorySearch: '',
        categoryLoading: false,
        isDel: false,
        formShow: false,
        formTitle: '新增分类',
        entityId: '-1',
        parentId: '',
        formType: 'create'
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      // 初始化数据
      fetchData () {
        this.categoryParams = {
          page_no: this.categoryPage.curPage,
          page_size: this.categoryPage.pageSize,
          page_sort: 'orderNo_desc',
          q: this.categorySearch
        }
      },
      // 重新加载数据
      listFetch () {
        this.categoryLoading = true
        this.$proCategoryApi.page(this.categoryParams)
          .then((res) => {
            if(res){
              setTimeout(() => {
                this.categoryData = res.fileList
                this.categoryPage.total = res.totalElements
                this.$filters.showPage(this.categoryData,this.categoryPage)
                this.categoryLoading = false
              })
            }
          })
      },
      // 新增
      add () {
        this.formTitle =  '新增分类'
        this.entityId = '-1'
        this.parentId = ''
        this.formType = 'create'
        this.formShow = true
        this.listFetch()
      },
      // 编辑
      edit (id) {
        this.formTitle =  '编辑分类'
        this.entityId = id
        this.formType = 'edit'
        this.formShow = true
        this.listFetch()
      },
      // 添加子类
      addSub (id) {
        this.formTitle =  '添加子类'
        this.parentId = id
        this.formType = 'create'
        this.formShow = true
        this.listFetch()
      },
      // 删除
      del (id) {
        this.$proCategoryApi.del(id)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.listFetch()
            }
          })
      },
      // 编辑框显示隐藏
      toggleForm (val) {
        return val ? this.formShow = true : this.formShow = false
      },
      // 保存
      save () {
        this.listFetch()
      }
    },
    components: { CategoryForm }
  }
</script>

