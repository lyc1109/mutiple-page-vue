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
  <div id="app" class="app-wrapper">
    <v-app-topbar></v-app-topbar>
    <v-app-sidebar @onSidebarChange="onSidebarChange"></v-app-sidebar>
    <v-app-body :sidebar-width="sidebarWidth">
      <transition :name="transitionName" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-app-body>
  </div>
</template>

<script>
  import VAppTopbar from "@/layout/v-app-topbar";
  import VAppSidebar from "@/layout/v-app-sidebar";
  import VAppBody from "@/layout/v-app-body";

  export default {
    name: 'app',
    desc: 'app页面模板，包含顶部栏、左侧导航栏，使用请参考 modules/demo 模块',
    components: {
      VAppTopbar,
      VAppSidebar,
      VAppBody
    },
    data () {
      return {
        transitionName: "fade",
        sidebarWidth: 160
      }
    },
    methods: {
      onSidebarChange: function (sidebarWidth) {
        this.sidebarWidth = sidebarWidth;
      }
    }
  }
</script>
