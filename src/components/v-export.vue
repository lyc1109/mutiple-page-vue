<style scoped lang="scss" type="text/scss">
@import "~variables";

</style>
<template>
    <v-app>
      <el-dialog :visible.sync="exportDialog" title="导出数据" class="export-dialog">
        <el-form :model="exportForm" :ref="exportRef" :rules="exportRule">
          <el-form-item prop="field" label="导出列">
            <el-checkbox-group v-model="exportForm.field" @change="changeField">
              <el-checkbox v-for="item in fieldList" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <solt name="formItem"></solt>
        </el-form>
        <div slot="footer">
          <el-button size="small" @click="close">取消</el-button>
          <el-button type="primary" size="small" @click="sureExport">导出</el-button>
        </div>
      </el-dialog>
    </v-app>
</template>

<script>
  export default {
    name: "v-export",
    props: {
      exportDialogs: {
        type: Boolean,
        default: false
      },
      exportForms: {
        type: Object,
        default: {
          field: []
        }
      },
      exportRefs: {
        type: String,
        default: 'exportForm'
      },
      exportRules: {
        type: Object,
        default: {
          field: [{ required: true,message: '请选择需要导出的列',trigger: 'change' }]
        }
      },
      fieldData: {
        type: Object,
        default: [
          {
            label: '字段1',
            value: '1'
          },
          {
            label: '字段2',
            value: '2'
          },
        ]
      }
    },
    watch: {
      exportDialogs (newVal) {
        return newVal ? this.exportDialog = true : this.exportDialog = false
      }
    },
    data () {
      return {
        exportDialog: this.exportDialogs,
        exportForm: this.exportForms,
        exportRef: this.exportRefs,
        exportRule: this.exportRules,
        fieldList: this.fieldData
      }
    },
    methods: {
      // 改变字段
      changeField (val) {
        this.$emit('changeField',val)
      },
      hide () {
        this.$emit('closeExport',false)
      },
      sure () {
        this.$emit('sureExport',this.exportForm)
      },
      // 关闭
      close () {
        this.$refs[this.exportRef].resetFields()
        this.hide()
      },
      // 确定导出
      sureExport () {
        this.$refs[this.exportRef].validate((valid) => {
          if(valid){
            this.hide()
            this.sure()
            this.$message({
              type: 'success',
              message: '导出成功'
            })
          }
        })
      }
    }
  }
</script>

