<template>
  <!--  首页-->
  <div class="niuyin">
    <el-container class="layout-container" style="height: 100vh">
      <Aside :siteTitle="siteTitle"></Aside>
      <el-container class="is-vertical">
        <Header :user="user" :search-history="searchHistory"></Header>
        <el-main>
          <!--          路由-->
          <router-view/>
        </el-main>
<!--        <el-footer style="background-color: ghostwhite;">Footer</el-footer>-->
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Aside from "@/components/Aside.vue"
import Header from "@/components/Header.vue"
import {searchHistoryLoad} from '@/api/search'

export default {
  name: 'Home',
  components: {Aside, Header},
  data() {
    return {
      siteTitle: "牛音",
      user: {},
      videoUrl: undefined,
      searchHistory: [],
    }
  },
  created() {
    // 搜索记录
    this.getSearchHistory()
  },
  methods: {
    getSearchHistory() {
      searchHistoryLoad().then(res => {
        if (res.code === 200) {
          // console.log(res.data)
          this.searchHistory = res.data
        }
      })
    },
  }

}

</script>

<style lang='scss'>
//@import "~@/assets/styles/index.scss";
.niuyin {
  //background-image: url("../assets/images/bg.png");
  background-color: aliceblue
}

.el-footer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  right: 20px;
}

</style>
