<style scoped lang="scss" type="text/scss">
  @import "~variables";

</style>
<template>
    <div>
      <el-dialog :visible.sync="isShow" :title="title" @close="hide">
        <v-datagrid :data="tabData"
                    :pageDatas="pageDatas"
                    :isShowSearch="isShowSearch"
                    :isRadio="isRadio"
                    :url="pageUrl"
                    :params="params"
                    :stripe="stripe"
                    :selectable="selectable"
                    :searchs="searchVal"
                    :isShowFilter="isShowFilter"
                    @selectPro="selectPro"
                    :isToggle="isToggle"
                    :isDialog="isDialog"
                    @getData="getData"
                    :isPage="isPage">
          <slot></slot>
        </v-datagrid>
        <div slot="footer">
          <v-button-ok @click.native="sure" v-model="errMsg" size="mini" v-if="isConfirmDialog">确定</v-button-ok>
          <el-button size="mini" @click="cancel">{{ cancelText }}</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "v-table-dialog",
    props: {
      // 是否显示弹出框
      isShowDialog: {
        type: Boolean,
        default: false
      },
      // 弹出框的标题
      title: {
        type: String,
        default: ''
      },
      // 是否需要过滤条件
      isShowFilter: {
        type: Boolean,
        default: true
      },
      // 是否显示搜索框
      isShowSearch: {
        type: Boolean,
        default: true
      },
      // 表格数据
      data: {
        type: Array,
        default: []
      },
      // 是否需要选择
      selectable: {
        type: Boolean,
        default: true
      },
      // 表格分页数据
      pageDatas: {
        type: Object,
        default: {
          curPage: 1,
          pageSize: 5,
          pageSizes: [10, 15, 20, 50],
          total: 0,
          first: 1,
          last: 10
        }
      },
      // 是否开启斑马纹
      stripe: {
        type: Boolean,
        default: true
      },
      // 表格是否单选
      isRadio: {
        type: Boolean,
        default: false
      },
      // 表格数据请求的API地址
      pageUrl: {
        type: String,
        required: true
      },
      // 表格数据请求API的请求参数
      params: {
        type: Object,
        default: {}
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
      // 取消按钮的文本
      cancelText: {
        type: String,
        default: '取消'
      },
      // 是否为确认框（可能是只需查看）
      isConfirmDialog: {
        type: Boolean,
        default: true
      },
      // 错误信息
      errMsg: {
        type: String,
        default: ''
      },
      // 是否需要分页组件
      isPage: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      isShowDialog (val) {
         return val ? this.isShow = true : this.isShow = false
      },
      data (val) {
        this.tabData = val
      }
    },
    data () {
      return {
        isShow: this.isShowDialog,
        selectData: [],
        searchVal: this.searchs,
        isDialog: true,
        tabData: this.data
      }
    },
    methods: {
      // 选中的数据
      selectPro (val) {
        this.selectData = val
        this.$emit('selectPro',this.selectData)
      },
      // 确定
      sure () {
        // this.hide ()
        this.$emit('sure',this.selectData)
      },
      // 关闭
      hide () {
        this.$emit('toggle',false)
      },
      // 取消
      cancel () {
        this.hide ()
        this.$emit('cancel')
      },
      // 获取数据
      getData (val) {
        this.$emit('getData',val)
      }
    }
  }
</script>


