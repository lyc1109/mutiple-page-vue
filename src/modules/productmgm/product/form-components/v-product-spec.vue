<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .spec-form{
    max-width: none;

    .el-form-item{
      margin-bottom: 10px;
    }
    .el-checkbox-group{
      /*width: 90%;*/
      float: left;
      width: auto;
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
  .custom-input{
    width: auto;
  }
</style>
<template>
  <div>
    <div class="flex justify-center" style="padding-top: 10%;padding-bottom: 8%;" v-if="!specShow">
      <el-button type="primary" size="small" @click="addSp">添加规格</el-button>
    </div>

    <el-form :model="specForm" ref="specForm" :rules="specRule" label-width="100px" class="margin-top-xl spec-form" v-else>

      <el-form-item v-for="(item,index) in specList" :prop="`specVal0${index + 1}`" :label="item.name" :key="item.name">
        <!--<el-checkbox-group v-model="specList[index]['check_spec_list']" @change="changeSpec">-->
          <el-checkbox v-for="i in item.contents" :label="i.name" :key="i.name" @change="changeSpecList($event,i.name,item,index,item.name)">{{ i.name }}</el-checkbox>
        <!--</el-checkbox-group>-->
        <el-checkbox v-model="item.custom" label="custom" @change="addPa($event,item,index)">自定义</el-checkbox>
        <div class="float-right">
          <!--<i class="iconfont icon-iot-tijiaodingdan font-light margin-right cursor-pointer font-s" v-if="!item.isCustom" @click="openCustom(index)"></i>-->
          <div v-if="item.isCustom" class="inline-block" style="vertical-align: top;">
            <el-input v-model.trim="item.customSpec"
                      ref="customInput"
                      placeholder="请输入规格"
                      size="mini"
                      class="custom-input"
                      @keyup.native.enter="sureAddCustom(item,index)"></el-input>
            <el-button type="primary" size="mini" @click="sureAddCustom(item,index)">确定</el-button>
            <el-button type="text" size="mini" @click="cancelAddCustom(item,index)">取消</el-button>
          </div>
          <v-confirm-btn class="inline-block"
                         style="vertical-align: initial;"
                         :isConfirm="isDelCustom"
                         type="text"
                         size="mini"
                         value="确定删除该规格参数？"
                         @sure="delSpec(index)">
            <i class="iconfont icon-iot-del font-s font-light"></i>
          </v-confirm-btn>
        </div>
      </el-form-item>

      <div class="width-100 float-left">
        <v-form-popover class="float-right padding-bottom-m" :isShow="showAddAttrs" type="primary" size="mini" title="添加属性" :isClose="addAttr" @onOk="sureAddAttrs('addAttrForm',addAttrForm.attr)" @onCancel="cancelAddAttrs('addAttrForm',item)">
          <div slot="form">
            <el-form :model="addAttrForm" ref="addAttrForm" :rules="addAttrRule">
              <el-form-item prop="attr">
                <!--<el-input v-model.trim="addAttrForm.attr" placeholder="请输入规格属性名称" size="mini"></el-input>-->
                <el-checkbox-group v-model="addAttrForm.attr">
                  <el-checkbox v-for="item in addAttrData" :label="item.value" :key="item.value" @change="changeLabel(item)">{{ item.label }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
          添加属性
        </v-form-popover>
      </div>

      <el-form-item prop="allSpec" label="规格列表" class="float-left width-100">
        <el-table :data="specDatas" stripe="true">
          <!--<el-table-column prop="color" label="颜色"></el-table-column>-->
          <!--<el-table-column prop="size" label="尺寸"></el-table-column>-->
          <el-table-column v-for="item in columnList" :key="item.prop" :prop="item.prop" :label="item.label" :min-width="item.minWidth" :width="item.width"></el-table-column>
          <el-table-column prop="itemCode" label="货号" min-width="100" :fixed="tabFixed">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.itemCode" placeholder="请输入货号" size="mini"></el-input>
            </template>
          </el-table-column>
          <!--<el-table-column prop="stockNum" label="库存"></el-table-column>-->
          <el-table-column prop="price" label="价格" min-width="100" :fixed="tabFixed">
            <template slot-scope="scope">
              <el-input type="number" size="mini" v-model="scope.row.price" placeholder="请输入价格">
                <template slot="append">元</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="specImage" label="规格图片" :fixed="tabFixed">
            <template slot-scope="scope">
              <el-button class="margin-top margin-bottom spec-image" @click="openSpecImg(scope.row,scope.$index)">
                <i class="el-icon-plus font-l" v-if="JSON.stringify(scope.row.imageId) === '{}' || scope.row.imageId ? scope.row.imageId.path === '' : ''"></i>
                <img :src="scope.row.imageId ? scope.row.imageId.path : ''" class="spec-image" v-else />
              </el-button>
              <v-mediapicker v-model="scope.row.imageIdhow" @onOk="uploadSpecImg"></v-mediapicker>
            </template>
          </el-table-column>
          <el-table-column prop="operate" label="操作" :fixed="tabFixed">
            <template slot-scope="scope">
              <v-confirm-btn :isConfirm="scope.row.isDelBtn" size="mini" type="danger" value="确定删除此规格？" @sure="delArrSpec(scope.$index)">删除</v-confirm-btn>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <div class="padding-top width-30 position-relative" style="top: 38px;">
      <el-button type="primary" size="mini" @click="specShow = false" v-if="specShow">取消添加规格</el-button>
    </div>
  </div>
</template>

<script>
  import VMediapicker from '@/components/v-mediapicker'
  import Sku from './../spec/sku'
  // import _ from 'lodash'

  export default {
    name: "v-product-spec",
    props: {
      productType: {
        type: String,
        default: 'ICP'
      }
    },
    data () {
      return {
        showAddAttrs: false,
        addAttr: false,
        addAttrForm: {
          attr: [],
          imageId: '',
          price: ''
        },
        addAttrRule: {
          attr: [{ required: true,message: '请输入属性',trigger: 'change' }]
        },
        addAttrData: [
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
        specShow: false,
        specForm: {
          color: '红色',
          size: 's'
        },
        color: [],
        size: [],
        specRule: {},
        specList: [
          { name: '颜色', isCustom: false, customSpec: '',contents: [{ name: '红色' },{ name: '金色' },{ name: '黄色' }] }
        ],
        specDatas: [],
        specIndex: 0,
        columnList: [],
        isDelCustom: false,
        specInd: '',
        tabFixed: 'right',
        checked: false,
        proType: this.productType,
        addAttrName: {},
        custom: false
      }
    },
    // created () {
    //
    // },
    mounted () {
      // this.specList.forEach((value,index) => {
      //   if (value.contents.length > 0) {
      //     value.contents.forEach (v => {
      //       // 添加新属性, 类似: { specVal01: 'color', .... }
      //       v[`specVal0${index}`] = value[`specVal0${index}`]
      //     })
      //   }
      // })
      this.$emit('getData',this.specForm)
      this.$emit('isShow',this.specShow)
    },
    watch: {
      specForm: {
        handler (val){
          this.$emit('getData',val)
        },
        deep: true
      },
      productType (val) {
        this.proType = val
        // this.getStdSpec()
      },
      specDatas (val) {
        this.$emit('getpostData',val)
      }
    },
    methods: {
      getStdSpec () {
        this.$specApi.page({
          productType: this.proType
        })
          .then((res) => {
            if(res){
              this.specList = res
              this.specList.forEach((value,index) => {
                value.isCustom = false
                value.customSpec = ''
                value.check_spec_list = []
                value.check_spec_array = []
                // value.val = []
                this.columnList.push({
                  prop: `specVal0${index+1}`,
                  label: value.name
                })
                // console.log(this.columnList)
              })
            }
          })
      },
      addSp () {
        // this.$message({
        //   type: 'warning',
        //   message: '暂未开放规格修改功能，正在完善中...'
        // })
        this.specShow = true
        this.getStdSpec()
        this.$emit('isShow',this.specShow)
        this.$nextTick(() => {
          this.$emit('getRef',this.$refs.specForm)
        })
      },
      // 删除规格
      delSpec(index){
        this.specList.splice(index,1)
        this.columnList.splice(index,1)
      },
      // 打开规格图片选择器
      openSpecImg(row,index){
        row.imageIdhow = true
        this.specIndex = index
      },
      // 选择规格图片
      uploadSpecImg(data){
        this.specDatas[this.specIndex].imageId = data[0]
        console.log(data[0])
      },
      // 删除规格表格里的规格
      delArrSpec(index){
        this.specDatas.splice(index,1)
      },
      // 添加属性
      sureAddAttrs (formName,data) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            let obj = {}
            let attrName = `specName0${this.columnList.length + 1}`
            obj[attrName] = this.addAttrForm.attr
            obj.customVal = false
            obj.customSpec = ''
            obj.detail = false
            obj.check_spec_list = []
            obj.check_spec_array = []
            obj.contents = []
            obj.itemCode = ''
            obj.custom = false
            // console.log(this.specList.splice(this.specList.indexOf(this.addAttrName.label),1))
            console.log(this.specList)
            if(data.indexOf(this.addAttrName.value) > -1){
              this.specList.push({
                name: this.addAttrName.label,
                contents: []
              })
            }else {
              this.specList.splice(this.specList.indexOf(this.addAttrName.label),1)
              // this.columnList.push({
              //   prop: this.addAttrForm.attr,
              //   label: this.addAttrName
              // })
              // this.specDatas.push(obj)
            }
          }
        })
      },
      // 取消添加属性
      cancelAddAttrs (formName,data) {
        this.$refs[formName].resetFields()
      },
      // 打开自定义规格编辑框
      openCustom(data){
        this.specList[data].isCustom = !this.specList[data].isCustom
        // data.isCustom = !data.isCustom
        // this.$nextTick(() => {
        //   // this.$refs[]
        //   console.log(this.$refs)
        //   this.$refs.customInput.forEach((value) => {
        //     value.$refs.input.focus()
        //   })
        // })
      },
      // 确定添加自定义规格
      sureAddCustom(data,index){
        data.contents.push({
          name: data.customSpec,
          value: data.customSpec
        })
        // data.contents.push({ name: data.customSpec })
        data.isCustom = !data.isCustom
        let key = data.contents
        if(data.contents.indexOf(data.customSpec) > -1){
          this.specDatas.forEach((i) => {
            if(i[key] === '' || i[key] === undefined){
              i[key] = data.customSpec
              return false
            }
          })
          let obj = {}
          obj[key] = data.customSpec
          this.specDatas.push(obj)
        }
        this.$set(this.specList,data.isCustom,false)
        this.$set(this.specList,data.custom,false)
        data.isCustom = false
        data.customSpec = ''
        data.custom = false
        console.log(data)
      },
      // 取消添加自定义规格
      cancelAddCustom(data){
        this.$set(this.specList,data.isCustom,false)
        this.$set(this.specList,data.customSpec,'')
        this.$set(this.specList,data.custom,false)
        data.isCustom = !data.isCustom
        data.customSpec = ''
        data.custom = false
      },
      changeSpecList(val,name,data,index,label){
        let obj = {}
        let o = index + 1
        if(val){
          if(this.specDatas.length === 0){
            obj[`specVal0${o}`] = name
            obj[`specName0${o}`] = label
            obj.itemCode = ''
            this.specDatas.push(obj)
          }else {
            // this.specDatas.forEach((i,index) => {
            //   if (!i.hasOwnProperty(`specVal0${o}`) || i[`specVal0${o}`] === '') {
            //     i[`specVal0${o}`] = name
            //     i[`specName0${o}`] = label
            //     return false
            //   }
            //   if(i[`specVal0${o}`] === name){
            //     return false
            //   }
            // })
            let bl = false
            for (let i of this.specDatas) {
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
              obj.itemCode = ''
              this.specDatas.push(obj)
            }
          }
        }else{
          for(let i of this.specDatas){
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
      },
      addPa (val,data,index) {
        if(val){
          this.$set(this.specList,data.isCustom,true)
          data.isCustom = true
        }else{
          this.$set(this.specList,data.isCustom,false)
          data.isCustom = false
        }
        console.log(data)
      },
      changeLabel (val) {
        this.addAttrName = val
      },
      // changeSpec (val) {
      //   // 检查每一组规格列表的勾选情况，及时清空
      //   if (val.length === 0) {
      //     return this.clearSpecArray()
      //   }
      //
      //   // 设置勾选的规格值
      //   this.setSpecArray(val)
      // },
      // setSpecArray (data) {
      //   // 获取当前操作的规格列表索引值
      //   let currentSpecListIndex = data[0].split('_')[0]
      //   console.log(currentSpecListIndex)
      //   // 目前先清空，后期再进行计算优化
      //   this.specList[currentSpecListIndex].check_spec_array = []
      //   // 设置当前操作具体的规格列表
      //   let currentSpecList = this.specList[currentSpecListIndex]
      //   // 遍历添加
      //   data.forEach(value => {
      //     // 获取切割数据
      //     let getSplitData = value.split('_')
      //     // 设置当前勾选的规格数据
      //     currentSpecList.check_spec_array.splice(0, 0, currentSpecList.contents[getSplitData[1]])
      //   })
      //
      //   // 设置 table 的表头
      //   this.setTableColumn(currentSpecList.name, currentSpecList.prop)
      //
      //   // 生成对应的规格组合 (sku)
      //   this.generateSku()
      // },
      // // 检查每一组规格的勾选情况
      // clearSpecArray () {
      //   // 遍历规格列表
      //   this.specList.forEach((value,index) => {
      //     console.log(value)
      //     /**
      //      * 判断 check_spec_list 是否为空，即判断勾选情况，如果是的话,这里会有两种情况
      //      *
      //      * 1: check_spec_list 原本就是空的，也就是没有勾选该规格组；
      //      * 2: check_spec_list 原本是有值的，只是现在取消了该规格组的所有勾选；
      //      *
      //      * 但是因为我们无法得知具体是那一组规格取消了所有勾选，所以只能采取笨方法，遍历它，然后重置它
      //      */
      //     if (value.check_spec_list.length === 0) {
      //       value.check_spec_array = []
      //       this.delTable(value.name, value[`specVal0${index + 1}`])
      //     }
      //   })
      //
      //   // 生成对应的规格组合 (sku)
      //   this.generateSku()
      // },
      // // 通过勾选规格的 name/prop 来设置 table 的 column
      // setTableColumn (name, prop) {
      //   // 判断是否应该新增该 column
      //   let isAdd = true
      //
      //   // 遍历判断是否已经存在该 column,如果存在，那么就不应该再新增
      //   this.columnList.forEach(value => {
      //     if (value.prop === prop) {
      //       isAdd = false
      //     }
      //   })
      //
      //   if (isAdd) {
      //     // this.columnList.splice(0, 0, { label: name, prop: prop, align: 'center' })
      //     this.columnList.push({ label: name, prop: prop, align: 'center' })
      //   }
      // },
      // // 删除指定 table column
      // delTable (name, prop) {
      //   this.columnList.forEach((value, index) => {
      //     if (value.prop === prop) {
      //       this.columnList.splice(index, 1)
      //     }
      //   })
      // },
      // // 生成 Sku
      // generateSku () {
      //   // 储存勾选的规格数组集合
      //   let checkSpecArray = []
      //
      //   // 遍历获取勾选的规则选项值
      //   this.specList.forEach((value, index) => {
      //     if (value.check_spec_array.length > 0) {
      //       checkSpecArray.push(value.check_spec_array)
      //     }
      //   })
      //
      //   // TODO: 目前先每次都清空 table 的数据，以保证每次都是新的，后续再优化
      //   this.specDatas = []
      //
      //   if (checkSpecArray.length > 0) {
      //     this.setspecDatas(Sku.descarte(checkSpecArray))
      //   }
      // },
      // // 设置 Table 数据
      // setspecDatas (skuData) {
      //   // 遍历生成的 sku 数组
      //   skuData.forEach(value => {
      //     let skuItem = { spec_item_list: [] }
      //     // 遍历生成的 sku 数组中的每一项的实际组成数据，然后组装需要的数据
      //     value.forEach(v => {
      //       skuItem[v.prop] = v.name // 对应 table 的 column
      //       skuItem.spec_item_list.push(v.id) // 储存组成的规格项 id
      //     })
      //
      //     this.specDatas.splice(0, 0 , skuItem)
      //   })
      // }
    },
    components: { VMediapicker }
  }
</script>
