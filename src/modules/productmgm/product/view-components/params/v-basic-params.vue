<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .line-30{
    line-height: 30px;
  }
  .width-30{
    width: 30%;
  }
</style>
<template>
  <div class="font-s basic-attr">

    <div class="line-30 position-relative" :class="{ 'padding-bottom': closeWeight }" @mouseover="showWeightIcon" @mouseout="hideWeightIcon">
      <span class="margin-right font-light">商品重量</span>
      <b class="font-bold-400" v-if="!closeWeight">{{ productDetail.netWeight }}kg</b>
      <div v-else class="inline-block">
        <el-form :model="weightForm" ref="weightForm" :rules="weightRule">
          <el-form-item prop="netWeight" class="margin-bottom-0">
            <el-input type="number" v-model.trim.number="weightForm.netWeight" placeholder="请输入商品重量" size="mini" @keyup.native.enter="editWeight('weightForm')">
              <template slot="append">kg</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m">
        <div v-if="closeWeight">
          <el-button type="text" size="mini" @click="editWeight('weightForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelWeight('weightForm')">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showWeight" @click="closeWeight = !closeWeight"></i>
      </div>
    </div>

    <div class="line-30 position-relative" @mouseover="showSizeIcon" @mouseout="hideSizeIcon">
      <span class="margin-right font-light">商品尺寸</span>
      <b class="font-bold-400" v-if="!closeSize">{{ productDetail.length }}mm x {{ productDetail.width }}mm x {{ productDetail.height }}mm</b>
      <div v-else class="inline-block" style="width: 70%;">
        <el-form :model="sizeForm" ref="sizeForm" :rules="sizeRule">
          <el-form-item prop="long" class="width-30 inline-block margin-bottom-0">
            <el-input type="number" v-model.trim.number="sizeForm.length" placeholder="请输入商品的长" size="mini">
              <template slot="prepend">长</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="wide" class="width-30 inline-block margin-bottom-0">
            <el-input type="number" v-model.trim.number="sizeForm.width" placeholder="请输入商品的宽" size="mini">
              <template slot="prepend">宽</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="tall" class="width-30 inline-block margin-bottom-0">
            <el-input type="number" v-model.trim.number="sizeForm.height" placeholder="请输入商品的高" size="mini">
              <template slot="prepend">高</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m">
        <div v-if="closeSize">
          <el-button type="text" size="mini" @click="editSize('sizeForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelSize('sizeForm')">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showSize" @click="closeSize = !closeSize"></i>
      </div>
    </div>

    <div class="line-30 position-relative" @mouseover="showWarrantyPeriodIcon" @mouseout="hideWarrantyPeriodIcon">
      <span class="margin-right font-light float-left">保修期限</span>
      <b class="font-bold-400" v-if="!closeWarrantyPeriod">{{ productDetail.warrantyPeriod }}个月</b>
      <div v-else class="inline-block" style="width: 60%;">
        <el-form :model="warrantyPeriodForm" ref="warrantyPeriodForm" :rules="warrantyPeriodRule">
          <el-form-item prop="warrantyPeriod" class="margin-bottom-0">
            <el-input type="number" v-model.trim.number="warrantyPeriodForm.warrantyPeriod" placeholder="请输入保修期限" size="mini">
              <template slot="append">月</template>
            </el-input>
            <el-button type="text" size="mini" v-for="item in warrantyBtnList" :key="item.value" @click="getWarranty(item.value)">{{ item.label }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="float-right margin-right-m">
        <div v-if="closeWarrantyPeriod">
          <el-button type="text" size="mini" @click="editWarrantyPeriod('warrantyPeriodForm')">确定</el-button>
          <el-button type="text" size="mini" @click="cancelWarrantyPeriod('warrantyPeriodForm')">取消</el-button>
        </div>
        <i class="iconfont icon-iot-tijiaodingdan font-light cursor-pointer font-s" v-if="showWarrantyPeriod" @click="closeWarrantyPeriod = !closeWarrantyPeriod"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "v-basic-params",
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    data () {
      let validInteger = (rule,value,callback) => {
        const reg = /^\d+(\.\d{1,2})?$/
        if(!reg.test(value)){
          callback(new Error('只能输入大于或等于0的正整数'))
        }else{
          callback()
        }
      }
      let validFright = (rule,value,callback) => {
        const reg = /^\d+(\.\d{1,2})?$/
        if(!reg.test(value)){
          callback(new Error('只能输入两位小数以内的正数'))
        }else{
          callback()
        }
      }
      return {
        productDetail: this.data,
        showWeight: false,
        showSize: false,
        showWarrantyPeriod: false,
        closeWeight: false,
        closeSize: false,
        closeWarrantyPeriod: false,
        weightForm: {
          netWeight: 0
        },
        sizeForm: {
          length: 0,
          width: 0,
          height: 0
        },
        warrantyPeriodForm: {
          warrantyPeriod: 0
        },
        weightRule: {
          netWeight: [{ required: true,validator: validFright,trigger: 'change' }]
        },
        sizeRule: {
          length: [{ required: true,validator: validFright,trigger: 'change' }],
          width: [{ required: true,validator: validFright,trigger: 'change' }],
          height: [{ required: true,validator: validFright,trigger: 'change' }]
        },
        warrantyPeriodRule: {
          warrantyPeriod: [{ required: true,validator: validInteger,trigger: 'change' }]
        },
        warrantyBtnList: [
          { label: '三个月',value: 3 },
          { label: '半年',value: 6 },
          { label: '一年',value: 12 },
          { label: '一年半',value: 18 },
          { label: '两年',value: 24 },
          { label: '三年',value: 36 }
        ],
      }
    },
    watch: {
      data (val) {
        this.productDetail = val
      }
    },
    mounted () {
      setTimeout(() => {
        this.fetch()
      },300)
    },
    methods: {
      // 初始化数据
      fetchData () {
        this.weightForm.netWeight = this.productDetail.netWeight
        this.sizeForm.length = this.productDetail.length
        this.sizeForm.width = this.productDetail.width
        this.sizeForm.height = this.productDetail.height
        this.warrantyPeriodForm.warrantyPeriod = this.productDetail.warrantyPeriod
      },
      fetch () {
        this.$emit('reload')
      },
      // 确定修改商品重量
      editWeight (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$propertyApi.save(this.$route.params.id,{
              netWeight: this.weightForm.netWeight
            })
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '成功修改商品重量'
                  })
                  this.cancelWeight()
                }
              })
          }
        })
      },
      // 取消修改商品重量
      cancelWeight () {
        this.fetchData()
        this.fetch()
        this.closeWeight = !this.closeWeight
      },
      // 确定修改尺寸
      editSize (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$propertyApi.save(this.$route.params.id,{
              width: this.sizeForm.width,
              length: this.sizeForm.length,
              height: this.sizeForm.height
            })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '成功修改商品尺寸'
                  })
                  this.cancelSize()
                }
              })
          }
        })
      },
      // 取消修改尺寸
      cancelSize () {
        this.fetchData()
        this.fetch()
        this.closeSize = !this.closeSize
      },
      // 确定修改保修期
      editWarrantyPeriod (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$propertyApi.save(this.$route.params.id,{
              warrantyPeriod: this.warrantyPeriodForm.warrantyPeriod,
            })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '成功修改保修期'
                  })
                  this.cancelWarrantyPeriod()
                }
              })
          }
        })
      },
      // 取消修改保修期
      cancelWarrantyPeriod () {
        this.fetchData()
        this.fetch()
        this.closeWarrantyPeriod = !this.closeWarrantyPeriod
      },
      // 保修期快捷方式
      getWarranty (val) {
        this.warrantyPeriodForm.warrantyPeriod = val
      },
      // 显示净重编辑图标
      showWeightIcon () {
        if(this.closeWeight){
          this.hideWeightIcon()
          return false
        }
        this.showWeight = true
      },
      // 隐藏净重编辑图标
      hideWeightIcon () {
        this.showWeight = false
      },
      // 显示尺寸编辑图标
      showSizeIcon () {
        if(this.closeSize){
          this.hideSizeIcon()
          return false
        }
        this.showSize = true
      },
      // 隐藏尺寸编辑图标
      hideSizeIcon () {
        this.showSize = false
      },
      // 显示保修期编辑图标
      showWarrantyPeriodIcon () {
        if(this.closeWarrantyPeriod){
          this.hideWarrantyPeriodIcon()
          return false
        }
        this.showWarrantyPeriod = true
      },
      // 隐藏保修期编辑图标
      hideWarrantyPeriodIcon () {
        this.showWarrantyPeriod = false
      }
    }
  }
</script>

