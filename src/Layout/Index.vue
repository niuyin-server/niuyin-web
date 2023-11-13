<template>
  <!--  首页-->
  <div class="niuyin">
    <el-container class="layout-container" style="height: 100vh">
      <Aside :siteTitle="siteTitle"></Aside>
      <el-container class="is-vertical">
        <Header></Header>
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

export default {
  name: 'Home',
  components: {Aside, Header},
  data() {
    return {
      siteTitle: "牛音",
      videoUrl: undefined,
    }
  },
  created() {
  },
  methods: {

  }

}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/styles/index.scss";

</style>
