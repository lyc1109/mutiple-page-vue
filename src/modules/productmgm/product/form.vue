<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .create-form{
    /*margin: 0 15%;*/
    width: 100%;
    max-width: none;

    .el-select{
      width: 100%;
    }
  }
  .short-form{
    width: 200px;
  }
  .long-width{
    width: 45%;
  }
  .el-tag + .el-tag{
    margin-left: $s;
  }
  .el-col-21{
    margin-left: 6.266%;
  }
  .create-tab{
    /deep/ .el-col-21{
      margin-left: 6.266%;
    }
  }
</style>
<template>
  <v-app>
    <div slot="header-title">发布商品</div>
    <div class="margin-bottom float-left width-100">
      <v-create-tabs :tabList="tabList"
                     :tabIndex="tabIndex"
                     class="margin-top-m create-tab"
                     @prevStep="prevStep"
                     @nextStep="nextStep"
                     @save="save"
                     :btnBoxWidth="btnBoxWidth"
                     :btnBoxOffset="btnBoxOffset"
                     :tabBoxWidth="tabBoxWidth">

        <!--品牌与类型-->
        <el-col :span="boxWidth" :offset="btnBoxOffset" v-show="tabIndex === 0">
          <v-bandtype @getRef="getBandtypeRef" @getData="getBandtypeData"></v-bandtype>
        </el-col>

        <!--基本信息-->
        <el-col :span="boxWidth" :offset="btnBoxOffset" v-show="tabIndex === 1">
          <v-basic @getRef="getBasicRef" @getData="getBasicData"></v-basic>
        </el-col>

        <!--商品规格-->
        <el-col :span="boxWidth" :offset="btnBoxOffset" v-show="tabIndex === 2">
          <!--<v-product-spec @getRef="getProSpecRef" @getData="getSpecData" @isShow="isSpecShow" @getpostData="getspecPostData"></v-product-spec>-->
          <v-spec @getRef="getProSpecRef" @getData="getSpecData" @isShow="isSpecShow" @getpostData="getspecPostData"></v-spec>
        </el-col>

        <!--商品参数-->
        <el-col :span="boxWidth" :offset="btnBoxOffset" v-show="tabIndex === 3">
          <v-product-params :product-type="productType" @getRef="getProParamsRef" @getData="getParamsData"></v-product-params>
        </el-col>

        <!--销售属性-->
        <el-col :span="boxWidth" v-show="tabIndex === 4">
          <v-sale-attr @getRef="getSaleAttrRef" @getData="getSaleData"></v-sale-attr>
        </el-col>

        <!--商品详情-->
        <el-col :span="boxWidth" v-show="tabIndex === 5">
          <v-product-description @getRef="getdescRef" @getData="getDescData"></v-product-description>
        </el-col>

        <!--包装售后-->
        <el-col :span="boxWidth" v-show="tabIndex === 6">
          <v-after-sale @getRef="getSaleRef" @getData="getAfterSaleData" :product-type="productType"></v-after-sale>
        </el-col>
      </v-create-tabs>
    </div>
  </v-app>
</template>

<script>
  import VCreateTabs from '@/components/v-create-tabs'
  import VBandtype from './form-components/v-bandtype'
  import VBasic from './form-components/v-basic'
  import VProductSpec from './form-components/v-product-spec'
  import VProductParams from './form-components/v-product-params'
  import VSaleAttr from './form-components/v-sale-attr'
  import VProductDescription from './form-components/v-product-description'
  import VAfterSale from './form-components/v-after-sale'
  import VSpec from './form-components/v-spec'

  export default {
    name: "form",
    data () {
      return {
        productType: '',
        typeFormRef: '',
        basicFormRef: '',
        specFormRef: '',
        paramsFormRef: '',
        saleAttrFormRef: '',
        descFormRef: '',
        saleFormRef: '',
        typeData: {},
        basicData: {},
        specData: {},
        paramsData: {},
        saleData: {},
        descData: {},
        afterSaleData: {},
        tabIndex: 2,
        btnBoxWidth: 21,
        btnBoxOffset: 2,
        tabBoxWidth: 3,
        boxWidth: 21,
        tabList: [
          {
            label: '品牌与类型',
            active: true
          },
          {
            label: '基本信息',
            active: false
          },
          {
            label: '商品规格',
            active: false
          },
          {
            label: '商品参数',
            active: false
          },
          {
            label: '销售属性',
            active: false
          },
          {
            label: '产品详情',
            active: false
          },
          {
            label: '包装售后',
            active: false
          }
        ],
        isSpec: false,
        specPostData: []
      }
    },
    methods: {
      // 获取品牌与类型的ref
      getBandtypeRef (data) {
        this.typeFormRef = data
      },
      // 获取基本信息的ref
      getBasicRef (data) {
        this.basicFormRef = data
      },
      // 获取商品规格的ref
      getProSpecRef (data) {
        this.specFormRef = data
      },
      // 获取商品参数的ref
      getProParamsRef (data) {
        this.paramsFormRef = data
      },
      // 获取销售属性的ref
      getSaleAttrRef (data) {
        this.saleAttrFormRef = data
      },
      // 获取产品详情的ref
      getdescRef (data) {
        this.descFormRef = data
      },
      // 获取包装售后的ref
      getSaleRef (data) {
        this.saleFormRef = data
      },

      // 获取品牌与类型的数据
      getBandtypeData (data) {
        this.typeData = data
        this.productType = this.typeData.iotDeviceType
      },
      // 获取品牌与类型的数据
      getBasicData (data) {
        this.basicData = data
      },
      // 获取品牌与类型的数据
      getSpecData (data) {
        this.specData = data
      },
      getspecPostData (data) {
        this.specPostData = data
      },
      // 获取品牌与类型的数据
      getParamsData (data) {
        this.paramsData = data
      },
      // 获取品牌与类型的数据
      getSaleData (data) {
        this.saleData = data
      },
      // 获取品牌与类型的数据
      getDescData (data) {
        this.descData = data
      },
      // 获取包装售后的数据
      getAfterSaleData (data) {
        this.afterSaleData = data
      },

      isSpecShow (val) {
        this.isSpec = val
      },
      // 下一步操作公用方法
      nextStepOperate () {
        this.tabIndex++
        this.tabList[this.tabIndex].active = true
      },
      // 上一步
      prevStep (index) {
        this.tabIndex = index
      },
      // 下一步
      nextStep (index) {
        // this.tabIndex = index
        switch(index){
          case 0:
            this.typeFormRef.validate((valid) => {
              if(valid){
                this.nextStepOperate()
                console.log(this.typeData)
              }
            })
            break
          case 1:
            this.basicFormRef.validate((valid) => {
              if(valid){
                this.nextStepOperate()
                console.log(this.basicData)
              }
            })
            break
          case 2:
            if(this.isSpec) {
              this.$nextTick(() => {
                this.specFormRef.validate((valid) => {
                  if (valid) {
                    console.log(this.specPostData)
                    for(let i of this.specPostData){
                      if(i.itemCode === ''){
                        this.$message({
                          type: 'error',
                          message: '必须输入商品货号'
                        })
                        return false
                      }
                    }
                    this.nextStepOperate()
                     console.log(this.specData)
                  }
                })
              })
            }else{
              this.nextStepOperate()
              console.log(this.specData)
            }
            break
          case 3:
            this.paramsFormRef.validate((valid) => {
              if(valid){
                this.nextStepOperate()
                console.log(this.paramsData)
              }
            })
            break
          case 4:
            this.saleAttrFormRef.validate((valid) => {
              if(valid){
                this.nextStepOperate()
                console.log(this.saleData)
              }
            })
            break
          case 5:
            this.descFormRef.validate((valid) => {
              if(valid){
                this.nextStepOperate()
                console.log(this.descData)
              }
            })
            break
          // no default
        }
      },
      // 保存
      save () {
        let data = Object.assign(this.typeData,this.basicData,this.specPostData,this.paramsData,this.saleData,this.descData,this.afterSaleData)
        console.log(data)
        data.pmsProductSpecFormList = this.specPostData
        this.descFormRef.validate((valid) => {
          if(valid){
            this.$productApi.create(data)
              .then((res) => {
                if(res){
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                  this.$router.go(-1)
                }
              })
          }
        })
      }
    },
    components: {
      VCreateTabs,
      VBandtype,
      VBasic,
      VProductSpec,
      VProductParams,
      VSaleAttr,
      VProductDescription,
      VAfterSale,
      VSpec
    }
  }
</script>

