<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .v-tab-item{
    background: #99dfff;

    &.actived{
      background: $primary;
    }
  }

</style>
<template>
  <div>
    <el-row justify="center" type="flex" class="v-tabs">
      <el-col :span="tabBoxWidth"
              class="v-tab-item align-center padding-top padding-bottom color-white"
              v-for="(item,index) in tabList"
              :class="{ 'actived': item.active }"
              :key="item.active">
        {{ index + 1 }} {{ item.label }}
      </el-col>
    </el-row>
    <slot></slot>
    <el-col :span="btnBoxWidth" :offset="btnBoxOffset" class="padding border-top">
      <div class="float-right margin-top">
        <el-button size="mini" v-show="tabIndex > 0" @click="prevStep">上一步</el-button>
        <el-button type="success" size="mini" v-show="tabIndex < tabList.length - 1" @click="nextStep">下一步</el-button>
        <el-button type="success" size="mini" v-show="tabIndex === tabList.length - 1" @click="save">保存</el-button>
      </div>
    </el-col>
  </div>
</template>

<script>
  export default {
    name: "v-tabs",
    props: {
      tabList: {
        type: Array,
        default: []
      },
      tabIndex: {
        type: Number,
        default: 0
      },
      btnBoxWidth: {
        type: Number,
        default: 24
      },
      btnBoxOffset: {
        type: Number,
        default: 0
      },
      tabBoxWidth: {
        type: Number,
        default: 24
      }
    },
    data () {
      return {
        tabIndexs: this.tabIndex
      }
    },
    watch: {
      tabIndex (val) {
        this.tabIndexs = val
      }
    },
    methods: {
      // 上一步
      prevStep () {
        if(this.tabIndexs > 0) {
          this.tabList[this.tabIndexs].active = false
          this.tabIndexs --
          this.$emit('prevStep',this.tabIndexs)
        }
      },
      // 下一步
      nextStep () {
        if(this.tabIndexs < this.tabList.length){
          // this.tabIndexs ++
          // this.tabList[this.tabIndexs].active = true
          this.$emit('nextStep',this.tabIndexs)
        }
      },
      // 保存
      save () {
        this.$emit('save')
      }
    }
  }
</script>


