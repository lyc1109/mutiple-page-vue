<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .spec-form{
    max-width: none;

    .el-checkbox-group{
      width: 90%;
      float: left;
    }
    .spec-image{
      width: 60px;
      height: 60px;
      padding: 0;
      overflow: hidden;
    }
  }
  .width-30{
    width: 30%;
  }
  .inline-block{
    vertical-align: inherit;
  }
  .params-list + .params-list{
    margin-top: $s;
  }
  .form-margin-left-0{
    /deep/ .el-form-item__content {
      margin-left: 0!important;
    }
  }
  .w-39{
    width: 39%;
  }
  .w-33{
    width: 32%;
  }
</style>
<template>
  <div>
    <el-form :model="paramsForm" ref="paramsForm" :rules="paramsRule" class="margin-top-xl spec-form margin-bottom" label-width="100px">
      <el-form-item prop="netWeight" label="商品净重" class="w-39">
        <el-input type="number" v-model.trim.number="paramsForm.netWeight" size="small" placeholder="请输入商品净重">
          <template slot="append">kg</template>
        </el-input>
      </el-form-item>
      <div>
        <el-form-item prop="length" label="商品尺寸" class="inline-block" style="width: 39%;">
          <el-input type="number" v-model.trim.number="paramsForm.length" size="small" placeholder="请输入商品的长">
            <template slot="prepend">长</template>
            <template slot="append">mm</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="width" class="label-none width-30 inline-block form-margin-left-0">
          <el-input type="number" v-model.trim.number="paramsForm.width" size="small" placeholder="请输入商品的宽">
            <template slot="prepend">宽</template>
            <template slot="append">mm</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="height" class="label-none width-30 inline-block form-margin-left-0">
          <el-input type="number" v-model.trim.number="paramsForm.height" size="small" placeholder="请输入商品的高">
            <template slot="prepend">高</template>
            <template slot="append">mm</template>
          </el-input>
        </el-form-item>
      </div>
      <el-form-item prop="warrantyPeriod" label="保修期限" class="w-39">
        <el-input type="number" v-model.trim.number="paramsForm.warrantyPeriod" size="small" placeholder="请输入保修期限" class="float-left short-form">
          <template slot="append">月</template>
        </el-input>
        <el-button type="text" size="small" class="margin-left" v-for="item in warrantyList" :key="item.label" @click="selectWarranty(item.value)">{{ item.label }}</el-button>
      </el-form-item>
      <el-form-item prop="list" label="参数列表">
        <div v-for="(item,index) in paramsForm.productProperty" :key="item.propertyName" class="params-list">
          <el-select v-model="item.propertyName" clearable default-first-option allow-create filterable size="small" @change="changeParams(item,index)" placeholder="可选择也可输入" class="w-33">
            <el-option v-for="i in listData" :label="i.propertyName" :value="i.propertyName" :key="i.propertyDefaultValue"></el-option>
          </el-select>
          <el-input v-model.trim="item.propertyValue" ref="addRefVal" placeholder="参数值(如:5L)" size="small" class="width-30" @change="changeVal"></el-input>
          <el-button type="danger" size="small" @click="delParams(item)">删除</el-button>
        </div>
      </el-form-item>
      <el-button type="primary" size="mini" @click="addParams" style="margin-left: 100px;">添加商品参数</el-button>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "v-product-params",
    props: {
      productType: {
        type: String,
        default: 'ICP'
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
      let validDecimal = (rule,value,callback) => {
        const reg = /^\d+(\.\d{1,2})?$/
        if(!reg.test(value)){
          callback(new Error('只能输入两位小数以下的数字'))
        }else{
          callback()
        }
      }
      return {
        paramsForm: {
          netWeight: 0,
          length: 0,
          width: 0,
          height: 0,
          warrantyPeriod: 0,
          productProperty: [
            { propertyName: '', propertyValue: '' }
          ]
        },
        paramsRule: {
          netWeight: [{ validator: validDecimal,trigger: 'change' }],
          length: [{ validator: validDecimal,trigger: 'change' }],
          width: [{ validator: validDecimal,trigger: 'change' }],
          height: [{ validator: validDecimal,trigger: 'change' }],
          warrantyPeriod: [{ validator: validInteger,trigger: 'change' }]
        },
        warrantyList: [
          {
            label: '三个月',
            value: 3
          },
          {
            label: '半年',
            value: 6
          },
          {
            label: '一年',
            value: 12
          },
          {
            label: '一年半',
            value: 18
          },
          {
            label: '两年',
            value: 24
          },
          {
            label: '三年',
            value: '36'
          }
        ],
        listData: [],
        addListsName: '',
        addListsVal: '',
        // addTagList: [],
        paramsShow: false,
        proType: this.productType,
        paramLists: [
          { propertyName: '', propertyValue: '' }
        ]
      }
    },
    watch: {
      paramsForm: {
        handler (val){
          this.$emit('getData',val)
        },
        deep: true
      },
      productType (val) {
        this.proType = val
        this.getStandParams()
      }
    },
    mounted () {
      this.$emit('getRef',this.$refs.paramsForm)
      this.$emit('getData',this.paramsForm)
      this.$nextTick(() => {
        // if(this.proType === 'iWater') {
          this.getStandParams()
        // }
      })
    },
    methods: {
      // 获取标准参数列表数据
      getStandParams () {
        this.$propertyApi.page({
          page_no: 1,
          page_size: 50,
          product_type: 'iWater'
          // product_type: this.proType
        })
          .then((res) => {
            if(res){
              this.listData = res
            }
          })
      },
      // 添加参数
      addParams(){
        this.paramsForm.productProperty.push({
          propertyName: '',
          propertyValue: ''
        })
      },
      // 关闭添加参数输入框
      delParams (data) {
        this.paramsForm.productProperty.splice(this.paramsForm.productProperty.indexOf(data),1)
      },
      // 选择保修期限
      selectWarranty (val) {
        this.paramsForm.warrantyPeriod = val
      },
      // 选择标准参数
      changeParams (data,index) {
        let obj = {}
        obj = this.listData.find((item) => item.propertyName === data.propertyName)
        if(obj.propertyDefaultValue) {
          this.paramsForm.productProperty[index].propertyValue = obj.propertyDefaultValue
        }
        if(this.paramsForm.productProperty.indexOf(data.propertyName) <= -1){
          this.listData.splice(data.propertyName,1)
        }else{
          this.listData.push({
            propertyName: data.propertyName,
            propertyDefaultValue: data.propertyDefaultValue
          })
        }
      },
      changeVal (val) {
        console.log(this.paramsForm.productProperty)
      }
    }
  }
</script>
