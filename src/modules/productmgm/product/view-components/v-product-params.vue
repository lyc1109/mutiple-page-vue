<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .smart-title{
    border-left: 3px solid $primary;
    height: 50px;
    line-height: 50px;
    background: $gray-light-2;
    padding-left: $m;
    font-size: $font-size-m;
    font-weight: 400;
    margin: 0;
  }
  .line-30{
    line-height: 30px;
  }
  .width-30{
    width: 30%;
  }
  .margin-bottom-0{
    margin-bottom: 0;
  }
  .inline-block{
    vertical-align: inherit;
  }
</style>
<template>
  <div>
    <h3 class="smart-title padding-right">商品参数</h3>
    <div class="border padding-l">
      <el-row>
        <el-col span="12">
          <h4 class="border-bottom line-30 font-bold-500">标准参数</h4>
          <v-basic-params :data="productDetail" @reload="listFetch"></v-basic-params>
        </el-col>

        <el-col span="12">
          <h4 class="border-bottom line-30 font-bold-500">自定义参数</h4>
          <div class="custom-params font-s" v-if="productDetail.productPropertyDtos ? productDetail.productPropertyDtos.length > 0 : ''">
            <div v-for="(item,index) in productDetail.productPropertyDtos ? productDetail.productPropertyDtos : []" :key="item.propertyName" class="position-relative line-30">
              <span class="margin-right font-light">{{ item.propertyName }}</span>
              <b class="font-bold-400">{{ item.propertyValue }}</b>
              <v-confirm-btn type="text"
                             value="确定删除此参数？"
                             @clicks="delParams(item.id)"
                             class="position-absolute inline-block"
                             style="right: 0;top: 0;"
                             @sure="sureDelParam">删除</v-confirm-btn>
            </div>
          </div>
          <div class="font-s font-light" v-else>
            暂时没有参数哦~
          </div>

          <div class="margin-top">
            <el-button type="primary" size="mini" @click="addParam" v-if="!isShowParam">添加参数</el-button>
            <div v-else>
              <!--<div v-for="item in paramList" :key="item.params" class="padding-top">-->
              <el-select class="width-30" v-model="propertyList.propertyName" size="mini" allow-create filterable @change="changeParams(propertyList)" @remove-tag="delStdParams" placeholder="可选择也可自定义输入">
                <el-option v-for="i in listData" :label="i.propertyName" :value="i.propertyName" :key="i.propertyDefaultValue"></el-option>
              </el-select>
              <el-input size="mini" v-model.trim="propertyList.propertyValue" placeholder="输入对应的值" class="width-30"></el-input>
              <div class="float-right">
                <!--<el-button type="primary" size="mini" @click="sureSaveParam">确定</el-button>-->
                <v-button-ok size="mini" v-model="paramError" @click.native="sureSaveParam">确定</v-button-ok>
                <el-button type="text" size="mini" @click="cancelAddParam">取消</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import VBasicParams from './params/v-basic-params'

  export default {
    name: "v-product-params",
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    watch: {
      data (val) {
        this.productDetail = val
      }
    },
    data () {
      return {
        productDetail: this.data,
        params: '',
        customParamDatas: [],
        customParams: '',
        isShowParams: false,
        isShowAddParams: false,
        errorInfo: false,
        paramId: '',
        addTagList: [],
        paramsShow: false,
        propertyList: {
          propertyName: '',
          propertyValue: ''
        },
        listData: [],
        isShowParam: false,
        paramsList: [],
        paramError: ''
      }
    },
    mounted () {
      setTimeout(() => {
        this.getStandParams()
      },300)
    },
    methods: {
      // 重新刷新数据
      listFetch () {
        this.$productApi.detail(this.$route.params.id)
          .then((res) => {
            if(res){
              this.productDetail = res
              // this.productDetail.productPropertyDtos.forEach((value) => {
              //   if(this.listData.indexOf(value.propertyName) <= -1){
              //     this.listData.splice(value.propertyName,1)
              //   }
              // })
              // this.fetchData()
            }
          })
      },
      // 获取标准参数列表数据
      getStandParams () {
        this.$propertyApi.page({
          page_no: 1,
          page_size: 50,
          product_type: this.productDetail.iotDeviceType ? this.productDetail.iotDeviceType : 'iWater'
        })
          .then((res) => {
            if(res){
              this.listData = res
            }
          })
      },
      // 删除参数
      delParams(id){
        this.paramId = id
      },
      // 确定删除参数
      sureDelParam () {
        this.$propertyApi.del(this.paramId)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.listFetch()
            }
          })
      },
      // 添加参数
      // addParams(){
      //   this.isShowAddParams = true
      // },
      // 添加自定义参数
      addCustomParams(val){
        if(val === ''){
          this.errorInfo = true
        }else{
          this.errorInfo = false
          this.customParamDatas.push(val)
          this.isShowParams = false
          this.customParams = ''
        }
      },
      // 取消添加参数
      cancelAddParams(){
        this.isShowParams = !this.isShowParams
        this.customParams = ''
      },
      // 删除自定义参数
      delCustomParams(index){
        this.customParamDatas.splice(index,1)
      },
      // 显示添加自定义参数输入框
      showParamsInput(){
        // this.$nextTick(() => {
        this.$refs.paramInput.focus()
        // })
        this.isShowParams = !this.isShowParams
      },
      // 关闭添加参数输入框
      closeParams () {
        this.paramsShow = false
        this.addListsName = ''
        this.addListsVal = ''
      },
      // 选择标准参数
      changeParams (val) {
        console.log(val)
        let obj = {}
        obj = this.listData.find((item) => item.propertyName === val.propertyName)
        console.log(obj)
        if(obj.propertyDefaultValue) {
          this.propertyList.propertyValue = obj.propertyDefaultValue
        }
      },
      // 取消选择标准参数
      delStdParams (val) {
        this.paramsList.splice(this.paramsList.indexOf(val),1)
      },
      // 添加更多参数
      addParam () {
        this.isShowParam = true
      },
      // 确定添加参数
      sureSaveParam () {
        if(this.propertyList.propertyName === '' || this.propertyList.propertyValue === ''){
          this.paramError = '参数名称和参数值不能为空'
          return false
        }
        this.$propertyApi.saveCustom(this.$route.params.id,'-1',this.propertyList)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.listFetch()
              this.isShowParam = !this.isShowParam
              this.propertyList.propertyName = ''
              this.propertyList.propertyValue = ''
            }
          })
      },
      cancelAddParam () {
        this.isShowParam = !this.isShowParam
        this.propertyList.propertyName = ''
        this.propertyList.propertyValue = ''
      }
    },
    components: { VBasicParams }
  }
</script>


