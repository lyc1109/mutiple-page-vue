<style scoped lang="scss" type="text/scss">
  @import "~variables";
</style>

<template>
  <div class="flex">
    <el-select
      class="flex-item margin-right"
      v-model="address.province"
      placeholder="请选择省"
      @change="provinceChange"
    >
      <el-option
        v-for="item in addressArr.provinceArr"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
    <el-select
      class="flex-item margin-right"
      v-model="address.city"
      placeholder="请选择市"
      @change="cityChange"
    >
      <el-option
        v-for="item in addressArr.cityArr"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
    <el-select
      class="flex-item"
      v-model="address.area"
      placeholder="请选择区"
      @change="areaChange"
    >
      <el-option
        v-for="item in addressArr.areaArr"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import address from "@/assets/scripts/city/cityData.json"
  export default {
    name: "v-select-city",
    props: {
      data: {}
    },
    data() {
      return {
        addressArr: {
          provinceArr: Object.keys(address),
          cityArr: [],
          areaArr: []
        },
      }
    },
    computed: {
      address() {
        if(this.data.province) {
          this.addressArr.cityArr = Object.keys(address[this.data.province]);
        }
        if(this.data.city) {
          this.addressArr.areaArr = address[this.data.province][this.data.city];
        }
        return this.data;
      }
    },
    methods: {
      //监听省级变化
      provinceChange(value) {
        this.addressArr.cityArr = Object.keys(address[value]);
        this.addressArr.areaArr = [];
        this.address.city = '';
        this.address.area = '';
        this.$emit('getAddress', this.address);
      },
      //监听市级变化
      cityChange(value) {
        let province = this.address.province;
        this.addressArr.areaArr = address[province][value];
        this.address.area = '';
        this.$emit('getAddress', this.address);
      },
      //监听区域变化
      areaChange() {
        this.$emit('getAddress', this.address);
      }
    }
  }
</script>


