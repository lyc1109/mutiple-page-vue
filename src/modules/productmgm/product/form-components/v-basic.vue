<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .create-form{
    /*margin: 0 15%;*/
    width: 100%;
    max-width: none;

    .el-select{
      width: 100%;
    }
  }
  .uploader-btn{
    font-size: 30px;
    width: 70px;
    height: 70px;
    color: $font-light;

    /deep/ .el-button{
      width: 100%;
      height: 100%;

      .el-icon-plus{
        font-size: 24px;
      }
    }
  }
  .cover-img-radio {
    position: relative;

    /*/deep/.el-radio__input{*/
    /*display: none;*/
    /*}*/
    /deep/.el-radio__label{
      padding-left: 0;
    }
    &+.cover-img-radio{
      margin-left: $s;
    }
    .cover-img {
      width: 70px;
      height: 70px;
      @include border-radius;
    }
    .shadow{
      width: 70px;
      height: 70px;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba($black,.7);
      @include border-radius;
    }
    .normal-set{
      width: 70px;
    }
  }
  .el-select,.el-input,.el-textarea{
    width: 45%!important;
  }
</style>
<template>
  <div>
    <el-form :model="basicForm" ref="basicForm" :rules="basicRule" label-width="100px" class="margin-top-xl create-form">
      <el-form-item prop="name" label="商品名称">
        <el-input v-model="basicForm.name" placeholder="请填写商品名称" size="small"></el-input>
      </el-form-item>
      <el-form-item prop="itemCode" label="商品货号">
        <el-input v-model="basicForm.itemCode" placeholder="请填写商品货号" size="small"></el-input>
      </el-form-item>
      <el-form-item prop="sellPoint" label="商品简介">
        <el-input type="textarea" rows="2" v-model="basicForm.sellPoint" placeholder="请填写商品简介" size="small"></el-input>
      </el-form-item>
      <el-form-item prop="tags" label="商品标签">
        <el-select v-model="basicForm.tags" default-first-option allow-create filterable multiple placeholder="请选择商品标签" size="small" @change="changeTags">
          <el-option v-for="item in tagsList" :label="item" :value="item" :key="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="keywords" label="商品关键字">
        <el-input v-model="basicForm.keywords" placeholder="请输入商品关键字" size="small"></el-input>
      </el-form-item>
      <el-form-item prop="orderNo" label="显示排序">
        <el-input type="number" v-model.trim.number="basicForm.orderNo" size="small" placeholder="请输入商品需要显示的排序"></el-input>
        <span class="font-s font-light">PS:数值越大，排序越靠前</span>
      </el-form-item>
      <el-form-item prop="productImagesId" label="商品图片">
        <div :data-id="basicForm.productImagesId">
          <div v-for="(item,index) in coverImageArr" :key="item.id" class="cover-img-radio float-left" @mouseover="showDel(item)" @mouseout="hideDel(item)">
            <img :src="item.path" class="cover-img" />
            <div class="shadow flex justify-center" v-show="item.isShadow">
              <i class="iconfont icon-iot-shanchu color-white font-l cursor-pointer" @click="delImg(index)"></i>
            </div>
            <div class="font-s font-lighter normal-set align-center cursor-pointer" :class="{ 'color-primary': item.mainImg }" @click="setMainImg(item)">
              <i class="el-icon-success"></i>
              <span v-if="!item.mainImg">设为主图</span>
              <span v-if="item.mainImg">主图</span>
            </div>
          </div>
        </div>
        <!--</el-radio-group>-->
        <v-button-ok class="uploader-btn font-bold-700" type=" " v-model="imgInfo" icon="el-icon-plus" @click.native="openImgSelect" :class="{ 'margin-left': coverImageArr.length > 0 }"></v-button-ok>
        <v-mediapicker :multiple="isMultiple" v-model="productImageShow" max="9" @onOk="selectImage"></v-mediapicker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import VMediapicker from '@/components/v-mediapicker'
  import VButtonOk from "../../../../components/v-button-ok";

  export default {
    name: "v-basic",
    data () {
      let imageValid = (rule,value,callback) => {
        if(this.coverImageArr.length === 0){
          callback(new Error('请选择商品图片'))
        }else{
          callback()
        }
      }
      let validInteger = (rule,value,callback) => {
        const reg = /^\d+$/
        if(!reg.test(value)){
          callback(new Error('只能输入大于或等于0的正整数'))
        }else{
          callback()
        }
      }
      return {
        basicForm: {
          name: '',
          itemCode: '',
          sellPoint: '',
          tags: [],
          productTags: '',
          keywords: '',
          orderNo: 0,
          productImagesId: '',
          productImagesIdPrimary: ''
        },
        tagsList: [],
        productImageShow: false,
        coverImageArr: [],
        basicRule: {
          name: [{ required: true,message: '请填写商品名称',trigger: 'blur' }],
          itemCode: [{ required: true,message: '请填写商品货号',trigger: 'blur' }],
          productImagesId: [{ required: true,validator: imageValid,trigger: 'change' }],
          orderNo: [{ validator: validInteger,trigger: 'change' }]
        },
        isMultiple: true,
        imgInfo: ''
      }
    },
    watch: {
      basicForm: {
        handler (val){
          this.$emit('getData',val)
        },
        deep: true
      }
    },
    created () {
      this.getTags()
    },
    mounted () {
      this.$emit('getRef',this.$refs.basicForm)
      this.$emit('getData',this.basicForm)
    },
    methods: {
      // 获取商品标签列表数据
      getTags () {
        this.$productApi.getTags()
          .then((res) => {
            if(res){
              this.tagsList = res
            }
          })
      },
      openImgSelect () {
        if(this.coverImageArr.length >= 9) {
          this.imgInfo = '最多只能上传9张图片哦'
          return false
        }
        this.productImageShow = true
      },
      // 选择图片
      selectImage (data) {
        let arr = []
        data.forEach((value,index) => {
          this.coverImageArr.push({
            id: value.id,
            path: value.path,
            isShadow: false,
            mainImg: false,
          })
          arr.push(value.id)
          this.basicForm.productImagesId = arr.join(';')
        })
        let i = 0
        this.coverImageArr.forEach((value) => {
          if(value.mainImg) {
            i++
          }
        })
        if(i === 0) {
          this.coverImageArr[0].mainImg = true
          this.basicForm.productImagesIdPrimary = this.coverImageArr[0].id
        }
      },
      // 展示图片遮罩
      showDel(data){
        data.isShadow = true
      },
      // 隐藏图片遮罩
      hideDel(data){
        data.isShadow = false
      },
      // 删除图片
      delImg(index){
        this.coverImageArr.splice(index,1)
      },
      // 设置主图
      setMainImg(data){
        this.coverImageArr.forEach((value) => {
          value.mainImg = false
        })
        this.basicForm.productImagesIdPrimary = data.id
        data.mainImg = true
      },
      // 选择商品标签
      changeTags (val) {
        if (val.length === 0) {
          this.basicForm.productTags = ''
        }else{
          this.basicForm.productTags = val.join(';')
        }
      }
    },
    components: {
      VButtonOk,
      VMediapicker
    }
  }
</script>


