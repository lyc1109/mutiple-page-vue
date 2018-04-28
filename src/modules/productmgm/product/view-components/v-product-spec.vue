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
  .spec-image{
    width: 60px;
    height: 60px;
    padding: 0;
    overflow: hidden;
  }
  .custom-input{
    width: auto;
  }
  .value + .value{
    margin-left: $s;
  }
  .inline-block{
    vertical-align: top;
  }
</style>
<template>
  <div>
    <div class="smart-title padding-right">商品规格</div>
    <div class="border spec-box" :class="{ 'padding-l': isShowTab }">
      <v-empty></v-empty>
      <!--<div class="align-center">暂时未开放规格功能哦~</div>-->
      <div class="spec-list line-30 position-relative font-s float-left width-100" v-for="(item,index) in editData" :key="item.productId" v-if="isShowTab">
        <div style="width: 70%;">
          <div class="float-left" v-if="item[`specName0${index+1}`]">
            <span class="font-light">{{ item[`specName0${index+1}`] }}:</span>
            <div class="inline-block" v-if="item.detail">
              <b class="font-bold-400 value margin-right-s" v-if="editData.length > 0 && productDetail.productSpecDtos[0][`specVal0${index+1}`] !== null">{{ productDetail.productSpecDtos[0][`specVal0${index+1}`] }}</b>
              <b class="font-bold-400 value margin-right-s" v-if="editData.length > 1 && productDetail.productSpecDtos[1][`specVal0${index+1}`] !== null">{{ productDetail.productSpecDtos[1][`specVal0${index+1}`] }}</b>
              <b class="font-bold-400 value margin-right-s" v-if="editData.length > 2 && productDetail.productSpecDtos[2][`specVal0${index+1}`] !== null">{{ productDetail.productSpecDtos[2][`specVal0${index+1}`] }}</b>
              <b class="font-bold-400 value margin-right-s" v-if="editData.length > 3 && productDetail.productSpecDtos[3][`specVal0${index+1}`] !== null">{{ productDetail.productSpecDtos[3][`specVal0${index+1}`] }}</b>
              <b class="font-bold-400 value margin-right-s" v-if="editData.length > 4 && productDetail.productSpecDtos[4][`specVal0${index+1}`] !== null">{{ productDetail.productSpecDtos[4][`specVal0${index+1}`] }}</b>
              <b class="font-bold-400 value margin-right-s" v-if="editData.length > 5 && productDetail.productSpecDtos[5][`specVal0${index+1}`] !== null">{{ productDetail.productSpecDtos[5][`specVal0${index+1}`] }}</b>
            </div>
          </div>
          <div class="margin-left inline-block" v-show="!item.detail">
            <el-checkbox v-for="i in item.contents" :key="i.name" :label="i.name" @change="changeSpecList($event,i.name,item,index,item[`specName0${index+1}`])">{{ i.name }}</el-checkbox>
            <el-checkbox v-model="item.customBtn" label="custom" @change="openCustom($event,index)">自定义</el-checkbox>
          </div>
        </div>
        <div class="position-absolute" style="top: 0;right: 0;">
          <i class="iconfont icon-iot-tijiaodingdan font-light margin-right cursor-pointer font-s" v-if="item.detail" @click="openEdit(item)"></i>
          <el-button type="text" size="mini" @click="cancelEdit(item)" v-if="!item.detail">取消修改</el-button>
          <!--<i class="el-icon-plus font-light margin-right cursor-pointer font-s font-bold-700" v-if="!item.customVal" @click="openCustom(index)"></i>-->
          <div v-if="item.customVal" class="inline-block">
            <el-input v-model="item.customSpec"
                      ref="customInput"
                      placeholder="请输入规格"
                      size="mini"
                      class="custom-input"
                      @keyup.native.enter="sureAddCustom(item,index,item[`specName0${index+1}`])"></el-input>
            <el-button type="primary" size="mini" @click="sureAddCustom(item,index,item[`specName0${index+1}`])">确定</el-button>
            <!--<el-button type="text" size="mini" @click="cancelAddCustom(item,index)">取消</el-button>-->
          </div>
          <v-confirm-btn class="inline-block"
                         style="vertical-align: initial;"
                         :isConfirm="item.isDelCustom"
                         type="text"
                         size="mini"
                         value="确定删除该规格参数？"
                         @sure="sureDelCustom(index)">
            <i class="iconfont icon-iot-del font-s font-light"></i>
          </v-confirm-btn>
        </div>
      </div>

      <div v-if="isShowTab">
        <!--<v-form-popover :isShow="addAttrShow" size="mini" title="选择属性" class="margin-top" width="300" :isClose="addAttr" @onOk="sureAddAttrs('addAttrForm')" @onCancel="cancelAddAttrs('addAttrForm')">-->
          <!--<div slot="form">-->
            <!--<el-form :model="addAttrForm" ref="addAttrForm" :rules="addAttrRule">-->
              <!--<el-form-item prop="attr">-->
                <!--<el-input v-model.trim="addAttrForm.attr" size="mini" placeholder="请输入属性名"></el-input>-->
                <!--&lt;!&ndash;<el-checkbox-group v-model="addAttrForm.attr">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-checkbox v-for="item in addAttrList" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-checkbox-group>&ndash;&gt;-->
              <!--</el-form-item>-->
            <!--</el-form>-->
          <!--</div>-->
          <!--添加属性-->
        <!--</v-form-popover>-->
        <div>
          <el-table :data="productDetail.productSpecDtos" stripe="true" class="margin-top">
            <el-table-column v-for="(item,index) in columnList" :key="item.prop" :prop="item.prop" :label="item.label" :min-width="item.minWidth" :width="item.width"></el-table-column>
            <el-table-column prop="itemCode" label="货号" min-width="100">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.itemCode" size="mini" placeholder="请填写货号"></el-input>
              </template>
            </el-table-column>
            <!--<el-table-column prop="stockNum" label="库存" width="80"></el-table-column>-->
            <el-table-column prop="price" label="价格" min-width="100">
              <template slot-scope="scope">
                <el-input type="number" size="mini" v-model.trim.number="scope.row.price" placeholder="请输入价格">
                  <template slot="append">元</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="specImage" label="规格图片">
              <template slot-scope="scope">
                <el-button class="margin-top margin-bottom spec-image" @click="openSpecImg(scope.$index)">
                  <i class="el-icon-plus font-l" v-if="scope.row.imagePath === null"></i>
                  <img :src="scope.row.imagePath ? scope.row.imagePath : ''" class="spec-image" v-else />
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delArrSpec(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--<div class="margin-top" v-if="isAddAttr">-->
            <!--<el-button type="primary" size="mini" @click="sureAddAttr">确定修改</el-button>-->
            <!--<el-button type="text" size="mini" @click="isAddAttr = !isAddAttr">取消</el-button>-->
          <!--</div>-->
        </div>
        <v-mediapicker v-model="specImgShow" @onOk="uploadSpecImg"></v-mediapicker>
      </div>
    </div>
  </div>
</template>

<script>
  import VMediapicker from '@/components/v-mediapicker'
  import VEmpty from '@/layout/v-empty'

  export default {
    name: "v-product-spec",
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    computed: {
      productSpecDtos () {
        return this.productDetail.productSpecDtos
      }
    },
    watch: {
      data: {
        handler (val){
          if(val){
            this.productDetail = val
          }
        },
        deep: true
      },
      productSpecDtos (val) {
        if(val){
          this.isAddAttr = true
        }
      }
    },
    data () {
      return {
        a: [],
        productDetail: this.data,
        isAddAttr: false,
        selectSpecex: 0,
        addAttrShow: false,
        addAttr: false,
        addAttrForm: {
          attr: []
        },
        addAttrRule: {
          attr: [{ required: true,message: '请输入属性名',trigger: 'change' }]
        },
        addAttrList: [
          {
            label: '流量',
            value: 'll'
          },
          {
            label: '滤芯配置',
            value: 'lx'
          },
          {
            label: '净含量',
            value: 'jhl'
          }
        ],
        editData: [],
        columnList: [],
        addArrData: [],
        isDelCustom: false,
        selectSpec: '',
        specImgShow: false,
        isShowTab: false
      }
    },
    mounted () {
      setTimeout(() => {
        this.editData = this.productDetail.productSpecDtos
        if(this.editData.length !== null && this.editData.length > 0) {
          this.editData.forEach((value, index) => {
            this.$set(value, 'customVal', false)
            this.$set(value, 'detail', true)
            this.$set(value, 'customSpec', '')
            this.$set(value, 'contents', [])
            this.$set(value, 'customBtn', false)
            value.contents.push({
              name: value[`specVal0${index + 1}`] !== null ? value[`specVal0${index + 1}`] : ''
            })
            this.columnList.push({
              prop: `specVal0${index + 1}`,
              label: value[`specName0${index + 1}`]
            })
          })
        }
      },300)
    },
    methods: {
      fetchData () {
        this.$productApi.detail(this.$route.params.id)
          .then((res) => {
            if(res){
              this.productDetail = res
              this.editData = res.productSpecDtos
              this.editData.forEach((value,index) => {
                value.status = false
                value.detail = true
                this.columnList.push({
                  prop: `specVal0${index+1}`,
                  label: value[`specName0${index+1}`]
                })
              })
            }
          })
      },
      // 确定修改规格
      sureAddAttr(){
        for(let i of this.productDetail.productSpecDtos){
          if(i.itemCode === ''){
            this.$message({
              type: 'error',
              message: '必须输入商品货号'
            })
            return false
          }
        }
        this.$specApi.save({
          productId: this.$route.params.id
        },this.productDetail.productSpecDtos)
          .then((res) => {
            if(res){
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.fetchData()
              this.isAddAttr = false
            }
          })

      },
      // 打开规格图片选择器
      openSpecImg(index){
        this.specImgShow = true
        this.selectSpecex = index
      },
      // 选择规格图片
      uploadSpecImg(data){
        this.productDetail.productSpecDtos[this.selectSpecex].imagePath = data[0].path
        let url = this.productDetail.productSpecDtos[this.selectSpecex].imagePath
        this.productDetail.productSpecDtos[this.selectSpecex].imagePath = `${url}!wh100`
        this.productDetail.productSpecDtos[this.selectSpecex].imageId = data[0].id
      },
      // 删除规格表格里的规格
      delArrSpec(index){
        this.productDetail.productSpecDtos.splice(index,1)
      },
      // 打开自定义规格编辑框
      openCustom(val,data){
        if(val){
          this.editData[data].customVal = true
          this.$nextTick(() => {
            this.$refs.customInput.forEach((value) => {
              value.$refs.input.focus()
            })
          })
        }else{
          this.editData[data].customVal = false
        }
      },
      // 确定添加自定义规格
      sureAddCustom(data){
        data.contents.push({
          name: data.customSpec
        })
        data.detail = false
        // let bl = false
        // for (let i of this.productDetail.productSpecDtos) {
        //   if (i[`specVal0${o}`] === undefined){
        //     i[`specVal0${o}`] = data.customSpec
        //     i[`specName0${o}`] = label
        //     bl = true
        //     break
        //   }
        //   if(i[`specVal0${o}`] === data.customSpec){
        //     bl = true
        //   }
        // }
        //
        // if(!bl) {
        //   obj[`specVal0${o}`] = data.customSpec
        //   obj[`specName0${o}`] = label
        //   this.productDetail.productSpecDtos.push(obj)
        // }
        data.customVal = !data.customVal
      },
      // 取消添加自定义规格
      cancelAddCustom(data){
        data.customVal = !data.customVal
        data.customSpec = ''
        data.customBtn = false
      },
      // 修改规格
      openEdit (data) {
        data.detail = false
      },
      // 取消修改规格
      cancelEdit (data) {
        data.detail = true
        data.customVal = false
        data.customSpec = ''
        data.customBtn = false
      },
      // 添加属性
      sureAddAttrs (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            let obj = {}
            let attrName = `specName0${this.columnList.length + 1}`
            obj[attrName] = this.addAttrForm.attr
            obj.customVal = false
            obj.customSpec = ''
            obj.detail = false
            obj.contents = []
            obj.itemCode = ''
            this.columnList.push({
              prop: this.addAttrForm.attr,
              label: this.addAttrForm.attr
            })
            this.editData.push(obj)
          }
        })
      },
      // 取消添加属性
      cancelAddAttrs (formName) {
        this.$refs[formName].resetFields()
      },
      // 确定删除参数
      sureDelCustom (index) {
        this.productDetail.productSpecDtos.splice(index,1)
      },
      changeSpecList(val,name,data,index,label){
        let obj = {}
        let o = index + 1
        if(val){
          if(this.productDetail.productSpecDtos.length === 0){
            obj[`specVal0${o}`] = name
            obj[`specName0${o}`] = label
            this.productDetail.productSpecDtos.push(obj)
          }else {
            let bl = false
            for (let i of this.productDetail.productSpecDtos) {
              if (i[`specVal0${o}`] === undefined){
                i[`specVal0${o}`] = name
                i[`specName0${o}`] = label
                console.log(i[`specVal0${o}`])
                bl = true
                break
              }
              if(i[`specVal0${o}`] === name){
                bl = true
              }
            }
            if(!bl) {
              obj[`specVal0${o}`] = name
              obj[`specName0${o}`] = label
              this.productDetail.productSpecDtos.push(obj)
            }
          }
        }else{
          for(let i of this.productDetail.productSpecDtos){
            // for(let u in i){
            //   if(u === ''){
            //     this.specDatas.splice(this.specDatas.indexOf(name),1)
            //     return false
            //   }
            // }
            if(i[`specVal0${o}`] === name){
              i[`specVal0${o}`] = ''
            }
          }
        }
      }
    },
    components: { VMediapicker, VEmpty }
  }
</script>


