<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .sale-device-view {
    margin: 20px 0 20px 20px;
  }
  .sale-detail {
    width: 100%;
    align-items: flex-start;
  }
  .border-left {
    padding: 0 0 20px 20px;
    border-left: 1px solid #eee;
  }
  .img {
    width: 25%;
    height: 0;
    padding-bottom: 25%;
    position: relative;
    float: left;
  }
  .img-shadow {
    background: rgba(0,0,0,.6);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    color: #fff;
    cursor: pointer;
  }
  .img-shadow-flex {
    flex-wrap: wrap;
    width: 100%;
    height:100%;
    padding: 10% 0 15% 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .img-shadow i,
  .img-shadow b,
  .img-shadow span {
    width: 100%;
    display: block;
  }
  .img-shadow i {
    font-size: 2.5vw;
  }
  .img-shadow b {
    font-size: 1vw;
    font-weight: 400;
  }
  .img-shadow span {
    font-size: .1vw;
    white-space: normal;
  }
  .img img {
    width: 100%;
    height: 100%;
    border: 5px solid #ccc;
    position: absolute;
    box-sizing: border-box;
  }
  .basic-info {
    width: 70%;
    float: left;
  }
  .basic-info h2 {
    margin: 0;
    line-height: 1px;
  }
  .basic-info .el-button {
    padding: 0;
    font-size: 16px;
  }
  .basic-info ul li {
    width: 100%;
    line-height: 25px;
  }
  .basic-info ul b {
    font-weight: 400;
    font-size: 13px;
    color: #aaa;
    margin-right: 10px;
  }
  .basic-info ul li span {
    font-size: 13px;
    color: #666;
    width: 70%;
    white-space: pre-wrap;
    font-weight: 400;
  }
  .device-log {
    min-height: 150px;
    padding: 0 0 20px 0;
  }
  h2.tit {
    margin: 0;
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    background: #f6f6f6;
    font-size: 14px;
    color: #555;
    font-weight: 400;
  }
  .deviceLog {
    padding-top: 20px;
    border: 1px solid #f3f3f3;
  }
  .deviceLog-lists {
    margin-bottom: 20px;
    padding: 0 20px;
    line-height: 25px;
    position: relative;
  }
  .deviceLog-logo {
    width: 3px;
    height: 100%;
    background: #eee;
    display: inline-block;
    float: left;
    position: absolute;
    left: 20px;
    top: 0;
  }
  .deviceLog-logo:before {
    position: absolute;
    content: '';
    left: -4px;
    top: 8px;
    background: #eee;
    border-radius: 50%;
    display: block;
    width: 10px;
    height: 10px;
  }
  .deviceLog-list span {
    display: block;
    width: 100%;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .deviceLog-list span:first-child {
    color: #aaa;
    font-weight: 400;
  }
  .deviceLog-list span:last-child {
    color: #757575;
    font-weight: 400;
  }
  .deviceLog .more {
    text-align: center;
    width: 100%;
    height: 25px;
    line-height: 25px;
    padding: 0;
    margin-bottom: 0;
    background: #ececec!important;
  }
  .deviceLog .more .el-button {
    width: 100%;
    padding: 0;
  }
  .moreBtn {
    color: #838383 !important;
  }
  .deviceName {
    color: #666;
    font-size: 16px;
    font-weight: 500;
    line-height: normal !important;
  }
</style>

<template>
  <v-app v-cloak="true" v-loading="fullscreenLoading" element-loading-text="刷新中..">
    <div slot="header-title">销售设备详情</div>
    <div slot="header-actions">
      <el-button size="small" v-on:click="refresh">刷新</el-button>
    </div>
    <div class="sale-device-view">
      <div class="flex sale-detail">
        <div class="flex-item">
          <div class="img" v-loading="avatarLoading">
            <div class="img-shadow align-center" v-if="!basicInfo.online">
              <div class="img-shadow-flex flex">
                <i class="iconfont icon-iot-ghlx" @click="refreshStatus"></i>
                <b>设备已离线</b>
                <span>最后在线:{{$filters.formatTime(basicInfo.lastTouchTime)}}</span>
              </div>
            </div>
            <img :src="basicInfo.productImage" />
          </div>
          <div class="basic-info padding-left-m padding-right-m">
            <h2 class="deviceName margin-bottom-s">
              {{ basicInfo.deviceName }}
              <!--<el-button type="text" size="large" v-on:click="checkLeaseProduct">{{ basicInfo.deviceName }}</el-button>-->
            </h2>
            <ul>
              <li><b>产品型号：</b><span>{{ basicInfo.itemCode }}</span></li>
              <li><b>设备编号：</b><span>{{ basicInfo.deviceId }}</span></li>
              <li><b>唯一编码：</b><span>{{ basicInfo.deviceUdid }}</span></li>
              <li><b>用户姓名：</b><span>{{ basicInfo.lessee }}</span></li>
              <li><b>购买日期：</b><span>{{$filters.formatTime(basicInfo.purchasedDate)}}</span></li>
              <li><b>安装地址：</b><span>{{ basicInfo.address }}</span></li>
            </ul>
          </div>
        </div>
        <div class="flex-item border-left">
          <div class="device-log">
            <h2 class="tit"><span>设备日志</span></h2>
            <div class="no-data margin-top-m margin-bottom-m align-center" v-if="deviceLog.length === 0">暂无数据</div>
            <el-row class="deviceLog" :class="{ 'deviceLog-box': deviceLog.length > 4 }" v-if="deviceLog.length > 0" v-loading="deviceLogLoading" element-loading-text="拼命加载中...">
              <el-col class="deviceLog-lists" v-for="item in deviceLog" :key="item.id">
                <i class="deviceLog-logo"></i>
                <div class="deviceLog-list">
                  <span class="margin-left-m margin-right-m">{{$filters.formatTime(item.createdAt)}}</span>
                  <span class="margin-left-m margin-right-m">{{item.logContext}}</span>
                </div>
              </el-col>
              <el-col class="more">
                <div class="moreBtn" v-if="isBlue">{{moreText}}</div>
                <el-button type="text" v-else v-on:click="loadMore">
                  {{moreText}}
                  <i class="el-icon-arrow-left el-icon-d-arrow-right" v-show="moreIcon"></i>
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
  import api from '@/apis/api-freshair'
  import messagebox from '@/assets/scripts/iotp-message-box'

  export default {
    name: "bulletin-view",
    data: function () {
      return {
        deviceEntityId: this.$route.params.deviceEntityId,  //设备实体ID(混淆后)
        basicInfo: {
          productImage: '', //产品图片
          deviceName: '', //设备名称
          itemCode: '', //产品型号
          deviceId: '', //设备编号
          deviceUdid: '', //唯一编码
          lessee: '', //用户姓名
          purchasedDate: '', //购买日期
          address: '', //安装地址
          lastTouchTime: '', //最后在线时间
          online: false //设备是否在线
        },
        deviceLog: [],
        fullscreenLoading: false,
        avatarLoading: false,
        deviceLogLoading: false,
        isBlue: false,
        moreText: '',
        totalElements: 0,
        deviceLogPage: {
          current: 0,
          size: 15,
          loadSize: 5
        },
        moreIcon: false
      }
    },
    mounted(){
      this.basicData();
      this.deviceLogs();
    },
    methods: {
      //刷新
      refresh() {
        this.fullscreenLoading = true;
        this.basicData();
        setTimeout(() => {
          this.fullscreenLoading = false
        },1000)
      },

      // 刷新头像离线状态
      refreshStatus(){
        this.avatarLoading = true;
        api.online(this.deviceEntityId)
          .then((res) => {
            setTimeout(() => {
              this.avatarLoading = false;
              this.basicInfo.online = res;
            }, 1000)
          });
      },

      //进入产品管理页
//      checkLeaseProduct() {
//        location.href = `/shop/product/${this.deviceEntityId}`;
//      },

      // 基本信息
      basicData(){
        api.detail(this.deviceEntityId)
          .then((res) => {
            if(res) {
              this.basicInfo.productImage = res.productImage || '/dist/images/placeholder.png';
              this.basicInfo.deviceName = res.deviceName;
              this.basicInfo.itemCode = res.itemCode || '(未知)';
              this.basicInfo.deviceId = res.deviceId || '(未知)';
              this.basicInfo.deviceUdid = res.iotDevice.deviceUdid || '(未知)';
              this.basicInfo.lessee = res.lessee || '(未知客户)';
              this.basicInfo.purchasedDate = res.purchasedDate === 0 ? '(未知日期)' : res.purchasedDate;
              if(res.address) {
                if(typeof (res.address) === 'string') {
                  this.basicInfo.address = res.address;
                } else {
                  if(res.address.fullAddress) {
                    this.basicInfo.address = res.address.fullAddress;
                  } else {
                    if (res.address.fullAddress) {
                      this.basicInfo.address = res.address.fullAddress;
                    } else {
                      this.basicInfo.address = '(未知)';
                    }
                  }
                }
              } else {
                this.basicInfo.address = '(未知)';
              }
              this.basicInfo.lastTouchTime = res.lastTouchTime === '' ? '(未知)' : res.lastTouchTime;
              this.basicInfo.online = res.online;
            }
          })
      },
      //设备日志
      deviceLogs(){
        let current = this.deviceLogPage.current;
        this.deviceLogPage.current = current + 1;
        this.deviceLogLoading = true;
        api.deviceLogs(this.deviceEntityId, {
          page_no: this.deviceLogPage.current,
          page_size: this.deviceLogPage.size,
          page_sort: 'createdAt_desc'
        })
          .then((res) => {
            setTimeout(() => {
              this.deviceLogLoading = false;
              let deviceLog = this.deviceLog;
              deviceLog = deviceLog.concat(res.fileList);
              this.deviceLog = deviceLog;
              this.totalElements = res.totalElements;
              if(this.totalElements === 0 || res.fileList.length < this.deviceLogPage.size){
                this.moreText = '暂无更多数据';
                this.moreIcon = false;
                this.isBlue = true
              } else if(this.totalElements > this.deviceLogPage.size){
                this.moreText = '查看更多';
                this.moreIcon = true;
                this.isBlue = false
              }
            }, 500)
          });
      },

      //查看更多设备日志
      loadMore() {
        this.deviceLogs();
      }
    }
  }
</script>
