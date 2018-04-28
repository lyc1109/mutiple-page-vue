<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .el-table /deep/{
    tbody tr td:last-child .cell {
      white-space: nowrap;
    }
  }
</style>

<template>
  <el-table
    :data="products"
    stripe
    style="width: 100%"
  >
    <el-table-column prop="productName" label="商品名称">
      <template slot-scope="scope">
        <div class="padding-s valign-center">
          <img :src="$filters.resizeImg(scope.row.productCoverImg,'m_fill,h_100,w_100')" />
          <span class="margin-left-m">{{ scope.row.productName }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="price" label="单件（元）" width="150">
      <template slot-scope="scope">
        {{ $filters.formatRMB(scope.row.price) }}
      </template>
    </el-table-column>
    <el-table-column prop="productNum" label="数量" width="150"></el-table-column>
    <el-table-column prop="adjustFee" label="小计（元）" width="280">
      <template slot-scope="scope">
        <sapn class="color-red-2 font-default font-bold-700">{{ $filters.formatRMB((scope.row.price * scope.row.productNum) + (scope.row.adjustFee * 100)) }}</sapn>
        <span v-if="scope.row.adjustFee > 0" style="color: #999999;">（含修改价格{{ $filters.formatRMB(scope.row.adjustFee * 100) }}元，涨价了）</span>
        <span v-if="scope.row.adjustFee < 0" style="color: #999999;">（含修改价格 -{{ $filters.formatRMB(-scope.row.adjustFee * 100) }}元，降价了）</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: "v-products",
    props: {
      data: {}
    },
    computed: {
      products () {
        return this.data;
      }
    }
  }
</script>
