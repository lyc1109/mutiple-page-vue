<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .export-title{
    width: 100%;
  }
</style>
<template>
  <v-app>
    <div slot="header-title">设备批量导入</div>
    <div class="padding-m">

      <div class="export-operation" v-if="!successExport">
        <div class="export-title">
          <h2>sim卡设备批量导入</h2>
          <span>请选择一个包含sim卡IMEI码和设备二维码的Excel文件（数据只能在第一个页签，每次导入不要超过1000台设备）</span>
        </div>
        <v-uploader :drag="isDrag" :fileName="fileName" class="margin-top export-uploader" :title="title" accept="application/vnd.ms-excel" @changeFile="changeFile"></v-uploader>

        <div class="export-operate">
          <div v-for="(item,index) in operateList" :key="item.name">
            <el-button type="text" size="small" @click="updateModel(index)">{{ item.name }}</el-button>
            <p>{{ item.state }}</p>
          </div>
        </div>

        <!--<el-popover ref="exports" placement="top" trigger="click" v-model="exportTips">-->
        <!--<span class="color-danger-light"><i class="el-icon-warning margin-right"></i>请选择文件进行上传</span>-->
        <!--</el-popover>-->

        <v-button-ok v-model="errInfo" size="small" @click.native="goExport" class="margin-top" :disabled="saveBtnDisabled">立即导入</v-button-ok>
      </div>

      <div class="export-result" v-if="successExport">
        <div class="export-title">
          <h2>设备批量导入结果</h2>
          <p>
            <i class="el-icon-success color-green-1 margin-right-s"></i>
            <span>已成功导入{{ nums }}台设备</span>
          </p>
          <p>
            <i class="el-icon-error color-red-1 margin-right-s"></i>
            <span>错误记录：{{ errorIndex }}</span>
          </p>
          <div style="margin-left: 22px;">
            <p v-for="(item,index) in errorList">{{ index + 1 }}.{{ item.code }} - {{ item.content }}</p>
          </div>
          <v-button-ok size="small" class="margin-top" @click.native="goOnExport">继续导入</v-button-ok>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
  import VUploader from '@/components/v-uploader'
  import VMessageBox from '@/assets/scripts/iotp-message-box'

  export default {
    name: "list",
    data () {
      return {
        successExport: false,
        title: '选择文件',
        isDrag: true,
        operateList: [
          {
            name: '下载空白的模板文件',
            state: '根据该模板文件使用Excel创建sim卡与设备二维码的对应文件'
          },
          {
            name: '下载批量导入文件示例',
            state: 'sim卡与设备批量导入示例文件'
          }
        ],
        fileName: '',
        nums: 0,
        errorIndex: 0,
        errorList: [
          {
            code: '8652212.14545.1.1.',
            content: '未知设备二维码'
          }
        ],
        exportTips: false,
        errInfo: '',
        saveBtnDisabled: false,
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        this.errorIndex = this.errorList.length
      },
      changeFile(val){
        this.fileName = val
      },
      // 立即导入
      goExport () {
        if(this.fileName === '') {
          this.errInfo = '请选择文件进行上传'
          return false
        }
        this.saveBtnDisabled = true
        VMessageBox.confirm(this, '确定导入此文件？')
          .then(() => {
            this.$message({
              type: 'success',
              message: '导入成功'
            })
            this.successExport = true
          })
          .catch(() => {
            this.saveBtnDisabled = false
          })
      },
      // 继续导入
      goOnExport () {
        this.fileName = ''
        this.successExport = false
        this.saveBtnDisabled = false
      },
      // 下载模板
      updateModel(index){
        switch (index) {
          case 0:
            console.log('下载空白模板')
                break
          case 1:
            console.log('下载已有模板')
                break
          // no default
        }
      }
    },
    components: { VUploader,VMessageBox }
  }
</script>


