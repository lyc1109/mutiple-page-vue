<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .max-height {
    max-height: 150px;
    overflow-y: scroll;
  }
  .order-remarks {
    height: 300px;
  }
  .order-remarks-title {
    border-bottom: 1px solid #DDDDDD;
  }
  .order-remarks-title > span,
  .order-remarks-title > a{
    width: 49%;
    display: inline-block;
  }
  .order-remarks-contetn {
    height: 180px;
    overflow-y: scroll;
  }
</style>

<template>
  <div class="order-remarks padding-left padding-right">
    <div class="order-remarks-title padding">
      <span class="align-left">日志与备注</span>
      <a class="align-right color-blue-1" href="javascript:;" v-popover:memopopover>
        <span v-if="status.isShowBtns">添加备注</span>
      </a>
    </div>
    <div class="order-remarks-contetn padding">
      <v-timeline :data="allData"></v-timeline>
    </div>
    <!--添加备注弹出框-->
    <el-popover
      ref="memopopover"
      width="400"
      trigger="click"
      v-model="memoVisible">
      <div>
        <el-input type="textarea" :rows="5" placeholder="请填写备注" v-model="memoParams.memo">
        </el-input>
        <el-checkbox class="margin-top-s" v-model="checked">仅自己可见</el-checkbox>
      </div>
      <div class="align-right">
        <el-button type="primary" size="mini" @click="addMemo">确定</el-button>
        <el-button size="mini" @click="memoVisible = fasle">取消</el-button>
      </div>
    </el-popover>

    <div style="display: none;">
      <v-timeline :data="logs"></v-timeline>
    </div>
  </div>
</template>

<script>
  import api from '@/apis/api-order'
  import messagebox from '@/assets/scripts/iotp-message-box'
  import VTimeline from "@/components/v-timeline";

  export default {
    name: "v-logs-remarks",
    props: {
      data: [],
      orderstatus: {}
    },
    data: function() {
      return {
        allData: [],
        activeNames: ['2'],
        entityId: this.$route.params.entityId,
        memos: [],
        memoVisible: false,
        checked: false,
        memoParams: {
          type: 'memo_shop',
          memo: '',
          is_private: false
        }
      }
    },
    computed: {
      logs() {
        let data = this.data;
        let arr = [];
        for(let i = 0; i < data.length; i++) {
          let str = data[i].logContent +
            '<div class="font-lighter font-s margin-top-s">' + this.$filters.formatTime(data[i].gmtCreated) + '</div>';
          arr.push(str);
        }
        this.allData = arr;
        this.getMemo();
        return arr;
      },
      status() {
        return this.orderstatus;
      }
    },
    methods: {
      //获取订单备注
      getMemo() {
        let that = this;
        api.getMemo(that.entityId)
          .then((res) => {
            if(res) {
              let data = res.fileList;
              let arr = [];
              for(let i = 0; i < data.length; i++) {
                let name = data[i].memoType === 'memo_user' ? '用户留言' : '客服备注';
                let str = '【' + name + '】' + data[i].memo +
                  '<div class="font-lighter font-s margin-top-s">' + this.$filters.formatTime(data[i].gmtCreated) + '</div>';
                arr.push(str)
              }
              let allData = that.allData.concat(arr);
              for(let i = 0; i < allData.length - 1; i++) {
                for(let j = i + 1; j < allData.length; j++) {
                  let first =  new Date(allData[i].slice(-22, -6)).getTime();
                  let second = new Date(allData[j].slice(-22, -6)).getTime();
                  if(first < second) {//如果前面的数据比后面的大就交换
                    let temp = allData[i];
                    allData[i] = allData[j];
                    allData[j] = temp;
                  }
                }
              }


              this.allData = allData;
            }
          })
      },
      //添加备注
      addMemo() {
        let that = this;
        let memo = that.memoParams.memo.trim();
        if(memo) {
          that.memoParams.is_private = that.checked;
          api.addMemo(that.entityId, that.memoParams)
            .then((res) => {
              if(res){
                that.memoVisible = false;
                that.memoParams.memo = '';
                that.memoParams.is_private = false;
                that.checked = false;
                that.$message({
                  type: 'success',
                  message: '添加备注成功！'
                });
                that.$emit('refresh');
              }
            })
        } else {
          that.$message.error('备注内容不能为空！');
        }
      },
      //删除备注
      delMemo(deviceId) {
        let that = this;
        messagebox.confirm(that,'该备注删除后无法恢复，确定删除该备注？')
          .then(() => {
            that.memoParams.is_private = that.checked;
            api.delMemo(that.entityId, deviceId)
              .then((res) => {
                if(res){
                  that.$message({
                    type: 'success',
                    message: '删除备注成功！'
                  });
                  that.getMemo();
                }
              })
          })
      }
    },
    components: {
      VTimeline
    }
  }
</script>
