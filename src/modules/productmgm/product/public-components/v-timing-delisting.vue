<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .inline-block{
    vertical-align: initial;
  }
</style>
<template>
  <div class="inline-block">
    <v-form-popover :isShow="isShowTimingDelisting"
                    :placement="placement"
                    @onOk="sureTimingDelisting('timingDelistingForm')"
                    @onCancel="cancelTimingDelisting('timingDelistingForm')"
                    :type="type"
                    :size="size"
                    class="inline-block"
                    title="定时下架"
                    :isClose="isDelistingClose">
      <div slot="form">
        <el-form :model="timingDelistingForm" ref="timingDelistingForm" :rules="timingDelistingRule" label-width="100px">
          <el-form-item prop="delistingTime" label="下架时间">
            <el-date-picker v-model="timingDelistingForm.delistingTime" :picker-options="disabledDate" size="mini" type="datetime" placeholder="请选择下架时间"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      定时下架
    </v-form-popover>
  </div>
</template>

<script>
  export default {
    name: "v-timing-delisting",
    props: {
      // 控制组件显示隐藏
      isShow: {
        type: Boolean,
        default: false
      },
      // 控制popover显示位置,可选值：top,bottom,left,right等
      placement: {
        type: String,
        default: 'top'
      },
      // 控制popover显示隐藏
      isClose: {
        type: Boolean,
        default: false
      },
      // 商品id
      entityId: {
        type: String,
        required: true
      },
      // 按钮类型，如primary,success,text等
      type: {
        type: String,
        default: 'primary'
      },
      // 按钮大小，如small,mini等
      size: {
        type: String,
        default: 'mini'
      }
    },
    data () {
      return {
        isShowTimingDelisting: this.isShow,
        isDelistingClose: this.isClose,
        timingDelistingForm: {
          delistingTime: ''
        },
        timingDelistingRule: {
          delistingTime: [{ type: 'date',required: true,message: '请选择下架时间',trigger: 'change' }]
        },
        id: this.entityId,
        disabledDate: {
          disabledDate (time) {
            return time.getTime() < Date.now()
          }
        }
      }
    },
    watch: {
      isShow (val) {
        return val ? this.isShowTimingDelisting = true : this.isShowTimingDelisting = false
      },
      isClose (val) {
        return val ? this.isDelistingClose = true : this.isDelistingClose = false
      },
      entityId (val) {
        return this.id = val
      }
    },
    mounted () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        if(this.$route.params.id){
          this.$productApi.getListingTimes(this.$route.params.id)
            .then((res) => {
              if(res.delistingTime === 0){
                this.timingDelistingForm.delistingTime = ''
                return false
              }
              this.timingDelistingForm.delistingTime = res.delistingTime
            })
        }
      },
      // 确定定时下架
      sureTimingDelisting (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$productApi.timingDelisting(this.id,{
              delistingTime: this.timingDelistingForm.delistingTime
            })
              .then((res) => {
                if(res){
                  this.isDelistingClose = true
                  this.$message({
                    type: 'success',
                    message: '成功定时下架'
                  })
                  this.fetchData()
                  this.$emit('onOk')
                }
              })
          }
        })
      },
      // 取消定时上架
      cancelTimingDelisting (formName) {
        this.fetchData()
        this.$emit('onCancel')
        this.$refs[formName].resetFields()
      },
    }
  }
</script>

