<template>
  <!--  侧边栏-->
  <el-aside width="160px">
    <el-scrollbar>
      <!-- logo -->
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
      <div class="tabs-area">
        <ul class="tab-top">
          <li class="tab-top-item"
              v-for="(item, i) in tabsTopList"
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
        <!-- 分隔符 -->
        <el-divider>
          <i class="iconfont icon-divider"></i>
        </el-divider>
        <ul class="tab-center">
          <li class="tab-center-item"
              v-for="(item, i) in tabsCenterList"
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
        <!-- 分隔符 -->
        <el-divider>
          <i class="iconfont icon-divider"></i>
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
      tabsTopList: [
        {id: 1, name: "首页", '--color': "blue", class: "icon-index", link: "/index"},
        {id: 2, name: "热门", '--color': "rgba(0,0,0,1)", class: "icon-hotVideo", link: "/hotVideo",},
        {id: 3, name: "关注", '--color': "black", class: "icon-follow", link: "/follow"},
        {id: 4, name: "频道", '--color': "black", class: "icon-channel", link: "/channel",},
      ],
      tabsCenterList: [
        {id: 1, name: "直播", '--color': "red", class: "icon-live", link: "/index"},
        {id: 2, name: "放映厅", '--color': "black", class: "icon-vs", link: "/hotVideo",},
        {id: 3, name: "知识", '--color': "black", class: "icon-knowledge", link: "/follow"},
        {id: 4, name: "游戏", '--color': "red", class: "icon-game", link: "/channel",},
        {id: 5, name: "娱乐", '--color': "red", class: "icon-entertainment", link: "/channel",},
        {id: 6, name: "音乐", '--color': "red", class: "icon-music", link: "/channel",},
        {id: 7, name: "二次元", '--color': "red", class: "icon-erciyuan", link: "/channel",},
        {id: 8, name: "美食", '--color': "red", class: "icon-food", link: "/channel",},
        {id: 9, name: "体育", '--color': "red", class: "icon-sport", link: "/channel",},
        {id: 10, name: "时尚", '--color': "red", class: "icon-fashin", link: "/channel",},
      ],
      tabsBottomList: [
        {id: 1, name: "商务合作", '--color': "red", class: "icon-index", link: "/index"},
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
}

.tab-top-item {
  width: 100%;
  margin: 0.3rem 0;
  text-align: left;
  font-size: 0.9rem;
  border-radius: 0.5rem;
}

.tab-center-item {
  width: 100%;
  margin: 0.3rem 0;
  text-align: left;
  font-size: 0.9rem;
  border-radius: 0.5rem;
}

.router-link {
  border-radius: 0.5rem;
  padding: 0.3rem 0;
  text-decoration: none;
  color: grey;
}

.tab_left_item2 {
  margin: 1px 1rem;
  display: flex;
  padding: 0.1rem 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all .3s ease-in;
}

.tab_left_item2:hover {
  background-color: rgba(37, 38, 50, .08);
}

.round {
  display: inline-block;
  width: 36px;
  height: 36px;
  line-height: 36px;
}

.round i {
  border-radius: 50%;
  padding: 5px;
  font-size: 20px;
}

</style>
