<style scoped lang="scss" type="text/scss">
  @import "~variables";

  /*.title-border{*/
    /*border-bottom: 1px dashed #ececec;*/
  /*}*/
  .flex-main{
    width: 100%;
  }
  .title-bar{
    border-left: 3px solid $primary;
    padding-left: 5px;
  }
  .flex-box{
    width: 20%;
  }
  /*.right-1{
    margin-right: 5% + 10px;
  }*/
  .last-right{
    position: relative;
    transition: all .5s ease-in-out;

    &:last-child {
      margin-right: 0!important;
    }
    &:hover{
      transform: translate(0,-8px);
      box-shadow: 2px 2px 3px #aaa,-2px -2px 3px #ccc;
      /*animation: jump .5s ease-in-out;*/
    }
  }
  .user-last{
    &:last-child{
      visibility: hidden;
    }
  }
  .fund-last{
    &:nth-child(n+2){
      visibility: hidden;
    }
  }
  /*@keyframes jump {*/
    /*from {*/
      /*bottom: 0;*/
    /*}*/
    /*to {*/
      /*bottom: 10px;*/
    /*}*/
  /*}*/
</style>
<template>
  <v-app>
    <div slot="header-title">租赁管理统计分析</div>
    <div class="main padding-top-m padding-bottom-m">

      <div class="device">
        <h3 class="title-border padding-bottom font-bold-300">
          <span class="title-bar">设备类</span>
        </h3>
        <div class="flex margin-top margin-bottom-m flex-main">
          <div class="flex-item cursor-pointer margin-right last-right" v-for="item in deviceList" ref="deviceRef" @click="detail(item.type,item.name)">
            <div class="flex flex-center padding-top-l padding-bottom-l color-white border-radius" :style="{ backgroundColor: item.bgColor }">
              <i class="iconfont icon-iot-shebei padding-right"></i>
              <span class="font-bold-400">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="user">
        <h3 class="title-border padding-bottom font-bold-300">
          <span class="title-bar">用户类</span>
        </h3>
        <div class="flex padding-top padding-bottom-m" style="{ 'margin-right': userMargin }">
          <div class="flex-item margin-right cursor-pointer last-right user-last" v-for="item in userList" @click="detail(item.type,item.name)">
            <div class="flex flex-center padding-top-l padding-bottom-l color-white border-radius" :style="{ backgroundColor: item.bgColor }">
              <i class="iconfont icon-iot-shebei padding-right"></i>
              <span class="font-bold-400">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="fund">
        <h3 class="title-border padding-bottom font-bold-300">
          <span class="title-bar">资金类</span>
        </h3>
        <div class="flex padding-top padding-bottom-m">
          <div class="flex-item margin-right cursor-pointer last-right fund-last" v-for="item in fundList" @click="detail(item.type,item.name)">
            <div class="flex flex-center padding-top-l padding-bottom-l color-white border-radius" :style="{ backgroundColor: item.bgColor }">
              <i class="iconfont icon-iot-shebei padding-right"></i>
              <span class="font-bold-400">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </v-app>
</template>

<script>
  export default {
    name: "list",
    data () {
      return {
        deviceList: [
          {
            type: 'device-all',
            name: '所有在用设备',
            bgColor: 'rgba(227, 69, 81, 0.7)'
          },
          {
            type: 'device-new',
            name: '新增设备',
            bgColor: '#32a8ee'
          },
          {
            type: 'device-broken',
            name: '断约设备',
            bgColor: 'rgba(255, 198, 75, 0.9)'
          },
          {
            type: 'device-renew',
            name: '续费设备',
            bgColor: 'rgb(0, 218, 204)'
          },
          {
            type: 'device-due',
            name: '即将到期设备',
            bgColor: '#ff8933'
          }
        ],
        userList: [
          {
            type: 'user-all',
            name: '所有有效用户',
            bgColor: 'rgba(227, 69, 81, 0.7)'
          },
          {
            type: 'user-new',
            name: '新增用户充值',
            bgColor: '#32a8ee'
          },
          {
            type: 'user-broken',
            name: '断约用户',
            bgColor: 'rgba(255, 198, 75, 0.9)'
          },
          {
            type: 'user-renew',
            name: '续费用户',
            bgColor: 'rgb(0, 218, 204)'
          },
          {
            name: '无',
          }
        ],
        fundList: [
          {
            type: 'fund',
            name: '资金管理流水用户',
            bgColor: 'rgba(227, 69, 81, 0.7)'
          },
          {
            name: '无',
          },
          {
            name: '无',
          },
          {
            name: '无',
          },
          {
            name: '无',
          }
        ],
        userMargin: 0
      }
    },
    mounted () {
      this.fetchData()
    },
    methods: {
      // 初始化数据
      fetchData () {
        console.log('我是租赁分析页面')
      },
      // 跳转到详情页
      detail (type,name) {
        this.$router.push({
          path: `/statistic/${type}`,
          query: {
            title: name
          }
        })
      }
    }
  }
</script>


