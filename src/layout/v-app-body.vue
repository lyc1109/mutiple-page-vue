<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .app-body{
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    padding-left: $sidebar_width;
    padding-top: $topbar_height;
    overflow-y: auto;
  }
  .app-body__content{
    padding: 15px;
  }
</style>

<template>
  <div class="app-body" :style="{'padding-left': sidebarWidth + 'px'}">
    <div class="app-body__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "v-app-body",
    props: ["sidebarWidth"],
    /*mounted(){
      console.log("body sidebar:" + this.sidebarWidth);
    }*/
  }
</script>
