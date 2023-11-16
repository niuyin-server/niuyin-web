<template>
  <!--  导航栏-->
  <el-header class="niuyin-header backdrop-filter">
    <div class="nav-left"></div>
    <!-- 导航栏中间区域 -->
    <NavCenter/>
    <!-- 导航栏右侧区域 -->
    <NavRight :user="user" @darkChangeEmit="emitDarkChange"/>
  </el-header>
</template>

<script>
import NavCenter from "@/components/nav/NavCenter.vue"
import NavRight from "@/components/nav/NavRight.vue";
import {getInfo} from "@/api/member.js";
import {userInfoX} from "@/store/userInfoX";

export default {
  name: "Header",
  computed: {},
  components: {NavCenter, NavRight},
  props: {},
  data() {
    return {
      user: userInfoX().userInfo,
    }
  },
  created() {
    this.getUserInfo()
  },
  emits: ['themeChangeEmit'],
  methods: {
    // 获取用户信息
    getUserInfo() {
      getInfo().then(res => {
        if (res.code === 200) {
          this.user = res.data
          userInfoX().setUserInfo(res.data)
        }
      })
    },
    // 换肤事件
    emitDarkChange(dark) {
      this.$emit('themeChangeEmit', dark)
    }
  },
}
</script>

<style>
@import "@/assets/styles/header.scss";
</style>
