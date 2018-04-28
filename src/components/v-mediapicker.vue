<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .v-mediapicker {
    line-height: normal;
  }

  .v-mediapicker /deep/ {
    .el-dialog__footer {
      background-color: $page_bg;
      @include border(top);
    }

    .el-icon-loading,
    .el-loading-text {
      color: $white;
    }
    .el-icon-loading {
      font-size: 18px;
    }
  }

  .flex {
    align-items: normal;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
  }

  .groups-container {
    background-color: $page_bg;
    height: 500px;
    overflow-y: auto;
    // 导航滚动条宽度为0
    &::-webkit-scrollbar {
      width: 0;
    }

    .group-item {
      width: 130px;
      padding: 10px;
      cursor: pointer;
      font-size: $font-size-s;
      color: $font-light;
      @extend %text-wrapper;

      &:hover {
        background-color: $white;
        color: $font-primary;
        font-weight: bolder;
      }
    }
    .group-item.active {
      background-color: $white;
      font-weight: bolder;
      color: $font-primary;
    }
  }

  .media-container {
    padding: 10px 10px 0 3px;
    height: 440px;

    .media-item {
      position: relative;
      float: left;
      width: 140px;
      height: 130px;
      margin-left: 10px;
      margin-bottom: 10px;
      cursor: pointer;
    }
    .media-item__image {
      margin: 0 auto;
      height: 100px;
      overflow: hidden;
    }
    .media-item__title {
      padding: 5px;
      font-size: $font-size-s;
      color: $font-lighter;
      @extend %text-wrapper;
    }
    .media-item__backdrop {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0,0,0,.4);
      text-align: center;
      line-height: 130px;
    }
  }

  .media-container__pagination {
    text-align: right;
    padding-right: 10px;
  }

  .media-container__pagination /deep/ {
    .btn-prev, .btn-next, .el-pager {
      margin-top: 4px;
      color: $font-light;
    }

    span:not([class*=suffix]),
    .el-input .el-input__inner {
      font-size: $font-size-s;
      color: $font-light;
    }

    .el-pagination__total {
      margin-top: 2px;
    }
  }
</style>

<template>
  <el-dialog class="v-mediapicker" title="素材选择" width="60%" top="5%" :visible="value" @open="onPickerShow" :modal-append-to-body="false">

    <div class="flex">
      <div class="groups-container">
        <ul>
          <li class="group-item"
              v-for="group in mediaGroups"
              @click="toggleGroup(group)"
              :class="{active: group.active}">{{group.name}}
          </li>
        </ul>
      </div>
      <div class="flex-item"
           v-loading="isLoading"
           element-loading-text="品美好生活..."
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.2)"
           element-loading-custom-class="v-loading">
        <div class="media-container">
          <div class="media-item" v-for="(media, index) in mediaData" :key="media.id" @click="selectMedia(media, index)" v-if="mediaData.length > 0">
            <el-card :body-style="{ padding: '0px' }">
              <div class="media-item__image bg-box"
                   :style="{'background-image': 'url('+ $filters.resizeImg(media.path, 'm_fill,w_140,h_140') +')'}"></div>
              <div class="media-item__title">{{media.name}}</div>
            </el-card>
            <div class="media-item__backdrop" v-show="media.selected">
              <i class="el-icon-success color-success icon-xl"></i>
            </div>
          </div>

          <div v-if="mediaData.length === 0" class="padding-m align-center font-lighter">暂无任何素材信息</div>
        </div>
        <div class="media-container__pagination" v-show="mediaData.length > 0">
          <el-pagination
            class="v-pagination"
            @current-change="handleCurPageChange"
            :current-page="pageData.curPage"
            :page-sizes="pageData.pageSizes"
            :page-size="pageData.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pageData.total"
            small="true">
          </el-pagination>
        </div>
      </div>
    </div>

    <div slot="footer">

      <div class="float-left">
        <v-uploader btn-type="primary"
                    upload-path="/media"
                    :save-media-params="saveMediaParams"
                    :multiple="true"
                    @after-upload="afterUpload"></v-uploader>
        <el-button size="small" class="margin-left" @click="openMediaMgm">素材管理</el-button>
      </div>

      <el-button size="small" class="margin-right" @click="onCancel">取 消</el-button>
      <v-button-ok size="small" v-model="errMsg" @click.native="onOk">确 定</v-button-ok>
    </div>
  </el-dialog>
</template>

<script>
  import VUploader from "@/components/v-uploader";
  import mediaApi from "@/apis/api-media";

  export default {
    name: "v-mediapicker",
    components: {VUploader},
    props: {
      // 控制picker显示隐藏，通过v-model来传递
      value: {
        type: Boolean,
        default: false
      },
      // 是否支持多选
      multiple: {
        type: Boolean,
        default: false
      },
      // 多选下最大可选择数量，默认最多9张
      max: {
        type: Number,
        default: 9
      }
    },
    data: function () {
      return {
        // 分组、素材数据
        mediaGroups: [],
        mediaData: [],
        // 上传素材保存参数
        saveMediaParams: {
          group: "",
          managable: true,
        },
        // 分页信息
        pageData: {
          curPage: 1,
          pageSize: 12,
          total: 0,
        },
        // 当前分组
        curGroup: {},
        // 已选择素材
        selectedMedias: [],
        // 是否加载中
        isLoading: false,
        // 显示错误消息
        errMsg: ""
      }
    },
    methods: {
      afterUpload: function (files) {
        // 已上传文件
        //console.log(JSON.stringify(files));
        this.loadPage();
      },

      onPickerShow: function () {
        this.loadGroups();
      },

      loadPage: function () {
        this.isLoading = true;
        for (let group of this.mediaGroups) {
          group.active = false;
        }
        this.curGroup.active = true;

        mediaApi.page({
          group_id: this.curGroup.id,
          page_no: this.pageData.curPage,
          page_size: this.pageData.pageSize
        })
          .then((page) => {
            this.mediaData = page.fileList;
            this.pageData.total = page.totalElements;
            this.hideLoading();
          })
          .catch(() => {

            this.hideLoading();
            //this.$toast.err("数据请求异常。" + err);
          });
      },

      loadGroups: function () {
        mediaApi.groups()
          .then((resp) => {
            this.mediaGroups = resp;
            this.curGroup = this.mediaGroups[0];
            this.loadPage();
          })
      },

      hideLoading: function () {
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      },

      toggleGroup: function (group) {
        this.curGroup = group;
        this.saveMediaParams.group = group.name;
        this.loadPage();
      },

      /**
       * 切换分页
       * @param curPage
       */
      handleCurPageChange: function (curPage) {
        this.pageData.curPage = curPage;
        this.loadPage();
      },

      // 选择图片
      selectMedia: function (media, index) {
        if(this.multiple === false) {
            for(let item of this.mediaData) {
              item.selected = false;
            }
        }
        // 如果最新点击一张已选择则设为false
        // Vue 不能检测对象属性的添加或删除，需要使用$set响应数据变化
        // 参考：https://vuefe.cn/v2/guide/list.html#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9-Caveats
        media.selected = !media.selected;
        this.$set(this.mediaData, index, media);

        // 判断是否超过最大选择数量
        let selectedItems = _.filter(this.mediaData, function (o) {
          return o.selected === true;
        });
        if (this.max > 0 && selectedItems.length > this.max) {
          this.errMsg = "不可超过最大选择数量：" + this.max + "张";

          media.selected = !media.selected;
          this.$set(this.mediaData, index, media);
        }
      },

      /**
       * 回传已选择数据，返回的数据为数组
       */
      onOk: function () {
        let selectedItems = _.filter(this.mediaData, function (o) {
          return o.selected === true;
        });
        if(selectedItems.length === 0) {
          this.errMsg = "请选择图片信息";
          return;
        }
        if (this.max > 0 && selectedItems.length > this.max) {
          this.errMsg = "不可超过最大选择数量：" + this.max + "张";
          return;
        }

        this.$emit("onOk", selectedItems);
        this.$emit("input", false);
      },
      onCancel: function () {
        this.$emit("input", false);
      },

      // 打开素材管理页面
      openMediaMgm: function () {
        window.open("/media");
      }
    }
  }
</script>
