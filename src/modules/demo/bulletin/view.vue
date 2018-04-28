<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .bulletin-container{
    width: 400px;
    margin: 0 auto;
    padding: 15px;
    text-align: center;
  }
</style>

<template>
  <v-app>
    <div slot="header-title">公告详情</div>
    <div slot="header-actions">
      <v-button-back size="medium" class="margin-right">返回</v-button-back>
      <router-link :to="'/bulletin/' + this.id + '/edit'">
        <el-button size="medium" type="primary">修改</el-button>
      </router-link>
    </div>

    <div class="bulletin-container">
      <h2>{{bulletin.title}}</h2>
      <div class="padding-s font-lighter">
        <span>{{$filters.formatTime(bulletin.created)}}</span>
      </div>

      <div class="padding margin-top" v-show="bulletin.coverImagePath !== ''">
        <img :src="$filters.resizeImg(bulletin.coverImagePath, 'm_fill,w_360,h_120')"/>
      </div>

      <div class="align-left" v-html="bulletin.content"></div>
    </div>
  </v-app>
</template>

<script>
  import bulletinApi from "@/apis/api-bulletin";

  export default {
    name: "bulletin-view",
    data: function () {
      return {
        id: this.$route.params.id,
        bulletin: {}
      }
    },
    mounted(){
      this.loadDetail();
    },
    methods: {
      // 加载公告详情
      loadDetail: function () {
        bulletinApi.detail(this.id)
          .then((resp) => {
            this.bulletin = resp;
          })
      },
    }
  }
</script>
