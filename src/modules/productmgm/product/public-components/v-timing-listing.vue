<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .inline-block{
    vertical-align: inherit;
  }
  .el-date-editor.el-input{
    width: 300px;
  }
</style>
<template>
  <div class="inline-block">
    <v-form-popover :isShow="isShowTimingListing"
                    :placement="placement"
                    @onOk="sureTimingListing('timingListingForm')"
                    @onCancel="cancelTimingListing('timingListingForm')"
                    :type="type"
                    :size="size"
                    title="定时上架"
                    :isClose="isListingClose">
      <div slot="form">
        <el-form :model="timingListingForm" ref="timingListingForm" :rules="timingListingRule" label-width="100px">
          <el-form-item prop="listingTime" label="上架时间">
            <el-date-picker v-model="timingListingForm.listingTime" :picker-options="disabledDate" size="mini" type="datetime" placeholder="请选择上架时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="delistingTime" label="下架时间">
            <el-date-picker v-model="timingListingForm.delistingTime" :picker-options="disabledDate" size="mini" type="datetime" placeholder="请选择下架时间,若不选则表示不下架"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      定时上架
    </v-form-popover>
  </div>
</template>

<script>
  export default {
    name: "v-timing-listing",
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
      let validEnd = (rule,value,callback) => {
        if(value <= this.timingListingForm.listingTime){
          callback(new Error('下架时间要大于上架时间'))
        }
      }
      return {
        isShowTimingListing: this.isShow,
        isListingClose: this.isClose,
        timingListingForm: {
          listingTime: '',
          delistingTime: ''
        },
        timingListingRule: {
          listingTime: [{ type: 'date',required: true,message: '请选择上架时间',trigger: 'change' }],
          delistingTime: [{ type: 'date',validator: validEnd,trigger: 'change' }]
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
        return val ? this.isShowTimingListing = true : this.isShowTimingListing = false
      },
      isClose (val) {
        return val ? this.isListingClose = true : this.isListingClose = false
      },
      entityId (val) {
        this.id = val
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
                this.timingListingForm.delistingTime = ''
                return false
              }else{
                this.timingListingForm.delistingTime = res.delistingTime
              }

              if(res.listingTime === 0){
                this.timingListingForm.listingTime = ''
              }else{
                this.timingListingForm.listingTime = res.listingTime
              }
            })
        }
      },
      // 确定定时上架
      sureTimingListing (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$productApi.timingListing(this.id,{
              listingTime: this.timingListingForm.listingTime,
              delistingTime: this.timingListingForm.delistingTime
            })
              .then((res) => {
                if(res){
                  this.isListingClose = true
                  this.$message({
                    type: 'success',
                    message: '成功定时上架'
                  })
                  this.fetchData()
                  this.$emit('onOk')
                }
              })
          }
        })
      },
      // 取消定时上架
      cancelTimingListing (formName) {
        this.fetchData()
        this.$emit('onCancel')
        this.$refs[formName].resetFields()
      },
    }
  }
</script>

