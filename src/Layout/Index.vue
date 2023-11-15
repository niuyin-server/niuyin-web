<template>
  <!--  首页-->
  <div :class="niuyinTheme">
    <el-container class="layout-container" style="height: 100vh">
      <Aside :siteTitle="siteTitle"></Aside>
      <el-container class="is-vertical">
        <Header @themeChangeEmit="emitThemeChange"></Header>
        <el-main>
          <!--路由-->
          <router-view/>
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
  name: 'Home',
  components: {Aside, Header},
  data() {
    return {
      siteTitle: "牛音",
      videoUrl: undefined,
      niuyinTheme: "niuyin-light",
    }
  },
  created() {
    this.initTheme()
  },
  mounted(){
    this.$nextTick(()=>{
      const dark = themeX().dark
      if (dark) {
        this.niuyinTheme = "niuyin-dark"
      } else {
        this.niuyinTheme = "niuyin-light"
      }
    })
  },
  methods: {
    initTheme() {
      const dark = themeX().dark
      if (dark) {
        this.niuyinTheme = "niuyin-dark"
      } else {
        this.niuyinTheme = "niuyin-light"
      }
    },
    // 换肤事件
    emitThemeChange(dark){
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
  background-image: url($light-bg-image);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.niuyin-dark {
  background-image: url($dark-bg-image);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.el-footer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  right: 20px;
}

</style>
