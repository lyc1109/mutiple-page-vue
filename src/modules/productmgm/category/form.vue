<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .el-form{
    .el-form-item{
      width: 90%;

      .el-input{
        width: 100%;
      }
    }
  }
</style>
<template>
  <div>
    <el-dialog :visible.sync="categoryShow" :title="title" @close="cancel('categoryForm')">
      <el-form :model="categoryForm" ref="categoryForm" :rules="categoryRule" label-width="150px" class="padding-top padding-bottom">
        <el-form-item prop="parentName" label="父级名称">
          <el-input v-model.trim="categoryForm.parentName" disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="分类名称">
          <el-input v-model.trim="categoryForm.name" placeholder="请输入分类名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item prop="orderNo" label="显示序号">
          <el-input type="number" v-model.trim.number="categoryForm.orderNo" size="mini" placeholder="请输入要显示的序号"></el-input>
          <span class="font-s">显示序号为一个大于0的数字, 数字越大显示时越靠前</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="save('categoryForm')">保存</el-button>
        <el-button size="mini" @click="cancel('categoryForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "category-form",
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
        default: '-1'
      },
      // 判断是 新建/编辑
      type: {
        type: String,
        default: 'create'
      },
      // 父类id
      parentId: {
        type: String,
        default: ''
      }
    },
    data () {
      let validInteger = (rule,value,callback) => {
        if(Number(value) % 1 !== 0 || Number(value) <= 0){
          callback(new Error('请输入正整数的序号'))
        }else{
          callback()
        }
      }
      return {
        categoryShow: this.isShow,
        id: this.entityId,
        parentIds: this.parentId,
        operateType: this.type,
        categoryForm: {
          parentId: '',
          parentName: '',
          name: '',
          orderNo: 0
        },
        categoryRule: {
          name: [{
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }],
          orderNo: [{
            validator: validInteger,
            trigger: 'change'
          }]
        }
      }
    },
    watch: {
      entityId (val) {
        this.id = val
      },
      parentId (val) {
        this.parentIds = val
      },
      type (val) {
        this.operateType = val
      },
      isShow (val) {
        if(val) {
          if(this.operateType === 'create'){
            if(this.parentIds === '') {
              this.$nextTick(() => {
                this.$refs.categoryForm.resetFields()
              })
            }else{
              this.fetchData()
            }
          }else{
            this.fetchData()
          }
          this.categoryShow = true
        }else {
          this.categoryShow = false
        }
      },
    },
    mounted () {
      this.fetchData()
    },
    methods: {
      // 初始化数据(当为编辑操作时)
      fetchData () {
        if(this.operateType === 'edit'){
          this.categoryForm.parentId = ''
          this.$proCategoryApi.detail(this.id)
            .then((res) => {
              if(res){
                this.categoryForm = res
              }
            })
        }else{
          if(this.parentId !== ''){
            this.id = '-1'
            this.categoryForm.parentId = this.parentIds
            this.$proCategoryApi.detail(this.parentId)
              .then((res) => {
                if(res){
                  // this.categoryForm = res
                  this.categoryForm.parentName = res.name
                  this.categoryForm.orderNo = res.orderNo
                }
              })
          }else{
            this.id = '-1'
            this.categoryForm.parentId = ''
            this.categoryForm.parentName = ''
          }
        }
      },
      // 切换显示隐藏
      hide () {
        this.categoryShow = false
        this.$emit('toggle',false)
      },
      // 保存
      save (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$proCategoryApi.isExist({
              parentId: this.categoryForm.parentId,
              name: this.categoryForm.name
            })
              .then((res) => {
                if(res){
                  // this.errorInfo = ''
                  this.$message({
                    type: 'error',
                    message: '此分类已存在，请修改分类名称'
                  })
                  return false
                }
                this.$proCategoryApi.save(this.id, this.categoryForm)
                  .then((res) => {
                    if(res){
                      this.$message({
                        type: 'success',
                        message: '保存成功'
                      })
                      this.hide()
                      this.$emit('save')
                    }
                  })
              })
          }
        })
      },
      // 取消
      cancel (formName) {
        this.hide()
        if(this.operateType === 'edit'){
          this.fetchData()
        }else {
          this.$refs[formName].resetFields()
        }
      }
    }
  }
</script>

