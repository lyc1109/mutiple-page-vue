<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .topbar-wrapper{
    background-color: $topbar_color;
    height: $topbar_height;
    overflow: hidden;
    color: $white;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }
  .shop-logo{
    padding: 10px 20px;
  }
  .fa-bell{
    margin-top: 3px;
  }
  .item-icon{
    display: inline-block;
    width: 24px;
  }
  .notify-link{
    color: $white;
  }
</style>

<template>
  <div class="topbar-wrapper">
    <div class="flex">
      <div class="shop-logo">
        <a class="a-white" href="/">
          <img src="#" class="valign-middle img-circle" width="36px" height="36px" :src="this.$filters.avatar(curShop.logo)"/>
          <span class="margin-left valign-middle font-l font-bold-300">{{curShop.name}}</span>
        </a>
      </div>

      <div class="flex-item"></div>

      <div>
        <div class="inline padding-right-xl">
          <a class="a-white notify-link" href="/notify">
            <el-badge :value="unreadCount" class="item">
              <em class="fa fa-bell icon-m"></em>
            </el-badge>
          </a>
        </div>
        <div class="inline padding-right-l padding-left cursor-pointer">
          <el-dropdown trigger="click">
            <div class="el-dropdown-link color-white">
              <img src="#" class="valign-middle img-circle" width="32px" height="32px" :src="this.$filters.avatar(curUser.avatar)"/>
              <span class="margin-left-s valign-middle">{{curUser.nickname}}</span><i class="el-icon-arrow-down el-icon--right valign-middle"></i>
            </div>
            <el-dropdown-menu slot="dropdown">

              <el-dropdown-item v-for="shop in shops" :key="shop.id">
                <span class="item-icon"><i class="" :class="{'far fa-check-circle': shop.id === curShop.id, 'fal fa-circle': shop.id !== curShop.id}"></i></span>
                {{shop.name}}
              </el-dropdown-item>

              <el-dropdown-item divided>
                <a href="/user/password/change">
                  <span class="item-icon"><i class="fa fa-lock"></i></span>修改密码
                </a>
              </el-dropdown-item>
              <el-dropdown-item>
                <a href="javascript:;" @click="logout">
                  <span class="item-icon"><i class="fas fa-sign-out-alt"></i></span>退出登录
                </a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import curShopApi from "@/apis/api-curshop";
  import curUserApi from "@/apis/api-curuser";
  import notifyApi from "@/apis/api-notify";

  export default {
    name: "v-app-topbar",
    data: function () {
      return {
        curUser: {},
        curShop: {},
        shops: [],
        unreadCount: 0
      };
    },
    created() {
      this.loadCurShop();
      this.loadCurUser();
      this.loadUnreadNotifyCount();
    },
    methods: {
      loadCurShop: function () {
        let curShop = this.$sessionStorage.get("curShop");
        let shops = this.$sessionStorage.get("shops");
        if(curShop === null || shops === null) {
          curShopApi.curshops()
            .then((resp) => {
              this.curShop = resp.curShop;
              this.shops = resp.shops;
              this.$sessionStorage.set("curShop", this.curShop);
              this.$sessionStorage.set("shops", this.shops);
            });
        } else {
          this.curShop = curShop;
          this.shops = shops;
        }
      },
      loadCurUser: function () {
        let curUser = this.$sessionStorage.get("curUser");
        if(curUser === null) {
          curUserApi.curuser()
            .then((curUsr) => {
              this.curUser = curUsr;
              this.$sessionStorage.set("curUser", this.curUser);
            });
        } else {
          this.curUser = curUser;
        }
      },
      loadUnreadNotifyCount: function () {
        notifyApi.unreadCount(true)
          .then((resp) => {
            this.unreadCount = resp;
          })
      },
      logout: function () {
        this.$sessionStorage.remove("curShop");
        this.$sessionStorage.remove("shops");
        this.$sessionStorage.remove("curUser");
        window.open("/logout", "_self");
      }
    }
  }
</script>
