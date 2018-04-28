<template>
  <el-button :type="type" :size="size" @click="goBack"><slot></slot></el-button>
</template>

<script>
  export default {
    name: "v-button-cancel",
    desc: "返回上一页按钮",
    props: {
      // el-button大小属性，可选：	medium / small / mini
      size: {
        type: String,
        default: ""
      },
      type: {
        type: String,
        default: ''
      }
    },
    methods: {
      goBack: function () {
        this.$router.go(-1);
      }
    }
  }
</script>
