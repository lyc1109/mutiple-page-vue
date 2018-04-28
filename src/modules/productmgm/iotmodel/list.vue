<style scoped lang="scss" type="text/scss">
  @import '~variables';
</style>
<template>
  <v-app>
    <div slot="header-title">智能模板配置</div>
    <div slot="header-actions">
      <el-button type="primary" size="mini" @click="add">新增模板</el-button>
    </div>

    <v-datagrid :data="modelData"
                :pageDatas="modelPage"
                :params="modelParams"
                :selectable="selectable"
                :isShowLoading="modelLoading"
                :isShowFilter="isShowFilter"
                url="/api/v3/idevice/models"
                class="padding-top-m">
      <el-table-column prop="iotDeviceType" label="模版类型"></el-table-column>
      <el-table-column prop="modelName" label="模版名称" min-width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="detail(scope.row.id)">{{ scope.row.modelName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="modelCode" label="模版代码"></el-table-column>
      <el-table-column prop="modified" label="最后编辑时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ $filters.formatTime(scope.row.modified) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="detail(scope.row.id)">查看</el-button>
          <el-button type="text" size="mini" @click="edit(scope.row.id)">编辑</el-button>
          <v-confirm-btn :isConfirm="isDel" type="text" value="确定删除此模板？" class="inline-block vertical-inherit margin-left-s" @sure="del(scope.row.id)">删除</v-confirm-btn>
        </template>
      </el-table-column>
    </v-datagrid>

    <iotmodel-view :entityId="entityId" :isShow="showDetail" @toggle="closeView"></iotmodel-view>

    <iotmodel-form :isShow="showForm" :title="formTit" :entityId="entityId" :type="formType" @toggle="toggleForm"></iotmodel-form>
  </v-app>
</template>

<script>
  import IotmodelView from './view'
  import IotmodelForm from './form'

  export default {
    name: "list",
    data () {
      return {
        modelData: [],
        modelPage: {
          curPage: 1,
          pageSize: 10,
          total: 10,
          first: 1,
          last: 10
        },
        // modelParams: {},
        selectable: false,
        modelLoading: false,
        isDel: false,
        isShowFilter: false,
        showDetail: false,
        entityId: '',
        showForm: false,
        formType: 'create',
        formTit: '新增智能模板'
      }
    },
    computed: {
      modelParams () {
        return {
          page_no: this.modelPage.curPage,
          page_size: this.modelPage.pageSize,
          page_sort: 'id_desc'
        }
      }
    },
    methods: {
      // 重新获取数据
      listFetch () {
        this.modelLoading = true
        this.$iotmodelApi.page(this.modelParams)
          .then((res) => {
            if(res){
              setTimeout(() => {
                this.modelData = res.fileList
                this.modelPage.total = res.totalElements
                this.$filters.showPage(this.modelData,this.modelPage)
                this.modelLoading = false
              })
            }
          })
      },
      // 新增
      add () {
        this.entityId = '-1'
        this.formType = 'create'
        this.formTit = '新增智能模板'
        this.showForm = true
        this.listFetch()
      },
      // 详情
      detail (id) {
        this.entityId = id
        this.showDetail = true
        this.listFetch()
      },
      // 编辑
      edit (id) {
        this.entityId = id
        this.formType = 'edit'
        this.formTit = '编辑智能模板'
        this.showForm = true
        this.listFetch()
      },
      // 删除
      del (id) {
        this.$iotmodelApi.del(id)
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
      // 关闭详情弹出框
      closeView (val) {
        return val ? this.showDetail = true : this.showDetail = false
      },
      // 关闭编辑弹出框
      toggleForm (val) {
        return val ? this.showForm = true : this.showForm = false
      }
    },
    components: { IotmodelView,IotmodelForm }
  }
</script>

