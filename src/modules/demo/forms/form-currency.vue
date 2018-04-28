<style scoped lang="scss" type="text/scss">
  @import "~variables";
</style>

<template>
  <v-app>
    <div slot="header-title">金额输入组件(v-form-currency)</div>

    <el-row class="padding-m">
      <el-col :span="10">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="金额输入">
            <v-form-currency v-model="totalAmount"></v-form-currency>
            金额值总是以分为单位：{{totalAmount}}分
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row class="padding-m bg">
      <el-col :span="10">
        引入组件：
       <pre>
         import VFormCurrency from "@/components/v-form-currency";
       </pre>

        使用组件：
        <pre>
          &lt;el-form ref=&quot;form&quot; :model=&quot;form&quot; label-width=&quot;80px&quot;&gt;
            &lt;el-form-item label=&quot;金额输入&quot;&gt;
              &lt;v-form-currency v-model=&quot;totalAmount&quot;&gt;&lt;/v-form-currency&gt;
              金额值总是以分为单位：{{totalAmount}}分
            &lt;/el-form-item&gt;
          &lt;/el-form&gt;
       </pre>
      </el-col>
    </el-row>
  </v-app>
</template>

<script>
  import VFormCurrency from "@/components/v-form-currency";

  export default {
    name: "demo-currency",
    components: {VFormCurrency},
    data: function () {
      return {
        totalAmount: 0
      }
    },
    mounted: function () {
      setTimeout(() => {
        this.totalAmount = 1200;
      }, 1000)
    }
  }
</script>
