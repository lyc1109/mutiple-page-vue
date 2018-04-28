<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .color-gray {
    color: #CCCCCC;
  }
  .order-progress {
    width: 100%;
    height: 150px;
    box-sizing: border-box;
    border: 1px solid #eeeeee;
    -webkit-box-shadow: 0 1px 1px #eeeeee;
    -moz-box-shadow: 0 1px 1px #eeeeee;
    box-shadow: 0 1px 1px #eeeeee;
    position: relative;
  }
  .order-progress-line {
    width: calc(100% - 160px);
    height: 4px;
    background-color: #CCCCCC;
    margin: 0 auto;
    position: relative;
  }
  .order-progress-line-active {
    width: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: #32a8ee;
  }
  .order-progress-line-text {
    position: absolute;
    top: -34px;
    width: 160px;
    text-align: center;
    z-index: 9;
  }
  .order-progress-line-text > div:first-child {
    color: #ff5722;
  }
  .order-progress-line-text > div:last-child {
    color: #000000;
  }
  .order-progress-status {
    position: absolute;
    left: 30px;
    right: 30px;
    top: 10px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
  }
  .order-progress-title-active {
    color: #32a8ee;
  }
  .order-progress-icon {
    width: 50px;
    height: 50px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    line-height: 50px;
    text-align: center;
    font-size: 32px;
    font-weight: 600;
  }
  .bg-text-default {
    background-color: #CCCCCC;
    color: #888888;
  }
  .bg-text-active {
    background-color: #32a8ee;
    color: #ffffff;
  }
  .order-progress-msg {
    width: 150px;
  }
  .order-progress-msg > div {
    text-align: center;
    margin: 0 auto;
  }
  .order-progress-mask {
    position: absolute;
    left: 0;;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
</style>

<template>
  <div class="order-progress padding valign-center margin-top-m">
    <div class="order-progress-line">
      <div class="order-progress-line-active" :style="{ width: progressLineWidth + '%'}"></div>
      <div class="order-progress-line-text font-l font-bold-700" :style="{ left: 'calc(' + (progressLineWidth === 100 ? 50 : progressLineWidth) + '% - 80px)'}">
        <div v-if="progressMsg.orderStatus === 90">&nbsp;&nbsp;订单已关闭！</div>
        <div v-else-if="progressMsg.orderStatus === 95">&nbsp;&nbsp;订单已取消！</div>
        <div v-else-if="progressMsg.cancelStatus === 80">&nbsp;&nbsp;订单已取消！</div>
        <div v-else-if="progressMsg.cancelStatus === 90">&nbsp;&nbsp;订单已关闭！</div>
        <div class="font-default margin-top-m font-bold-500">{{ progressMsg.cancelTime !== 0 ? $filters.formatTime(progressMsg.cancelTime) : '' }}</div>
      </div>
    </div>
    <div class="order-progress-status" v-if="status">
      <div class="order-progress-msg font-default" v-for="(item, index) in progressShow" :key="index">
        <div class="order-progress-title padding font-bold-600" :class="index < progress ? 'order-progress-title-active' : 'color-gray'">{{ item.title }}</div>
        <div class="order-progress-icon" :class="index < progress ? 'bg-text-active' : 'bg-text-default'">{{ index+1 }}</div>
        <div class="order-progress-date padding font-bold-500">{{ item.time !== 0 ? $filters.formatTime(item.time) : '' }}</div>
      </div>
    </div>
    <div class="order-progress-status" v-else>
      <div class="order-progress-msg font-default" v-for="(item, index) in progressShow" :key="index">
        <div class="order-progress-title padding font-bold-600" :class="index < progress ? 'order-progress-title-active' : 'color-gray'">{{ item.title }}</div>
        <div class="order-progress-icon" :class="index < progress ? 'bg-text-active' : 'bg-text-default'">{{ index+1 }}</div>
        <div class="order-progress-date padding font-bold-500">{{ item.time !== 0 ? $filters.formatTime(item.time) : '' }}</div>
      </div>
    </div>
    <div :class="/^(90|95)$/.test(progressMsg.orderStatus) || /^(80|90)$/.test(progressMsg.cancelStatus) ? 'order-progress-mask' : ''"></div>
  </div>
</template>

<script>
  export default {
    name: "v-progress",
    props: {
      data: {}
    },
    data: function() {
      return {
        progress: 0,
        progressText: '',
        progressLineWidth: 0,//进度条长度
        status: true,
        progressShow: [
          {
            title: '待支付',
            time: ''
          },
          {
            title: '待发货',
            time: ''
          },
          {
            title: '已发货',
            time: ''
          },
          {
            title: '交易完成',
            time: ''
          }
        ]
      }
    },
    computed: {
      progressMsg() {
        this.progressShow[0].time = this.data.created || '';
        this.progressShow[1].time = this.data.payTime || '';
        this.progressShow[2].time = this.data.consignTime || '';
        this.progressShow[3].time = this.data.endTime || '';
        return this.data;
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      //初始化进度条
      init() {
        let that = this;
        that.$watch('progressMsg', function() {
          let progressType = that.progressMsg.orderStatus;
          let progress = null;
          switch (progressType) {
            case 0: progress = 1; break;
            case 10: progress = 2; break;
            case 20: progress = 3; break;
            case 80: progress = 4; break;
            default: break;
          }
          let defendStatus = that.progressMsg.defendStatus;
          let cancelStatus = that.progressMsg.cancelStatus;
          let refundStatus = that.progressMsg.refundStatus;
          if(/^(90|95)$/.test(progressType) || /^(80|90)$/.test(defendStatus) || /^(89|90)$/.test(cancelStatus) || /^(80)$/.test(refundStatus)) {
            that.status = false;
            progress = 4;
          } else {
            that.status = true;
          }
          that.progress = progress;
          if(progress) {
            let progressNum = that.progressShow.length - 1;
            if(progress === progressNum + 1) {
              that.progressLineWidth = 100;
            } else {
              that.progressLineWidth = (progress - 0.5) * parseInt((100 / progressNum));
            }
          }
        })
      }
    }
  }
</script>

