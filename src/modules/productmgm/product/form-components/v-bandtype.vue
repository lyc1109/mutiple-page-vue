<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .create-form{
    /*margin: 0 15%;*/
    width: 100%;
    max-width: none;

    .el-select{
      width: 45%;
    }
  }
</style>
<template>
  <div>
    <el-form :model="typeForm" ref="typeForm" :rules="typeRule" label-width="120px" class="margin-top-xl create-form">
      <el-form-item prop="productType" label="商品类型">
        <el-radio-group v-model="typeForm.type" @change="changeType" size="small">
          <el-radio v-for="item in typeList" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="iotDeviceType" label="智能商品类型" v-if="isIot">
        <el-select v-model="typeForm.iotDeviceType" default-first-option filterable placeholder="请选择智能商品类型" size="small">
          <el-option v-for="item in iotTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="iotDeviceModel" label="智能商品型号" v-if="isIot">
        <el-select v-model="typeForm.iotDeviceModel" default-first-option filterable placeholder="请选择智能商品型号" size="small">
          <el-option v-for="item in iotCodeList" :label="item.modelName" :value="item.modelCode" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="bandId" label="商品品牌">
        <el-select v-model="typeForm.bandId" placeholder="请选择商品品牌" size="small" default-first-option filterable allow-create @change="changeBrandId">
          <el-option v-for="item in bandList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="category" label="商品分类">
        <el-select v-model="typeForm.category" default-first-option filterable multiple allow-create multiple-limit="3" placeholder="请选择商品分类,最多可选择三个" @change="changeCate" size="small">
          <el-option v-for="item in categoryList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
        <span class="font-s font-light">PS:最多可选择三个</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "v-bandtype",
    data () {
      return {
        typeForm: {
          type: 'ICP',
          productType: 'CP',
          iotDeviceType: '',
          iotDeviceModel: '',
          bandId: '',
          category: '',
          category1: '',
          category2: '',
          category3: '',
          deviceType: 'I'
        },
        typeRule: {
          productType: [{ required: true,message: '请选择商品类型',trigger: 'change' }],
          iotDeviceType: [{ required: true,message: '请选择智能商品类型',trigger: 'change' }],
          iotDeviceModel: [{ required: true,message: '请选择智能商品型号',trigger: 'change' }],
          bandId: [{ required: true,message: '请选择商品品牌',trigger: 'change' }],
          category: [{ required: true,message: '请选择商品分类',trigger: 'change' }]
        },
        typeList: [
          {
            label: '智能商品',
            value: 'ICP'
          },
          {
            label: '商品',
            value: 'CP'
          },
          {
            label: '配件',
            value: 'PJ'
          },
          {
            label: '赠品',
            value: 'ZP'
          }
        ],
        iotTypeList: [
          { label: '净水机', value: 'iWater' },
          { label: '新风系统/空净机设备', value: 'iAir' }
        ],
        iotCodeList: [],
        bandList: [],
        categoryList: [],
        isIot: true,
      }
    },
    watch: {
      typeForm: {
        handler (val){
          this.$emit('getData',val)
        },
        deep: true
      }
    },
    created () {
      this.getBrandList()
      this.getCategoryList()
      this.getIotmodel()
    },
    mounted () {
      if(this.$route.query.productType){
        this.typeForm.type = this.$route.query.productType
      }
      if(this.typeForm.type === 'ICP'){
        this.isIot = true
        this.typeForm.deviceType = 'I'
        this.typeForm.productType = 'CP'
      } else {
        this.isIot = false
        this.typeForm.deviceType = 'C'
        this.typeForm.productType = this.typeForm.type
      }
      this.$emit('getRef',this.$refs.typeForm)
      this.$emit('getData',this.typeForm)
    },
    methods: {
      // 获取品牌列表数据
      getBrandList () {
        this.$proBrandApi.page({
          page_no: 1,
          page_size: 100
        })
          .then((res) => {
            if(res){
              if(res) {
                this.bandList = res.fileList
              }
            }
          })
      },
      // 获取分类列表数据
      getCategoryList () {
        this.$proCategoryApi.page({
          page_no: 1,
          page_size: 100
        })
          .then((res) => {
            if(res){
              this.categoryList = res.fileList
            }
          })
      },
      // 获取智能商品型号
      getIotmodel () {
        this.$iotmodelApi.page({
          page_no: 1,
          page_size: 100
        })
          .then((res) => {
            if(res){
              this.iotCodeList = res.fileList
            }
          })
      },
      // 是否为智能商品
      changeType(val){
        if(val === 'ICP'){
          this.isIot = true
          this.typeForm.deviceType = 'I'
          this.typeForm.productType = 'CP'
        }else{
          this.isIot = false
          this.typeForm.deviceType = 'C'
          this.typeForm.productType = this.typeForm.type
        }
      },
      // 选择商品分类
      changeCate (val) {
        let i = 0
        if (val.length < 4) {
          this.categoryList.forEach((value) => {
            if (val === value.id) {
              i = 1
            }
          })
          if(i === 0){
            let arr = []
            this.$proCategoryApi.save('-1',{
              name: val[val.length - 1]
            })
              .then((res) => {
                if(res){
                  switch (val.length) {
                    case 1:
                      this.typeForm.category1 = res
                      this.typeForm.category2 = ''
                      this.typeForm.category3 = ''
                      arr.push(res)
                      break
                    case 2:
                      this.typeForm.category2 = res
                      this.typeForm.category3 = ''
                          break
                    case 3:
                      this.typeForm.category3 = res
                      break
                    // no default
                  }
                }
              })
          }else{
            switch (val.length) {
              case 1:
                this.typeForm.category1 = val[0]
                this.typeForm.category2 = ''
                this.typeForm.category3 = ''
                break
              case 2:
                this.typeForm.category1 = val[0]
                this.typeForm.category2 = val[1]
                this.typeForm.category3 = ''
                break
              case 3:
                this.typeForm.category1 = val[0]
                this.typeForm.category2 = val[1]
                this.typeForm.category3 = val[2]
                break
              // no default
            }
          }
        }
      },
      // 创建/选择品牌
      changeBrandId (val) {
        let i = 0
        this.bandList.forEach((item) => {
          if(item.id === val){
            i = 1
          }
        })
        if (i === 0) {
          this.$proBrandApi.save('-1',{
            name: val
          })
            .then((res) => {
              if(res){
                this.typeForm.bandId = res
              }
            })
        }else{
          this.typeForm.bandId = val
        }
      }
    }
  }
</script>


