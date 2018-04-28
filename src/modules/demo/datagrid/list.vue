<template>
  <v-app>
    <div slot="header-title">数据表格组件(v-datagrid)</div>
    <div slot="header-actions">
      <!--<router-link to="/bulletin/create">
        <el-button size="medium" type="primary">发布公告</el-button>
      </router-link>-->
    </div>

    <v-datagrid :url="pageRequest.url">
      <!-- 需要显示的字段 -->
      <el-table-column prop="status" label="状态" width="70"></el-table-column>
      <el-table-column prop="productType" label="类型" width="100"></el-table-column>
      <el-table-column prop="name" label="名称" min-width="100"></el-table-column>
    </v-datagrid>
  </v-app>
</template>

<script>
  export default {
    name: "demo-v-datagrid",
    desc: "数据表格demo",
    data: function () {
      return {
        // 分页数据请求参数
        pageRequest: {
          url: "/pms/product"
        },
      }
    }
  }
</script>
`
