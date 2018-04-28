<style scoped lang="scss" type="text/scss">
  @import "~variables";
</style>

<template>
  <v-app>
    <div slot="header-title">发布公告</div>
    <!--<div slot="header-actions">
      <el-button size="medium" type="primary">保存并发布</el-button>
    </div>-->

    <div class="padding-m">
      <el-form ref="form" :model="formData" :rules="rules" label-width="100px" size="medium">
        <el-form-item label="显示位置">
          <el-checkbox-group v-model="typeArray">
            <el-checkbox label="H">首页</el-checkbox>
            <el-checkbox label="L">租赁中心</el-checkbox>
            <el-checkbox label="R">订单中心</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-switch v-model="isTop"></el-switch>
        </el-form-item>
        <el-form-item label="公告标题" required prop="title">
          <el-input v-model="formData.title" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="封面图" required prop="coverImageId">
          <div v-show="formData.coverImagePath !== ''">
            <img :src="$filters.resizeImg(formData.coverImagePath, 'm_fill,w_360,h_120')"/>
          </div>
          <el-button size="small" @click="isShowMediaPicker = true">选择封面图</el-button>
          <div class="font-s font-lighter inline-block padding-top-m margin-left-s">建议宽高(像素)：360x120</div>
        </el-form-item>
        <el-form-item label="公告内容" required  prop="content">
          <v-editor v-model="formData.content" placeholder="请输入公告内容"></v-editor>
        </el-form-item>

        <el-form-item class="el-form-footer">
          <v-button-back class="margin-right">返回</v-button-back>
          <v-button-ok  @click.native="submitForm" :disabled="saveBtnDisabled" v-model="errMsg">保存并发布</v-button-ok>
        </el-form-item>
      </el-form>
    </div>

    <v-mediapicker v-model="isShowMediaPicker" @onOk="onSelectedCoverImg"></v-mediapicker>
  </v-app>
</template>

<script>
  import VEditor from "@/components/v-editor";
  import VMediapicker from "@/components/v-mediapicker";

  import bulletinApi from "@/apis/api-bulletin";

  export default {
    name: "bulletin-form",
    components: {VEditor, VMediapicker},
    data() {
      return {
        formData: {
          id: '',
          title: '',
          type: '',
          top: 0,
          coverImageId: '',
          coverImagePath: '',
          content: '',
          isNew: true
        },
        isTop: false,
        typeArray: ['H', 'L', 'R'],
        isShowMediaPicker: false,
        errMsg: "",
        saveBtnDisabled: false,

        // 表单校验
        rules: {
          title: {required: true, message: "请填写标题"},
          coverImageId: {required: true, message: "请选择封面图"},
          content: {required: true, message: "请填写公告内容"},
        }
      }
    },
    mounted(){
      const id = this.$route.params.id;
      if(id) {
        this.formData.id = id;
        this.loadDetail();
      }
    },
    methods: {
      /**
       * 选择图片回调
       * @param medias 已选择的图片信息
       */
      onSelectedCoverImg: function (medias) {
        this.formData.coverImageId = medias[0].id;
        this.formData.coverImagePath = medias[0].path;
      },

      // 加载公告详情
      loadDetail: function () {
        bulletinApi.detail(this.formData.id)
          .then((resp) => {
            this.isTop = resp.top === 1;
            this.formData = Object.assign(this.formData, resp);
            this.formData.isNew = false;
            this.typeArray = [];
            for(let type of resp.type.split(",")) {
              this.typeArray.push(type);
            }
          })
      },

      // 提交表单
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            this.errMsg = "表单内容不符合规范，请正确填写";
            return false;
          }

          this.saveBtnDisabled = true;
          this.formData.top = this.isTop ? 1 : 0;
          this.formData.type = this.typeArray.join(",");

          if(this.formData.isNew){
            bulletinApi.create(this.formData)
              .then(() => {
                this.$router.go(-1);
              })
          } else {
            bulletinApi.save(this.formData)
              .then(() => {
                this.$router.go(-1);
              })
          }
        });
      }
    }
  }
</script>
