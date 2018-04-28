<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .el-form {
    margin-top: 20px;

    .el-form-item {
      width: 90%;
      margin-bottom: 20px;

      .el-select,.el-input,.el-input-number {
        width: 100% !important;
      }
      .el-input-number__decrease, .el-input-number__increase {
        top: 4px;
        height: 28.5px;
        line-height: 28.5px;
      }
      .el-form-item__content{
        & > .left{
          width:32%!important;
        }
        & > .center{
          width: calc(30% - 8px) !important;
        }
        & > .right{
          width: 31% !important;

          .el-input__inner{
            border-top-right-radius: 0!important;
            border-bottom-right-radius: 0!important;
          }
          .el-input-group__append{
            font-size: 12px;
          }
        }
      }

      &.filter{
        width: 31%;
        float: none;
        display: inline-block;
        //margin-right: 0!important;

        .el-input{
          width: 100%!important;
        }
        .el-form-item{
          margin-bottom: 0!important;
        }
      }
    }
  }
  .filter-element{
    margin-bottom: 0!important;

    .el-form-item__content{
      display: flex;

      &>div{
        flex: 1;
        margin-right: 5px;

        &:last-child{
          margin-right: 0;
        }
      }
    }
  }
</style>
<template>
  <div>
    <el-dialog :visible.sync="modelFormShow" :title="title" class="form-dialog" @close="cancel('modelForm')">
      <el-form label-width="150px" :rules="modelRule" :model="modelForm" ref="modelForm">
        <el-form-item prop="modelName" label="模板名称">
          <el-input size="mini" v-model="modelForm.modelName"  placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="模板代码" prop="modelCode">
          <el-input size="mini" v-model="modelForm.modelCode" placeholder="请输入型号编码"></el-input>
        </el-form-item>
        <el-form-item label="智能设备类型" prop="iotDeviceType">
          <el-select size="mini" v-model="modelForm.iotDeviceType" placeholder="请选择智能设备类型">
            <el-option :label="modelForm.iotDeviceType" :value="modelForm.iotDeviceType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通讯协议" prop="firmwareId">
          <el-select size="mini" v-model="modelForm.firmwareId" placeholder="请选择通讯协议">
            <el-option v-for="item in firmwareList" :key="item" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备废水比" prop="wastewaterRatio">
          <el-input-number size="mini" type="number" placeholder="请输入内容" :min="0" step="0.1" class="" style="width: 180px;"
                           v-model="modelForm.wastewaterRatio"></el-input-number>
        </el-form-item>
        <el-form-item label="水机滤芯配置" prop="waterConfigure">
          <el-select size="mini" style="width: 180px;" v-model="waterConfigure"
                     v-on:change="changeValue"
                     placeholder="请选择水机滤芯配置" required="true">
            <el-option v-for="item in waterConfigureList" :key="item" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item,index) in filterLists" :key="item" :label="item.label" class="filter-element" v-if="item.filterShow" required="true">
          <el-select class="left" size="mini" v-model="modelForm.parts[index].productId" filterable="true" placeholder="选择该厂商下面的配件" v-on:change="changeVal(modelForm.parts[index].productId,index)">
            <el-option
              v-for="it in filterSelect"
              :key="it"
              :label="it.name"
              :value="it.id">
            </el-option>
          </el-select>
          <el-form-item class="filter">
            <el-input type="number"
                      class="center" size="mini"
                      v-model.number.trim="modelForm.parts[index].totalWaterflow"
                      placeholder="净水通量（升）"
                      v-on:keyup.native="validateFlow(index)"
                      v-on:afterpaste.native="validateFlow(index)"></el-input>
          </el-form-item>
          <!--<el-select class="right"  v-model="modelForm.parts[index].validMonths" placeholder="选择配件有效期">-->
          <!--<el-option v-for="items in validMonthList" :label="items.label" :value="items.value"></el-option>-->
          <!--</el-select>-->
          <el-input type="number"
                    class="right" size="mini"
                    v-model.number.trim="modelForm.parts[index].validMonths"
                    v-on:keyup.native="validateMonths(index)"
                    v-on:afterpaste.native="validateMonths(index)"
                    placeholder="请输入配件有效期">
            <template slot="append">月</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="memos">
          <el-input type="textarea" size="mini" :rows="4" v-model="modelForm.memos"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" size="mini" @click="save('modelForm')">保存</el-button>
        <el-button size="mini" @click="cancel('modelForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "iotmodel-form",
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '新增智能模板'
      },
      // 智能模板id
      entityId: {
        type: String,
        default: '-1'
      },
      // 判断是 新建/编辑
      type: {
        type: String,
        default: 'create'
      }
    },
    data(){
      let wasteValid = (rule,value,callback) => {
        // const reg = /^([1-9]|10|[1-9]\.\d)$/
        const reg = /^[0-9]+([.][0-9]{1}){0,1}$/
        if(!reg.test(value)) {
          callback(new Error('最多保留一位小数'))
        }else if(Number(value) < 0){
          callback(new Error('亲，不能输入负数哦~'))
        }else{
          callback()
        }
      }
      return {
        modelFormShow: this.isShow,
        waterConfigureList: [
          {
            label: 3,
            value: 3
          },
          {
            label: 4,
            value: 4
          },
          {
            label: 5,
            value: 5
          },
        ],
        addDialog: false,
        modelForm: {
          modelName: '',
          iotDeviceType: 'iWater',
          firmwareId: '',
          modelCode: '',
          wastewaterRatio: '',
          memos: '',
          parts: [
            {
              code: '',
              name: '',
              orderNo: 1,
              productId: '',
              totalWaterflow: 0,
              validMonths: 0
            }, {
              code: '',
              name: '',
              orderNo: 2,
              productId: '',
              totalWaterflow: 0,
              validMonths: 0
            }, {
              code: '',
              name: '',
              orderNo: 3,
              productId: '',
              totalWaterflow: 0,
              validMonths: 0
            }, {
              code: '',
              name: '',
              orderNo: 4,
              productId: '',
              totalWaterflow: 0,
              validMonths: 0
            }, {
              code: '',
              name: '',
              orderNo: 3,
              productId: '',
              totalWaterflow: 0,
              validMonths: 0
            }
          ],
        },
        modelRule: {
          modelName: [{ required: true,message: '请输入商品名称',trigger: 'blur' }],
          modelCode: [{ required: true,message: '请输入型号编码',trigger: 'blur' }],
          firmwareId: [{ required: true,message: '请选择通讯协议',trigger: 'change' }],
          wastewaterRatio: [{ required: true,validator: wasteValid,trigger: 'change' }],
          iotDeviceType: [{ required: true,message: '请选择智能设备类型',trigger: 'blur' }],
          // waterConfigure: [{ required: true,message: '请选择水机滤芯配置',trigger: 'change' }]
        },
        waterConfigure: 3,
        filterSelect: [],
        selectNum: 3,
        validMonthList: [
          {
            label: '3个月',
            value: 3
          },
          {
            label: '6个月',
            value: 6
          },
          {
            label: '12个月',
            value: 12
          }
        ],
        filterLists: [
          {
            label: '第一级滤芯',
            filterShow: true
          },
          {
            label: '第二级滤芯',
            filterShow: true
          },
          {
            label: '第三级滤芯',
            filterShow: true
          },
          {
            label: '第四级滤芯',
            filterShow: false
          },
          {
            label: '第五级滤芯',
            filterShow: false
          }
        ],
        id: '-1',
        operateType: 'create',
        firmwareList: [],
      }
    },
    watch: {
      entityId (val) {
        this.id = val
      },
      type (val) {
        this.operateType = val
      },
      isShow (val) {
        if(val){
          if(this.operateType === 'create') {
            this.$nextTick(() => {
              this.$refs.modelForm.resetFields()
              this.modelForm.parts.forEach((value) => {
                value.productId = ''
                value.totalWaterflow = ''
                value.validMonths = 0
              })
            })
          }else{
            this.fetchData()
          }
          this.modelFormShow = true
        }else{
          this.modelFormShow = false
        }
      },
    },
    created(){
      this.getParts()
      this.getFirmwares()
      // this.fetchData()
    },
    methods: {
      // 获取滤芯选项数据
      getParts () {
        this.$productApi.page({
          product_type: 'PJ',
          page_size: 100,
          page_sort: 'gmtCreated_desc'
        })
          .then((res) => {
            if(res){
              this.filterSelect = res.fileList
              this.filterSelect.forEach((value) => {
                let that = this
                that.modelForm.parts.forEach((ele, index) => {
                  if (index < that.modelForm.parts.length) {
                    ele.totalWaterflow = that.modelForm.parts[index].totalWaterflow
                    ele.validMonths = that.modelForm.parts[index].validMonths
                    ele.name = that.modelForm.parts[index].name
                    ele.productId = that.modelForm.parts[index].productId
                    ele.code = that.modelForm.parts[index].code
                    if (ele.productId === value.id) {
                      ele.productId = that.modelForm.parts[index].productId
                    }
                  }
                })
              })
            }
          })
      },
      // 获取通讯协议选项数据
      getFirmwares () {
        this.$iotmodelApi.firmwares()
          .then((res) => {
            if(res){
              this.firmwareList = res
            }
          })
      },
      // 当编辑时获取数据
      fetchData(){
        this.$iotmodelApi.detail(this.id)
          .then((res) => {
            this.modelForm = res
            if (this.modelForm.parts !== null) {
              this.waterConfigure = this.modelForm.parts.length
              // let that = this
              switch (this.waterConfigure) {
                case 3:
                  this.filterLists[0].filterShow = true
                  this.filterLists[1].filterShow = true
                  this.filterLists[2].filterShow = true
                  this.filterLists[3].filterShow = false
                  this.filterLists[4].filterShow = false
                  break
                case 4:
                  this.filterLists[0].filterShow = true
                  this.filterLists[1].filterShow = true
                  this.filterLists[2].filterShow = true
                  this.filterLists[3].filterShow = true
                  this.filterLists[4].filterShow = false
                  break
                case 5:
                  this.filterLists[0].filterShow = true
                  this.filterLists[1].filterShow = true
                  this.filterLists[2].filterShow = true
                  this.filterLists[3].filterShow = true
                  this.filterLists[4].filterShow = true
                  break
                // no default
              }
            }
          })
      },
      // 改变滤芯个数
      changeValue(select){
        if (select === 3) {
          this.filterLists[3].filterShow = false
          this.filterLists[4].filterShow = false
          // this.filterLists[5].filterShow = false
        } else if (select === 4) {
          this.filterLists[3].filterShow = true
          this.filterLists[4].filterShow = false
          // this.filterLists[5].filterShow = false
        } else if (select === 5) {
          this.filterLists[3].filterShow = true
          this.filterLists[4].filterShow = true
          // this.filterLists[5].filterShow = false
        }
      },
      // 选择配件
      changeVal(val,index){
        let obj = {}
        obj = this.filterSelect.find ((item) => item.id === val)
        this.modelForm.parts[index].name = obj.name
        this.modelForm.parts[index].code = obj.itemCode
      },
      // 保存
      save(form){
        this.$refs[form].validate((valid) => {
          if(valid){
            let $i = 0
            for(let i = 0,len = this.modelForm.parts.length;i < len;i++) {
              if (this.filterLists[i].filterShow) {
                if(this.modelForm.parts[i].totalWaterflow === '' || this.modelForm.parts[i].productId === '' || this.modelForm.parts[i].validMonths === ''){
                  $i++
                }
              }
            }
            if($i > 0){
              this.$message({
                type: 'error',
                message: '滤芯选项不能为空'
              })
              return false
            }

            let parts = []
            this.modelForm.parts.forEach((value) => {
              if(value.productId){
                parts.push(value)
              }
            })
            this.$iotmodelApi.save(this.id, {
              firmwareId: this.modelForm.firmwareId,
              // 不传id就是添加，传入id就是修改
              id: this.id,
              iotDeviceType: this.modelForm.iotDeviceType,
              memos: this.modelForm.memos,
              // modelCode 要唯一
              modelCode: this.modelForm.modelCode,
              modelName: this.modelForm.modelName,
              parts: parts,
              wastewaterRatio: this.modelForm.wastewaterRatio
            })
              .then((res) => {
                if(res) {
                  this.$message({
                    type: 'success',
                    message: `保存成功`
                  })
                  this.hide()
                  this.$emit('save')
                }
              })
          }
        })
      },
      validateFlow(index){
        if(this.modelForm.parts[index].totalWaterflow.toString().indexOf('.') > -1){
          // console.log('只能输入整数')
          this.modelForm.parts[index].totalWaterflow = Math.floor(this.modelForm.parts[index].totalWaterflow)
        }else if(this.modelForm.parts[index].totalWaterflow < 0){
          // console.log('只能输入正数')
          this.modelForm.parts[index].totalWaterflow = Math.abs(this.modelForm.parts[index].totalWaterflow)
        }
      },
      validateMonths(index){
        if(this.modelForm.parts[index].validMonths.toString().indexOf('.') > -1){
          // console.log('只能输入整数')
          this.modelForm.parts[index].validMonths = Math.floor(this.modelForm.parts[index].validMonths)
        }else if(this.modelForm.parts[index].validMonths < 0){
          // console.log('只能输入正数')
          this.modelForm.parts[index].validMonths = Math.abs(this.modelForm.parts[index].validMonths)
        }
      },
      // 取消
      cancel (formName) {
        this.hide()
        if(this.operateType === 'edit'){
          this.fetchData()
        }else{
          this.$refs[formName].resetFields()
          this.modelForm.parts.forEach((value) => {
            value.productId = ''
            value.totalWaterflow = ''
            value.validMonths = 0
          })
        }
      },
      // 切换显示隐藏
      hide () {
        this.modelFormShow = false
        this.$emit('toggle',false)
      }
    }
  }
</script>

