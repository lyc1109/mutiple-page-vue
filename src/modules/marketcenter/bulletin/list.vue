<style scoped lang="scss" type="text/scss">
  @import "~variables";

  h1{
    color: red;
  }
  .el-select{
    width: 120px;
    margin-right: $s;

    .el-input{
      font-size: $font-size-s;
    }
  }
  .bulletin-table{
    .el-button{
      margin-left: 0;
    }
  }
</style>

<template>
  <v-app>
    <div slot="header-title">公告管理</div>
    <div slot="header-actions">
      <router-link to="/bulletin/create">
        <el-button size="small" type="primary">发布公告</el-button>
      </router-link>
    </div>

    <!--<v-datagrid url="/api/v3/bulletin" :params="params" :data="bulletins" :selectable="selectable">-->
    <!--<div slot="filter" class="flex">-->
    <!--<div class="el-form table-form">-->
      <!--<div class="el-form-item">-->
        <!--<el-button class="btn-refresh margin-right" size="small" icon="el-icon-refresh" :loading="isLoading" @click="refresh"></el-button>-->
        <!--<el-select v-model="type" placeholder="请选择公告类型" size="small" @change="searchType">-->
          <!--<el-option v-for="item in typeList" :label="item.label" :value="item.value" :key="item.value"></el-option>-->
        <!--</el-select>-->
        <!--<el-select v-model="page" placeholder="请选择页面" size="small" @change="searchPage">-->
          <!--<el-option v-for="item in pageList" :label="item.label" :value="item.value" :key="item.value"></el-option>-->
        <!--</el-select>-->
        <!--<el-select v-model="show" placeholder="请选择显示方式" size="small" @change="searchShow">-->
          <!--<el-option v-for="item in showList" :label="item.label" :value="item.value" :key="item.value"></el-option>-->
        <!--</el-select>-->
        <!--<el-input placeholder="请输入关键字搜索" size="small" v-model="searchPhrase" class="table-search" @keyup.enter.native="search(searchPhrase)" @change="cancelSearch">-->
          <!--<i slot="suffix" class="el-icon-search el-input-icon font-bold-600" @click="search(searchPhrase)"></i>-->
        <!--</el-input>-->
      <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--<el-table :data="bulletins" stripe="true" v-loading="bulletinLoading" element-loading-text="努力加载中...">-->
    <v-datagrid :data="bulletins" :pageDatas="bulletinPage" url="/api/v3/bulletin" :params="params" class="bulletin-table" :selectable="selectable" :isShowLoading="bulletinLoading">
      <div slot="filter">
        <!--<el-button class="btn-refresh margin-right" size="small" icon="el-icon-refresh" :loading="isLoading" @click="refresh"></el-button>-->
        <el-select v-model="type" placeholder="请选择公告类型" size="small" @change="searchType">
          <el-option v-for="item in typeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <el-select v-model="page" placeholder="请选择页面" size="small" @change="searchPage">
          <el-option v-for="item in pageList" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <el-select v-model="show" placeholder="请选择显示方式" size="small" @change="searchShow">
          <el-option v-for="item in showList" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </div>
      <el-table-column prop="status" label="状态" width="60">
        <template slot-scope="scope">
          <span class="color-gray-1" v-if="scope.row.status === 9">过期</span>
          <span class="color-success" v-if="scope.row.status === 0">正常</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="typeTitle" label="类型" min-width="100" show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="title" label="标题" min-width="200"  show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="renderViewUrl(scope.row.id)">
            <span class="color-danger" v-if="scope.row.top">【置顶】</span>
            <span class="color-primary">{{scope.row.title}}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="公告类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'notice'">通知公告</span>
          <span v-if="scope.row.type === 'ad'">广告</span>
        </template>
      </el-table-column>
      <el-table-column prop="displayPage" label="显示页面" min-width="120">
        <template slot-scope="scope">
          <!--<span v-if="(scope.row.displayPage).join(',').indexOf('H') > -1">首页</span>-->
          <!--<span v-if="(scope.row.displayPage).join(',').indexOf('L') > -1">租赁中心</span>-->
          <!--<span v-if="(scope.row.displayPage).join(',').indexOf('R') > -1">订单中心</span>-->
          <span>{{ scope.row.pageNames }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="top" label="置顶">-->
      <!--<template slot-scope="scope">-->
      <!--<span v-if="scope.row.top">是</span>-->
      <!--<span v-if="!scope.row.top">否</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="effectTime" label="有效时间" min-width="190">
        <template slot-scope="scope">
          <span v-if="!scope.row.effectTime || !scope.row.failureTime" class="font-light">(未知)</span>
          <span v-if="scope.row.effectTime && scope.row.failureTime">{{ $filters.formatTime(scope.row.effectTime) }} ~ {{ $filters.formatTime(scope.row.failureTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modified" label="最近编辑时间" min-width="120">
        <template slot-scope="scope">
          {{$filters.formatTime(scope.row.modified)}}
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" min-width="120">
        <template slot-scope="scope">
          <!--<el-button @click="onView(scope.row)" type="text" size="small">查看</el-button>-->
          <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>

          <el-button type="text" size="small" v-if="!scope.row.top" @click="top(scope.row.id)">置顶</el-button>
          <el-button type="text" size="small" v-if="scope.row.top" @click="cancelTop(scope.row.id)">取消置顶</el-button>

          <el-button type="text" size="small" v-if="scope.row.status === 0" @click="overdue(scope.row.id)">失效</el-button>
          <el-button type="text" size="small" v-if="scope.row.status === 9" @click="valid(scope.row.id)">有效</el-button>

          <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </v-datagrid>
    <!--</el-table>-->
    <!--<div class="page">-->
      <!--<div class="show-page">-->
        <!--<span class="font-s">显示第 {{ bulletinPage.first }} 到 {{ bulletinPage.last }} 条数据,</span>-->
      <!--</div>-->
      <!--<el-pagination :current-page="bulletinPage.current"-->
                     <!--:page-size="bulletinPage.size"-->
                     <!--:total="bulletinPage.total"-->
                     <!--layout="total,prev,pager,next,jumper"-->
                     <!--@current-change="bulletinCurrent"-->
                     <!--@size-change="bulletinSize"-->
                     <!--small></el-pagination>-->
    <!--</div>-->
    <!--</v-datagrid>-->
  </v-app>
</template>

<script>
  import api from '@/apis/api-bulletin'
  import messagebox from '@/assets/scripts/iotp-message-box'

  export default {
    name: "bulletin",
    data: function () {
      return {
        bulletins: [],
        bulletinPage: {
          curPage: 1,
          pageSize: 2,
          total: 0,
          first: 1,
          last: 10
        },
        searchPhrase: '',
        selectable: false,
        typeList: [
          {
            label: '所有类型',
            value: ''
          },
          {
            label: '通知公告',
            value: 'notice'
          },
          {
            label: '广告',
            value: 'ad'
          }
        ],
        pageList: [
          {
            label: '所有页面',
            value: ''
          },
          {
            label: '首页',
            value: 'H'
          },
          {
            label: '租赁中心',
            value: 'L'
          },
          {
            label: '订单中心',
            value: 'R'
          }
        ],
        showList: [
          {
            label: '所有显示方式',
            value: ''
          },
          {
            label: '普通',
            value: 'GENERAL'
          },
          {
            label: '弹窗',
            value: 'POPUP'
          }
        ],
        type: '',
        page: '',
        show: '',
        bulletinLoading: false,
        params: {}
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      // 初始化数据
      fetchData(){
        // console.log(this.bulletinPage.curPage)
        this.params = {
          page_no: this.bulletinPage.curPage,
          page_size: this.bulletinPage.pageSize,
          display_page: this.page,
          display_type: this.show,
          type: this.type,
          q: this.searchPhrase
        }
        // let page = this.$utils.getParamsFromUrl('page')
        // let search = this.$utils.getParamsFromUrl('search')
        let type = this.$utils.getParamsFromUrl('type')
        let displayPage = this.$utils.getParamsFromUrl('displayPage')
        let displayType = this.$utils.getParamsFromUrl('displayType')

        // 页数
        // if(page && page !== null){
        //   this.bulletinPage.current = parseInt(page)
        //   this.$utils.replaceParamsFromUrl('page',this.bulletinPage.current)
        // }else{
        //   this.$utils.addParamsToUrl({
        //     page: this.bulletinPage.current
        //   })
        // }

        // 搜索
        // if(search && search !== null){
        //   this.searchPhrase = search
        //   this.$utils.replaceParamsFromUrl('search',this.searchPhrase)
        // }

        // 公告类型
        if(type && type !== null){
          this.type = type
          this.$utils.replaceParamsFromUrl('type',this.type)
        }

        // 显示页面
        if(displayPage && displayPage !== null){
          this.page = displayPage
          this.$utils.replaceParamsFromUrl('displayPage',this.page)
        }

        // 显示方式
        if(displayType && displayType !== null){
          this.show = displayType
          this.$utils.replaceParamsFromUrl('displayType',this.show)
        }

        this.listFetch()
      },
      // 分页数据初始化
      listFetch(){
        this.bulletinLoading = true
        let params = {
          page_no: this.bulletinPage.curPage,
          page_size: this.bulletinPage.pageSize,
          display_page: this.page,
          display_type: this.show,
          type: this.type,
          q: this.searchPhrase
        }
        api.page(params)
          .then((res) => {
            if(res){
              setTimeout(() => {
                this.bulletins = res.fileList
                this.bulletinPage.total = res.totalElements
                this.$filters.showPage(this.bulletins,this.bulletinPage)
                this.bulletinLoading = false
              },500)
            }
          })
      },
      // 跳转到详情页
      renderViewUrl: function (id) {
        return `/bulletin/${id}/view`;
      },
      // 跳转到详情页
      onView: function (row) {
        this.$router.push(this.renderViewUrl(row.id));
      },
      // 跳转到编辑页面
      onEdit: function (row) {
        this.$router.push(`/bulletin/${row.id}/edit`);
      },
      // 跳转到第几页
      // bulletinCurrent(val){
      //   this.bulletinPage.current = val
      //   this.$utils.replaceParamsFromUrl('page',this.bulletinPage.current)
      //   this.listFetch()
      // },
      // // 每页显示多少条数据
      // bulletinSize(val){
      //   this.bulletinPage.size = val
      //   this.listFetch()
      // },
      // 搜索
      // search(val){
      //   this.searchPhrase = val
      //   if(this.$utils.getParamsFromUrl('search') !== null){
      //     this.$utils.replaceParamsFromUrl('search',this.searchPhrase)
      //   }else{
      //     this.$utils.addParamsToUrl({
      //       search: this.searchPhrase
      //     })
      //   }
      //   this.listFetch()
      // },
      // 取消搜索
      // cancelSearch(val){
      //   if(val === ''){
      //     this.search(val)
      //   }
      // },
      // 筛选
      searchType(val){
        this.type = val
        if(this.$utils.getParamsFromUrl('type') !== null){
          this.$utils.replaceParamsFromUrl('type',this.type)
        }else{
          this.$utils.addParamsToUrl({
            type: this.type
          })
        }
        this.listFetch()
      },
      // 筛选
      searchPage(val){
        this.page = val
        if(this.$utils.getParamsFromUrl('displayPage') !== null){
          this.$utils.replaceParamsFromUrl('displayPage',this.page)
        }else{
          this.$utils.addParamsToUrl({
            displayPage: this.page
          })
        }
        this.listFetch()
      },
      // 筛选
      searchShow(val){
        this.show = val
        if(this.$utils.getParamsFromUrl('displayType') !== null){
          this.$utils.replaceParamsFromUrl('displayType',this.show)
        }else{
          this.$utils.addParamsToUrl({
            displayType: this.show
          })
        }
        this.listFetch()
      },
      // 刷新
      refresh(){
        this.listFetch()
      },
      // 置顶
      top(id){
        messagebox.confirm(this,'确定置顶此公告？')
          .then(() => {
            api.top(id,1)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '置顶成功'
                  })
                  setTimeout(() => {
                    this.bulletinLoading = true
                    this.listFetch()
                  },500)
                }
              })
          })
      },
      // 取消置顶
      cancelTop(id){
        messagebox.confirm(this,'确定取消置顶此公告？')
          .then(() => {
            api.top(id,0)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功取消置顶'
                  })
                  setTimeout(() => {
                    this.bulletinLoading = true
                    this.listFetch()
                  },500)
                }
              })
          })
      },
      // 失效
      overdue(id){
        messagebox.confirm(this,'失效后该公告不会显示在用户端，是否确认失效？')
          .then(() => {
            api.status(id,9)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功使该公告失效'
                  })
                  setTimeout(() => {
                    this.bulletinLoading = true
                    this.listFetch()
                  },500)
                }
              })
          })
      },
      // 有效
      valid(id){
        messagebox.confirm(this,'确定重新使该公告有效？')
          .then(() => {
            api.status(id,0)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '该公告已起效'
                  })
                  setTimeout(() => {
                    this.bulletinLoading = true
                    this.listFetch()
                  },500)
                }
              })
          })
      },
      // 删除
      del(id){
        messagebox.confirm(this,'该公告删除后无法恢复，确定删除该公告？')
          .then(() => {
            api.del(id)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  })
                  setTimeout(() => {
                    this.bulletinLoading = true
                    this.listFetch()
                  },500)
                }
              })
          })
      },
    }
  }
</script>
