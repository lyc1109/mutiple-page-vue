<style scoped lang="scss" type="text/scss">
  @import "~variables";
</style>

<template>
  <v-app>
    <div slot="header-title">通用表单样式</div>

    <el-form ref="form" :model="formData" :rules="formDataRules" label-width="100px" class="padding-m">
      <el-form-item label="公告标题" prop="subject">
        <el-col :span="12"><el-input v-model="formData.subject"></el-input></el-col>
      </el-form-item>
      <el-form-item label="封面图" prop="coverImageId">
        <el-col :span="12">
          <div v-show="formData.coverImagePath !== ''">
            <img :src="$filters.resizeImg(formData.coverImagePath, 'm_fill,w_360,h_120')"/>
          </div>
          <el-button size="small" @click="isShowMediaPicker = true">选择封面图</el-button>
          <div class="font-s font-lighter inline-block margin-left-s">建议宽高(像素)：360x120</div>
        </el-col>
      </el-form-item>
      <el-form-item label="公告内容" required  prop="content">
        <v-editor v-model="formData.content" placeholder="请输入公告内容"></v-editor>
      </el-form-item>
      <el-form-item label="公告内容2" required  prop="content">
        <v-editor v-model="formData.content2" placeholder="请输入公告内容"></v-editor>
      </el-form-item>
    </el-form>

    <v-mediapicker v-model="isShowMediaPicker" @onOk="onSelectedCoverImg"></v-mediapicker>
  </v-app>
</template>

<script>
  import VEditor from "@/components/v-editor";
  import VFormCurrency from "@/components/v-form-currency";
  import VMediapicker from "@/components/v-mediapicker";

  export default {
    name: "demo-currency",
    components: {VFormCurrency, VMediapicker, VEditor},
    data: function () {
      return {
        formData: {
          subject: "国家版权局：腾讯联手网易促进网络音乐作品全面授权",
          coverImageId: "",
          coverImagePath: "",
          content: "",
          content2: ""
        },
        formDataRules: {
          subject: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
        },

        isShowMediaPicker: false
      }
    },
    methods: {
      /**
       * 选择图片回调
       * @param medias 已选择的图片信息
       */
      onSelectedCoverImg: function (medias) {
        console.log(medias);
        this.formData.coverImageId = medias[0].id;
        this.formData.coverImagePath = medias[0].path;
      },
    }
  }
</script>
