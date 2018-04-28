<style scoped lang="scss" type="text/scss">
  @import '~variables';

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
    <div v-else>
      <el-form style="padding: 0;" :model="specForm" ref="specForm" :rules="specRule" label-width="100px" class="margin-top-xl spec-form">
        <el-form-item style="text-align: left; margin-bottom: 10px" v-for="(spec, index) in specList" :key="'sky_' + spec.id" :label="spec.name" :prop="spec.prop">

          <!-- 可选规格列表 -->
          <el-checkbox-group
            v-model="specList[index]['check_spec_list']"
            @change="specCheckboxChange">
            <el-checkbox
              v-for="(chil, key) in spec.contents"
              :key="chil.id"
              :label="index + '_' + key">{{ chil.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <!-- 组合完毕的规格 table -->
      <el-table :data="specDatas" stripe style="margin-top: 20px">
        <el-table-column v-for="(item, index) in tableColumn" v-bind="item" :key="'spec_table' + index"></el-table-column>
        <!--<el-table-column prop="itemCode" label="货号" min-width="100" :fixed="tabFixed">-->
        <!--<template slot-scope="scope">-->
        <!--<el-input v-model.trim="scope.row.itemCode" placeholder="请输入货号" size="mini"></el-input>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--&lt;!&ndash;<el-table-column prop="stockNum" label="库存"></el-table-column>&ndash;&gt;-->
        <!--<el-table-column prop="price" label="价格" min-width="100" :fixed="tabFixed">-->
        <!--<template slot-scope="scope">-->
        <!--<el-input type="number" size="mini" v-model="scope.row.price" placeholder="请输入价格">-->
        <!--<template slot="append">元</template>-->
        <!--</el-input>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="specImage" label="规格图片" :fixed="tabFixed">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button class="margin-top margin-bottom spec-image" @click="openSpecImg(scope.row,scope.$index)">-->
        <!--<i class="el-icon-plus font-l" v-if="JSON.stringify(scope.row.imageId) === '{}' || scope.row.imageId ? scope.row.imageId.path === '' : ''"></i>-->
        <!--<img :src="scope.row.imageId ? scope.row.imageId.path : ''" class="spec-image" v-else />-->
        <!--</el-button>-->
        <!--<v-mediapicker v-model="scope.row.imageIdhow" @onOk="uploadSpecImg"></v-mediapicker>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="operate" label="操作" :fixed="tabFixed">-->
        <!--<template slot-scope="scope">-->
        <!--<v-confirm-btn :isConfirm="scope.row.isDelBtn" size="mini" type="danger" value="确定删除此规格？" @sure="delArrSpec(scope.$index)">删除</v-confirm-btn>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
    <div class="padding-top width-30 position-relative" style="top: 38px;">
      <el-button type="primary" size="mini" @click="specShow = false" v-if="specShow">取消添加规格</el-button>
    </div>
  </div>
</template>

<script>
  import Sku from './../spec/sku'

  export default {
    name: "v-spec",
    props: {
      productType: {
        type: String,
        default: 'ICP'
      }
    },
    data () {
      return {
        // 规格列表
        specList: [
          {
            id: 1,
            name: '颜色',
            prop: 'color',
            check_spec_list: [],
            check_spec_array: [],
            contents: [
              {
                id: 1,
                name: '红色'
              },
              {
                id: 2,
                name: '黄色'
              },
              {
                id: 3,
                name: '金色'
              }
            ]
          },
          {
            id: 2,
            name: '内存',
            prop: 'ram',
            check_spec_list: [],
            check_spec_array: [],
            contents: [
              {
                id: 1,
                name: '64 G'
              },
              {
                id: 2,
                name: '128 G'
              },
              {
                id: 3,
                name: '268 G'
              }
            ]
          },
          {
            id: 3,
            name: '尺寸',
            prop: 'size',
            check_spec_list: [],
            check_spec_array: [],
            contents: [
              {
                id: 1,
                name: '5.5 寸'
              },
              {
                id: 2,
                name: '5 寸'
              },
            ]
          }
        ],
        commonColumn: {
          price: '0.00',
          image: '',
          sku: '',
          stock: 0
        },
        // sku table 数据
        specDatas: [],
        // sku table 表头
        tableColumn: [],
        proType: this.productType,
        specForm: {},
        specRule: {},
        specShow: false,
      }
    },
    created () {
      // this.getStdSpec()
      // 给 specList 的每一项数组的 contents 数据都添加父级的 prop 用于后面组装 table 数据
      this.specList.forEach((value) => {
        if (value.contents.length > 0) {
          value.contents.forEach ((v) => {
            // 添加新属性, 类似: { prop: 'color', .... }
            v.prop = value.prop;
          })
        }
      })
    },
    mounted () {
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
            if(res && res.length > 0){
              // this.specList = res
              this.specList.forEach((value,index) => {
                value.id = index + 1
                value.name = res[index].name
                value.contents = res[index].contents
                value.check_spec_list = []
                value.check_spec_array = []
                value.prop = `specVal0${index}`
                // value.isCustom = false
                // value.customSpec = ''
                // value.openSpecImg = false
                value.contents.forEach((val,i) => {
                  val.id = i + 1
                })
                console.log(value)
                // this.tableColumn.push({
                //   prop: `specVal0${index+1}`,
                //   label: value.name
                // })
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
        // this.getStdSpec()
        this.$emit('isShow',this.specShow)
        this.$nextTick(() => {
          this.$emit('getRef',this.$refs.specForm)
        })
      },
      // 监听规格的勾选
      specCheckboxChange (value) {
        if (value.length === 0) {
          // 检查每一组规格列表的勾选情况，及时清空
          return this.clearSpecArray()
        }

        // 设置勾选的规格值
        this.setSpecArray(value)
      },
      // 设置规格的勾选数据
      setSpecArray (data) {
        // 获取当前操作的规格列表索引值
        let currentSpecListIndex = data[0].split('_')[0]
        // 目前先清空，后期再进行计算优化
        this.specList[currentSpecListIndex].check_spec_array = []
        // 设置当前操作具体的规格列表
        let currentSpecList = this.specList[currentSpecListIndex]
        // 遍历添加
        data.forEach((value) => {
          // 获取切割数据
          let getSplitData = value.split('_')
          // 设置当前勾选的规格数据
          currentSpecList.check_spec_array.splice(0, 0, currentSpecList.contents[getSplitData[1]])
        })

        // 设置 table 的表头
        this.setTableColumn(currentSpecList.name, currentSpecList.prop)

        // 生成对应的规格组合 (sku)
        this.generateSku()
      },
      // 检查每一组规格的勾选情况
      clearSpecArray () {
        // 遍历规格列表
        this.specList.forEach((value) => {
          /**
           * 判断 check_spec_list 是否为空，即判断勾选情况，如果是的话,这里会有两种情况
           *
           * 1: check_spec_list 原本就是空的，也就是没有勾选该规格组；
           * 2: check_spec_list 原本是有值的，只是现在取消了该规格组的所有勾选；
           *
           * 但是因为我们无法得知具体是那一组规格取消了所有勾选，所以只能采取笨方法，遍历它，然后重置它
           */
          if (value.check_spec_list.length === 0) {
            value.check_spec_array = []
            this.delTable(value.name, value.prop)
          }
        })

        // 生成对应的规格组合 (sku)
        this.generateSku()
      },
      // 通过勾选规格的 name/prop 来设置 table 的 column
      setTableColumn (name, prop) {
        // 判断是否应该新增该 column
        let isAdd = true

        // 遍历判断是否已经存在该 column,如果存在，那么就不应该再新增
        this.tableColumn.forEach((value) => {
          if (value.prop === prop) {
            isAdd = false
          }
        })

        if (isAdd) {
          this.tableColumn.splice(0, 0, { label: name, prop: prop, align: 'center' })
        }
      },
      // 删除指定 table column
      delTable (name, prop) {
        this.tableColumn.forEach((value, index) => {
          if (value.prop === prop) {
            this.tableColumn.splice(index, 1)
          }
        })
      },
      // 生成 Sku
      generateSku () {
        // 储存勾选的规格数组集合
        let checkSpecArray = []

        // 遍历获取勾选的规则选项值
        this.specList.forEach((value, index) => {
          if (value.check_spec_array.length > 0) {
            checkSpecArray.push(value.check_spec_array)
          }
        })

        // TODO: 目前先每次都清空 table 的数据，以保证每次都是新的，后续再优化
        this.specDatas = []

        if (checkSpecArray.length > 0) {
          this.setspecDatas(Sku.descarte(checkSpecArray))
        }
      },
      // 设置 Table 数据
      setspecDatas (skuData) {
        // 遍历生成的 sku 数组
        skuData.forEach((value) => {
          let skuItem = { spec_item_list: [] }
          // 遍历生成的 sku 数组中的每一项的实际组成数据，然后组装需要的数据
          value.forEach((v) => {
            skuItem[v.prop] = v.name // 对应 table 的 column
            skuItem.spec_item_list.unshift(v.id) // 储存组成的规格项 id
          })

          this.specDatas.splice(0, 0 , skuItem)
        })
      }
    }
  }
</script>

