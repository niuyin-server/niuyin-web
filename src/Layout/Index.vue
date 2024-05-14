<template>
  <!--  首页-->
  <div :class="niuyinTheme">
    <div class="bg-mask"></div>
    <el-container class="layout-container" style="height: 100vh">
      <Aside :siteTitle="siteTitle"></Aside>
      <el-container class="is-vertical">
        <Header @themeChangeEmit="emitThemeChange"></Header>
        <el-main class="main-container">
          <!--路由-->
          <router-view v-slot="{ Component }">
            <keep-alive :include="['Video','Discover','HotVideo','Follow','User','CategoryVideo2']">
              <component :is="Component"/>
            </keep-alive>
          </router-view>
          <el-backtop :right="16" :bottom="16" target=".main-container"></el-backtop>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Aside from "@/components/Aside.vue"
import Header from "@/components/Header.vue"
import {themeX} from "@/store/themeX";

export default {
  name: 'Index',
  components: {Aside, Header},
  data() {
    return {
      siteTitle: "牛音",
      niuyinTheme: "niuyin-light",
    }
  },
  created() {
  },
  mounted() {
    this.initTheme()
    this.roydonLog()
    this.$nextTick(() => {
      const dark = themeX().dark
      if (dark) {
        this.niuyinTheme = "niuyin-dark"
      } else {
        this.niuyinTheme = "niuyin-light"
      }
    })
  },
  methods: {
    roydonLog() {
      console.log(
          "%croydon",
          "background-color: gold ; color: pink ;text-shadow: 3px 1px 3px black ; font-weight: bolder ; border-radius: 10px;font-size: 30px ;padding: 10px 100px;"
      );
      console.log(
          "%chttps://github.com/niuyin-server",
          "background-color: pink ; color: white ; font-weight: bold ; border-radius: 6px;padding:5px 10px;" +
          "font-size: 16px ; font-style: italic ; text-decoration: underline ; " +
          "font-family: 'american typewriter' ; text-shadow: 1px 2px 3px black ;"
      );
      console.group(
          "%cniuyin产品列表",
          "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
      );
      console.log("niuyin-web");
      console.log("niuyin-creator");
      console.log("niuyin-android");
      console.groupEnd();
    },
    initTheme() {
      const dark = themeX().dark
      if (dark) {
        this.niuyinTheme = "niuyin-dark"
      } else {
        this.niuyinTheme = "niuyin-light"
      }
    },
    // 换肤事件
    emitThemeChange(dark) {
      if (dark) {
        this.niuyinTheme = "niuyin-dark"
      } else {
        this.niuyinTheme = "niuyin-light"
      }
    },
  }

}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/*@import "@/assets/styles/index.scss";*/
$light-bg-image: "@/assets/background/theme-light.jpg";
$dark-bg-image: "@/assets/background/theme-dark.jpg";


.niuyin-light {
  //background-image: url($light-bg-image);
  //background-position: center;
  //background-repeat: no-repeat;
  //background-size: cover;
}

.niuyin-dark {
  //background-image: url($dark-bg-image);
  //background-position: center;
  //background-repeat: no-repeat;
  //background-size: cover;
}

.bg-mask {
  width: 100vw;
  height: 100vh;
  background: no-repeat var(--global-bg-img) var(--color-bg-b0);
  position: fixed;
}

.el-footer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  right: 20px;
}

</style>
