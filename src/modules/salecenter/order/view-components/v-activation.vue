<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .el-table /deep/ {
    thead {
      color: #444444;
    }
    td {
      font-size: 12px;
      color: #7b7b7b;
      font-weight: 400;
    }
  }
  .bg-orange {
    background-color: #FF6633;
    height: 36px;
    box-sizing: border-box;
  }
  .order-activation > span,
  .order-activation > a{
    width: calc(50% - 5px);
    display: inline-block;
  }
  .activation-title {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
  }
  .isShowDialog {
    text-decoration: underline;
  }
</style>

<template>
  <div>
    <div class="padding bg-orange order-activation" v-if="orderDeviceStatus === 1 && status.isShowBtns">
      <span class="color-white align-left">订单激活码：{{ activation }}</span>
      <a class="color-white align-right" href="javascript:;" v-popover:memopopover @click="is_active = true">立即激活</a>
    </div>
    <div class="padding bg-orange order-activation" v-else>
      <span class="color-white align-left">
        <span>已关联设备</span>
        <a class="isShowDialog font-bold-500 font-m color-white" href="javascript:;"  @click="isShowDialog = true">{{ relationNum }}</a>
        <span>台</span>
      </span>
      <!--v-if="productsnum > devices.length"-->
      <a class="color-white align-right padding-right-m" href="javascript:;" v-popover:memopopover @click="is_active = false">
        <span v-if="productsnum > devices.length && status.isShowBtns">添加设备</span>
      </a>
    </div>
    <!--激活和添加设备公用弹框弹出框-->
    <el-popover
      ref="memopopover"
      width="400"
      trigger="click"
      v-model="deviceVisible">
      <div>
        <div class="activation-title margin-m">请输入12位的设备编码</div>
        <el-input label="设备编码" v-model="params.deviceId"></el-input>
      </div>
      <div class="align-right margin-top-m">
        <el-button type="primary" size="mini" @click="onOk">确定</el-button>
        <el-button size="mini" @click="deviceVisible = fasle">取消</el-button>
      </div>
    </el-popover>
    <!--订单关联设备弹出框-->
    <el-dialog
      title="订单关联设备"
      :visible.sync="isShowDialog">
      <div>
        <el-table :data="devices">
          <el-table-column prop="deviceId" label="设备编码"></el-table-column>
          <el-table-column prop="activeTime" label="激活时间">
            <template slot-scope="scope">
              {{$filters.formatTime(scope.row.activeTime)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" v-if="status.isShowBtns">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delDevice(scope.row.deviceId)">删除</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.activeTime === ''"
                @click="deviceTable(scope.row.deviceId)"
              >激活</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex margin" v-if="productsnum > devices.length && status.isShowBtns">
          <el-input
            v-model="params.deviceId"
            placeholder="请输入12位的设备编码"
            size="small"
            style="width: 250px;"
          >
            <el-button class="color-blue-1" slot="append" type="primary" @click="onOk(false)">添加设备</el-button>
          </el-input>
          <div style="font-size: 12px; color: #bbbbbb;">（已添加{{ devices.length }}台设备，还可添加{{ productsnum - devices.length }}台设备）</div>
        </div>
      </div>
      <div slot="footer">
        <el-button size="mini" @click="isShowDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/apis/api-order'
  import messagebox from '@/assets/scripts/iotp-message-box'

  export default {
    name: "v-activation",
    props: {
      data: {},
      orderstatus: {},
      num: Number,
      activationCode: String
    },
    data() {
      return {
        entityId: this.$route.params.entityId,
        deviceVisible: false,
        is_active: false,
        orderDeviceStatus: 1,
        isShowDialog: false,
        relationNum: 0,//关联数量
        params: {
          deviceId: '',
          is_active: true
        }
      }
    },
    computed: {
      devices() {
        let devicesArr = this.data;
        if(devicesArr.length > 0) {
          let flag = false;
          for(let i = 0; i < devicesArr.length; i++) {
            if(devicesArr[i].activeTime === null || devicesArr[i].activeTime === '') {
              flag = true;
              break;
            }
          }
          if(flag) {
            this.orderDeviceStatus = 1;
          } else {
            this.orderDeviceStatus = 2;
          }
        } else {
          this.orderDeviceStatus = 3;
        }
        this.relationNum = devicesArr.length;
        return devicesArr;
      },
      status() {
        return this.orderstatus;
      },
      activation() {
        return this.activationCode;
      },
      productsnum() {
        return this.num;
      }
    },
    methods: {
      //弹出框激活设备
      onOk() {
        let that = this;
        let is_active = that.is_active;
        let deviceId = that.params.deviceId.trim();
        if([...deviceId].length === 12) {
          let flag = false;
          if(!is_active) {//判断所添加的设备是否已经关联
            for (let i = 0; i < that.devices.length; i++) {
              if(that.devices[i].deviceId.trim() === deviceId) {
                flag = true;
                break;
              }
            }
            if(flag) {
              that.$message.error('所添加设备已是关联设备！');
              return;
            }
          }
          if(!flag) {
            that.params.is_private = that.checked;
            that.params.is_active = is_active;
            that.deviceActivation();
          }
        } else {
          that.$message.error('请输入正确的设备编码！');
        }
      },
      //列表设备激活
      deviceTable(deviceId) {
        let that = this;
        that.params.deviceId = deviceId;
        that.params.is_active = true;
        that.deviceActivation();
      },
      //添加或激活设备
      deviceActivation() {
        let that = this;
        let is_active = that.params.is_active;
        api.device(that.entityId, that.params)
          .then((res) => {
            if(res){
              that.deviceVisible = false;
              that.params.deviceId = '';
              that.$message({
                type: 'success',
                message: is_active ? '激活设备成功！' : '添加设备成功！'
              });
              that.$emit('refresh');
            } else {
              that.$message.error(is_active ? '激活设备失败！' : '添加设备失败！');
            }
          })
      },
      //删除关联设备
      delDevice(deviceId) {
        let that = this;
        messagebox.confirm(that, '亲，是否确认删除关联设备？')
          .then((data) => {
            api.delDevice(that.entityId, deviceId)
              .then((res) => {
                if(res){
                  that.$message({
                    type: 'success',
                    message: '删除关联设备成功！'
                  });
                  that.$emit('refresh');
                }
              })
          })
      }
    }
  }
</script>

