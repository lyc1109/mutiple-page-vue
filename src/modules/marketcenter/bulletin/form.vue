<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .product-list{
    border-bottom: 1px dashed $font-lighter;
  }
  /*.app-body-header{*/
    /*border-bottom: 0 none;*/
  /*}*/
</style>

<template>
  <v-app>
    <div slot="header-title">{{ title }}公告</div>
    <!--<div slot="header-actions">
      <el-button size="medium" type="primary">保存并发布</el-button>
    </div>-->

    <div class="padding-m">
      <el-form ref="form" :model="formData" :rules="rules" label-width="100px" size="medium">
        <el-form-item label="公告标题" required prop="title">
          <el-input v-model="formData.title" placeholder="请输入公告标题" size="small"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="公告类型">
        <el-radio-group v-model="formData.type">
          <el-radio v-for="item in typeList" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
        <el-form-item prop="displayType" label="显示方式">
          <el-radio-group v-model="formData.displayType">
            <el-radio v-for="item in showList" :label="item.name" :key="item.name">{{ item.desc }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示位置" prop="displayPage">
          <el-checkbox-group v-model="displayPage">
            <el-checkbox v-for="item in pageArray" :label="item.name" :key="item.name">{{ item.desc }}</el-checkbox>
            <!--<el-checkbox label="H">首页</el-checkbox>-->
            <!--<el-checkbox label="L">租赁中心</el-checkbox>-->
            <!--<el-checkbox label="R">订单中心</el-checkbox>-->
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否置顶" prop="top">
          <el-switch v-model="formData.top"></el-switch>
        </el-form-item>
        <el-form-item label="封面图" required prop="coverImageId">
          <div v-show="formData.coverImagePath !== ''">
            <img :src="$filters.resizeImg(formData.coverImagePath, 'm_fill,w_360,h_120')"/>
          </div>
          <el-button size="small" @click="isShowMediaPicker = true">选择封面图</el-button>
          <div class="font-s font-lighter inline-block padding-top-m margin-left-s">建议宽高(像素)：360x120</div>
        </el-form-item>
        <el-form-item prop="product" label="相关产品">
          <div class="product-list margin-bottom padding-bottom" v-for="(item,index) in productList" :key="item.id">
            <span class="font-s">{{ item.name }}</span>
            <el-button type="danger" size="mini" class="float-right" @click="delProduct(index)">删除</el-button>
          </div>
          <el-button type="primary" size="small" @click="changeProduct">添加产品</el-button>
        </el-form-item>
        <el-form-item prop="effectDate" label="有效时间">
          <el-date-picker v-model="formData.effectDate"
                          type="datetimerange"
                          format="yyyy-MM-dd HH:mm"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          size="small"
                          @change="changeEffectDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="公告内容" required  prop="content">
          <v-editor v-model="formData.content" placeholder="请输入公告内容"></v-editor>
        </el-form-item>

        <el-form-item class="el-form-footer">
          <v-button-back class="margin-right" size="small">返回</v-button-back>
          <v-button-ok  @click.native="submitForm('form')" size="small" :disabled="saveBtnDisabled" v-model="errMsg">保存并发布</v-button-ok>
        </el-form-item>
      </el-form>
    </div>

    <v-select-product :productDialog="productDialog" @changeProduct="changeProduct" @sureProduct="sureProduct"></v-select-product>
    <v-mediapicker v-model="isShowMediaPicker" @onOk="onSelectedCoverImg"></v-mediapicker>
  </v-app>
</template>

<script>
  import VEditor from "@/components/v-editor";
  import VMediapicker from "@/components/v-mediapicker";

  import bulletinApi from "@/apis/api-bulletin";
  import VSelectProduct from '@/components/v-select-product'

  export default {
    name: "bulletin-form",
    components: {VEditor, VMediapicker,VSelectProduct},
    data() {
      return {
        title: '发布',
        formData: {
          id: '',
          title: '',
          type: 'notice',
          top: 0,
          coverImageId: '',
          coverImagePath: '',
          content: '',
          isNew: true,
          displayPage: '',
          displayType: 'GENERAL',
          products: [],
          effectDate: [],
          effectTime: '',
          failureTime: ''
        },
        displayPage: [],
        isTop: false,
        pageArray: [],
        typeList: [
          {
            label: '通知公告',
            value: 'notice'
          },
          {
            label: '广告',
            value: 'ad'
          }
        ],
        showList: [
          {
            label: '普通',
            value: 'GENERAL'
          },
          {
            label: '弹窗',
            value: 'POPUP'
          }
        ],
        productList: [],
        isShowMediaPicker: false,
        errMsg: "",
        saveBtnDisabled: false,

        // 表单校验
        rules: {
          title: {required: true, message: "请填写标题"},
          coverImageId: {required: true, message: "请选择封面图"},
          content: {required: true, message: "请填写公告内容"},
        },
        productDialog: false
      }
    },
    created(){
      const id = this.$route.params.id;
      if(id) {
        this.title = '修改'
        this.formData.id = id;
        this.loadDetail();
      }
      this.pageFetch()
      this.typeFetch()
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
            this.isTop = resp.top
            this.formData = Object.assign(this.formData, resp);
            this.productList = this.formData.productDtos
            this.formData.isNew = false;
            this.displayPage = [];
            for(let type of resp.displayPage) {
              this.displayPage.push(type);
            }
            if(this.formData.effectTime && this.formData.failureTime){
              this.formData.effectDate.push(this.formData.effectTime,this.formData.failureTime)
            }
          })
      },
      // 获取显示页面基础数据
      pageFetch () {
        bulletinApi.displayPage()
          .then((res) => {
            this.pageArray = res
          })
      },
      // 获取显示方式基础数据
      typeFetch () {
        bulletinApi.displayType()
          .then((res) => {
            this.showList = res
          })
      },
      // 打开添加产品弹框
      changeProduct(data){
        return data ? this.productDialog = true : this.productDialog = false
      },
      // 确定添加产品
      sureProduct(data){
        this.productList = data
        this.productList.forEach((value) => {
          this.formData.products.push(value.id)
        })
        // 去重
        this.formData.products = Array.from(new Set(this.formData.products))
      },
      // 删除产品
      delProduct(index){
        this.productList.splice(index,1)
        this.formData.products = []
        this.productList.forEach((value) => {
          this.formData.products.push(value.id)
        })
      },
      // 改变有效时间
      changeEffectDate (val) {
        console.log(val)
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.errMsg = "表单内容不符合规范，请正确填写";
            return false;
          }

          this.saveBtnDisabled = true;
          this.formData.top = this.formData.top ? 1 : 0;
          this.formData.displayPage = this.displayPage.join(",");
          if(this.formData.effectDate.length > 1){
            this.formData.effectTime = this.$filters.formatDate(this.formData.effectDate[0])
            this.formData.failureTime = this.$filters.formatDate(this.formData.effectDate[1])
          }

          if(this.formData.isNew){
            bulletinApi.create(this.formData)
              .then(() => {
                this.$router.push({
                  path: '/bulletin'
                })
              })
          } else {
            bulletinApi.save(this.formData)
              .then(() => {
                this.$router.push({
                  path: '/bulletin'
                })
              })
          }
        });
      }
    }
  }
</script>
