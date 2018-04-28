<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .bulletin-container{
    /*width: 98%;*/
    /*margin: 0 auto;*/
    padding: 15px 0;
    /*text-align: center;*/
  }
  .el-tag--small{
    position: relative;
    top: -2.5px;
  }
  .title-box{
    border-left: 3px solid $primary;
    height: 50px;
    line-height: 50px;
    background: #eee;
    padding-left: 15px;
    font-size: $font-size-m;
    font-weight: 400;
    margin: 0;
  }
  .product-li{
    /*line-height: 35px;*/
    align-items: start;

    &:nth-child(2n){
      background: #f1f1f1;
    }
  }
</style>

<template>
  <v-app>
    <div slot="header-title">公告详情</div>
    <div slot="header-actions">
      <v-button-back size="mini" class="margin-right">返回</v-button-back>
      <router-link :to="'/bulletin/' + this.id + '/edit'">
        <el-button size="mini" type="primary">修改</el-button>
      </router-link>
      <el-button size="mini" type="primary" v-if="!bulletin.top" @click="tops">置顶</el-button>
      <el-button size="mini" type="primary" v-if="bulletin.top" @click="cancelTops">取消置顶</el-button>

      <el-button size="mini" type="primary" v-if="bulletin.status === 9" @click="valid">有效</el-button>
      <el-button size="mini" type="primary" v-if="bulletin.status === 0" @click="overdue">失效</el-button>

      <el-button size="mini" type="primary" @click="del">删除</el-button>
    </div>

    <el-col class="margin-bottom">
      <el-col span="5" class="padding margin-top float-left border margin-right" v-show="bulletin.coverImagePath !== ''">
        <img :src="$filters.resizeImg(bulletin.coverImagePath, 'm_fill,w_360,h_360')"/>
      </el-col>
      <el-col span="18" class="bulletin-container float-left position-relative">
        <h2 class="font-bold-400">
          <span>{{bulletin.title}}</span>

          <!--<span class="color-red-1 font-s" v-if="bulletin.type === 'notice'">【通知公告】</span>-->
          <!--<span class="color-red-1 font-s" v-if="bulletin.type === 'ad'">【广告】</span>-->

          <el-tag type="danger" v-if="bulletin.top" size="small">
            <span>置顶</span>
            <i class="iconfont icon-zengchang font-s"></i>
          </el-tag>

          <el-tag type="info" size="small" v-if="bulletin.status === 9">已过期</el-tag>

          <el-tag type="success" v-if="bulletin.type === 'notice'" size="small">通知公告</el-tag>
          <el-tag type="success" v-if="bulletin.type === 'ad'" size="small">广告</el-tag>

          <!--<span class="color-green-1 font-s">【{{ bulletin.pageNames }}】</span>-->
          <el-tag size="small">{{ bulletin.pageNames }}</el-tag>

        </h2>
        <div class="padding-bottom-s">
          <div class="font-s">
            <span class="margin-right-s">显示方式 </span>
            <span class="font-light" v-if="bulletin.displayType === 'GENERAL'">普通</span>
            <span class="font-light" v-if="bulletin.displayType === 'POPUP'">弹窗</span>
          </div>
        </div>

        <div class="padding-bottom-s">
          <div class="font-s">
            <span class="margin-right-s">有效时间</span>
            <span class="font-light" v-if="!bulletin.effectTime || !bulletin.failureTime">(未知)</span>
            <span class="font-light" v-if="bulletin.effectTime && bulletin.failureTime">{{$filters.formatTime(bulletin.effectTime)}} ~ {{ $filters.formatTime(bulletin.failureTime) }}</span>
          </div>
        </div>

        <div class="font-s">
          <span class="margin-right-s">最后编辑时间</span>
          <span class="font-light">{{$filters.formatTime(bulletin.created)}}</span>
        </div>
      </el-col>
    </el-col>
    <el-col class="border margin-bottom">
      <div class="title-box bg-gray-1">
        <span>公告内容</span>
      </div>
      <div class="padding-m" v-html="bulletin.content"></div>
      <div class="text-align padding-l" v-if="bulletin.content === '' || bulletin.content === null">暂无内容</div>
    </el-col>
    <el-col class="border margin-bottom">
      <div class="title-box"><span>产品信息</span></div>
      <div>
        <div v-for="(item,index) in bulletin.productDtos" v-if="bulletin.productDtos && bulletin.productDtos.length > 0" class="product-li flex padding-m">
          <!--<el-col span="3" class="">-->
          <img :src="$filters.resizeImg(item.coverImage,'m_fill,w_100,h_100')" class="border margin-right border-radius" />
          <!--</el-col>-->
          <el-col span="20">
            <h3 style="margin-bottom: 0;" class="font-bold-400 color-primary">
              <el-button type="text" @click="productDetail(item.id)" class="font-m">{{ item.name }}</el-button>
            </h3>
            <span class="margin-right-s font-s">品牌</span>
            <span class="font-light font-s">{{ item.bandName }}</span>
          </el-col>
        </div>
        <div class="align-center padding-l" v-if="!bulletin.productDtos || bulletin.productDtos.length === 0 || bulletin.productDto === null">
          暂无产品,请
          <router-link :to="`/bulletin/${this.id}/edit`" class="color-primary" style="margin-left: 0;">添加产品</router-link>
        </div>
      </div>
    </el-col>
  </v-app>
</template>

<script>
  import bulletinApi from "@/apis/api-bulletin";
  import messagebox from '@/assets/scripts/iotp-message-box'

  export default {
    name: "bulletin-view",
    data: function () {
      return {
        id: this.$route.params.id,
        bulletin: {},
        entityId: this.$route.params ? this.$route.params.id : ''
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
            console.log(resp)
          })
      },
      // 跳转到产品详情页
      productDetail(id){
        location.href = `/shop/product/${id}`
      },
      // 置顶
      tops () {
        messagebox.confirm(this,'确定置顶此公告？')
          .then(() => {
            bulletinApi.top(this.entityId,1)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '置顶成功'
                  })
                  this.loadDetail()
                }
              })
          })
      },
      // 取消置顶
      cancelTops () {
        messagebox.confirm(this,'确定取消置顶此公告？')
          .then(() => {
            bulletinApi.top(this.entityId,0)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功取消置顶'
                  })
                  this.loadDetail()
                }
              })
          })
      },
      // 失效
      overdue () {
        messagebox.confirm(this,'失效后该公告不会显示在用户端，是否确认失效？')
          .then(() => {
            bulletinApi.status(this.entityId,9)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '该公告已失效'
                  })
                  this.loadDetail()
                }
              })
          })
      },
      // 有效
      valid () {
        messagebox.confirm(this,'确定重新使该公告有效？')
          .then(() => {
            bulletinApi.status(this.entityId,0)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '该公告已起效'
                  })
                  this.loadDetail()
                }
              })
          })
      },
      // 删除
      del () {
        messagebox.confirm(this,'该公告删除后无法恢复，确定删除该公告？')
          .then(() => {
            bulletinApi.del(this.entityId)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  })
                  setTimeout(() => {
                    this.$router.push('/bulletin')
                  },500)
                }
              })
          })
      }
    }
  }
</script>
