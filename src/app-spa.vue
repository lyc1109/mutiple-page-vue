<style lang="scss" type="text/scss">
  @import "~variables";
  .fade-enter-active {
    @include fadeIn(0.2s);
  }
  .fade-leave-active {
    @include fadeOut(0.2s);
  }
</style>

<template>
  <div id="app">
    <transition :name="transitionName" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'app',
    desc: 'app单页面模板，不包含顶部栏、左侧导航栏',
    data () {
      return {
        transitionName: "fade"
      }
    }
  }
</script>
