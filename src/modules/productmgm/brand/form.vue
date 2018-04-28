<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .el-form{
    width: 100%;

    .el-form-item{
      width: 90%;

      .el-input,.el-textarea{
        width: 100%;
      }
      img{
        width: 80px;
        height: 80px;
      }
    }
  }
</style>
<template>
  <div>
    <el-dialog :visible.sync="bandFormDia" :title="title" @close="hide">
      <el-form :model="bandForm" ref="bandForm" :rules="bandRule" label-width="150px" class="position-relative padding-top padding-bottom">
        <el-form-item prop="name" label="品牌名称">
          <el-input v-model.trim="bandForm.name" placeholder="请输入品牌名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item prop="logoImageId" label="品牌图片" class="img-form-item">
          <img :src="$filters.resizeImg(bandForm.logoImage,'m_fill,h_100,w_100')" class="border-radius" v-show="bandForm.logoImage !== ''" />
          <el-button type="primary" size="mini" :data-id="bandForm.logoImageId" @click="selectImg">请选择一张图片</el-button>
        </el-form-item>
        <el-form-item prop="description" label="品牌介绍">
          <el-input type="textarea" size="mini" rows="4" v-model.trim="bandForm.description" placeholder="请输入品牌介绍"></el-input>
        </el-form-item>
        <el-form-item prop="orderNo" label="显示序号">
          <el-input type="number" size="mini" v-model.trim="bandForm.orderNo" placeholder="请输入要显示的序号"></el-input>
          <span class="font-s">显示序号为一个大于0的数字, 数字越大显示时越靠前</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <v-button-ok v-model="sureErrInfo" type="primary" size="mini" @click.native="save('bandForm')">保存</v-button-ok>
        <!--<v-button-ok type="primary" size="mini" v-model="saveBtn" @click.native="save('bandForm')"></v-button-ok>-->
        <el-button size="mini" @click="cancelSubmit('bandForm')">取消</el-button>
      </div>
    </el-dialog>

    <v-mediapicker v-model="bandImgShow" @onOk="uploadImg"></v-mediapicker>
  </div>
</template>

<script>
  import VMediapicker from '@/components/v-mediapicker'

  export default {
    name: "band-form",
    props: {
      // 控制dialog的显示隐藏
      isShow: {
        type: Boolean,
        required: true,
        default: false
      },
      // dialog的标题
      title: {
        type: String,
        default: ''
      },
      // 品牌id
      entityId: {
        type: String,
        required: true
      },
      // 判断是 新建/编辑
      type: {
        type: String,
        required: true,
        default: 'create'
      }
    },
    data () {
      let indexValid = (rule,value,callback) => {
        if(Number(value) % 1 !== 0 || Number(value) <= 0){
          callback(new Error('请输入正整数的序号'))
        }else{
          callback()
        }
      }
      let imgValid = (rule,value,callback) => {
        if(value){
          callback()
        }else{
          callback(new Error('请选择一张品牌图片'))
        }
      }
      return {
        bandFormDia: this.isShow,
        titleText: '新增',
        bandForm: {
          name: '',
          logoImageId: '',
          description: '',
          orderNo: 1,
          logoImage: ''
        },
        bandRule: {
          name: [{
            required: true,
            message: '请输入品牌名称',
            trigger: 'blur'
          }],
          logoImageId: [{
            required: true,
            validator: imgValid,
            trigger: 'change'
          }],
          orderNo: [{
            validator: indexValid,
            trigger: 'blur'
          }]
        },
        id: this.entityId,
        bandImg: '',
        operateType: this.type,
        bandImgShow: false,
        sureErrInfo: ''
      }
    },
    watch: {
      entityId (val) {
        this.id = val
      },
      type (val) {
        this.operateType = val
        // this.fetchData()
      },
      isShow (val) {
        if(val) {
          if(this.operateType === 'create'){
            this.$nextTick(() => {
              this.$refs.bandForm.resetFields()
              this.bandForm.logoImage = ''
              this.id = '-1'
            })
          }else{
            this.fetchData()
          }
          this.bandFormDia = true
        }else {
          this.bandFormDia = false
        }
      },
    },
    // mounted(){
    //   this.$nextTick(() => {
    //   })
    // },
    methods: {
      fetchData () {
        // if(this.operateType === 'edit'){
        this.$proBrandApi.detail(this.id)
          .then((res) => {
            this.bandForm = res
            // this.bandImg = this.bandForm.logoImage
          })
        // }
      },
      // 打开选择图片框
      selectImg () {
        this.bandImgShow = true
      },
      // 上传图片
      uploadImg (data) {
        this.bandForm.logoImage = data[0].path
        this.bandForm.logoImageId = data[0].id
      },
      // 切换显示隐藏
      hide () {
        this.$emit('toggle',false)
        this.bandFormDia = false
      },
      // 取消保存
      cancelSubmit (formName) {
        this.hide()
        if(this.operateType === 'edit'){
          this.fetchData()
        }else {
          this.$refs[formName].resetFields()
          this.bandForm.logoImage = ''
        }
      },
      // 保存
      save(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            console.log(this.bandForm.name)
            this.$proBrandApi.isExist(this.bandForm.name)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'error',
                    message: '此品牌名称重复，请重新填写'
                  })
                  return false
                }
                this.$proBrandApi.save(this.id,this.bandForm)
                  .then((res) => {
                    if(res){
                      this.$message({
                        type: 'success',
                        message: '保存成功'
                      })
                      this.$emit('save')
                      this.hide()
                    }
                  })
              })
          }
        })
      }
    },
    components: { VMediapicker }
  }
</script>

