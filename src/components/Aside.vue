<template>
  <!--  侧边栏-->
  <el-aside width="160px">
    <el-scrollbar>
      <div style="width:100%;overflow:hidden;height: 60px;text-align: center">
        <router-link
            style="display:flex;justify-content: center;align-items: center;width: 100%;height: 100%;text-decoration: none"
            class="link-type"
            :to="'/index'">
          <img style="width: 32px;height: 32px;display: inline-block"
               src="@/assets/logo/logo-tiktok.png">
          <span style="display:inline-block;line-height: 60px;height: 60px">牛音</span>
        </router-link>
      </div>
      <!-- tab栏区域 -->
      <div class="tab_main">
        <ul>
          <li class="tab_left_item"
              v-for="(item, i) in tabsLeftList"
              :key="i">
            <router-link class="router-link"
                         active-class="router-is-focus"
                         :to="item.link">
              <div class="tab_left_item2">
                <div class="round">
                  <i class="iconfont" :class="item.class" :style="item"></i>
                </div>
                <span>{{ item.name }}</span>
              </div>
            </router-link>
          </li>
        </ul>
        <el-divider>
          <el-icon><star-filled /></el-icon>
        </el-divider>
      </div>
    </el-scrollbar>
  </el-aside>
</template>

<script>
import {Message} from "@element-plus/icons-vue";

export default {
  name: "Aside",
  components: {Message},
  props: {
    siteTitle: String,
  },
  data() {
    return {
      tabsLeftList: [
        {id: 1, name: "首页", background: "#ff5c7c", link: "/index"},
        {id: 2, name: "热门", background: "#73c9e5", link: "/hotVideo",},
        {id: 3, name: "关注", background: "#ff716d", link: "/follow"},
        {id: 4, name: "频道", background: "#6dc781", link: "/channel",},
      ],
    }
  },
  methods: {
    handleSelect(index) {
      // console.log(this.$router.options.routes)
    }
  }
}
</script>

<style>
.el-aside {
  background-color: aliceblue
}

.tab_left_item {
  width: 100%;
  margin: 10px 0;
  text-align: center;
  font-size: 0.9rem;
  border-radius: 0.5rem;
}

.router-link {
  border-radius: 0.5rem;
  padding: 0.5rem 0;
  text-decoration: none;
  color: grey;
}

.tab_left_item2 {
  margin: 1px 1rem;
  display: flex;
  padding: 0.2rem 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all .3s ease-in;
}

.tab_left_item2:hover {
  /*backdrop-filter: blur(10px);*/
  background-color: rgba(37, 38, 50, .08);
}

.round {
  display: inline-block;
  width: 36px;
  height: 36px;
  line-height: 36px;
}

.round i {
  color: #fff;
  border-radius: 50%;
  padding: 5px;
  font-size: 20px;
}

</style>
