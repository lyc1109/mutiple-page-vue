<style scoped lang="scss" type="text/scss">
  @import "~@assets/scss/layouts/app-sidebar.scss";
</style>

<template>
  <div class="sidebar-wrapper" :style="sidebarStyle">
    <!-- 一级菜单 -->
    <div class="sidebar sidebar-left" :class="{'sidebar-left-closed': isLeftSidebarClose}">
      <ul>
        <li class="sidebar-item"
            v-for="menu in menus"
            :key="menu.code"
            :class="{'active': menu.active}"
            @click="openMenu(menu)">
          <el-tooltip class="item" effect="dark" :content="menu.name" placement="right" :disabled="!isLeftSidebarClose">
            <a :href="menu.url">
              <em :class="menu.icon"></em>
              <span class="sidebar-title">{{menu.name}}</span>
            </a>
          </el-tooltip>
        </li>
      </ul>

      <div style="height: 50px"></div>
      <div class="sidebar-left-collapse" @click="toggleLeftSidebarClose">
        <a href="javascript:;"><i class="fa nav-collapse-icon fa-indent"></i></a>
      </div>
    </div>

    <div class="sidebar sidebar-right" v-if="childrenMenus.length > 0">
      <el-menu :default-openeds="defaultOpenSubMenuIdx">
        <template v-for="(item,index) in childrenMenus">
          <!-- 二级菜单 -->
          <el-menu-item class="sidebar-item"
                        :class="{'active': item.active}"
                        :index="index"
                        @click="openSubMenu(item)"
                        v-if="!(item.children && item.children.length > 0)">
            <a>
              <em :class="item.icon"></em>
              <span slot="title">{{item.name}}</span>
            </a>
          </el-menu-item>

          <!-- 三级菜单 -->
          <el-submenu class="sidebar-item__sub"
                      :class="{'active': item.active}"
                      :index="index"
                      v-if="item.children && item.children.length > 0">
            <template slot="title">
              <div class="submenu-title">
                <em :class="item.icon"></em>
                <span>{{item.name}}</span>
              </div>
            </template>

            <el-menu-item class="sidebar-item"
                          v-for="(subItem,subIdx) in item.children"
                          :index="subIdx"
                          :key="subItem.code"
                          :class="{'active': subItem.active}"
                          @click="openSubMenu(subItem)">
              <a><span slot="title">{{subItem.name}}</span></a>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import _ from "lodash";
  import leaseScenarioApi from "@/apis/api-lease-scenario";

  export default {
    name: "v-app-sidebar",
    computed: {
      /**
       * 计算导航菜单宽度，
       * 导航默认 160 px，一级导航折叠后 50px
       */
      sidebarStyle: function () {
        let sidebarWidth = 160;
        if(this.childrenMenus.length > 0) {
          sidebarWidth = this.isLeftSidebarClose ? (160 + 50) : 320;
        } else {
          sidebarWidth = this.isLeftSidebarClose ? 50 : 160;
        }

        // 回传到父组件，并通过父组件传到body组件使之内容自适应
        this.$emit("onSidebarChange", sidebarWidth);

        return {
          width: sidebarWidth + "px"
        };
      }
    },
    mounted: function () {
      this.getScenariosForMenus();

      // 租赁中心菜单特殊延时处理
      let curUrl = window.location.href;
      let timeout = 10;
      if(curUrl.indexOf("leasecenter") > -1) {
        timeout = 600;
      }

      setTimeout(() => {
        let activeMenuIndex = _.findIndex(this.menus, function (item) {
          return curUrl.indexOf(item.code) > -1;
        });
        if (activeMenuIndex >= 0) {
          this.openMenu(this.menus[activeMenuIndex]);
        }
      }, timeout);
    },
    methods: {
      /**
       * 打开一级菜单链接
       *
       * @param menu 一级菜单
       */
      openMenu: function (menu) {
        // 设置激活状态
        for(let item of this.menus){
          item.active = false;
        }
        menu.active = true;

        // 获取子菜单
        this.defaultOpenSubMenuIdx = [];
        this.childrenMenus = [];
        this.isLeftSidebarClose = false;

        if(menu.children && menu.children.length > 0) {
          this.childrenMenus = menu.children;
          // 有子菜单默认折叠一级菜单
          this.isLeftSidebarClose = true;

          // 计算激活子菜单序号
          let curUrl = window.location.href;
          let subMenuUrl = "";
          if(curUrl.lastIndexOf("#") > -1) {
            subMenuUrl = curUrl.split("#")[1];
          }

          // 默认展开所有子菜单
          for(let i=0; i < this.childrenMenus.length; i++){
            let subItem = this.childrenMenus[i];

            // 默认激活第一个子菜单
            if((subMenuUrl === "" || subMenuUrl === "/") && i === 0) {
              subItem.active = true;
            } else {
              // 若子菜单路径匹配则激活
              if(subMenuUrl.indexOf(subItem.url) > -1) {
                subItem.active = true;
              }
            }

            if(subItem.children && subItem.children.length > 0) {
              this.defaultOpenSubMenuIdx.push(i);

              // 默认激活第一个子菜单
              if(subMenuUrl === "" || subMenuUrl === "/") {
                console.log(subItem.active)
                // subItem.children[0].active = true;
              } else {
                for(let j=0; j<subItem.children.length; j++) {
                  // 若子菜单路径匹配则激活
                  let thirdItem = subItem.children[j];
                  if(subMenuUrl.indexOf(thirdItem.url) > -1) {
                    thirdItem.active = true;
                  }
                }
              }
            }
          }
        }
      },

      /**
       * 打开二菜单链接
       *
       * @param menu 一级菜单
       */
      openSubMenu: function (menu) {
        // 设置激活状态
        for(let item of this.childrenMenus){
          item.active = false;

          if(item.children && item.children.length > 0) {
            for(let subItem of item.children){
              subItem.active = false;
            }
          }
        }
        menu.active = true;
        // console.log(menu.version)
        // 打开页面
        if(menu.url) {
          if(menu.version === "v2") {
            window.open(menu.url, "_self");
          } else {
            this.$router.replace(menu.url);
          }
        }
      },

      /**
       * 切换左侧导航折叠展开
       */
      toggleLeftSidebarClose: function () {
        this.isLeftSidebarClose = !this.isLeftSidebarClose;
      },

      // 获取租赁场景菜单配置
      getScenariosForMenus: function () {
        leaseScenarioApi.getScenariosForMenu()
          .then((resp) => {
            let leaseScenarioMenus = [];
            for(let item of resp) {
              leaseScenarioMenus.push({
                code: item.code,
                name: item.name,
                icon: item.icon,
                children: [{
                  code: "lease_"+ item.code +"_dashboard",
                  name: "租赁统计",
                  url: "/lease/dashboard?scenario=" + item.code,
                  version: "v2",
                },{
                  code: "lease_"+ item.code +"_devices",
                  name: "租赁设备",
                  url: "/lease/devices?scenario=" + item.code,
                  version: "v2",
                },{
                  code: "lease_"+ item.code + "_products",
                  name: "租赁产品",
                  url: "/lease/products?scenario=" + item.code,
                  version: "v2",
                },{
                  code: "lease_"+ item.code +"_order",
                  name: "租赁订单",
                  url: "/lease/orders?scenario=" + item.code,
                  version: "v2",
                },{
                  code: "lease_"+ item.code +"_fund",
                  name: "租赁资金",
                  url: "/lease/fund?scenario=" + item.code,
                  version: "v2",
                }]
              })
            }

            let leaseMenu = _.find(this.menus, function (obj) {
              return obj.code === "leasecenter"
            });
            let leaseChildren = leaseMenu.children;
            leaseChildren = _.concat(leaseScenarioMenus, leaseChildren);
            leaseMenu.children = leaseChildren;
          })
      }
    },

    data: function () {
      return {
        // 子菜单数据
        childrenMenus: [],
        // 默认展开子菜单序号
        defaultOpenSubMenuIdx: [],
        // 左侧菜单是否折叠
        isLeftSidebarClose: false,

        // 菜单数据，配置规则
        // 1. 一级菜单的code必须包含在url，如营销中心marketcenter，访问路径为：“/v3/marketcenter”开头
        // 2. 若是旧版本菜单，则必须包含version="v2"属性
        menus: [
          {
            code: "Home",
            name: "企业首页",
            icon: "iconfont icon-iot-shouye",
            url: "/",
            version: "v2",
            active: true
          },

          // 租赁中心
          {
            code: "leasecenter",
            name: "租赁中心",
            icon: "iconfont icon-iot-zlgl",
            url: "/lease/dashboard?scenario=standard",
            active: false,
            // 二级菜单
            children: [
              {
                code: 'leasecenter_statistic',
                name: '租赁分析',
                icon: 'iconfont icon-iot-tongji',
                url: '/statistic',
                active: false
              }
            ]
          },

          // 服务中心
          {
            code: "ServiceCenter",
            name: "服务中心",
            icon: "iconfont icon-iot-fwgl",
            url: "/serviceorders",
            active: false,
          },

          // 授权管理
          {
            code: "AuthMgm",
            name: "授权管理",
            icon: "iconfont icon-iot-authorise",
            url: '/products/auth?type=product',
            active: false
          },

          // 产品管理
          // {
          //   code: "ProductMgm",
          //   name: "产品管理",
          //   icon: "iconfont icon-iot-cpgl",
          //   url: "/shop/product",
          //   active: false
          // },
          // 商品管理
          {
            code: "productmgm",
            name: "商品管理",
            icon: "iconfont icon-iot-cpgl",
            url: "/v3/productmgm",
            version: 'v3',
            active: false,
            children: [
              {
                code: 'productmgm_product',
                name: '商品管理',
                icon: 'iconfont icon-iot-cpgl',
                url: '/product',
                version: 'v3',
                active: false
              },
              {
                code: 'productmgm_band',
                name: '基础配置',
                icon: 'iconfont icon-iot-jinxingfuwu',
                version: 'v3',
                active: false,
                children: [
                  {
                    code: 'productmgm_brand',
                    name: '品牌管理',
                    icon: '',
                    url: '/brand',
                    version: 'v3',
                    active: false
                  },
                  {
                    code: 'productmgm_category',
                    name: '分类管理',
                    icon: '',
                    url: '/category',
                    version: 'v3',
                    active: false
                  },
                  {
                    code: 'productmgm_iotmodel',
                    name: '智能模板配置',
                    icon: '',
                    url: '/iotmodel',
                    version: 'v3',
                    active: false
                  }
                ]
              }
            ]
          },

          // 销售中心
          {
            code: "salecenter",
            name: "销售中心",
            icon: "iconfont icon-iot-sell",
            url: "/v3/salecenter",
            active: false,
            // 二级菜单
            children: [
              {
                code: "salecenter_order",
                name: "销售订单",
                icon: "iconfont icon-iot-fwdd",
                url: "/order",
                active: false,
              },
              {
              code: "salecenter_ifreshair",
              name: "销售设备",
              icon: "iconfont icon-iot-yajinzonge",
              url: "/sale",
              version: "v2",
              active: false,
            }
            ]
          },

          // 营销中心
          {
            code: "marketcenter",
            name: "营销中心",
            icon: "iconfont icon-iot-yue",
            url: "/v3/marketcenter",
            active: false,
            // 二级菜单
            children: [{
              code: "marketcenter_bulletin",
              name: "公告管理",
              icon: "iconfont icon-iot-gggl",
              url: "/bulletin",
              active: false,
            }]
          },

          // 会员管理
          {
            code: "ShopMember",
            name: "会员管理",
            icon: "iconfont icon-iot-hygl",
            url: "/shop/member",
            active: false
          },
          // 企业设置
          {
            code: "sysconfig",
            name: "系统管理",
            icon: "iconfont icon-iot-cogs",
            url: "/media",
            active: false,
            children: [
                {
                  code: "sysconfig_media",
                  name: "素材管理",
                  icon: "iconfont icon-iot-keyongyue",
                  url: "/media/images",
                  version: "v2",
                  active: false,
              },
                {
                  code: "sysconfig_employee",
                  name: "员工管理",
                  icon: "iconfont icon-iot-fuwushang",
                  url: "/shop/employee",
                  version: "v2",
                  active: false,
                },
                {
                  code: "sysconfig_sms",
                  name: "短信配置",
                  icon: "iconfont icon-iot-Contactus",
                  url: "/smsconfig",
                  version: "v2",
                  active: false,
                },
                {
                  code: "sysconfig_strategy",
                  name: "系统策略",
                  icon: "iconfont icon-iot-jinxingfuwu",
                  url: "/sys/strategy",
                  version: "v2",
                  active: false,
                },
                {
                  code: "sysconfig_basic",
                  name: "企业信息",
                  icon: "iconfont icon-iot-chengshifugai",
                  url: "/shop/config/basic",
                  version: "v2",
                  active: false,
                },
                {
                  code: "sysconfig_entry",
                  name: "公众号配置",
                  icon: "fa fa-wechat",
                  url: "/shop/config/wechat",
                  version: "v2",
                  active: false,
                },
                {
                  code: "sysconfig_workflow",
                  name: "审批配置",
                  icon: "iconfont icon-iot-shenpi",
                  url: "/workflow",
                  version: "v2",
                  active: false,
                },
              {
                code: 'sysconfig_exportdevice',
                name: '设备导入',
                icon: 'iconfont icon-iot-daoru',
                url: '/exportdevice',
                active: false
              }
            ]
          },

          // ------------------------------
          // iotp-web-demo示例 ------------------------------
          {
            code: "demo",
            name: "组件示例",
            icon: "iconfont icon-iot-shangwuzulin",
            url: "/v3/demo",
            // 二级菜单
            children: [{
              code: "demo_list",
              name: "数据表格",
              url: "/datagrid",
            },{
              code: "demo_form",
              name: "表单页",
              url: "/form",
              active: false,
            },{
              code: "demo_timeline",
              name: "时间轴",
              url: "/timeline",
              active: false,
            },{
              code: "demo_currency",
              name: "金额输入",
              url: "/v-form-currency",
              active: false,
            }]
          },
        ]
      }
    }
  }
</script>
