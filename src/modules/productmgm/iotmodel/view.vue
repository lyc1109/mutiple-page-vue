<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .line-height-30{
    line-height: 30px;
  }
  .align-right{
    margin-right: $s;
  }
  .el-col-12{
    span {
      color: #333;
      font-weight: 400;
    }
  }
</style>
<template>
  <div>
    <el-dialog :visible.sync="modelView" :title="title" @close="hide">
      <div class="padding-top padding-bottom">
        <div class="font-s">
          <el-row class="line-height-30">
            <el-col span="5" class="align-right font-light"><span>模版类型</span></el-col>
            <el-col span="12">
              <span v-if="data.iotDeviceType === null || data.iotDeviceType === ''">(未知)</span>
              <span v-else>{{ data.iotDeviceType }}</span>
            </el-col>
          </el-row>

          <el-row class="line-height-30">
            <el-col span="5" class="align-right font-light"><span>模版名称</span></el-col>
            <el-col span="12">
              <span v-if="data.modelName === null || data.modelName === ''">(未知)</span>
              <span v-else>{{ data.modelName }}</span>
            </el-col>
          </el-row>

          <el-row class="line-height-30">
            <el-col span="5" class="align-right font-light"><span>模版代码</span></el-col>
            <el-col span="12">
              <span v-if="data.modelCode === null || data.modelCode === ''">(未知)</span>
              <span v-else>{{ data.modelCode }}</span>
            </el-col>
          </el-row>

          <el-row class="line-height-30">
            <el-col span="5" class="align-right font-light"><span>设备废水比</span></el-col>
            <el-col span="12">
              <span v-if="data.wastewaterRatio === null || data.wastewaterRatio === ''">(未知)</span>
              <span v-else>{{ data.wastewaterRatio }}</span>
            </el-col>
          </el-row>

          <el-row class="line-height-30" v-for="(item,index) in data.parts" :key="item">
            <el-col span="5" class="align-right font-light"><span>第{{ index + 1 }}级滤芯</span></el-col>
            <el-col span="12">
              <span class="margin-right-s">{{ item.name }}</span>
              <span class="margin-right-s">净水量{{ item.totalWaterflow / 1000 }}(升)</span>
              <span>有效期{{ item.validMonths }}个月</span>
            </el-col>
          </el-row>

          <el-row class="line-height-30">
            <el-col span="5" class="align-right font-light"><span>备注</span></el-col>
            <el-col span="12">
              <span v-if="data.memos === null || data.memos === ''">(未知)</span>
              <span>{{ data.memos }}</span>
            </el-col>
          </el-row>

          <el-row class="line-height-30">
            <el-col span="5" class="align-right font-light"><span>最后编辑时间</span></el-col>
            <el-col span="12">
              <span v-if="data.modified === null || data.modified === '' || data.modified === 0">(未知)</span>
              <span>{{ $filters.formatTime(data.modified) }}</span>
            </el-col>
          </el-row>

        </div>
      </div>
      <div slot="footer">
        <el-button size="mini" @click="hide">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "iotmodel-view",
    props: {
      // 智能模板数据
      entityId: {
        type: String,
        required: true,
        default: ''
      },
      // 弹出框显示隐藏
      isShow: {
        type: Boolean,
        default: false
      },
      // 弹出框标题
      title: {
        type: String,
        default: '智能模板详情'
      }
    },
    // computed: {
    // detail () {
    //   return this.data
    // },
    // },
    watch: {
      entityId (val) {
        this.id = val
      },
      isShow (val) {
        // return val ? this.modelView = true : this.modelView = false
        if(val){
          this.modelView = true
          this.fetchData()
        }else{
          this.modelView = false
        }
      }
    },
    // mounted () {
    //   this.fetchData()
    // },
    data () {
      return {
        modelView: this.isShow,
        id: this.entityId,
        data: {}
        // detail: this.data
      }
    },
    methods: {
      // 初始化数据
      fetchData () {
        this.$iotmodelApi.detail(this.entityId)
          .then((res) => {
            if(res){
              this.data = res
            }
          })
      },
      // 控制显示隐藏
      hide () {
        this.modelView = false
        this.$emit('toggle',false)
      }
    }
  }
</script>

