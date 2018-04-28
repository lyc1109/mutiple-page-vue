<style scoped lang="scss" type="text/scss">
  @import "~variables";
</style>

<template>
  <v-app>
    <div slot="header-title">销售订单</div>
    <div slot="header-actions">
      <!--<router-link to="/order/create">-->
        <!--<el-button size="small" type="primary">创建销售订单</el-button>-->
      <!--</router-link>-->
    </div>
    <v-datagrid :data="orders" :pageDatas="pageDatas" url="/oms/order" :params="params" :selectable="selectable" :isShowLoading="loading">
      <div slot="filter">
        <el-select class="margin-right-s" v-model="params.type" placeholder="请选择订单类型" size="small" @change="searchType">
          <el-option v-for="item in typeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </div>
      <el-table-column prop="orderStatusText" label="订单状态">
        <template slot-scope="scope">
          <span class="color-red-2" v-if="scope.row.cancelStatus === 0">{{ scope.row.cancelStatusText }}</span>
          <span class="color-red-2" v-else-if="scope.row.defendStatus === 0">{{ scope.row.defendStatusText }}</span>
          <span class="color-warning" v-else-if="scope.row.orderStatus === 0">{{ scope.row.orderStatusText }}</span>
          <span class="color-success" v-else-if="scope.row.orderStatus === 10">{{ scope.row.orderStatusText }}</span>
          <span v-else>{{ scope.row.orderStatusText }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderId" label="订单编号">
        <template slot-scope="scope">
          <router-link :to="renderViewUrl(scope.row.id)">
            <span class="color-primary">{{scope.row.orderId}}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="receiverName" label="收货人"></el-table-column>
      <el-table-column prop="receiverMobile" label="收货人手机号码"></el-table-column>
      <el-table-column prop="receiverFullAddress" label="收货地址"></el-table-column>
      <!--<el-table-column prop="operate" label="操作">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" size="small" @click="close(scope.row.id)">关闭</el-button>-->
          <!--<el-button type="text" size="small" @click="reject(scope.row.id)">拒绝</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </v-datagrid>
  </v-app>
</template>

<script>
  import api from '@/apis/api-order'
  import messagebox from '@/assets/scripts/iotp-message-box'

  export default {
    name: "order",
    data: function () {
      return {
        orders: [],
        loading: false,//是否显示加载层
        typeList: [
          {
            label: '全部订单',
            value: 'all'
          },
          {
            label: '待支付',
            value: 'dfk'
          },
          {
            label: '待发货',
            value: 'dfh'
          },
          {
            label: '待取消',
            value: 'dqx'
          },
          {
            label: '维权订单',
            value: 'wqdd'
          }
        ],
        searchPhrase: '',
        pageDatas: {
          curPage: 1,
          pageSize: 10,
          total: 0,
          first: 1,
          last: 10
        },
        selectable: false,
        page: '',
        show: '',
        params: {
          page_sort: "created_desc", //排序方式, 格式为: 排序字段_排序方向, 默认: created_desc
          page_no: 1,
          page_size: 10,
          type: '全部订单',
          q: ''
        }
      }
    },
    mounted() {
//      this.counts(); //暂不使用
    },
    methods: {
      // 分页数据初始化
      listFetch(){
        let that = this;
        that.loading = true;
        api.page(that.params)
          .then((res) => {
            if(res){
              setTimeout(() => {
                that.orders = res.fileList;
                that.pageDatas.total = res.totalElements;
                that.$filters.showPage(that.orders, that.pageDatas.pageSize);
                that.loading = false
              },500)
            }
          })
      },
      //获取订单数量统计
      counts() {
        let that = this;
        api.counts()
          .then((res) => {
            if(res) {
              that.typeList[1].label = '待支付 (' + res.bePaidCount + ')';
              that.typeList[2].label = '待发货 (' + res.beDeliverCount + ')';
              that.typeList[3].label = '待取消 (' + res.beCancelOrderCount + ')';
              that.typeList[4].label = '维权订单 (' + res.defendOrderCount + ')';
            }
          })
      },
      //搜索订单类型
      searchType() {
        if(this.$utils.getParamsFromUrl('type') !== null){
          this.$utils.replaceParamsFromUrl('type', this.params.type)
        }else{
          this.$utils.addParamsToUrl({
            type: this.params.type
          })
        }
        this.listFetch();
      },
      // 跳转到详情页
      renderViewUrl(id) {
        return `/order/${id}`;
      },
      // 刷新
      refresh(){
        this.listFetch()
      },
      //强制关闭订单
      close(id) {
        let that = this;
        messagebox.prompt(that, '请填写强制关闭订单原因')
          .then((data) => {
            api.close(id, data.value)
              .then((res) => {
                if(res){
                  that.$message({
                    type: 'success',
                    message: ''
                  });
                  setTimeout(() => {
                    that.loading = true;
                    that.listFetch();
                  },500)
                }
              })
          })
      },
      //拒绝订单
      reject() {
        let that = this;
        messagebox.prompt(that, '请填写拒绝订单原因')
          .then((data) => {
            api.reject(id, data.value)
              .then((res) => {
                if(res){
                  that.$message({
                    type: 'success',
                    message: ''
                  });
                  setTimeout(() => {
                    that.loading = true;
                    that.listFetch();
                  },500)
                }
              })
          })
      }
    }
  }
</script>
<!--
  订单类型筛选
  dfk：待付款
  dfh：待发货
  dqx：待取消
  wqdd：维权订单
  all：全部
-->
