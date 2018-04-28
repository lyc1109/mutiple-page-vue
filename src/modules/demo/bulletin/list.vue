<style scoped>
  h1{
    color: red;
  }
</style>

<template>
  <v-app>
    <div slot="header-title">公告管理</div>
    <div slot="header-actions">
      <router-link to="/bulletin/create">
        <el-button size="medium" type="primary">发布公告</el-button>
      </router-link>
    </div>

    <v-datagrid url="/api/v3/bulletin">
      <el-table-column prop="status" label="状态" width="60">
        <template slot-scope="scope">
          <span class="color-gray-1" v-if="scope.row.status === 9">过期</span>
          <span class="color-success" v-if="scope.row.status === 0">正常</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="typeTitle" label="类型" min-width="100" show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="title" label="标题" min-width="300"  show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="renderViewUrl(scope.row.id)">
            <span class="color-danger" v-if="scope.row.top === 1">【置顶】</span>
            {{scope.row.title}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="created" label="创建时间" min-width="120">
        <template slot-scope="scope">
          {{$filters.formatTime(scope.row.created)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="onView(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </v-datagrid>
  </v-app>
</template>

<script>
  export default {
    name: "bulletin",
    data: function () {
      return {
        bulletins: []
      }
    },
    methods: {
      renderViewUrl: function (id) {
        return "/bulletin/" + id + "/view";
      },
      onView: function (row) {
        this.$router.push(this.renderViewUrl(row.id));
      },
      onEdit: function (row) {
        this.$router.push(`/bulletin/${row.id}/edit`);
      }
    }
  }
</script>
