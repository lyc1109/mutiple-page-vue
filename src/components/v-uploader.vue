<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .file-item{
    padding: 7px 0;

    .flex-item {
      max-width: 200px;
      padding-right: 10px;
      font-size: $font-size-s;
      @extend %text-wrapper;
    }

    .file-item__progress{
      width: 0;
      height: 2px;
      background-color: $success;
      margin-top: 5px;
    }
  }
</style>

<template>
  <div class="inline-block">
    <el-popover ref="filePopover"
                trigger="hover"
                width="230"
                open-delay="300"
                :placement="filesPopoverPosition"
                v-model="isShowPopover">
      <ul v-show="files.length > 0">
        <li class="file-item" v-for="item in files">
          <div class="flex">
            <div class="flex-item">{{item.name}}</div>
            <div>
              <i class="el-icon-circle-check color-success" v-if="item.status === 'saved'"></i>
              <i class="el-icon-circle-close color-danger" v-if="item.status === 'fail'"></i>
            </div>
          </div>
          <div class="file-item__progress" :style="{width: item.progress+'%'}"></div>
        </li>
      </ul>
      <div class="padding align-center font-light" v-show="files.length === 0">点击按钮开始上传文件</div>
      <div class="align-center margin-top-s" @click="isShowPopover = false">
        <el-button size="mini" type="text">关闭</el-button>
      </div>
    </el-popover>
    <el-upload action=""
               ref="uploader"
               :http-request="startUpload"
               :on-change="onChange"
               :multiple="multiple"
               :accept="accept"
               :show-file-list="false"
               :before-upload="beforeUpload" :drag="drag">
      <el-input v-model="dragVal" v-if="drag" size="small" placeholder="选择sim卡与设备二维码对应的Excel文件"></el-input>
      <el-button :size="btnSize" :type="btnType" v-popover:filePopover>{{title}}</el-button>
    </el-upload>

  </div>
</template>

<script>
  import ossUploader from "@/assets/scripts/iotp-ossuploader";

  import _ from "lodash";

  export default {
    name: "v-uploader",
    props: {
      // 按钮名称
      title: {
        type: String,
        default: "点击上传"
      },
      // 按钮类型: primary / success / warning / danger / info / text
      btnType: {
        type: String,
        default: ""
      },
      // 按钮大小
      btnSize: {
        type: String,
        default: "small"
      },
      // 上传文件夹路径，一般用于鉴别哪个模块上传
      // 值必须以'/'开头，例如："/dev"
      uploadPath: {
        type: String,
        default: ""
      },
      // 是否支持多选
      multiple: {
        type: Boolean,
        default: false
      },
      // 支持文件类型，默认图片。
      // 参考：https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept
      accept: {
        type: String,
        default: "image/*"
      },
      // 文件Popover显示位置
      filesPopoverPosition: {
        type: String,
        default: "top"
      },
      // 上传成功保存到media参数设置
      // 具体属性请查看finalMediaParams计算属性
      saveMediaParams: {
        type: Object,
        default: {}
      },
      // 是否支持拖拽上传
      drag: {
        type: Boolean,
        default: false
      },
      fileName: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {
        // 已选择的文件
        // 每个文件包含status字段，值可能：ready|success|fail|saved
        files: [],
        // 已上传处理数量
        uploadCount: 0,
        // 控制显示文件列表Popover
        isShowPopover: false,
        dragVal: this.fileName
      }
    },
    computed: {
      finalMediaParams: function () {
        return Object.assign({
          // 保存api
          api: "/api/v3/media/save",
          // 保存到分组名称
          group: "",
          // 是否可在素材中心管理
          managable: false,
          // 源文档实体id
          targetId: "",
          // 源文档类型，如Product
          targetType: "",
        }, this.saveMediaParams);
      }
    },
    mounted(){
      //this.isShowPopover = true;
    },
    methods: {
      onChange: function (file, fileList) {
        this.$emit('changeFile',file)
        this.files = fileList;
        if(fileList.length > 0) {
          this.isShowPopover = true;
          this.dragVal = file.name
        }
      },
      beforeUpload: function () {
        this.uploadCount = 0;
      },
      startUpload: function (params) {
        let file = params.file;
        let uploadFile = _.find(this.files, function (o) {
          return o.uid === file.uid;
        });

        ossUploader.upload(file, this.uploadPath, function (progress) {
          uploadFile.progress = progress;
        })
          .then((resp) => {
            uploadFile.status = "success";
            uploadFile.uploadUrl = resp.filePath;
            this.afterUploaded();
          })
          .catch((e) => {
            uploadFile.status = "fail";
            uploadFile.err = "上传失败" + e;
            uploadFile.progress = 0;
            this.afterUploaded();
          });
      },
      afterUploaded: function () {
        this.uploadCount++;
        if(this.uploadCount === this.files.length) {
          this.saveMedias();
          this.uploadCount = 0;
          this.$refs.uploader.clearFiles();

          // 3秒自动消失
          setTimeout(() => {
            this.isShowPopover = false;
          }, 3000);
        }
      },

      saveMedias: function () {
        // 筛选未保存过的文件列表
        let saveFiles = _.filter(this.files, function (o) {
          return o.status === 'success';
        });
        if(saveFiles === null || saveFiles.length === 0) {
          return false;
        }

        // 构建medias
        // file: {"status":"success","name":"paper_345.jpg","size":1547988,"percentage":0,"uid":1520412204663,"raw":{"uid":1520412204663},
        //        "url":"blob:http://localhost:8989/b9598f5d-8dd1-4a6f-8899-520a90fc9ebc","progress":100,"uploadUrl":"/iotp-web/media/20180307/1643/2165ec6b8bcf3898d3c3d01b449addee.jpg"}
        let mediaData = this.finalMediaParams;
        let medias = [];
        for(let file of saveFiles) {
          medias.push({
            mediaType: 0, // 暂时均为图片
            name: file.name,
            path: file.uploadUrl,
            fileSize: file.size
          })
        }
        mediaData.medias = JSON.stringify(medias);
        this.$http.post(mediaData.api, mediaData)
          .then((resp) => {
            // 更新状态
            for(let file of saveFiles) {
              file.status = "saved";
            }
            //console.log(JSON.stringify(saveFiles));
            this.$emit("afterUpload", resp);
          })
          .catch((err) => {
            this.$notify.error({
              title: '错误提示',
              message: '文件上传成功，但路径保存失败。' + err
            });
          })
      }
    }
  }
</script>
