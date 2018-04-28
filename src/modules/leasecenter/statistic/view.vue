<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .filter-box{
    border-bottom: 1px dashed #eee;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
  .select-date{
    width: 200px;
  }
</style>
<template>
  <v-app>
    <div slot="header-title">租赁管理统计分析-{{ $route.query.title }}</div>
    <div class="padding-top-m padding-bottom-m">
      <div class="el-form">
        <div class="el-form-item filter-box padding-bottom">
          <span class="font-s margin-right">日期范围</span>
          <el-date-picker type="daterange"
                          size="mini"
                          v-model="dateSelect"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="dateOption"
                          class="select-date"></el-date-picker>
        </div>
        <div class="el-form-item filter-box padding-bottom">
          <span class="font-s margin-right">安装城市</span>
          <el-select v-model="updateCity" placeholder="请选择安装城市" size="mini">
            <el-option v-for="item in cityList" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </div>
        <div class="el-form-item filter-box padding-bottom">
          <span class="font-s margin-right">排序方式</span>
          <el-select v-model="sorts" placeholder="请选择排序方式" size="mini">
            <el-option v-for="item in sortList" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <div class="float-right">
            <el-button size="small" @click="clearFilters">清空统计条件</el-button>
            <el-button type="primary" size="small" @click="goStatistics">执行统计</el-button>
          </div>
        </div>
      </div>
      <v-datagrid :isShowSearch="isShowSearch" :data="listData" :pageDatas="pageData" :selectable="isSelect">
        <el-table-column prop="deviceId" label="设备编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称" min-width="120"></el-table-column>
        <el-table-column prop="lessee" label="客户姓名"></el-table-column>
        <el-table-column prop="address" label="安装地址" min-width="150"></el-table-column>
        <el-table-column prop="brokenTime" label="断约时间">
          <template slot-scope="scope">
            {{ $filters.formatTime(scope.row.brokenTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="leaseStartDate" label="租赁起始日">
          <template slot-scope="scope">
            {{ $filters.formatTime(scope.row.leaseStartDate) }}
          </template>
        </el-table-column>
        <div slot="actions">
          <el-button type="primary" size="mini" @click="changeExport">导出</el-button>
        </div>
      </v-datagrid>
    </div>

    <v-export :exportDialogs="exportDialog"
              :exportForms="exportForm"
              :fieldData="exportFieldData"
              :exportRules="exportRule"
              @changeField="changeField"
              @sureExport="sureExport"
              @closeExport="changeExport"></v-export>
  </v-app>
</template>

<script>
  import VExport from '@/components/v-export'
  import messagebox from '@/assets/scripts/iotp-message-box'

  export default {
    name: "view",
    data () {
      return {
        isShowSearch: false,
        dateSelect: '',
        listData: [
          {
            deviceId: '1',
            productName: '产品1',
            lessee: '肥嘟嘟',
            address: '广州市',
            brokenTime: '2018-03-20 10:05:20',
            leaseStartDate: '2018-03-20'
          }
        ],
        isSelect: false,
        // pageDatas: {
        //   curPage: 1,
        //   pageSize: 10,
        //   pageSizes: [10, 15, 20, 50],
        //   total: 0,
        //   first: 1,
        //   last: 10
        // },
        pageDatas: {},
        dateOption: {
          shortcuts: [
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近三个月',
              onClick(picker){
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick',[start, end])
              }
            },
            {
              text: '最近半年',
              onClick(picker){
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
                picker.$emit('pick',[start, end])
              }
            },
            {
              text: '最近一年',
              onClick(picker){
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
                picker.$emit('pick',[start, end])
              }
            }
            ]
        },
        updateCity: '',
        cityList: [
          {
            label: '所有城市',
            value: ''
          },
          {
            label: '广州',
            value: 'gz'
          },
          {
            label: '北京',
            value: 'bj'
          }
        ],
        sorts: '',
        sortList: [
          {
            label: '按断约时间升序',
            value: 'time_desc'
          },
          {
            label: '按断约时间降序',
            value: 'time_asc'
          },
          {
            label: '按安装地址升序',
            value: 'updateAddress_desc'
          },
          {
            label: '按安装地址降序',
            value: 'updateAddress_asc'
          },
          {
            label: '按租赁起始日期升序',
            value: 'lease_desc'
          },
          {
            label: '按租赁起始日期降序',
            value: 'lease_asc'
          }
        ],
        exportDialog: false,
        exportForm: {
          field: []
        },
        exportRules: {
          field: [{ type: 'Array',required: true,message: '请选择需要导出的列',trigger: 'change' }]
        },
        exportRefs: 'exportForm',
        exportFieldData: [
          {
            label: '字段1',
            value: '1'
          },
          {
            label: '字段2',
            value: '2'
          },
        ],
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        console.log('初始化数据')
      },
      // 初始化数据导出弹框
      changeExport (val) {
        return val ? this.exportDialog = true : this.exportDialog = false
      },
      // 改变字段
      changeField (val) {
        console.log(val)
      },
      // 确定导出
      sureExport (val) {
        console.log(val)
      },
      // 执行统计
      goStatistics () {
        console.log('执行统计')
        messagebox.confirm(this,'确定执行统计？')
          .then(() => {
            this.$message({
              type: 'success',
              message: '成功执行统计'
            })
          })
      },
      // 清空统计条件
      clearFilters () {
        console.log('清空统计条件')
        messagebox.confirm(this,'确定清空统计条件？')
          .then(() => {
            this.$message({
              type: 'success',
              message: '成功清空统计条件'
            })
          })
      }
    },
    components: { VExport }
  }
</script>


